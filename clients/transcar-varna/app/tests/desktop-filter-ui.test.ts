import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {clearDesktopMake, desktopBodyTypes, desktopBodyValue, desktopFilterCount, toggleDesktopBody} from '../lib/desktop-filter-ui';
import {emptyFilters, matchesInventory} from '../lib/inventory-filters';
import {vehicles} from '../lib/data';

describe('desktop make removal', () => {
  it('removes the make and all its model refinements while preserving independent criteria', () => {
    const filters = {
      ...emptyFilters(), brands: [' Audi ', 'Toyota'], models: ['audi::A5 Sportback', ' Audi ::RS5', 'BMW::X3'],
      minimum: 25000, maximum: 200000, yearMinimum: 2020, fuel: ['Petrol'], extra: {TRANSMISSION: ['Automatic']},
    };
    const original = structuredClone(filters);
    assert.deepEqual(clearDesktopMake(filters, 'AUDI'), {...filters, brands: ['Toyota'], models: ['BMW::X3']});
    assert.deepEqual(filters, original);
  });

  it('clears the final model-only selection and returns to the full stock', () => {
    const filters = {...emptyFilters(), models: ['Audi::A5 Sportback']};
    const cleared = clearDesktopMake(filters, 'Audi');
    assert.deepEqual(cleared, emptyFilters());
    assert.equal(vehicles.filter(vehicle => matchesInventory(vehicle, filters, '')).length, 1);
    assert.equal(vehicles.filter(vehicle => matchesInventory(vehicle, cleared, '')).length, vehicles.length);
  });
});

describe('desktop body choices with legacy filters', () => {
  it('keeps legacy aliases selected and counts equivalent body filters once', () => {
    const filters = {...emptyFilters(), bodies: ['HATCHBACK', 'SPORTBACK', 'LIFTBACK', 'ROADSTER', 'CONVERTIBLE', 'DOUBLE CAB UTILITY', 'CREW CAB UTILITY', 'PICK-UP']};
    assert.equal(desktopFilterCount(filters, 'BODY TYPE'), 3);
    assert.deepEqual(desktopBodyTypes, ['SUV', 'SEDAN', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'SUV COUPE', 'MPV', 'VAN', 'PICK-UP']);
    for (const body of filters.bodies) assert.ok(desktopBodyTypes.includes(desktopBodyValue(body) as typeof desktopBodyTypes[number]));
  });

  it('removes equivalent legacy body selections together without clearing other filters', () => {
    const filters = {...emptyFilters(), bodies: ['SPORTBACK', 'SUV', 'LIFTBACK'], brands: ['Audi'], minimum: 25000};
    const original = structuredClone(filters);
    const cleared = toggleDesktopBody(filters, 'HATCHBACK');
    assert.deepEqual(cleared, {...filters, bodies: ['SUV']});
    assert.deepEqual(filters, original);
  });

  it('preserves the inventory result when a legacy alias is replaced by its desktop choice', () => {
    for (const body of ['SPORTBACK', 'ROADSTER', 'DOUBLE CAB UTILITY']) {
      const legacy = {...emptyFilters(), bodies: [body]};
      const canonical = toggleDesktopBody(emptyFilters(), body);
      assert.deepEqual(canonical.bodies, [desktopBodyValue(body)]);
      assert.deepEqual(vehicles.filter(vehicle => matchesInventory(vehicle, legacy, '')), vehicles.filter(vehicle => matchesInventory(vehicle, canonical, '')));
    }
  });
});
