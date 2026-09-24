import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { installUpgrade, materializeUpgradeCandidate, planDealerUpgrade, planThreeWayUpgrade, rollbackUpgrade, selectPinnedRevisions, updateManifestPins, upgradeReviewReport, writeCandidateTree } from './three-way-upgrade.mjs';

const bytes = value => Buffer.from(value);
const map = entries => new Map(Object.entries(entries).map(([name, value]) => [name, Buffer.isBuffer(value) ? value : bytes(value)]));
const readTree = root => {
  const result = new Map();
  const walk = (directory, prefix = '') => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const name = prefix ? `${prefix}/${entry.name}` : entry.name;
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(target, name);
      else if (entry.isFile()) result.set(name, fs.readFileSync(target));
    }
  };
  walk(root);
  return result;
};
const fixture = t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-explicit-upgrade-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
};

test('three-way update takes new UI, keeps dealer-only inventory and merges non-overlapping custom code', () => {
  const oldBase = map({
    'src/lib/components/hero.svelte': '<h1>Old hero</h1>\n<section>existing content</section>\n<p>Cars</p>\n',
    'src/lib/data/inventory.json': '{"vehicles":["base-car"]}\n',
    'src/lib/components/dealer-badge.svelte': '<a>Dealer badge</a>\n'
  });
  const newBase = map({
    'src/lib/components/hero.svelte': '<h1>New hero</h1>\n<section>existing content</section>\n<p>Cars</p>\n',
    'src/lib/data/inventory.json': '{"vehicles":["base-car"]}\n',
    'src/lib/components/dealer-badge.svelte': '<a>Dealer badge</a>\n'
  });
  const dealer = map({
    'src/lib/components/hero.svelte': '<h1>Old hero</h1>\n<section>existing content</section>\n<p>Dealer pickup</p>\n',
    'src/lib/data/inventory.json': '{"vehicles":["verified-car"]}\n',
    'src/lib/components/dealer-badge.svelte': '<a>Dealer badge</a><span>Approved custom CTA</span>\n'
  });
  const plan = planThreeWayUpgrade({ oldBase, newBase, dealer });
  assert.equal(plan.ready, true);
  assert.equal(plan.summary.autoMerged, 1);
  assert.equal(plan.candidate.get('src/lib/components/hero.svelte').toString(), '<h1>New hero</h1>\n<section>existing content</section>\n<p>Dealer pickup</p>\n');
  assert.equal(plan.candidate.get('src/lib/data/inventory.json').toString(), '{"vehicles":["verified-car"]}\n');
  assert.match(plan.changes.find(item => item.path.endsWith('hero.svelte')).diff, /New hero/);
});

test('same-path binary dealer asset conflict is explicit and a dealer resolution preserves exact bytes', () => {
  const oldLogo = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x01, 0x02]);
  const dealerLogo = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x03, 0x04]);
  const newLogo = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x05, 0x06]);
  const oldBase = map({ 'static/dealer/logo.png': oldLogo });
  const newBase = map({ 'static/dealer/logo.png': newLogo });
  const dealer = map({ 'static/dealer/logo.png': dealerLogo });
  const blocked = planThreeWayUpgrade({ oldBase, newBase, dealer });
  assert.equal(blocked.ready, false);
  assert.equal(blocked.conflicts[0].kind, 'binary-merge-conflict');
  const resolved = planThreeWayUpgrade({ oldBase, newBase, dealer, resolutions: { 'static/dealer/logo.png': 'dealer' } });
  assert.equal(resolved.ready, true);
  assert.deepEqual(resolved.candidate.get('static/dealer/logo.png'), dealerLogo);
});

test('overlapping custom code edits block readiness and include merge markers for review', () => {
  const file = 'src/lib/components/contact.svelte';
  const plan = planThreeWayUpgrade({
    oldBase: map({ [file]: '<p>Call us</p>\n' }),
    newBase: map({ [file]: '<p>Contact our team</p>\n' }),
    dealer: map({ [file]: '<p>WhatsApp the dealer</p>\n' })
  });
  assert.equal(plan.ready, false);
  assert.equal(plan.conflicts[0].kind, 'text-merge-conflict');
  assert.match(plan.conflicts[0].conflictPreview, /<<<<<<< dealer/);
});

test('multiple merge conflict hunks are classified as conflicts even when git returns a count above one', () => {
  const file = 'src/lib/components/contact.svelte';
  const middle = Array.from({ length: 12 }, (_, index) => `stable-${index}`).join('\n');
  const plan = planThreeWayUpgrade({
    oldBase: map({ [file]: `Dealer\n${middle}\nContact\n` }),
    newBase: map({ [file]: `Template dealer\n${middle}\nContact our team\n` }),
    dealer: map({ [file]: `Custom dealer\n${middle}\nMessage us\n` })
  });
  assert.equal(plan.ready, false);
  assert.equal(plan.conflicts[0].kind, 'text-merge-conflict');
  assert.match(plan.conflicts[0].conflictPreview, /<<<<<<< dealer/);
  assert.match(plan.conflicts[0].conflictPreview, />>>>>>> new-template/);
});

test('reviewed manual text resolution is used for an overlapping custom code change', () => {
  const file = 'src/lib/components/contact.svelte';
  const resolution = '<p>Call or message our team</p>\n';
  const plan = planThreeWayUpgrade({
    oldBase: map({ [file]: '<p>Call us</p>\n' }),
    newBase: map({ [file]: '<p>Contact our team</p>\n' }),
    dealer: map({ [file]: '<p>WhatsApp the dealer</p>\n' }),
    resolutions: { [file]: bytes(resolution) }
  });
  assert.equal(plan.ready, true);
  assert.equal(plan.changes[0].kind, 'resolved-manual');
  assert.equal(plan.candidate.get(file).toString(), resolution);
});

test('review report is JSON-safe and includes both sides of unresolved conflicts', () => {
  const file = 'src/lib/components/contact.svelte';
  const plan = planThreeWayUpgrade({
    oldBase: map({ [file]: '<p>Call us</p>\n' }),
    newBase: map({ [file]: '<p>Contact our team</p>\n' }),
    dealer: map({ [file]: '<p>WhatsApp the dealer</p>\n' })
  });
  const report = JSON.parse(JSON.stringify(upgradeReviewReport(plan)));
  assert.equal(report.ready, false);
  assert.equal(report.conflicts[0].path, file);
  assert.match(report.conflicts[0].dealerDiff, /WhatsApp/);
  assert.match(report.conflicts[0].templateDiff, /Contact our team/);
});

test('dealer deletion versus a changed template file is an explicit conflict', () => {
  const file = 'src/lib/components/old-section.svelte';
  const plan = planThreeWayUpgrade({
    oldBase: map({ [file]: '<section>Old</section>\n' }),
    newBase: map({ [file]: '<section>Improved</section>\n' }),
    dealer: new Map()
  });
  assert.equal(plan.ready, false);
  assert.equal(plan.conflicts[0].kind, 'dealer-delete-vs-template-edit');
});

test('installer rejects a candidate that still contains a planned deleted file', t => {
  const root = fixture(t), source = path.join(root, 'dealer'), runDir = path.join(root, 'run');
  fs.mkdirSync(source); fs.mkdirSync(runDir);
  fs.writeFileSync(path.join(source, 'retired.ts'), 'export const retired = true;\n');
  const plan = planThreeWayUpgrade({
    oldBase: map({ 'retired.ts': 'export const retired = true;\n' }),
    newBase: new Map(),
    dealer: map({ 'retired.ts': 'export const retired = true;\n' })
  });
  assert.equal(plan.ready, true);
  assert.equal(plan.changes[0].afterSha256, null);
  const candidate = path.join(runDir, 'candidate');
  fs.mkdirSync(candidate);
  fs.writeFileSync(path.join(candidate, 'retired.ts'), 'export const retired = true;\n');
  assert.throws(() => installUpgrade({ source, plan, runDir, candidateDirectory: candidate }), /still contains a planned deletion/);
  assert.equal(fs.readFileSync(path.join(source, 'retired.ts'), 'utf8'), 'export const retired = true;\n');
});

test('candidate materialization keeps dealer root content and leaves its checkout untouched before preview', t => {
  const root = fixture(t), source = path.join(root, 'dealer'), runDir = path.join(root, 'run');
  const candidate = path.join(runDir, 'candidate');
  fs.mkdirSync(source); fs.mkdirSync(runDir);
  fs.writeFileSync(path.join(source, 'dealer.json'), '{"version":1}\n');
  fs.writeFileSync(path.join(source, 'business-facts.json'), '{"name":"Dealer"}\n');
  fs.writeFileSync(path.join(source, '.env.local'), 'PRIVATE_TOKEN=must-not-enter-candidate\n');
  fs.mkdirSync(path.join(source, 'auto-best/src'), { recursive: true });
  fs.mkdirSync(path.join(source, 'auto-best/node_modules'), { recursive: true });
  fs.writeFileSync(path.join(source, 'auto-best/package.json'), '{"scripts":{"build":"vite build"}}\n');
  fs.writeFileSync(path.join(source, 'auto-best/src/ui.ts'), 'export const ui = "template-old";\n');
  fs.writeFileSync(path.join(source, 'auto-best/src/custom.ts'), 'export const note = "dealer-only";\n');
  fs.writeFileSync(path.join(source, 'auto-best/node_modules/ignored.js'), 'generated dependency');
  const plan = planThreeWayUpgrade({
    oldBase: map({
      'auto-best/src/ui.ts': 'export const ui = "template-old";\n',
      'auto-best/src/custom.ts': 'export const note = "base";\n'
    }),
    newBase: map({
      'auto-best/src/ui.ts': 'export const ui = "template-new";\n',
      'auto-best/src/custom.ts': 'export const note = "base";\n'
    }),
    dealer: map({
      'auto-best/src/ui.ts': 'export const ui = "template-old";\n',
      'auto-best/src/custom.ts': 'export const note = "dealer-only";\n'
    })
  });
  const sourceBefore = fs.readFileSync(path.join(source, 'auto-best/src/ui.ts'));
  materializeUpgradeCandidate({ source, plan, destination: candidate });
  assert.deepEqual(fs.readFileSync(path.join(source, 'auto-best/src/ui.ts')), sourceBefore);
  assert.equal(fs.readFileSync(path.join(candidate, 'business-facts.json'), 'utf8'), '{"name":"Dealer"}\n');
  assert.equal(fs.readFileSync(path.join(candidate, 'auto-best/src/ui.ts'), 'utf8'), 'export const ui = "template-new";\n');
  assert.equal(fs.readFileSync(path.join(candidate, 'auto-best/src/custom.ts'), 'utf8'), 'export const note = "dealer-only";\n');
  assert.equal(fs.existsSync(path.join(candidate, 'auto-best/node_modules')), false);
  assert.equal(fs.existsSync(path.join(candidate, '.env.local')), false);
  const installed = installUpgrade({ source, plan, runDir, candidateDirectory: candidate });
  assert.deepEqual(fs.readFileSync(path.join(source, 'auto-best/src/ui.ts')), Buffer.from('export const ui = "template-new";\n'));
  assert.deepEqual(fs.readFileSync(path.join(source, 'auto-best/src/custom.ts')), Buffer.from('export const note = "dealer-only";\n'));
  assert.ok(installed.sourceAfterSha256);
});

test('candidate materialization rejects a destination inside or enclosing the dealer checkout', t => {
  const root = fixture(t), source = path.join(root, 'dealer');
  fs.mkdirSync(path.join(source, 'src'), { recursive: true });
  fs.writeFileSync(path.join(source, 'src', 'dealer.ts'), 'export const dealer = true;\n');
  const plan = planThreeWayUpgrade({ oldBase: new Map(), newBase: new Map(), dealer: new Map() });
  assert.equal(plan.ready, true);
  assert.throws(() => materializeUpgradeCandidate({
    source,
    plan,
    destination: path.join(source, '.preview-candidate')
  }), /Candidate destination must stay outside the dealer source checkout/);
  assert.throws(() => materializeUpgradeCandidate({
    source,
    plan,
    destination: root
  }), /Candidate destination must stay outside the dealer source checkout/);
  assert.equal(fs.existsSync(path.join(source, '.preview-candidate')), false);
  assert.equal(fs.readFileSync(path.join(source, 'src', 'dealer.ts'), 'utf8'), 'export const dealer = true;\n');
});

test('installer creates a byte rollback and restores its own partial writes', t => {
  const root = fixture(t), source = path.join(root, 'dealer'), runDir = path.join(root, 'run');
  fs.mkdirSync(source); fs.mkdirSync(runDir);
  fs.writeFileSync(path.join(source, 'dealer.json'), '{"version":1}\n');
  fs.mkdirSync(path.join(source, 'src'), { recursive: true });
  fs.writeFileSync(path.join(source, 'src/template.ts'), 'export const ui = "old";\n');
  const before = fs.readFileSync(path.join(source, 'dealer.json'));
  const plan = planThreeWayUpgrade({
    oldBase: map({ 'dealer.json': before, 'src/template.ts': 'export const ui = "old";\n' }),
    newBase: map({ 'dealer.json': '{"version":1}\n', 'src/template.ts': 'export const ui = "new";\n' }),
    dealer: map({ 'dealer.json': before, 'src/template.ts': 'export const ui = "old";\n' })
  });
  assert.throws(() => installUpgrade({ source, plan, runDir, afterWrite: () => { throw new Error('injected failure'); } }), /injected failure/);
  assert.deepEqual(fs.readFileSync(path.join(source, 'dealer.json')), before);
  assert.equal(fs.existsSync(path.join(runDir, 'rollback.json')), false);
  const attemptsAfterFailure = fs.readdirSync(path.join(runDir, 'rollback-attempts'));
  assert.equal(attemptsAfterFailure.length, 1);
  const failedAttemptBackup = path.join(runDir, 'rollback-attempts', attemptsAfterFailure[0], 'src/template.ts');
  const failedAttemptBytes = fs.readFileSync(failedAttemptBackup);
  const installed = installUpgrade({ source, plan, runDir });
  assert.equal(fs.readFileSync(path.join(source, 'src/template.ts'), 'utf8'), 'export const ui = "new";\n');
  assert.notEqual(installed.rollbackDirectory, path.dirname(path.dirname(failedAttemptBackup)));
  assert.deepEqual(fs.readFileSync(failedAttemptBackup), failedAttemptBytes);
  assert.deepEqual(fs.readFileSync(path.join(installed.rollbackDirectory, 'src/template.ts')), bytes('export const ui = "old";\n'));
  assert.equal(installed.noOp, false);
  const backupBeforeRetry = fs.readFileSync(path.join(installed.rollbackDirectory, 'src/template.ts'));
  const retried = installUpgrade({ source, plan, runDir });
  assert.equal(retried.noOp, true);
  assert.equal(retried.rollbackDirectory, installed.rollbackDirectory);
  assert.deepEqual(fs.readFileSync(path.join(installed.rollbackDirectory, 'src/template.ts')), backupBeforeRetry);
  const rolledBack = rollbackUpgrade({ source, receiptPath: path.join(runDir, 'rollback.json') });
  assert.ok(rolledBack.rolledBackAt);
  assert.equal(fs.readFileSync(path.join(source, 'src/template.ts'), 'utf8'), 'export const ui = "old";\n');
});

test('installer keeps the dealer file intact when staging a replacement fails after a partial temp write', t => {
  const root = fixture(t), source = path.join(root, 'dealer'), runDir = path.join(root, 'run');
  fs.mkdirSync(path.join(source, 'src'), { recursive: true });
  fs.mkdirSync(runDir);
  const before = 'export const ui = "old";\n';
  const after = 'export const ui = "new";\n';
  const target = path.join(source, 'src/template.ts');
  fs.writeFileSync(target, before);
  const plan = planThreeWayUpgrade({
    oldBase: map({ 'src/template.ts': before }),
    newBase: map({ 'src/template.ts': after }),
    dealer: map({ 'src/template.ts': before })
  });
  const candidate = path.join(runDir, 'candidate');
  fs.mkdirSync(path.join(candidate, 'src'), { recursive: true });
  fs.writeFileSync(path.join(candidate, 'src/template.ts'), after);

  const originalWrite = fs.writeFileSync;
  let injected = false;
  fs.writeFileSync = function (file, data, ...options) {
    if (!injected && String(file).includes('.cars-upgrade-')) {
      injected = true;
      originalWrite.call(fs, file, Buffer.from(data).subarray(0, 8), ...options);
      throw new Error('simulated storage failure during staged write');
    }
    return originalWrite.call(fs, file, data, ...options);
  };
  try {
    assert.throws(() => installUpgrade({ source, plan, runDir, candidateDirectory: candidate }), /simulated storage failure/);
  } finally {
    fs.writeFileSync = originalWrite;
  }

  assert.equal(injected, true);
  assert.equal(fs.readFileSync(target, 'utf8'), before);
  assert.deepEqual(fs.readdirSync(path.dirname(target)).filter(name => name.includes('.cars-upgrade-')), []);
});

test('installer preserves an interleaved external edit and rolls back its earlier writes', t => {
  const root = fixture(t), source = path.join(root, 'dealer'), runDir = path.join(root, 'run');
  fs.mkdirSync(source); fs.mkdirSync(runDir);
  fs.writeFileSync(path.join(source, 'a.ts'), 'export const a = "old";\n');
  fs.writeFileSync(path.join(source, 'z.ts'), 'export const z = "old";\n');
  const plan = planThreeWayUpgrade({
    oldBase: map({ 'a.ts': 'export const a = "old";\n', 'z.ts': 'export const z = "old";\n' }),
    newBase: map({ 'a.ts': 'export const a = "new";\n', 'z.ts': 'export const z = "new";\n' }),
    dealer: map({ 'a.ts': 'export const a = "old";\n', 'z.ts': 'export const z = "old";\n' })
  });
  assert.throws(() => installUpgrade({
    source, plan, runDir,
    beforeWrite: () => fs.writeFileSync(path.join(source, 'z.ts'), 'export const z = "external";\n')
  }), /Source changed after review/);
  assert.equal(fs.readFileSync(path.join(source, 'a.ts'), 'utf8'), 'export const a = "old";\n');
  assert.equal(fs.readFileSync(path.join(source, 'z.ts'), 'utf8'), 'export const z = "external";\n');
});

test('explicit rollback refuses to overwrite a later dealer edit', t => {
  const root = fixture(t), source = path.join(root, 'dealer'), runDir = path.join(root, 'run');
  fs.mkdirSync(source); fs.mkdirSync(runDir);
  fs.writeFileSync(path.join(source, 'ui.ts'), 'export const ui = "old";\n');
  const plan = planThreeWayUpgrade({
    oldBase: map({ 'ui.ts': 'export const ui = "old";\n' }),
    newBase: map({ 'ui.ts': 'export const ui = "new";\n' }),
    dealer: map({ 'ui.ts': 'export const ui = "old";\n' })
  });
  installUpgrade({ source, plan, runDir });
  fs.writeFileSync(path.join(source, 'ui.ts'), 'export const ui = "post-update edit";\n');
  assert.throws(() => rollbackUpgrade({ source, receiptPath: path.join(runDir, 'rollback.json') }), /preserve concurrent edit/);
  assert.equal(fs.readFileSync(path.join(source, 'ui.ts'), 'utf8'), 'export const ui = "post-update edit";\n');
});

test('installed pin becomes the next base, making a repeated update idempotent', t => {
  const root = fixture(t), source = path.join(root, 'dealer'), runDir = path.join(root, 'run');
  fs.mkdirSync(source); fs.mkdirSync(runDir);
  const oldBase = map({ 'src/ui.ts': 'export const version = 1;\n', 'stock.json': '{"id":"sample"}\n' });
  const newBase = map({ 'src/ui.ts': 'export const version = 2;\n', 'stock.json': '{"id":"sample"}\n' });
  const dealer = map({ 'src/ui.ts': 'export const version = 1;\n', 'stock.json': '{"id":"dealer-stock"}\n' });
  const first = planThreeWayUpgrade({ oldBase, newBase, dealer });
  writeCandidateTree(first, path.join(runDir, 'candidate-preview'));
  const afterInstallSource = path.join(root, 'after-install');
  fs.cpSync(path.join(runDir, 'candidate-preview'), afterInstallSource, { recursive: true });
  const repeat = planThreeWayUpgrade({ oldBase: newBase, newBase, dealer: readTree(afterInstallSource) });
  assert.equal(repeat.ready, true);
  assert.equal(repeat.changes.length, 0);
});

test('unsafe relative paths are rejected before candidate creation', () => {
  assert.throws(() => planThreeWayUpgrade({ oldBase: map({ '../outside': 'x' }), newBase: new Map(), dealer: new Map() }), /Unsafe upgrade path/);
});

test('target revisions come from approved immutable lock entries, never a floating latest label', () => {
  const keys = ['auto-best', 'modern', 'carwow'];
  const manifest = { variants: keys.map(key => ({ key })), templateRevisions: Object.fromEntries(keys.map(key => [key, 'a'.repeat(40)])) };
  const lock = { templates: Object.fromEntries(keys.map(key => [key, {
    status: 'approved', repository: `darkapoparka/cars-template-${key}`, commit: 'b'.repeat(40), digest: 'c'.repeat(64), snapshotPath: `templates/${key}`
  }])) };
  const pins = selectPinnedRevisions(manifest, lock);
  assert.equal(pins.modern.from, 'a'.repeat(40));
  assert.equal(pins.modern.to, 'b'.repeat(40));
  assert.equal(updateManifestPins(manifest, pins).templateRevisions.carwow, 'b'.repeat(40));
  lock.templates.modern.commit = 'main';
  assert.throws(() => selectPinnedRevisions(manifest, lock), /exact approved target pin/);
});

test('Cars monorepo target pins resolve only the matching committed template subtree', () => {
  const keys = ['auto-best', 'modern', 'carwow'];
  const manifest = {
    variants: keys.map(key => ({ key })),
    templateRevisions: Object.fromEntries(keys.map(key => [key, 'a'.repeat(40)])),
    templateSources: {
      modern: { repository: 'darkapoparka/cars', revision: 'a'.repeat(40), path: 'templates/modern', digest: 'd'.repeat(64) }
    }
  };
  const lock = { templates: Object.fromEntries(keys.map(key => [key, {
    status: 'approved',
    source: { repository: 'darkapoparka/cars', revision: 'b'.repeat(40), path: `templates/${key}` },
    digest: 'c'.repeat(64),
    snapshotPath: `templates/${key}`
  }])) };
  const pins = selectPinnedRevisions(manifest, lock);
  assert.equal(pins.modern.repository, 'darkapoparka/cars');
  assert.deepEqual(pins.modern.fromSource, {
    repository: 'darkapoparka/cars', revision: 'a'.repeat(40), path: 'templates/modern', digest: 'd'.repeat(64)
  });
  assert.equal(pins.modern.to, 'b'.repeat(40));
  assert.deepEqual(pins.modern.targetSource, {
    repository: 'darkapoparka/cars', revision: 'b'.repeat(40), path: 'templates/modern', digest: 'c'.repeat(64)
  });
  const next = updateManifestPins(manifest, pins);
  assert.equal(next.templateRevisions.modern, 'b'.repeat(40));
  assert.deepEqual(next.templateSources.modern, pins.modern.targetSource);
});

test('dealer update plans all three exact designs, preserves canonical stock and advances pins only in candidate', t => {
  const root = fixture(t), dealerRoot = path.join(root, 'dealer'), runDir = path.join(root, 'run');
  fs.mkdirSync(dealerRoot); fs.mkdirSync(runDir);
  const keys = ['auto-best', 'modern', 'carwow'];
  const from = 'a'.repeat(40), to = 'b'.repeat(40);
  const manifest = {
    schemaVersion: 1,
    slug: 'sample-dealer',
    variants: keys.map(key => ({ key })),
    templateRevisions: Object.fromEntries(keys.map(key => [key, from]))
  };
  fs.writeFileSync(path.join(dealerRoot, 'dealer.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(path.join(dealerRoot, 'business-facts.json'), '{"name":"Sample Dealer"}\n');
  fs.writeFileSync(path.join(dealerRoot, 'stock.json'), '{"listings":["dealer-car"]}\n');
  const lock = { templates: Object.fromEntries(keys.map(key => [key, {
    status: 'approved', repository: `darkapoparka/cars-template-${key}`, commit: to,
    digest: 'c'.repeat(64), snapshotPath: `templates/${key}`
  }])) };
  const oldBases = {}, newBases = {};
  for (const key of keys) {
    const base = map({
      'package.json': '{"name":"template"}\n',
      'src/ui.ts': 'export const title = "Template v1";\n',
      'src/inventory.json': '{"listings":["template-car"]}\n'
    });
    oldBases[key] = base;
    newBases[key] = map({
      'package.json': '{"name":"template"}\n',
      'src/ui.ts': 'export const title = "Template v2";\n',
      'src/inventory.json': '{"listings":["template-car"]}\n'
    });
    const design = path.join(dealerRoot, key);
    fs.mkdirSync(path.join(design, 'src'), { recursive: true });
    fs.writeFileSync(path.join(design, 'package.json'), '{"name":"dealer"}\n');
    fs.writeFileSync(path.join(design, 'src/ui.ts'), 'export const title = "Template v1";\n');
    fs.writeFileSync(path.join(design, 'src/inventory.json'), '{"listings":["dealer-car"]}\n');
  }
  const plan = planDealerUpgrade({ dealerRoot, lock, oldBases, newBases });
  assert.equal(plan.ready, true);
  assert.equal(plan.summary.designs, 3);
  assert.deepEqual(Object.values(plan.pins).map(pin => pin.from), [from, from, from]);
  assert.deepEqual(Object.values(plan.pins).map(pin => pin.to), [to, to, to]);
  const candidate = materializeUpgradeCandidate({ source: dealerRoot, plan, destination: path.join(runDir, 'candidate') });
  assert.equal(JSON.parse(fs.readFileSync(path.join(candidate, 'dealer.json'), 'utf8')).templateRevisions.modern, to);
  assert.equal(JSON.parse(fs.readFileSync(path.join(candidate, 'stock.json'), 'utf8')).listings[0], 'dealer-car');
  assert.equal(fs.readFileSync(path.join(candidate, 'modern/src/ui.ts'), 'utf8'), 'export const title = "Template v2";\n');
  assert.equal(JSON.parse(fs.readFileSync(path.join(candidate, 'modern/src/inventory.json'), 'utf8')).listings[0], 'dealer-car');
  assert.equal(JSON.parse(fs.readFileSync(path.join(dealerRoot, 'dealer.json'), 'utf8')).templateRevisions.modern, from);
  installUpgrade({ source: dealerRoot, plan, runDir, candidateDirectory: candidate });
  assert.equal(JSON.parse(fs.readFileSync(path.join(dealerRoot, 'dealer.json'), 'utf8')).templateRevisions.modern, to);
  assert.equal(fs.readFileSync(path.join(dealerRoot, 'modern/src/ui.ts'), 'utf8'), 'export const title = "Template v2";\n');
});


test('dealer upgrade reviews an exact packaging-v2 target manifest atomically', t => {
  const root = fixture(t), dealerRoot = path.join(root, 'dealer');
  fs.mkdirSync(dealerRoot);
  const keys = ['auto-best', 'modern', 'carwow'];
  const from = 'a'.repeat(40), to = 'b'.repeat(40);
  const variants = [
    { key: 'auto-best', entry: '/', base: '' },
    { key: 'modern', entry: '/variant-2/cars', base: '/variant-2' },
    { key: 'carwow', entry: '/variant-3/', base: '/variant-3' }
  ];
  const manifest = { schemaVersion: 1, slug: 'native-target', repository: 'darkapoparka/cars-native-target', variants, packaging: { version: '1' }, templateRevisions: Object.fromEntries(keys.map(key => [key, from])) };
  fs.writeFileSync(path.join(dealerRoot, 'dealer.json'), JSON.stringify(manifest, null, 2) + '\n');
  const lock = { templates: Object.fromEntries(keys.map(key => [key, { status: 'approved', repository: `darkapoparka/cars-template-${key}`, commit: to, digest: 'c'.repeat(64) }])) };
  const bases = Object.fromEntries(keys.map(key => [key, map({ 'package.json': '{"name":"template"}\n', 'src/ui.ts': 'export const title = "v1";\n' })]));
  for (const key of keys) { const design=path.join(dealerRoot,key,'src'); fs.mkdirSync(design,{recursive:true}); fs.writeFileSync(path.join(dealerRoot,key,'package.json'),'{"name":"dealer"}\n'); fs.writeFileSync(path.join(design,'ui.ts'),'export const title = "v1";\n'); }
  const pins=selectPinnedRevisions(manifest,lock);
  const targetManifest={ ...updateManifestPins(manifest,pins), dealerId:'native-target', packaging:{version:'2'}, localization:{schemaVersion:1,dealerId:'native-target',defaultLocale:'bg',enabledLocales:['en','bg'],dealerCountry:'BG',inventoryCurrency:'EUR'} };
  const plan=planDealerUpgrade({dealerRoot,lock,oldBases:bases,newBases:bases,targetManifest});
  assert.equal(plan.ready,true);
  const candidate=materializeUpgradeCandidate({source:dealerRoot,plan,destination:path.join(root,'candidate')});
  const saved=JSON.parse(fs.readFileSync(path.join(candidate,'dealer.json'),'utf8'));
  assert.equal(saved.packaging.version,'2');
  assert.equal(saved.localization.dealerCountry,'BG');
  assert.equal(JSON.parse(fs.readFileSync(path.join(dealerRoot,'dealer.json'),'utf8')).packaging.version,'1');
});
