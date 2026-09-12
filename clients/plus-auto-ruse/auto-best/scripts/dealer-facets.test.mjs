import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import test from 'node:test';

// Unit-test the real client filter module with explicit synthetic fixtures.
// This does not install, launch, typecheck or browser-test the application.
const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = await readFile(new URL('../src/lib/data/listing.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;
const inventoryImport = /^import\s*\{\s*featuredVehicles\s*\}\s*from\s*['"]\.\/inventory['"];?\s*/m;
assert.match(compiled, inventoryImport, 'Update the test harness if the inventory import changes.');

function vehicle(id, overrides = {}) {
  return {
    id, verification: 'sample', sourceId: `fixture-${id}`, evidenceUrl: 'https://example.invalid/fixture',
    image: '/fixture.webp', images: ['/fixture.webp'], category: 'Джип', body: 'SUV',
    make: 'Mercedes-Benz', title: 'Mercedes-Benz GLE AMG', year: '2018', yearNumber: 2018,
    mileage: '233 000 км', mileageKm: 233000, fuel: 'Дизел', transmission: 'Автоматик',
    equipment: ['4x4', '360° камера'], condition: 'used', priceEur: 25555,
    href: `/listing-detail-v1/${id}`, taxNote: 'Test fixture', availability: 'Test fixture',
    description: 'Synthetic unit-test fixture, not dealer inventory.', location: 'Test fixture',
    ...overrides
  };
}

const stock = [
  vehicle(1),
  vehicle(2, { make: 'BMW', title: 'BMW X6 40d', equipment: ['4x4'], priceEur: 12999 }),
  vehicle(3, { make: 'Opel', title: 'Opel Corsa', body: 'Hatchback', category: 'Хечбек', equipment: [], priceEur: 7999 })
];

async function loadListing(fixtures = stock) {
  const injected = compiled.replace(inventoryImport, () => `const featuredVehicles = ${JSON.stringify(fixtures)};\n`);
  return import(`data:text/javascript;base64,${Buffer.from(injected).toString('base64')}`);
}

const filtersFor = (listing, query = '') => listing.parseListingFilters(new URLSearchParams(query));

test('equipment options only contain equipment present in imported stock', async () => {
  const listing = await loadListing();
  assert.deepEqual(listing.listingFilterOptions.equipment, ['4x4', '360° камера']);
});

test('trim options omit unsupported inherited template trims', async () => {
  const listing = await loadListing();
  assert.deepEqual(listing.listingFilterOptions.versions, ['', 'AMG']);
});

test('empty inventory does not expose inherited trim or equipment choices', async () => {
  const listing = await loadListing([]);
  assert.deepEqual(listing.listingFilterOptions.versions, ['']);
  assert.deepEqual(listing.listingFilterOptions.equipment, []);
  assert.deepEqual(listing.listingFilterOptions.makes, ['']);
});

test('RS matches the RS6 trim, not the letters inside Corsa', async () => {
  const fixtures = [...stock, vehicle(4, { make: 'Audi', title: 'Audi RS6 Avant' })];
  const listing = await loadListing(fixtures);
  const results = listing.filterListingVehicles(fixtures, filtersFor(listing, 'version=RS'));
  assert.deepEqual(results.map(item => item.id), [4]);
});

test('trim matching is case insensitive and escapes arbitrary URL values', async () => {
  const listing = await loadListing();
  assert.deepEqual(listing.filterListingVehicles(stock, filtersFor(listing, 'version=amg')).map(item => item.id), [1]);
  assert.deepEqual(listing.filterListingVehicles(stock, filtersFor(listing, 'version=.%2B')), []);
});

test('selected equipment and trim survive a URL round trip', async () => {
  const listing = await loadListing();
  const selected = filtersFor(listing, 'version=AMG&equipment=4x4&equipment=4x4&price_max=30000&sort=price-asc');
  const roundTrip = listing.parseListingFilters(listing.listingParams(selected));
  assert.deepEqual(roundTrip, selected);
  assert.deepEqual(listing.filterListingVehicles(stock, roundTrip).map(item => item.id), [1]);
});

test('removing a make chip clears its model and preserves other filters', async () => {
  const listing = await loadListing();
  const selected = filtersFor(listing, 'make=BMW&model=X6&q=diesel&equipment=4x4&price_max=30000');
  const remaining = listing.removeListingFilter(selected, 'make', 'BMW');
  assert.equal(remaining.has('make'), false);
  assert.equal(remaining.has('model'), false);
  assert.equal(remaining.get('q'), 'diesel');
  assert.equal(remaining.get('equipment'), '4x4');
  assert.equal(remaining.get('price_max'), '30000');
});

test('price sorting remains numeric and does not mutate the imported inventory', async () => {
  const listing = await loadListing();
  const original = stock.map(item => item.id);
  assert.deepEqual(listing.filterListingVehicles(stock, filtersFor(listing, 'sort=price-asc')).map(item => item.id), [3, 2, 1]);
  assert.deepEqual(stock.map(item => item.id), original);
});
