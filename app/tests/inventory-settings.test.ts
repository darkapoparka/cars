import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {demoVehicles} from '../lib/fixtures/demo-vehicles';
import {deriveInventoryBounds} from '../lib/inventory-settings';
import {canonicalMake, buildInventoryOptions, hasModel, toggleModelSelection} from '../lib/inventory-options';
import {emptyFilters, matchesInventory} from '../lib/inventory-filters';

describe('dealer catalogue portability', () => {
  it('preserves the reference ranges for template and empty inventory', () => {
    const bounds = deriveInventoryBounds([], 2026);
    assert.equal(bounds.minimum, 8000); assert.equal(bounds.maximum, 950000);
    assert.equal(bounds.yearMinimum, 2003); assert.equal(bounds.yearMaximum, 2026);
    assert.equal(bounds.engineMaximum, 7); assert.equal(bounds.cylinderMaximum, 12);
  });
  it('includes cheap cars, classics, upcoming model years and values beyond reference limits', () => {
    const bounds = deriveInventoryBounds([
      {...demoVehicles[0], price: 2500, year: 1967, mileage: 800001, engine: '8.4L', cylinders: 16},
      {...demoVehicles[0], price: 1200001, year: 2028},
    ], 2026);
    assert.equal(bounds.minimum, 2000); assert.equal(bounds.maximum, 1201000);
    assert.equal(bounds.yearMinimum, 1967); assert.equal(bounds.yearMaximum, 2028);
    assert.equal(bounds.mileageMaximum, 801000); assert.equal(bounds.engineMaximum, 8.4);
    assert.equal(bounds.cylinderMaximum, 16);
  });
  it('ignores missing numeric values and advances the year without a source edit', () => {
    const bounds = deriveInventoryBounds([{...demoVehicles[0], price: 0, priceOnRequest: true, mileage: Infinity, mileageOnRequest: true}], 2029);
    assert.equal(bounds.minimum, 8000); assert.equal(bounds.mileageMaximum, 530000); assert.equal(bounds.yearMaximum, 2029);
  });
  it('canonicalizes known makes without rewriting new dealer brands', () => {
    assert.equal(canonicalMake(' bMw '), 'BMW'); assert.equal(canonicalMake('New Brand'), 'New Brand');
    assert.ok(matchesInventory({...demoVehicles[0], make: 'bmw'}, {...emptyFilters(), brands: ['BMW']}, ''));
  });
});

it('matches normalized model selections against incidental input whitespace', () => {
  assert.ok(matchesInventory({...demoVehicles[0], make: ' bmw ', model: ' X3 '}, {...emptyFilters(), models: ['BMW::X3']}, ''));
});

it('deduplicates unfamiliar dealer makes and models without losing stock or display spelling', () => {
  const options = buildInventoryOptions([{make: ' New Brand ', model: ' Classic '}, {make: 'new brand', model: 'classic'}, {make: 'NEW BRAND', model: 'Future'}]);
  assert.deepEqual(options.filterMakes.filter(make => make.toLowerCase() === 'new brand'), ['New Brand']);
  assert.equal(options.canonicalMake(' NEW BRAND '), 'New Brand');
  assert.deepEqual(options.modelChoices, [{make: 'New Brand', model: 'Classic'}, {make: 'New Brand', model: 'Future'}]);
});

it('uses the same normalized model identity for selection toggling and inventory matching', () => {
  const selected = [' BMW :: X3 '];
  assert.ok(hasModel(selected, 'bmw::x3'));
  assert.deepEqual(toggleModelSelection(selected, 'bmw::x3'), []);
  assert.ok(matchesInventory({...demoVehicles[0], make: ' bmw ', model: ' X3 '}, {...emptyFilters(), models: selected}, ''));
});
