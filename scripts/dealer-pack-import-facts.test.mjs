import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {stripTypeScriptTypes} from 'node:module';
import {adaptPackImportFacts} from './lib/dealer-pack-import-facts.mjs';
import {refreshAdapterInternals as adapters} from './lib/client-refresh-adapters.mjs';
import {refreshNormalizeInternals} from './lib/client-refresh-normalize.mjs';

const root = path.resolve(import.meta.dirname, '..');
const sourcePaths = ['src/lib/data/daynight.ts', 'src/lib/data/vehicles.ts', 'src/lib/types/vehicle.ts',
  'src/lib/domain/vehicle-card.ts', 'src/lib/server/vehicle-detail.ts', 'src/lib/domain/vehicle-search.ts',
  'src/lib/server/inventory-options.ts', 'src/lib/server/inventory-options-mobile.ts', 'src/lib/utils/format.ts',
  'src/lib/server/auxero-template.ts', 'src/lib/server/auxero-listing-data.ts', 'src/lib/auxero/compare.ts'];
const read = name => fs.readFileSync(path.join(root, 'templates/import', name), 'utf8');
const withoutImports = source => source.replace(/(?:import|export)\s+(?:type\s+)?[^;]*?\sfrom\s*['"][^'"]+['"];\s*/g, '');
const uri = source => 'data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64');
const evaluate = source => import(uri(source));
const between = (source, start, finish) => {
  const begin = source.indexOf(start), end = source.indexOf(finish, begin);
  assert(begin >= 0 && end > begin, 'Actual runtime source boundary: ' + start);
  return source.slice(begin, end);
};
function profileFor(countryCode = 'US') {
  const business = {slug: 'optional-import-fixture', name: 'Optional Import Fixture', city: 'Recorded city',
    countryCode, currency: {GB: 'GBP', US: 'USD', AE: 'AED'}[countryCode], distanceUnit: countryCode === 'AE' ? 'km' : 'mi',
    locale: 'en-' + countryCode, observedAt: '2026-10-19', inventoryNotice: 'Dated source listing; confirm availability.',
    inventoryUrl: 'https://dealer.example/stock', contactUrl: 'https://dealer.example/contact'};
  const raw = {id: 'unknown', title: '2018 Audi Test', make: 'Audi', model: 'Test', year: 2018, currency: business.currency,
    priceAmount: null, priceOnRequest: true, mileageOnRequest: true, images: ['/dealer-stock/fixture.webp'],
    sourceUrl: 'https://dealer.example/stock/unknown', observedAt: '2026-10-19'};
  const listings = [raw, {...raw, id: 'known', priceAmount: 12000, priceOnRequest: false, mileageOnRequest: false, mileageValue: 60000, mileageUnit: business.distanceUnit},
    {...raw, id: 'zero-odometer', priceAmount: 15000, priceOnRequest: false, mileageOnRequest: false, mileageValue: 0, mileageUnit: business.distanceUnit}]
    .map((row, index) => refreshNormalizeInternals.normalizeListing(row, index, business));
  return {factPolicy: 'dealer-pack-optional-v1', business, listings};
}
function sourceFor(profile) {
  const plain = new Map(sourcePaths.map(name => [name, read(name)]));
  adapters.personalizeSvelteMileage(plain, 'import', profile);
  return new Map([...plain].map(([name, text]) => ['import/' + name, Buffer.from(text)]));
}
async function actualRuntime(profile) {
  const files = sourceFor(profile), changed = adaptPackImportFacts(files, profile);
  const source = name => files.get('import/' + name).toString();
  const mileageSource = files.get('import/src/lib/data/dealer-mileage.ts');
  const mileageHead = mileageSource ? 'import {canonicalMileage, formatStockMileage, mileageLimitKm, mileageSortValue} from ' + JSON.stringify(uri(mileageSource.toString())) + ';\n' : '';
  const feed = adapters.importListingFeed(profile);
  const daynightBody = source('src/lib/data/daynight.ts');
  const daynightUrl = uri(mileageHead + 'const mobileBgFeed=' + JSON.stringify(feed) + ';\n' +
    withoutImports(daynightBody.slice(0, daynightBody.indexOf('export const daynightVehicles = feed.listings.map(toVehicle);') + 'export const daynightVehicles = feed.listings.map(toVehicle);'.length)));
  const daynight = await import(daynightUrl);
  const site = {locale: {currency: profile.business.currency, formatLocales: {en: profile.business.locale, bg: 'bg-BG'}}, finance: {annualRate: 5, months: 60, downPaymentPercent: 20, showEstimates: true}};
  const formattingUrl = uri('const site=' + JSON.stringify(site) + ';\n' + withoutImports(read('src/lib/i18n/formatting.ts')));
  const vehiclesUrl = uri('import {daynightVehicles} from ' + JSON.stringify(daynightUrl) + ';\n' +
    'import {illustrativeMonthly} from ' + JSON.stringify(uri(read('src/lib/domain/finance.ts'))) + ';\n' +
    'const unavailableVehiclePhotos=new Set();const unavailableVehicleImage="";const site=' + JSON.stringify(site) + ';\n' + withoutImports(source('src/lib/data/vehicles.ts')));
  const {vehicles} = await import(vehiclesUrl);
  const displayHead = mileageHead + 'import {formatNumber, formatMoney, listedPrice} from ' + JSON.stringify(formattingUrl) + ';\n' +
    'import {vehicleUnits} from ' + JSON.stringify(uri(withoutImports(read('src/lib/i18n/vehicle-units.ts')))) + ';\n' +
    'const inventoryText=(_locale,value)=>value;const translateVehicleTerm=(_locale,_kind,value)=>value;\n';
  const cardUrl = uri(displayHead + withoutImports(source('src/lib/domain/vehicle-card.ts'))), card = await import(cardUrl);
  const compare = await evaluate('import {formatInventoryKm} from ' + JSON.stringify(cardUrl) + ';\n' +
    'const inventoryText=(_locale,value)=>value;const translateVehicleTerm=(_locale,_kind,value)=>value;\n' + withoutImports(source('src/lib/auxero/compare.ts')));
  const search = await evaluate(mileageHead + 'const inventoryText=(_locale,value)=>value;\n' + withoutImports(source('src/lib/domain/vehicle-search.ts')));
  const legacy = source('src/lib/server/auxero-listing-data.ts');
  const projection = await evaluate('import {vehicles} from ' + JSON.stringify(vehiclesUrl) + ';\nconst daynightContact={};const filterRuntimeData={};\n' +
    between(legacy, 'export const getAuxeroListingRuntimeData =', '\nconst compareRow ='));
  const hydrate = await evaluate(between(source('src/lib/server/auxero-template.ts'), 'const formatKm =', '\n\tconst compareLabels =') + '\nexport {formatKm};');
  const server = await evaluate(between(legacy, 'const km =', '\nconst inventoryUrl =') + '\nexport {km};');
  return {files, changed, feed, daynight, vehicles, card, compare, search, hydrate, server,
    projected: projection.getAuxeroListingRuntimeData().vehicles, format: await evaluate(source('src/lib/utils/format.ts'))};
}

test('Import optional facts are explicit; ordinary missing-mileage rejection and source checks remain', () => {
  for (const country of ['US', 'GB', 'AE']) {
    const profile = profileFor(country), before = structuredClone(profile);
    assert.doesNotThrow(() => adapters.assertImportListingFacts(profile));
    assert.throws(() => adapters.assertImportListingFacts({...profile, factPolicy: undefined}), error => error.code === 'IMPORT_FACTS_REQUIRE_REVIEW' && error.fields.includes('mileage'));
    const feed = adapters.importListingFeed(profile);
    assert.equal(feed.fetchedAt, '2026-10-19'); assert.equal(feed.listings[0].mileageKnown, false);
    assert.equal(feed.listings[0].mileage, ''); assert.match(feed.listings[0].price, /request|запитване/);
    assert.equal('mileageValue' in feed.listings[0], false);
    assert.deepEqual(profile, before);
    for (const [field, changes] of [['year', {year: undefined, raw: {}}], ['currency', {currency: 'EUR'}]]) {
      assert.throws(() => adapters.assertImportListingFacts({...profile, listings: [{...profile.listings[0], ...changes}]}), error => error.fields.includes(field));
    }
    const files = sourceFor(profile), snapshot = [...files].map(([name, bytes]) => [name, Buffer.from(bytes)]);
    assert.deepEqual(adaptPackImportFacts(files, {...profile, factPolicy: undefined}), []);
    assert.deepEqual([...files], snapshot);
  }
});

for (const country of ['US', 'GB', 'AE']) test(country + ' actual feed, cards, comparison, server and hydration preserve omitted facts', async () => {
  const profile = profileFor(country), original = structuredClone(profile), runtime = await actualRuntime(profile);
  assert.deepEqual(profile, original);
  const [unknown, known, zero] = runtime.vehicles;
  assert(Number.isNaN(unknown.mileage)); assert.equal(unknown.price, 0); assert.equal(unknown.priceLabel, 'On request');
  assert.equal(unknown.monthly, 0); assert.equal(runtime.daynight.daynightVehicles[0].mileage, '—');
  assert.equal(runtime.daynight.daynightVehicles[0].price, 'On request');
  const cards = runtime.card.inventoryCardsFromVehicles(runtime.vehicles, 'en');
  assert.equal(cards[0].mileageLabel, '—'); assert.equal(cards[0].priceLabel, 'On request'); assert.equal(cards[0].monthlyLabel, '');
  const comparisons = runtime.compare.compareVehiclesFromVehicles(runtime.vehicles, 'en');
  assert.equal(comparisons[0].mileageLabel, '—'); assert.equal(comparisons[0].priceLabel, 'On request');
  for (const value of [NaN, null, undefined, Infinity]) {
    assert.equal(runtime.hydrate.formatKm({mileage: value}), '—');
    assert.equal(runtime.server.km({mileage: value}), '—');
  }
  assert.equal(runtime.hydrate.formatKm(JSON.parse(JSON.stringify(runtime.projected[0]))), '—');
  const label = '60,000 ' + profile.business.distanceUnit;
  assert.equal(cards[1].mileageLabel, label); assert.equal(comparisons[1].mileageLabel, label);
  assert.equal(runtime.server.km(known), label); assert.equal(runtime.hydrate.formatKm(runtime.projected[1]), label);
  assert.equal(runtime.hydrate.formatKm(JSON.parse(JSON.stringify(runtime.projected[1]))), label);
  assert.equal(runtime.hydrate.formatKm(runtime.projected[2]), '0 ' + profile.business.distanceUnit);
  assert.equal(cards[2].mileageLabel, '0 ' + profile.business.distanceUnit);
  assert.equal(zero.mileage, 0); assert.equal(runtime.daynight.daynightVehicles[2].mileageKm, 0);
  if (country !== 'AE') {
    assert.equal(known.mileage, 96560.64); assert.equal(known.mileageValue, 60000); assert.equal(known.mileageUnit, 'mi');
    assert.equal(runtime.projected[1].mileageValue, 60000); assert.equal(runtime.projected[1].mileageUnit, 'mi');
    const mixed = {...known, mileage: 90000, mileageValue: 90000, mileageUnit: 'km'};
    assert.equal(runtime.card.inventoryCardsFromVehicles([mixed], 'en')[0].mileageLabel, '90,000 km');
    assert.equal(runtime.hydrate.formatKm(mixed), '90,000 km');
  }
  for (const value of [0, NaN, Infinity]) assert.equal(runtime.format.formatPrice(value), 'On request');
  assert.equal(runtime.format.formatPrice(12000), '12 000 ' + profile.business.currency);
  assert.equal(runtime.format.formatMileage(NaN), '—'); assert.equal(runtime.format.formatMileage(0), '0 km');
  assert.equal(known.price, 12000); assert.equal(known.priceLabel, '12 000 ' + profile.business.currency);
  const controlSource = runtime.files.get('import/src/lib/server/auxero-listing-data.ts').toString();
  const controls = await evaluate(between(controlSource, 'const priceFilterOptions =', '\nconst viewIcon =') + '\nexport {priceFilterOptions, mileageFilterOptions};');
  assert(controls.priceFilterOptions.every(option => option.label.endsWith(' ' + profile.business.currency)));
  assert(controls.mileageFilterOptions.every(option => option.label.endsWith(' ' + profile.business.distanceUnit)));
  for (const name of runtime.changed) stripTypeScriptTypes(runtime.files.get(name).toString());
  assert(runtime.changed.every(name => name.startsWith('import/')));
});

for (const country of ['US', 'AE']) test(country + ' actual numeric filters exclude unknowns and keep inclusive native mileage boundaries', async () => {
  const runtime = await actualRuntime(profileFor(country));
  const ids = filters => runtime.search.filterVehicles(runtime.vehicles, filters).map(row => row.stockNumber);
  assert.deepEqual(ids({}), ['unknown', 'known', 'zero-odometer']);
  assert.deepEqual(ids({minPrice: 0}), ['known', 'zero-odometer']);
  assert.deepEqual(ids({maxPrice: 0}), []);
  assert.deepEqual(ids({maxPrice: 12000}), ['known']);
  assert.deepEqual(ids({minMileage: 0}), ['known', 'zero-odometer']);
  assert.deepEqual(ids({maxMileage: 60000}), ['known', 'zero-odometer']);
  assert.deepEqual(ids({maxMileage: 59999}), ['zero-odometer']);
});

test('a missing or drifted late Import formatter boundary refuses the whole source map atomically', () => {
  for (const country of ['US', 'AE']) for (const missing of [true, false]) {
    const profile = profileFor(country), files = sourceFor(profile), target = 'import/src/lib/domain/vehicle-search.ts';
    if (missing) files.delete(target);
    else files.set(target, Buffer.from(files.get(target).toString().replace('return source.filter((vehicle) => {', 'return source.filter((changed) => {')));
    const before = [...files].map(([name, bytes]) => [name, Buffer.from(bytes)]);
    assert.throws(() => adaptPackImportFacts(files, profile), /Import facts boundary/);
    assert.deepEqual([...files], before);
  }
});
