import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { auditVercelOutput, auditNextTraces } from './publishing/vercel-output-budget.mjs';
function fixture(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-output-budget-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof content === 'string' ? content : JSON.stringify(content)); }
  return root;
}
test('final Vercel output separates static and functions while excluding unrelated build caches', t => {
  const root = fixture(t, { '.vercel/output/config.json': { version: 3 }, '.vercel/output/static/image.webp': 'photo', '.vercel/output/functions/showroom.func/handler.js': 'runtime', '.next/cache/build': 'not-deployed' });
  const report = auditVercelOutput(path.join(root, '.vercel/output'));
  assert.equal(report.passed, true); assert.equal(report.groups.find(g => g.name === 'static').bytes, 5);
  assert.equal(report.groups.find(g => g.name === 'functions/showroom.func').bytes, 7);
  assert.equal(auditVercelOutput(path.join(root, '.vercel/output'), { maxBytes: 1 }).passed, false);
  assert.equal(auditVercelOutput(path.join(root, '.vercel/output'), { maxFunctionBytes: 1 }).passed, false);
});
test('private files in final output and invalid byte ceilings fail closed', t => {
  const root = fixture(t, { 'config.json': { version: 3 }, 'functions/demo.func/.env': 'private-data' });
  assert.equal(auditVercelOutput(root).passed, false);
  assert.throws(() => auditVercelOutput(root, { maxBytes: -1 }), /Invalid/);
});
test('Next tracing budgets count shared dependencies once instead of multiplying every route', t => {
  const root = fixture(t, { '.next/BUILD_ID': 'review', 'runtime.mjs': '1234567', '.next/server/a.js.nft.json': { files: ['../../runtime.mjs'] }, '.next/server/b.js.nft.json': { files: ['../../runtime.mjs'] } });
  const report = auditNextTraces(root);
  assert.equal(report.passed, true); assert.equal(report.uniqueBytes, 7); assert.equal(report.traceCount, 2);
  assert.equal(auditNextTraces(root, { maxRouteBytes: 1 }).passed, false);
  assert.equal(auditNextTraces(root, { maxUniqueBytes: 1 }).passed, false);
});
test('missing Next dependencies, leaked dotenv and build directory traversal reject the artifact', t => {
  const root = fixture(t, { '.next/BUILD_ID': 'review', '.env': 'must-not-ship', '.next/server/a.js.nft.json': { files: ['../../.env', '../../absent.mjs'] } });
  const report = auditNextTraces(root); assert.equal(report.passed, false);
  assert.equal(report.unsafe.length, 1); assert.equal(report.missing.length, 1);
  assert.throws(() => auditNextTraces(root, { distDir: '../.next' }), /explicit Next/);
});
test('nested Services outputs keep functions from separate designs in separate size groups', t => {
  const root = fixture(t, { 'config.json': { version: 3 }, 'services/app/functions/index.func/main.js': '123', 'services/modern/functions/index.func/main.js': '4567' });
  const report = auditVercelOutput(root); assert.equal(report.passed, true);
  assert.equal(report.groups.filter(g => g.name.endsWith('.func')).length, 2);
});
test('Svelte function route aliases reuse one contained bundle rather than multiplying its storage', t => {
  const root = fixture(t, { 'config.json': { version: 3 }, 'functions/shared.func/.vc-config.json': { runtime: 'nodejs22.x', handler: 'index.js' }, 'functions/shared.func/index.js': 'runtime' });
  fs.symlinkSync(path.join(root, 'functions/shared.func'), path.join(root, 'functions/route.func'), process.platform === 'win32' ? 'junction' : 'dir');
  const report = auditVercelOutput(root);
  assert.equal(report.passed, true); assert.equal(report.functionAliases.length, 1);
  assert.equal(report.groups.filter(g => g.name.endsWith('.func')).length, 1);
});
test('Turbopack linked runtime modules are accounted by NFT traces without recursively scanning dependencies', t => {
  const root = fixture(t, { '.next/BUILD_ID': 'review', 'node_modules/runtime/index.js': '12345', '.next/server/page.js.nft.json': { files: ['../../node_modules/runtime/index.js'] } });
  fs.mkdirSync(path.join(root, '.next/node_modules'), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules/runtime'), path.join(root, '.next/node_modules/runtime-hash'), process.platform === 'win32' ? 'junction' : 'dir');
  const report = auditNextTraces(root); assert.equal(report.passed, true); assert.equal(report.uniqueBytes, 5);
});
test('pnpm directory-link entries in NFT are metadata, not whole dependency-tree copies', t => {
  const root = fixture(t, { '.next/BUILD_ID': 'review', 'node_modules/package/index.js': '12345', '.next/server/page.js.nft.json': { files: ['../../node_modules/alias', '../../node_modules/package/index.js'] } });
  fs.symlinkSync(path.join(root, 'node_modules/package'), path.join(root, 'node_modules/alias'), process.platform === 'win32' ? 'junction' : 'dir');
  const report = auditNextTraces(root); assert.equal(report.passed, true);
  assert.equal(report.uniqueBytes, 5); assert.equal(report.dependencyAliases, 1);
});

test('static-named folders inside a Function remain charged to that function budget', t => {
  const root = fixture(t, { 'config.json': { version: 3 },
    'functions/server.func/index.js': '123',
    'functions/server.func/node_modules/lib/static/large.js': '0123456789',
    'static/catalogue.webp': 'image' });
  const report = auditVercelOutput(root, { maxFunctionBytes: 12 });
  assert.equal(report.groups.find(g => g.name === 'functions/server.func').bytes, 13);
  assert.equal(report.passed, false);
  assert.equal(report.oversizedFunctions.length, 1);
});
test('function-like public URL names remain static files, including nested static directories', t => {
  const root = fixture(t, { 'config.json': { version: 3 },
    'static/functions/demo.func/image.webp': 'photo',
    'services/app/static/assets/static/font.woff2': 'font' });
  const report = auditVercelOutput(root, { maxFunctionBytes: 1 });
  assert.equal(report.passed, true);
  assert.equal(report.groups.filter(g => g.name.endsWith('.func')).length, 0);
  assert.equal(report.groups.find(g => g.name === 'static').bytes, 5);
  assert.equal(report.groups.find(g => g.name === 'services/app/static').bytes, 4);
});

test('final Function entrypoints must exist inside their own bundle using portable relative paths', t => {
  const root = fixture(t, { 'config.json': { version: 3 },
    'functions/demo.func/.vc-config.json': { runtime: 'nodejs24.x', handler: '.svelte-kit/vercel-tmp/index.js' },
    'functions/demo.func/.svelte-kit/vercel-tmp/index.js': 'runtime',
    'outside.js': 'outside runtime' });
  const config = path.join(root, 'functions/demo.func/.vc-config.json');
  const accepted = auditVercelOutput(root);
  assert.equal(accepted.passed, true);
  assert.deepEqual(accepted.functionEntrypoints, [{ function: 'functions/demo.func', handler: '.svelte-kit/vercel-tmp/index.js' }]);
  for (const handler of ['../../outside.js', '..\\..\\outside.js', '/outside.js', 'C:/outside.js', 'missing.js', undefined]) {
    fs.writeFileSync(config, JSON.stringify({ runtime: 'nodejs24.x', handler }));
    const rejected = auditVercelOutput(root);
    assert.equal(rejected.passed, false, String(handler));
    assert.ok(rejected.unsafe.some(row => row.reason === 'unsafe-or-missing-function-handler'));
  }
});
