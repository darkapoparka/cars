import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root = 'reference/web/make-model-release';
const base = process.env.QA_URL || 'http://127.0.0.1:6424';
fs.mkdirSync(root, { recursive: true });
const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8').trim();
const cases = [
  ['make-model','qa-make-model.mjs'],
  ['make-catalog','qa-make-catalog.mjs'],
  ['make-visual','qa-make-model-visual.mjs'],
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
];
const results = [];
for (const [name, script] of cases) {
  const log = path.join(root, name + '.log');
  const fd = fs.openSync(log, 'w');
  const result = spawnSync(process.execPath, ['scripts/' + script], {
    env: { ...process.env, QA_URL: base, QA_OUTPUT: root + '/' + name, QA_ASSERT: '1' },
    stdio: ['ignore', fd, fd],
    timeout: 360000,
    windowsHide: true,
  });
  fs.closeSync(fd);
  results.push({ name, exitCode: result.status, error: result.error?.message });
  fs.writeFileSync(
    root + '/suite-status.json',
    JSON.stringify({ at: new Date().toISOString(), base, buildId, results }, null, 2),
  );
  console.log(name, result.status === 0 ? 'PASS' : 'FAIL', result.error?.message || '');
  if (result.status !== 0) {
    console.log(fs.readFileSync(log, 'utf8').slice(-3000));
    process.exitCode = 1;
  }
}
if (fs.readFileSync('.next/BUILD_ID', 'utf8').trim() !== buildId)
  throw Error('Build changed during acceptance');
console.log(
  'MAKE_MODEL_RELEASE',
  results.filter((r) => r.exitCode === 0).length + '/' + results.length,
  'BUILD',
  buildId,
);
