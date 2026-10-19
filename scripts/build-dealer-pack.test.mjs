import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {sha256} from './lib/workflow.mjs';
import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {planSixDesignSelection} from './lib/six-design-release.mjs';
import {parsePackSlugs, packBuildMatrix, packExecution, sourceFileRows, dealerPackToolDigest, packCacheIdentity, packSourceCacheKey, prepareDealerPackSource, readDealerPackSource, inspectPackBudget, assertCompilerToolDirectory, parsePackBuildArgs, packInputDirectories} from './build-dealer-pack.mjs';
import {DEALER_PACK_COMPILED_KIND, DEALER_PACK_BUNDLE_KIND, PACK_TARGETS, PACK_FAMILIES, canonicalPackJson, validatePackExecution} from './lib/dealer-pack-artifacts.mjs';
import {inspectSingleWorkerInputs, packageUkSingleWorker} from './package-uk-single-worker.mjs';

test('batch input is bounded, exact and cannot become shell or filesystem syntax', () => {
  assert.deepEqual(parsePackSlugs('za-motors, wadishee-used-cars\ngranada-auto-sales'), ['za-motors', 'wadishee-used-cars', 'granada-auto-sales']);
  assert.deepEqual(parsePackSlugs('["za-motors"]'), ['za-motors']);
  for (const input of ['', '../dealer', 'dealer;id', 'dealer dealer', 'a'.repeat(44), '$(whoami)', Array.from({length: 26}, (_, i) => 'dealer-' + i)]) assert.throws(() => parsePackSlugs(input));
  const matrix = packBuildMatrix(['za-motors']); assert.equal(matrix.include.length, 7);
  assert.deepEqual(matrix.include.map(row => row.key), [...PACK_TARGETS]);
  assert.equal(matrix.include.find(row => row.key === 'import').node, '24.21.0');
  assert.equal(matrix.include.find(row => row.key === 'karento-best').node, '26.10.0');
});

test('local builds have explicit local identity instead of invented Actions runs', () => {
  assert.deepEqual(packExecution({}, 'local-proof'), {kind: 'local', id: 'local-proof'});
  assert.throws(() => validatePackExecution({kind: 'local', id: 'proof', runId: 123}));
  assert.throws(() => packExecution({GITHUB_ACTIONS: 'true'}, 'local-proof'));
  const env = {GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'darkapoparka/cars', GITHUB_EVENT_NAME: 'pull_request',
    GITHUB_RUN_ID: '42', GITHUB_RUN_ATTEMPT: '1', GITHUB_WORKFLOW_REF: 'darkapoparka/cars/.github/workflows/dealer-pack-pipeline.yml@refs/pull/15/merge'};
  assert.equal(packExecution(env).kind, 'github-actions');
  assert.throws(() => packExecution({...env, GITHUB_REPOSITORY: 'foreign/repo'}));
  assert.throws(() => validatePackExecution({...packExecution(env), approval: 'invented'}));
});

test('dependency caches share releases while compiled caches distinguish dealer inputs', () => {
  const common = {releaseDigest: 'a'.repeat(64), toolDigest: 'b'.repeat(64), key: 'modern', platform: 'linux', arch: 'x64'};
  const first = packCacheIdentity({...common, packDigest: 'c'.repeat(64)}), second = packCacheIdentity({...common, packDigest: 'd'.repeat(64)});
  assert.equal(first.dependencies, second.dependencies); assert.notEqual(first.compiled, second.compiled);
  assert.notEqual(first.dependencies, packCacheIdentity({...common, packDigest: 'c'.repeat(64), toolDigest: 'e'.repeat(64)}).dependencies);
  assert.notEqual(first.dependencies, packCacheIdentity({...common, packDigest: 'c'.repeat(64), arch: 'arm64'}).dependencies);
});

test('source sealing is independent of Map insertion order and binds every byte', () => {
  const first = new Map([['z.txt', Buffer.from('z')], ['a.txt', Buffer.from('a')]]), second = new Map([...first].reverse());
  assert.deepEqual(sourceFileRows(first), sourceFileRows(second));
  second.set('a.txt', Buffer.from('changed')); assert.notDeepEqual(sourceFileRows(first), sourceFileRows(second));
  assert.throws(() => sourceFileRows(new Map([['../escape', Buffer.from('x')]])));
  assert.throws(() => sourceFileRows(new Map([['file', 'not bytes']])));
});

test('the shared source cache key binds the exact pack, releases, tools and source commit', () => {
  const input = {sourceCommit: 'a'.repeat(40), packDigest: 'b'.repeat(64), releaseDigest: 'c'.repeat(64), toolDigest: 'd'.repeat(64)};
  const key = packSourceCacheKey(input);
  for (const field of Object.keys(input)) assert.notEqual(key, packSourceCacheKey({...input, [field]: 'e'.repeat(input[field].length)}));
  assert.throws(() => packSourceCacheKey({...input, sourceCommit: 'main'}));
});

function sourceFixture(t) {
  const parent = fs.realpathSync(os.tmpdir()), root = fs.mkdtempSync(path.join(parent, 'cars-pack-source-test-'));
  t.after(() => { assert.equal(path.dirname(fs.realpathSync(root)), parent); fs.rmSync(root, {recursive: true}); });
  fs.mkdirSync(path.join(root, 'scripts')); fs.writeFileSync(path.join(root, 'scripts/tool.mjs'), 'export const fixture=true;');
  execFileSync('git', ['init', '--quiet', root]);
  execFileSync('git', ['-C', root, '-c', 'user.name=Source test', '-c', 'user.email=source-test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '--allow-empty', '--quiet', '-m', 'Synthetic source fixture']);
  const sourceReleases = Object.fromEntries(PACK_FAMILIES.map(key => [key, {repository: 'darkapoparka/cars', path: 'templates/' + key, revision: 'a'.repeat(40), tree: 'b'.repeat(40), digest: 'c'.repeat(64)}]));
  const manifest = {slug: 'fixture', packaging: {version: '5'}, templateSources: sourceReleases};
  const pack = {manifest, packDigest: 'd'.repeat(64)}, files = new Map([['dealer.json', Buffer.from(JSON.stringify(manifest))], ['auto-best/source.js', Buffer.from('export const original=true;')]]);
  let calls = 0;
  const loadPack = () => pack, assemble = async () => { calls++; return {...pack, files, qualification: {releaseSelection: 'qualification'}}; };
  const options = {root, slug: 'fixture', out: path.join(root, 'runtime/source'), assemble, loadPack};
  return {root, pack, files, options, loadPack, get calls() { return calls; }};
}

test('one assembly is shared by all targets and every restored cache byte is verified', async t => {
  const fixture = sourceFixture(t), first = await prepareDealerPackSource(fixture.options), second = await prepareDealerPackSource(fixture.options);
  assert.equal(first.cacheHit, false); assert.equal(second.cacheHit, true); assert.equal(fixture.calls, 1);
  const read = await readDealerPackSource({root: fixture.root, slug: 'fixture', directory: first.artifactRoot, loadPack: fixture.loadPack});
  assert.deepEqual(sourceFileRows(read.files), sourceFileRows(fixture.files));
  assert.equal(read.execution, undefined); assert.equal(read.providerWrites, false);
  fs.writeFileSync(path.join(first.artifactRoot, 'source/auto-best/source.js'), 'changed');
  await assert.rejects(() => prepareDealerPackSource(fixture.options), /bytes differ/);
});

test('bundled publishing artwork participates in the complete build-tool identity', t => {
  const fixture = sourceFixture(t), before = dealerPackToolDigest(fixture.root);
  fs.mkdirSync(path.join(fixture.root, 'scripts/assets'));
  fs.writeFileSync(path.join(fixture.root, 'scripts/assets/proposal.webp'), Buffer.from([0, 1, 2, 3]));
  const withArtwork = dealerPackToolDigest(fixture.root); assert.notEqual(before, withArtwork);
  fs.writeFileSync(path.join(fixture.root, 'scripts/assets/proposal.webp'), Buffer.from([0, 1, 2, 4]));
  assert.notEqual(withArtwork, dealerPackToolDigest(fixture.root));
});

test('compiler installation cannot replace the source or browser QA dependency package', t => {
  const fixture = sourceFixture(t), area = path.join(fixture.root, 'runtime/source-and-qa-tools');
  fs.mkdirSync(area, {recursive: true});
  const sourcePackage = Buffer.from(JSON.stringify({dependencies: {sharp: '0.35.5', playwright: '1.62.1'}}));
  const packageFile = path.join(area, 'package.json'); fs.writeFileSync(packageFile, sourcePackage);
  assert.throws(() => assertCompilerToolDirectory(area, {name:'cars-cloudflare-dealer-router', private:true, devDependencies:{wrangler:'4.149.0'}}, Buffer.from('{}')), /other dependencies/);
  assert.deepEqual(fs.readFileSync(packageFile), sourcePackage);
  assert(!fs.existsSync(path.join(area, 'package-lock.json')));
});

test('cached source cannot acquire files or be reused for changed pack facts', async t => {
  const fixture = sourceFixture(t), source = await prepareDealerPackSource(fixture.options);
  fixture.pack.packDigest = 'e'.repeat(64);
  await assert.rejects(() => prepareDealerPackSource(fixture.options), /identity changed/);
  fixture.pack.packDigest = 'd'.repeat(64);
  fs.writeFileSync(path.join(source.artifactRoot, 'source/unreviewed.js'), 'extra');
  await assert.rejects(() => prepareDealerPackSource(fixture.options), /undeclared files/);
});

test('capacity limits use measured bytes and retain unverified plan status', () => {
  const modules = [{path: 'worker.mjs', bytes: 1024, compressedBytes: 512}], assets = [{path: 'logo.png', bytes: 25 * 1024 ** 2}];
  assert.equal(inspectPackBudget(assets, modules, 'paid').providerPlanVerified, false);
  assert.throws(() => inspectPackBudget([{bytes: 25 * 1024 ** 2 + 1}], modules));
  assert.equal(inspectPackBudget([], [{bytes: 64 * 1024 ** 2}]).workerBytes, 64 * 1024 ** 2);
  assert.throws(() => inspectPackBudget([], [{bytes: 64 * 1024 ** 2 + 1}]));
  assert.throws(() => inspectPackBudget(Array.from({length: 20001}, () => ({bytes: 1})), modules, 'free'));
  assert.equal(inspectPackBudget(Array.from({length: 20001}, () => ({bytes: 1})), modules, 'paid').assetFiles, 20001);
});

test('provider write flags and duplicate command options are rejected', () => {
  assert.throws(() => parsePackBuildArgs(['compose', '--write', 'true']));
  assert.throws(() => parsePackBuildArgs(['prepare', '--slug', 'one', '--slug', 'two']));
  assert.deepEqual(parsePackBuildArgs(['compile', '--prepared', 'runtime/p/prepare.json']), {command: 'compile', options: {prepared: 'runtime/p/prepare.json'}});
});

function compiledFixture(t) {
  const parent = fs.realpathSync(os.tmpdir()), root = fs.mkdtempSync(path.join(parent, 'cars-pack-compiled-test-'));
  t.after(() => { assert.equal(path.dirname(fs.realpathSync(root)), parent); fs.rmSync(root, {recursive: true}); });
  const sourceReleases = Object.fromEntries(PACK_FAMILIES.map(key => [key, {repository: 'darkapoparka/cars', path: 'templates/' + key, revision: 'a'.repeat(40), tree: 'b'.repeat(40), digest: 'c'.repeat(64)}]));
  const identity = {sourceCommit: 'd'.repeat(40), sourceDigest: 'e'.repeat(64), sourceReleases,
    packDigest: 'f'.repeat(64), releaseDigest: sha256(canonicalPackJson(sourceReleases)), toolDigest: '1'.repeat(64),
    execution: {kind: 'local', id: 'real-local-fixture'}, publicOrigin: 'https://fixture.webpreviews.site', providerOrigin: 'https://cars-fixture.darkapoparka1.workers.dev', capacityPlan: 'paid',
    qualification: {releaseSelection: 'qualification', hostedVerified: false, providerWrites: false}};
  const variants = planSixDesignSelection([{key: 'auto-best', base: '', entry: '/'}, {key: 'modern', base: '/variant-2', entry: '/variant-2/cars'}, {key: 'carwow', base: '/variant-3', entry: '/variant-3/'}]).variants;
  const write = (directory, name, value) => { const file = path.join(directory, name); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value)); };
  const inputs = {};
  for (const key of PACK_TARGETS) {
    const directory = path.join(root, key); inputs[key] = directory;
    const next = ['modern', 'app', 'mobile'].includes(key), mainPath = key === 'router' ? 'compiled/cloudflare/router.mjs' : next ? 'compiled/' + key + '/dist/server/index.js' : 'compiled/' + key + '/.cars-cloudflare/worker/index.js';
    const assetPath = 'compiled/' + key + '/public', configPath = 'compiled/deploy.json';
    write(directory, mainPath, key === 'router' ? 'export default createDealerRouter(' + JSON.stringify({variants, redirects: []}) + ');' : 'export default {fetch(){return new Response("' + key + '")}};');
    write(directory, assetPath + '/' + key + '.txt', 'fixture ' + key); write(directory, configPath, {});
    const rows = [];
    const walk = prefix => { for (const entry of fs.readdirSync(path.join(directory, prefix), {withFileTypes: true})) { const name = prefix + '/' + entry.name; if (entry.isDirectory()) walk(name); else { const bytes = fs.readFileSync(path.join(directory, name)); rows.push({path: name, bytes: bytes.length, sha256: sha256(bytes)}); } } }; walk('compiled'); rows.sort((a, b) => a.path.localeCompare(b.path));
    const deploy = {schemaVersion: 1, kind: DEALER_PACK_COMPILED_KIND, dealer: 'fixture', key, provider: 'cloudflare', ...identity,
      workerName: key === 'router' ? 'cars-fixture' : 'cars-fixture-' + (key === 'karento-best' ? 'signature' : key),
      mainPath, assetPath, configPath, compiledFiles: rows, compiledDigest: sha256(JSON.stringify(rows)), compiled: true, dryRun: true, hosted: false, credentialsIncluded: false, nativeApproval: false};
    write(directory, 'deploy.json', deploy);
    write(directory, 'receipts/source.json', {schemaVersion: 1, kind: 'cars-dealer-pack-build-source', dealer: 'fixture', key, ...identity, originalPackUnchanged: true});
    write(directory, 'receipts/build.json', {schemaVersion: 1, kind: 'cars-dealer-pack-family-build', dealer: 'fixture', key, ...identity,
      status: 'passed', workerName: deploy.workerName, compiledDigest: deploy.compiledDigest, compiled: true, dryRun: true});
    artifactInventory(directory, {kind: DEALER_PACK_COMPILED_KIND, dealer: 'fixture', key, status: 'passed'});
  }
  const change = (key, name, edit) => { const file = path.join(inputs[key], name), value = JSON.parse(fs.readFileSync(file)); edit(value); write(inputs[key], name, value); artifactInventory(inputs[key], {kind: DEALER_PACK_COMPILED_KIND, dealer: 'fixture', key, status: 'passed'}); };
  return {root, identity, inputs, change};
}

test('the existing composer accepts honest pack artifacts with no fleet or GitHub provenance', t => {
  const fixture = compiledFixture(t), inspected = inspectSingleWorkerInputs({inputs: fixture.inputs, expectedDealer: 'fixture'});
  assert.equal(inspected.inputKind, 'dealer-pack'); assert.deepEqual(inspected.identity.execution, fixture.identity.execution);
  assert.equal(inspected.identity.runId, undefined); assert.equal(inspected.identity.sourceTree, undefined);
  assert.deepEqual(packInputDirectories(fixture.root, 'fixture'), fixture.inputs);
});

test('mixed packs, templates, toolchains and execution attempts cannot be composed', async t => {
  for (const [field, value] of [['packDigest', '9'.repeat(64)], ['releaseDigest', '9'.repeat(64)], ['sourceDigest', '9'.repeat(64)], ['toolDigest', '9'.repeat(64)], ['execution', {kind: 'local', id: 'other-attempt'}]]) {
    await t.test(field, t => {
      const fixture = compiledFixture(t);
      for (const name of ['deploy.json', 'receipts/source.json', 'receipts/build.json']) fixture.change('app', name, row => { row[field] = value; });
      assert.throws(() => inspectSingleWorkerInputs({inputs: fixture.inputs, expectedDealer: 'fixture'}), /Mixed exact source packages/);
    });
  }
});

test('pack composition rejects fabricated fleet identity and host approval', async t => {
  for (const [field, value] of [['runId', '42'], ['sourceTree', '9'.repeat(40)], ['nativeApproval', true], ['hosted', true]]) {
    await t.test(field, t => { const fixture = compiledFixture(t); fixture.change('app', 'deploy.json', row => { row[field] = value; }); assert.throws(() => inspectSingleWorkerInputs({inputs: fixture.inputs, expectedDealer: 'fixture'}), /Invalid dealer-pack/); });
  }
});

test('pack output uses the existing six-handler layout and truthful qualification receipt', t => {
  const fixture = compiledFixture(t), require = createRequire(process.env.CARS_ESBUILD_RESOLVE_FROM || import.meta.url), esbuild = require('esbuild');
  const destination = path.join(fixture.root, 'bundle'), receipt = packageUkSingleWorker({inputs: fixture.inputs, destination, expectedDealer: 'fixture', esbuild});
  assert.equal(receipt.type, DEALER_PACK_BUNDLE_KIND); assert.equal(receipt.applicationCount, 6); assert.equal(receipt.workerCount, 1);
  assert.deepEqual(receipt.composition.serviceBindings, []); assert.equal(receipt.hostedVerified, false); assert.equal(receipt.runId, undefined);
  assert.equal(receipt.packDigest, fixture.identity.packDigest); assert.equal(receipt.releaseDigest, fixture.identity.releaseDigest);
  assert.equal(receipt.publicOrigin, 'https://fixture.webpreviews.site'); assert.equal(receipt.providerOrigin, 'https://cars-fixture.darkapoparka1.workers.dev');
  assert(fs.existsSync(path.join(destination, 'server/worker.mjs')));
  const config = JSON.parse(fs.readFileSync(path.join(destination, 'wrangler.json'))); assert.equal(config.assets.binding, 'ASSETS'); assert.equal(config.services, undefined);
  assert.equal(receipt.outputDigest, sha256(JSON.stringify(receipt.files)));
});
