import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import test from 'node:test';
import {prepareAppDealer} from '../lib/app-dealer-adapter.mjs';
import {dealerSchema, inventorySchema} from '../../templates/app/lib/dealer-schema.ts';

// This integration check uses the maintained App's installed zod and real
// strict consumer schemas. It creates no application copy, assets or build.
const manifest = {slug: 'schema-fixture', localization: {dealerCountry: 'GB', defaultLocale: 'en', inventoryCurrency: 'GBP'}, variants: [{key: 'auto-best'}, {key: 'modern'}, {key: 'import'}]};
async function adapt(dates) {
  const profile = {slug: manifest.slug, business: {name: 'Schema Fixture', country: 'GB', logo: '/dealer/logo.png'}, listings: dates.map((observedAt, index) => ({slug: 'vehicle-' + index, brand: 'Toyota', model: 'Yaris', year: 2020, priceAmount: 9000, currency: 'GBP', images: ['/dealer/stock.jpg'], observedAt, engineSize: '1.5L', features: ['Reversing camera']}))};
  const bytes = Buffer.from(JSON.stringify(profile));
  const readFile = async name => Buffer.from(name.endsWith('dealer-profile.json') ? bytes : 'schema-only asset fixture');
  const result = await prepareAppDealer('', manifest, {readFile});
  assert.equal(result.provenance.profileSha256, createHash('sha256').update(bytes).digest('hex'));
  return {result, profile};
}

test('generated dealer inventory satisfies the actual strict App consumer without losing engine/features', async () => {
  const {result} = await adapt(['2026-10-17', '2026-10-18']);
  const inventory = inventorySchema.parse(result.inventory);
  dealerSchema.parse(result.config);
  assert.equal(inventory[0].engine, '1.5L');
  assert.deepEqual(inventory[0].highlights, ['Reversing camera']);
  assert.deepEqual(inventory.map(row => row.observedAt), ['2026-10-17', '2026-10-18']);
});

test('aggregate observation date is the newest instant while each original stock date and provenance remain', async () => {
  const dates = ['2026-10-18T00:30:00+02:00', '2026-10-17T23:30:00Z'];
  const {result, profile} = await adapt(dates);
  assert.equal(dealerSchema.parse(result.config).observedAt, dates[1]);
  assert.deepEqual(inventorySchema.parse(result.inventory).map(row => row.observedAt), dates);
  assert.equal(result.provenance.observedAt, [...dates].sort().join(', '));
  assert.deepEqual(profile.listings.map(row => row.observedAt), dates);
});

test('single and absent observation dates remain schema-compatible without invented dates', async () => {
  for (const dates of [['2026-10-17'], ['', '']]) {
    const {result} = await adapt(dates);
    assert.equal(dealerSchema.parse(result.config).observedAt, dates[0]);
    inventorySchema.parse(result.inventory);
  }
});

test('invalid stock dates remain visible to strict validation', async () => {
  const {result} = await adapt(['not a recorded date']);
  assert.equal(inventorySchema.safeParse(result.inventory).success, false);
});
