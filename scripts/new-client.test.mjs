import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { assertMainCheckout, planNewClient, createNewClient } from './new-client.mjs';
import { copySource } from './copy-source.mjs';
import { fingerprint, POLICY } from './lib/workflow.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-new-client-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (p, data) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data)); };
  put('workspace.json', { machinePaths: { [process.platform]: root } });
  put('docs/DEPLOYMENT-INVENTORY.json', { aliases: {}, dealers: [] });
  fs.mkdirSync(path.join(root, 'clients'));
  const templates = ['auto-best', 'modern', 'import', 'carwow'].map(key => ({ key, path: 'templates/' + key, aliases: [], homes: [{ id: 'home' }] }));
  put('catalog.json', { templates });
  const lock = { templates: {} };
  for (const item of templates) {
    const p = item.path + '/';
    put(p + 'package.json', { name: item.key }); put(p + 'package-lock.json', { lockfileVersion: 3 });
    put(p + 'src/hero.txt', 'Keep this exact hero\r\n'); put(p + 'QA.md', 'Retained technical source documentation');
    put(p + 'static/identity.png', Buffer.from([137, 80, 78, 71, 0, 13, 10]));
    for (const name of ['.env.local', '.auth/state.json', 'runtime/scratch.txt', 'node_modules/dep.js', '.git/config', 'AGENTS.md', '.agents/skills/inherited.md', 'apps/web/next-env.d.ts', 'packages/database/generated/client.ts']) put(p + name, 'must not be exported');
    lock.templates[item.key] = { status: 'approved', repository: 'darkapoparka/cars-template-' + item.key, commit: 'b'.repeat(40), snapshotPath: item.path, exportPolicy: POLICY, digest: fingerprint(path.join(root, item.path)).digest };
  }
  put('templates.lock.json', lock);
  const state = { head: 'a'.repeat(40), remote: 'a'.repeat(40), branch: 'main', origin: 'https://github.com/darkapoparka/cars.git', changed: '', development: 'b'.repeat(40) };
  const readGit = (_root, args) => {
    if (args[0] === 'config') return state.origin;
    if (args[0] === 'branch') return state.branch;
    if (args[0] === 'rev-parse') return state.head;
    if (args[0] === 'diff') return state.changed;
    if (args[0] === 'ls-remote') return (args.includes('origin') ? state.remote : state.development) + '\trefs/heads/main';
    throw new Error('Unexpected git read: ' + args.join(' '));
  };
  const plan = (options = {}) => planNewClient({ root, client: 'sample-dealer', repository: 'darkapoparka/cars-sampledealer', readGit, ...options });
  return { root, put, state, readGit, plan, lock };
}

for (const preset of ['standard', 'import']) test(preset + ': creates three exact template copies together, with one manifest and no inherited secrets', async t => {
  const f = fixture(t); const plan = f.plan({ preset });
  assert.equal(fs.existsSync(plan.clientRoot), false, 'planning is read-only');
  const result = await createNewClient(plan, { readGit: f.readGit });
  assert.equal(result.applications, 3); assert.equal(result.state, 'needs-personalization');
  const manifest = JSON.parse(fs.readFileSync(path.join(result.clientRoot, 'dealer.json')));
  assert.equal(manifest.defaultBranch, 'main'); assert.equal(manifest.variants.length, 3);
  assert.equal(manifest.variants[1].entry, preset === 'import' ? '/variant-2/' : '/variant-2/cars');
  for (const item of plan.plans) {
    const dir = path.join(result.clientRoot, item.template);
    assert.equal(fingerprint(dir).digest, item.release.digest);
    assert.equal(fs.readFileSync(path.join(dir, 'QA.md'), 'utf8'), 'Retained technical source documentation');
    for (const p of ['.env.local', '.auth', '.git', 'runtime', 'node_modules', '.agents', 'apps/web/next-env.d.ts', 'packages/database/generated']) assert.equal(fs.existsSync(path.join(dir, p)), false, p);
    const meta = JSON.parse(fs.readFileSync(path.join(dir, '.client/project.json')));
    assert.equal(meta.templateVersion, item.release.commit); assert.equal(meta.qa.desktop, false);
    assert.equal(JSON.parse(fs.readFileSync(path.join(dir, '.template/source-manifest.json'))).destination, item.destination);
  }
  assert.equal(fs.existsSync(path.join(f.root, 'runtime/locks/new-client')), false);
  assert.equal(fs.existsSync(path.join(path.dirname(result.receipt), 'dealer')), false, 'staging moved, not duplicated');
});

for (const [field, value, error] of [['branch', 'feature', /on main/], ['origin', 'https://github.com/other/cars.git', /Wrong Cars origin/], ['remote', 'c'.repeat(40), /not synchronized/], ['changed', 'templates.lock.json', /Commit the reviewed/]]) {
  test('rejects unsafe checkout: ' + field, t => { const f = fixture(t); f.state[field] = value; assert.throws(() => f.plan(), error); assert.deepEqual(fs.readdirSync(path.join(f.root, 'clients')), []); });
}
test('refuses a different physical checkout even with the same Git remote', t => {
  const f = fixture(t); f.put('workspace.json', { machinePaths: { [process.platform]: path.join(f.root, 'clients') } });
  assert.throws(() => assertMainCheckout(f.root, { readGit: f.readGit }), /canonical Cars checkout/);
});
test('does not accept stale cached Git evidence when the network read fails', t => {
  const f = fixture(t); assert.throws(() => f.plan({ readGit: (root, args) => { if (args[0] === 'ls-remote') throw new Error('network unavailable'); return f.readGit(root, args); } }), /network unavailable/);
});
test('reports newer development without substituting it for the approved template', t => {
  const f = fixture(t); f.state.development = 'c'.repeat(40); const p = f.plan();
  assert.ok(p.plans.every(v => v.updateAvailable && v.release.commit === 'b'.repeat(40)));
});
test('refuses snapshot drift and catalog-to-lock path mismatch', t => {
  const f = fixture(t); f.put('templates/modern/src/hero.txt', 'unauthorized redesign');
  assert.throws(() => f.plan(), /snapshot drift/);
  const catalog = JSON.parse(fs.readFileSync(path.join(f.root, 'catalog.json'))); catalog.templates[0].path = 'clients/somewhere'; f.put('catalog.json', catalog);
  assert.throws(() => f.plan(), /identity mismatch/);
});
test('refuses existing dealer aliases rather than making another copy', t => {
  const f = fixture(t); f.put('docs/DEPLOYMENT-INVENTORY.json', { aliases: { 'sample-dealer': 'original' }, dealers: [{ slug: 'original' }] });
  assert.throws(() => f.plan(), /Existing dealer identity/);
});
test('copy failure retains only a diagnostic candidate, never a half-created dealer', async t => {
  const f = fixture(t); const p = f.plan(); let copied = 0;
  await assert.rejects(createNewClient(p, { readGit: f.readGit, copy: async (...args) => { if (++copied === 2) throw new Error('injected copy failure'); return copySource(...args); } }), /injected copy failure/);
  assert.equal(fs.existsSync(p.clientRoot), false); assert.equal(fs.existsSync(path.join(f.root, 'runtime/locks/new-client')), false);
  const stage = fs.readdirSync(path.join(f.root, 'runtime/new-clients'))[0];
  assert.ok(fs.existsSync(path.join(f.root, 'runtime/new-clients', stage, 'failure.json')));
});
test('candidate byte corruption is rejected before canonical installation', async t => {
  const f = fixture(t); const p = f.plan();
  await assert.rejects(createNewClient(p, { readGit: f.readGit, copy: async (source, destination, options) => { await copySource(source, destination, options); fs.appendFileSync(path.join(destination, 'src/hero.txt'), 'corrupted'); } }), /Copied source differs/);
  assert.equal(fs.existsSync(p.clientRoot), false);
});
test('main changing during a copy does not install the obsolete candidate', async t => {
  const f = fixture(t); const p = f.plan();
  await assert.rejects(createNewClient(p, { readGit: f.readGit, copy: async (...args) => { const result = await copySource(...args); f.state.head = f.state.remote = 'd'.repeat(40); return result; } }), /main changed during copying/);
  assert.equal(fs.existsSync(p.clientRoot), false);
});
test('an existing operation lock is not removed or ignored', async t => {
  const f = fixture(t); const p = f.plan(); f.put('runtime/locks/new-client/owner.json', 'other writer');
  await assert.rejects(createNewClient(p, { readGit: f.readGit }), /Another new-client/);
  assert.equal(fs.readFileSync(path.join(f.root, 'runtime/locks/new-client/owner.json'), 'utf8'), 'other writer');
});
test('an occupied canonical destination appearing during copying is preserved', async t => {
  const f = fixture(t); const p = f.plan(); let first = true;
  await assert.rejects(createNewClient(p, { readGit: f.readGit, copy: async (...args) => { const result = await copySource(...args); if (first) { first = false; f.put('clients/sample-dealer/owner.txt', 'preserve'); } return result; } }), /destination appeared/);
  assert.equal(fs.readFileSync(path.join(p.clientRoot, 'owner.txt'), 'utf8'), 'preserve');
  assert.deepEqual(fs.readdirSync(p.clientRoot), ['owner.txt']);
});

test('a mutated plan cannot redirect creation outside the canonical dealer folder', async t => {
  const f = fixture(t); const p = f.plan(); p.clientRoot = path.join(f.root, 'unexpected');
  await assert.rejects(createNewClient(p, { readGit: f.readGit }), /Invalid canonical client plan/);
  assert.equal(fs.existsSync(p.clientRoot), false);
});

test('build-output exclusions do not hide authored generated source or Prisma schemas', async () => {
  const { excluded } = await import('./lib/workflow.mjs');
  for (const p of ['apps/web/next-env.d.ts', 'modern/packages/database/generated/client.ts']) assert.equal(excluded(p), true);
  for (const p of ['src/generated/approved.ts', 'packages/database/schema.prisma', 'packages/database/prisma/schema.prisma']) assert.equal(excluded(p), false);
});

test('a publishing repository cannot be reused under another dealer name', t => {
  const f = fixture(t); f.put('docs/DEPLOYMENT-INVENTORY.json', { aliases: {}, dealers: [{ slug: 'original', repository: 'darkapoparka/CARS-SAMPLEDEALER' }] });
  assert.throws(() => f.plan(), /Publishing repository already belongs to original/);
});
