import test from 'node:test';
import assert from 'node:assert/strict';
import { vehicles } from '../.qa/domain/catalog.mjs';
import { normalizeFilters, filterVehicles, sortVehicles } from '../.qa/domain/search.mjs';
import {
  modelGroupsFor,
  nativeCategoryKey,
  nativeMakesFor,
} from '../.qa/domain/native-taxonomy.mjs';

const inheritedNames = ['__proto__', 'constructor', 'toString', 'hasOwnProperty', 'valueOf'];

test('unknown sort values, including inherited object names, use the recommended order', () => {
  const original = vehicles.slice();
  for (const sort of [...inheritedNames, 'not-a-sort'])
    assert.deepEqual(sortVehicles(vehicles, sort), sortVehicles(vehicles, 'standard'), sort);
  assert.deepEqual(vehicles, original);
});

test('unknown makes never expose Object.prototype as a model catalog', () => {
  for (const make of [...inheritedNames, 'Unknown make'])
    assert.deepEqual(modelGroupsFor(make), [], make);
  assert.ok(modelGroupsFor('BMW').length > 0);
});

test('unknown truck categories fall back to a real make catalog', () => {
  const fallback = { category: 'truck', details: [] };
  for (const value of [...inheritedNames, 'Unknown category']) {
    const filters = { category: 'truck', details: ['truckCategory=' + value] };
    assert.equal(nativeCategoryKey(filters), 'truck_over_7500', value);
    assert.deepEqual(nativeMakesFor(filters), nativeMakesFor(fallback), value);
  }
});

test('unknown attribute names cannot crash filtering through inherited object properties', () => {
  for (const name of inheritedNames) {
    const filters = normalizeFilters({ details: [name + '=anything'] });
    assert.deepEqual(filterVehicles(vehicles, filters), [], name);
  }
});

test('filter map keys are rejected rather than truncated into another make', () => {
  const valid = 'x'.repeat(100);
  for (const name of ['makeModels', 'excludedModels', 'makeVariants', 'excludedMakeVariants']) {
    const list = name === 'makeModels' || name === 'excludedModels';
    const good = list ? ['Valid model'] : 'Valid variant';
    const bad = list ? ['Wrong model'] : 'Wrong variant';
    const values = Object.fromEntries([
      [valid, good],
      [valid + 'x', bad],
      ['', bad],
      ['  ', bad],
      ['__proto__', bad],
      [' constructor ', bad],
    ]);
    assert.deepEqual(normalizeFilters({ [name]: values })[name], { [valid]: good }, name);
  }
});

test('nested variant keys cannot alias a different make or model after normalization', () => {
  const valid = 'x'.repeat(100);
  for (const name of ['modelVariants', 'excludedModelVariants']) {
    const input = {
      [name]: {
        [valid]: { [valid]: 'Valid', [valid + 'x']: 'Wrong', ' constructor ': 'Wrong' },
        [valid + 'x']: { bad: 'Wrong' },
      },
    };
    const normalized = normalizeFilters(input);
    assert.deepEqual(normalized[name], { [valid]: { [valid]: 'Valid' } });
    assert.deepEqual(normalizeFilters(normalized), normalized, 'Normalization remains idempotent');
  }
});
