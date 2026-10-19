import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';
import { DEALER_PACK_MODERN_PATHS, dealerPackModernListing, dealerPackModernRuntime, personalizeDealerPackModernFacts } from './lib/dealer-pack-modern-facts.mjs';
import { UK_MODERN_PATHS, personalizeModernUk } from './lib/client-refresh-uk-next.mjs';
import { refreshAdapterInternals } from './lib/client-refresh-adapters.mjs';
import { refreshNormalizeInternals } from './lib/client-refresh-normalize.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = 'packages/marketplace-domain/testing/mock-data.ts';
const formatPath = 'packages/marketplace/format.ts';
const financePath = 'apps/web/app/[locale]/lease/lease-finance-policy.ts';
const profile = (countryCode = 'US') => ({
  factPolicy: 'dealer-pack-optional-v1', slug: 'example', listings: [],
  business: { slug: 'example', name: 'Example Cars', city: 'Example City', country: countryCode, countryCode, currency: { US: 'USD', AE: 'AED', GB: 'GBP' }[countryCode], distanceUnit: countryCode === 'AE' ? 'km' : 'mi', locale: `en-${countryCode}`, observedAt: '2026-10-19', inventoryNotice: 'Dated public listing; availability unconfirmed.' }
});
const item = (extra = {}) => ({
  id: 'source-one', slug: 'vehicle-one', title: '2022 Example Hatchback', make: 'Example', model: 'Hatchback', year: 2022,
  priceAmount: null, priceOnRequest: true, mileageOnRequest: true, mileageValue: null,
  images: ['/dealer-stock/one.jpg'], features: [], observedAt: '2026-10-19T10:00:00Z', raw: extra.raw ?? extra, ...extra
});
const known = (extra = {}) => item({ priceAmount: 12000, priceOnRequest: false, mileageOnRequest: false, mileageValue: 1000, mileageUnit: 'mi', transmissionType: 'automatic', ...extra });
const generated = (country = 'US') => {
  const p = profile(country);
  const names = [...new Set([...DEALER_PACK_MODERN_PATHS, ...(country === 'GB' ? UK_MODERN_PATHS : [])])];
  const files = new Map(names.map(name => [name, fs.readFileSync(path.join(root, 'templates/modern', name))]));
  if (country === 'GB') personalizeModernUk(files, p);
  const changed = personalizeDealerPackModernFacts(files, p);
  return { p, files, changed };
};
const plain = value => Buffer.isBuffer(value) ? value.toString('utf8') : String(value);
const withoutImports = source => source.replace(/^import[\s\S]*?;\n/gm, '');
const uri = source => 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const evaluate = async (source, prefix = '') => import(uri(prefix + stripTypeScriptTypes(withoutImports(source))));
const runtimeImport = p => `import { priceOnRequestLabel, formatDealerPackMileage, dealerMileageKm, dealerMileageLimitKm, isPublishedDealerPrice, compareDealerPrices, compareDealerMileages } from ${JSON.stringify(uri(stripTypeScriptTypes(dealerPackModernRuntime(p))))};\n`;

test('optional listing facts require the explicit policy and retain source dates and flags', () => {
  const p = profile(), source = item(), before = structuredClone(source);
  const listing = refreshAdapterInternals.modernListing(source, 0, 'stable-id', p);
  assert.deepEqual(source, before);
  assert.deepEqual(listing.price, { amount: 0, currency: 'USD', priceOnRequest: true });
  assert.equal(listing.priceType, 'on_request');
  assert.equal(listing.spec.mileageKnown, false);
  assert.equal(listing.spec.transmission, 'unknown');
  assert.equal(listing.spec.fuelType, 'unknown');
  assert.equal(listing.spec.bodyType, 'unknown');
  assert.equal(listing.availabilityKnown, false);
  assert.equal(listing.publishedAt, source.observedAt);
  assert.equal('monthlyEstimate' in listing, false);
  assert.equal('mileageSourceValue' in listing.spec, false);
  assert.throws(() => dealerPackModernListing(source, 0, 'id', { ...p, factPolicy: undefined }), /explicit/);
  for (const country of ['US', 'AE', 'GB']) assert.throws(() => refreshAdapterInternals.modernListing(source, 0, 'id', { ...profile(country), factPolicy: undefined }), /requires|requires reviewed/);
});

for (const country of ['US', 'AE', 'GB']) test(`${country} overlays apply atomically to the selected source and format genuine unknowns`, async () => {
  const { p, files, changed } = generated(country);
  assert(changed.includes(formatPath));
  const format = await evaluate(plain(files.get(formatPath)), runtimeImport(p) + `const leadSite = ${JSON.stringify(p.business)};\n`);
  const absent = { amount: 0, currency: p.business.currency, priceOnRequest: true };
  assert.equal(format.formatMoney(absent, 'en'), 'Price on request');
  assert.equal(format.formatMoney(absent, 'bg'), 'Цена при запитване');
  assert.equal(format.formatMoneyParts(absent, 'en').map(p => p.value).join(''), 'Price on request');
  assert.doesNotMatch(format.formatMoney({ amount: 1000, currency: p.business.currency }, 'en'), /request/);
  // A zero in a normal Money object is not silently reinterpreted as POA.
  assert.notEqual(format.formatMoney({ amount: 0, currency: p.business.currency }, 'en'), 'Price on request');
  assert.equal(format.formatMileage(0, 'en', { mileageKnown: false }), 'Mileage not published');
  assert.equal(format.formatMileage(1609, 'en', { mileageKnown: true, mileageSourceValue: 1000, mileageSourceUnit: 'mi' }), '1,000 mi');
  assert.equal(format.formatMileage(0, 'en', { mileageKnown: true, mileageSourceValue: 0, mileageSourceUnit: 'km' }), '0 km');
  assert.equal(format.formatTransmission('unknown', 'en'), 'Not published');
  for(const kind of ['FuelType','BodyType']) {
    assert.equal(format['format'+kind]('unknown','en'),'Not published');
    assert.equal(format['format'+kind]('unknown','bg'),'Не е посочено');
    assert.equal(format['format'+kind]('other','en'),'Other');
  }
  assert.equal(format.formatPriceType('on_request', 'en'), 'Price on request');
});

test('unknown categories remain distinct from sourced other through the native filters',async()=>{
  const {p,files}=generated('AE');
  const stock=[dealerPackModernListing(item(),0,'unknown',p),dealerPackModernListing(item({bodyType:'other',fuelType:'other'}),1,'other',p),dealerPackModernListing(item({bodyType:'suv',fuelType:'diesel'}),2,'known',p)];
  const source=plain(files.get(dataPath));
  const runtime=await evaluate(source.slice(source.indexOf('type ListingPredicate'),source.indexOf('const legacyListingSlugAliases')),runtimeImport(p)+`const mockListings = ${JSON.stringify(stock)};\n`);
  const ids=filters=>runtime.getMockListings({category:'car',sort:'recommended',...filters}).map(row=>row.id);
  for(const key of ['body','fuel']) {
    assert.deepEqual(ids({[key]:'unknown'}),['unknown']);
    assert.deepEqual(ids({[key]:'other'}),['other']);
  }
  assert.deepEqual(ids({fuel:'diesel',body:'suv'}),['known']);
});

test('normalizer fallback other cannot become a claimed public category',()=>{
  const p=profile('AE');
  for(const [extra,expectedBody,expectedFuel] of [
    [{},'unknown','unknown'],
    [{bodyType:'Other',fuel:'Other'},'other','other'],
    [{bodyType:'unmapped source term',fuel:'unmapped source term'},'unknown','unknown'],
    [{bodyType:'SUV',fuel:'Petrol'},'suv','gasoline'],
    [{bodyType:'Hatchback',fuelType:'plug_in_hybrid'},'hatchback','plug_in_hybrid'],
  ]) {
    const raw=item(extra);delete raw.raw;
    const normalized=refreshNormalizeInternals.normalizeListing(raw,0,p.business);
    const listing=dealerPackModernListing(normalized,0,'source-normalized',p);
    assert.equal(listing.spec.bodyType,expectedBody);
    assert.equal(listing.spec.fuelType,expectedFuel);
  }
});

test('unknowns do not match numeric ranges and sort after known facts in both price directions', async () => {
  const { p, files } = generated('US');
  const stock = [dealerPackModernListing(item(), 0, 'unknown', p), dealerPackModernListing(known({ slug: 'known-one' }), 1, 'known', p), dealerPackModernListing(known({ slug: 'known-two', priceAmount: 14000, mileageValue: 1500 }), 2, 'higher', p)];
  const text = plain(files.get(dataPath));
  const source = text.slice(text.indexOf('type ListingPredicate'), text.indexOf('const legacyListingSlugAliases'));
  const mod = await evaluate(source, runtimeImport(p) + `const mockListings = ${JSON.stringify(stock)};\n`);
  const ids = filters => mod.getMockListings({ category: 'car', sort: 'recommended', ...filters }).map(r => r.id);
  assert.deepEqual(ids({ priceMax: 0 }), []);
  assert.deepEqual(ids({ priceMin: 0 }), ['known', 'higher']);
  assert.deepEqual(ids({ mileageMax: 1000 }), ['known']);
  assert.deepEqual(ids({ transmission: 'automatic' }), ['known', 'higher']);
  assert.deepEqual(ids({ transmission: 'unknown' }), ['unknown']);
  assert.deepEqual(ids({ sort: 'price_asc' }), ['known', 'higher', 'unknown']);
  assert.deepEqual(ids({ sort: 'price_desc' }), ['higher', 'known', 'unknown']);
  assert.deepEqual(ids({ sort: 'mileage_asc' }), ['known', 'higher', 'unknown']);
});

test('finance suppresses zero principal and excludes unknown prices/mileage from numeric filters', async () => {
  const { p, files } = generated('US');
  const mod = await evaluate(plain(files.get(financePath)), runtimeImport(p) + `const leadSite = ${JSON.stringify(p.business)}; const getIsoCountryName = value => value;\n`);
  assert.equal(mod.getLeasePrincipal(0, '20', true), null);
  assert.equal(mod.getLeasePrincipal(12000, '20', true), null);
  assert.deepEqual(mod.getLeasePrincipal(12000, '20'), { initialPayment: 2400, amountToFinance: 9600 });
  const listing = dealerPackModernListing(item(), 0, 'unknown', p);
  const vehicle = { priceAmount: 0, priceOnRequest: true, filterData: listing, year: listing.spec.year, fuelType: listing.spec.fuelType };
  assert.equal(mod.matchesLeaseVehicleFilters(vehicle, {}), true);
  assert.equal(mod.matchesLeaseVehicleFilters(vehicle, { priceMax: 10000 }), false);
  assert.equal(mod.matchesLeaseVehicleFilters(vehicle, { mileageMax: 10000 }), false);
});

test('structured data omits unknown price, odometer, categories, gearbox and stock availability', async () => {
  const { p, files } = generated('AE');
  const stubs = 'const withBasePath = value => value; const localizeListingCopy = value => value; const formatBodyType = value => value; const formatFuelType = value => value; const formatTransmission = value => value; const getLocalizedPath = (_locale, value) => value; const normalizeSeoLocale = value => value; const getCategoryPath = value => value; const leadSite = {};\n';
  const schema = await evaluate(plain(files.get('apps/web/lib/public-structured-data.ts')), stubs);
  const listing = dealerPackModernListing(item(), 0, 'unknown', p);
  const vehicle = schema.createVehicleStructuredData({ baseUrl: 'https://preview.invalid', listing, listingUrl: 'https://preview.invalid/one', locale: 'en' });
  const offer = schema.createOfferStructuredData({ listing, listingUrl: 'https://preview.invalid/one' });
  for (const key of ['mileageFromOdometer', 'vehicleTransmission', 'bodyType', 'fuelType', 'offers']) assert.equal(key in vehicle, false, key);
  for (const key of ['price', 'priceCurrency', 'availability']) assert.equal(key in offer, false, key);
  const reviewed = dealerPackModernListing(known(), 0, 'known', p);
  const reviewedOffer = schema.createOfferStructuredData({ listing: reviewed, listingUrl: 'https://preview.invalid/two' });
  assert.equal(reviewedOffer.price, 12000);
  assert.equal('availability' in reviewedOffer, false);
  const other=dealerPackModernListing(known({bodyType:'other',fuelType:'other'}),0,'other',p);
  const otherVehicle=schema.createVehicleStructuredData({baseUrl:'https://preview.invalid',listing:other,listingUrl:'https://preview.invalid/other',locale:'en'});
  assert.equal(otherVehicle.bodyType,'other');assert.equal(otherVehicle.fuelType,'other');
});

test('saved-car and inventory-search projections preserve unknown-fact flags', async () => {
  const { p, files } = generated();
  const listing = dealerPackModernListing(item(), 0, 'unknown', p);
  const search = await evaluate(plain(files.get('packages/marketplace/inventory-search.ts')));
  const dto = search.toInventorySearchListing(listing);
  assert.equal(dto.price.priceOnRequest, true);
  assert.equal(dto.spec.mileageKnown, false);
  const saved = await evaluate(plain(files.get('packages/marketplace-ui/lib/desktop-saved-car.ts')), 'const publicBasePath=""; const safePreferenceDestination = value => value; const withBasePath = value => value; const withoutBasePath = value => value; const isPublicImageSource = () => true; const formatVehicleCardMoney = money => money.priceOnRequest ? "Price on request" : String(money.amount); const getShowroomVehicleHeading = listing => ({title:listing.title});\n');
  const snapshot = saved.createDesktopSavedCar(listing, '/en/listing/vehicle-one', 'en');
  const restored = saved.parseDesktopSavedCars(JSON.stringify([snapshot]));
  assert.equal(restored.length, 1);
  assert.equal(restored[0].money.priceOnRequest, true);
  assert.equal(restored[0].price, 'Price on request');
});

test('missing or drifted source boundaries leave the map unchanged; default policy does nothing', () => {
  const files = new Map(DEALER_PACK_MODERN_PATHS.map(name => [name, fs.readFileSync(path.join(root, 'templates/modern', name))]));
  const initial = [...files].map(([name, value]) => [name, Buffer.from(value)]);
  assert.deepEqual(personalizeDealerPackModernFacts(files, { ...profile(), factPolicy: undefined }), []);
  assert.deepEqual([...files], initial);
  const schema = 'apps/web/lib/public-structured-data.ts';
  files.set(schema, Buffer.from(plain(files.get(schema)).replace('price: advertisedPrice.amount,', 'price: unsupportedPrice,')));
  const before = [...files].map(([name, value]) => [name, Buffer.from(value)]);
  assert.throws(() => personalizeDealerPackModernFacts(files, profile()), /boundary changed/);
  assert.deepEqual([...files], before);
});
