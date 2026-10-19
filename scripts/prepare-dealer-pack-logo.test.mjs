import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {createRequire} from 'node:module';
import {cropTransparentPadding, prepareDealerPackLogo, readPackBranding} from './prepare-dealer-pack-logo.mjs';
import {sha256} from './lib/workflow.mjs';

const root = path.resolve(import.meta.dirname, '..');
const toolPackage = process.env.CARS_DEALER_PACK_TOOL_PACKAGE || path.join(root, 'runtime/dealer-pack-tools/package.json');
const sharp = createRequire(path.resolve(toolPackage))('sharp');
const slug = 'raster-test-fixture';
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
function filesUnder(directory, prefix = '') {
  return new Map(fs.readdirSync(path.join(directory, prefix), {withFileTypes: true}).flatMap(entry => {
    const name = prefix + entry.name;
    return entry.isDirectory() ? [...filesUnder(directory, name + '/')] : [[name, fs.readFileSync(path.join(directory, name))]];
  }));
}
async function raster(rgb = [15, 90, 170]) {
  const data = Buffer.alloc(96 * 64 * 4);
  for (let y = 20; y < 44; y++) for (let x = 24; x < 72; x++) {
    const at = (y * 96 + x) * 4;
    data.set([...rgb, 255], at);
  }
  return sharp(data, {raw: {width: 96, height: 64, channels: 4}}).png().toBuffer();
}
async function fixture(t) {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-pack-logo-'));
  t.after(() => fs.rmSync(fixtureRoot, {recursive: true, force: true}));
  const directory = path.join(fixtureRoot, 'dealers', slug);
  fs.mkdirSync(path.join(directory, 'branding'), {recursive: true});
  const sources = new Map();
  const input = async (name, rgb) => {
    const bytes = await raster(rgb), file = 'branding/' + name + '.png';
    fs.writeFileSync(path.join(directory, file), bytes); sources.set(file, bytes);
    // Test-only provenance must never be represented as a production generation.
    return {path: file, sha256: sha256(bytes), generation: {tool: 'image_gen', generationId: 'synthetic-test-only-' + name}};
  };
  const master = await input('retained-master', [20, 80, 140]);
  const mark = await input('retained-mark', [30, 90, 150]);
  const markOnDark = await input('retained-dark-mark', [245, 250, 255]);
  const surfaces = {onLight: await input('retained-light', [10, 50, 90]), onDark: await input('retained-dark', [240, 245, 250]), onAccent: await input('retained-accent', [250, 240, 220])};
  const source = {creationMethod: 'synthetic-test-fixture', generatedInputs: {reviewedAt: '2026-10-19T10:00:00Z', surfaceReview: {reviewed: true}, master, mark, markOnDark, surfaces}};
  writeJson(path.join(directory, 'branding/source.json'), source);
  writeJson(path.join(directory, 'dealer.json'), {schemaVersion: 1, slug, preservedField: 'unchanged', shareIdentity: {title: 'Test fixture'}});
  const prepare = () => prepareDealerPackLogo({root: fixtureRoot, slug, toolPackage});
  const pack = () => ({manifest: readJson(path.join(directory, 'dealer.json')), branding: readJson(path.join(directory, 'branding/logo-contract.json')), files: filesUnder(directory)});
  return {fixtureRoot, directory, source, sources, prepare, pack};
}

test('transparent-padding crop preserves the input and records the exact crop and hashes', async () => {
  const bytes = await raster(), before = Buffer.from(bytes), cropped = await cropTransparentPadding(bytes, sharp);
  assert.deepEqual(bytes, before); assert.equal(cropped.sourceSha256, sha256(bytes)); assert.equal(cropped.sha256, sha256(cropped.png));
  assert.deepEqual(cropped.crop, {left: 22, top: 18, width: 52, height: 28});
  const {data, info} = await sharp(cropped.png).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  assert.equal(info.width, 1024); assert.equal(info.channels, 4); assert.equal(data[3], 0);
  const middle = (Math.floor(info.height / 2) * info.width + 512) * 4;
  assert.deepEqual([...data.subarray(middle, middle + 4)], [15, 90, 170, 255]);
  const mark = await cropTransparentPadding(bytes, sharp, {mark: true});
  const meta = await sharp(mark.png).metadata(); assert.equal(meta.width, 512); assert.equal(meta.height, 512); assert.equal(meta.hasAlpha, true);
});

test('prepared raster surfaces retain original provenance, deterministic hashes, share bindings and all ICO sizes', async t => {
  const data = await fixture(t), first = await data.prepare(), pack = data.pack(), contract = pack.branding;
  assert.equal(first.status, 'independent-proposal-not-dealer-approved'); assert.equal(first.markOnDarkReady, true);
  assert.equal(contract.visualReview.dealerApproval, false); assert.equal(contract.reviewedAt, data.source.generatedInputs.reviewedAt);
  for (const [name, original] of data.sources) assert.deepEqual(fs.readFileSync(path.join(data.directory, name)), original, name + ' remains untouched');
  for (const [role, asset] of Object.entries(contract.assets)) {
    const png = pack.files.get(asset.sourcePath), webp = pack.files.get(asset.publicPath.slice(1));
    assert.equal(sha256(png), asset.sourceSha256); assert.equal(sha256(webp), asset.sha256);
    assert.equal(contract.transforms[role].sourceSha256, data.source.generatedInputs.surfaces[role].sha256);
    assert.deepEqual(contract.surfaces[role].generation, data.source.generatedInputs.surfaces[role].generation);
    assert.equal(contract.surfaces[role].sourceReference, 'dealers/' + slug + '/' + data.source.generatedInputs.surfaces[role].path);
    const pngPixels = await sharp(png).ensureAlpha().raw().toBuffer(), webpPixels = await sharp(webp).ensureAlpha().raw().toBuffer();
    // RGB under fully transparent pixels has no visible value and WebP may omit it.
    for (const pixels of [pngPixels, webpPixels]) for (let at = 0; at < pixels.length; at += 4) {
      if (pixels[at + 3] === 0) pixels.fill(0, at, at + 3);
    }
    assert.equal(sha256(webpPixels), sha256(pngPixels), role + ' WebP preserves all visible prepared PNG pixels');
  }
  assert.equal(pack.manifest.preservedField, 'unchanged'); assert.equal(pack.manifest.shareIdentity.title, 'Test fixture');
  assert.equal(pack.manifest.shareIdentity.logo.sha256, sha256(pack.files.get(pack.manifest.shareIdentity.logo.sourcePath)));
  assert.equal(pack.manifest.shareIdentity.logo.faviconSha256, sha256(pack.files.get(pack.manifest.shareIdentity.logo.faviconSourcePath)));
  const icon = pack.files.get(contract.favicon.path);
  assert.equal(sha256(icon), contract.favicon.sha256); assert.equal(icon.readUInt16LE(0), 0); assert.equal(icon.readUInt16LE(2), 1); assert.equal(icon.readUInt16LE(4), 4);
  let previousEnd = 70;
  for (const [index, size] of [16, 32, 48, 64].entries()) {
    const at = 6 + index * 16, length = icon.readUInt32LE(at + 8), offset = icon.readUInt32LE(at + 12);
    assert.equal(icon[at], size); assert.equal(icon[at + 1], size); assert.equal(icon.readUInt16LE(at + 6), 32);
    assert.equal(offset, previousEnd); assert(offset + length <= icon.length);
    const meta = await sharp(icon.subarray(offset, offset + length)).metadata();
    assert.equal(meta.width, size); assert.equal(meta.height, size); assert.equal(meta.hasAlpha, true);
    previousEnd = offset + length;
  }
  assert.equal(previousEnd, icon.length);
  const branding = readPackBranding(pack);
  for (const [name, asset] of Object.entries(branding.reviewedSurfaces.assets)) {
    assert.equal(asset.sha256, contract.supplemental[name].sha256);
    assert.equal(sha256(asset.bytes), asset.sha256); assert.deepEqual(asset.generation, contract.supplemental[name].generation);
  }
  const before = [...pack.files].map(([name, bytes]) => [name, sha256(bytes)]);
  await data.prepare();
  assert.deepEqual([...data.pack().files].map(([name, bytes]) => [name, sha256(bytes)]), before, 'Same retained inputs reproduce every byte');
});

test('opaque or invisible source artwork and invalid retained provenance are rejected', async t => {
  const opaque = await sharp({create: {width: 32, height: 32, channels: 4, background: '#ffffff'}}).png().toBuffer();
  const invisible = await sharp({create: {width: 32, height: 32, channels: 4, background: '#00000000'}}).png().toBuffer();
  for (const bytes of [opaque, invisible]) await assert.rejects(() => cropTransparentPadding(bytes, sharp), /transparency and visible artwork/);
  const data = await fixture(t), row = data.source.generatedInputs.surfaces.onLight;
  fs.writeFileSync(path.join(data.directory, row.path), await raster([200, 100, 30]));
  await assert.rejects(data.prepare, /Generated source artwork changed/);
  assert.equal(fs.existsSync(path.join(data.directory, 'branding/logo-contract.json')), false);
  fs.writeFileSync(path.join(data.directory, row.path), data.sources.get(row.path));
  row.generation.generationId = '';
  writeJson(path.join(data.directory, 'branding/source.json'), data.source);
  await assert.rejects(data.prepare, /actual imagegen provenance/);
});

test('readPackBranding rejects changed primary and supplemental bytes or provenance', async t => {
  const data = await fixture(t); await data.prepare(); const original = data.pack();
  for (const name of ['branding/logo-master.png', 'branding/logo-mark.png', 'branding/logo-on-light.png',
    'dealer-brand/mark-on-light.webp', 'dealer-brand/mark-on-dark.webp', 'dealer-brand/app-icon.png', 'dealer-brand/favicon.ico']) {
    const pack = {...original, files: new Map(original.files)};
    pack.files.set(name, Buffer.concat([pack.files.get(name), Buffer.from('changed-test-bytes')]));
    assert.throws(() => readPackBranding(pack), /Prepared logo changed/, name);
  }
  const missing = {...original, branding: structuredClone(original.branding)};
  delete missing.branding.supplemental;
  assert.throws(() => readPackBranding(missing), /supplemental logo provenance/);
  const changed = {...original, branding: structuredClone(original.branding)};
  changed.branding.supplemental['mark-on-dark.webp'].generation.generationId = 'different-test-only-generation';
  assert.throws(() => readPackBranding(changed), /supplemental logo provenance/);
});
