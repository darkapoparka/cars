import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

// Compile the real pure domain modules, with the same TypeScript compiler as the app.
const out = path.resolve('artifacts/domain');
await mkdir(out, { recursive: true });
for (const name of ['inventory', 'listing', 'journeys']) {
  const source = await readFile(`src/lib/data/${name}.ts`, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
    .replace(/from '\.\/(inventory|listing)'/g, "from './$1.mjs'");
  await writeFile(`${out}/${name}.mjs`, code);
}
const inventory = await import(pathToFileURL(`${out}/inventory.mjs`));
const listing = await import(pathToFileURL(`${out}/listing.mjs`));
const journeys = await import(pathToFileURL(`${out}/journeys.mjs`));
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
await writeFile(`${out}/report.json`, JSON.stringify({ passed: true, records: records.length, checks: ['record validity', 'filter roundtrip', 'equipment deduplication', 'numeric boundaries', 'dependent reset', 'safe return destinations', 'known vehicle context', 'CSS token ownership'] }, null, 2));
console.log(`Domain checks passed for ${records.length} records, filter/context boundaries and CSS variables.`);
