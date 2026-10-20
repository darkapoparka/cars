import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createRequire, stripTypeScriptTypes} from 'node:module';
import {filesAt, ROOT} from './lib/workflow.mjs';
import {applyExtendedRefreshAdapter} from './lib/client-refresh-six.mjs';

const require = createRequire(process.env.CARS_ESBUILD_RESOLVE_FROM || import.meta.url), esbuild = require('esbuild');
const sourceMaps = new Map();
function sourceFor(key) {
  if (!sourceMaps.has(key)) {
    const directory = path.join(ROOT, 'templates', key);
    sourceMaps.set(key, new Map(filesAt(directory).filter(name => name === 'package.json' || name.startsWith('src/')).map(name => [key + '/' + name, fs.readFileSync(path.join(directory, name))])));
  }
  return new Map(sourceMaps.get(key));
}
function fixture(t, key, countryCode = 'US') {
  const client = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-pack-facts-'));
  t.after(() => fs.rmSync(client, {recursive: true}));
  fs.mkdirSync(path.join(client, 'dealer-brand')); fs.mkdirSync(path.join(client, 'dealer-stock'));
  fs.writeFileSync(path.join(client, 'dealer-brand/logo.webp'), 'retained logo fixture');
  fs.writeFileSync(path.join(client, 'dealer-stock/car.webp'), 'retained stock fixture');
  const currency = {US: 'USD', GB: 'GBP', AE: 'AED'}[countryCode], distanceUnit = countryCode === 'AE' ? 'km' : 'mi';
  const business = {name: 'Optional Facts Motors', locale: countryCode === 'US' ? 'en-US' : 'en-GB', countryCode,
    country: {US: 'United States', GB: 'United Kingdom', AE: 'United Arab Emirates'}[countryCode], currency, distanceUnit,
    phoneE164: '', phoneHref: '', phoneDisplay: '', email: '', address: '', city: 'Recorded city', mapsUrl: '', mapsEmbedUrl: '',
    socialLinks: {}, hours: '', logo: '/dealer-brand/logo.webp', logoDark: '/dealer-brand/logo.webp', inventoryNotice: 'Dated examples. Price and mileage not published.', observedAt: '2026-10-19'};
  const listing = {id: 'unknown', slug: 'unknown', title: '2020 Toyota Corolla', make: 'Toyota', model: 'Corolla', trim: '', year: 2020,
    priceAmount: null, currency, mileageValue: 0, mileageUnit: distanceUnit, mileageOnRequest: true, powerHp: null,
    fuel: 'Not published', transmission: 'Not published', body: 'Sedan', bodyType: 'sedan', color: '', location: business.city,
    features: [], images: ['/dealer-stock/car.webp'], image: '/dealer-stock/car.webp', description: business.inventoryNotice,
    availability: 'Confirm availability', sourceUrl: 'https://example.com/dated-listing', observedAt: business.observedAt, raw: {year: 2020}};
  return {client, files: sourceFor(key), key, profile: {slug: 'optional-facts', factPolicy: 'dealer-pack-optional-v1', business, listings: [listing]}};
}
const moduleFrom = source => import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64'));

for (const country of ['GB', 'AE', 'US']) test('Mobile ' + country + ' keeps omitted source facts unknown in native display and filters', async t => {
  const data = fixture(t, 'mobile', country), original = JSON.stringify(data.profile);
  const adapted = applyExtendedRefreshAdapter(data), inventory = JSON.parse(data.files.get('mobile/src/lib/dealer-inventory.json'));
  assert.equal(JSON.stringify(data.profile), original); assert.equal(inventory.length, 1);
  assert.equal(inventory[0].price, null); assert.equal(inventory[0].priceKnown, false); assert.equal(inventory[0].priceOnRequest, true);
  assert.equal(inventory[0].mileage, null); assert.equal(inventory[0].mileageKnown, false); assert.equal(inventory[0].mileageOnRequest, true);
  const mileage = await moduleFrom(data.files.get('mobile/src/lib/mobile-mileage.ts').toString());
  const price = await moduleFrom(data.files.get('mobile/src/lib/dealer-pack-price.ts').toString());
  const localeSource = data.files.get('mobile/src/lib/locale.ts').toString().replace(/^import[^;]+;\n/, 'const bgMessages: Record<string,string> = {};\n');
  const locale = await moduleFrom(localeSource), unknown = {...inventory[0], price: NaN, mileage: NaN};
  assert.equal(locale.localeMoney(unknown.price, 'en'), 'Price on request');
  const legacyMoney = await moduleFrom(data.files.get('mobile/src/lib/search.ts').toString().match(/export const money = [\s\S]*$/)[0]);
  assert.equal(legacyMoney.money(unknown.price), 'Price on request');
  assert.equal(mileage.formatMobileMileage(unknown), 'Mileage on request'); assert(Number.isNaN(mileage.mobileMileageValue(unknown)));
  assert.equal(price.hasPackPrice(unknown), false);
  for (const direction of [1, -1]) assert(price.comparePackPrice(unknown, {price: 12000}, direction) > 0);
  const assistantSource = data.files.get('mobile/src/lib/assistant.ts').toString().replace(/^import[^;]+;\s*/gm, '');
  const assistant = await moduleFrom('const vehicles = [' + JSON.stringify(inventory[0]) + '].map(v => ({...v, price:NaN, mileage:NaN}));\n' +
    data.files.get('mobile/src/lib/mobile-mileage.ts') + '\n' + data.files.get('mobile/src/lib/dealer-pack-price.ts') + '\n' +
    'const money = () => "Price on request";\n' + assistantSource);
  assert.deepEqual(assistant.answerLocally('cheapest car').ids, []);
  assert.match(assistant.answerLocally('Toyota').text, /Mileage on request/);
  assert.doesNotMatch(assistant.answerLocally('Toyota').text, /NaN|0 hp|0 km/);
  assert.match(data.files.get('mobile/src/components/FinanceCalculator.tsx').toString(), /if \(!Number\.isFinite\(v\.price\) \|\| v\.price <= 0\) return/);
  assert.doesNotMatch(data.files.get('mobile/src/components/NativeCarPark.tsx').toString(), /v\.price\.toLocaleString/);
  assert.match(data.files.get('mobile/src/lib/catalog.ts').toString(), /price: typeof vehicle\.price === 'number' \? vehicle\.price : Number\.NaN/);
  for (const name of adapted.contentPaths.filter(name => /\.tsx?$/.test(name))) {
    esbuild.transformSync(data.files.get(name).toString(), {loader: name.endsWith('.tsx') ? 'tsx' : 'ts', target: 'es2022'});
  }
});

test('Mobile pack source retains original miles while numeric filters use the selected dealer unit', async t => {
  const data = fixture(t, 'mobile', 'US'), item = data.profile.listings[0];
  Object.assign(item, {mileageValue: 60000, mileageUnit: 'mi', mileageOnRequest: false, raw: {year: 2020, mileageMiles: 60000}});
  applyExtendedRefreshAdapter(data);
  const inventory = JSON.parse(data.files.get('mobile/src/lib/dealer-inventory.json'));
  const helper = await moduleFrom(data.files.get('mobile/src/lib/mobile-mileage.ts').toString());
  assert.equal(helper.formatMobileMileage(inventory[0]), '60,000 mi');
  assert.equal(helper.mobileMileageValue(inventory[0]), 60000);
  assert.equal(inventory[0].mileageSourceValue, 60000); assert.equal(inventory[0].mileageSourceUnit, 'mi');
});

test('Signature pack discovery accepts POA while excluding it from budget and cheapest claims', async t => {
  const data = fixture(t, 'karento-best', 'US'); applyExtendedRefreshAdapter(data);
  const source = data.files.get('karento-best/src/lib/discovery/discovery.ts').toString();
  assert.match(source, /priceAmount\?: number/);
  const sourceWithoutImports = source.replace(/^import[^;]+;\s*/gm, '');
  const discovery = await moduleFrom('const normalizeCatalogBudget = (value: string) => value;\n' + sourceWithoutImports);
  const [car] = discovery.discoveryCars;
  assert.equal(car.price, 'Price on request'); assert.equal(car.priceAmount, undefined); assert.equal(car.mileageValue, undefined);
  assert.equal(car.mileage, ''); assert.equal(car.offer, false); assert.equal(car.exclusive, false);
  assert.equal(discovery.searchCars('').length, 1);
  assert.equal(discovery.searchCars('', {...discovery.emptyDiscoveryFilters, priceMax: '10000'}).length, 0);
  assert.equal(discovery.collectionCars('cheapest').length, 0); assert.equal(discovery.collectionCars('under-10000').length, 0);
  assert(!discovery.collections.some(row => row.id === 'cheapest'));
});

for (const key of ['mobile', 'karento-best']) test('the ordinary ' + key + ' adapter still rejects an unpublished mandatory price', t => {
  const data = fixture(t, key, 'GB'); delete data.profile.factPolicy;
  assert.throws(() => applyExtendedRefreshAdapter(data), /requires source mileage and a published price|requires published numeric price/);
});
