import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import test from 'node:test';
import {cropTransparentPadding, reviewedBlackMattePixels, prepareDealerPackLogo, readPackBranding} from './prepare-dealer-pack-logo.mjs';
import {sha256} from './lib/workflow.mjs';

const root = path.resolve(import.meta.dirname, '..');
const toolPackage = process.env.CARS_DEALER_PACK_TOOL_PACKAGE || path.join(root, 'runtime/dealer-pack-tools/package.json');
const sharp = createRequire(path.resolve(toolPackage))('sharp');
sharp.concurrency(1);
const encode = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');

function canvas(width = 96, height = 80) {
  const data = Buffer.alloc(width * height * 4);
  for (let at = 3; at < data.length; at += 4) data[at] = 255;
  for (let y = 20; y < 60; y++) for (let x = 24; x < 72; x++) data.set([40, 110, 210, 255], (y * width + x) * 4);
  return {data, info: {width, height, channels: 4}};
}

function filesUnder(directory, prefix = '') {
  return new Map(fs.readdirSync(path.join(directory, prefix), {withFileTypes: true}).flatMap(entry => {
    const name = prefix + entry.name;
    return entry.isDirectory() ? [...filesUnder(directory, name + '/')] : [[name, fs.readFileSync(path.join(directory, name))]];
  }));
}

async function fixture(t) {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-black-matte-test-'));
  t.after(() => fs.rmSync(fixtureRoot, {recursive: true, force: true}));
  const slug = 'public-black-matte-test', directory = path.join(fixtureRoot, 'dealers', slug);
  fs.mkdirSync(path.join(directory, 'branding'), {recursive: true});
  const raw = canvas(), original = await sharp(raw.data, {raw: raw.info}).png().toBuffer(), hash = sha256(original);
  const input = ink => ({path: 'branding/original.png', sha256: hash, rasterTreatment: 'reviewed-black-matte-' + ink,
    retainedSource: {kind: 'retained-original-raster', sha256: hash, url: 'https://dealer.example/original.png', observedAt: '2026-10-21T08:00:00Z'},
    matteReview: {kind: 'reviewed-flat-black-canvas', reviewed: true, background: '#000000', noBlackForegroundArtwork: true,
      sourceSha256: hash, reviewedAt: '2026-10-21T08:30:00Z'}});
  const source = {creationMethod: 'synthetic-test-only-public-black-canvas', reviewedInputs: {
    reviewedAt: '2026-10-21T08:30:00Z', surfaceReview: {reviewed: true},
    master: input('black'), mark: input('black'), markOnDark: input('white'),
    surfaces: {onLight: input('black'), onDark: input('white'), onAccent: input('white')},
  }};
  fs.writeFileSync(path.join(directory, 'branding/original.png'), original);
  const writeSource = value => fs.writeFileSync(path.join(directory, 'branding/source.json'), encode(value));
  writeSource(source);
  fs.writeFileSync(path.join(directory, 'dealer.json'), encode({schemaVersion: 1, slug, pack: {schemaVersion: 2},
    preservedField: 'unchanged', shareIdentity: {name: 'Synthetic black canvas fixture'}}));
  return {root: fixtureRoot, slug, directory, source, original, writeSource,
    prepare: (persist = false) => prepareDealerPackLogo({root: fixtureRoot, slug, toolPackage, persist})};
}

test('black matte has an inclusive five-level boundary in every RGB channel and never changes source bytes', () => {
  const input = canvas(), probes = [
    {rgb: [0, 0, 0], alpha: 0},
    {rgb: [5, 5, 5], alpha: 0},
    {rgb: [6, 0, 0], alpha: 255},
    {rgb: [0, 6, 0], alpha: 255},
    {rgb: [0, 0, 6], alpha: 255},
    {rgb: [5, 5, 6], alpha: 255},
  ];
  for (const [index, probe] of probes.entries()) {
    probe.at = (30 * input.info.width + 30 + index) * 4;
    input.data.set([...probe.rgb, 255], probe.at);
  }
  const before = Buffer.from(input.data), black = reviewedBlackMattePixels(input, 'solid-black'), white = reviewedBlackMattePixels(input, 'solid-white');
  assert.deepEqual(input.data, before);
  assert.notEqual(black.data, input.data);
  for (const {at, alpha} of probes) {
    assert.deepEqual([...black.data.subarray(at, at + 4)], [0, 0, 0, alpha]);
    assert.deepEqual([...white.data.subarray(at, at + 4)], [255, 255, 255, alpha]);
  }
  assert.equal(black.proof.blackCanvasPixels, 96 * 80 - 48 * 40 + 2);
  assert.equal(black.proof.kind, 'reviewed-black-matte-solid-ink-v1');
  assert.equal(black.proof.background, '#000000');
  assert.equal(black.proof.blackNoiseCeiling, 5);
  assert.equal(black.proof.borderBlackFraction, 1);
  assert.equal(black.proof.originalWasFullyOpaque, true);
  assert.equal(black.proof.originalAlphaUnchangedBeforeCropAndResize, false);
  assert.equal(black.proof.derivedTransparency, true);
  assert.equal(black.proof.newGeometry, false);
  assert.equal(black.proof.derivedPixelSha256, sha256(black.data));
  for (let at = 0; at < black.data.length; at += 4) {
    assert.deepEqual([...black.data.subarray(at, at + 3)], [0, 0, 0]);
    assert.deepEqual([...white.data.subarray(at, at + 3)], [255, 255, 255]);
    assert.equal(black.data[at + 3], white.data[at + 3]);
  }
  black.data.fill(123);
  assert.deepEqual(input.data, before, 'The returned raster cannot alias the retained original');
});

test('black canvas and border eligibility include their exact boundaries and reject the next pixel below', () => {
  const withBlackCount = count => {
    const width = 100, height = 100, data = Buffer.alloc(width * height * 4, 255);
    const black = (x, y) => data.set([0, 0, 0, 255], (y * width + x) * 4);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) black(x, y);
    }
    let remaining = count - 396;
    for (let y = 1; y < height - 1 && remaining > 0; y++) for (let x = 1; x < width - 1 && remaining > 0; x++, remaining--) black(x, y);
    assert.equal(remaining, 0);
    return {data, info: {width, height, channels: 4}};
  };
  assert.equal(reviewedBlackMattePixels(withBlackCount(3500), 'solid-white').proof.blackCanvasPixels, 3500);
  assert.throws(() => reviewedBlackMattePixels(withBlackCount(3499), 'solid-white'), /flat black canvas/);

  // A 101×101 raster has exactly 400 border pixels; four exceptions are 1%.
  const border = canvas(101, 101);
  for (let x = 0; x < 4; x++) border.data.set([6, 0, 0, 255], x * 4);
  assert.equal(reviewedBlackMattePixels(border, 'solid-black').proof.borderBlackFraction, .99);
  border.data.set([6, 0, 0, 255], 4 * 4);
  assert.throws(() => reviewedBlackMattePixels(border, 'solid-black'), /flat black canvas/);
});

test('black matte refuses alpha-bearing or malformed sources and never infers a route for an opaque original', async () => {
  for (const alpha of [0, 254]) {
    const input = canvas();input.data[3] = alpha;const before = Buffer.from(input.data);
    assert.throws(() => reviewedBlackMattePixels(input, 'solid-black'), /fully opaque original.*transparent black artwork/);
    assert.deepEqual(input.data, before);
  }
  const input = canvas(), png = await sharp(input.data, {raw: input.info}).png().toBuffer();
  await assert.rejects(() => cropTransparentPadding(png, sharp), /transparency and visible artwork/);
  await assert.rejects(() => cropTransparentPadding(png, sharp, {rasterTreatment: 'reviewed-white-matte-black'}), /flat white canvas/);
  const empty = await sharp({create: {width: 96, height: 80, channels: 4, background: '#000000'}}).png().toBuffer();
  await assert.rejects(() => cropTransparentPadding(empty, sharp, {rasterTreatment: 'reviewed-black-matte-white'}), /transparency and visible artwork/);
  const white = await sharp({create: {width: 96, height: 80, channels: 4, background: '#ffffff'}}).png().toBuffer();
  await assert.rejects(() => cropTransparentPadding(white, sharp, {rasterTreatment: 'reviewed-black-matte-black'}), /flat black canvas/);
  for (const malformed of [
    {data: Buffer.alloc(4), info: {width: 0, height: 0, channels: 4}},
    {data: Buffer.alloc(4), info: {width: 1.5, height: 1, channels: 4}},
    {data: Buffer.alloc(3), info: {width: 1, height: 1, channels: 3}},
    {data: Buffer.alloc(3), info: {width: 1, height: 1, channels: 4}},
    {data: Buffer.alloc(4), info: {width: 8193, height: 8193, channels: 4}},
  ]) assert.throws(() => reviewedBlackMattePixels(malformed, 'solid-black'), /bounded RGBA canvas/);
  assert.throws(() => reviewedBlackMattePixels(canvas(), 'inferred-grey'), /monochrome ink required/);
});

test('black preparation is deterministic, preserves original bytes and labels every derivative with exact source review', async t => {
  const f = await fixture(t), before = filesUnder(f.directory), first = await f.prepare(), second = await f.prepare();
  assert.deepEqual(filesUnder(f.directory), before, 'In-memory preparation must not alter source files');
  assert.deepEqual(first.recipe, second.recipe);
  assert.equal(first.recipe.transformVersion, 'reviewed-black-matte-crop-v1');
  assert.equal(first.recipe.toolchain.sharp, '0.35.5');
  assert.equal(first.recipe.sourceSha256, sha256(before.get('branding/source.json')));
  assert.equal(first.contract.status, 'independent-proposal-not-dealer-approved');
  assert.equal(first.contract.visualReview.dealerApproval, false);
  const proofs = [first.contract.master, first.contract.mark, first.contract.markOnDark,
    ...Object.values(first.contract.surfaces), ...Object.values(first.contract.supplemental)];
  for (const row of proofs) {
    assert.equal(row.generation, undefined);
    const retained = row.retainedSource;
    assert.equal(retained.kind, 'retained-reviewed-raster');
    assert.equal(retained.sha256, sha256(f.original));
    assert.equal(retained.reviewSha256, sha256(before.get('branding/source.json')));
    assert.equal(retained.sourceUrl, 'https://dealer.example/original.png');
    assert.deepEqual(retained.exportTreatment, {
      kind: 'reviewed-black-matte-solid-ink-v1', ink: retained.exportTreatment.ink,
      sourceSha256: sha256(f.original), background: '#000000', derivedTransparency: true,
      originalAlphaPreserved: false, matteReviewSha256: sha256(encode(f.source.reviewedInputs.master.matteReview)), newGeometry: false,
    });
    assert.ok(['solid-black', 'solid-white'].includes(retained.exportTreatment.ink));
  }
  for (const role of ['onLight', 'onDark', 'onAccent', 'master', 'mark', 'markOnDark']) {
    const treatment = first.contract.transforms[role].rasterTreatment;
    assert.equal(treatment.kind, 'reviewed-black-matte-solid-ink-v1');
    assert.equal(treatment.originalWasFullyOpaque, true);
    assert.equal(treatment.derivedTransparency, true);
  }
  for (const [name, bytes] of first.generatedFiles) assert.deepEqual(bytes, second.generatedFiles.get(name), name);
  await f.prepare(true);
  const disk = filesUnder(f.directory);
  assert.deepEqual(disk.get('branding/original.png'), f.original);
  assert.deepEqual(disk.get('branding/source.json'), before.get('branding/source.json'));
  assert.deepEqual(JSON.parse(disk.get('branding/logo-recipe.json')), first.recipe);
  for (const output of first.recipe.outputs) {
    assert.equal(disk.has(output.path), false, 'Compact packs persist originals and recipe, not generated rasters');
    assert.equal(sha256(first.generatedFiles.get(output.path)), output.sha256);
  }
  const manifest = JSON.parse(disk.get('dealer.json'));
  assert.equal(manifest.preservedField, 'unchanged');
  assert.equal(manifest.shareIdentity.name, 'Synthetic black canvas fixture');
  const pack = {branding: first.contract, files: new Map([...before, ...first.generatedFiles])};
  assert.ok(readPackBranding(pack).reviewedSurfaces.assets['favicon.ico']);
});

test('black preparation refuses missing, wrong, stale, false and generated reviews before any persisted export', async t => {
  const cases = [
    ['missing review', source => delete source.reviewedInputs.master.matteReview, /dated exact-original visual review/],
    ['unreviewed canvas', source => source.reviewedInputs.master.matteReview.reviewed = false, /dated exact-original visual review/],
    ['wrong review kind', source => source.reviewedInputs.master.matteReview.kind = 'reviewed-flat-white-canvas', /dated exact-original visual review/],
    ['wrong background', source => source.reviewedInputs.master.matteReview.background = '#ffffff', /dated exact-original visual review/],
    ['stale review hash', source => source.reviewedInputs.master.matteReview.sourceSha256 = '0'.repeat(64), /dated exact-original visual review/],
    ['missing foreground assurance', source => delete source.reviewedInputs.master.matteReview.noBlackForegroundArtwork, /dated exact-original visual review/],
    ['black foreground present', source => source.reviewedInputs.master.matteReview.noBlackForegroundArtwork = false, /dated exact-original visual review/],
    ['invalid review date', source => source.reviewedInputs.master.matteReview.reviewedAt = 'not-a-date', /dated exact-original visual review/],
    ['conflicting generated provenance', source => source.reviewedInputs.master.generation = {tool: 'image_gen', generationId: 'synthetic-refusal-test-only'}, /dated exact-original visual review/],
    ['generated input set', source => {source.generatedInputs = source.reviewedInputs;delete source.reviewedInputs;}, /dated exact-original visual review/],
    ['ambiguous input sets', source => source.generatedInputs = structuredClone(source.reviewedInputs), /Choose one/],
    ['missing original provenance', source => delete source.reviewedInputs.master.retainedSource, /retained original requires/],
    ['changed original hash', source => source.reviewedInputs.master.retainedSource.sha256 = '0'.repeat(64), /exact source hash/],
  ];
  for (const [name, mutate, error] of cases) await t.test(name, async t => {
    const f = await fixture(t), source = structuredClone(f.source);mutate(source);f.writeSource(source);
    const before = filesUnder(f.directory);
    await assert.rejects(() => f.prepare(true), error);
    assert.deepEqual(filesUnder(f.directory), before, 'Failed review must not leave a contract, recipe, manifest update or raster export');
  });
});

test('readPackBranding refuses black-matte provenance, review, original and exported-byte tampering', async t => {
  const f = await fixture(t), prepared = await f.prepare(), original = {
    branding: prepared.contract,
    files: new Map([...filesUnder(f.directory), ...prepared.generatedFiles]),
  };
  for (const mutate of [
    contract => contract.mark.retainedSource.exportTreatment.derivedTransparency = false,
    contract => contract.master.retainedSource.exportTreatment.originalAlphaPreserved = true,
    contract => contract.surfaces.onDark.retainedSource.exportTreatment.background = '#ffffff',
    contract => contract.surfaces.onLight.retainedSource.exportTreatment.kind = 'reviewed-white-matte-solid-ink-v1',
    contract => contract.markOnDark.retainedSource.exportTreatment.matteReviewSha256 = '0'.repeat(64),
    contract => contract.supplemental['favicon.ico'].retainedSource.sourceUrl = 'https://different.example/logo.png',
  ]) {
    const changed = {...original, branding: structuredClone(original.branding)};mutate(changed.branding);
    assert.throws(() => readPackBranding(changed), /logo provenance missing or changed/);
  }
  for (const name of ['branding/original.png', 'branding/logo-on-light.png', 'dealer-brand/mark-on-dark.webp', 'dealer-brand/favicon.ico']) {
    const changed = {...original, files: new Map(original.files)};
    changed.files.set(name, Buffer.concat([changed.files.get(name), Buffer.from('tampered-test-only')]));
    assert.throws(() => readPackBranding(changed), /Prepared (?:source artwork|logo) changed/, name);
  }
  const changedReview = {...original, files: new Map(original.files)};
  changedReview.files.set('branding/source.json', Buffer.concat([original.files.get('branding/source.json'), Buffer.from(' ')]));
  assert.throws(() => readPackBranding(changedReview), /logo provenance missing or changed/);
  const falseReview = structuredClone(f.source);falseReview.reviewedInputs.surfaces.onAccent.matteReview.noBlackForegroundArtwork = false;
  const changedSource = {...original, files: new Map(original.files)};changedSource.files.set('branding/source.json', encode(falseReview));
  assert.throws(() => readPackBranding(changedSource), /dated exact-original visual review/);
});
