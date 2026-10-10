import fs from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const dir = 'reference/web/overlay-release';
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const status = load(dir + '/suite-status.json');
assert.equal(status.results.length, 12);
assert(status.results.every((r) => r.exitCode === 0));
const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8').trim();
assert.equal(buildId, status.buildId);
const before = load('reference/web/overlay-before/report.json').report;
const after = load(dir + '/geometry/report.json').report;
const clipped = (rows) =>
  rows.filter((r) =>
    r.actions.some((a) => a.rect.top < r.rect.top || a.rect.bottom > r.rect.bottom + 1),
  ).length;
assert.equal(after.length, 18);
assert.equal(clipped(after), 0);
const reportPaths = [
  'geometry/report.json',
  'overlay-flows/report.json',
  'contracts/report.json',
  'resources/report.json',
  'enquiry/report.json',
  'interactions/report.json',
  'state/report.json',
  'all-filters/report.json',
  'filter-flows/filter-report.json',
  'icons/report.json',
  'filter-visual/comparison-report.json',
  'visual/report.json',
];
const reports = reportPaths.map((relative) => {
  const path = dir + '/' + relative;
  const bytes = fs.readFileSync(path);
  return { path, sha256: createHash('sha256').update(bytes).digest('hex') };
});
const receipt = {
  verifiedAt: new Date().toISOString(),
  buildId,
  preview: status.base,
  source: 'L:/inspiration/mobile-de-app',
  nativeAvd: 'L:/Android/avd/Pawtreon_Reference_Pixel_9_Pro_API_36.avd',
  nativeDevice: 'emulator-5554',
  sourceGate: 'lint, TypeScript, 36 domain tests, production build',
  suiteCount: status.results.length,
  overlayCombinations: after.length,
  clippedActionsBefore: clipped(before),
  clippedActionsAfter: 0,
  wholeAppOneToOne: false,
  reports,
};
fs.writeFileSync(dir + '/acceptance-receipt.json', JSON.stringify(receipt, null, 2) + '\n');
console.log(
  'VERIFIED_OVERLAY_RELEASE',
  JSON.stringify({
    buildId,
    suites: 12,
    phoneCombinations: 18,
    clippingBefore: clipped(before),
    clippingAfter: 0,
  }),
);
