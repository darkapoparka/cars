/** Strict visual comparison against the final green M1 evidence.
 *
 * No resizing, layout tolerance, global colour threshold, or caller-defined masks
 * are accepted. The optional M2 fleet-mark correction covers only the measured
 * 46×34 CSS-pixel FAB artwork; its button, count, shadow and page remain checked.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {sha256, writeJson} from './lib/workflow.mjs';
import {canonicalPackJson} from './lib/dealer-pack-artifacts.mjs';
import {SIX_DESIGN_KEYS} from './lib/six-design-release.mjs';
import {fleetDesignFabHashes} from './lib/dealer-pack-switcher-logo.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const assert = (condition, message) => {if (!condition) throw Error('Dealer pack visual comparison: ' + message);};
const WIDTHS = Object.freeze([320, 390, 1280]);
const EXPECTED_CASES = SIX_DESIGN_KEYS.flatMap(key => WIDTHS.map(width => key + ':' + width + ':home'));
const identity = row => row.key + ':' + row.width + ':' + (row.route ?? row.label);
const isHash = value => /^[a-f0-9]{64}$/.test(value ?? '');
const same = (left, right) => canonicalPackJson(left) === canonicalPackJson(right);
export const M1_VISUAL_BASELINE = JSON.parse(fs.readFileSync(new URL('./fixtures/dealer-pack-m1-visual-baseline.json', import.meta.url), 'utf8'));
export const VISUAL_COMPARISON_POLICY = Object.freeze({
  comparator: 'playwright-core/1.62.1 pixelmatch', threshold: 0, maxDiffPixels: 0,
  includeAntialiasingInFailure: false, equalDimensionsRequired: true, resizing: false,
  allowedException: 'explicit fleet-design-mark-v1 artwork only', callerDefinedMasks: false,
  diffColours: {unexpected: '#ff0000', antialiasing: '#ffff00', authorizedFabArtwork: '#00b7ff'}
});

function regularEvidenceFile(directory, relative) {
  assert(typeof relative === 'string' && relative && !path.isAbsolute(relative) && !relative.includes('\\') &&
    relative.split('/').every(part => part && part !== '.' && part !== '..'), 'unsafe evidence path');
  const base = path.resolve(directory), file = path.join(base, relative);
  assert(fs.existsSync(base) && fs.lstatSync(base).isDirectory() && !fs.lstatSync(base).isSymbolicLink(), 'missing or linked evidence directory');
  for (let cursor = file; cursor !== base; cursor = path.dirname(cursor)) {
    assert(fs.existsSync(cursor) && !fs.lstatSync(cursor).isSymbolicLink(), 'missing or linked evidence member: ' + relative);
  }
  const stat = fs.lstatSync(file);
  assert(stat.isFile() && stat.size > 0 && stat.size <= 32 * 1024 ** 2, 'evidence must be a bounded regular file: ' + relative);
  return file;
}

/** Report labels are insufficient: bind successful build/QA identities and all
 * 18 image bytes. For M1, additionally bind the authenticated immutable corpus. */
export function readDealerPackScreenshotEvidence({directory, baseline = false, corpus = M1_VISUAL_BASELINE}) {
  const buildBytes = fs.readFileSync(regularEvidenceFile(directory, 'build-report.json'));
  const qaBytes = fs.readFileSync(regularEvidenceFile(directory, 'qa-report.json'));
  const build = JSON.parse(buildBytes), qa = JSON.parse(qaBytes), slug = qa.slug;
  assert(build.status === 'passed' && qa.type === 'cars-dealer-pack-qa' && qa.success === true &&
    build.slug === slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? ''), 'requires a successful matching dealer build and QA');
  assert(/^[a-f0-9]{40}$/.test(build.sourceCommit ?? ''), 'missing exact build source commit');
  for (const field of ['packDigest', 'releaseDigest', 'outputDigest']) {
    assert(isHash(build[field]) && build[field] === qa[field], 'build/QA ' + field + ' differs');
  }
  assert(build.execution && same(build.execution, qa.execution), 'build/QA execution differs');
  assert(Array.isArray(qa.checks) && qa.checks.length > 0 && qa.checks.every(row => row.status === 'passed'), 'QA contains an incomplete or failed check');
  for (const id of ['bundle-integrity', 'rendered-routes', 'screenshots', 'bundle-unchanged']) {
    assert(qa.checks.filter(row => row.id === id).length === 1, 'missing bound QA check: ' + id);
  }
  const screenshots = qa.proof?.screenshots;
  assert(Array.isArray(screenshots) && screenshots.length === EXPECTED_CASES.length &&
    new Set(screenshots.map(identity)).size === EXPECTED_CASES.length &&
    screenshots.every(row => EXPECTED_CASES.includes(identity(row))), 'requires exactly six designs at 320, 390 and 1280 pixels');
  const pin = corpus.dealers[slug];
  if (baseline) {
    assert(pin && build.sourceCommit === corpus.sourceCommit && qa.execution.kind === 'github-actions' &&
      qa.execution.repository === corpus.repository && qa.execution.runId === corpus.runId && qa.execution.attempt === corpus.attempt,
    'baseline is not final green M1 run ' + corpus.runId + ' attempt ' + corpus.attempt);
    assert(sha256(buildBytes) === pin.buildReportSha256 && sha256(qaBytes) === pin.qaReportSha256,
      'M1 evidence changed from the authenticated final green corpus');
  }
  const rows = screenshots.map(row => {
    assert(row.path === 'screenshots/' + row.key + '-' + row.width + '-home.png' && isHash(row.sha256), 'unexpected screenshot identity or path');
    const filename = regularEvidenceFile(directory, row.path), bytes = fs.readFileSync(filename);
    assert(sha256(bytes) === row.sha256, 'screenshot bytes changed: ' + row.path);
    assert(bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'screenshot is not a PNG');
    const pixels = {width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20)};
    assert(pixels.width === row.width && pixels.height >= 900 && pixels.width * pixels.height <= 32_000_000, 'unexpected screenshot dimensions');
    const observations = (qa.routes ?? []).filter(route => identity(route) === identity(row));
    assert(observations.length === 1 && observations[0].status === 'passed' && observations[0].httpStatus === 200 &&
      observations[0].screenshotPreparation?.status === 'passed' && observations[0].screenshotPreparation?.fonts === 'loaded' &&
      observations[0].screenshotPreparation?.returnedToTop === true, 'missing successful prepared home observation: ' + identity(row));
    if (baseline) {
      const expected = pin.screenshots.find(value => identity(value) === identity(row));
      assert(expected && expected.sha256 === row.sha256 && same(expected.pixels, pixels), 'M1 screenshot is outside the pinned corpus');
    }
    return {...row, filename, pixels, observation: observations[0]};
  });
  return {directory: path.resolve(directory), slug, build, qa, screenshots: rows,
    evidence: {slug, sourceCommit: build.sourceCommit, packDigest: build.packDigest, releaseDigest: build.releaseDigest,
      outputDigest: build.outputDigest, execution: build.execution, buildReportSha256: sha256(buildBytes), qaReportSha256: sha256(qaBytes)}};
}

/** The exception cannot be supplied as an arbitrary rectangle. The observed
 * loaded active-design artwork and retained CSS geometry must both agree. */
export function dealerPackFabArtworkException({baseline, candidate, baselineRow, candidateRow, designHashes = fleetDesignFabHashes()}) {
  assert(candidate.qa.fabPolicy === 'fleet-design-mark-v1' &&
    (!baseline.qa.fabPolicy || baseline.qa.fabPolicy === 'dealer-pack-reviewed-mark-v1'), 'FAB exception requires the explicit M1-to-fleet policy correction');
  const before = baselineRow.observation.fabMarks ?? [], after = candidateRow.observation.fabMarks ?? [];
  assert(before.length === 1 && after.length === 1, 'FAB exception requires exactly one image in each observation');
  const old = before[0], current = after[0], bounds = current.bounds;
  assert(old.consumer === 'fab' && old.visible === true && old.loaded === true && old.dealerFabLogo === true &&
    old.sha256 === M1_VISUAL_BASELINE.dealers[baseline.slug]?.fabLogoSha256, 'baseline FAB is not the verified M1 dealer artwork');
  assert(current.consumer === 'fab' && current.visible === true && current.loaded === true &&
    current.sha256 === designHashes[candidateRow.key], 'candidate FAB is not the exact active fleet design artwork');
  assert(old.width === 46 && old.height === 34 && current.width === 46 && current.height === 34 && bounds &&
    ['x', 'y', 'width', 'height'].every(key => Number.isFinite(bounds[key])) && bounds.width === 46 && bounds.height === 34,
  'FAB exception requires the measured 46 by 34 CSS-pixel artwork');
  const desktop = candidateRow.width >= 992, expectedX = candidateRow.width - (desktop ? 24 : 14) - 52;
  assert(bounds.x === expectedX && bounds.y >= 390 && bounds.y + bounds.height <= 884 &&
    (!desktop || bounds.y === 758), 'FAB artwork moved outside the retained switcher geometry');
  const rectangle = {x: Math.floor(bounds.x), y: Math.floor(bounds.y),
    width: Math.ceil(bounds.x + bounds.width) - Math.floor(bounds.x), height: Math.ceil(bounds.y + bounds.height) - Math.floor(bounds.y)};
  assert(rectangle.width <= 47 && rectangle.height <= 35, 'FAB exception exceeds the observed artwork raster');
  return {policy: 'fleet-design-mark-v1', bounds, rectangle, beforeSha256: old.sha256, afterSha256: current.sha256,
    checkedOutsideArtwork: 'button border, badge, shadow and every other page pixel'};
}

function resolvePackage(root, name, environmentRoot) {
  const candidates = [process.env.CARS_QA_RESOLVE_FROM, environmentRoot && path.resolve(environmentRoot, 'package.json'),
    path.resolve(root, 'runtime/dealer-pack-preview-tools/package.json'), path.resolve(root, 'runtime/dealer-pack-tools/package.json')].filter(Boolean);
  for (const candidate of candidates) {
    const require = createRequire(path.resolve(candidate));
    try {
      let packagePath;
      try {packagePath = require.resolve(name + '/package.json');}
      catch (error) {
        if (error.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error;
        let directory = path.dirname(require.resolve(name));
        while (directory !== path.dirname(directory)) {
          const possible = path.join(directory, 'package.json');
          if (fs.existsSync(possible) && JSON.parse(fs.readFileSync(possible)).name === name) {packagePath = possible;break;}
          directory = path.dirname(directory);
        }
        assert(packagePath, 'cannot locate pinned dependency package: ' + name);
      }
      return {require, packagePath};
    } catch (error) {if (error.code !== 'MODULE_NOT_FOUND') throw error;}
  }
  throw Error('Existing ' + name + ' dependency required for strict visual comparison');
}

export function loadDealerPackVisualTools({root = ROOT} = {}) {
  const sharpPackage = resolvePackage(root, 'sharp', process.env.CARS_SHARP_ROOT);
  const playwright = resolvePackage(root, 'playwright-core', process.env.CARS_PLAYWRIGHT_ROOT);
  assert(JSON.parse(fs.readFileSync(sharpPackage.packagePath)).version === '0.35.5', 'requires pinned sharp 0.35.5');
  assert(JSON.parse(fs.readFileSync(playwright.packagePath)).version === '1.62.1', 'requires pinned playwright-core 1.62.1');
  // The internal entry is deliberately version-pinned and checked, rather than
  // silently adopting a future comparator or its nonzero default threshold.
  const utils = playwright.require(path.join(path.dirname(playwright.packagePath), 'lib/coreBundle.js')).utils;
  assert(typeof utils?.getComparator === 'function', 'pinned Playwright comparator API changed');
  return {sharp: sharpPackage.require('sharp'), comparePng: utils.getComparator('image/png')};
}

/** Compare full opaque screenshots at their original resolution. Playwright's
 * edge-antialiasing classifier is used at a zero colour threshold. */
export async function compareDealerPackPngs({baselineBytes, candidateBytes, exception = null, tools = loadDealerPackVisualTools()}) {
  const {sharp, comparePng} = tools;
  const decode = bytes => sharp(bytes, {limitInputPixels: 32_000_000}).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const before = await decode(baselineBytes), after = await decode(candidateBytes);
  const size = info => ({width: info.width, height: info.height});
  if (before.info.width !== after.info.width || before.info.height !== after.info.height) {
    return {status: 'failed', findings: ['dimensions-changed'], baseline: size(before.info), candidate: size(after.info), diff: null};
  }
  const {width, height} = before.info, rectangle = exception?.rectangle;
  assert(before.info.channels === 4 && after.info.channels === 4, 'RGBA screenshot decoding failed');
  if (exception) {
    assert(exception.policy === 'fleet-design-mark-v1' && rectangle && Number.isInteger(rectangle.x) && Number.isInteger(rectangle.y) &&
      rectangle.width >= 46 && rectangle.width <= 47 && rectangle.height >= 34 && rectangle.height <= 35 && rectangle.x >= 0 && rectangle.y >= 0 &&
      rectangle.x + rectangle.width <= width && rectangle.y + rectangle.height <= Math.min(height, 900), 'invalid bound FAB artwork exception');
  }
  const within = (x, y) => rectangle && x >= rectangle.x && x < rectangle.x + rectangle.width && y >= rectangle.y && y < rectangle.y + rectangle.height;
  const comparable = rectangle ? Buffer.from(after.data) : after.data;
  let rawDifferentPixels = 0, authorizedFabPixels = 0;
  const changed = new Uint8Array(width * height);
  for (let i = 0; i < before.data.length; i += 4) {
    assert(before.data[i + 3] === 255 && after.data[i + 3] === 255, 'screenshots must be opaque browser captures');
    if (before.data[i] === after.data[i] && before.data[i + 1] === after.data[i + 1] && before.data[i + 2] === after.data[i + 2]) continue;
    const pixel = i / 4, x = pixel % width, y = Math.floor(pixel / width), authorized = within(x, y);
    rawDifferentPixels++; changed[pixel] = authorized ? 2 : 1;
    if (authorized) {authorizedFabPixels++; before.data.copy(comparable, i, i, i + 4);}
  }
  if (!rawDifferentPixels) return {status: 'identical', findings: [], width, height, rawDifferentPixels: 0, authorizedFabPixels: 0, antialiasingPixels: 0, unexpectedPixels: 0, diff: null};
  const comparablePng = rectangle ? await sharp(comparable, {raw: {width, height, channels: 4}}).png().toBuffer() : candidateBytes;
  const comparison = comparePng(comparablePng, baselineBytes, {comparator: 'pixelmatch', threshold: 0, maxDiffPixels: 0});
  let unexpectedPixels = 0, antialiasingPixels = 0, classified = null;
  if (comparison) {
    assert(Buffer.isBuffer(comparison.diff), 'pinned comparator did not return a difference image');
    classified = (await decode(comparison.diff)).data;
    for (let pixel = 0; pixel < changed.length; pixel++) {
      if (changed[pixel] !== 1) continue;
      const i = pixel * 4;
      if (classified[i] === 255 && classified[i + 1] === 0 && classified[i + 2] === 0) unexpectedPixels++;
      else if (classified[i] === 255 && classified[i + 1] === 255 && classified[i + 2] === 0) antialiasingPixels++;
      else assert(false, 'unclassified pixel difference at a zero colour threshold');
    }
    assert(unexpectedPixels > 0 && comparison.errorMessage.startsWith(unexpectedPixels + ' pixels '), 'pinned comparator count and image differ');
  } else antialiasingPixels = rawDifferentPixels - authorizedFabPixels;
  const diagnostic = Buffer.alloc(before.data.length);
  for (let i = 0; i < before.data.length; i += 4) {
    const grey = Math.round(0.1 * (before.data[i] * 0.299 + before.data[i + 1] * 0.587 + before.data[i + 2] * 0.114) + 229.5);
    diagnostic[i] = diagnostic[i + 1] = diagnostic[i + 2] = grey; diagnostic[i + 3] = 255;
  }
  for (let pixel = 0; pixel < changed.length; pixel++) {
    if (!changed[pixel]) continue;
    const i = pixel * 4, authorized = changed[pixel] === 2;
    const unexpected = !authorized && classified && classified[i] === 255 && classified[i + 1] === 0 && classified[i + 2] === 0;
    const colour = authorized ? [0, 183, 255] : unexpected ? [255, 0, 0] : [255, 255, 0];
    for (let channel = 0; channel < 3; channel++) diagnostic[i + channel] = colour[channel];
  }
  const diff = await sharp(diagnostic, {raw: {width, height, channels: 4}}).png().toBuffer();
  return {status: unexpectedPixels ? 'failed' : authorizedFabPixels ? (antialiasingPixels ? 'fleet-fab-correction-and-antialiasing' : 'fleet-fab-correction-only') : 'antialiasing-only',
    findings: unexpectedPixels ? ['pixels-changed-outside-antialiasing-and-authorized-artwork'] : [],
    width, height, rawDifferentPixels, authorizedFabPixels, antialiasingPixels, unexpectedPixels, diff};
}

export async function compareDealerPackScreenshots({baseline: baselineDirectory, candidate: candidateDirectory, out, allowFabCorrection = false, tools}) {
  const baseline = readDealerPackScreenshotEvidence({directory: baselineDirectory, baseline: true});
  const candidate = readDealerPackScreenshotEvidence({directory: candidateDirectory});
  assert(candidate.slug === baseline.slug, 'cannot compare different dealer identities');
  assert(same(candidate.build.sourceReleases, baseline.build.sourceReleases), 'selected immutable template releases changed');
  assert(typeof allowFabCorrection === 'boolean', 'FAB correction must be an explicit boolean');
  const directory = path.resolve(out);
  assert(!fs.existsSync(directory), 'comparison output must be a new directory');
  tools ??= loadDealerPackVisualTools();
  fs.mkdirSync(directory, {recursive: true});
  const report = {schemaVersion: 1, kind: 'cars-dealer-pack-m1-visual-comparison', slug: baseline.slug,
    startedAt: new Date().toISOString(), baseline: baseline.evidence, candidate: candidate.evidence,
    policy: {...VISUAL_COMPARISON_POLICY, fabCorrectionExplicitlyAllowed: allowFabCorrection}, screenshots: []};
  for (const baselineRow of baseline.screenshots) {
    const candidateRow = candidate.screenshots.find(row => identity(row) === identity(baselineRow));
    const row = {key: baselineRow.key, width: baselineRow.width, route: 'home', baselineSha256: baselineRow.sha256, candidateSha256: candidateRow.sha256};
    try {
      const exception = allowFabCorrection ? dealerPackFabArtworkException({baseline, candidate, baselineRow, candidateRow}) : null;
      const {diff, ...result} = await compareDealerPackPngs({baselineBytes: fs.readFileSync(baselineRow.filename), candidateBytes: fs.readFileSync(candidateRow.filename), exception, tools});
      Object.assign(row, result, {exception});
      if (diff) {row.diff = 'diffs/' + baselineRow.key + '-' + baselineRow.width + '-home.png';fs.mkdirSync(path.join(directory, 'diffs'), {recursive: true});fs.writeFileSync(path.join(directory, row.diff), diff, {flag: 'wx'});row.diffSha256 = sha256(diff);}
    } catch (error) {Object.assign(row, {status: 'failed', findings: [error.message]});}
    report.screenshots.push(row);
    writeJson(path.join(directory, 'comparison-report.json'), {...report, success: false, status: 'in-progress'});
  }
  report.success = report.screenshots.length === 18 && report.screenshots.every(row => row.status !== 'failed');
  report.status = report.success ? 'passed' : 'failed';
  report.totals = Object.fromEntries(['rawDifferentPixels', 'authorizedFabPixels', 'antialiasingPixels', 'unexpectedPixels'].map(key => [key, report.screenshots.reduce((sum, row) => sum + (row[key] ?? 0), 0)]));
  report.pixelIdentical = report.success && report.totals.rawDifferentPixels === 0;
  report.identicalApartFromAntialiasing = report.success && report.totals.authorizedFabPixels === 0;
  report.unchangedOutsideAuthorizedFabArtwork = report.success && allowFabCorrection;
  report.finishedAt = new Date().toISOString();
  writeJson(path.join(directory, 'comparison-report.json'), report);
  return report;
}

export function parseDealerPackScreenshotComparisonArgs(argv) {
  const options = {allowFabCorrection: false}, names = {'--baseline': 'baseline', '--candidate': 'candidate', '--out': 'out'};
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === '--allow-fab-correction') {assert(!options.allowFabCorrection, 'duplicate FAB option');options.allowFabCorrection = true;continue;}
    assert(Object.hasOwn(names, argument), 'unknown option: ' + argument);
    const name = names[argument];assert(!options[name] && argv[index + 1] && !argv[index + 1].startsWith('--'), 'missing or duplicate option: ' + argument);
    options[name] = argv[++index];
  }
  assert(options.baseline && options.candidate && options.out, 'use --baseline <M1 evidence> --candidate <M2 dealer output> --out <new comparison directory> [--allow-fab-correction]');
  return options;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const report = await compareDealerPackScreenshots(parseDealerPackScreenshotComparisonArgs(process.argv.slice(2)));
    process.stdout.write(JSON.stringify({slug: report.slug, status: report.status, totals: report.totals,
      pixelIdentical: report.pixelIdentical, identicalApartFromAntialiasing: report.identicalApartFromAntialiasing,
      unchangedOutsideAuthorizedFabArtwork: report.unchangedOutsideAuthorizedFabArtwork}, null, 2) + '\n');
    process.exitCode = report.success ? 0 : 1;
  } catch (error) {process.stderr.write(error.message + '\n');process.exitCode = 1;}
}
