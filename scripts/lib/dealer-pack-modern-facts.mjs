/**
 * Opt-in support for dated dealer packs with deliberately omitted prices and
 * unpublished vehicle facts. These overlays operate on candidate source maps;
 * they never edit a selected template or weaken the default refresh adapter.
 */
export const DEALER_PACK_FACT_POLICY = 'dealer-pack-optional-v1';
export const isDealerPackOptionalFacts = profile => profile?.factPolicy === DEALER_PACK_FACT_POLICY;

const transmissions = new Set(['manual', 'automatic', 'semi_automatic']);
const fuels = new Set(['gasoline', 'diesel', 'hybrid', 'plug_in_hybrid', 'electric', 'lpg', 'cng']);
const bodies = new Set(['hatchback', 'sedan', 'wagon', 'suv', 'coupe', 'convertible', 'pickup', 'van', 'minibus', 'motorcycle', 'scooter', 'truck']);

export function dealerPackModernListing(item, index, id, profile) {
  if (!isDealerPackOptionalFacts(profile)) throw new Error('Modern optional facts require an explicit dealer-pack fact policy');
  const b = profile.business;
  const priceKnown = item.priceOnRequest !== true && item.raw?.priceOnRequest !== true && Number.isFinite(item.priceAmount) && item.priceAmount > 0;
  const suppliedMileage = ['mileageKm', 'mileageMiles', 'mileageValue', 'km', 'mileage'].some(key => item.raw?.[key] !== undefined && item.raw[key] !== null && item.raw[key] !== '');
  const mileageKnown = item.mileageOnRequest !== true && item.raw?.mileageOnRequest !== true && (suppliedMileage || item.mileageOnRequest === false) && Number.isFinite(item.mileageValue) && item.mileageValue >= 0 && ['mi', 'km'].includes(item.mileageUnit);
  const body = bodies.has(item.bodyType) ? item.bodyType : 'other';
  const features = (item.features || []).slice(0, 8).map(feature => ({ bg: feature, en: feature }));
  const observedAt = item.observedAt || b.observedAt;
  if (!observedAt || !Number.isFinite(Date.parse(observedAt))) throw new Error('Dealer-pack Modern listing requires its source observation date: ' + item.id);
  return {
    id, slug: item.slug || `${b.slug}-${index + 1}`, category: body === 'van' ? 'van' : 'car',
    dealerOrgId: `dealer-${b.slug}`, status: 'active', availabilityKnown: false,
    title: item.title, description: item.description || b.inventoryNotice,
    // The numeric slot is a compatibility sentinel, never an advertised price.
    // Every consuming boundary preserves and consults priceOnRequest.
    price: { amount: priceKnown ? item.priceAmount : 0, currency: item.currency || b.currency, priceOnRequest: !priceKnown },
    priceType: priceKnown ? 'fixed' : 'on_request',
    images: item.images.map(url => ({ url, alt: item.title })),
    badges: [item.condition === 'new' ? 'new' : 'used'],
    location: { city: b.city, region: b.region || b.city, country: b.country },
    ...(features.length ? { features } : {}),
    spec: {
      make: item.make, model: item.model, ...(item.trim ? { trim: item.trim } : {}), year: item.year,
      bodyType: body, fuelType: fuels.has(item.fuelType) ? item.fuelType : 'other',
      transmission: transmissions.has(item.transmissionType) ? item.transmissionType : 'unknown',
      mileageValue: mileageKnown ? Math.round(item.mileageValue * (item.mileageUnit === 'mi' ? 1.609344 : 1)) : 0,
      mileageUnit: 'km', mileageKnown,
      ...(mileageKnown ? { mileageSourceValue: item.mileageValue, mileageSourceUnit: item.mileageUnit } : {}),
      ...(item.powerHp ? { enginePowerHp: item.powerHp } : {}), ...(item.color ? { colorExterior: item.color } : {})
    },
    seller: { id: `dealer-${b.slug}`, type: 'dealer', displayName: b.name, verificationStatus: 'unverified', city: b.city, ...(b.logo ? { logoUrl: b.logo } : {}) },
    publishedAt: observedAt, promoted: index < 3
  };
}

const formatPath = 'packages/marketplace/format.ts';
const dataPath = 'packages/marketplace-domain/testing/mock-data.ts';
const typesPath = 'packages/marketplace-domain/types.ts';
const financePath = 'apps/web/app/[locale]/lease/lease-finance-policy.ts';
const displayPaths = [
  'packages/marketplace-ui/components/listing-specs.tsx',
  'packages/marketplace-ui/components/mobile-inventory-search.tsx',
  'packages/marketplace-ui/components/related-listing-card.tsx',
  'packages/marketplace-ui/lib/desktop-search-policy.ts',
  'packages/marketplace-ui/lib/vehicle-card-policy.ts',
  'apps/web/app/[locale]/lease/page.tsx'
];
const transmissionPaths = [
  'packages/marketplace-domain/taxonomy.ts', 'packages/marketplace/filters.ts',
  'packages/marketplace-ui/lib/marketplace-filter-config.ts',
  'packages/marketplace-ui/components/marketplace-filter-options.tsx',
  'apps/web/app/[locale]/imports/components/external-import-listings.tsx',
  'apps/app/app/(authenticated)/sell/components/listing-form.tsx'
];
const rangePaths = [
  'packages/marketplace-ui/components/dealer-hero-search.tsx',
  'packages/marketplace-ui/components/desktop-filter-rail-ranges.tsx',
  'packages/marketplace-ui/components/desktop-quick-filters.tsx',
  'packages/marketplace-ui/lib/desktop-filter-policy.ts',
  'packages/marketplace-ui/lib/marketplace-filter-policy.ts',
  'packages/marketplace-ui/lib/marketplace-filter-summary.ts',
  'packages/marketplace-ui/lib/marketplace-results-toolbar-policy.ts',
  'packages/marketplace-ui/lib/marketplace-control-copy.ts'
];
export const DEALER_PACK_MODERN_PATHS = Object.freeze([...new Set([
  formatPath, dataPath, typesPath, financePath, ...displayPaths, ...transmissionPaths, ...rangePaths,
  'packages/marketplace/inventory-search.ts', 'packages/marketplace-domain/directory.ts',
  'packages/marketplace-ui/lib/desktop-saved-car.ts',
  'apps/web/lib/public-structured-data.ts',
  'apps/web/app/[locale]/lease/lease-selected-vehicle.tsx',
  'apps/web/app/[locale]/lease/lease-desktop-controls.tsx'
])]);

/** Pure runtime source is kept small so its decisions can be executed in tests. */
export function dealerPackModernRuntime(profile) {
  if (!isDealerPackOptionalFacts(profile)) throw new Error('Dealer-pack runtime requires an explicit fact policy');
  return `// Cars dealer-pack optional facts v1. Zero slots require explicit unknown flags.
export type DealerMoney = { amount: number; currency: string; priceOnRequest?: boolean };
export type DealerMileage = { mileageValue?: number; mileageKnown?: boolean; mileageSourceValue?: number; mileageSourceUnit?: 'mi' | 'km' };
export const dealerDistanceUnit = ${JSON.stringify(profile.business.distanceUnit)} as const;
export const priceOnRequestLabel = (locale?: string) => locale?.toLowerCase().startsWith('bg') ? 'Цена при запитване' : 'Price on request';
export const isPublishedDealerPrice = (money: DealerMoney) => money.priceOnRequest !== true && Number.isFinite(money.amount) && money.amount > 0;
export function dealerMileageKm(spec: DealerMileage): number {
  if (spec.mileageKnown === false) return NaN;
  if (Number.isFinite(spec.mileageSourceValue) && (spec.mileageSourceUnit === 'mi' || spec.mileageSourceUnit === 'km')) return spec.mileageSourceValue! * (spec.mileageSourceUnit === 'mi' ? 1.609344 : 1);
  return typeof spec.mileageValue === 'number' && Number.isFinite(spec.mileageValue) && spec.mileageValue >= 0 ? spec.mileageValue : NaN;
}
export const dealerMileageLimitKm = (value: number) => value * ${profile.business.distanceUnit === 'mi' ? 1.609344 : 1};
export function formatDealerPackMileage(value: number, locale?: string, spec: DealerMileage = {}): string {
  if (spec.mileageKnown === false || !Number.isFinite(value)) return locale?.toLowerCase().startsWith('bg') ? 'Пробегът не е посочен' : 'Mileage not published';
  const original = Number.isFinite(spec.mileageSourceValue) && (spec.mileageSourceUnit === 'mi' || spec.mileageSourceUnit === 'km');
  const amount = original ? spec.mileageSourceValue! : value;
  const unit = original ? spec.mileageSourceUnit : 'km';
  return new Intl.NumberFormat(locale?.toLowerCase().startsWith('bg') ? 'bg-BG' : ${JSON.stringify(profile.business.locale || 'en-GB')}, { maximumFractionDigits: 3 }).format(amount) + ' ' + (unit === 'km' && locale?.toLowerCase().startsWith('bg') ? 'км' : unit);
}
export function compareDealerPrices(a: DealerMoney, b: DealerMoney, direction = 1): number {
  const aKnown = isPublishedDealerPrice(a), bKnown = isPublishedDealerPrice(b);
  return aKnown && bKnown ? direction * (a.amount - b.amount) : aKnown ? -1 : bKnown ? 1 : 0;
}
export function compareDealerMileages(a: DealerMileage, b: DealerMileage): number {
  const av = dealerMileageKm(a), bv = dealerMileageKm(b);
  return Number.isFinite(av) && Number.isFinite(bv) ? av - bv : Number.isFinite(av) ? -1 : Number.isFinite(bv) ? 1 : 0;
}
`;
}

export function personalizeDealerPackModernFacts(files, profile) {
  if (!isDealerPackOptionalFacts(profile)) return [];
  if (!(files instanceof Map)) throw new Error('Dealer-pack Modern facts require a candidate source map');
  const pending = new Map();
  const get = name => {
    const source = pending.has(name) ? pending.get(name) : files.get(name);
    if (source === undefined) throw new Error('Dealer-pack Modern source missing: ' + name);
    return (Buffer.isBuffer(source) ? source.toString('utf8') : String(source)).replace(/\r\n/g, '\n');
  };
  const put = (name, source) => pending.set(name, source);
  const patch = (name, from, to, expected = 1) => {
    const source = get(name);
    const count = typeof from === 'string' ? source.split(from).length - 1 : [...source.matchAll(new RegExp(from.source, 'g'))].length;
    if (count !== expected) throw new Error(`Dealer-pack Modern boundary changed: ${name} (expected ${expected}, found ${count})`);
    put(name, typeof from === 'string' ? source.split(from).join(to) : source.replace(new RegExp(from.source, 'g'), to));
  };
  const use = (name, symbols, from) => {
    const source = get(name), line = `import { ${symbols} } from ${JSON.stringify(from)};\n`;
    const directive = /^(['"])use client\1;[ \t]*\n/;
    put(name, directive.test(source) ? source.replace(directive, '$&' + line) : line + source);
  };
  const typeSource = get(typesPath);
  patch(typesPath, 'export interface Money {\n  amount: number;', 'export interface Money {\n  priceOnRequest?: boolean;\n  amount: number;');
  patch(typesPath, 'export interface VehicleListing {\n', 'export interface VehicleListing {\n  availabilityKnown?: boolean;\n');
  patch(typesPath, '  mileageValue: number;', '  mileageValue: number;\n  mileageKnown?: boolean;');
  if (!typeSource.includes('  mileageSourceValue?: number;')) patch(typesPath, '  mileageUnit: "km";', '  mileageUnit: "km";\n  mileageSourceValue?: number;\n  mileageSourceUnit?: "km" | "mi";');
  patch(typesPath, '  | "finance_estimate";', '  | "finance_estimate"\n  | "on_request";');
  patch(typesPath, /export type PriceCurrency = [^;]+;/, 'export type PriceCurrency = "BGN" | "EUR" | "GBP" | "USD" | "AED";');
  patch('packages/marketplace-domain/taxonomy.ts', /export const priceCurrencies = \[[^\]]+\] as const;/, 'export const priceCurrencies = ["BGN", "EUR", "GBP", "USD", "AED"] as const;');
  const filterConfig = 'packages/marketplace-ui/lib/marketplace-filter-config.ts';
  patch(filterConfig, /leadSite\.currency === "BGN" \|\| leadSite\.currency === "EUR"(?: \|\| leadSite\.currency === "GBP")?/, 'leadSite.currency === "BGN" || leadSite.currency === "EUR" || leadSite.currency === "GBP" || leadSite.currency === "USD" || leadSite.currency === "AED"');

  // Existing GB overlays already supply truthful unknown-transmission variants.
  if (!typeSource.includes('"semi_automatic" | "unknown"')) {
    patch(typesPath, 'export type Transmission = "automatic" | "manual" | "semi_automatic";', 'export type Transmission = "automatic" | "manual" | "semi_automatic" | "unknown";');
    for (const name of ['packages/marketplace-domain/taxonomy.ts', filterConfig]) patch(name, '  "semi_automatic",\n', '  "semi_automatic",\n  "unknown",\n');
    patch(formatPath, '  semi_automatic: "Semi-auto",', '  semi_automatic: "Semi-auto",\n  unknown: "Not published",');
    patch(formatPath, '  semi_automatic: "Полуавтоматична",', '  semi_automatic: "Полуавтоматична",\n  unknown: "Не е посочена",');
    patch('packages/marketplace/filters.ts', '    semi_automatic: "Semi-auto",', '    semi_automatic: "Semi-auto",\n    unknown: "Not published",');
    patch(filterConfig, '  semi_automatic: "Полуавтоматик",', '  semi_automatic: "Полуавтоматик",\n  unknown: "Не е посочена",');
    for (const name of ['packages/marketplace-ui/lib/vehicle-card-policy.ts', 'packages/marketplace-ui/components/listing-specs.tsx']) patch(name, '  semi_automatic: { bg: "Полуавтоматик", en: "Semi-auto" },', '  semi_automatic: { bg: "Полуавтоматик", en: "Semi-auto" },\n  unknown: { bg: "Не е посочена", en: "Not published" },');
    patch('packages/marketplace-ui/components/marketplace-filter-options.tsx', '          ["semi_automatic", copy.options.semiAutomatic],', '          ["semi_automatic", copy.options.semiAutomatic],\n          ["unknown", isBulgarianMarketplaceLocale(locale) ? "Не е посочена" : "Not published"],');
    patch('apps/web/app/[locale]/imports/components/external-import-listings.tsx', '    semi_automatic: "Полуавтоматик",', '    semi_automatic: "Полуавтоматик",\n    unknown: "Не е посочена",');
    patch('apps/app/app/(authenticated)/sell/components/listing-form.tsx', '  semi_automatic: "Полуавтоматична",', '  semi_automatic: "Полуавтоматична",\n  unknown: "Не е посочена",');
  }

  put('packages/marketplace-domain/dealer-pack-facts.ts', dealerPackModernRuntime(profile));
  use(formatPath, 'priceOnRequestLabel, formatDealerPackMileage, type DealerMileage', '../marketplace-domain/dealer-pack-facts');
  patch(formatPath, '  moneyFormatter(money, locale).format(money.amount);', '  money.priceOnRequest === true ? priceOnRequestLabel(locale) : moneyFormatter(money, locale).format(money.amount);');
  patch(formatPath, '  moneyFormatter(money, locale).formatToParts(money.amount);', '  money.priceOnRequest === true ? [{ type: "literal", value: priceOnRequestLabel(locale) }] as Intl.NumberFormatPart[] : moneyFormatter(money, locale).formatToParts(money.amount);');
  patch(formatPath, '  fixed: "Fixed price",', '  fixed: "Fixed price",\n  on_request: "Price on request",');
  patch(formatPath, '  fixed: "Фиксирана цена",', '  fixed: "Фиксирана цена",\n  on_request: "Цена при запитване",');
  patch(formatPath, /export const formatMileage = [\s\S]*?;(?=\n\nexport const formatFuelType)/, 'export const formatMileage = (value: number, locale?: string, original: DealerMileage = {}) =>\n  formatDealerPackMileage(value, locale, original);');
  for (const name of displayPaths) patch(name, /formatMileage\(\s*((?:suggestion\.)?listing)\.spec\.mileageValue,\s*(locale|normalizedLocale)(?:,\s*\1\.spec)?\s*\)/, 'formatMileage($1.spec.mileageValue, $2, $1.spec)');

  const search = 'packages/marketplace/inventory-search.ts';
  patch(search, '"mileageValue" | "fuelType"', '"mileageValue" | "fuelType" | "mileageKnown" | "mileageSourceValue" | "mileageSourceUnit"');
  patch(search, '    mileageValue: listing.spec.mileageValue,', '    mileageValue: listing.spec.mileageValue,\n    mileageKnown: listing.spec.mileageKnown,\n    mileageSourceValue: listing.spec.mileageSourceValue,\n    mileageSourceUnit: listing.spec.mileageSourceUnit,');
  const saved = 'packages/marketplace-ui/lib/desktop-saved-car.ts';
  patch(saved, '? { amount: car.money.amount, currency: car.money.currency }', '? { amount: car.money.amount, currency: car.money.currency, priceOnRequest: car.money.priceOnRequest === true }');
  patch(saved, 'money: { amount: listing.price.amount, currency: listing.price.currency },', 'money: { ...listing.price },');
  patch('packages/marketplace-domain/directory.ts', 'const moneySchema = z.object({\n', 'const moneySchema = z.object({\n  priceOnRequest: z.boolean().optional(),\n');

  use(dataPath, 'isPublishedDealerPrice, dealerMileageKm, dealerMileageLimitKm, compareDealerPrices, compareDealerMileages', '../dealer-pack-facts');
  patch(dataPath, 'listing.price.amount >= filters.priceMin', '(isPublishedDealerPrice(listing.price) && listing.price.amount >= filters.priceMin)');
  patch(dataPath, 'listing.price.amount <= filters.priceMax', '(isPublishedDealerPrice(listing.price) && listing.price.amount <= filters.priceMax)');
  patch(dataPath, /(?:listing\.spec\.mileageValue <= filters\.mileageMax|canonicalMileage\(listing\.spec\) <= mileageLimitKm\(filters\.mileageMax\))/, 'dealerMileageKm(listing.spec) <= dealerMileageLimitKm(filters.mileageMax)');
  patch(dataPath, /mileage_asc: \(a, b\) => (?:a\.spec\.mileageValue - b\.spec\.mileageValue|canonicalMileage\(a\.spec\) - canonicalMileage\(b\.spec\)),/, 'mileage_asc: (a, b) => compareDealerMileages(a.spec, b.spec),');
  patch(dataPath, 'price_asc: (a, b) => a.price.amount - b.price.amount,', 'price_asc: (a, b) => compareDealerPrices(a.price, b.price),');
  patch(dataPath, 'price_desc: (a, b) => b.price.amount - a.price.amount,', 'price_desc: (a, b) => compareDealerPrices(a.price, b.price, -1),');
  patch(dataPath, '  const inventory = getMockDealerInventory();', '  const inventory = getMockDealerInventory();\n  const pricedInventory = inventory.filter(listing => isPublishedDealerPrice(listing.price));');
  patch(dataPath, '      inventory.reduce((total, listing) => total + listing.price.amount, 0) /\n      inventory.length,', '      pricedInventory.length ? pricedInventory.reduce((total, listing) => total + listing.price.amount, 0) / pricedInventory.length : null,');

  use(financePath, 'dealerMileageKm, dealerMileageLimitKm', '../../../../../packages/marketplace-domain/dealer-pack-facts');
  patch(financePath, '  priceAmount: number;', '  priceAmount: number;\n  priceOnRequest?: boolean;');
  patch(financePath, 'export const getLeasePrincipal = (price: number, deposit: string) => {', 'export const getLeasePrincipal = (price: number, deposit: string, priceOnRequest = false) => {');
  patch(financePath, '    price < 0\n', '    price <= 0 || priceOnRequest\n');
  patch(financePath, 'vehicle.priceAmount >= filters.priceMin', '(vehicle.priceOnRequest !== true && vehicle.priceAmount >= filters.priceMin)');
  patch(financePath, 'vehicle.priceAmount <= filters.priceMax', '(vehicle.priceOnRequest !== true && vehicle.priceAmount <= filters.priceMax)');
  patch(financePath, /(?:data\.spec\.mileageValue <= filters\.mileageMax|canonicalMileage\(data\.spec\) <= mileageLimitKm\(filters\.mileageMax\))/, 'dealerMileageKm(data.spec) <= dealerMileageLimitKm(filters.mileageMax)');
  patch('apps/web/app/[locale]/lease/page.tsx', '    priceAmount: listing.price.amount,', '    priceAmount: listing.price.amount,\n    priceOnRequest: listing.price.priceOnRequest === true,');
  patch('apps/web/app/[locale]/lease/lease-selected-vehicle.tsx', '            amount: vehicle.priceAmount,', '            amount: vehicle.priceAmount,\n            priceOnRequest: vehicle.priceOnRequest === true,');
  patch('apps/web/app/[locale]/lease/lease-desktop-controls.tsx', 'getLeasePrincipal(selectedVehicle.priceAmount, deposit)', 'getLeasePrincipal(selectedVehicle.priceAmount, deposit, selectedVehicle.priceOnRequest)');

  const schema = 'apps/web/lib/public-structured-data.ts';
  patch(schema, '    mileageFromOdometer: {\n      "@type": "QuantitativeValue",\n      unitCode: "KMT",\n      value: listing.spec.mileageValue,\n    },', '    ...(listing.spec.mileageKnown === false ? {} : { mileageFromOdometer: {\n      "@type": "QuantitativeValue" as const,\n      unitCode: "KMT",\n      value: listing.spec.mileageValue,\n    } }),');
  patch(schema, '    offers: {\n      "@id": `${listingUrl}#offer`,\n    },', '    ...(getAdvertisedPrice(listing).priceOnRequest === true ? {} : { offers: {\n      "@id": `${listingUrl}#offer`,\n    } }),');
  patch(schema, '    vehicleTransmission: formatTransmission(listing.spec.transmission, locale),', '    ...(listing.spec.transmission === "unknown" ? {} : { vehicleTransmission: formatTransmission(listing.spec.transmission, locale) }),');
  patch(schema, '    availability: getAvailability(listing),', '    ...(listing.availabilityKnown === false ? {} : { availability: getAvailability(listing) }),');
  patch(schema, '    price: advertisedPrice.amount,\n    priceCurrency: advertisedPrice.currency,', '    ...(advertisedPrice.priceOnRequest === true ? {} : { price: advertisedPrice.amount, priceCurrency: advertisedPrice.currency }),');

  // UK already received the native miles copy overlay. US miles require only
  // the same unit labels; currency remains the actual dealer currency.
  if (profile.business.distanceUnit === 'mi' && profile.business.countryCode !== 'GB') {
    patch(rangePaths[0], 'text("км", "km")', '"mi"');
    for (const [name, count] of [[rangePaths[1], 2], [rangePaths[2], 2], ['packages/marketplace-ui/components/marketplace-filter-options.tsx', 2], [rangePaths[3], 1]]) patch(name, 'isBg ? "км" : "km"', '"mi"', count);
    patch(rangePaths[4], 'isBulgarianMarketplaceLocale(locale) ? " км" : " km"', '" mi"');
    patch(rangePaths[5], '${value} km', '${value} mi');
    patch(rangePaths[6], 'kilometres: "км"', 'kilometres: "mi"');
    patch(rangePaths[6], 'kilometres: "km"', 'kilometres: "mi"');
    patch('packages/marketplace/filters.ts', '"Lowest km"', '"Lowest mileage"');
    patch(rangePaths[7], '"Lowest km"', '"Lowest mileage"');
  }
  for (const [name, source] of pending) files.set(name, Buffer.isBuffer(files.get(name)) ? Buffer.from(source) : source);
  return [...pending.keys()];
}
