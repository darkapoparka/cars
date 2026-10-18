import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { stripTypeScriptTypes } from 'node:module';
import { applyRefreshAdapter, refreshAdapterInternals as adapters } from './lib/client-refresh-adapters.mjs';
import { refreshNormalizeInternals } from './lib/client-refresh-normalize.mjs';

const root = path.resolve(import.meta.dirname, '..');
const markets = [
  { countryCode: 'BG', currency: 'EUR', distanceUnit: 'km', value: 60000 },
  { countryCode: 'GB', currency: 'GBP', distanceUnit: 'mi', value: 60000 },
  { countryCode: 'US', currency: 'USD', distanceUnit: 'mi', value: 60000 },
  { countryCode: 'AE', currency: 'AED', distanceUnit: 'km', value: 60000 }
];
function profileFor(market = markets[0], changes = {}) {
  const business = {
    slug: 'factual-fixture', name: 'Factual fixture', city: 'Recorded city',
    inventoryUrl: 'https://dealer.example/stock', contactUrl: 'https://dealer.example/contact',
    observedAt: '2026-10-18', inventoryNotice: 'Dated listing; confirm availability',
    ...market
  };
  const source = {
    id: 'source-123', title: '2018 Audi Test', make: 'Audi', model: 'Test', year: 2018,
    currency: business.currency, priceAmount: 12345, mileageValue: market.value,
    mileageUnit: market.distanceUnit, transmission: 'Automatic', images: ['/recorded-stock.webp'],
    sourceUrl: 'https://dealer.example/stock/source-123', observedAt: '2026-10-18', ...changes
  };
  return { business, listings: [refreshNormalizeInternals.normalizeListing(source, 0, business)] };
}
async function runtimeVehicles(feed) {
  const source = fs.readFileSync(path.join(root, 'templates/import/src/lib/data/daynight.ts'), 'utf8');
  const begin = source.indexOf('const parseNumber =');
  const finish = source.indexOf('export const daynightVehicles = feed.listings.map(toVehicle);');
  assert.ok(begin > 0 && finish > begin, 'Actual Import feed consumer boundary remains known');
  const body = source.slice(begin, finish + 'export const daynightVehicles = feed.listings.map(toVehicle);'.length);
  const js = stripTypeScriptTypes('const makeNames = ["Audi"]; const feed = ' + JSON.stringify(feed) + ';\n' + body);
  return (await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'))).daynightVehicles;
}

test('Import holds missing source year before writing any candidate file', t => {
  const fixtureRoot = path.join(root, 'runtime', 'import-facts-tests');
  fs.mkdirSync(fixtureRoot, { recursive: true });
  const candidate = fs.mkdtempSync(path.join(fixtureRoot, 'candidate-'));
  t.after(() => {
    const target = fs.realpathSync(candidate);
    assert.ok(target.startsWith(fs.realpathSync(fixtureRoot) + path.sep));
    fs.rmSync(target, { recursive: true, force: true });
  });
  const feed = path.join(candidate, 'src/lib/data/daynight-listings.json');
  fs.mkdirSync(path.dirname(feed), { recursive: true });
  fs.writeFileSync(feed, 'existing candidate inventory\n');
  fs.writeFileSync(path.join(candidate, 'sentinel.txt'), 'unrelated candidate content\n');
  for (const market of markets) for (const [changes, field] of [
    [{ year: undefined }, 'year'], [{ mileageValue: undefined }, 'mileage'],
    [{ currency: market.currency === 'USD' ? 'EUR' : 'USD' }, 'currency']
  ]) {
    assert.throws(() => applyRefreshAdapter({
      key: 'import', candidate, oldVariant: candidate, profile: profileFor(market, changes)
    }), error => error.code === 'IMPORT_FACTS_REQUIRE_REVIEW' && error.fields.includes(field));
    assert.equal(fs.readFileSync(feed, 'utf8'), 'existing candidate inventory\n');
    assert.equal(fs.readFileSync(path.join(candidate, 'sentinel.txt'), 'utf8'), 'unrelated candidate content\n');
    assert.deepEqual(fs.readdirSync(candidate).sort(), ['sentinel.txt', 'src']);
  }
});

for (const market of markets) {
  test('Import preserves complete source-backed facts for ' + market.countryCode, async () => {
    const profile = profileFor(market);
    const before = JSON.stringify(profile);
    assert.doesNotThrow(() => adapters.assertImportListingFacts(profile));
    const feed = adapters.importListingFeed(profile);
    const listing = feed.listings[0];
    assert.equal(listing.id, 'source-123');
    assert.equal(listing.href, profile.listings[0].sourceUrl);
    assert.equal(listing.production, '2018 г.');
    assert.equal(listing.price, '12 345 ' + (market.currency === 'EUR' ? '€' : market.currency));
    assert.equal(listing.mileageValue, market.value);
    assert.equal(listing.mileageUnit, market.distanceUnit);
    assert.equal(listing.mileageKnown, true);
    assert.equal(JSON.stringify(profile), before, 'Source/raw provenance is unchanged');
    if (market.countryCode === 'GB') {
      assert.equal(listing.mileage, '60 000 mi'); // The existing GB adapter preserves native miles.
    } else {
      const expectedKm = market.distanceUnit === 'mi' ? Math.round(market.value * 1.609344) : market.value;
      assert.equal(listing.mileage, expectedKm === 60000 ? '60 000 км' : '96 561 км');
      const [vehicle] = await runtimeVehicles(feed);
      assert.equal(vehicle.mileageKm, expectedKm, 'Actual km-only Import parser consumes converted mileage');
      assert.equal(vehicle.priceEur, 12345, 'No amount conversion is fabricated');
      assert.equal(vehicle.year, 2018);
    }
  });
  test('Import holds missing mileage, source year and incompatible currency for ' + market.countryCode, () => {
    for (const [changes, field] of [
      [{ mileageValue: undefined }, 'mileage'],
      [{ mileageValue: 'Not published' }, 'mileage'],
      [{ mileageOnRequest: true, mileageValue: 0 }, 'mileage'],
      [{ year: undefined }, 'year'],
      [{ year: 'unknown' }, 'year'],
      [{ year: undefined, date: '2026-10-18' }, 'year'],
      [{ year: 2018, production: 'Not published' }, 'year'],
      [{ year: 2018, production: '2019 г.' }, 'year'],
      [{ currency: market.currency === 'USD' ? 'EUR' : 'USD' }, 'currency']
    ]) assert.throws(() => adapters.assertImportListingFacts(profileFor(market, changes)),
      error => error.code === 'IMPORT_FACTS_REQUIRE_REVIEW' && error.fields.includes(field), JSON.stringify(changes));
  });
}

test('Import distinguishes recorded zero mileage from unknown mileage and preserves POA', async () => {
  const profile = profileFor(markets[0], { mileageValue: 0, priceAmount: null, price: 'POA' });
  assert.doesNotThrow(() => adapters.assertImportListingFacts(profile));
  const feed = adapters.importListingFeed(profile);
  assert.equal(feed.listings[0].mileage, '0 км');
  assert.equal(feed.listings[0].price, 'Цена при запитване');
  const [vehicle] = await runtimeVehicles(feed);
  assert.equal(vehicle.mileageKm, 0);
  assert.equal(vehicle.priceEur, 0); // Existing listedPrice maps this sentinel to On request.
});

test('Import accepts a source production year and rejects normalized-only invented year', () => {
  const production = profileFor(markets[0], { year: undefined, production: '2018 г.' });
  assert.doesNotThrow(() => adapters.assertImportListingFacts(production));
  const forged = profileFor();
  forged.listings[0].raw = { mileageValue: 60000 };
  assert.throws(() => adapters.assertImportListingFacts(forged), error => error.fields.includes('year'));
});
