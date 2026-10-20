// Optional factual inputs are admitted only in unpublished dealer-pack source.
// Every transform operates on a temporary native source Map; masters and legacy
// dealer adapters retain their existing numeric-price requirements.
export const optionalDealerPackFacts = profile => profile?.factPolicy === 'dealer-pack-optional-v1';
const assert = (value, message) => { if (!value) throw Error(message); };
const get = (files, name) => { assert(files.has(name), 'Missing optional-fact source boundary: ' + name); return files.get(name).toString('utf8'); };
const one = (source, from, to, name) => {
  assert(typeof from === 'string' ? source.split(from).length === 2 : [...source.matchAll(new RegExp(from.source, 'g'))].length === 1,
    'Optional-fact source boundary changed: ' + name);
  return source.replace(from, to);
};

export function mobilePackMileageSource(profile) {
  assert(optionalDealerPackFacts(profile) && ['mi', 'km'].includes(profile.business.distanceUnit), 'Explicit pack mileage policy required');
  const unit = JSON.stringify(profile.business.distanceUnit);
  return `type MileageStock = { mileage: number; mileageKnown?: boolean; mileageOnRequest?: boolean; mileageSourceValue?: number; mileageSourceUnit?: 'mi' | 'km' };
export function hasMobileMileage(stock: MileageStock): boolean {
  return stock.mileageKnown !== false && stock.mileageOnRequest !== true && Number.isFinite(stock.mileage) && stock.mileage >= 0;
}
export function mobileMileageValue(stock: MileageStock): number {
  if (!hasMobileMileage(stock)) return NaN;
  if (Number.isFinite(stock.mileageSourceValue) && ['mi', 'km'].includes(stock.mileageSourceUnit ?? '')) {
    return stock.mileageSourceUnit === ${unit} ? stock.mileageSourceValue! : Number((stock.mileageSourceValue! ${profile.business.distanceUnit === 'mi' ? '/ 1.609344' : '* 1.609344'}).toFixed(8));
  }
  return stock.mileage / ${profile.business.distanceUnit === 'mi' ? '1.609344' : '1'};
}
export function formatMobileMileage(stock: MileageStock, locale = 'en'): string {
  if (!hasMobileMileage(stock)) return locale.startsWith('bg') ? 'Пробег при запитване' : 'Mileage on request';
  const original = Number.isFinite(stock.mileageSourceValue) && ['mi', 'km'].includes(stock.mileageSourceUnit ?? '');
  const value = original ? stock.mileageSourceValue! : mobileMileageValue(stock), unit = original ? stock.mileageSourceUnit : ${unit};
  return new Intl.NumberFormat(locale.startsWith('bg') ? 'bg-BG' : 'en-GB', {maximumFractionDigits: 3}).format(value) + ' ' + unit;
}
export function compareMobileMileage(a: MileageStock, b: MileageStock, direction = 1): number {
  const aKnown = hasMobileMileage(a), bKnown = hasMobileMileage(b);
  return aKnown && bKnown ? direction * (a.mileage - b.mileage) : Number(bKnown) - Number(aKnown);
}
`;
}

export function adaptMobilePackFacts(files, profile) {
  if (!optionalDealerPackFacts(profile)) return [];
  const currency = profile.business.currency, distance = profile.business.distanceUnit;
  assert(/^[A-Z]{3}$/.test(currency), 'Explicit pack currency required');
  const prefix = 'mobile/src/', changed = [];
  const patch = (name, transform) => { const file = prefix + name; files.set(file, Buffer.from(transform(get(files, file)))); changed.push(file); };
  const use = (source, names, relative) => source.replace(/^(['"]use client['"];\r?\n)?/, (_match, directive = '') => directive + `import {${names}} from '${relative}';\n`);
  patch('lib/catalog.ts', source => one(source, 'export const vehicles: Vehicle[] = dealerInventory as Vehicle[];',
    "export const vehicles: Vehicle[] = dealerInventory.map(vehicle => ({...vehicle, price: typeof vehicle.price === 'number' ? vehicle.price : Number.NaN, mileage: typeof vehicle.mileage === 'number' ? vehicle.mileage : Number.NaN})) as Vehicle[];", 'Mobile nullable source inventory'));
  patch('lib/types.ts', source => one(source, '  price: number;', '  price: number;\n  priceKnown?: boolean;\n  priceOnRequest?: boolean;', 'Mobile price provenance'));
  patch('lib/locale.ts', source => {
    source = one(source, "export const defaultLocale: Locale = 'bg';", "export const defaultLocale: Locale = 'en';", 'Mobile pack locale');
    return one(source, 'export function localeMoney(value: number, locale: Locale): string {',
      "export function localeMoney(value: number, locale: Locale): string {\n  if (!Number.isFinite(value)) return locale === 'bg' ? 'Цена при запитване' : 'Price on request';", 'Mobile unknown price display');
  });
  const helper = prefix + 'lib/dealer-pack-price.ts';
  files.set(helper, Buffer.from(`type PricedStock = {price: number; priceKnown?: boolean; priceOnRequest?: boolean};
export const hasPackPrice = (vehicle: PricedStock): boolean => vehicle.priceKnown !== false && vehicle.priceOnRequest !== true && Number.isFinite(vehicle.price) && vehicle.price > 0;
export function comparePackPrice(a: PricedStock, b: PricedStock, direction = 1): number {
  const aKnown = hasPackPrice(a), bKnown = hasPackPrice(b);
  return aKnown && bKnown ? direction * (a.price - b.price) : Number(bKnown) - Number(aKnown);
}
`)); changed.push(helper);
  patch('lib/search.ts', source => {
    source = one(source, "'price-asc': (a, b) => a.price - b.price", "'price-asc': (a, b) => comparePackPrice(a, b)", 'Mobile unknown price sort');
    source = one(source, "'price-desc': (a, b) => b.price - a.price", "'price-desc': (a, b) => comparePackPrice(a, b, -1)", 'Mobile unknown descending price sort');
    source = one(source, 'export const money = (amount: number) =>', "export const money = (amount: number) => !Number.isFinite(amount) ? 'Price on request' :", 'Mobile legacy consumers unknown price');
    return use(source, 'comparePackPrice', './dealer-pack-price');
  });
  patch('lib/assistant.ts', source => {
    source = one(source, 'matches.sort((a, b) => a.price - b.price);',
      'matches = matches.filter(hasPackPrice).sort((a, b) => comparePackPrice(a, b));', 'Mobile local cheapest requires known price');
    source = one(source, '${number(v.mileage)} km', '${formatMobileMileage(v)}', 'Mobile local answer mileage');
    source = one(source, '${v.power} hp.', "${v.power > 0 ? v.power + ' hp' : 'Power not published'}.", 'Mobile local answer power');
    return use(use(source, 'hasPackPrice, comparePackPrice', './dealer-pack-price'), 'formatMobileMileage', './mobile-mileage');
  });
  patch('components/NativeCarPark.tsx', source => {
    source = one(source, 'a.price - b.price', 'comparePackPrice(a, b)', 'Mobile saved price sort');
    source = one(source, 'b.price - a.price', 'comparePackPrice(a, b, -1)', 'Mobile saved descending price sort');
    // The currency adapter runs first and retains the EUR source unchanged.
    const priceBoundary = currency === 'EUR' ? "{v.price.toLocaleString('de-DE')} €" : '{number(v.price)} ' + (currency === 'GBP' ? '£' : currency);
    source = one(source, priceBoundary, '{money(v.price)}', 'Mobile saved price display');
    return use(source, 'comparePackPrice', '../lib/dealer-pack-price');
  });
  patch('components/FinanceCalculator.tsx', source => one(source,
    '  const payment = paymentEstimate(v.price, deposit, months, rate);',
    "  const payment = paymentEstimate(v.price, deposit, months, rate);\n  if (!Number.isFinite(v.price) || v.price <= 0) return <p>{t('Price on request')}</p>;", 'Mobile finance requires published price'));
  for (const [name, amount] of [['components/DesktopVehicleSummary.tsx', 'monthly'], ['components/VehicleSections.tsx', 'monthly'], ['components/DetailScreen.tsx', 'financeMonthly']]) patch(name, source => {
    let found = 0;
    source = source.replace(/<button\b[\s\S]*?<\/button>/g, node => {
      if (!node.includes('money(' + amount + ')')) return node;
      found++; return '{Number.isFinite(v.price) && v.price > 0 && (' + node + ')}';
    });
    assert(found === 1, 'Mobile finance price boundary changed: ' + name); return source;
  });
  // Form/filter labels retain the actual inventory currency and range unit.
  const symbol = new Intl.NumberFormat('en', {style: 'currency', currency, currencyDisplay: 'narrowSymbol'}).formatToParts(1).find(row => row.type === 'currency')?.value || currency;
  for (const name of ['lib/filter-fields.ts', 'lib/native-filter-options.ts', 'lib/service-requests.ts', 'lib/enquiry.ts', 'lib/assistant.ts', 'components/ShowroomInventoryScreen.tsx', 'components/ShowroomDesktopFilterFields.tsx', 'components/ShowroomFilterSheet.tsx', 'components/ShowroomServiceRequest.tsx']) patch(name, source => {
    source = source.replaceAll('€', symbol).replaceAll('(EUR)', '(' + currency + ')').replaceAll("currency: 'EUR'", 'currency: ' + JSON.stringify(currency));
    if (distance === 'mi') source = source.replaceAll("unit: 'km'", "unit: 'mi'").replaceAll('unit="km"', 'unit="mi"').replaceAll("'Mileage (km)'", "'Mileage (mi)'").replaceAll("t('km')", "'mi'").replaceAll("5000, 'km'", "5000, 'mi'").replaceAll('+ \' km\'', '+ \' mi\'').replaceAll('mileage in kilometres', 'mileage in miles');
    return source;
  });
  return changed;
}

export function adaptSignaturePackDiscovery(files, profile, prefix, inlineDiscovery) {
  if (!optionalDealerPackFacts(profile) || !inlineDiscovery) return [];
  const file = prefix + 'discovery.ts'; let source = get(files, file);
  source = one(source, '  priceAmount: number;', '  priceAmount?: number;', 'Signature optional discovery price');
  source = one(source, 'if (budget && car.priceAmount > Number(budget)) return false;',
    'if (budget && (!hasDiscoveryPrice(car) || discoveryPrice(car) > Number(budget))) return false;', 'Signature unknown budget results');
  source = one(source, 'a.priceAmount - b.priceAmount;',
    'hasDiscoveryPrice(a) && hasDiscoveryPrice(b) ? discoveryPrice(a) - discoveryPrice(b) : Number(hasDiscoveryPrice(b)) - Number(hasDiscoveryPrice(a));', 'Signature unknown price sort');
  source = one(source, 'return discoveryCars.toSorted(byPrice);', 'return discoveryCars.filter(hasDiscoveryPrice).toSorted(byPrice);', 'Signature cheapest requires known prices');
  for (const [operator, amount] of [['<=', '10000'], ['>=', '40000'], ['<=', '20000']]) source = one(source,
    'car.priceAmount ' + operator + ' ' + amount, 'hasDiscoveryPrice(car) && discoveryPrice(car) ' + operator + ' ' + amount, 'Signature published price collection');
  source += `\nfunction hasDiscoveryPrice(car: DiscoveryCar): boolean { return typeof car.priceAmount === 'number' && Number.isFinite(car.priceAmount) && car.priceAmount > 0; }
function discoveryPrice(car: DiscoveryCar): number { return hasDiscoveryPrice(car) ? car.priceAmount! : NaN; }
`;
  files.set(file, Buffer.from(source));
  return [file];
}
