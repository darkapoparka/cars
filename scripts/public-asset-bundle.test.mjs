import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { planPublicAssets, cloudflareAssetControls } from './publishing/public-asset-bundle.mjs';
const digest = text => createHash('sha256').update(text).digest('hex');
const entry = (name, text = 'same image') => ({ path: name, bytes: Buffer.byteLength(text), sha256: digest(text) });
const variants = [{ key: 'auto-best', base: '' }, { key: 'modern', base: '/variant-2' }, { key: 'carwow', base: '/variant-3' }, { key: 'app', base: '/variant-4' }];
const plan = (entries, options = {}) => planPublicAssets({ dealer: 'test-dealer', variants, entries, ...options });
test('four designs share one immutable media object without changing source URLs', () => {
  const p = plan(variants.map(v => entry((v.base ? v.base.slice(1) + '/' : '') + 'photo.webp')));
  assert.equal(p.objects.length, 1); assert.equal(p.aliases.length, 4);
  assert.equal(p.summary.savedBytes, 30); assert.equal(p.runtimeRenderingChanged, false);
  assert.equal(new Set(p.aliases.map(a => a.destination)).size, 1);
});
test('an explicit fifth mounted design reuses the pool; no release approval implied', () => {
  const five = [...variants, { key: 'mobile', base: '/variant-5' }];
  const p = plan(five.map(v => entry((v.base.slice(1) || 'root') + '/photo.png')), { variants: five });
  assert.equal(p.objects.length, 1); assert.equal(p.aliases.length, 5);
});
test('Import replaces Modern in the manifest, not Carwow', () => {
  const v = variants.map(x => x.key === 'modern' ? { ...x, key: 'import' } : x);
  assert.equal(plan([entry('variant-2/photo.webp')], { variants: v }).byVariant.import.files, 1);
});
test('separate dealers receive isolated public media namespaces', () => {
  const a = plan([entry('photo.webp'), entry('variant-2/photo.webp')]);
  const b = plan([entry('photo.webp'), entry('variant-2/photo.webp')], { dealer: 'another-dealer' });
  assert.notEqual(a.aliases[0].destination, b.aliases[0].destination);
});
test('hashes distinguish same-name pictures, independent of filenames and ordering', () => {
  const es = [entry('photo.webp', 'first'), entry('variant-2/photo.webp', 'different')];
  assert.equal(plan(es).objects.length, 2);
  assert.deepEqual(plan(es), plan([...es].reverse()));
});
test('JS, CSS and SVG keep original locations and bytes, including relative imports', () => {
  const es = [entry('app.js'), entry('variant-2/app.js'), entry('icons/a.svg'), entry('icons/b.svg'), entry('base.css')];
  const p = plan(es); assert.equal(p.aliases.length, 0); assert.equal(p.objects.length, 5);
  assert.ok(p.objects.every(x => x.path === x.from));
});
test('unknown files remain; exclusion requires exact source hash and review', () => {
  const e = entry('REFERENCE.md'); assert.equal(plan([e]).objects.length, 1);
  const review = { ...e, reason: 'Reviewed internal generation notes; not a public runtime input.' };
  assert.equal(plan([e], { exclusions: [review] }).objects.length, 0);
});
test('file count, alias count and individual size are independent limits', () => {
  assert.throws(() => plan([entry('a.png'), entry('b.png')], { maxAliases: 1 }), /alias budget/);
  assert.throws(() => plan([entry('a.js')], { maxFiles: 2 }), /file budget/);
  assert.throws(() => plan([entry('a.png')], { maxFileBytes: 1 }), /oversized/);
});
test('missing or changed exclusion evidence fails closed', () => {
  const e = entry('REFERENCE.md');
  const review = { ...e, reason: 'Reviewed unused generation notes' };
  assert.throws(() => plan([e], { exclusions: [{ ...review, sha256: '0'.repeat(64) }] }), /changed/);
  assert.throws(() => plan([e], { exclusions: [{ ...review, path: 'absent.md' }] }), /absent/);
  assert.throws(() => plan([e], { exclusions: [review, review] }), /Exclusions/);
  assert.throws(() => plan([e], { exclusions: [{ ...review, reason: '' }] }), /Exclusions/);
});
test('asset rewrite points directly to the shared object', () => {
  const p = plan([entry('photo.webp'), entry('variant-2/photo.webp')]);
  const controls = cloudflareAssetControls(p);
  assert.ok(controls.redirects.includes(p.aliases[0].destination + ' 200'));
  assert.equal(controls.staticRules, 2);
  assert.equal(controls.dynamicRules, 0);
});
test('ambiguous file names and duplicate design mounts are rejected', () => {
  assert.throws(() => plan([entry('Photo.webp'), entry('photo.webp')]), /collision/);
  assert.throws(() => plan([entry('_cars/photo.webp')]), /reserved/);
  assert.throws(() => plan([], { variants: [...variants, variants[0]] }), /Duplicate/);
  assert.throws(() => plan([], { variants: [{ key: 'demo', base: '/api' }] }), /Invalid variant/);
});
test('internal prompt documents and undeclared design folders block publication', () => {
  assert.throws(() => plan([entry('GENERATION-PROMPTS.md')]), /explicit exclusion review/);
  assert.throws(() => plan([entry('variant-5/photo.webp')]), /Undeclared variant/);
});
test('different file formats never share an incompatible content type', () => {
  const p = plan([entry('photo.webp'), entry('photo.png'), entry('photo.jpg'), entry('photo.jpeg')]);
  assert.equal(p.objects.length, 3);
  assert.equal(p.aliases.find(a => a.source === '/photo.jpg').destination, p.aliases.find(a => a.source === '/photo.jpeg').destination);
  assert.ok(p.objects.some(o => o.path === 'photo.png'));
  assert.ok(p.objects.some(o => o.path === 'photo.webp'));
  assert.equal(p.aliases.length, 2);
});
test('generated source rules cannot collide with retained page redirects', () => {
  const p = plan([entry('photo.webp'), entry('variant-2/photo.webp')]);
  assert.throws(() => cloudflareAssetControls(p, { redirects: '/photo.webp /somewhere 302' }), /conflicts/);
  const rules = cloudflareAssetControls(p, { redirects: '/legacy /catalogue 301' });
  assert.equal(rules.staticRules, 3);
  assert.ok(rules.redirects.includes('/legacy /catalogue 301'));
});
test('unique artwork keeps its existing URL without consuming alias rules', () => {
  const p = plan([entry('one.webp', 'one'), entry('variant-2/two.webp', 'two')]);
  assert.equal(p.policy, 'shared-binary-only-v1');
  assert.equal(p.aliases.length, 0);
  assert.deepEqual(p.objects.map(o => o.path), ['one.webp', 'variant-2/two.webp']);
  assert.equal(p.summary.savedBytes, 0);
});
