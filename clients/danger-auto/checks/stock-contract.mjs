/** Data-module execution only; not Svelte check, build, or browser QA. */
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm, access } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
const client = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = join(client, 'auto-best');
const scratch = await mkdtemp(join(tmpdir(), 'danger-stock-check-'));
const results = [];
async function check(name, fn) {
  try { await fn(); results.push({ name, outcome: 'passed' }); }
  catch (error) { results.push({ name, outcome: 'failed', message: error.message }); }
}
try {
  const stockText = await readFile(join(app, 'src/lib/data/dealer-stock.json'), 'utf8');
  await writeFile(join(scratch, 'dealer-stock.json'), stockText);
  for (const name of ['inventory', 'listing']) {
    let source = await readFile(join(app, `src/lib/data/${name}.ts`), 'utf8');
    source = source.replace("from './dealer-stock.json';", "from './dealer-stock.json' with { type: 'json' };")
      .replace("from './inventory';", "from './inventory.mjs';");
    await writeFile(join(scratch, `${name}.mjs`), stripTypeScriptTypes(source));
  }
  const inventory = await import(pathToFileURL(join(scratch, 'inventory.mjs')).href);
  const listing = await import(pathToFileURL(join(scratch, 'listing.mjs')).href);
  const stock = JSON.parse(stockText);
  const cars = inventory.featuredVehicles;
  const select = query => listing.filterListingVehicles(cars, listing.parseListingFilters(new URLSearchParams(query)));
  await check('8 unique sourced records', () => { assert.equal(cars.length, 8); assert.equal(new Set(cars.map(x => x.sourceId)).size, 8); });
  await check('shared snapshot equals app snapshot', async () => assert.deepEqual(stock, JSON.parse(await readFile(join(client, 'STOCK.json'), 'utf8'))));
  await check('source URLs and observation dates retained', () => { for (const car of cars) { assert.equal(new URL(car.evidenceUrl).hostname, 'dangerauto.mobile.bg'); assert.ok(car.evidenceUrl.includes(car.sourceId)); assert.equal(car.observedAt, '2026-09-09'); } });
  await check('EUR cash prices preserved', () => assert.deepEqual(cars.map(x => x.priceEur), [4990, 4690, 7199, 8299, 6450, 7999, 3300, 4199]));
  await check('unknown Mercedes power remains null', () => assert.equal(cars.find(x => x.id === 5).powerHp, null));
  await check('empty filter returns all records', () => assert.equal(select('').length, 8));
  await check('make and model filter', () => assert.deepEqual(select('make=Opel&model=Mokka').map(x => x.id), [3]));
  await check('mismatched model returns no results', () => assert.equal(select('make=Opel&model=A3').length, 0));
  await check('EUR budget filter', () => assert.deepEqual(select('price_max=5000').map(x => x.id), [1, 2, 7, 8]));
  await check('ascending price sort', () => assert.deepEqual(select('sort=price-asc').map(x => x.id), [7, 8, 2, 1, 5, 3, 6, 4]));
  await check('descending price sort', () => assert.deepEqual(select('sort=price-desc').map(x => x.id), [4, 6, 3, 5, 1, 2, 8, 7]));
  await check('year and kilometre filters', () => assert.deepEqual(select('year_min=2013&mileage_max=150000').map(x => x.id), [1, 6]));
  await check('sourced LPG equipment filter', () => assert.deepEqual(select('equipment=Газова+уредба').map(x => x.id), [1, 3, 8]));
  await check('automatic transmission filter', () => assert.deepEqual(select('transmission=Автоматик').map(x => x.id), [6, 7]));
  await check('filter URL round-trip', () => { const f = listing.parseListingFilters(new URLSearchParams('make=Audi&year_min=2010&price_max=9000&equipment=ISOFIX&sort=price-asc')); assert.deepEqual(listing.parseListingFilters(listing.listingParams(f)), f); });
  await check('removing make clears its model', () => { const f = listing.parseListingFilters(new URLSearchParams('make=Audi&model=A3&price_max=9000')); const p = listing.removeListingFilter(f, 'make', 'Audi'); assert.equal(p.has('make'), false); assert.equal(p.has('model'), false); assert.equal(p.get('price_max'), '9000'); });
  await check('invalid numeric and sort inputs fall back', () => { const f = listing.parseListingFilters(new URLSearchParams('price_max=-1&mileage_max=NaN&year_min=Infinity&sort=unknown')); assert.equal(f.priceMax, null); assert.equal(f.mileageMax, null); assert.equal(f.yearMin, null); assert.equal(f.sort, 'default'); });
  await check('missing price never renders as free', () => { for (const value of [null, undefined, NaN, Infinity, 0, -1]) assert.equal(inventory.formatVehiclePrice(value), 'Цена при запитване'); });
  await check('sample not marked live or verified', () => { for (const car of cars) { assert.equal(car.verification, 'sample'); assert.equal(car.availability, 'advertised-unverified'); } });
  await check('pending media explicit and local', async () => { assert.equal(stock.mediaReuseCleared, false); for (const car of cars) { assert.equal(car.imagePending, true); assert.equal(car.images.length, 0); assert.equal(car.image, '/assets/images/lead/stock-photo-pending.svg'); await access(join(app, 'static', car.image.slice(1))); } });
  await check('original detail route contract retained', () => { for (const car of cars) assert.equal(car.href, `/listing-detail-v1/${car.id}`); });
  await check('facets reflect this stock', () => { assert.equal(listing.listingFilterOptions.equipment.includes('Панорамен покрив'), false); assert.equal(listing.listingFilterOptions.years.includes('2006'), true); assert.equal(listing.listingFilterOptions.prices.includes('4000'), true); });
} finally { await rm(scratch, { recursive: true, force: true }); }
const failed = results.filter(x => x.outcome === 'failed');
console.log(JSON.stringify({ scope: 'TypeScript syntax stripping and data-module execution; not framework or browser QA', runtime: process.version, passed: results.length - failed.length, failed: failed.length, results }, null, 2));
if (failed.length) process.exitCode = 1;
