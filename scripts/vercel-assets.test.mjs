import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { applyVercelAssets, clearVercelAssetPlan, familyRetention, planVercelAssets, PUBLIC_ROOTS, SERVICE_NAMES } from './publishing/vercel-asset-plan.mjs';
import { prepareServiceAssets } from './publishing/vercel-service-assets.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const b = value => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value));
function fixture(middle = 'modern', fifth = false) {
  const keys = ['auto-best', middle, 'carwow', 'app', ...(fifth ? ['import'] : [])];
  const variants = keys.map((key, i) => ({ key, base: i ? `/variant-${i + 1}` : '', entry: i ? `/variant-${i + 1}/` : '/' }));
  const config = { services: Object.fromEntries(keys.map(k => [SERVICE_NAMES[k], { buildCommand: 'npm run build' }])), rewrites: [{ source: '/(.*)', destination: { service: 'autobest' } }] };
  const files = new Map([['dealer.json', b({ schemaVersion: 1, slug: 'fixture-dealer', variants })], ['vercel.json', b(config)], ['.cars-app.json', b({ original: true })]]);
  for (const key of keys) {
    files.set(PUBLIC_ROOTS[key] + 'stock/car.webp', b('same original photograph'));
    files.set(PUBLIC_ROOTS[key] + 'unique.png', b('unique ' + key));
    files.set(`${key}/src/car.ts`, b("const photo = '/stock/car.webp';"));
    if (key === 'modern' || key === 'app') {
      const appRoot=key==='modern'?'modern/apps/web':'app';
      files.set(appRoot+'/.next/BUILD_ID',b('fixture-build'));
      files.set(appRoot+'/runtime-fixture.mjs',b('export default 1;'));
      files.set(appRoot+'/.next/server/page.js.nft.json',b({files:['../../runtime-fixture.mjs']}));
    } else files.set(key+'/.vercel/output/config.json',b({version:3}));
  }
  return files;
}
function directory(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-vercel-assets-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [name, bytes] of files) { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes); }
  return root;
}
function seal(files) { files.set('.cars-package.json', b({ manifest: JSON.parse(files.get('dealer.json')), payload: [...files].map(([name, bytes]) => ({ path: name, sha256: hash(bytes) })) })); }
test('both current dealer combinations use one Vercel media pool and retain every source byte', () => {
  for (const middle of ['modern', 'import']) {
    const files = fixture(middle), originals = new Map(files), plan = applyVercelAssets(files);
    assert.equal(plan.objects.length, 1); assert.equal(plan.aliases.length, 4);
    for (const [name, bytes] of originals) if (name !== 'vercel.json') assert.deepEqual(files.get(name), bytes);
    const config = JSON.parse(files.get('vercel.json'));
    for (const a of plan.aliases) assert.equal(a.destination.service, 'autobest');
    assert.ok(Object.values(config.services).every(s => s.buildCommand.includes('vercel-service-assets.mjs before') && s.buildCommand.includes('vercel-service-assets.mjs after')));
  }
});
test('explicit fifth family shares assets without changing current mounts or granting release approval', () => {
  const files = fixture('modern', true), before = files.get('dealer.json');
  assert.equal(applyVercelAssets(files).aliases.length, 5); assert.deepEqual(files.get('dealer.json'), before);
});
test('all five family policies preserve customized and referenced media and omit only reviewed unused bytes', () => {
  for (const key of Object.keys(PUBLIC_ROOTS)) {
    const files = fixture('modern', true), old = b('unused');
    files.set(PUBLIC_ROOTS[key] + 'old.png', old);
    files.set(`${key}/public-assets.policy.json`, b({ schemaVersion: 1, family: key, candidates: [{ path: 'old.png', sha256: hash(old), reason: 'Reviewed superseded sample artwork' }], keepPrefixes: [] }));
    assert.equal(familyRetention(files, key).omitted.length, 1);
    files.set(PUBLIC_ROOTS[key] + 'old.png', b('dealer customization')); assert.equal(familyRetention(files, key).omitted.length, 0);
    files.set(PUBLIC_ROOTS[key] + 'old.png', old); files.set(`${key}/src/view.ts`, b("const photo = '/old.png'"));
    assert.equal(familyRetention(files, key).omitted.length, 0);
  }
});
test('public byte and route budgets fail closed without changing any input', () => {
  const files = fixture(), before = [...files];
  assert.throws(() => applyVercelAssets(files, { maxPublicBytes: 1 }), /budget exceeded/);
  assert.throws(() => applyVercelAssets(files, { maxRoutes: 1 }), /route budget/);
  assert.deepEqual([...files], before);
});
test('Next service removes generated copies before Vercel captures public and preserves other services', t => {
  const files = fixture(); applyVercelAssets(files); seal(files); const root = directory(t, files);
  for (const key of ['modern', 'app']) {
    const result = prepareServiceAssets('before', key, { packageRoot: root }); assert.equal(result.prunedFiles, 1);
    assert.equal(fs.existsSync(path.join(root, PUBLIC_ROOTS[key], 'stock/car.webp')), false);
    assert.ok(fs.existsSync(path.join(root, PUBLIC_ROOTS[key], 'unique.png')));
    assert.equal(prepareServiceAssets('after', key, { packageRoot: root }).public.files, 1);
  }
  assert.ok(fs.existsSync(path.join(root, 'auto-best/static/stock/car.webp')));
});
test('Svelte service removes only generated output, not its retained static originals', t => {
  const files = fixture(), plan = applyVercelAssets(files); seal(files); const root = directory(t, files);
  for (const key of ['auto-best', 'carwow']) {
    prepareServiceAssets('before', key, { packageRoot: root });
    const v = plan.variants.find(v => v.key === key);
    const target = path.join(root, key, '.vercel/output/static', v.base.slice(1));
    fs.mkdirSync(target, { recursive: true }); fs.cpSync(path.join(root, PUBLIC_ROOTS[key]), target, { recursive: true });
    const result = prepareServiceAssets('after', key, { packageRoot: root }); assert.equal(result.prunedFiles, 1);
    assert.ok(fs.existsSync(path.join(root, PUBLIC_ROOTS[key], 'stock/car.webp')));
    assert.equal(fs.existsSync(path.join(target, 'stock/car.webp')), false);
  }
});
test('unsealed or changed files are rejected before any generated source is pruned', t => {
  const files = fixture(); applyVercelAssets(files); seal(files); const root = directory(t, files);
  fs.writeFileSync(path.join(root, 'app/public/stock/car.webp'), 'changed');
  assert.throws(() => prepareServiceAssets('before', 'app', { packageRoot: root }), /differs/);
  fs.writeFileSync(path.join(root, '.cars-vercel-assets.json'), '{}');
  assert.throws(() => prepareServiceAssets('before', 'modern', { packageRoot: root }), /not sealed/);
});
test('an existing external media catalog wins over local pooling and is never duplicated', () => {
  const files = fixture(); const entry = { service: 'app', relative: 'stock/car.webp', sha256: hash(files.get('app/public/stock/car.webp')), bytes: files.get('app/public/stock/car.webp').length };
  files.set('.cars-shared-media.json', b({ schemaVersion: 1, dealer: 'fixture-dealer', entries: [entry] }));
  const plan = applyVercelAssets(files); assert.equal(plan.aliases.length, 3);
  assert.equal(plan.removals.filter(e => e.service === 'app').length, 0);
  assert.equal(plan.family.app.externalBytes, entry.bytes);
});
test('asset planner does not move SVG, CSS, or JavaScript with location-relative references', () => {
  const files = fixture();
  for (const key of Object.keys(SERVICE_NAMES).filter(k => k !== 'import')) {
    for (const name of ['picture.svg', 'site.css', 'widget.js']) files.set(PUBLIC_ROOTS[key] + name, b('same-relative-content'));
  }
  assert.equal(applyVercelAssets(files).aliases.length, 4);
});
test('canonical Cars source is not an allowed pruning target', t => {
  const files = fixture(); applyVercelAssets(files); seal(files); files.set('templates.lock.json', b({}));
  const root = directory(t, files);
  assert.throws(() => prepareServiceAssets('before', 'app', { packageRoot: root }), /canonical/);
});

test('asset plans can be refreshed without stacking route wrappers or losing source bytes', () => {
  const files = fixture(), original = new Map(files); const first = applyVercelAssets(files);
  clearVercelAssetPlan(files);
  assert.deepEqual(JSON.parse(files.get('vercel.json')), JSON.parse(original.get('vercel.json')));
  for (const [name, bytes] of original) if (name !== 'vercel.json') assert.deepEqual(files.get(name), bytes);
  const second = applyVercelAssets(files); assert.deepEqual(first, second);
});
