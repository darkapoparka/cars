import test from 'node:test';
import assert from 'node:assert/strict';
import { planSixDesignSelection, assertSixDesignSelection, SIX_DESIGN_KEYS } from './lib/six-design-release.mjs';
import { validatePackagingManifest } from './package-dealer.mjs';
import { nativeBuildPlan } from './publishing/build-native-service.mjs';
import { nativeMountFor } from './publishing/native-mounts.mjs';

for (const middle of ['modern', 'import']) test('six-family plan preserves ' + middle + ' and every legacy slot that stays published', () => {
  const input = [
    { key: 'auto-best', base: '', entry: '/' },
    { key: middle, base: '/variant-2', entry: middle === 'modern' ? '/variant-2/cars' : '/variant-2/' },
    { key: 'carwow', base: '/variant-3', entry: '/variant-3/' },
    { key: 'app', base: '/variant-4', entry: '/variant-4/' },
  ];
  const before = structuredClone(input), result = planSixDesignSelection(input);
  assert.deepEqual(input, before);
  assert.deepEqual(result.variants[1], input[1]);
  assert.deepEqual(result.variants[3], input[3]);
  assert.deepEqual(result.variants.map(v => v.key).sort(), [...SIX_DESIGN_KEYS].sort());
  assert.deepEqual(result.preserveSource, ['carwow']);
  assert.deepEqual(planSixDesignSelection(result.variants).addFamilies, []);
  assert.equal(planSixDesignSelection(result.variants).replaceMount, null);
  for (const entry of ['/variant-5/', 'https://other.example/', '/variant-6/bg']) {
    const invalid = structuredClone(result.variants); invalid[5].entry = entry;
    assert.throws(() => assertSixDesignSelection(invalid), /mount\/entry/);
  }
  // Publisher v5 now supports these mounts. Source receipts and actual hosted
  // acceptance are separate gates beyond manifest shape validation.
  validatePackagingManifest({ schemaVersion: 1, slug: 'demo', repository: 'owner/demo', packaging: { version: '5' }, variants: result.variants });
});

for (const key of ['modern', 'import']) test(key + ' native mount/build preparation supports either reviewed secondary slot', () => {
  for (const base of ['/variant-2', '/variant-3']) {
    const mount = nativeMountFor(key, base), plan = nativeBuildPlan(key, base);
    assert.equal(mount.base, base);
    assert.equal(plan.base, base);
    assert.equal(plan.environment[mount.environment], base);
    if (key === 'import') assert.deepEqual(plan.steps.at(-1).slice(-1), [base]);
  }
  assert.equal(nativeBuildPlan(key).base, '/variant-2');
  for (const base of ['', '/variant-4', '/variant-3/../../', 'https://other.example']) {
    assert.throws(() => nativeMountFor(key, base), /Unsupported native mount/);
    assert.throws(() => nativeBuildPlan(key, base), /Unsupported native mount/);
  }
});

test('preparing secondary mounts leaves root Auto Best and legacy Carwow fixed', () => {
  assert.equal(nativeBuildPlan('auto-best').base, '');
  assert.equal(nativeBuildPlan('carwow').base, '/variant-3');
  assert.throws(() => nativeMountFor('auto-best', '/variant-2'), /Unsupported native mount/);
  assert.throws(() => nativeBuildPlan('carwow', '/variant-2'), /Unsupported native mount/);
  assert.equal(nativeBuildPlan('karento-best').base, '/variant-6');
  assert.equal(nativeBuildPlan('mobile').base, '/variant-5');
});
