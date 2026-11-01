import assert from 'node:assert/strict';
import {it} from 'node:test';
import {localDateValue, readCarsPurpose, validRentalDates} from '../lib/rental-enquiry';
import catalogue from '../lib/shop-products.json';

it('restores only the supported Buy/Rent modes', () => {
  assert.equal(readCarsPurpose('rent'), 'rent');
  for (const value of ['buy', '', 'invalid', null, undefined]) assert.equal(readCarsPurpose(value), 'buy');
});
it('uses local calendar dates without a UTC day shift', () => assert.equal(localDateValue(new Date(2026, 10, 1, 0, 5)), '2026-11-01'));
it('accepts future and same-day rental requests', () => {
  assert.ok(validRentalDates('2026-11-02', '2026-11-05', '2026-11-01'));
  assert.ok(validRentalDates('2026-11-01', '2026-11-01', '2026-11-01'));
});
it('rejects missing, past, reversed and impossible rental dates', () => {
  for (const [pickup, returning] of [['', '2026-11-05'], ['2026-11-02', ''], ['2026-10-31', '2026-11-05'], ['2026-11-05', '2026-11-02'], ['2027-02-30', '2027-03-02']]) assert.equal(validRentalDates(pickup, returning, '2026-11-01'), false);
});
it('keeps the reused Shop products individually addressable and their sample currency explicit', () => {
  assert.equal(new Set(catalogue.products.map(product => product.id)).size, catalogue.products.length);
  assert.ok(catalogue.products.every(product => product.currency === 'USD' && product.image.startsWith('/shop/') && product.price > 0));
});
