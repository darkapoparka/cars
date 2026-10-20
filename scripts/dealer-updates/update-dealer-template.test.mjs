import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { fingerprint } from '../lib/workflow.mjs';
import { applyMounts } from '../publishing/mounts.mjs';
import { targetManifestForUpgrade, assertUpgradeSourceAdmission, personalizeRegisteredCandidate, assertFactualRefreshAdmission, assertFactualRefreshCandidate, assertFactualRefreshReplay, assertRegisteredPersonalizationPreservation } from './update-dealer-template.mjs';
import {planThreeWayUpgrade} from './three-way-upgrade.mjs';
import { nativeFixture } from '../test-fixtures/native-source.mjs';
import { adoptNativeSource } from '../publishing/native-mounts.mjs';
import { assertNativeAdoption } from '../lib/native-localization.mjs';

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

test('opt-in CLI binds separate review and installation pools and reuses retained candidate binaries', async t => {
  const value=await fixture(t),template=path.join(value.templateRoot,'cars-template-modern');
  const newAsset='exact newly reviewed image';
  fs.mkdirSync(path.join(template,'static'),{recursive:true});
  fs.writeFileSync(path.join(template,'static','shared.webp'),newAsset);
  runGit(template,['add','static/shared.webp']);runGit(template,['commit','-m','reviewed binary']);
  const lock=JSON.parse(fs.readFileSync(value.lockFile));
  lock.templates.modern.commit=runGit(template,['rev-parse','HEAD']);lock.templates.modern.digest=fingerprint(template).digest;
  fs.writeFileSync(value.lockFile,JSON.stringify(lock)+'\n');
  fs.writeFileSync(path.join(value.dealerRoot,'history-one.webp'),'preserved history');
  fs.writeFileSync(path.join(value.dealerRoot,'history-two.webp'),'preserved history');
  const sourceBefore=fingerprint(value.dealerRoot).digest;
  const reviewPool=path.join(value.root,'review-assets'),installPool=path.join(value.root,'installation-assets');
  const one=cli([...planArgs(value,'two-pool-one'),'--candidate-dir',path.join(value.root,'first-reviewed'),'--candidate-asset-pool',reviewPool,'--asset-pool',installPool]);
  const two=cli([...planArgs(value,'two-pool-two'),'--candidate-dir',path.join(value.root,'second-reviewed'),'--candidate-asset-pool',reviewPool,'--asset-pool',installPool]);
  const metadata=JSON.parse(fs.readFileSync(path.join(one.runDirectory,'run.json'))),again=JSON.parse(fs.readFileSync(path.join(two.runDirectory,'run.json')));
  assert.equal(metadata.candidateAssetPool,path.resolve(reviewPool));assert.equal(metadata.assetPool,path.resolve(installPool));
  assert.equal(metadata.candidateAssetPoolStats.filesLinked,3);assert.equal(metadata.candidateAssetPoolStats.objectsWritten,2);
  assert.equal(again.candidateAssetPoolStats.filesLinked,3);assert.equal(again.candidateAssetPoolStats.objectsReused,3);
  assert.equal(fs.existsSync(installPool),false,'planning does not populate the installation pool');
  assert.equal(fingerprint(value.dealerRoot).digest,sourceBefore);
  const candidateAsset=path.join(one.candidateDirectory,'modern/static/shared.webp');
  assert.equal(fs.statSync(candidateAsset).ino,fs.statSync(path.join(two.candidateDirectory,'modern/static/shared.webp')).ino);
  const installed=cli(['install','--run-dir',one.runDirectory]);
  assert.equal(installed.candidateAssetPool,path.resolve(reviewPool));assert.equal(installed.assetPoolStats.pool,path.resolve(installPool));assert.equal(installed.assetPoolStats.filesLinked,1);
  const installedAsset=path.join(value.dealerRoot,'modern/static/shared.webp');
  assert.equal(fs.readFileSync(installedAsset,'utf8'),newAsset);
  assert.notEqual(fs.statSync(installedAsset).ino,fs.statSync(candidateAsset).ino,'two pools never share an editable source inode');
  cli(['rollback','--run-dir',one.runDirectory]);
  assert.equal(fingerprint(value.dealerRoot).digest,sourceBefore);
  assert.equal(fs.readFileSync(candidateAsset,'utf8'),newAsset);
  for(const object of fs.readdirSync(installPool))assert.equal(fs.statSync(path.join(installPool,object)).mode&0o200,0);
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

async function nativePaletteFixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-palette-refresh-'));
  t.after(()=>{
    const actual=fs.realpathSync(root),relative=path.relative(fs.realpathSync(os.tmpdir()),actual);
    assert(relative.startsWith('cars-palette-refresh-')&&!relative.includes(path.sep)&&!path.isAbsolute(relative));
    fs.rmSync(actual,{recursive:true,force:true});
  });
  const carsRoot=path.join(root,'cars'),templateRoot=path.join(root,'template-repos'),dealerRoot=path.join(root,'dealer');
  fs.mkdirSync(path.join(carsRoot,'runtime'),{recursive:true});
  const f=nativeFixture(dealerRoot),key='modern',relative='packages/marketplace/lead-site.ts';
  const configPath=`modern/${relative}`;
  const nativeConfig=f.files.get(configPath).toString().replace('name: "Fixture Dealer"','accent: "#30343b", name: "Fixture Dealer"');
  f.files.set(configPath,Buffer.from(nativeConfig));
  const repo=path.join(templateRoot,'cars-template-modern');
  fs.mkdirSync(repo,{recursive:true});
  execFileSync('git',['init','--initial-branch=main',repo],{stdio:'ignore'});
  runGit(repo,['config','core.autocrlf','false']);
  runGit(repo,['remote','add','origin','https://github.com/darkapoparka/cars-template-modern.git']);
  writeFiles(repo,new Map([...f.files].filter(([name])=>name.startsWith('modern/')).map(([name,bytes])=>[name.slice(7),bytes])));
  runGit(repo,['add','.']);runGit(repo,['commit','-m','old native palette']);
  const from=runGit(repo,['rev-parse','HEAD']),fromDigest=fingerprint(repo).digest;
  fs.writeFileSync(path.join(repo,'packages/marketplace/new-template.ts'),'export const updated = true;\n');
  runGit(repo,['add','.']);runGit(repo,['commit','-m','new source preserving native palette']);
  const to=runGit(repo,['rev-parse','HEAD']),digest=fingerprint(repo).digest;
  Object.assign(f.releases.modern,{commit:to,digest});
  Object.assign(f.releases.modern.qa.nativeLocalization,{commit:to,sourceDigest:digest});
  f.releases.modern.qa.nativeLocalization.deployment.sourceCommit=to;
  f.manifest.templateRevisions.modern=from;
  f.manifest.templateSources=Object.fromEntries(f.manifest.variants.map(({key})=>[key,{repository:`darkapoparka/cars-template-${key}`,revision:f.manifest.templateRevisions[key],path:'',digest:key==='modern'?fromDigest:f.releases[key].digest}]));
  const dealerConfig=nativeConfig.replace('"#30343b"','"#176b43"').replace('"Fixture Dealer"','"Truthful Dealer"');
  f.files.set(configPath,Buffer.from(dealerConfig));
  const oldReleases=structuredClone(f.releases);
  Object.assign(oldReleases.modern,{commit:from,digest:fromDigest});
  Object.assign(oldReleases.modern.qa.nativeLocalization,{commit:from,sourceDigest:fromDigest});
  oldReleases.modern.qa.nativeLocalization.deployment.sourceCommit=from;
  const adopted=adoptNativeSource(f.files,f.manifest,oldReleases);
  adopted.set('dealer.json',Buffer.from(JSON.stringify(f.manifest,null,2)+'\n'));
  adopted.set('business-facts.json',Buffer.from('{"business":{"name":"Truthful Dealer","phone":"+359888123456","countryCode":"AE","currency":"AED"}}\n'));
  writeFiles(dealerRoot,adopted);
  const lockFile=path.join(carsRoot,'templates.lock.json');
  fs.writeFileSync(lockFile,JSON.stringify({schemaVersion:1,templates:f.releases},null,2)+'\n');
  return {root,carsRoot,templateRoot,dealerRoot,lockFile,configPath,from,to,nativeConfig,dealerConfig};
}

test('explicit template palette refresh corrects the preservation merge before sealing and install recomputes the same receipt',async t=>{
  const f=await nativePaletteFixture(t),before=fingerprint(f.dealerRoot).digest;
  const planned=cli([...planArgs(f,'native-palette'),'--variants','modern','--template-palette']);
  assert.equal(planned.ready,true);assert.equal(fingerprint(f.dealerRoot).digest,before);
  const metadata=JSON.parse(fs.readFileSync(path.join(planned.runDirectory,'run.json'))),review=JSON.parse(fs.readFileSync(path.join(planned.runDirectory,'review.json')));
  assert.equal(metadata.selection.templatePalette,true);
  assert.deepEqual(review.templatePalette,metadata.templatePalette);
  const correction=review.templatePalette.corrections[0];
  assert.equal(correction.source.revision,f.to);assert.equal(correction.source.path,'');
  assert.deepEqual(correction.fields,[{name:'accent',before:'#176b43',after:'#30343b'}]);
  const candidate=readFiles(planned.candidateDirectory),manifest=JSON.parse(candidate.get('dealer.json'));
  assert.match(candidate.get(f.configPath).toString(),/accent: "#30343b", name: "Truthful Dealer"/);
  assert.equal(candidate.get('business-facts.json').toString(),fs.readFileSync(path.join(f.dealerRoot,'business-facts.json'),'utf8'));
  assertNativeAdoption(candidate,manifest);
  const stale=new Map(candidate);stale.set(f.configPath,Buffer.from(candidate.get(f.configPath).toString().replace('#30343b','#176b43')));
  assert.throws(()=>assertNativeAdoption(stale,manifest),/changed after adoption/);
  const installed=cli(['install','--run-dir',planned.runDirectory]);assert.equal(installed.noOp,false);
  assertNativeAdoption(readFiles(f.dealerRoot),manifest);
  assert.match(fs.readFileSync(path.join(f.dealerRoot,f.configPath),'utf8'),/"#30343b"/);
});

test('native refresh defaults preserve a paid custom palette and reject a changed palette choice after review',async t=>{
  const f=await nativePaletteFixture(t);
  const paid=cli([...planArgs(f,'paid-palette'),'--variants','modern']);
  const paidFiles=readFiles(paid.candidateDirectory),paidManifest=JSON.parse(paidFiles.get('dealer.json'));
  assert.match(paidFiles.get(f.configPath).toString(),/accent: "#176b43", name: "Truthful Dealer"/);
  assertNativeAdoption(paidFiles,paidManifest);
  const reviewed=cli([...planArgs(f,'palette-flag-tamper'),'--variants','modern','--template-palette']);
  const metadataPath=path.join(reviewed.runDirectory,'run.json'),metadata=JSON.parse(fs.readFileSync(metadataPath));
  metadata.selection.templatePalette=false;fs.writeFileSync(metadataPath,JSON.stringify(metadata));
  const result=spawnSync(process.execPath,[wrapper,'install','--run-dir',reviewed.runDirectory],{encoding:'utf8'});
  assert.notEqual(result.status,0);assert.match(result.stderr,/palette selection or correction receipt changed/);
  assert.equal(fs.existsSync(path.join(reviewed.runDirectory,'rollback.json')),false);
  assert.match(fs.readFileSync(path.join(f.dealerRoot,f.configPath),'utf8'),/"#176b43"/);
});

test('registered source admission cannot relax ordinary native qualification guards', () => {
  const manifest={slug:'retained',packaging:{version:'1'}};
  assert.throws(()=>assertUpgradeSourceAdmission({manifest,qualification:{}}),/existing native dealer/);
  assert.throws(()=>assertUpgradeSourceAdmission({manifest,qualification:{},registeredAdoption:{manifest}}),/validated unmodified/);
  for(const version of ['2','3','5'])assert.doesNotThrow(()=>assertUpgradeSourceAdmission({manifest:{...manifest,packaging:{version}},qualification:{}}));
});

test('registered candidate personalization cannot accept an invented plan or arbitrary asset folder', async () => {
  await assert.rejects(()=>personalizeRegisteredCandidate({registeredAdoption:{profile:{business:{name:'invented'}}},assetView:'C:/arbitrary',candidateDirectory:'C:/arbitrary'}),/validated unmodified/);
});

const factualKeys=['auto-best','modern','import','app','mobile','karento-best'];
function factualProofFixture(){
  const newBases=Object.fromEntries(factualKeys.map(key=>[key,new Map([['src/current-facts.json',Buffer.from('{"price":4299,"id":"retained-stock"}\n')]])]));
  const proof={schemaVersion:1,stage:'preservation-merge-before-native-catalogs-and-branding',mode:'current-facts-from-pinned-six-targets',dealer:'retained',profileSha256:'a'.repeat(64),targetSources:Object.fromEntries(factualKeys.map(key=>[key,{repository:'darkapoparka/cars',revision:'b'.repeat(40),path:'templates/'+key,tree:'c'.repeat(40),digest:'d'.repeat(64)}])),consumerPaths:factualKeys.map(key=>key+'/src/current-facts.json').sort()};
  const candidate=new Map(factualKeys.map(key=>[key+'/src/current-facts.json',newBases[key].get('src/current-facts.json')]));return{newBases,proof,candidate};
}

test('factual refresh is an explicit qualified all-six ordinary source operation',()=>{
  const qualification={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'test',dealer:'retained',scope:'existing-dealer-pilot',reviewed:true,reviewedAt:'2026-10-11',sourceCommit:'b'.repeat(40),nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:'c'.repeat(64),candidateLockSha256:'d'.repeat(64),sourceDeltaReview:{reference:'docs/releases/delta.json',sha256:'e'.repeat(64),reviewedAt:'2026-10-11'}};
  const args={enabled:true,designSet:'six',qualification,manifest:{slug:'retained',packaging:{version:'5'}}};assert.doesNotThrow(()=>assertFactualRefreshAdmission(args));assert.doesNotThrow(()=>assertFactualRefreshAdmission({enabled:false}));
  for(const changed of [{designSet:undefined},{selectedKeys:['modern']},{qualification:null},{registeredAdoption:{}},{manifest:{slug:'retained',packaging:{version:'1'}}},{qualification:{...qualification,nativeApproval:true}}])assert.throws(()=>assertFactualRefreshAdmission({...args,...changed}));
});

test('factual target merge preserves unrelated customization and blocks stale factual dealer resolutions',()=>{
  const f=factualProofFixture(),oldBase=new Map(f.candidate),newBase=new Map(f.candidate),dealer=new Map(f.candidate),name='mobile/src/current-facts.json';oldBase.set(name,Buffer.from('{"price":44299,"id":"retained-stock"}\n'));dealer.set(name,oldBase.get(name));dealer.set('mobile/src/paid-customization.ts',Buffer.from('export const paid = true;\n'));
  const merged=planThreeWayUpgrade({oldBase,newBase,dealer});assert.equal(merged.ready,true);assert.equal(merged.candidate.get('mobile/src/paid-customization.ts').toString(),'export const paid = true;\n');assert.equal(assertFactualRefreshCandidate({...f,candidate:merged.candidate}).consumerHashes.length,6);
  dealer.set(name,Buffer.from('{"price":44111,"id":"retained-stock"}\n'));const conflict=planThreeWayUpgrade({oldBase,newBase,dealer});assert.equal(conflict.ready,false);assert(conflict.conflicts.some(row=>row.path===name));
  const stale=planThreeWayUpgrade({oldBase,newBase,dealer,resolutions:{[name]:'dealer'}});assert.equal(stale.ready,true);assert.throws(()=>assertFactualRefreshCandidate({...f,candidate:stale.candidate}),/differs after preservation/);
  const reviewed=planThreeWayUpgrade({oldBase,newBase,dealer,resolutions:{[name]:'template'}});assert.equal(reviewed.ready,true);assertFactualRefreshCandidate({...f,candidate:reviewed.candidate});
});

test('factual proof and reconstruction reject missing or changed consumers, profile, pins and flag',()=>{
  const f=factualProofFixture(),sealed=assertFactualRefreshCandidate(f),metadata={selection:{refreshFacts:true},factualRefresh:sealed};assertFactualRefreshReplay({proof:f.proof,metadata,newBases:f.newBases});
  for(const mutate of [m=>m.selection.refreshFacts=false,m=>m.factualRefresh.profileSha256='0'.repeat(64),m=>m.factualRefresh.targetSources.app.revision='0'.repeat(40),m=>m.factualRefresh.consumerHashes[0].sha256='0'.repeat(64),m=>m.registeredAdoption={}]){const copy=structuredClone(metadata);mutate(copy);assert.throws(()=>assertFactualRefreshReplay({proof:f.proof,metadata:copy,newBases:f.newBases}),/changed after review/);}
  const missing=new Map(f.candidate);missing.delete(f.proof.consumerPaths[0]);assert.throws(()=>assertFactualRefreshCandidate({...f,candidate:missing}),/differs after preservation/);assert.throws(()=>assertFactualRefreshCandidate({...f,proof:{...f.proof,consumerPaths:['../outside']}}),/Exact factual target/);
});

test('registered personalization rejects overwritten custom consumers and preserves unrelated custom paths',()=>{
  const keys=['auto-best','modern','import','app','mobile','karento-best'],name='modern/src/config/company.ts';
  const newBases=Object.fromEntries(keys.map(key=>[key,new Map()]));newBases.modern.set('src/config/company.ts',Buffer.from('export const name="template";\n'));
  const before=new Map([[name,newBases.modern.get('src/config/company.ts')],['modern/src/paid-customization.ts',Buffer.from('retain paid behavior\n')]]),after=new Map(before);after.set(name,Buffer.from('export const name="reviewed dealer";\n'));
  const proof=assertRegisteredPersonalizationPreservation({before,after,newBases});assert.equal(proof.consumerHashes.length,1);assert.equal(proof.stage,'personalization-before-native-catalogs-and-branding');assert(before.get('modern/src/paid-customization.ts').equals(after.get('modern/src/paid-customization.ts')));
  const custom=new Map(before);custom.set(name,Buffer.from('export const name="template";\nexport const paidCustom = true;\n'));assert.throws(()=>assertRegisteredPersonalizationPreservation({before:custom,after,newBases}),/overwrite a custom consumer/);
  const removed=new Map(after);removed.delete(name);assert.throws(()=>assertRegisteredPersonalizationPreservation({before,after:removed,newBases}),/removed a preserved path/);assert.throws(()=>assertRegisteredPersonalizationPreservation({before,after}),/exact mounted target bases/);
});
