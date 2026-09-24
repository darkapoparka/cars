import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { fingerprint } from '../lib/workflow.mjs';
import { applyMounts } from '../publishing/mounts.mjs';
import { targetManifestForUpgrade } from './update-dealer-template.mjs';

const wrapper = fileURLToPath(new URL('./update-dealer-template.mjs', import.meta.url));
const keys = ['auto-best', 'modern', 'carwow'];

function runGit(repo, args) {
  return execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'Cars updater test',
      GIT_AUTHOR_EMAIL: 'cars-updater-test@example.invalid',
      GIT_COMMITTER_NAME: 'Cars updater test',
      GIT_COMMITTER_EMAIL: 'cars-updater-test@example.invalid'
    }
  }).trim();
}

function templateFiles(key) {
  const files = {
    'package.json': `${JSON.stringify({ name: `cars-template-${key}` })}\n`,
    'src/ui.ts': 'export const title = "old template";\n'
  };
  if (key === 'auto-best') files['src/app.html'] = '<html><head></head><body></body></html>\n';
  if (key === 'modern') Object.assign(files, {
    'apps/web/package.json': '{"name":"modern-web"}\n',
    'apps/web/next.config.ts': 'const nextConfig = {};\nnextConfig.images = nextConfig.images ?? {};\n',
    'packages/next-config/index.ts': 'export const config = {\n  outputFileTracingRoot: monorepoRoot,\n};\n',
    'apps/web/env.ts': 'if (leadSite.staticDemoMode) {\n  return;\n}\nassertRuntimeEnvironmentContract({});\n',
    'apps/web/app/[locale]/layout.tsx': '<html><head></head><body>{children}</body></html>\n',
    'packages/marketplace-ui/components/marketplace-locale-switch-link.tsx': 'export const Link = ({ href, targetPath }) => <><a href={href}>current</a><a href={targetPath}>fallback</a></>;\n',
    'apps/web/proxy.ts': 'const publicProxy: NextProxy = async (request, event) => {\n  const headersResponse = await securityHeaders();\n  return headersResponse;\n};\n'
  });
  if (key === 'carwow') Object.assign(files, {
    'svelte.config.js': 'export default {\n  kit: {\n  }\n};\n',
    'src/app.html': '<html><head></head><body></body></html>\n',
    'src/routes/+layout.svelte': '<script lang="ts">\nimport \'$lib/styles/desktop-controls.css\';\nlet page: any;\nlet isInventoryDetailPage = page.url.pathname === "/detail";\nlet isDashboardArea = page.url.pathname.startsWith(\'/admin\');\nlet allowsBottomNavInDashboard = true;\ngetRouteBodyClasses(page.url.pathname);\nrouteManagesOwnChrome(page.url.pathname);\npage.url.pathname.startsWith(\'/favorites\');\npage.url.pathname.startsWith(\'/presentation\');\n</script>\n<div pathname={page.url.pathname}></div>\n',
    'src/hooks.server.ts': 'getRouteBodyClasses(event.url.pathname);\n',
    'src/lib/server/daynight-template-renderer.ts': 'export function render() {\n  return injectLocalBehavior(withSharedHeader, templateFile);\n}\n',
    'src/lib/styles/desktop-controls.css': '/* controls */\n'
  });
  return files;
}

function readFiles(root) {
  const files = new Map();
  const walk = (directory, relative = '') => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name === '.git') continue;
      const name = relative ? `${relative}/${entry.name}` : entry.name;
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(target, name);
      else if (entry.isFile()) files.set(name, fs.readFileSync(target));
    }
  };
  walk(root);
  return files;
}

function writeFiles(root, files) {
  for (const [name, bytes] of files) {
    const target = path.join(root, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  }
}

function templateFixture(repo, key) {
  fs.mkdirSync(repo, { recursive: true });
  execFileSync('git', ['init', '--initial-branch=main', repo], { stdio: 'ignore' });
  runGit(repo, ['config', 'core.autocrlf', 'false']);
  runGit(repo, ['remote', 'add', 'origin', `https://github.com/darkapoparka/cars-template-${key}.git`]);
  writeFiles(repo, new Map(Object.entries(templateFiles(key)).map(([name, content]) => [name, Buffer.from(content)])));
  runGit(repo, ['add', '.']);
  runGit(repo, ['commit', '-m', 'old template']);
  const from = runGit(repo, ['rev-parse', 'HEAD']);
  const oldTree = readFiles(repo);
  fs.writeFileSync(path.join(repo, 'src', 'ui.ts'), 'export const title = "new template";\n');
  runGit(repo, ['add', '.']);
  runGit(repo, ['commit', '-m', 'new template']);
  const to = runGit(repo, ['rev-parse', 'HEAD']);
  return { from, to, digest: fingerprint(repo).digest, oldTree };
}

async function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-template-cli-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const carsRoot = path.join(root, 'cars');
  const templateRoot = path.join(root, 'template-repos');
  const dealerRoot = path.join(root, 'dealer');
  fs.mkdirSync(path.join(carsRoot, 'runtime'), { recursive: true });
  fs.mkdirSync(templateRoot, { recursive: true });
  fs.mkdirSync(dealerRoot, { recursive: true });

  const revisions = {}, lockTemplates = {}, oldFiles = new Map();
  const variants = [
    { key: 'auto-best', entry: '/', base: '' },
    { key: 'modern', entry: '/variant-2/cars', base: '/variant-2' },
    { key: 'carwow', entry: '/variant-3/', base: '/variant-3' }
  ];
  const manifest = {
    schemaVersion: 1,
    slug: 'test-dealer',
    repository: 'darkapoparka/cars-test-dealer',
    variants,
    extraAssets: [],
    packaging: { version: '1' },
    templateRevisions: {},
    templateSources: {}
  };
  for (const key of keys) {
    const repo = path.join(templateRoot, `cars-template-${key}`);
    const revision = templateFixture(repo, key);
    revisions[key] = revision;
    lockTemplates[key] = {
      repository: `darkapoparka/cars-template-${key}`,
      status: 'approved',
      commit: revision.to,
      digest: revision.digest
    };
    manifest.templateRevisions[key] = revision.from;
    manifest.templateSources[key] = { repository: `darkapoparka/cars-template-${key}`, revision: revision.from, path: '' };
    for (const [name, bytes] of revision.oldTree) oldFiles.set(`${key}/${name}`, bytes);
  }
  await applyMounts(oldFiles, manifest);
  for (const { key } of variants) {
    const designFiles = new Map([...oldFiles].filter(([name]) => name.startsWith(`${key}/`)).map(([name, bytes]) => [name.slice(key.length + 1), bytes]));
    writeFiles(path.join(dealerRoot, key), designFiles);
  }
  fs.writeFileSync(path.join(dealerRoot, 'dealer.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  fs.writeFileSync(path.join(dealerRoot, 'business-facts.json'), '{"name":"Al Reef test facts","stockCount":8}\n');
  const lockFile = path.join(carsRoot, 'templates.lock.json');
  fs.writeFileSync(lockFile, `${JSON.stringify({ schemaVersion: 1, templates: lockTemplates }, null, 2)}\n`);
  return { root, carsRoot, templateRoot, dealerRoot, lockFile, revisions };
}

function cli(args) {
  return JSON.parse(execFileSync(process.execPath, [wrapper, ...args], { encoding: 'utf8' }));
}

function planArgs(value, runName) {
  return [
    'plan', '--dealer-root', value.dealerRoot,
    '--cars-root', value.carsRoot,
    '--template-root', value.templateRoot,
    '--lock-file', value.lockFile,
    '--run-dir', path.join(value.carsRoot, 'runtime', runName)
  ];
}

test('opt-in CLI plans, installs only the pinned trio, and rolls back exact dealer bytes', async t => {
  const value = await fixture(t);
  const originalFacts = fs.readFileSync(path.join(value.dealerRoot, 'business-facts.json'));
  const planned = cli(planArgs(value, 'reviewed-run'));
  assert.equal(planned.ready, true);
  assert.equal(planned.conflicts.length, 0);
  assert.equal(fs.readFileSync(path.join(value.dealerRoot, 'auto-best', 'src', 'ui.ts'), 'utf8'), 'export const title = "old template";\n');
  assert.equal(fs.readFileSync(path.join(value.dealerRoot, 'business-facts.json'), 'utf8'), originalFacts.toString());
  assert.equal(fs.readFileSync(path.join(planned.candidateDirectory, 'business-facts.json'), 'utf8'), originalFacts.toString());
  for (const key of keys) {
    assert.equal(fs.readFileSync(path.join(planned.candidateDirectory, key, 'src', 'ui.ts'), 'utf8'), 'export const title = "new template";\n');
  }

  const installed = cli(['install', '--run-dir', planned.runDirectory]);
  assert.equal(installed.noOp, false);
  for (const key of keys) {
    assert.equal(fs.readFileSync(path.join(value.dealerRoot, key, 'src', 'ui.ts'), 'utf8'), 'export const title = "new template";\n');
  }
  assert.deepEqual(fs.readFileSync(path.join(value.dealerRoot, 'business-facts.json')), originalFacts);

  const rolledBack = cli(['rollback', '--run-dir', planned.runDirectory, '--dealer-root', value.dealerRoot]);
  assert.equal(rolledBack.rollbackChanges.length, planned.summary.changed);
  for (const key of keys) {
    assert.equal(fs.readFileSync(path.join(value.dealerRoot, key, 'src', 'ui.ts'), 'utf8'), 'export const title = "old template";\n');
  }
  const rolledBackManifest = JSON.parse(fs.readFileSync(path.join(value.dealerRoot, 'dealer.json'), 'utf8'));
  for (const key of keys) assert.equal(rolledBackManifest.templateRevisions[key], value.revisions[key].from);
  assert.deepEqual(fs.readFileSync(path.join(value.dealerRoot, 'business-facts.json')), originalFacts);
});

test('opt-in CLI keeps an external candidate separate and supports install retry and rollback', async t => {
  const value = await fixture(t);
  const candidateDirectory = path.join(value.root, 'external-candidate');
  const planned = cli([...planArgs(value, 'external-candidate-run'), '--candidate-dir', candidateDirectory]);
  assert.equal(planned.ready, true);
  assert.equal(path.resolve(planned.candidateDirectory), path.resolve(candidateDirectory));
  assert.equal(path.dirname(planned.runDirectory), path.join(value.carsRoot, 'runtime'));
  assert.ok(fs.existsSync(path.join(planned.candidateDirectory, 'business-facts.json')));
  assert.equal(fingerprint(value.dealerRoot).digest, JSON.parse(fs.readFileSync(path.join(planned.runDirectory, 'run.json'), 'utf8')).sourceBeforeSha256);

  const installed = cli(['install', '--run-dir', planned.runDirectory]);
  assert.equal(installed.noOp, false);
  const retried = cli(['install', '--run-dir', planned.runDirectory]);
  assert.equal(retried.noOp, true);
  assert.equal(path.resolve(retried.candidateDirectory), path.resolve(candidateDirectory));
  cli(['rollback', '--run-dir', planned.runDirectory]);
  assert.equal(fs.readFileSync(path.join(value.dealerRoot, 'auto-best', 'src', 'ui.ts'), 'utf8'), 'export const title = "old template";\n');
  assert.equal(fs.readFileSync(path.join(candidateDirectory, 'auto-best', 'src', 'ui.ts'), 'utf8'), 'export const title = "new template";\n');
});

test('opt-in CLI refuses candidate destinations overlapping a pinned template checkout', async t => {
  const value = await fixture(t);
  const result = spawnSync(process.execPath, [
    wrapper,
    ...planArgs(value, 'overlapping-candidate-run'),
    '--candidate-dir', value.templateRoot
  ], { encoding: 'utf8', windowsHide: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /overlaps the .* template checkout/);
  assert.equal(fs.existsSync(path.join(value.templateRoot, 'candidate')), false);
});

test('opt-in CLI retains manual path resolutions for install and rejects later resolution edits', async t => {
  const value = await fixture(t);
  const uiFile = path.join(value.dealerRoot, 'modern', 'src', 'ui.ts');
  const dealerEdit = 'export const title = "dealer custom";\n';
  const manualEdit = 'export const title = "reviewed manual";\n';
  fs.writeFileSync(uiFile, dealerEdit);
  const resolutionFile = path.join(value.root, 'resolutions.json');
  fs.writeFileSync(resolutionFile, `${JSON.stringify({
    schemaVersion: 1,
    resolutions: { 'modern/src/ui.ts': { action: 'manual', text: manualEdit } }
  }, null, 2)}\n`);

  const planned = cli([...planArgs(value, 'manual-resolution-run'), '--resolutions-file', resolutionFile]);
  assert.equal(planned.ready, true);
  assert.equal(fs.readFileSync(path.join(planned.candidateDirectory, 'modern', 'src', 'ui.ts'), 'utf8'), manualEdit);
  assert.ok(fs.existsSync(path.join(planned.runDirectory, 'resolutions.json')));
  const installed = cli(['install', '--run-dir', planned.runDirectory]);
  assert.equal(installed.noOp, false);
  assert.equal(fs.readFileSync(uiFile, 'utf8'), manualEdit);
  cli(['rollback', '--run-dir', planned.runDirectory]);
  assert.equal(fs.readFileSync(uiFile, 'utf8'), dealerEdit);

  const blockedPlan = cli([...planArgs(value, 'tampered-resolution-run'), '--resolutions-file', resolutionFile]);
  const savedResolutions = path.join(blockedPlan.runDirectory, 'resolutions.json');
  fs.appendFileSync(savedResolutions, ' ');
  const refused = spawnSync(process.execPath, [wrapper, 'install', '--run-dir', blockedPlan.runDirectory], {
    encoding: 'utf8', windowsHide: true
  });
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /Saved resolutions changed after review/);
  assert.equal(fs.readFileSync(uiFile, 'utf8'), dealerEdit);
});

test('opt-in CLI rejects a changed candidate before touching dealer files', async t => {
  const value = await fixture(t);
  const planned = cli(planArgs(value, 'tampered-run'));
  fs.writeFileSync(path.join(planned.candidateDirectory, 'auto-best', 'src', 'ui.ts'), 'export const title = "unreviewed";\n');
  const result = spawnSync(process.execPath, [wrapper, 'install', '--run-dir', planned.runDirectory], {
    encoding: 'utf8',
    windowsHide: true
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /candidate changed after review/);
  assert.equal(fs.readFileSync(path.join(value.dealerRoot, 'auto-best', 'src', 'ui.ts'), 'utf8'), 'export const title = "old template";\n');
});

test('opt-in CLI keeps the stale-source guard after candidate review', async t => {
  const value = await fixture(t);
  const planned = cli(planArgs(value, 'stale-source-run'));
  const dealerFile = path.join(value.dealerRoot, 'business-facts.json');
  const changedSource = Buffer.from('{"name":"owner edit after review","stockCount":8}\n');
  fs.writeFileSync(dealerFile, changedSource);
  const result = spawnSync(process.execPath, [wrapper, 'install', '--run-dir', planned.runDirectory], {
    encoding: 'utf8', windowsHide: true
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Dealer source changed after candidate review/);
  assert.deepEqual(fs.readFileSync(dealerFile), changedSource);
  assert.equal(fs.existsSync(path.join(planned.runDirectory, 'rollback.json')), false);
});

test('opt-in CLI refuses a custom run directory routed outside Cars runtime through a junction', async t => {
  const value = await fixture(t);
  const outside = path.join(value.root, 'outside-runtime');
  const alias = path.join(value.carsRoot, 'runtime', 'redirect');
  fs.mkdirSync(outside);
  fs.symlinkSync(outside, alias, 'junction');
  const redirectedRun = path.join(alias, 'escaped-run');
  const result = spawnSync(process.execPath, [
    wrapper, 'plan', '--dealer-root', value.dealerRoot,
    '--cars-root', value.carsRoot,
    '--template-root', value.templateRoot,
    '--lock-file', value.lockFile,
    '--run-dir', redirectedRun
  ], { encoding: 'utf8', windowsHide: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /resolve inside Cars runtime/);
  assert.equal(fs.existsSync(path.join(outside, 'escaped-run')), false);
});


test('Cars subtree targets migrate a v1 dealer manifest to native v2 with exact tree locators', t => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-native-target-manifest-')); t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.writeFileSync(path.join(root,'business-facts.json'), JSON.stringify({ business:{ name:'Test UAE Dealer',countryCode:'AE',currency:'AED',accent:'#123456' } })+'\n');
  const variants=[{key:'auto-best',entry:'/',base:''},{key:'modern',entry:'/variant-2/cars',base:'/variant-2'},{key:'carwow',entry:'/variant-3/',base:'/variant-3'}];
  const manifest={schemaVersion:1,slug:'test-uae',repository:'darkapoparka/cars-test-uae',variants,packaging:{version:'1'},templateRevisions:Object.fromEntries(keys.map(key=>[key,'a'.repeat(40)]))};
  const pins=Object.fromEntries(keys.map(key=>[key,{to:'b'.repeat(40),targetSource:{repository:'darkapoparka/cars',revision:'b'.repeat(40),path:`templates/${key}`,digest:'c'.repeat(64),tree:'d'.repeat(40)}}]));
  const next=targetManifestForUpgrade({dealerRoot:root,manifest,pins});
  assert.equal(next.packaging.version,'2'); assert.equal(next.localization.defaultLocale,'en'); assert.equal(next.localization.dealerCountry,'AE'); assert.equal(next.localization.inventoryCurrency,'AED'); assert.equal(next.templateSources.modern.tree,'d'.repeat(40));
});
