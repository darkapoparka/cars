import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import configuration from '../lib/dealer.json';
import {demoVehicles as vehicles} from '../lib/fixtures/demo-vehicles';
import {dealerSchema, vehicleSchema, inventorySchema, importInventorySchema, publicAssetSchema} from '../lib/dealer-schema';

const example = {...configuration, defaultLocale: 'en', enabledLocales: ['en', 'bg']};

describe('public dealer contract', () => {
  it('accepts the retained template configuration and complete vehicle contract', () => {
    assert.ok(dealerSchema.safeParse(configuration).success);
    assert.ok(vehicleSchema.safeParse(vehicles[0]).success);
  });
  for (const patch of [{defaultLocale: 'fr'}, {enabledLocales: []}, {enabledLocales: ['en', 'en']}, {enabledLocales: ['bg']}, {currency: 'euros'}, {phoneE164: '+not-a-phone'}, {email: 'invalid'}, {crmToken: 'private'}]) {
    it('rejects invalid or private dealer fields ' + Object.keys(patch).join(','), () => assert.equal(dealerSchema.safeParse({...example, ...patch}).success, false));
  }
  for (const url of ['javascript:alert(1)', '//example.com/car.jpg', '/..%2fsecret', '/cars/../secret', 'https://user:password@example.com/car.jpg', '/%5cexample.com/a', '/', '/cars/', '/cars/%00.webp']) {
    it('rejects unsafe public assets: ' + url, () => assert.equal(publicAssetSchema.safeParse(url).success, false));
  }
  it('accepts local paths and explicit HTTPS assets', () => {
    assert.ok(publicAssetSchema.safeParse('/cars/photo.webp').success);
    assert.ok(publicAssetSchema.safeParse('https://images.example.test/car.webp').success);
  });
  for (const patch of [{price: -1}, {monthly: Infinity}, {mileage: NaN}, {fuel: 'unknown'}, {transmission: 'robot'}, {slug: '../car'}, {price: 0, priceOnRequest: false}, {listedAt: 'not-a-date'}, {privateNotes: 'not public'}]) {
    it('rejects invalid vehicle data ' + Object.keys(patch).join(','), () => assert.equal(vehicleSchema.safeParse({...vehicles[0], ...patch}).success, false));
  }
  it('accepts explicitly unpublished facts and actual listing dates', () => assert.ok(vehicleSchema.safeParse({...vehicles[0], price: 0, priceOnRequest: true, mileage: 0, mileageOnRequest: true, listedAt: '2026-10-01'}).success));
  it('rejects duplicate identities in stock and imports', () => {
    assert.equal(inventorySchema.safeParse([vehicles[0], vehicles[0]]).success, false);
    assert.equal(importInventorySchema.safeParse([{countryCode: 'DE', vehicle: vehicles[0]}, {countryCode: 'US', vehicle: vehicles[0]}]).success, false);
  });
});
