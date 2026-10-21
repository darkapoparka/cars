import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {createRequire} from 'node:module';
import {cropTransparentPadding, prepareDealerPackLogo, readPackBranding} from './prepare-dealer-pack-logo.mjs';
import {sha256} from './lib/workflow.mjs';
import {reviewedRasterProvenance} from './publishing/lead-branding.mjs';

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

function useOriginalArtwork(data) {
  const inputs = data.source.generatedInputs;
  delete data.source.generatedInputs;
  data.source.creationMethod = 'retained-original-raster';
  data.source.reviewedInputs = inputs;
  for (const row of [inputs.master, inputs.mark, inputs.markOnDark, ...Object.values(inputs.surfaces)]) {
    delete row.generation;
    row.retainedSource = {kind: 'retained-original-raster', url: 'https://dealer.example/brand/' + path.basename(row.path),
      observedAt: '2026-10-18T09:30:00Z', sha256: row.sha256};
  }
  writeJson(path.join(data.directory, 'branding/source.json'), data.source);
  return inputs;
}



test('explicit solid-ink exports preserve original alpha geometry and never mutate source bytes', async () => {
  const original = await raster([40, 110, 180]), saved = Buffer.from(original);
  for (const mark of [false, true]) {
    const normal = await cropTransparentPadding(original, sharp, {mark});
    const baseline = await sharp(normal.png).ensureAlpha().raw().toBuffer({resolveWithObject: true});
    for (const [rasterTreatment, ink] of [['solid-black', 0], ['solid-white', 255]]) {
      const prepared = await cropTransparentPadding(original, sharp, {mark, rasterTreatment});
      const output = await sharp(prepared.png).ensureAlpha().raw().toBuffer({resolveWithObject: true});
      assert.deepEqual(output.info, baseline.info); assert.deepEqual(prepared.crop, normal.crop);
      assert.equal(prepared.sourceSha256, sha256(original));
      assert.equal(prepared.rasterTreatment.newGeometry, false);
      assert.equal(prepared.rasterTreatment.originalAlphaUnchangedBeforeCropAndResize, true);
      for (let at = 0; at < output.data.length; at += 4) {
        assert.equal(output.data[at + 3], baseline.data[at + 3], 'same alpha at every prepared pixel');
        if (output.data[at + 3] === 255) assert.deepEqual([...output.data.subarray(at, at + 3)], [ink, ink, ink]);
      }
      assert.deepEqual(original, saved);
    }
  }
});

test('public-original monochrome proposals retain real provenance and a distinct reproducible recipe', async t => {
  const data = await fixture(t), inputs = useOriginalArtwork(data);
  inputs.master.rasterTreatment = 'solid-black'; inputs.mark.rasterTreatment = 'solid-black';
  inputs.markOnDark.rasterTreatment = 'solid-white'; inputs.surfaces.onLight.rasterTreatment = 'solid-black';
  inputs.surfaces.onDark.rasterTreatment = 'solid-white'; inputs.surfaces.onAccent.rasterTreatment = 'solid-white';
  data.source.creationMethod = 'public-original-alpha-preserving-surface-exports';
  writeJson(path.join(data.directory, 'branding/source.json'), data.source);
  const manifest = readJson(path.join(data.directory, 'dealer.json')); manifest.pack = {schemaVersion: 2};
  writeJson(path.join(data.directory, 'dealer.json'), manifest);
  await data.prepare(); const compact = filesUnder(data.directory);
  const generated = await prepareDealerPackLogo({root: data.fixtureRoot, slug, toolPackage, persist: false, sourceFiles: compact});
  assert.equal(generated.recipe.transformVersion, 'transparent-crop-solid-ink-v1');
  assert.equal(generated.contract.status, 'independent-proposal-not-dealer-approved');
  assert.equal(generated.contract.visualReview.dealerApproval, false);
  assert.deepEqual(generated.recipe, readJson(path.join(data.directory, 'branding/logo-recipe.json')));
  for (const [name, original] of data.sources) assert.deepEqual(compact.get(name), original);
  const files = new Map([...compact, ...generated.generatedFiles]);
  const branded = readPackBranding({manifest, branding: generated.contract, files});
  for (const [role, row] of Object.entries(generated.contract.surfaces)) {
    assert.equal(row.generation, undefined);
    assert.equal(row.retainedSource.exportTreatment.ink, inputs.surfaces[role].rasterTreatment);
    assert.equal(row.retainedSource.exportTreatment.sourceSha256, inputs.surfaces[role].sha256);
    assert.equal(row.retainedSource.sha256, inputs.surfaces[role].sha256);
    assert.equal(generated.contract.transforms[role].sourceSha256, inputs.surfaces[role].sha256);
    assert.equal(branded.reviewedSurfaces.surfaces[role].generation, undefined);
  }
  const altered = {manifest, branding: structuredClone(generated.contract), files};
  altered.branding.mark.retainedSource.exportTreatment.ink = 'solid-white';
  assert.throws(() => readPackBranding(altered), /Prepared logo provenance/);
  const repeated = await prepareDealerPackLogo({root: data.fixtureRoot, slug, toolPackage, persist: false, sourceFiles: compact});
  assert.deepEqual(repeated.recipe, generated.recipe);
  assert.deepEqual(filesUnder(data.directory), compact, 'preparation leaves source untouched');
});

test('solid-ink mode cannot invent transparency or claim generated or malformed public originals', async t => {
  const opaque = await sharp({create: {width: 64, height: 64, channels: 4, background: '#333333'}}).png().toBuffer();
  for (const rasterTreatment of ['solid-black', 'solid-white']) await assert.rejects(() => cropTransparentPadding(opaque, sharp, {rasterTreatment}), /transparency and visible artwork/);
  for (const rasterTreatment of ['red', '', null, {}, 'solid-white;filter']) await assert.rejects(() => cropTransparentPadding(opaque, sharp, {rasterTreatment}), /Unsupported raster treatment/);
  const data = await fixture(t);
  data.source.generatedInputs.surfaces.onAccent.rasterTreatment = 'solid-white';
  writeJson(path.join(data.directory, 'branding/source.json'), data.source);
  await assert.rejects(data.prepare, /dated public original/);
  assert.equal(fs.existsSync(path.join(data.directory, 'branding/logo-on-light.png')), false);
  const inputs = useOriginalArtwork(data); inputs.surfaces.onAccent.rasterTreatment = 'red';
  writeJson(path.join(data.directory, 'branding/source.json'), data.source);
  await assert.rejects(data.prepare, /Only explicit black/);
  assert.equal(fs.existsSync(path.join(data.directory, 'branding/logo-on-light.png')), false);
});
