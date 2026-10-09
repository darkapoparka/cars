import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {demoVehicles as vehicles} from '../lib/fixtures/demo-vehicles';
import {emptyFilters, matchesInventory, vehicleDiscount} from '../lib/inventory-filters';
import {inventorySortGroups, inventorySorts, sortInventory} from '../lib/inventory-sort';
import type {Vehicle} from '../lib/vehicle';
const vehicle = (slug: string, patch: Partial<Vehicle> = {}): Vehicle => ({...vehicles[0], slug, ...patch});
const ids = (items: Vehicle[]) => items.map(item => item.slug);

describe('published inventory values and ordering', () => {
  it('shares one option catalogue between URL state, phone and desktop', () => {
    assert.deepEqual([...inventorySortGroups.flatMap(group => group.items.map(item => item[1]))].sort(), [...inventorySorts].sort());
  });
  for (const order of ['price-asc', 'price-desc']) it(order + ' always puts unpublished or invalid prices last', () => {
    const input = [vehicle('unknown', {price: 0, priceOnRequest: true}), vehicle('high', {price: 50000}), vehicle('low', {price: 20000}), vehicle('invalid', {price: NaN})];
    assert.deepEqual(ids(sortInventory(input, order)), order.endsWith('asc') ? ['low', 'high', 'unknown', 'invalid'] : ['high', 'low', 'unknown', 'invalid']);
    assert.deepEqual(ids(input), ['unknown', 'high', 'low', 'invalid']);
  });
  for (const order of ['kms-asc', 'kms-desc']) it(order + ' retains genuine zero mileage but not unknown mileage', () => {
    const input = [vehicle('unknown', {mileage: 0, mileageOnRequest: true}), vehicle('used', {mileage: 40000}), vehicle('new', {mileage: 0})];
    assert.deepEqual(ids(sortInventory(input, order)), order.endsWith('asc') ? ['new', 'used', 'unknown'] : ['used', 'new', 'unknown']);
  });
  it('uses actual listing dates, never model years, for recently added', () => {
    const input = [vehicle('undated', {year: 2026}), vehicle('old-listing', {listedAt: '2026-09-01'}), vehicle('new-listing', {year: 2005, listedAt: '2026-10-01'})];
    assert.deepEqual(ids(sortInventory(input, 'recent')), ['new-listing', 'old-listing', 'undated']);
    assert.deepEqual(ids(sortInventory(input, 'default')), ids(input));
    assert.deepEqual(ids(sortInventory(input, 'invalid')), ids(input));
  });
  it('preserves source order for ties and absent listing dates', () => {
    const input = [vehicle('a'), vehicle('b')];
    assert.deepEqual(ids(sortInventory(input, 'price-asc')), ['a', 'b']);
    assert.deepEqual(ids(sortInventory(input, 'recent')), ['a', 'b']);
  });
  it('does not manufacture a discount from absent, non-finite or lower prices', () => {
    assert.equal(vehicleDiscount(vehicle('unknown', {price: 0, priceOnRequest: true, previousPrice: 50000})), 0);
    assert.equal(vehicleDiscount(vehicle('invalid', {previousPrice: Infinity})), 0);
    assert.equal(vehicleDiscount(vehicle('lower', {price: 50000, previousPrice: 40000})), 0);
    assert.equal(vehicleDiscount(vehicle('discount', {price: 40000, previousPrice: 50000})), 10000);
  });
  for (const category of ['Budget friendly', 'Luxury in budget', 'Hot deals']) it('excludes unpublished prices from ' + category, () => {
    const filters = {...emptyFilters(), extra: {CATEGORIES: [category]}};
    assert.equal(matchesInventory(vehicle('unknown', {price: 0, priceOnRequest: true, tier: 'Luxe', previousPrice: 50000}), filters, ''), false);
  });
  it('does not classify unknown mileage as almost new', () => {
    const filters = {...emptyFilters(), extra: {CATEGORIES: ['As good as new']}};
    assert.equal(matchesInventory(vehicle('unknown', {year: 2026, mileage: 0, mileageOnRequest: true}), filters, ''), false);
    assert.equal(matchesInventory(vehicle('new', {year: 2026, mileage: 0}), filters, ''), true);
  });
  it('keeps unpublished vehicles in an unfiltered catalogue', () => {
    assert.equal(matchesInventory(vehicle('unknown', {price: 0, priceOnRequest: true, mileage: 0, mileageOnRequest: true}), emptyFilters(), ''), true);
  });
});
