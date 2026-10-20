import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';
import { applyRefreshAdapter, refreshAdapterInternals as adapters } from './lib/client-refresh-adapters.mjs';
import { refreshNormalizeInternals } from './lib/client-refresh-normalize.mjs';
import { readTypeScriptCatalog } from './lib/catalog-literal.mjs';
import { auditNativeCatalogs } from './lib/native-localization.mjs';

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

for(const name of ['Fairfield Car Centre (Bury / M-Kars seller path)','Cars and Van / Cars and Vans','Literal .+ [Motors] (UK) / North?',"Let's Sell Your Car","Million's Auto Cars Ltd",`O'Brien "Motors" .+ [UK] / North? \\ $\{globalThis.injected=true\} $& $'`])test('Import message regexes preserve the literal sourced name '+name,t=>{
  const fixtureRoot=path.join(root,'runtime','import-facts-tests');fs.mkdirSync(fixtureRoot,{recursive:true});const candidate=fs.mkdtempSync(path.join(fixtureRoot,'messages-'));
  t.after(()=>{const target=fs.realpathSync(candidate);assert(target.startsWith(fs.realpathSync(fixtureRoot)+path.sep));fs.rmSync(target,{recursive:true,force:true});});
  const file=path.join(candidate,'src/lib/i18n/messages.ts');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,fs.readFileSync(path.join(root,'templates/import/src/lib/i18n/messages.ts')));
  const profile={business:{name,shortName:name,phoneE164:'',phoneDisplay:'',address:''}},before=JSON.stringify(profile);adapters.patchImportText(candidate,profile);
  const source=fs.readFileSync(file,'utf8');assert.doesNotThrow(()=>stripTypeScriptTypes(source),'The full generated catalog must parse as TypeScript');assert.equal(JSON.stringify(profile),before);
  const start=source.indexOf('const auxeroBgReplacements:'),end=source.indexOf('\n];',start)+3;assert(start>=0&&end>start,'Reviewed message pattern array remains explicit');
  const context={},rows=runInNewContext(stripTypeScriptTypes(source.slice(start,end))+';auxeroBgReplacements;',context),[pattern,copy]=rows.find(([row])=>row.source.startsWith('Showing ')&&row.source.includes('matching'));
  const actual='Showing 1 - 3 of 5 matching '+name+' Listings';assert.equal(actual.replace(pattern,copy),'Показани 1 – 3 от 5 съвпадащи обяви');
  pattern.lastIndex=0;assert.equal(pattern.test(actual.replace(name,'Another dealership')),false);if(name.includes('/')){pattern.lastIndex=0;assert.equal(pattern.test(actual.replace('/','X')),false,'A slash in the name is literal');}
  if(name.includes('(')){pattern.lastIndex=0;assert.equal(pattern.test(actual.replace(/[()]/g,'')),false,'Parentheses in the name are literal');}
  if(name.includes('.+')){pattern.lastIndex=0;assert.equal(pattern.test(actual.replace('.+','wildcard text')),false,'Regex metacharacters in the name are literal');}
  const [stockPattern,stockCopy]=rows.find(([row])=>row.source.endsWith(' current stock'));assert.equal((name+' current stock').replace(stockPattern,stockCopy),'Налични автомобили в '+name,'Rendered UI replacement retains the exact sourced name, without display escapes');assert.equal(context.injected,undefined,'A sourced interpolation sequence must not execute');
});

// Exact catalog blobs from the selected immutable Import release at
// 5d052ea655714f3d0ca3656daa7dbff411e2f747, tree87950ec43fdb33fd85dbf6d6b6160e1a779777c6.
// Hash binding prevents a newer working template from silently changing this
// regression fixture; no historical source download or whole-family copy.
const qualifiedImportCatalogs = [
  {path:'src/lib/locale/messages.ts',oid:'19e6cb59a6941a4297575ffae80cf3cbd5ea8d86',format:'typescript-pair',en:'en',bg:'bg'},
  {path:'src/lib/i18n/native.ts',oid:'3fd546d415be0ae158934391dff7c386bbe7b0ec',format:'typescript-pair',en:'nativeEn',bg:'nativeBg'},
  {path:'src/lib/content/localized.ts',oid:'05514d2985db5c4806ce64f8cdb156981f4139e4',format:'typescript-pair',en:'contentEn',bg:'contentBg'},
  {path:'src/lib/content/inventory-localized.ts',oid:'c67557afcfa72d6db5966ea3bbb9578b1abc4ce0',format:'typescript-rows',export:'inventoryCopy'},
  {path:'src/lib/content/extra-localized.ts',oid:'80be366f3b3ec6760da6398899ad18d1eef192ea',format:'typescript-source-map',export:'extraEnglish'}
];
for (const name of ["Let's Sell Your Car", "Million's Auto Cars Ltd", `O'Brien "Motors" / North \\ $\{globalThis.injected=true\} $& $'`]) {
  test('Import qualified release catalogs retain the literal identity '+name, t => {
    const fixtureRoot = path.join(root, 'runtime/import-facts-tests'); fs.mkdirSync(fixtureRoot, {recursive:true});
    const candidate = fs.mkdtempSync(path.join(fixtureRoot, 'qualified-catalogs-'));
    t.after(() => {const target = fs.realpathSync(candidate); assert(target.startsWith(fs.realpathSync(fixtureRoot)+path.sep)); fs.rmSync(target, {recursive:true,force:true});});
    const original = new Map();
    for (const {path:relative,oid} of qualifiedImportCatalogs) {
      const bytes = Buffer.from(fs.readFileSync(path.join(root, 'templates/import', relative), 'utf8').replace(/\r\n/g, '\n'));
      assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'), oid, 'Exact qualified release input: '+relative);
      original.set(relative, bytes.toString('utf8'));
      const file = path.join(candidate, relative); fs.mkdirSync(path.dirname(file), {recursive:true}); fs.writeFileSync(file, bytes);
    }
    const nativePath = 'src/lib/i18n/native.ts';
    assert.throws(() => readTypeScriptCatalog(original.get(nativePath).split('Day Night Auto').join(name), 'nativeEn'), /Invalid catalog literal/, 'Raw source replacement reproduces the released single-quote failure');
    const profile = {business:{name,shortName:name,phoneE164:'',phoneDisplay:'',address:''}}, before = JSON.stringify(profile);
    adapters.patchImportText(candidate, profile);
    const files = new Map(qualifiedImportCatalogs.map(({path:relative}) => ['import/'+relative, fs.readFileSync(path.join(candidate, relative))]));
    const text = relative => files.get('import/'+relative).toString('utf8');
    for (const [relative,source] of files) assert.doesNotThrow(() => stripTypeScriptTypes(source.toString('utf8')), 'Full generated TypeScript: '+relative);
    const descriptors = qualifiedImportCatalogs.map(({oid,...descriptor}) => descriptor);
    const audit = auditNativeCatalogs(files, 'import', descriptors);
    assert.equal(audit.declaredCatalogParityPassed, true); assert.equal(audit.catalogs.length, 5);
    const native = readTypeScriptCatalog(text(nativePath), 'nativeEn');
    assert.equal(native.ui1, name+' home'); assert.equal(native.ui2, 'Call '+name);
    const content = readTypeScriptCatalog(text('src/lib/content/localized.ts'), 'contentEn');
    assert.equal(content.content18, 'Send a link, VIN, budget, timeframe or sale request and '+name+' will prepare the next step.');
    const extra = readTypeScriptCatalog(text('src/lib/content/extra-localized.ts'), 'extraEnglish');
    assert.equal(extra['За '+name], 'About '+name, 'Static catalog keys and values both retain the exact displayed identity');
    assert.equal(JSON.stringify(profile), before);
    const unreviewed = text(nativePath).replace('ui1: '+JSON.stringify(name+' home'), () => 'ui1: getUnreviewedName() || '+JSON.stringify(name+' home'));
    assert.notEqual(unreviewed, text(nativePath), 'The negative fixture changes the exact nativeEn identity slot');
    assert.throws(() => readTypeScriptCatalog(unreviewed, 'nativeEn'), /Invalid catalog literal/, 'Executable catalog expressions remain refused');
  });
}
