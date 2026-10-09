import test from 'node:test';
import assert from 'node:assert/strict';
import { FIVE_DESIGN_COHORT, FIVE_DESIGN_KEYS, planFiveDesignSelection, assertFiveDesignSelection, resolveFiveDesignCohort } from './lib/five-design-release.mjs';
const legacy = middle => [
  { key: 'auto-best', base: '', entry: '/' },
  { key: middle, base: '/variant-2', entry: middle === 'modern' ? '/variant-2/cars' : '/variant-2/' },
  { key: 'carwow', base: '/variant-3', entry: '/variant-3/' },
  { key: 'app', base: '/variant-4', entry: '/variant-4/' },
];
for (const middle of ['modern', 'import']) test('plan preserves existing ' + middle + ' mount and includes five distinct families', () => {
  const input = legacy(middle), original = structuredClone(input);
  const result = planFiveDesignSelection(input);
  assert.deepEqual(input, original);
  assert.deepEqual(result.variants[1], original[1]);
  assert.deepEqual(result.variants.map(v => v.key).sort(), [...FIVE_DESIGN_KEYS].sort());
  assert.equal(result.variants[2].key, middle === 'modern' ? 'import' : 'modern');
  assert.deepEqual(result.removeFromPublication, ['carwow']);
  assert.deepEqual(result.preserveSource, ['carwow']);
  assert.equal(result.variants[4].entry, '/variant-5/');
});
test('three-design baseline adds App and Mobile instead of silently omitting one', () => {
  assert.deepEqual(planFiveDesignSelection(legacy('modern').slice(0, 3)).addFamilies, ['import', 'app', 'mobile']);
});
test('accepted proposed selection is idempotent but still not publisher approval', () => {
  const initial = planFiveDesignSelection(legacy('modern'));
  const again = planFiveDesignSelection(initial.variants);
  assert.deepEqual(again.variants, initial.variants);
  assert.deepEqual(again.addFamilies, []);
  assert.equal(again.replaceMount, null);
});
test('duplicate Import cannot stand in for missing Modern', () => {
  const variants = planFiveDesignSelection(legacy('import')).variants;
  variants[2] = { key: 'import', base: '/variant-3', entry: '/variant-3/' };
  assert.throws(() => assertFiveDesignSelection(variants), /Duplicate/);
});
test('unknown mounts and schemes are rejected, not normalized into publication', () => {
  const variants = legacy('modern'); variants[2].entry = 'https://other.example/';
  assert.throws(() => planFiveDesignSelection(variants), /mount\/entry/);
});
test('Carwow in a proposed five-design selection is rejected', () => {
  const variants = planFiveDesignSelection(legacy('modern')).variants;
  variants[2].key = 'carwow';
  assert.throws(() => assertFiveDesignSelection(variants), /no Carwow/);
});
function registry() {
  return { dealers: FIVE_DESIGN_COHORT.map((project, i) => ({ slug: 'dealer-' + i, repository: 'owner/' + project,
    delivery: { projectName: project, projectId: 'prj_' + i, gitRepository: 'owner/' + project } })) };
}
test('release scope stays exactly 25 despite other registry records', () => {
  const r = registry(); r.dealers.push({ slug: 'research-only' });
  assert.equal(resolveFiveDesignCohort(r).length, 25);
  assert.equal(new Set(FIVE_DESIGN_COHORT).size, 25);
});
test('missing, duplicate and mismatched project identities stop the cohort', () => {
  const missing = registry(); missing.dealers.pop();
  assert.throws(() => resolveFiveDesignCohort(missing), /found 0/);
  const duplicate = registry(); duplicate.dealers.push(structuredClone(duplicate.dealers[0]));
  assert.throws(() => resolveFiveDesignCohort(duplicate), /found 2/);
  const mismatch = registry(); mismatch.dealers[0].delivery.gitRepository = 'owner/other';
  assert.throws(() => resolveFiveDesignCohort(mismatch), /binding mismatch/);
});

test('CLI-only saved binding stays in the audit but is never manufactured as Git-linked', () => {
  const r = registry(); r.dealers[0].delivery.gitRepository = null;
  r.dealers[0].delivery.gitIntegration = 'unlinked-cli';
  const result = resolveFiveDesignCohort(r);
  assert.equal(result.length, 25);
  assert.equal(result[0].delivery.gitRepository, null);
});
