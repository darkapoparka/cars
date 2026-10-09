import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {isAppLocale, resolveLocale} from '../lib/locale-policy';
import {homeAlternativeHref, isHomeAlternative, primaryHomePath} from '../lib/home-paths';
import {assetPath, browserPath, localePath, withoutLocale} from '../lib/paths';
import {applicationHistoryState} from '../lib/history-state';
import {decodeVehicleList, readVehicleList, updateVehicleList, vehicleStorageKeys} from '../lib/vehicle-storage';
import {emptyFilters, hasActiveFilters, matchesInventory, matchesMonthlyPayment, restoreFilters} from '../lib/inventory-filters';
import {inventorySearch, readInventorySearch, restoreInventoryState} from '../lib/inventory-search';
import {vehicles, getVehicle, formatPrice} from '../lib/data';
import {currency} from '../lib/currency';
import {estimateFinance} from '../lib/finance';

const both = {defaultLocale: 'en', enabledLocales: ['en', 'bg']} as const;
const english = {defaultLocale: 'en', enabledLocales: ['en']} as const;

describe('portable inventory selections', () => {
  const blank = () => ({query: '', filters: emptyFilters(), sort: 'default'});
  it('keeps the stocked Suzuki make selected from Home', () => {
    const state = readInventorySearch(new URLSearchParams('brand=Suzuki'));
    const results = vehicles.filter(vehicle => matchesInventory(vehicle, state.filters, state.query));
    assert.ok(results.length > 0);
    assert.ok(results.every(vehicle => vehicle.make === 'Suzuki'));
    assert.deepEqual(state.filters.brands, ['Suzuki']);
  });
  it('canonicalizes a make and preserves multiple selected makes', () => {
    assert.deepEqual(readInventorySearch(new URLSearchParams('brand=suzuki&brand=Toyota&brand=Suzuki')).filters.brands, ['Suzuki', 'Toyota']);
  });
  it('preserves model, budget, fuel, mileage, gearbox, sorting and search on reload', () => {
    const state = {...blank(), query: 'Suzuki', sort: 'price-asc', emiMax: 900, filters: {...emptyFilters(), models: ['Suzuki::Ciaz'], minimum: 15000, maximum: 60000, fuel: ['Petrol'], mileageMaximum: 120000, extra: {TRANSMISSION: ['Automatic']}}};
    assert.deepEqual(readInventorySearch(new URLSearchParams(inventorySearch('', state))), state);
  });
  it('Clear all removes stale Home make and search parameters without dropping unrelated URL options', () => {
    const search = inventorySearch('?brand=Suzuki&q=Ciaz&maxPrice=50000&emiMax=900&order=price-asc&campaign=demo', blank());
    assert.equal(search, '?campaign=demo');
    assert.deepEqual(readInventorySearch(new URLSearchParams(search)), {...blank(), emiMax: undefined});
  });
  it('removing one make retains the other make', () => {
    const state = {...blank(), filters: {...emptyFilters(), brands: ['Toyota']}};
    assert.equal(inventorySearch('?brand=Suzuki&brand=Toyota', state), '?brand=Toyota');
  });
  it('rejects malformed and oversized optional refinements', () => {
    for (const selection of ['{bad', 'x'.repeat(6001)]) {
      const params = new URLSearchParams({selection, brand: 'Suzuki', order: 'unknown'});
      assert.deepEqual(readInventorySearch(params).filters, {...emptyFilters(), brands: ['Suzuki']});
    }
  });
  it('ignores blank and non-finite monthly shortcuts', () => {
    for (const value of ['', ' ', 'NaN', 'Infinity']) assert.equal(readInventorySearch(new URLSearchParams({emiMax: value})).emiMax, undefined);
    assert.equal(readInventorySearch(new URLSearchParams('emiMax=-1')).emiMax, 0);
  });
  it('restores history only for its exact collection entry', () => {
    const state = {...blank(), filters: {...emptyFilters(), brands: ['Suzuki']}};
    const stored = {version: 1, entry: '/bg/2/cars?brand=Suzuki', ...state};
    assert.deepEqual(restoreInventoryState(stored, stored.entry), {...state, emiMax: undefined});
    assert.equal(restoreInventoryState(stored, '/bg/cars'), null);
    assert.equal(restoreInventoryState(null, stored.entry), null);
  });
  it('sanitizes malformed history values', () => {
    const restored = restoreInventoryState({version: 1, entry: '/en/cars', query: {}, filters: null, sort: 'invalid', emiMax: Infinity}, '/en/cars');
    assert.deepEqual(restored, {...blank(), emiMax: undefined});
  });
  it('excludes unavailable monthly estimates from finance shortcut results', () => {
    const vehicle = vehicles[0];
    assert.equal(matchesMonthlyPayment({...vehicle, monthly: 0}, 1000), false);
    assert.equal(matchesMonthlyPayment({...vehicle, monthly: NaN}, 1000), false);
    assert.equal(matchesMonthlyPayment({...vehicle, monthly: 500, priceOnRequest: true}, 1000), false);
    assert.equal(matchesMonthlyPayment({...vehicle, monthly: 500, priceOnRequest: false}, 1000), true);
    assert.equal(matchesMonthlyPayment({...vehicle, monthly: 0}, undefined), true);
  });
});
describe('locale routing', () => {
  it('recognizes only supported locale strings', () => {for (const value of [undefined, null, {}, 'fr', 'EN', '']) assert.equal(isAppLocale(value), false);});
  it('the explicit URL wins over a conflicting cookie', () => assert.deepEqual(resolveLocale('/bg/2/cars', 'en', both), {locale: 'bg', redirectPath: null}));
  it('uses an enabled preference for unprefixed URLs', () => assert.deepEqual(resolveLocale('/2/cars', 'bg', both), {locale: 'bg', redirectPath: '/bg/2/cars'}));
  it('ignores disabled language cookies', () => assert.deepEqual(resolveLocale('/2/cars', 'bg', english), {locale: 'en', redirectPath: '/en/2/cars'}));
  it('replaces, rather than duplicates, a disabled language prefix', () => assert.deepEqual(resolveLocale('/bg/2/cars', 'bg', english), {locale: 'en', redirectPath: '/en/2/cars'}));
  it('canonicalizes a disabled language root once', () => assert.equal(resolveLocale('/bg', 'bg', english).redirectPath, '/en'));
  it('redirects the root without an extra slash', () => assert.equal(resolveLocale('/', null, both).redirectPath, '/en'));
  it('does not mistake a partial language prefix for a locale', () => assert.equal(resolveLocale('/english', '', both).redirectPath, '/en/english'));
  it('rejects a default language absent from enabled locales', () => assert.throws(() => resolveLocale('/', null, {defaultLocale: 'bg', enabledLocales: ['en']})));
});

describe('primary and alternative URL contracts', () => {
  it('only recognizes the /2 segment, not /20', () => {assert.equal(isHomeAlternative('/2/cars'), true); assert.equal(isHomeAlternative('/20'), false);});
  it('recovers the primary root and nested routes', () => {assert.equal(primaryHomePath('/2'), '/'); assert.equal(primaryHomePath('/2/cars'), '/cars');});
  it('preserves query strings, hashes and explicit locales', () => assert.equal(homeAlternativeHref('/bg/cars?brand=Toyota#stock', true), '/bg/2/cars?brand=Toyota#stock'));
  it('aliases each supported journey', () => {for (const route of ['/cars', '/saved', '/more', '/search', '/sell', '/sell/details', '/finance', '/service', '/service/details', '/services', '/stores']) assert.equal(homeAlternativeHref(route, true), '/2'+route);});
  it('does not duplicate alternative prefixes', () => assert.equal(homeAlternativeHref('/en/2/cars', true), '/en/2/cars'));
  it('keeps vehicle details shared', () => assert.equal(homeAlternativeHref('/cars/car-one', true), '/cars/car-one'));
  it('leaves external, fragment, email and telephone links alone', () => {for (const href of ['https://example.com/', '//example.com/', '#stock', 'mailto:a@example.com', 'tel:+359123']) {assert.equal(homeAlternativeHref(href, true), href); assert.equal(localePath(href, 'bg'), href);}});
  it('does not change primary navigation when disabled', () => assert.equal(homeAlternativeHref('/cars?q=BMW', false), '/cars?q=BMW'));
  it('localizes root and routes idempotently', () => {assert.equal(localePath('/', 'bg'), '/bg'); assert.equal(localePath('/cars?q=a', 'bg'), '/bg/cars?q=a'); assert.equal(localePath('/en/cars', 'bg'), '/en/cars');});
  it('strips only a complete locale segment', () => {assert.equal(withoutLocale('/bg/2/cars'), '/2/cars'); assert.equal(withoutLocale('/english'), '/english');});
  it('preserves non-string image sources and external assets', () => {const source={src:'/image.webp'}; assert.equal(assetPath(source), source); assert.equal(assetPath('https://example.com/image.webp'), 'https://example.com/image.webp');});
  it('builds browser URLs through the same locale contract', () => assert.equal(browserPath('/2/cars', 'bg'), assetPath('/bg/2/cars')));
});

describe('history ownership', () => {
  it('keeps application state and lets Next.js manage its own router state', () => {
    const inventory={version:1, query:'BMW'};
    assert.deepEqual(applicationHistoryState({cars24Inventory:inventory,cars24Modal:'modal-1',__NA:true,__PRIVATE_NEXTJS_INTERNALS_TREE:{}}), {cars24Inventory:inventory,cars24Modal:'modal-1'});
  });
  it('accepts malformed or missing browser state without throwing', () => {for(const value of [null, undefined, 1, 'invalid']) assert.deepEqual(applicationHistoryState(value), {});});
});

describe('dealer-scoped saved and recent cars', () => {
  it('retains the legacy keys only for the unmounted template', () => assert.deepEqual(vehicleStorageKeys('drive24-template','template',''),{saved:'drive24:saved',recent:'cars24:recent'}));
  it('isolates dealers, template mode and mounted previews on a shared origin', () => {
    const keys = [vehicleStorageKeys('a','dealer',''),vehicleStorageKeys('b','dealer',''),vehicleStorageKeys('a','dealer','/one'),vehicleStorageKeys('a','dealer','/two'),vehicleStorageKeys('a','template','/one')];
    assert.equal(new Set(keys.map(key=>key.saved)).size,keys.length);
  });
  it('encodes scope separators to avoid key collisions', () => assert.notEqual(vehicleStorageKeys('a:b','dealer','/c').saved, vehicleStorageKeys('a','dealer','b:/c').saved));
  it('rejects malformed data instead of exposing arbitrary values', () => {for(const raw of ['{', '{}', 'null', '1', '"car"', 'x'.repeat(262145)]) assert.deepEqual(decodeVehicleList(raw), []);});
  it('deduplicates and validates slugs while retaining order', () => assert.deepEqual(decodeVehicleList('["a",42,"a","",null," b ","b"]'), ['a','b']));
  it('bounds recent history', () => assert.equal(decodeVehicleList(JSON.stringify(Array.from({length:30},(_,i)=>String(i))),12).length,12));
  it('keeps denied storage reads safe and does not claim failed writes succeeded', () => {
    const denied=()=>{throw new Error('SecurityError');};
    assert.equal(readVehicleList(denied,'key','["seed"]'),'["seed"]'); assert.equal(updateVehicleList(denied,'key',()=>['a']),false);
  });
  it('supports updating, removing and ordering persisted lists', () => {
    const values = new Map<string,string>(); const storage=()=>({getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);}});
    assert.equal(updateVehicleList(storage,'key',previous=>['a',...previous]),true);
    assert.equal(updateVehicleList(storage,'key',previous=>['b',...previous]),true);
    assert.deepEqual(decodeVehicleList(readVehicleList(storage,'key')),['b','a']);
    assert.equal(updateVehicleList(storage,'key',previous=>previous.filter(slug=>slug!=='a')),true);
    assert.deepEqual(decodeVehicleList(readVehicleList(storage,'key')),['b']);
  });
  it('leaves existing storage unchanged when a write fails', () => {
    const storage=()=>({getItem:()=> '["existing"]',setItem:()=>{throw new Error('QuotaExceededError');}});
    assert.equal(updateVehicleList(storage,'key',()=>['new']),false); assert.equal(readVehicleList(storage,'key'),'["existing"]');
  });
});

describe('inventory domain invariants', () => {
  const car = {...vehicles[0], price:30000, mileage:20000, monthly:500, priceOnRequest:false, mileageOnRequest:false};
  it('keeps all existing inventory visible without active filters', () => {for(const vehicle of vehicles) assert.equal(matchesInventory(vehicle, emptyFilters(), ''),true);});
  it('keeps slug lookup equivalent to the original first-match lookup', () => {for(const vehicle of vehicles) assert.equal(getVehicle(vehicle.slug),vehicles.find(item=>item.slug===vehicle.slug)); assert.equal(getVehicle('not-a-vehicle'),undefined);});
  it('preserves exact currency formatting', () => {for(const amount of [0,1,30000,1234567.89]) assert.equal(formatPrice(amount),new Intl.NumberFormat(currency.locale).format(amount));});
  it('does not share mutable default filters', () => {const a=emptyFilters(),b=emptyFilters();a.brands.push('Toyota');assert.deepEqual(b.brands,[]);});
  it('detects and clears active filters', () => {assert.equal(hasActiveFilters(emptyFilters()),false);assert.equal(hasActiveFilters({...emptyFilters(),brands:['Toyota']}),true);});
  it('restores untrusted state within valid bounds', () => {
    const restored=restoreFilters({minimum:99999999, maximum:-1, brands:['BMW',1], extra:{TRANSMISSION:['Automatic'],__invalid:['x']}, emiLimit:Infinity});
    assert.equal(restored.minimum,950000);assert.equal(restored.maximum,950000);assert.deepEqual(restored.brands,['BMW']);assert.deepEqual(restored.extra,{TRANSMISSION:['Automatic']});assert.equal(restored.emiLimit,null);
  });
  it('does not treat an unpublished price as a bargain', () => {const filters={...emptyFilters(),budget:[`Less than ${currency.code} 40K`]};assert.equal(matchesInventory(car,filters,''),true);assert.equal(matchesInventory({...car,price:0,priceOnRequest:true},filters,''),false);});
  it('does not treat unpublished mileage as low mileage', () => {const filters={...emptyFilters(),mileage:'Under 30,000 kms'};assert.equal(matchesInventory(car,filters,''),true);assert.equal(matchesInventory({...car,mileage:0,mileageOnRequest:true},filters,''),false);});
  it('does not advertise an absent monthly estimate as a free loan', () => {
    for(const filters of [{...emptyFilters(),emiLimit:750},{...emptyFilters(),extra:{EMI:[`Less than ${currency.code} 750`]}}]) {assert.equal(matchesInventory(car,filters,''),true);assert.equal(matchesInventory({...car,monthly:0},filters,''),false);}
  });
  it('keeps unknown price and mileage visible in an unfiltered catalogue', () => assert.equal(matchesInventory({...car,price:0,mileage:0,monthly:0,priceOnRequest:true,mileageOnRequest:true},emptyFilters(),''),true));
  it('handles search and gearbox filtering independently', () => {assert.equal(matchesInventory({...car,make:'Toyota',transmission:'Automatic'},{...emptyFilters(),extra:{TRANSMISSION:['Automatic']}},'toyota'),true);assert.equal(matchesInventory(car,emptyFilters(),'not-a-make'),false);});
});

describe('illustrative finance input boundaries', () => {
  it('handles zero interest without dividing by zero', () => assert.equal(estimateFinance(12000,0,0,1).monthly,1000));
  it('caps the deposit at the vehicle price', () => {const quote=estimateFinance(10000,15000,5,2);assert.equal(quote.principal,0);assert.equal(quote.total,10000);});
  it('rejects non-finite, negative and non-positive term inputs', () => {for(const inputs of [[NaN,0,1,1],[100,-1,1,1],[100,0,-1,1],[100,0,1,0]]) assert.throws(()=>estimateFinance(...inputs as [number,number,number,number]));});
});
