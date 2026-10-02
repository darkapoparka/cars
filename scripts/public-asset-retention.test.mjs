import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { planAssetRetention, retentionReason, withRetainedPublicAssets } from './publishing/public-asset-retention.mjs';
const hash = v => createHash('sha256').update(v).digest('hex');
const bytes = Buffer.from('original image');
const candidate = { path: 'assets/archive/unused.png', sha256: hash(bytes), reason: 'Reviewed superseded source artwork; no runtime consumer.' };
const policy = { schemaVersion: 1, family: 'test', candidates: [candidate], keepPrefixes: [] };
const plan = (options = {}) => planAssetRetention({ assets: new Map([[candidate.path, bytes]]), consumers: [], policy, ...options });
test('omits only reviewed exact bytes; unknown media is never selected', () => {
  assert.equal(plan().omitted.length, 1);
  assert.equal(plan().omittedBytes, bytes.length);
  assert.equal(plan({ policy: { ...policy, candidates: [] } }).omitted.length, 0);
});
test('changed dealer artwork and server-read assets are always retained', () => {
  assert.equal(plan({ assets: new Map([[candidate.path, Buffer.from('custom')]]) }).retained[0].reason, 'customized-or-updated');
  assert.equal(plan({ serverAssets: [candidate.path] }).retained[0].reason, 'server-read-dependency');
  assert.equal(plan({ assets: new Map() }).retained[0].reason, 'absent-in-this-dealer');
});
test('literal, basename, escaped URL and relative CSS references retain assets', () => {
  for (const text of ['"/assets/archive/unused.png"', '"unused.png"', '"\\/assets\\/archive\\/unused.png"', 'url(../archive/unused.png)'])
    assert.equal(plan({ consumers: [{ path: 'src/ui', text }] }).omitted.length, 0);
});
test('computed asset paths and explicit fallback prefixes are retained', () => {
  assert.match(retentionReason(candidate.path, [{ path: 'ui', text: '`/assets/archive/${name}.png`' }]), /computed/);
  assert.match(retentionReason(candidate.path, [{ path: 'ui', text: "'/assets/archive/' + name" }]), /computed/);
  assert.equal(retentionReason(candidate.path, [], ['assets/archive/']), 'dynamic-asset-prefix');
});
test('a TypeScript path type is not a runtime reference', () => {
  assert.equal(retentionReason(candidate.path, [{ path: 'src/types.ts', text: 'type Path = `/assets/${string}`;' }]), null);
});
test('unsafe paths, duplicate entries and licensing removal fail closed', () => {
  for (const entry of [{ ...candidate, path: '../oops.png' }, { ...candidate, path: 'NOTICE.md' }, { ...candidate, sha256: 'x' }])
    assert.throws(() => plan({ policy: { ...policy, candidates: [entry] } }));
  assert.throws(() => plan({ policy: { ...policy, candidates: [candidate, candidate] } }));
});
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-retention-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const folder of ['src', 'static/assets/archive', '.build/client']) fs.mkdirSync(path.join(root, folder), { recursive: true });
  fs.writeFileSync(path.join(root, 'public-assets.policy.json'), JSON.stringify(policy));
  fs.writeFileSync(path.join(root, 'src/page.svelte'), '<h1>Dealer</h1>');
  fs.writeFileSync(path.join(root, 'static', candidate.path), bytes);
  const builder = { config: { kit: { files: { assets: path.join(root, 'static') } } }, routes: [],
    log: { info() {} }, findServerAssets: () => [], getBuildDirectory: () => path.join(root, '.build/report'),
    writeClient(destination) { fs.mkdirSync(path.join(destination, 'assets/archive'), { recursive: true });
      fs.copyFileSync(path.join(root, 'static', candidate.path), path.join(destination, candidate.path)); return [candidate.path]; } };
  return { root, builder, destination: path.join(root, '.build/client') };
}
test('real adapter output is trimmed; canonical original and adapter options remain intact', async t => {
  const { root, builder, destination } = fixture(t); let emitted;
  const adapter = withRetainedPublicAssets({ name: 'existing', supports: { read: true }, async adapt(b) { emitted = b.writeClient(destination); } }, { root });
  await adapter.adapt(builder);
  assert.deepEqual(emitted, []); assert.equal(adapter.supports.read, true);
  assert.equal(fs.existsSync(path.join(destination, candidate.path)), false);
  assert.equal(hash(fs.readFileSync(path.join(root, 'static', candidate.path))), candidate.sha256);
});
test('public HTML and SVG references protect their dependencies', async t => {
  const { root, builder, destination } = fixture(t);
  fs.writeFileSync(path.join(root, 'static/offer.html'), '<img src="/assets/archive/unused.png">');
  await withRetainedPublicAssets({ name: 'existing', async adapt(b) { b.writeClient(destination); } }, { root }).adapt(builder);
  assert.equal(fs.existsSync(path.join(destination, candidate.path)), true);
});
test('runtime source changes during output fail without deleting source assets', async t => {
  const { root, builder, destination } = fixture(t);
  const adapter = withRetainedPublicAssets({ name: 'existing', async adapt(b) {
    fs.writeFileSync(path.join(root, 'src/page.svelte'), '<img src="/assets/archive/unused.png">'); b.writeClient(destination);
  } }, { root });
  await assert.rejects(adapter.adapt(builder), /changed during/);
  assert.equal(fs.existsSync(path.join(root, 'static', candidate.path)), true);
});
test('adapter cannot prune canonical source directories', async t => {
  const { root, builder } = fixture(t);
  await assert.rejects(withRetainedPublicAssets({ name: 'bad', async adapt(b) { b.writeClient(path.join(root, 'static')); } }, { root }).adapt(builder), /overlaps/);
});
test('changed copied bytes fail instead of being deleted', async t => {
  const { root, builder, destination } = fixture(t); const copy = builder.writeClient;
  builder.writeClient = out => { const files = copy(out); fs.writeFileSync(path.join(out, candidate.path), 'changed'); return files; };
  await assert.rejects(withRetainedPublicAssets({ name: 'bad', async adapt(b) { b.writeClient(destination); } }, { root }).adapt(builder), /differs/);
  assert.equal(fs.existsSync(path.join(destination, candidate.path)), true);
});
test('derived desktop formats are retained when source names the original image', () => {
  assert.match(retentionReason('assets/images/home-videos/desktop/panamera.webp', [
    { path: 'src/videos.ts', text: "thumbnail: '/assets/images/home-videos/panamera.jpg'" }
  ]), /format-variant/);
});
test('standalone template adapters use the identical reviewed retention engine', () => {
  const expected = fs.readFileSync(new URL('./publishing/public-asset-retention.mjs', import.meta.url));
  for (const family of ['auto-best', 'carwow', 'import']) {
    assert.deepEqual(fs.readFileSync(new URL('../templates/' + family + '/scripts/public-asset-retention.mjs', import.meta.url)), expected);
    assert.match(fs.readFileSync(new URL('../templates/' + family + '/svelte.config.js', import.meta.url), 'utf8'), /adapter: withRetainedPublicAssets\(/);
  }
});
test('extensionless banner inputs retain generated responsive sizes', () => {
  for (const suffix of ['', '-small', '-large']) {
    assert.match(retentionReason('assets/daynight/services/sell-commerce' + suffix + '.webp', [
      { path: 'src/SellPage.svelte', text: 'image="/assets/daynight/services/sell-commerce"' }
    ]), /computed/);
  }
});
