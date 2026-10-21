import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import test from 'node:test';
import {cropTransparentPadding, reviewedWhiteMattePixels, prepareDealerPackLogo, readPackBranding} from './prepare-dealer-pack-logo.mjs';
import {sha256} from './lib/workflow.mjs';
const toolPackage = process.env.CARS_DEALER_PACK_TOOL_PACKAGE || path.resolve('runtime/dealer-pack-tools/package.json');
const sharp = createRequire(path.resolve(toolPackage))('sharp');
sharp.concurrency(1);
function canvas() {
  const width = 96, height = 80, data = Buffer.alloc(width * height * 4, 255);
  for (let y = 20; y < 60; y++) for (let x = 24; x < 72; x++) data.set([15, 90, 170, 255], (y * width + x) * 4);
  return {data, info: {width, height, channels: 4}};
}
async function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-matte-test-')), slug = 'public-matte-test', dir = path.join(root, 'dealers', slug, 'branding');
  fs.mkdirSync(dir, {recursive: true});t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const raw = canvas(), bytes = await sharp(raw.data, {raw: raw.info}).png().toBuffer(), hash = sha256(bytes);
  const row = ink => ({path: 'branding/original.png', sha256: hash, rasterTreatment: 'reviewed-white-matte-' + ink,
    retainedSource: {kind: 'retained-original-raster', sha256: hash, url: 'https://dealer.example/original.png', observedAt: '2026-10-21T08:00:00Z'},
    matteReview: {kind: 'reviewed-flat-white-canvas', reviewed: true, background: '#ffffff', noWhiteForegroundArtwork: true, sourceSha256: hash, reviewedAt: '2026-10-21T08:30:00Z'}});
  const source = {creationMethod: 'test-only-public-original-matte', reviewedInputs: {reviewedAt: '2026-10-21T08:30:00Z', surfaceReview: {reviewed: true},
    master: row('black'), mark: row('black'), markOnDark: row('white'), surfaces: {onLight: row('black'), onDark: row('white'), onAccent: row('white')}}};
  fs.writeFileSync(path.join(dir, 'original.png'), bytes);
  const write = () => fs.writeFileSync(path.join(dir, 'source.json'), JSON.stringify(source, null, 2) + '\n');write();
  fs.writeFileSync(path.join(root, 'dealers', slug, 'dealer.json'), JSON.stringify({schemaVersion: 1, slug, pack: {schemaVersion: 2}}));
  return {root, slug, dir, source, write, bytes, prepare: () => prepareDealerPackLogo({root, slug, toolPackage, persist: false})};
}
test('white matte uses exact source-pixel membership without mutating or drawing pixels', () => {
  const input = canvas(), before = Buffer.from(input.data), result = reviewedWhiteMattePixels(input, 'solid-black');
  assert.deepEqual(input.data, before);assert.equal(result.proof.originalAlphaUnchangedBeforeCropAndResize, false);
  assert.equal(result.proof.originalWasFullyOpaque, true);assert.equal(result.proof.derivedTransparency, true);assert.equal(result.proof.newGeometry, false);
  assert.equal(result.proof.whiteNoiseCeiling, 5);
  for (let at = 0; at < input.data.length; at += 4) {
    const distance = 255 - Math.min(...input.data.subarray(at, at + 3));
    assert.equal(result.data[at + 3], distance <= 5 ? 0 : 255);assert.deepEqual([...result.data.subarray(at, at + 3)], [0, 0, 0]);
  }
  const white = reviewedWhiteMattePixels(input, 'solid-white');
  for (let at = 3; at < result.data.length; at += 4) assert.equal(result.data[at], white.data[at]);
});
test('opaque sources remain refused by default and ineligible matte canvases cannot be reclassified', async () => {
  const input = canvas(), png = await sharp(input.data, {raw: input.info}).png().toBuffer();
  await assert.rejects(() => cropTransparentPadding(png, sharp), /transparency and visible artwork/);
  for (const change of [x => x.data[3] = 254, x => x.data.fill(100), x => {for (let n = 0; n < x.info.width; n++) x.data[n * 4] = 0;}]) {
    const changed = canvas();change(changed);assert.throws(() => reviewedWhiteMattePixels(changed, 'solid-black'), /opaque original|flat white canvas/);
  }
  const white = await sharp({create: {width: 96, height: 80, channels: 4, background: '#ffffff'}}).png().toBuffer();
  await assert.rejects(() => cropTransparentPadding(white, sharp, {rasterTreatment: 'reviewed-white-matte-black'}), /transparency and visible artwork/);
  const transparent = canvas();transparent.data[3] = 0;assert.throws(() => reviewedWhiteMattePixels(transparent, 'solid-white'), /transparent white artwork/);
  assert.throws(() => reviewedWhiteMattePixels({data: Buffer.alloc(4), info: {width: 0, height: 0, channels: 4}}, 'solid-white'), /bounded RGBA/);
});
test('matte provenance is exact, deterministic and never misrepresented as generated or dealer-adopted', async t => {
  const f = await fixture(t), a = await f.prepare(), b = await f.prepare();
  assert.equal(a.recipe.transformVersion, 'reviewed-white-matte-crop-v1');assert.deepEqual(a.recipe, b.recipe);
  assert.equal(a.contract.status, 'independent-proposal-not-dealer-approved');assert.equal(a.contract.visualReview.dealerApproval, false);
  assert.deepEqual(fs.readFileSync(path.join(f.dir, 'original.png')), f.bytes);
  for (const role of ['onLight', 'onDark', 'onAccent']) {
    const p = a.contract.surfaces[role].retainedSource;
    assert.equal(p.sha256, sha256(f.bytes));assert.equal(p.exportTreatment.derivedTransparency, true);assert.equal(p.exportTreatment.originalAlphaPreserved, false);
    assert.equal(a.contract.surfaces[role].generation, undefined);assert.equal(a.contract.transforms[role].rasterTreatment.originalWasFullyOpaque, true);
  }
  const files = new Map([['branding/source.json', fs.readFileSync(path.join(f.dir, 'source.json'))], ['branding/original.png', f.bytes], ...a.generatedFiles]);
  assert.ok(readPackBranding({branding: a.contract, files}).reviewedSurfaces.assets['favicon.ico']);
  for (const [name, bytes] of a.generatedFiles) assert.deepEqual(bytes, b.generatedFiles.get(name));
  const changed = structuredClone(a.contract);changed.mark.retainedSource.exportTreatment.derivedTransparency = false;
  assert.throws(() => readPackBranding({branding: changed, files}), /provenance missing or changed/);
});
test('missing, stale, generated or nonwhite matte reviews fail before exports are written', async t => {
  for (const change of [f => delete f.source.reviewedInputs.master.matteReview,
    f => f.source.reviewedInputs.master.matteReview.reviewed = false,
    f => f.source.reviewedInputs.master.matteReview.sourceSha256 = '0'.repeat(64),
    f => f.source.reviewedInputs.master.matteReview.noWhiteForegroundArtwork = false,
    f => f.source.reviewedInputs.master.matteReview.background = '#000000',
    f => f.source.reviewedInputs.master.matteReview.reviewedAt = 'invalid',
    f => f.source.reviewedInputs.master.generation = {tool: 'image_gen', generationId: 'synthetic-test-only'}]) {
    const f = await fixture(t);change(f);f.write();await assert.rejects(f.prepare, /dated exact-original visual review/);
    assert.equal(fs.existsSync(path.join(f.dir, 'logo-contract.json')), false);
  }
});
