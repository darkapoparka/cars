import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { nativeFixture } from './test-fixtures/native-source.mjs';
import { refreshClient } from './refresh-client.mjs';
import { packageDealer } from './package-dealer.mjs';
import { verifyPackage } from './export-dealer.mjs';
import { fingerprint, sha256, POLICY } from './lib/workflow.mjs';

function fixture(t, middle = 'modern') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-native-refresh-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const f = nativeFixture(path.join(root, 'clients/fixture'), middle, 'fixture');
  const put = (name, data) => { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data, null, 2)); };
  const lock = { templates: {} }, overlay = { schemaVersion: 1, dealerId: 'fixture', templateRevisions: f.manifest.templateRevisions,
    files: [], assets: [], catalogs: {}, review: { status: 'passed', locales: ['en', 'bg'], evidenceSha256: '8'.repeat(64) } };
  for (const { key } of f.manifest.variants) {
    fs.cpSync(path.join(f.source, key), path.join(root, 'templates', key), { recursive: true });
    lock.templates[key] = { ...f.releases[key], snapshotPath: `templates/${key}`, exportPolicy: POLICY };
    const target = `${key}/localization/dealer.json`, source = `localization/dealer-files/${key}/dealer.json`;
    const bytes = Buffer.from(JSON.stringify({ identity: 'Preserved Fixture Dealer', inventoryCurrency: 'AED' }));
    put(`clients/fixture/${source}`, bytes);
    overlay.files.push({ path: target, source, sha256: sha256(bytes), templateSha256: null, reason: 'Synthetic reviewed dealer data, not an application acceptance claim' });
    overlay.catalogs[key] = f.releases[key].qa.nativeLocalization.catalogs;
    put(`clients/fixture/${key}/${key === 'modern' ? 'apps/web/public' : 'static'}/dealer/approved-logo.webp`, Buffer.from([82, 73, 70, 70, 0, 90, 18]));
  }
  put('templates.lock.json', lock);
  put('docs/DEPLOYMENT-INVENTORY.json', { dealers: [{ slug: 'fixture', sourceOwnership: 'cars-canonical', repository: f.manifest.repository, delivery: {projectId: 'prj_fixture', url: 'https://fixture.example/'} }] });
  put('clients/fixture/localization/dealer-overlay.json', overlay);
  put('clients/fixture/business-facts.json', { name: 'Preserved Fixture Dealer', currency: 'AED', phone: '+971000000000' });
  put('scripts/fixture.mjs', '// Isolated workflow fingerprint fixture, not a template acceptance claim.');
  const state = { head: 'd'.repeat(40), dirty: '', workflowDirty: '' };
  const readGit = (_root, args) => args[0] === 'branch' ? 'main' : args[0] === 'rev-parse' ? state.head : args[0] === 'status' ? (args.at(-1) === 'scripts' ? state.workflowDirty : state.dirty) : (() => { throw new Error(`Unexpected Git command ${args}`); })();
  const rollbackReceipt = {schemaVersion: 1, repository: f.manifest.repository, projectId: 'prj_fixture', publicAlias: 'https://fixture.example/', deploymentId: 'dpl_fixture', sourceCommit: 'a'.repeat(40), state: 'READY', verifiedAt: new Date().toISOString(), evidenceSha256: 'b'.repeat(64)};
  const run = options => refreshClient({ root, slug: 'fixture', localeConfig: f.manifest.localization, readGit, rollbackReceipt, ...options });
  return { root, f, put, overlay, lock, state, run };
}
for (const middle of ['modern', 'import']) test(`existing ${middle} trio native refresh installs real package, preserves data/assets and is idempotent`, async t => {
  const x = fixture(t, middle), snapshots = fingerprint(path.join(x.root, 'templates'));
  const facts = fs.readFileSync(path.join(x.f.source, 'business-facts.json'));
  const plan = await x.run(); assert.equal(plan.readyToPublish, false);
  assert.equal(fs.existsSync(path.join(x.f.source, 'localization/adoption.json')), false);
  const result = await x.run({ write: true }); assert.equal(result.written, true);
  assert.equal(result.state, 'needs-dealer-build-and-public-QA');
  assert.equal(fs.readFileSync(path.join(x.f.source, 'business-facts.json')).equals(facts), true);
  assert.deepEqual(fingerprint(path.join(x.root, 'templates')), snapshots);
  for (const { key } of x.f.manifest.variants) {
    const prefix = key === 'modern' ? 'apps/web/public' : 'static';
    assert.equal(fs.readFileSync(path.join(x.f.source, key, prefix, 'dealer/approved-logo.webp')).at(-1), 18);
    assert.equal(JSON.parse(fs.readFileSync(path.join(x.f.source, key, 'localization/dealer.json'))).identity, 'Preserved Fixture Dealer');
  }
  const second = await x.run({ write: true }); assert.equal(second.noOp, true);
  const manifest = JSON.parse(fs.readFileSync(path.join(x.f.source, 'dealer.json')));
  const destination = path.join(x.root, 'publishable-package');
  await packageDealer({ source: x.f.source, destination, manifest, sourceCommit: x.state.head });
  assert.equal(verifyPackage(destination).digest, result.candidateDigest);
  assert.ok(fs.existsSync(path.join(result.runDir, 'rollback.json')));
});
test('native refresh refuses to turn incomplete dealer copy into acceptance', async t => {
  const x = fixture(t), before = fingerprint(x.f.source);
  x.overlay.review.locales = ['en']; x.put('clients/fixture/localization/dealer-overlay.json', x.overlay);
  await assert.rejects(x.run({ write: true }), /reviewed EN\/BG/);
  assert.ok(!fs.existsSync(path.join(x.f.source, 'localization/adoption.json')));
  x.overlay.review.locales = ['en', 'bg']; x.overlay.files[0].path = 'auto-best/src/routes/+page.svelte';
  x.put('clients/fixture/localization/dealer-overlay.json', x.overlay);
  await assert.rejects(x.run(), /Unsupported/);
});
for (const [name, mutate, expected] of [
  ['workflow', x => x.put('scripts/fixture.mjs', '// competing workflow edit'), /workflow changed/],
  ['source', x => x.put('clients/fixture/business-facts.json', 'competing source'), /source changed/],
  ['release', x => { x.lock.templates.modern.qa.nativeLocalization.checks[0].status = 'failed'; x.put('templates.lock.json', x.lock); }, /release changed/],
  ['candidate', (x, plan) => fs.appendFileSync(path.join(plan.candidate, 'modern/apps/web/proxy.ts'), '// changed'), /payload changed/],
  ['main', x => { x.state.head = 'e'.repeat(40); }, /main changed/]
]) test(`native refresh refuses a concurrent ${name} modification before installation`, async t => {
  const x = fixture(t);
  await assert.rejects(x.run({ write: true, beforeInstall: plan => mutate(x, plan) }), expected);
  assert.ok(!fs.existsSync(path.join(x.f.source, 'localization/adoption.json')));
});
test('native refresh cannot displace a dirty source, occupied lock or independent dealer', async t => {
  const x = fixture(t); x.state.dirty = ' M source.ts';
  await assert.rejects(x.run({ write: true }), /dirty before/); x.state.dirty = '';
  const lock = path.join(x.root, 'runtime/client-refresh/fixture/.native-write-lock'); fs.mkdirSync(lock, { recursive: true });
  await assert.rejects(x.run({ write: true }), /EEXIST/); assert.ok(fs.existsSync(lock));
  x.put('docs/DEPLOYMENT-INVENTORY.json', { dealers: [{ slug: 'fixture', sourceOwnership: 'independent-repository', repository: x.f.manifest.repository }] });
  await assert.rejects(x.run(), /Cars-canonical/);
});
test('native refresh restores its own partial writes and preserves a competing writer', async t => {
  const x = fixture(t), before = fingerprint(x.f.source);
  await assert.rejects(x.run({ write: true, afterWrite: () => { throw new Error('injected write failure'); } }), /injected write failure/);
  assert.deepEqual(fingerprint(x.f.source), before);
  let changed;
  await assert.rejects(x.run({ write: true, afterWrite: change => {
    changed = change.path; fs.writeFileSync(path.join(x.f.source, changed), 'competing writer'); throw new Error('interleaved write');
  } }), /preserved competing writes/);
  assert.equal(fs.readFileSync(path.join(x.f.source, changed), 'utf8'), 'competing writer');
});
test('native refresh never silently replaces dealer logos or template hero artwork', async t => {
  const x = fixture(t), name = 'auto-best/static/images/hero.webp';
  x.put('clients/fixture/' + name, Buffer.from([82, 73, 70, 70, 0, 99]));
  await assert.rejects(x.run(), /asset conflict/);
  x.overlay.assets = [{ path: name, beforeSha256: sha256(fs.readFileSync(path.join(x.f.source, name))),
    templateSha256: sha256(fs.readFileSync(path.join(x.root, 'templates/auto-best/static/images/hero.webp'))), keep: 'dealer', reason: 'Fixture conflict' }];
  x.put('clients/fixture/localization/dealer-overlay.json', x.overlay);
  await assert.rejects(x.run(), /artwork cannot be overridden/);
  x.overlay.assets[0].keep = 'template'; x.put('clients/fixture/localization/dealer-overlay.json', x.overlay);
  const plan = await x.run(); assert.ok(plan.changes.some(change => change.path === name));
});

test('native refresh cannot write without fresh exact rollback deployment and alias proof', async t => {
  const x = fixture(t);
  await assert.rejects(x.run({ write: true, rollbackReceipt: undefined }), /rollback source\/deployment/);
  const receipt = {schemaVersion: 1, repository: x.f.manifest.repository, projectId: 'prj_wrong', publicAlias: 'https://fixture.example/', deploymentId: 'dpl_fixture', sourceCommit: 'a'.repeat(40), state: 'READY', verifiedAt: new Date().toISOString(), evidenceSha256: 'b'.repeat(64)};
  await assert.rejects(x.run({ write: true, rollbackReceipt: receipt }), /registered dealer/);
  receipt.projectId = 'prj_fixture'; receipt.verifiedAt = '2020-01-01T00:00:00Z';
  await assert.rejects(x.run({ write: true, rollbackReceipt: receipt }), /before writing/);
  assert.ok(!fs.existsSync(path.join(x.f.source, 'localization/adoption.json')));
});

test('native refresh requires committed workflow inputs and preserves workflow edits made during installation', async t => {
  const x = fixture(t), before = fingerprint(x.f.source);
  x.state.workflowDirty = ' M scripts/package-dealer.mjs';
  await assert.rejects(x.run({ write: true }), /workflow inputs are uncommitted/);
  x.state.workflowDirty = '';
  await assert.rejects(x.run({ write: true, afterWrite: () => x.put('scripts/fixture.mjs', '// competing workflow edit') }), /workflow changed/);
  assert.deepEqual(fingerprint(x.f.source), before);
  assert.equal(fs.readFileSync(path.join(x.root, 'scripts/fixture.mjs'), 'utf8'), '// competing workflow edit');
});
