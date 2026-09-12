import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { loadDomain } from './load-domain.mjs';
const out = path.resolve('artifacts/domain');
await mkdir(out, { recursive: true });
const inventory = await loadDomain('src/lib/data/inventory.ts');
const listing = await loadDomain('src/lib/data/listing.ts');
const journeys = await loadDomain('src/lib/data/journeys.ts');
const finance = await loadDomain('src/lib/data/finance.ts');
const fields = await loadDomain('src/lib/data/filter-fields.ts');
const yearPolicy = await loadDomain('src/lib/config/discovery.ts');
const records = inventory.featuredVehicles;
assert.equal(new Set(records.map(record => record.id)).size, records.length);
for (const record of records) {
  assert(Number.isSafeInteger(record.id) && record.id > 0);
  assert(record.yearNumber >= 1900 && Number.isSafeInteger(record.yearNumber));
  assert(record.priceEur > 0 && Number.isFinite(record.priceEur));
  assert(record.mileageKm >= 0 && Number.isSafeInteger(record.mileageKm));
  assert.equal(record.href, `/listing-detail-v1/${record.id}`);
  assert(['sample', 'verified'].includes(record.verification));
  assert(record.verification !== 'verified' || record.evidenceUrl);
}
const filters = listing.parseListingFilters(new URLSearchParams('make=BMW&model=X6&sort=price-asc&equipment=4x4&equipment=4x4&equipment=unknown&price_min=0&price_max=80000&year_min=2019'));
assert.equal(filters.equipment.length, 1);
assert.deepEqual(listing.parseListingFilters(listing.listingParams(filters)), filters);
assert.equal(listing.removeListingFilter(filters, 'make', 'BMW').has('model'), false);
assert.equal(listing.removeListingFilter(filters, 'make', 'BMW').get('sort'), 'price-asc');
for (const value of ['12oops', '-1', '1.5', 'Infinity', '999999999999999999']) assert.equal(listing.parseListingFilters(new URLSearchParams({ price_max: value })).priceMax, null);
assert.equal(listing.filterListingVehicles(records, listing.parseListingFilters(new URLSearchParams('price_max=0'))).length, 0);
for (const value of ['//example.com/listing-grid', '/\\example.com', 'javascript:alert(1)', '/contact', '/listing-grid/evil', 'https://example.com/listing-grid']) assert.equal(journeys.listReturn(value, '/listing-grid'), '/listing-grid');
assert.equal(journeys.listReturn('/listing-grid?make=BMW#vehicle-4', '/listing-grid'), '/listing-grid?make=BMW#vehicle-4');
for (const value of ['0', '01', '1x', '999', 'BMW']) assert.equal(journeys.selectedVehicle(value), null);
assert.equal(journeys.selectedVehicle('4').id, 4);

async function sources(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(async entry => entry.isDirectory() ? sources(path.join(dir, entry.name)) : /\.(svelte|css|ts)$/.test(entry.name) ? await readFile(path.join(dir, entry.name), 'utf8') : ''))).flat().join('\n');
}
const source = await sources('src');
const defined = new Set([...source.matchAll(/(--[\w-]+)\s*[:=]/g)].map(match => match[1]));
const missing = [...new Set([...source.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map(match => match[1]))].filter(name => !defined.has(name));
assert.deepEqual(missing, [], 'Every CSS variable without a fallback needs an owner');
console.log(`Domain checks passed for ${records.length} records, filter/context boundaries and CSS variables.`);

const discovery = await loadDomain('src/lib/data/discovery.ts');
const enquiry = await loadDomain('src/lib/data/enquiry.ts');
for (const threshold of discovery.budgetBands.flatMap(band => band.minimum === null ? [] : [band.minimum])) {
  for (const priceEur of [threshold - 0.01, threshold, threshold + 0.01]) {
    const record = { ...records[0], priceEur };
    let total = 0;
    for (const band of discovery.budgetBands) {
      const count = discovery.budgetCount([record], band);
      const params = new URL(discovery.budgetHref(band), 'https://template.invalid').searchParams;
      assert.equal(listing.filterListingVehicles([record], listing.parseListingFilters(params)).length, count);
      total += count;
    }
    assert.equal(total, 1, `Budget bands partition boundary ${priceEur} exactly once`);
  }
}
for (const blank of ['', ' ', '\t\n']) {
  assert.equal(Object.keys(enquiry.validateVehicleIdentity(blank, blank, false).errors).length, 2);
  assert.deepEqual(enquiry.validateVehicleIdentity(blank, blank, true).errors, {});
}
assert.deepEqual(enquiry.validateVehicleIdentity(' Audi ', ' A6 ', false).values, { make: 'Audi', model: 'A6', year: '' });
console.log('Budget boundary and trimmed enquiry regression checks passed.');

for (const record of records) {
  assert(record.model.trim()); assert.equal(typeof record.version, 'string');
  assert(listing.listingModelsForMake(record.make).includes(record.model));
}
const context = new URL(journeys.vehicleContactHref(records[0].id, 'leasing', { downPaymentEur: 10000, termMonths: 24 }), 'https://template.invalid').searchParams;
assert.deepEqual(finance.parseFinanceSelection(context, records[0].priceEur), { downPaymentEur: 10000, termMonths: 24 });
for (const [amount, term] of [['-1','24'], ['Infinity','24'], ['12x','24'], ['100000000','24'], ['10000','13']]) {
  assert.equal(finance.parseFinanceSelection(new URLSearchParams({ down_payment: amount, term }), records[0].priceEur), null);
}
assert.equal(finance.calculateFinance(60000, { downPaymentEur: 10000, termMonths: 24 }).principalPerMonth, 2083);
assert.equal(finance.calculateFinance(60000, { downPaymentEur: 70000, termMonths: 24 }).financedPrincipal, 0);
assert(enquiry.validateVehicleIdentity('Audi', 'A6', false, String(yearPolicy.maximumVehicleYear() + 1)).errors.year);
assert(enquiry.validateVehicleIdentity('Audi', 'A6', false, '1899').errors.year);
assert.deepEqual(enquiry.validateVehicleIdentity('Audi', 'A6', false, '2020').errors, {});
assert.equal(fields.filtersFromDraft({ priceMax: '60000' }).priceMax, 60000);
assert.equal(fields.filtersFromDraft({ priceMax: '60000x' }).priceMax, null);
assert(fields.invalidRange('90000','60000'));
assert(!fields.invalidRange('','60000'));
await writeFile(`${out}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), passed: true, records: records.length, checks: ['records', 'filter URL roundtrip', 'numeric boundaries', 'budget partition', 'trimmed required values', 'year policy', 'finance calculation and URL validation', 'model facets', 'CSS token ownership'] }, null, 2));
console.log('PASS finance, year and shared draft contracts.');
