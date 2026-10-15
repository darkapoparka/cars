import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { fingerprint } from '../lib/workflow.mjs';
import {loadDealerProfile} from '../lib/client-refresh-normalize.mjs';
import { applyMounts } from '../publishing/mounts.mjs';
import { targetManifestForUpgrade, assertUpgradeSourceAdmission, personalizeRegisteredCandidate, assertFactualRefreshAdmission, assertFactualRefreshCandidate, writeFactualRefreshMismatchReview, assertFactualRefreshReplay, assertRegisteredPersonalizationPreservation, planReviewedRegisteredConsumerResolutions, deriveRegisteredConsumerTargets, applyReviewedFactualConsumerResolutions, modernCopyProfileInputPaths, modernCopyReviewSource, loadModernCopyReview, brandFactualTargetBases } from './update-dealer-template.mjs';
import {planThreeWayUpgrade,materializeUpgradeCandidate} from './three-way-upgrade.mjs';

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

function registeredConsumerFixture(){
 const keys=['auto-best','modern','import','app','mobile','karento-best'],name='modern/src/dealer.ts',target=Buffer.from('export const name="template";\n'),custom=Buffer.from('export const name="old dealer";\n'),derived=Buffer.from('export const name="reviewed registered dealer";\n'),newBases=Object.fromEntries(keys.map(key=>[key,new Map()])),personalizedBases=Object.fromEntries(keys.map(key=>[key,new Map()]));newBases.modern.set('src/dealer.ts',target);personalizedBases.modern.set('src/dealer.ts',derived);
 const before=new Map([[name,custom],['modern/src/paid.ts',Buffer.from('preserved paid behavior\n')]]),original=new Map(before),baseline={commit:'a'.repeat(40),tree:'b'.repeat(40)},targetSources=Object.fromEntries(keys.map(key=>[key,{repository:'darkapoparka/cars',revision:'c'.repeat(40),path:'templates/'+key,tree:'d'.repeat(40)}])),digest=bytes=>createHash('sha256').update(bytes).digest('hex'),review={schemaVersion:1,kind:'cars-registered-consumer-template-resolutions',reviewed:true,dealer:'retained',baseline,targetSources,paths:[{path:name,choice:'template',originalSha256:digest(custom),mergedSha256:digest(custom),targetSha256:digest(target),personalizedTargetSha256:digest(derived)}]};return{before,original,newBases,personalizedBases,review,dealer:'retained',baseline,targetSources,name,digest,target,derived};
}

test('registered reviewed clean choices preserve generic and no-resolution behavior',()=>{
 const f=registeredConsumerFixture(),ordinary=planThreeWayUpgrade({oldBase:f.newBases.modern,newBase:f.newBases.modern,dealer:new Map([['src/dealer.ts',f.original.get(f.name)]]),resolutions:{'src/dealer.ts':'template'}});assert(ordinary.ready);assert(ordinary.candidate.get('src/dealer.ts').equals(f.original.get(f.name)));
 const unchanged=planReviewedRegisteredConsumerResolutions({...f,review:null});assert.equal(unchanged.proof,null);assert(unchanged.candidate.get(f.name).equals(f.original.get(f.name)));assert.throws(()=>assertRegisteredPersonalizationPreservation({before:f.before,after:new Map([...f.before,[f.name,f.derived]]),newBases:f.newBases}),/overwrite a custom consumer/);
 const planned=planReviewedRegisteredConsumerResolutions(f);assert(planned.candidate.get(f.name).equals(f.target));assert(planned.candidate.get('modern/src/paid.ts').equals(f.before.get('modern/src/paid.ts')));assert(f.before.get(f.name).equals(f.original.get(f.name)));assert.equal(planned.proof.paths[0].mergedSha256,f.review.paths[0].mergedSha256);assert.equal(planned.proof.stage,'preservation-merge-before-personalization');assertRegisteredPersonalizationPreservation({before:planned.candidate,after:new Map([...planned.candidate,[f.name,f.derived]]),newBases:f.newBases});
});

test('registered clean choices reject unreviewed, wrong identity/pins/hash and unknown adapter paths atomically',()=>{
 for(const change of [r=>r.reviewed=false,r=>r.dealer='other',r=>r.baseline.tree='0'.repeat(40),r=>r.targetSources.mobile.revision='0'.repeat(40),r=>r.paths[0].choice='dealer',r=>r.paths[0].path='../escape',r=>r.paths[0].path='modern/src/paid.ts',r=>r.paths[0].path='modern/source.png',r=>r.paths[0].originalSha256=null,r=>r.paths[0].mergedSha256='0'.repeat(64),r=>r.paths[0].targetSha256='0'.repeat(64),r=>r.paths[0].personalizedTargetSha256='0'.repeat(64),r=>r.paths.push({...r.paths[0]})]){const f=registeredConsumerFixture(),review=structuredClone(f.review);change(review);assert.throws(()=>planReviewedRegisteredConsumerResolutions({...f,review}));assert(f.before.get(f.name).equals(f.original.get(f.name)));}
 const f=registeredConsumerFixture(),unknown=new Map(f.personalizedBases.modern);unknown.set('src/dealer.ts',f.target);assert.throws(()=>planReviewedRegisteredConsumerResolutions({...f,personalizedBases:{...f.personalizedBases,modern:unknown}}),/Unknown or unchanged/);
});

test('registered clean choices prove real clean three-way auto merges before replacing one reviewed consumer',()=>{
 const f=registeredConsumerFixture(),gap=Array.from({length:9},(_,i)=>'const spacer'+i+'='+i+';').join('\n')+'\n',old=Buffer.from('const name="base";\n'+gap+'const custom="base";\n'),fresh=Buffer.from('const name="target";\n'+gap+'const custom="base";\n'),dealer=Buffer.from('const name="base";\n'+gap+'const custom="retained";\n'),derived=Buffer.from('const name="registered";\n'+gap+'const custom="base";\n');
 const merge=planThreeWayUpgrade({oldBase:new Map([['src/dealer.ts',old]]),newBase:new Map([['src/dealer.ts',fresh]]),dealer:new Map([['src/dealer.ts',dealer]]),resolutions:{'src/dealer.ts':'template'}});assert(merge.ready);assert.equal(merge.changes[0].kind,'auto-merged');const actual=merge.candidate.get('src/dealer.ts');assert(!actual.equals(fresh));f.before.set(f.name,actual);f.original.set(f.name,dealer);f.newBases.modern.set('src/dealer.ts',fresh);f.personalizedBases.modern.set('src/dealer.ts',derived);Object.assign(f.review.paths[0],{originalSha256:f.digest(dealer),mergedSha256:f.digest(actual),targetSha256:f.digest(fresh),personalizedTargetSha256:f.digest(derived)});const chosen=planReviewedRegisteredConsumerResolutions(f);assert(chosen.candidate.get(f.name).equals(fresh));assert(f.original.get(f.name).equals(dealer));assert(chosen.candidate.get('modern/src/paid.ts').equals(f.before.get('modern/src/paid.ts')));
});

test('registered target derivation cannot authenticate invented plans or arbitrary asset views',async()=>{
 await assert.rejects(()=>deriveRegisteredConsumerTargets({registeredAdoption:{},assetView:'C:/arbitrary',newBases:{},manifest:{}}),/validated unmodified/);
});

function ordinaryFactualConsumerFixture() {
 const f=factualProofFixture(),name='import/src/lib/config/dealer.ts',relative='src/lib/config/dealer.ts';
 const old=Buffer.from('export const dealerTheme="native";\nexport const name="old";\n'),current=Buffer.from('export const dealerTheme="custom";\nexport const name="old";\n'),target=Buffer.from('export const dealerTheme="native";\nexport const name="recorded dealer";\n'),merged=Buffer.from('export const dealerTheme="custom";\nexport const name="recorded dealer";\n');
 const digest=bytes=>createHash('sha256').update(bytes).digest('hex'),keys=['auto-best','modern','import','app','mobile','karento-best'];
 f.newBases.import.set(relative,target);f.candidate.set(name,merged);f.proof.consumerPaths.push(name);f.proof.consumerPaths.sort();
 const original=new Map([[name,current],['import/src/paid.ts',Buffer.from('preserve custom code\n')]]);f.candidate.set('import/src/paid.ts',original.get('import/src/paid.ts'));
 const qualification={schemaVersion:1,kind:'cars-native-source-qualification-context',id:'test',dealer:'retained',scope:'existing-dealer-pilot',reviewed:true,reviewedAt:'2026-10-11',sourceCommit:'b'.repeat(40),nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,approvedLockSha256:'c'.repeat(64),candidateLockSha256:'d'.repeat(64),sourceDeltaReview:{reference:'docs/releases/delta.json',sha256:'e'.repeat(64),reviewedAt:'2026-10-11'}};
 const baseline={commit:'a'.repeat(40),tree:'b'.repeat(40)},targetSources=f.proof.targetSources,review={schemaVersion:1,kind:'cars-factual-consumer-template-resolutions',reviewed:true,dealer:'retained',baseline:structuredClone(baseline),targetSources:structuredClone(targetSources),paths:[{path:name,choice:'template',originalSha256:digest(current),oldSha256:digest(old),targetSha256:digest(target),mergedSha256:digest(merged)}]};
 const plan={ready:true,candidate:f.candidate,changes:[{path:name,kind:'auto-merged',beforeSha256:digest(current),afterSha256:digest(merged)}],conflicts:[],summary:{changed:1,conflicts:0},pins:Object.fromEntries(keys.map(key=>[key,{targetSource:targetSources[key]}]))};
 return {...f,name,old,current,target,merged,original,oldBases:{import:new Map([[relative,old]])},plan,review,baseline,manifest:{slug:'retained',packaging:{version:'5'}},qualification,designSet:'six',refreshFacts:true,templatePalette:true,factualProof:f.proof,digest};
}

test('ordinary reviewed factual choice leaves default merge intact and restores only the exact native Import target',()=>{
 const f=ordinaryFactualConsumerFixture();assert.equal(applyReviewedFactualConsumerResolutions({...f,review:null}),null);assert(f.plan.candidate.get(f.name).equals(f.merged));assert.throws(()=>assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.proof}),/differs after preservation/);
 const proof=applyReviewedFactualConsumerResolutions(f);assert(f.plan.candidate.get(f.name).equals(f.target));assert(f.original.get(f.name).equals(f.current));assert(f.plan.candidate.get('import/src/paid.ts').equals(f.original.get('import/src/paid.ts')));assert.equal(proof.reviewSha256,f.digest(Buffer.from(JSON.stringify(f.review))));assert.equal(f.plan.changes[0].kind,'reviewed-factual-template');assert.equal(f.plan.changes[0].beforeSha256,f.digest(f.current));assert.equal(f.plan.changes[0].afterSha256,f.digest(f.target));assert.equal(assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.proof}).consumerHashes.length,7);
 const other='mobile/src/current-facts.json';f.plan.candidate.set(other,Buffer.from('stale unrelated facts'));assert.throws(()=>assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.proof}),/differs after preservation/);
});

test('ordinary factual choice rejects default, partial, registered, unqualified and non-palette operations atomically',()=>{
 for(const changed of [{refreshFacts:false},{designSet:null},{selectedKeys:['import']},{registeredAdoption:{}},{qualification:null},{templatePalette:false},{manifest:{slug:'retained',packaging:{version:'1'}}}]){const f=ordinaryFactualConsumerFixture();assert.throws(()=>applyReviewedFactualConsumerResolutions({...f,...changed}));assert(f.plan.candidate.get(f.name).equals(f.merged));}
 const f=ordinaryFactualConsumerFixture();f.plan.ready=false;assert.throws(()=>applyReviewedFactualConsumerResolutions(f));
});

test('ordinary factual choice binds dealer, published baseline, all six pins and consumer stage without unknown fields',()=>{
 for(const mutate of [r=>r.reviewed=false,r=>r.dealer='other',r=>r.baseline.tree='0'.repeat(40),r=>r.baseline.commit='0'.repeat(40),r=>r.baseline.extra=true,r=>r.extra=true,r=>delete r.targetSources.app,r=>r.targetSources.mobile.revision='0'.repeat(40),r=>r.paths[0].path='import/src/paid.ts',r=>r.paths[0].path='../escape',r=>r.paths[0].choice='dealer',r=>r.paths[0].extra=true,r=>r.paths.push({...r.paths[0]})]){const f=ordinaryFactualConsumerFixture();mutate(f.review);assert.throws(()=>applyReviewedFactualConsumerResolutions(f));assert(f.plan.candidate.get(f.name).equals(f.merged));}
 for(const mutate of [f=>f.factualProof.stage='later',f=>f.factualProof.consumerPaths=f.factualProof.consumerPaths.filter(p=>p!==f.name),f=>f.plan.pins.app.targetSource={...f.plan.pins.app.targetSource,tree:'0'.repeat(40)}]){const f=ordinaryFactualConsumerFixture();mutate(f);assert.throws(()=>applyReviewedFactualConsumerResolutions(f));}
});

test('ordinary factual choice requires all four exact clean UTF-8 buffer leases before any change',()=>{
 for(const key of ['originalSha256','oldSha256','targetSha256','mergedSha256']){const f=ordinaryFactualConsumerFixture();f.review.paths[0][key]='0'.repeat(64);assert.throws(()=>applyReviewedFactualConsumerResolutions(f));assert(f.plan.candidate.get(f.name).equals(f.merged));}
 for(const bad of [Buffer.from([0,13,10,65]),Buffer.from([255,65])]){const f=ordinaryFactualConsumerFixture();f.plan.candidate.set(f.name,bad);f.review.paths[0].mergedSha256=f.digest(bad);assert.throws(()=>applyReviewedFactualConsumerResolutions(f));assert(f.plan.candidate.get(f.name).equals(bad));}
 const equal=ordinaryFactualConsumerFixture();equal.plan.candidate.set(equal.name,equal.target);equal.review.paths[0].mergedSha256=equal.digest(equal.target);assert.throws(()=>applyReviewedFactualConsumerResolutions(equal));
 const conflict=ordinaryFactualConsumerFixture();conflict.plan.conflicts=[{path:conflict.name}];assert.throws(()=>applyReviewedFactualConsumerResolutions(conflict));
});

test('ordinary factual choice change records materialize the reviewed target and retain custom source',()=>{
 const f=ordinaryFactualConsumerFixture(),root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-reviewed-factual-')),source=path.join(root,'source'),destination=path.join(root,'candidate');
 try{for(const [name,bytes]of f.original){const file=path.join(source,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);}applyReviewedFactualConsumerResolutions(f);materializeUpgradeCandidate({source,plan:f.plan,destination});assert(fs.readFileSync(path.join(destination,f.name)).equals(f.target));assert(fs.readFileSync(path.join(destination,'import/src/paid.ts')).equals(f.original.get('import/src/paid.ts')));assert(fs.readFileSync(path.join(source,f.name)).equals(f.current));}finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('ordinary factual review replay rejects changed merged or old bytes rather than reusing a previous choice',()=>{
 const f=ordinaryFactualConsumerFixture(),proof=applyReviewedFactualConsumerResolutions(f),replay=ordinaryFactualConsumerFixture();assert.deepEqual(applyReviewedFactualConsumerResolutions(replay),proof);
 for(const mutate of [f=>f.plan.candidate.set(f.name,Buffer.from('new custom merged code')),f=>f.oldBases.import.set('src/lib/config/dealer.ts',Buffer.from('another old immutable source')),f=>f.newBases.import.set('src/lib/config/dealer.ts',Buffer.from('changed target')),f=>f.original.set(f.name,Buffer.from('new current source'))]){const changed=ordinaryFactualConsumerFixture();mutate(changed);assert.throws(()=>applyReviewedFactualConsumerResolutions(changed));}
});

test('ordinary clean factual choice rejects overlapping conflict decisions instead of shadowing manual custom code',()=>{
 for(const decision of ['dealer','template',Buffer.from('manual paid override')]){const f=ordinaryFactualConsumerFixture();assert.throws(()=>applyReviewedFactualConsumerResolutions({...f,resolutions:{[f.name]:decision}}),/cannot overlap/);assert(f.plan.candidate.get(f.name).equals(f.merged));}
 const f=ordinaryFactualConsumerFixture();f.plan.changes[0].kind='resolved-manual';assert.throws(()=>applyReviewedFactualConsumerResolutions(f),/cannot overlap/);assert(f.plan.candidate.get(f.name).equals(f.merged));
 const other=ordinaryFactualConsumerFixture();assert.doesNotThrow(()=>applyReviewedFactualConsumerResolutions({...other,resolutions:{'import/src/paid.ts':Buffer.from('another reviewed manual choice')}}));assert(other.plan.candidate.get('import/src/paid.ts').equals(other.original.get('import/src/paid.ts')));
});

function pairedOrdinaryFactualConsumerFixture(){
 const f=ordinaryFactualConsumerFixture(),name='import/src/lib/config/site.ts';
 const current=Buffer.from("export const favicon='/dealer-brand/app-icon.png';\n"),old=Buffer.from("export const favicon='/brand/import-template-icon-v1.png';\n"),target=Buffer.from(old),merged=Buffer.from(current);
 f.original.set(name,current);f.oldBases.import.set('src/lib/config/site.ts',old);f.newBases.import.set('src/lib/config/site.ts',target);f.plan.candidate.set(name,merged);f.factualProof.consumerPaths.push(name);f.factualProof.consumerPaths.sort();
 f.review.paths.push({path:name,choice:'template',originalSha256:f.digest(current),oldSha256:f.digest(old),targetSha256:f.digest(target),mergedSha256:f.digest(merged)});
 return {...f,site:{name,current,old,target,merged}};
}

test('ordinary paired factual choice restores both exact reviewed Import consumers and preserves unrelated source',()=>{
 const f=pairedOrdinaryFactualConsumerFixture(),proof=applyReviewedFactualConsumerResolutions(f);
 assert(f.plan.candidate.get(f.name).equals(f.target));assert(f.plan.candidate.get(f.site.name).equals(f.site.target));assert(f.original.get(f.site.name).equals(f.site.current));assert(f.plan.candidate.get('import/src/paid.ts').equals(f.original.get('import/src/paid.ts')));
 assert.deepEqual(proof.paths,f.review.paths);assert.equal(f.plan.changes.filter(x=>x.kind==='reviewed-factual-template').length,2);assert.equal(assertFactualRefreshCandidate({candidate:f.plan.candidate,newBases:f.newBases,proof:f.proof}).consumerHashes.length,8);
 const defaultFixture=pairedOrdinaryFactualConsumerFixture();assert.equal(applyReviewedFactualConsumerResolutions({...defaultFixture,review:null}),null);assert(defaultFixture.plan.candidate.get(defaultFixture.site.name).equals(defaultFixture.site.merged));
});

test('ordinary paired factual choice refuses either changed site lease, overlap or missing consumer atomically',()=>{
 const mutations=['originalSha256','oldSha256','targetSha256','mergedSha256'].map(key=>f=>{f.review.paths[1][key]='0'.repeat(64);});
 mutations.push(f=>{f.resolutions={[f.site.name]:'template'};},f=>{f.plan.conflicts=[{path:f.site.name}];},f=>{f.factualProof.consumerPaths=f.factualProof.consumerPaths.filter(x=>x!==f.site.name);});
 for(const mutate of mutations){const f=pairedOrdinaryFactualConsumerFixture();mutate(f);assert.throws(()=>applyReviewedFactualConsumerResolutions(f));assert(f.plan.candidate.get(f.name).equals(f.merged));assert(f.plan.candidate.get(f.site.name).equals(f.site.merged));assert.equal(f.plan.changes[0].kind,'auto-merged');}
});

test('ordinary paired factual choice keeps the exact ordered two-path whitelist and rejects unknown or reversed scope',()=>{
 for(const mutate of [f=>{f.review.paths.reverse();},f=>{f.review.paths[1].path='import/src/paid.ts';},f=>{f.review.paths[1].path='../outside';},f=>{f.review.paths.push({...f.review.paths[1]});}]){const f=pairedOrdinaryFactualConsumerFixture();mutate(f);assert.throws(()=>applyReviewedFactualConsumerResolutions(f));assert(f.plan.candidate.get(f.name).equals(f.merged));assert(f.plan.candidate.get(f.site.name).equals(f.site.merged));}
});


test('factual mismatch refusal enumerates all changed and missing consumers without changing candidates',()=>{
 const f=factualProofFixture(),app='app/src/current-facts.json',missingTarget='import/src/current-facts.json',missingMerged='mobile/src/current-facts.json';
 f.candidate.set(app,Buffer.from('preserved custom factual consumer\n'));f.newBases.import.delete('src/current-facts.json');f.candidate.delete(missingMerged);
 const before=[...f.candidate].map(([name,bytes])=>[name,createHash('sha256').update(bytes).digest('hex')]);let refusal;
 assert.throws(()=>assertFactualRefreshCandidate(f),error=>{refusal=error;assert.equal(error.code,'CARS_FACTUAL_CONSUMER_MISMATCH');assert.match(error.message,/^Factual target differs after preservation/);assert.deepEqual(error.factualConsumerMismatches.map(row=>row.path),[app,missingTarget,missingMerged]);return true;});
 const rows=refusal.factualConsumerMismatches;assert.equal(rows[0].targetMissing,false);assert.equal(rows[0].mergedMissing,false);assert.equal(rows[1].targetSha256,null);assert.equal(rows[1].targetMissing,true);assert.equal(rows[2].mergedSha256,null);assert.equal(rows[2].mergedMissing,true);
 assert.deepEqual([...f.candidate].map(([name,bytes])=>[name,createHash('sha256').update(bytes).digest('hex')]),before);
 assert.throws(()=>assertFactualRefreshCandidate({...f,proof:{...f.proof,consumerPaths:['../escape']}}),error=>{assert.match(error.message,/Exact factual target proof/);assert.equal(error.factualConsumerMismatches,undefined);return true;});
});

test('factual mismatch plan evidence records four raw byte leases and refuses without copying source content',()=>{
 const f=factualProofFixture(),name='app/src/current-facts.json',relative='src/current-facts.json',original=Buffer.from('original-private-factual-consumer\n'),old=Buffer.from('old-private-factual-consumer\n'),merged=Buffer.from('merged-private-factual-consumer\n');
 f.candidate.set(name,merged);let refusal;try{assertFactualRefreshCandidate(f);}catch(error){refusal=error;}
 const tempParent=fs.realpathSync(os.tmpdir()),root=fs.mkdtempSync(path.join(tempParent,'cars-factual-mismatch-')),dealerRoot=path.join(root,'dealer'),runDirectory=path.join(root,'plan');
 try{
  fs.mkdirSync(path.join(dealerRoot,'app/src'),{recursive:true});fs.mkdirSync(runDirectory);fs.writeFileSync(path.join(dealerRoot,name),original);
  const oldBases={app:new Map([[relative,old]])},sourceBeforeSha256='e'.repeat(64),digest=bytes=>createHash('sha256').update(bytes).digest('hex');
  assert.equal(writeFactualRefreshMismatchReview({error:new Error('unrelated guard refusal'),runDirectory,dealerRoot,oldBases,proof:f.proof,sourceBeforeSha256}),null);assert.deepEqual(fs.readdirSync(runDirectory),[]);
  const report=writeFactualRefreshMismatchReview({error:refusal,runDirectory,dealerRoot,oldBases,proof:f.proof,sourceBeforeSha256});
  assert.deepEqual(report.mismatches,[{path:name,originalSha256:digest(original),oldSha256:digest(old),targetSha256:digest(f.newBases.app.get(relative)),mergedSha256:digest(merged),targetMissing:false,mergedMissing:false}]);
  assert.equal(report.ready,false);assert.equal(report.nativeApproval,false);assert.equal(report.hostedApproval,false);assert.equal(report.sourceBeforeSha256,sourceBeforeSha256);assert.deepEqual(report.targetSources,f.proof.targetSources);
  const output=fs.readFileSync(path.join(runDirectory,'factual-mismatch-review.json'),'utf8');assert.deepEqual(JSON.parse(output),report);assert(!output.includes('private-factual-consumer'));assert(output.length<128*1024);assert.deepEqual(fs.readdirSync(runDirectory),['factual-mismatch-review.json']);assert(fs.readFileSync(path.join(dealerRoot,name)).equals(original));assert(f.candidate.get(name).equals(merged));
  assert.throws(()=>writeFactualRefreshMismatchReview({error:refusal,runDirectory,dealerRoot,oldBases,proof:f.proof,sourceBeforeSha256}),/EEXIST/);
  const unsafe={...refusal,code:refusal.code,factualConsumerMismatches:[{...refusal.factualConsumerMismatches[0],path:'../outside'}]};
  assert.throws(()=>writeFactualRefreshMismatchReview({error:unsafe,runDirectory,dealerRoot,oldBases,proof:{...f.proof,consumerPaths:['../outside']},sourceBeforeSha256}),/Invalid factual mismatch evidence/);
 }finally{
  const resolved=fs.realpathSync(root);assert.equal(path.dirname(resolved),tempParent);assert(path.basename(resolved).startsWith('cars-factual-mismatch-'));fs.rmSync(resolved,{recursive:true,force:true});
 }
});

function modernCopyCarrierArea(t){
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'cars-modern-copy-carrier-'));
 t.after(()=>{const exact=fs.realpathSync(directory),relative=path.relative(fs.realpathSync(os.tmpdir()),exact);assert(relative.startsWith('cars-modern-copy-carrier-')&&!relative.includes(path.sep)&&!path.isAbsolute(relative));fs.rmSync(exact,{recursive:true,force:true});});
 const put=(name,value)=>{const file=path.join(directory,name);fs.mkdirSync(path.dirname(file),{recursive:true});const bytes=Buffer.from(JSON.stringify(value,null,2)+'\n');fs.writeFileSync(file,bytes);return createHash('sha256').update(bytes).digest('hex');};
 put('dealer.json',{slug:'carrier-fixture'});return {directory,put};
}
test('Modern copy carrier preserves the ordinary three-file inventory and admits exact facts.vehicles',t=>{
 const f=modernCopyCarrierArea(t),read=()=>modernCopyProfileInputPaths({dealerRoot:f.directory,dealer:'carrier-fixture'});
 f.put('business-facts.json',{business:{name:'Fixture'},vehicles:[{id:'1',title:'Original vehicle'}]});assert.deepEqual(read(),['business-facts.json','dealer.json']);
 f.put('stock.json',[{id:'1'}]);assert.deepEqual(read(),['business-facts.json','dealer.json','stock.json']);assert.notDeepEqual(read(),['business-facts.json','dealer.json']);
});
test('Modern copy carrier refuses absent, empty and arbitrary alternative stock carriers',t=>{
 const f=modernCopyCarrierArea(t),read=()=>modernCopyProfileInputPaths({dealerRoot:f.directory,dealer:'carrier-fixture'});assert.throws(read,/Exact original Modern factual/);
 f.put('business-facts.json',{vehicles:[]});assert.throws(read,/Exact original Modern factual/);f.put('business-facts.json',{listings:[{id:'1'}]});assert.throws(read,/Exact original Modern factual/);
 f.put('normalized-inventory.json',[{id:'1'}]);assert.throws(read,/Exact original Modern factual/);
});
test('Modern copy carrier reuses sealed registered inputs and refuses changed original factual bytes',t=>{
 const f=modernCopyCarrierArea(t),dealer='carrier-fixture',dealerId='bg-varna-carrier-fixture',repository='darkapoparka/cars-carrier-fixture',sourcePath='research/original-stock.json',sourceUrl='https://example.invalid/advert/1';
 const sourceSha=f.put(sourcePath,{listings:[{id:'original-1',sourceUrl}]});
 const input={schemaVersion:1,kind:'cars-registered-dealer-derived-inputs',dealer,reviewed:true,reviewedAt:'2026-10-14T00:00:00Z',facts:{business:{name:'Fixture',countryCode:'BG',currency:'EUR'}},stock:{mode:'retained-dealer-source',listings:[{id:'original-1',sourceUrl,sourceRecord:{path:sourcePath,sha256:sourceSha,id:'original-1'}}]},locale:{schemaVersion:1,dealerId,defaultLocale:'bg',enabledLocales:['bg','en'],dealerCountry:'BG',inventoryCurrency:'EUR'},sourceEvidence:[{path:sourcePath,sha256:sourceSha}]};
 const inputSha=f.put('.client/registered-personalization.json',input),receipt={schemaVersion:1,kind:'cars-registered-dealer-source-adoption',dealer,reviewed:true,reviewedAt:'2026-10-14T00:00:00Z',identity:{dealerId,repository},personalization:{sha256:inputSha},nativeApproval:false,hostedApproval:false,globalReleaseApproval:false},receiptSha=f.put('.client/registered-source-adoption.json',receipt);
 f.put('dealer.json',{slug:dealer,dealerId,repository,registeredSourceAdoption:{receipt:{path:'.client/registered-source-adoption.json',sha256:receiptSha},personalization:{path:'.client/registered-personalization.json',sha256:inputSha}}});
 const read=()=>modernCopyProfileInputPaths({dealerRoot:f.directory,dealer});assert.deepEqual(read(),['.client/registered-personalization.json','.client/registered-source-adoption.json','dealer.json',sourcePath]);
 fs.appendFileSync(path.join(f.directory,sourcePath),' ');assert.throws(read,/original factual proof bytes changed/);
});

test('Independent Modern copy source keeps ordinary Cars-owned scope and rejects ownership relabeling',t=>{
 const f=modernCopyCarrierArea(t),carsRoot=path.join(f.directory,'cars'),dealer='carrier-fixture';
 assert.deepEqual(modernCopyReviewSource({carsRoot,dealerRoot:f.directory,dealer,value:{}}),{root:carsRoot,prefix:'clients/'+dealer});
 assert.throws(()=>modernCopyReviewSource({carsRoot,dealerRoot:f.directory,dealer,value:{sourceRepository:'darkapoparka/cars-alreefusedcars',sourcePrefix:''}}),/ownership differs/);
});
test('Independent Modern copy source admits only Al Reef own Git root and exact private origin',t=>{
 const f=modernCopyCarrierArea(t),dealer='al-reef-used-cars',repository='darkapoparka/cars-alreefusedcars';
 f.put('dealer.json',{slug:dealer,repository,sourceOwnership:'independent-repository'});runGit(f.directory,['init']);runGit(f.directory,['remote','add','origin','https://github.com/'+repository+'.git']);
 const args={carsRoot:path.join(f.directory,'cars'),dealerRoot:f.directory,dealer,value:{sourceRepository:repository,sourcePrefix:''}};
 assert.deepEqual(modernCopyReviewSource(args),{root:f.directory,prefix:''});
 assert.throws(()=>modernCopyReviewSource({...args,value:{...args.value,sourcePrefix:'clients/'+dealer}}),/Exact registered independent/);
 assert.throws(()=>modernCopyReviewSource({...args,value:{...args.value,sourceRepository:'darkapoparka/cars'}}),/Exact registered independent/);
 assert.throws(()=>modernCopyReviewSource({...args,dealer:'another-dealer'}),/Exact registered independent/);
 runGit(f.directory,['remote','set-url','origin','https://github.com/darkapoparka/cars']);assert.throws(()=>modernCopyReviewSource(args),/Git root or origin differs/);
});
test('Independent Modern copy source refuses a nested directory and another independent dealer',t=>{
 const f=modernCopyCarrierArea(t),dealer='al-reef-used-cars',repository='darkapoparka/cars-alreefusedcars';
 runGit(f.directory,['init']);runGit(f.directory,['remote','add','origin','https://github.com/'+repository]);
 const nested=path.join(f.directory,'nested');fs.mkdirSync(nested);fs.writeFileSync(path.join(nested,'dealer.json'),JSON.stringify({slug:dealer,repository,sourceOwnership:'independent-repository'}));
 assert.throws(()=>modernCopyReviewSource({carsRoot:f.directory,dealerRoot:nested,dealer,value:{sourceRepository:repository,sourcePrefix:''}}),/Git root or origin differs/);
 f.put('dealer.json',{slug:'other-dealer',repository:'darkapoparka/cars-other',sourceOwnership:'independent-repository'});
 assert.throws(()=>modernCopyReviewSource({carsRoot:f.directory,dealerRoot:f.directory,dealer:'other-dealer',value:{sourceRepository:'darkapoparka/cars-other',sourcePrefix:''}}),/Exact registered independent/);
});

test('Independent Modern copy source binds the actual own commit tree and refuses tree or factual byte drift',t=>{
 const f=modernCopyCarrierArea(t),dealer='al-reef-used-cars',repository='darkapoparka/cars-alreefusedcars',digest=b=>createHash('sha256').update(b).digest('hex'),gitBlob=b=>createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
 f.put('dealer.json',{slug:dealer,repository,sourceOwnership:'independent-repository'});f.put('business-facts.json',{name:'Al Reef',city:'Sharjah',countryCode:'AE',currency:'AED',inventoryNotice:'Illustrative demo inventory.'});f.put('stock.json',{listings:[{id:'demo-1',title:'Audi A4',make:'Audi',model:'A4',description:'Illustrative demo inventory.',image:'/dealer-inventory/demo-1.webp'}]});
 runGit(f.directory,['init']);runGit(f.directory,['remote','add','origin','https://github.com/'+repository]);runGit(f.directory,['add','dealer.json','business-facts.json','stock.json']);runGit(f.directory,['commit','-m','Exact original independent factual fixture']);
 const sourceCommit=runGit(f.directory,['rev-parse','HEAD']).trim(),baselineTree=runGit(f.directory,['rev-parse','HEAD^{tree}']).trim(),profile=loadDealerProfile(f.directory,dealer),inputRows=profile.listings.map(row=>({slug:row.slug,description:row.description||profile.business.inventoryNotice,images:row.images.map(url=>({url,alt:row.title}))})),profileInputs=['business-facts.json','dealer.json','stock.json'].map(p=>{const b=fs.readFileSync(path.join(f.directory,p));return {path:p,gitBlob:gitBlob(b),sha256:digest(b),bytes:b.length};});
 const reviewedCopy=Object.fromEntries(inputRows.map(row=>[row.slug,{sourceDescription:row.description,en:{description:row.description,imageAlts:row.images.map(r=>r.alt)},bg:{description:'Илюстративни примерни автомобили.',imageAlts:row.images.map(r=>r.alt)}}]));
 const review={schemaVersion:1,kind:'cars-reviewed-modern-bilingual-copy-input',dealer,sourceRepository:repository,sourcePrefix:'',sourceCommit,baselineTree,inputSha256:digest(JSON.stringify(profileInputs)),modernInputRowsSha256:digest(JSON.stringify(inputRows)),profileInputs,listingCount:inputRows.length,reviewedGeneratorHelper:{path:'scripts/lib/modern-dealer-inventory-copy.mjs',sha256:'cbdbaa28dc07911cfe913b4e627671b6556fc25d3bfe59364e29c5ca5a29072b'},review:{displayCopyOnly:true,exactSourceDescriptionKeys:true,listingFactsUnchanged:true,imageUrlsUnchanged:true,imageAltsPreserved:true,interpolationTokensUnchanged:true,reviewedBy:'Focused source admission test'},reviewedCopy};
 const carsRoot=path.join(f.directory,'cars'),p='docs/releases/cloudflare-existing25-20261011/vercel-existing-source/'+dealer+'/modern-copy-review.json',file=path.join(carsRoot,p);fs.mkdirSync(path.dirname(file),{recursive:true});
 const read=value=>{const b=Buffer.from(JSON.stringify(value));fs.writeFileSync(file,b);return ()=>loadModernCopyReview({carsRoot,dealerRoot:f.directory,dealer,pin:{path:p,sha256:digest(b)}});};
 assert.equal(read(review)().value.baselineTree,baselineTree);assert.throws(read({...review,baselineTree:'a'.repeat(40)}),/immutable client tree differs/);
 fs.appendFileSync(path.join(f.directory,'stock.json'),' ');assert.throws(read(review),/source facts changed/);
});

test('reviewed target branding removes matching logo-only merge collisions and retains paid edits',async()=>{
 const f=factualProofFixture(),name='app/lib/dealer.json',asset='auto-best/static/dealer-brand/logo.webp',selected=Buffer.from([0,1,8,9]);
 f.newBases.app.set('lib/dealer.json',Buffer.from('{"name":"Retained dealer","logo":"/dealer-app/logo-old.webp"}\n'));
 f.newBases['auto-best'].set('static/dealer-brand/logo.webp',Buffer.from([0,1,2,3]));
 const dealer=new Map(f.candidate);dealer.set(name,Buffer.from('{"name":"Retained dealer","logo":"/dealer-brand/v2-aaaaaaaaaaaaaaaa/logo-on-light.webp"}\n'));dealer.set(asset,selected);dealer.set('app/src/paid-feature.ts',Buffer.from('export const paid = true;\n'));
 const oldBase=new Map(f.candidate);oldBase.set(asset,Buffer.from([0,4,5,6]));const fresh=new Map();for(const [key,rows]of Object.entries(f.newBases))for(const [p,b]of rows)fresh.set(key+'/'+p,b);
 const refused=planThreeWayUpgrade({oldBase,newBase:fresh,dealer});assert.equal(refused.ready,false);assert(refused.conflicts.some(r=>r.path===name));assert(refused.conflicts.some(r=>r.path===asset));
 const originalDealer=new Map(dealer),proof=await brandFactualTargetBases({...f,manifest:{slug:'retained'},brandingPin:{path:'docs/releases/branding.json',sha256:'c'.repeat(64)},applyBranding:async files=>{files.set(name,dealer.get(name));files.set(asset,selected);return{packId:'aaaaaaaaaaaaaaaa',publicBase:'/dealer-brand/v2-aaaaaaaaaaaaaaaa'};}});
 const aligned=new Map();for(const [key,rows]of Object.entries(f.newBases))for(const [p,b]of rows)aligned.set(key+'/'+p,b);
 const merged=planThreeWayUpgrade({oldBase,newBase:aligned,dealer});assert.equal(merged.ready,true);assert(merged.candidate.get('app/src/paid-feature.ts').equals(dealer.get('app/src/paid-feature.ts')));assert.deepEqual(dealer,originalDealer);
 const sealed=assertFactualRefreshCandidate({candidate:merged.candidate,newBases:f.newBases,proof});assert(sealed.consumerHashes.some(r=>r.path===name));assert(sealed.consumerHashes.some(r=>r.path===asset));assert.equal(proof.targetBranding.stage,'reviewed-logo-pack-on-factual-target-before-preservation-merge');
});
test('reviewed target branding does not auto-resolve custom facts or custom presentation',async()=>{
 const f=factualProofFixture(),name='app/lib/dealer.json';f.newBases.app.set('lib/dealer.json',Buffer.from('{"name":"Retained dealer","logo":"legacy"}\n'));
 const dealer=new Map(f.candidate);dealer.set(name,Buffer.from('{"name":"Retained dealer","logo":"selected","customPaid":true}\n'));dealer.set('mobile/src/current-facts.json',Buffer.from('{"price":44111,"id":"retained-stock"}\n'));
 const proof=await brandFactualTargetBases({...f,manifest:{slug:'retained'},brandingPin:{path:'docs/releases/branding.json',sha256:'c'.repeat(64)},applyBranding:async files=>{files.set(name,Buffer.from('{"name":"Retained dealer","logo":"selected"}\n'));return{packId:'aaaaaaaaaaaaaaaa',publicBase:'/dealer-brand/v2-aaaaaaaaaaaaaaaa'};}});
 const fresh=new Map();for(const [key,rows]of Object.entries(f.newBases))for(const [p,b]of rows)fresh.set(key+'/'+p,b);const merged=planThreeWayUpgrade({oldBase:new Map(f.candidate),newBase:fresh,dealer});assert.equal(merged.ready,false);assert(merged.conflicts.some(r=>r.path===name));
 assert.throws(()=>assertFactualRefreshCandidate({candidate:dealer,newBases:f.newBases,proof}),/differs after preservation/);
});
test('reviewed target branding refuses source deletions, invalid pack identity and missing input seals',async()=>{
 const options=()=>({...factualProofFixture(),manifest:{slug:'retained'},brandingPin:{path:'docs/releases/branding.json',sha256:'c'.repeat(64)}});
 await assert.rejects(()=>brandFactualTargetBases({...options(),applyBranding:async files=>{files.delete('app/src/current-facts.json');return{packId:'aaaaaaaaaaaaaaaa',publicBase:'/dealer-brand/v2-aaaaaaaaaaaaaaaa'};}}),/removed source/);
 await assert.rejects(()=>brandFactualTargetBases({...options(),applyBranding:async()=>({packId:'aaaaaaaaaaaaaaaa',publicBase:'/wrong'})}),/contract differs/);
 await assert.rejects(()=>brandFactualTargetBases({...options(),brandingPin:{sha256:'bad'},applyBranding:async()=>{throw Error('Must never be called');}}),/Exact reviewed/);
});
test('factual source preparation forwards the exact selected branding pin while registered adoption stays unchanged',async()=>{
 const {sourcePreparationPlanArgs}=await import('../prepare-existing-fleet-source.mjs');const input={source:'dealer',root:'cars',lockFile:'lock',qualificationFile:'qualification',runDirectory:'run',assetPool:'pool',brandingPin:{path:'docs/releases/selected-branding.json',sha256:'c'.repeat(64)}};
 const args=sourcePreparationPlanArgs(input);assert.equal(args[args.indexOf('--target-branding')+1],input.brandingPin.path);assert.equal(args[args.indexOf('--target-branding-sha256')+1],input.brandingPin.sha256);assert(args.includes('--refresh-facts'));
 const registered=sourcePreparationPlanArgs({...input,registeredAdoptionPin:{path:'adoption',sha256:'d'.repeat(64)}});assert(!registered.includes('--target-branding'));assert(!registered.includes('--refresh-facts'));
});
