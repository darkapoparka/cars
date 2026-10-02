import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {auditVercelServices} from './audit-vercel-services.mjs';
function fixture(t, keys = ['auto-best', 'modern', 'carwow', 'app', 'mobile']) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-services-audit-'));
  t.after(() => fs.rmSync(root, {recursive: true, force: true}));
  const outputs = {};
  for (const key of keys) {
    const out = path.join(root, key, '.vercel/output'); outputs[key] = out;
    fs.mkdirSync(path.join(out, 'static'), {recursive: true});
    fs.mkdirSync(path.join(out, 'functions/page.func'), {recursive: true});
    fs.writeFileSync(path.join(out, 'config.json'), JSON.stringify({version: 3}));
    fs.writeFileSync(path.join(out, 'static/hero.webp'), '12345');
    fs.writeFileSync(path.join(out, 'functions/page.func/index.js'), '1234567');
  }
  return {root, outputs, manifest: {variants: keys.map(key => ({key}))}};
}
test('all five actual service outputs are counted together, not granted separate project ceilings', t => {
  const {manifest, outputs} = fixture(t); const report = auditVercelServices(manifest, outputs);
  assert.equal(report.passed, true); assert.equal(report.services.length, 5);
  assert.equal(report.staticBytes, 25); assert.equal(report.functionBytes, 35);
  const tooSmall = report.totalBytes - 1;
  const failed = auditVercelServices(manifest, outputs, {maxBytes: tooSmall});
  assert.equal(failed.passed, false); assert.ok(failed.services.every(s => s.passed));
});
test('Import combination is supported without approving any fifth template', t => {
  const {manifest, outputs} = fixture(t, ['auto-best', 'import', 'carwow', 'app', 'boxcar-updated']);
  const before = JSON.stringify(manifest); assert.equal(auditVercelServices(manifest, outputs).passed, true);
  assert.equal(JSON.stringify(manifest), before);
});
test('missing fifth output, unknown service and duplicate roots cannot appear complete', t => {
  const {manifest, outputs} = fixture(t); const missing = {...outputs}; delete missing.mobile;
  assert.throws(() => auditVercelServices(manifest, missing), /every declared/);
  assert.throws(() => auditVercelServices(manifest, {...outputs, extra: outputs.app}), /every declared/);
  assert.throws(() => auditVercelServices(manifest, {...outputs, mobile: outputs.app}), /non-overlapping/);
  assert.throws(() => auditVercelServices(manifest, {...outputs, mobile: path.join(outputs.app, 'static')}), /non-overlapping/);
});
test('individual function limits and unexpected secrets reject the combined artifact', t => {
  const {manifest, outputs} = fixture(t);
  assert.equal(auditVercelServices(manifest, outputs, {maxFunctionBytes: 6}).passed, false);
  fs.writeFileSync(path.join(outputs.app, 'functions/page.func/.env'), 'PRIVATE=example');
  assert.equal(auditVercelServices(manifest, outputs).passed, false);
});
test('CLI writes only an explicit new report outside final outputs', t => {
  const {root, manifest, outputs} = fixture(t); const m = path.join(root, 'dealer.json'), o = path.join(root, 'outputs.json');
  fs.writeFileSync(m, JSON.stringify(manifest)); fs.writeFileSync(o, JSON.stringify(outputs));
  const cli = new URL('./audit-vercel-services.mjs', import.meta.url);
  const call = report => spawnSync(process.execPath, [fileURLToPath(cli), m, o, report], {encoding: 'utf8'});
  const report = path.join(root, 'report.json'); assert.equal(call(report).status, 0);
  const original = fs.readFileSync(report); assert.equal(call(report).status, 1); assert.deepEqual(fs.readFileSync(report), original);
  assert.equal(call(path.join(outputs.mobile, 'new-report.json')).status, 1);
  assert.equal(fs.existsSync(path.join(outputs.mobile, 'new-report.json')), false);
});
