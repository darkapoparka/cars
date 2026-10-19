import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {sha256, writeJson} from './lib/workflow.mjs';
import {SIX_DESIGN_KEYS} from './lib/six-design-release.mjs';
import {fleetDesignFabHashes} from './lib/dealer-pack-switcher-logo.mjs';
import {M1_VISUAL_BASELINE, readDealerPackScreenshotEvidence, dealerPackFabArtworkException,
  loadDealerPackVisualTools, compareDealerPackPngs, parseDealerPackScreenshotComparisonArgs} from './compare-dealer-pack-screenshots.mjs';

const area = t => {const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-visual-proof-'));t.after(() => fs.rmSync(directory, {recursive: true, force: true}));return directory;};
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));

function evidence(t) {
  const directory = area(t), slug = 'za-motors', execution = {kind: 'github-actions', repository: 'darkapoparka/cars', runId: '39284983471', attempt: '2'};
  const binding = {slug, execution, packDigest: 'a'.repeat(64), releaseDigest: 'b'.repeat(64), outputDigest: 'c'.repeat(64)};
  const build = {...binding, status: 'passed', sourceCommit: M1_VISUAL_BASELINE.sourceCommit};
  const screenshots = SIX_DESIGN_KEYS.flatMap(key => [320, 390, 1280].map(width => {
    // Header-only files suffice for the evidence-binding tests. Raster tests
    // below separately decode real PNGs using the pinned production comparator.
    const bytes = Buffer.alloc(32);Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);bytes.writeUInt32BE(width, 16);bytes.writeUInt32BE(900, 20);
    const name = 'screenshots/' + key + '-' + width + '-home.png';fs.mkdirSync(path.join(directory, 'screenshots'), {recursive: true});fs.writeFileSync(path.join(directory, name), bytes);
    return {key, width, route: 'home', path: name, sha256: sha256(bytes), pixels: {width, height: 900}};
  }));
  const qa = {...binding, type: 'cars-dealer-pack-qa', success: true,
    checks: ['bundle-integrity', 'rendered-routes', 'screenshots', 'bundle-unchanged'].map(id => ({id, status: 'passed'})),
    routes: screenshots.map(row => ({key: row.key, width: row.width, label: 'home', status: 'passed', httpStatus: 200,
      screenshotPreparation: {status: 'passed', fonts: 'loaded', returnedToTop: true}})), proof: {screenshots: screenshots.map(({pixels, ...row}) => row)}};
  writeJson(path.join(directory, 'build-report.json'), build);writeJson(path.join(directory, 'qa-report.json'), qa);
  const corpus = structuredClone(M1_VISUAL_BASELINE);
  corpus.dealers[slug] = {...binding, screenshots,
    buildReportSha256: sha256(fs.readFileSync(path.join(directory, 'build-report.json'))), qaReportSha256: sha256(fs.readFileSync(path.join(directory, 'qa-report.json')))};
  return {directory, build, qa, corpus};
}

test('the baseline corpus is exactly the final green M1 head and 54 original-resolution views', () => {
  assert.equal(M1_VISUAL_BASELINE.sourceCommit, 'a999878a921fb61b37bf198c43275550814f88cc');
  assert.equal(M1_VISUAL_BASELINE.runId, '39284983471');assert.equal(M1_VISUAL_BASELINE.attempt, '2');
  assert.deepEqual(M1_VISUAL_BASELINE.dealerOrder, ['za-motors', 'wadishee-used-cars', 'granada-auto-sales']);
  assert.equal(Object.values(M1_VISUAL_BASELINE.dealers).reduce((sum, row) => sum + row.screenshots.length, 0), 54);
});

test('successful report labels cannot substitute changed image bytes or a relabelled M1 baseline', t => {
  const f = evidence(t);assert.equal(readDealerPackScreenshotEvidence({...f, baseline: true}).screenshots.length, 18);
  fs.appendFileSync(path.join(f.directory, f.qa.proof.screenshots[0].path), 'changed');
  assert.throws(() => readDealerPackScreenshotEvidence(f), /screenshot bytes changed/);
  const other = evidence(t);other.build.sourceCommit = 'd'.repeat(40);writeJson(path.join(other.directory, 'build-report.json'), other.build);
  assert.throws(() => readDealerPackScreenshotEvidence({...other, baseline: true}), /not final green M1/);
  const relabelled = evidence(t);relabelled.qa.finishedAt = 'changed label';writeJson(path.join(relabelled.directory, 'qa-report.json'), relabelled.qa);
  assert.throws(() => readDealerPackScreenshotEvidence({...relabelled, baseline: true}), /authenticated final green corpus/);
});

test('failed QA, missing or duplicated designs, stale build bindings and unfinished screenshots fail independently', t => {
  for (const mutate of [
    f => f.qa.success = false,
    f => f.qa.checks[0].status = 'failed',
    f => f.qa.proof.screenshots.pop(),
    f => f.qa.proof.screenshots[1] = f.qa.proof.screenshots[0],
    f => f.qa.outputDigest = 'f'.repeat(64),
    f => f.qa.execution = {...f.qa.execution, attempt: '1'},
    f => f.qa.routes[0].screenshotPreparation.returnedToTop = false,
    f => f.qa.routes[0].screenshotPreparation.fonts = 'pending'
  ]) {
    const f = evidence(t);mutate(f);writeJson(path.join(f.directory, 'qa-report.json'), f.qa);
    assert.throws(() => readDealerPackScreenshotEvidence(f), /requires|failed|differs|prepared home/);
  }
});

test('screenshot evidence refuses path traversal, links and capture scale changes', t => {
  const escaped = evidence(t);escaped.qa.proof.screenshots[0].path = '../elsewhere.png';writeJson(path.join(escaped.directory, 'qa-report.json'), escaped.qa);
  assert.throws(() => readDealerPackScreenshotEvidence(escaped), /unexpected screenshot/);
  const linked = evidence(t), filename = path.join(linked.directory, linked.qa.proof.screenshots[0].path);
  fs.unlinkSync(filename);fs.symlinkSync(path.join(linked.directory, linked.qa.proof.screenshots[1].path), filename);
  assert.throws(() => readDealerPackScreenshotEvidence(linked), /linked evidence/);
  const scaled = evidence(t), row = scaled.qa.proof.screenshots[0], bytes = fs.readFileSync(path.join(scaled.directory, row.path));
  bytes.writeUInt32BE(row.width * 2, 16);fs.writeFileSync(path.join(scaled.directory, row.path), bytes);row.sha256 = sha256(bytes);writeJson(path.join(scaled.directory, 'qa-report.json'), scaled.qa);
  assert.throws(() => readDealerPackScreenshotEvidence(scaled), /unexpected screenshot dimensions/);
});

function fabFixture() {
  const before = {consumer: 'fab', visible: true, loaded: true, width: 46, height: 34, dealerFabLogo: true,
    sha256: M1_VISUAL_BASELINE.dealers['za-motors'].fabLogoSha256};
  const after = {...before, dealerFabLogo: false, sha256: fleetDesignFabHashes()['auto-best'], bounds: {x: 324, y: 780.5, width: 46, height: 34}};
  return {baseline: {slug: 'za-motors', qa: {}}, candidate: {qa: {fabPolicy: 'fleet-design-mark-v1'}},
    baselineRow: {key: 'auto-best', width: 390, observation: {fabMarks: [before]}}, candidateRow: {key: 'auto-best', width: 390, observation: {fabMarks: [after]}}};
}

test('the FAB exception binds the exact active artwork and only its observed 46 by 34 CSS-pixel rectangle', () => {
  const f = fabFixture(), value = dealerPackFabArtworkException(f);
  assert.deepEqual(value.rectangle, {x: 324, y: 780, width: 46, height: 35});
  assert.equal(value.beforeSha256, M1_VISUAL_BASELINE.dealers['za-motors'].fabLogoSha256);
  for (const mutate of [
    f => f.candidate.qa.fabPolicy = 'arbitrary-change',
    f => f.candidateRow.observation.fabMarks[0].sha256 = fleetDesignFabHashes().modern,
    f => f.candidateRow.observation.fabMarks[0].bounds.width = 58,
    f => f.candidateRow.observation.fabMarks[0].bounds.x--,
    f => f.candidateRow.observation.fabMarks[0].bounds.y = 100,
    f => f.candidateRow.observation.fabMarks[0].loaded = false,
    f => f.baselineRow.observation.fabMarks[0].dealerFabLogo = false
  ]) {const changed = fabFixture();mutate(changed);assert.throws(() => dealerPackFabArtworkException(changed), /FAB|artwork/);}
});

test('the CLI accepts no arbitrary masks, colour threshold, pixel budget or duplicate exception', () => {
  const options = ['--baseline', 'old', '--candidate', 'new', '--out', 'result'];
  assert.deepEqual(parseDealerPackScreenshotComparisonArgs(options), {baseline: 'old', candidate: 'new', out: 'result', allowFabCorrection: false});
  assert.equal(parseDealerPackScreenshotComparisonArgs([...options, '--allow-fab-correction']).allowFabCorrection, true);
  for (const extra of [['--mask', '0,0,100,100'], ['--threshold', '0.2'], ['--max-diff-pixels', '100'], ['--allow-fab-correction', '--allow-fab-correction']]) {
    assert.throws(() => parseDealerPackScreenshotComparisonArgs([...options, ...extra]), /unknown|duplicate/);
  }
});

let tools, unavailable;
try {tools = loadDealerPackVisualTools();} catch (error) {if (/Existing (?:sharp|playwright-core) dependency required/.test(error.message)) unavailable = error.message;else throw error;}
const raster = {skip: unavailable};
const png = async (data, width, height) => tools.sharp(data, {raw: {width, height, channels: 4}}).png().toBuffer();
const canvas = (width, height, colour = 255) => {const data = Buffer.alloc(width * height * 4, colour);for (let i = 3; i < data.length; i += 4) data[i] = 255;return data;};
const pixel = (data, width, x, y, colour) => {for (let channel = 0; channel < 3; channel++) data[(y * width + x) * 4 + channel] = colour[channel];};

test('real final M1 navigation captures differ by three edge-antialiasing pixels and pass at zero threshold', raster, async () => {
  // Exact 22×22 crops at x53,y846 of ZA Signature 320px in final green M1
  // run39284983471 attempts2 and1. The entire source images are corpus-pinned.
  const baselineBytes = fs.readFileSync(new URL('./fixtures/dealer-pack-m1-signature-aa-before.png', import.meta.url));
  const candidateBytes = fs.readFileSync(new URL('./fixtures/dealer-pack-m1-signature-aa-after.png', import.meta.url));
  const result = await compareDealerPackPngs({baselineBytes, candidateBytes, tools});
  assert.equal(result.status, 'antialiasing-only');assert.equal(result.rawDifferentPixels, 3);assert.equal(result.antialiasingPixels, 3);assert.equal(result.unexpectedPixels, 0);
});

test('a one-level colour change, moved layout and changed dimensions cannot hide in a tolerance', raster, async () => {
  const width = 80, height = 80, white = canvas(width, height), baselineBytes = await png(white, width, height);
  assert.equal((await compareDealerPackPngs({baselineBytes, candidateBytes: baselineBytes, tools})).status, 'identical');
  const colour = Buffer.from(white);pixel(colour, width, 40, 40, [255, 255, 254]);
  const subtle = await compareDealerPackPngs({baselineBytes, candidateBytes: await png(colour, width, height), tools});
  assert.equal(subtle.status, 'failed');assert.equal(subtle.unexpectedPixels, 1);
  const left = Buffer.from(white), right = Buffer.from(white);
  for (let y = 30; y < 50; y++) for (let x = 30; x < 50; x++) {pixel(left, width, x, y, [0, 0, 0]);pixel(right, width, x + 1, y, [0, 0, 0]);}
  const moved = await compareDealerPackPngs({baselineBytes: await png(left, width, height), candidateBytes: await png(right, width, height), tools});
  assert.equal(moved.status, 'failed');assert.equal(moved.unexpectedPixels, 40);
  const resized = await compareDealerPackPngs({baselineBytes, candidateBytes: await png(canvas(width + 1, height), width + 1, height), tools});
  assert.equal(resized.status, 'failed');assert.deepEqual(resized.findings, ['dimensions-changed']);
});

test('a permitted FAB replacement cannot hide a changed button, badge or any other page pixel', raster, async () => {
  const width = 390, height = 900, before = canvas(width, height), after = canvas(width, height);
  const exception = dealerPackFabArtworkException(fabFixture());
  for (let y = 789; y < 799; y++) for (let x = 339; x < 349; x++) {pixel(before, width, x, y, [0, 0, 0]);pixel(after, width, x, y, [200, 0, 0]);}
  const baselineBytes = await png(before, width, height);
  const corrected = await compareDealerPackPngs({baselineBytes, candidateBytes: await png(after, width, height), exception, tools});
  assert.equal(corrected.status, 'fleet-fab-correction-only');assert.equal(corrected.authorizedFabPixels, 100);assert.equal(corrected.unexpectedPixels, 0);
  for (const [x, y] of [[323, 790], [375, 770], [150, 400]]) {
    const changed = Buffer.from(after);pixel(changed, width, x, y, [20, 30, 40]);
    const result = await compareDealerPackPngs({baselineBytes, candidateBytes: await png(changed, width, height), exception, tools});
    assert.equal(result.status, 'failed');assert.equal(result.authorizedFabPixels, 100);assert.equal(result.unexpectedPixels, 1);
  }
  await assert.rejects(compareDealerPackPngs({baselineBytes, candidateBytes: baselineBytes, exception: {...exception, rectangle: {x: 0, y: 0, width, height}}, tools}), /invalid bound FAB/);
});
