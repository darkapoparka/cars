import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { contractForTemplate, dealerContentContract } from './dealer-content-contract.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const source = (key, relative) => fs.readFileSync(path.join(root, 'templates', key, relative), 'utf8');

test('contract points to current typed application boundaries and leaves presentation modules out', () => {
  assert.match(source('auto-best', dealerContentContract['auto-best'].identity.path), /export const brand =/);
  assert.match(source('auto-best', dealerContentContract['auto-best'].inventory.path), /export const featuredVehicles/);

  assert.match(source('modern', dealerContentContract.modern.identity.path), /export const leadSite: LeadSiteConfig/);
  assert.match(source('modern', dealerContentContract.modern.inventory.path), /export const mockListings: VehicleListing\[\]/);
  assert.match(source('modern', 'packages/marketplace/index.ts'), /export \* from "\.\/mock-data"/);
  assert.match(source('modern', 'apps/web/lib/public-marketplace-data.ts'), /mockListings/);
  assert.match(source('modern', 'apps/web/lib/public-marketplace-data.ts'), /getCurrentPublicDataMode/);
  assert.match(source('modern', 'apps/web/lib/public-inventory-search.ts'), /@repo\/marketplace\/mock-data/);
  assert.match(source('modern', 'apps/web/lib/public-inventory-search.ts'), /getCurrentPublicDataMode\(\) === "demo"/);
  assert.match(source('modern', dealerContentContract.modern.locale.localized.path), /localizedCopy/);

  assert.match(source('carwow', dealerContentContract.carwow.identity.path), /export const daynightDealerText/);
  assert.match(source('carwow', dealerContentContract.carwow.inventory.path), /export const currentDayNightListings/);

  for (const name of dealerContentContract.import.identity.exports) {
    assert.match(source('import', dealerContentContract.import.identity.path), new RegExp(`export const ${name} =`));
  }
  assert.match(source('import', dealerContentContract.import.inventory.path), /"listings"\s*:/);
  assert.match(source('import', dealerContentContract.import.locale.copy), /export const dealerCopy/);

  for (const key of ['auto-best', 'modern', 'carwow', 'import']) {
    assert.equal(contractForTemplate(key), dealerContentContract[key]);
    assert.equal(Object.hasOwn(dealerContentContract[key], 'presentation'), false);
  }
  assert.throws(() => contractForTemplate('unknown'), /No dealer-content contract/);
});

test('independent and Cars-owned source packs use the shared facts/stock inputs', () => {
  for (const client of [
    'I:/cars-clients/al-reef-used-cars',
    path.join(root, 'clients/al-basma-motors'),
    path.join(root, 'clients/promosale-varna')
  ]) {
    assert.equal(fs.existsSync(path.join(client, 'business-facts.json')), true, `${client}: facts pack`);
    assert.equal(fs.existsSync(path.join(client, 'stock.json')), true, `${client}: stock pack`);
  }
});
