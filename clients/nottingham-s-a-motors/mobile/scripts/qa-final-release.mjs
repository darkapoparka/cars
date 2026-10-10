import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.env.QA_OUTPUT || 'reference/web/live-final-20260928/release';
const base = process.env.QA_URL || 'http://127.0.0.1:6425';
const buildFile = process.env.QA_BUILD_FILE || '.next-review/BUILD_ID';
fs.mkdirSync(root, { recursive: true });
const buildId = fs.readFileSync(buildFile, 'utf8').trim();
const sourceBase = spawnSync('git', ['rev-parse', 'HEAD'], {
  encoding: 'utf8',
  windowsHide: true,
}).stdout.trim();
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
function sourceManifest() {
  return Object.fromEntries(
    fs
      .readdirSync('src', { recursive: true })
      .filter((file) => /\.(tsx?|css|json)$/.test(file))
      .sort()
      .map((file) => [file.replaceAll('\\', '/'), hash(fs.readFileSync(path.join('src', file)))]),
  );
}
const sources = sourceManifest();
function assetManifest() {
  return Object.fromEntries(
    fs
      .readdirSync('public', { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(entry.parentPath || entry.path, entry.name))
      .sort()
      .map((file) => [
        path.relative('public', file).replaceAll('\\', '/'),
        hash(fs.readFileSync(file)),
      ]),
  );
}
const assets = assetManifest();
const suites = [
  ['live-reference', 'qa-live-reference.mjs'],
  ['parity-followup', 'qa-parity-followup.mjs'],
  ['make-model', 'qa-make-model.mjs'],
  ['make-catalog', 'qa-make-catalog.mjs'],
  ['make-visual', 'qa-make-model-visual.mjs'],
  ['geometry', 'qa-overlays.mjs'],
  ['overlay-flows', 'qa-overlay-interactions.mjs'],
  ['contracts', 'qa-reference-contracts.mjs'],
  ['resources', 'qa-native-resources.mjs'],
  ['enquiry', 'qa-enquiry.mjs'],
  ['interactions', 'qa-interactions.mjs'],
  ['state', 'qa-state.mjs'],
  ['all-filters', 'qa-filter-coverage.mjs'],
  ['filter-flows', 'qa-parity.mjs'],
  ['icons', 'qa-icon-assets.mjs'],
  ['filter-visual', 'compare-filter-surfaces.mjs'],
  ['visual', 'qa-visual.mjs'],
  ['final-polish', 'qa-final-polish.mjs'],
];
const results = [];
const env = { ...process.env, QA_URL: base, QA_ASSERT: '1' };
delete env.QA_TEST;
delete env.NEXT_DIST_DIR;
const prepared = spawnSync(process.execPath, ['scripts/prepare-domain-tests.mjs'], {
  stdio: 'inherit',
  env,
  timeout: 120000,
  windowsHide: true,
});
if (prepared.status !== 0) throw Error('Could not prepare domain/resource test modules');
for (const [name, script] of suites) {
  const started = Date.now();
  const log = path.join(root, name + '.log');
  const fd = fs.openSync(log, 'w');
  const result = spawnSync(process.execPath, ['scripts/' + script], {
    env: { ...env, QA_OUTPUT: root + '/' + name },
    stdio: ['ignore', fd, fd],
    timeout: 360000,
    windowsHide: true,
  });
  fs.closeSync(fd);
  results.push({
    name,
    exitCode: result.status,
    durationMs: Date.now() - started,
    error: result.error?.message,
    logSha256: hash(fs.readFileSync(log)),
  });
  fs.writeFileSync(
    root + '/suite-status.json',
    JSON.stringify({ at: new Date().toISOString(), base, buildId, sourceBase, results }, null, 2),
  );
  console.log(
    name,
    result.status === 0 ? 'PASS' : 'FAIL',
    Math.round((Date.now() - started) / 1000) + 's',
  );
  if (result.status !== 0) console.log(fs.readFileSync(log, 'utf8').slice(-4000));
}
const buildUnchanged = fs.readFileSync(buildFile, 'utf8').trim() === buildId;
const sourceUnchanged = JSON.stringify(sourceManifest()) === JSON.stringify(sources);
const assetsUnchanged = JSON.stringify(assetManifest()) === JSON.stringify(assets);
const reports = Object.fromEntries(
  fs
    .readdirSync(root, { recursive: true })
    .filter((file) => /\.json$/.test(file) && !file.endsWith('acceptance-receipt.json'))
    .sort()
    .map((file) => [file.replaceAll('\\', '/'), hash(fs.readFileSync(path.join(root, file)))]),
);
const accepted =
  buildUnchanged &&
  sourceUnchanged &&
  assetsUnchanged &&
  results.every((result) => result.exitCode === 0);
fs.writeFileSync(
  root + '/acceptance-receipt.json',
  JSON.stringify(
    {
      at: new Date().toISOString(),
      base,
      buildId,
      sourceBase,
      accepted,
      buildUnchanged,
      sourceUnchanged,
      assetsUnchanged,
      assets,
      suitesPassed: results.filter((result) => result.exitCode === 0).length,
      suitesTotal: suites.length,
      sources,
      reports,
      results,
      nativeEvidence:
        'Live Android 10.26 captures from emulator-5554 under reference/web/live-final-20260928, plus named saved native selector references in existing suites.',
      scope:
        'Local interface regression and captured-state review, not whole-app pixel identity or live-service acceptance.',
    },
    null,
    2,
  ),
);
console.log(
  'FINAL_RELEASE',
  accepted ? 'PASS' : 'FAIL',
  results.filter((result) => result.exitCode === 0).length + '/' + suites.length,
  buildId,
);
if (!accepted) process.exitCode = 1;
