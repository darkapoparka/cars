import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fastWorkspaceKey, syncFastWorkspace, verifyFastWorkspaceInputs, cachedCompositionCompiler, settledLanes} from './lib/dealer-pack-fast-workspace.mjs';

const binding = {releaseDigest: 'a'.repeat(64), toolDigest: 'b'.repeat(64), nodes: {app: '22.23.2'}};
test('release workspace keys exclude dealer and commit but bind runtime and actual tools', () => {
  const key = fastWorkspaceKey(binding);
  assert.equal(key, fastWorkspaceKey({...binding, sourceCommit: 'c'.repeat(40), dealer: 'other'}));
  assert.notEqual(key, fastWorkspaceKey({...binding, releaseDigest: 'd'.repeat(64)}));
  assert.notEqual(key, fastWorkspaceKey({...binding, toolDigest: 'e'.repeat(64)}));
  assert.notEqual(key, fastWorkspaceKey({...binding, nodes: {app: '24.21.0'}}));
});
test('successive dealers replace identity and remove stale stock while retaining dependencies', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-fast-workspace-'));t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  const common = {directory, workspaceKey: fastWorkspaceKey(binding), family: 'app'};
  const first = syncFastWorkspace({...common, files: new Map([['app/lib/dealer.json', Buffer.from('{"name":"First"}')], ['app/public/first-stock.webp', Buffer.from('FIRST')], ['app/common.ts', Buffer.from('same')]])});
  fs.mkdirSync(path.join(directory, 'app/node_modules/package'), {recursive: true});fs.writeFileSync(path.join(directory, 'app/node_modules/package/index.js'), 'dependency');
  const second = syncFastWorkspace({...common, files: new Map([['app/lib/dealer.json', Buffer.from('{"name":"Second"}')], ['app/public/second-stock.webp', Buffer.from('SECOND')], ['app/common.ts', Buffer.from('same')]])});
  assert.equal(first.reusedWorkspace, false);assert.equal(second.reusedWorkspace, true);assert.equal(second.removed, 1);assert.equal(second.unchanged, 1);
  assert.equal(fs.existsSync(path.join(directory, 'app/public/first-stock.webp')), false);
  assert.equal(fs.readFileSync(path.join(directory, 'app/lib/dealer.json'), 'utf8'), '{"name":"Second"}');
  assert.equal(fs.readFileSync(path.join(directory, 'app/node_modules/package/index.js'), 'utf8'), 'dependency');
  verifyFastWorkspaceInputs({directory, files: second.files});
  fs.writeFileSync(path.join(directory, 'app/foreign-dealer.ts'), 'const name="First"');
  assert.throws(() => verifyFastWorkspaceInputs({directory, files: second.files}), /Undeclared generated source/);
  fs.unlinkSync(path.join(directory, 'app/foreign-dealer.ts'));
  fs.writeFileSync(path.join(directory, 'app/lib/dealer.json'), '{"name":"First"}');
  assert.throws(() => verifyFastWorkspaceInputs({directory, files: second.files}), /Changed generated input/);
});
test('linked paths and foreign workspace ownership fail closed', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-fast-workspace-'));t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  const common = {directory, workspaceKey: fastWorkspaceKey(binding), family: 'app', files: new Map([['app/data.json', Buffer.from('{}')]])};
  syncFastWorkspace(common);
  assert.throws(() => syncFastWorkspace({...common, family: 'mobile'}), /Foreign or changed/);
  fs.unlinkSync(path.join(directory, 'app/data.json'));fs.symlinkSync('/tmp', path.join(directory, 'app/data.json'));
  assert.throws(() => syncFastWorkspace(common), /Linked generated workspace/);
});
test('composition cache cannot reuse changed dealer constants, scopes, options or corrupt entries', () => {
  let calls = 0;const cache = new Map();
  const compiler = cachedCompositionCompiler({version: '0.28.2', transformSync: (source, options) => ({code: source + JSON.stringify(options) + (++calls)})}, cache);
  assert.equal(compiler.transformSync('const dealer="First"', {format: 'esm'}).code, compiler.transformSync('const dealer="First"', {format: 'esm'}).code);
  compiler.transformSync('const dealer="Second"', {format: 'esm'});compiler.transformSync('const dealer="First"', {format: 'esm', banner: 'different scope'});
  assert.equal(calls, 3);assert.equal(compiler.statistics.hits, 1);
  cache.values().next().value.code = 'stale';assert.throws(() => compiler.transformSync('const dealer="First"', {format: 'esm'}), /Changed pure-transform/);
});
test('one invalid item is reported without dropping the rest of the bounded queue', async () => {
  let active = 0, peak = 0;
  const values = await settledLanes([1, 2, 3, 4], 2, async value => {active++;peak = Math.max(peak, active);await Promise.resolve();active--;if (value === 2) throw Error('bad pack');return value * 2;});
  assert.equal(peak, 2);assert.deepEqual(values.map(row => row.status), ['fulfilled', 'rejected', 'fulfilled', 'fulfilled']);assert.equal(values[3].value, 8);assert.equal(values[1].reason, 'bad pack');
});
