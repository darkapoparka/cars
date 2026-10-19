import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {sha256, filesAt} from './lib/workflow.mjs';
import {artifactInventory} from './lib/uk-cloudflare-artifacts.mjs';
import {canonicalPackJson} from './lib/dealer-pack-artifacts.mjs';
import {SIX_DESIGN_KEYS} from './lib/six-design-release.mjs';
import {packDealerPackTransport, restoreDealerPackTransport, validateDealerPackTransportManifest, DEALER_PACK_TRANSPORT_SHARD_BYTES} from './transport-dealer-pack-bundles.mjs';

const area = t => {const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-pack-transport-')); t.after(() => fs.rmSync(root, {recursive: true, force: true})); return root;};
const put = (root, name, value) => {const file = path.join(root, name); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, Buffer.isBuffer(value) || typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');};
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sourceReleases = Object.fromEntries(SIX_DESIGN_KEYS.map(key => [key, {repository: 'darkapoparka/cars', path: 'templates/' + key, revision: 'a'.repeat(40), tree: 'b'.repeat(40), digest: 'c'.repeat(64)}]));

function fixture(root, slug, {asset = Buffer.alloc(60000, 17), benchmark = false, qaPassed = true} = {}) {
  const directory = path.join(root, slug), bundle = path.join(directory, 'bundle');
  const config = {name: 'cars-' + slug, main: 'server/worker.mjs', workers_dev: true, preview_urls: false, no_bundle: true, find_additional_modules: true, assets: {directory: './public', binding: 'ASSETS', run_worker_first: false}};
  put(bundle, 'wrangler.json', config); put(bundle, 'server/worker.mjs', 'export default {fetch(){return new Response("fixture");}};'); put(bundle, 'server/router.mjs', 'export default {};');
  for (const key of SIX_DESIGN_KEYS) put(bundle, 'server/' + key + '/' + (['modern', 'app', 'mobile'].includes(key) ? 'index.js' : 'index.mjs'), 'export default {};');
  put(bundle, 'public/common-test.bin', asset);
  const files = filesAt(bundle, {filter: () => true}).map(name => {const bytes = fs.readFileSync(path.join(bundle, name)); return {path: name, bytes: bytes.length, sha256: sha256(bytes)};});
  const receipt = {schemaVersion: 1, type: 'cars-dealer-pack-single-worker-provider-package', dealer: slug, sourceCommit: 'a'.repeat(40), sourceDigest: 'b'.repeat(64), packDigest: 'c'.repeat(64), sourceReleases,
    releaseDigest: sha256(canonicalPackJson(sourceReleases)), execution: {kind: 'local', id: 'real-byte-transport-test'}, workerName: config.name, publicOrigin: 'https://' + slug + '.webpreviews.site',
    applicationCount: 6, workerCount: 1, composition: {inProcess: SIX_DESIGN_KEYS, serviceBindings: []}, files, outputDigest: sha256(JSON.stringify(files)),
    serverBytes: files.filter(row => row.path.startsWith('server/')).reduce((sum, row) => sum + row.bytes, 0), assetFiles: 1, fastBuild: {benchmarkOnly: benchmark}};
  put(bundle, 'single-worker-receipt.json', receipt); artifactInventory(bundle, {kind: receipt.type, dealer: slug, status: 'passed'});
  const screenshots = SIX_DESIGN_KEYS.flatMap(key => [320, 390, 1280].map(width => {
    const name = 'screenshots/' + key + '-' + width + '.png', bytes = Buffer.from('exact screenshot fixture bytes'); put(directory, name, bytes); return {key, width, path: name, sha256: sha256(bytes)};
  }));
  const binding = {slug, packDigest: receipt.packDigest, releaseDigest: receipt.releaseDigest, outputDigest: receipt.outputDigest, execution: receipt.execution};
  put(directory, 'build-report.json', {...binding, status: 'passed', fastBuild: receipt.fastBuild});
  put(directory, 'qa-report.json', {...binding, type: 'cars-dealer-pack-qa', success: qaPassed, checks: ['bundle-integrity', 'cloudflare-limits', 'fleet-contact-coverage', 'logo-assets', 'rendered-routes', 'screenshots', 'bundle-unchanged'].map(id => ({id, status: 'passed'})), proof: {screenshots}});
  put(directory, 'native-intermediates/not-for-transport.txt', 'never copy source/native/cache');
  return {directory, bundle, receipt};
}

test('two sealed dealers deduplicate identical static bytes and reconstruct their exact independent envelopes', t => {
  const root = area(t), source = path.join(root, 'inputs'); fixture(source, 'first-pack'); fixture(source, 'second-pack');
  const output = path.join(root, 'transport'), packed = packDealerPackTransport({root: source, out: output, shardBytes: 70000});
  assert.equal(packed.status, 'passed'); assert.deepEqual(packed.valid, ['first-pack', 'second-pack']);
  assert(packed.deduplicatedBytes > 60000); assert(packed.shards.length >= 2); assert(packed.shards.every(row => row.bytes <= 70000));
  assert.equal(packed.files.some(row => row.path.includes('native-intermediates')), false);
  assert.equal(packed.files.filter(row => row.path.endsWith('/public/common-test.bin')).length, 2);
  assert.equal(packed.blobs.filter(row => row.sha256 === sha256(Buffer.alloc(60000, 17))).length, 1);
  const restored = restoreDealerPackTransport({input: output, out: path.join(root, 'restored'), manifestSha256: packed.manifestSha256});
  assert.equal(restored.restoredFiles, packed.files.length); assert.equal(restored.restoredBytes, packed.logicalBytes);
  for (const row of packed.files) assert(fs.readFileSync(path.join(root, 'restored', row.path)).equals(fs.readFileSync(path.join(source, row.path))));
  assert.throws(() => restoreDealerPackTransport({input: output, out: path.join(root, 'restored')}), /existing destination/);
});

test('one invalid QA pack and benchmark candidates are rejected while valid bytes remain transportable', t => {
  const root = area(t), source = path.join(root, 'inputs'); fixture(source, 'ready-pack'); fixture(source, 'bad-pack', {qaPassed: false}); fixture(source, 'm2-bench-any-pack', {benchmark: true});
  const packed = packDealerPackTransport({root: source, out: path.join(root, 'transport')});
  assert.equal(packed.status, 'partial-failure'); assert.deepEqual(packed.valid, ['ready-pack']); assert.equal(packed.rejected.length, 2);
  assert(packed.rejected.some(row => row.slug === 'bad-pack' && /QA/.test(row.reason))); assert(packed.rejected.some(row => /benchmark/.test(row.reason)));
  assert.equal(packed.files.every(row => row.path.startsWith('ready-pack/')), true);
});

test('restore can materialize one exact dealer while still authenticating unselected transport blobs', t => {
  const root = area(t), source = path.join(root, 'inputs'); fixture(source, 'first-pack'); fixture(source, 'second-pack', {asset: Buffer.alloc(60000, 99)});
  const input = path.join(root, 'transport'), packed = packDealerPackTransport({root: source, out: input});
  const restored = restoreDealerPackTransport({input, out: path.join(root, 'one'), slugs: ['first-pack']});
  assert.deepEqual(restored.slugs, ['first-pack']); assert.deepEqual(fs.readdirSync(path.join(root, 'one')), ['first-pack']);
  assert.equal(restored.restoredBytes, packed.dealers.find(row => row.slug === 'first-pack').bytes);
  for (const slugs of [[], ['missing-pack'], ['first-pack', 'first-pack'], ['../outside']]) assert.throws(() => restoreDealerPackTransport({input, out: path.join(root, 'invalid'), slugs}), /exact distinct subset/);
  const unselected = packed.blobs.find(row => row.sha256 === sha256(Buffer.alloc(60000, 99)));
  fs.appendFileSync(path.join(input, 'shard-' + unselected.shard, 'blobs', unselected.sha256), 'changed');
  assert.throws(() => restoreDealerPackTransport({input, out: path.join(root, 'changed'), slugs: ['first-pack']}), /blob bytes changed/);
  assert.equal(fs.existsSync(path.join(root, 'changed')), false);
});

test('tampered or undeclared transport bytes and a wrong externally pinned manifest are refused before reconstruction', t => {
  for (const mode of ['changed', 'extra', 'symlink', 'missing', 'pin']) {
    const root = area(t), source = path.join(root, 'inputs'); fixture(source, 'ready-pack');
    const transport = path.join(root, 'transport'), packed = packDealerPackTransport({root: source, out: transport}), blob = packed.blobs[0], file = path.join(transport, 'shard-' + blob.shard, 'blobs', blob.sha256);
    if (mode === 'changed') fs.appendFileSync(file, 'changed');
    if (mode === 'extra') put(transport, 'shard-0/blobs/undeclared', 'extra');
    if (mode === 'symlink') {fs.unlinkSync(file); fs.symlinkSync(path.join(source, 'ready-pack/qa-report.json'), file);}
    if (mode === 'missing') fs.unlinkSync(file);
    assert.throws(() => restoreDealerPackTransport({input: transport, out: path.join(root, 'restored'), ...(mode === 'pin' ? {manifestSha256: '0'.repeat(64)} : {})}), /changed|undeclared|link|missing|externally pinned/);
    assert.equal(fs.existsSync(path.join(root, 'restored')), false);
  }
});

test('transport refuses source links, invalid envelopes and screenshot changes instead of trusting passed labels', t => {
  for (const mode of ['link', 'envelope', 'screenshot']) {
    const root = area(t), source = path.join(root, 'inputs'), f = fixture(source, 'ready-pack');
    if (mode === 'link') {const file = path.join(f.bundle, 'public/common-test.bin'); fs.unlinkSync(file); fs.symlinkSync(path.join(f.bundle, 'server/worker.mjs'), file);}
    if (mode === 'envelope') {const file = path.join(f.bundle, 'artifact-manifest.json'), value = read(file); value.dealer = 'foreign-pack'; put(f.bundle, 'artifact-manifest.json', value);}
    if (mode === 'screenshot') fs.appendFileSync(path.join(f.directory, 'screenshots/app-390.png'), 'changed');
    const result = packDealerPackTransport({root: source, out: path.join(root, 'transport')}); assert.equal(result.status, 'failed'); assert.equal(result.valid.length, 0); assert.equal(result.blobs.length, 0);
  }
});

test('even a rehashed transport manifest cannot introduce source paths, traversal, duplicate membership or oversized shards', t => {
  const root = area(t), source = path.join(root, 'inputs'); fixture(source, 'ready-pack');
  packDealerPackTransport({root: source, out: path.join(root, 'transport')});
  const baseline = read(path.join(root, 'transport/manifest.json'));
  for (const mutate of [value => value.files[0].path = '../outside', value => value.files[0].path = 'ready-pack/source/input.json',
    value => value.blobs.push(value.blobs[0]), value => value.shardBytesLimit = DEALER_PACK_TRANSPORT_SHARD_BYTES + 1, value => value.requested.push(value.requested[0])]) {
    const changed = structuredClone(baseline); mutate(changed); delete changed.contentDigest; changed.contentDigest = sha256(canonicalPackJson(changed));
    assert.throws(() => validateDealerPackTransportManifest(changed), /inventory|evidence|shard/);
  }
});

test('raw shard count and single-file limits fail without creating a partial destination', t => {
  const root = area(t), source = path.join(root, 'inputs'); fixture(source, 'ready-pack');
  assert.throws(() => packDealerPackTransport({root: source, out: path.join(root, 'transport'), shardBytes: 10}), /file exceeds/);
  assert.equal(fs.existsSync(path.join(root, 'transport')), false);
  for (let index = 0; index < 8; index++) fixture(source, 'extra-' + index, {asset: Buffer.alloc(60000, index + 50)});
  assert.throws(() => packDealerPackTransport({root: source, out: path.join(root, 'transport'), shardBytes: 70000}), /eight bounded shards/);
  assert.equal(fs.existsSync(path.join(root, 'transport')), false);
});

test('duplicate JSON keys cannot relabel a downloaded transport manifest', t => {
  const root = area(t), source = path.join(root, 'inputs'); fixture(source, 'ready-pack');
  const transport = path.join(root, 'transport'); packDealerPackTransport({root: source, out: transport});
  const manifest = path.join(transport, 'manifest.json'), text = fs.readFileSync(manifest, 'utf8'); fs.writeFileSync(manifest, text.replace('"schemaVersion": 1,', '"schemaVersion": 1, "schemaVersion": 2,'));
  assert.throws(() => restoreDealerPackTransport({input: transport, out: path.join(root, 'restored')}), /duplicate|Duplicate/);
});
