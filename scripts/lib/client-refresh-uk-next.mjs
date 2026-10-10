/**
 * GB-only overlays for existing generated dealer adapters.
 * Inventory stays in canonical km; cards retain recorded facts and ranges use mi.
 * No template source or provider configuration is changed by these functions.
 */
const isUk = profile => profile?.business?.countryCode === 'GB' && profile.business.distanceUnit === 'mi';
const text = value => Buffer.isBuffer(value) ? value.toString('utf8').replace(/\r\n/g, '\n') : String(value).replace(/\r\n/g, '\n');
const tick = String.fromCharCode(96);

export function ukSourceMileage(listing) {
  if (listing.mileageOnRequest === true || listing.raw?.mileageOnRequest === true) return null;
  const raw = listing.raw || {};
  const supplied = ['mileageKm', 'mileageMiles', 'mileageValue', 'km', 'mileage'].some(key =>
    raw[key] !== undefined && raw[key] !== null && raw[key] !== '');
  if (!supplied && listing.mileageOnRequest !== false) return null;
  if (!Number.isFinite(listing.mileageValue) || listing.mileageValue < 0 || !['mi', 'km'].includes(listing.mileageUnit)) {
    throw new Error('Invalid UK source mileage: ' + listing.id);
  }
  return {value: listing.mileageValue, unit: listing.mileageUnit};
}

export function ukMileageModule(facts = {}) {
  return [
    "export type MileageStock = {",
    "  id?: string; slug?: string; mileage?: number; mileageValue?: number;",
    "  mileageOnRequest?: boolean; mileageKnown?: boolean;",
    "  mileageSourceValue?: number; mileageSourceUnit?: 'mi' | 'km';",
    "};",
    "type Fact = {value: number; unit: 'mi' | 'km'} | null;",
    "const recorded: Record<string, Fact> = " + JSON.stringify(facts, null, 2) + ";",
    "const milesToKm = 1.609344;",
    "export const dealerDistanceUnit = 'mi' as const;",
    "export function originalMileage(stock: MileageStock): Fact {",
    "  if (stock.mileageOnRequest === true || stock.mileageKnown === false) return null;",
    "  const key = stock.slug ?? stock.id;",
    "  if (key && Object.hasOwn(recorded, key)) return recorded[key];",
    "  if (Number.isFinite(stock.mileageSourceValue) && (stock.mileageSourceUnit === 'mi' || stock.mileageSourceUnit === 'km')) {",
    "    return {value: stock.mileageSourceValue!, unit: stock.mileageSourceUnit};",
    "  }",
    "  const value = stock.mileage ?? stock.mileageValue;",
    "  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? {value, unit: 'km'} : null;",
    "}",
    "export function canonicalMileage(stock: MileageStock): number {",
    "  const fact = originalMileage(stock);",
    "  return fact === null ? NaN : fact.unit === 'mi' ? fact.value * milesToKm : fact.value;",
    "}",
    "export const mileageLimitKm = (value: number): number => value * milesToKm;",
    "export function dealerMileageValue(stock: MileageStock): number {",
    "  const fact = originalMileage(stock);",
    "  if (fact === null) return NaN;",
    "  return fact.unit === 'mi' ? fact.value : Number((fact.value / milesToKm).toFixed(8));",
    "}",
    "export function formatStockMileage(stock: MileageStock, locale = 'en'): string {",
    "  const fact = originalMileage(stock);",
    "  if (fact === null) return locale.startsWith('bg') ? 'Пробег при запитване' : 'Mileage on request';",
    "  return new Intl.NumberFormat(locale.startsWith('bg') ? 'bg-BG' : 'en-GB', {maximumFractionDigits: 3}).format(fact.value) + ' ' + fact.unit;",
    "}", ""
  ].join('\n');
}

function transaction(files, profile, run) {
  if (!isUk(profile)) return [];
  if (profile.business.currency !== 'GBP' || profile.listings.some(item => item.currency !== 'GBP')) {
    throw new Error('UK Next stock must have recorded GBP prices; mixed currencies cannot be relabelled');
  }
  const pending = new Map(), changed = [];
  const get = name => {
    const value = pending.has(name) ? pending.get(name) : files.get(name);
    if (value === undefined) throw new Error('UK Next source boundary missing: ' + name);
    return text(value);
  };
  const put = (name, value) => {
    if (!pending.has(name)) changed.push(name);
    pending.set(name, value);
  };
  const patch = (name, from, to, count = 1) => {
    const source = get(name);
    const actual = typeof from === 'string' ? source.split(from).length - 1 : [...source.matchAll(new RegExp(from.source, 'g'))].length;
    if (actual !== count) throw new Error('UK Next boundary changed: ' + name + ' (expected ' + count + ', found ' + actual + ')');
    put(name, typeof from === 'string' ? source.split(from).join(to) : source.replace(new RegExp(from.source, 'g'), to));
  };
  const use = (name, symbols, from) => {
    const source = get(name);
    if (source.includes("from '" + from + "'") || source.includes('from "' + from + '"')) throw new Error('UK Next overlay already applied: ' + name);
    const line = 'import { ' + symbols + ' } from ' + JSON.stringify(from) + ';\n';
    const directive = /^(['"])use client\1;[ \t]*\n/;
    put(name, directive.test(source) ? source.replace(directive, '$&' + line) : line + source);
  };
  run({get, put, patch, use});
  for (const [name, source] of pending) files.set(name, Buffer.isBuffer(files.get(name)) ? Buffer.from(source) : source);
  return changed;
}

const modernDisplayPaths = [
  'packages/marketplace-ui/components/listing-specs.tsx',
  'packages/marketplace-ui/components/mobile-inventory-search.tsx',
  'packages/marketplace-ui/components/related-listing-card.tsx',
  'packages/marketplace-ui/lib/desktop-search-policy.ts',
  'packages/marketplace-ui/lib/vehicle-card-policy.ts',
  'apps/web/app/[locale]/lease/page.tsx'
];
const modernRangePaths = [
  'packages/marketplace-ui/components/dealer-hero-search.tsx',
  'packages/marketplace-ui/components/desktop-filter-rail-ranges.tsx',
  'packages/marketplace-ui/components/desktop-quick-filters.tsx',
  'packages/marketplace-ui/components/marketplace-filter-options.tsx',
  'packages/marketplace-ui/lib/desktop-filter-policy.ts',
  'packages/marketplace-ui/lib/marketplace-filter-policy.ts',
  'packages/marketplace-ui/lib/marketplace-filter-summary.ts',
  'packages/marketplace-ui/lib/marketplace-results-toolbar-policy.ts'
];
export const UK_MODERN_PATHS = [
  'packages/marketplace-domain/site-config.ts', 'packages/marketplace-domain/types.ts',
  'packages/marketplace-domain/taxonomy.ts', 'packages/marketplace-domain/testing/mock-data.ts',
  'packages/marketplace/format.ts', 'packages/marketplace/filters.ts',
  'packages/marketplace-ui/lib/marketplace-filter-config.ts',
  'packages/marketplace-ui/lib/marketplace-control-copy.ts',
  'apps/web/app/[locale]/lease/lease-finance-policy.ts',
  'apps/web/app/[locale]/contact/actions/contact.tsx',
  'apps/web/app/[locale]/contact/sell-contact-handoff.tsx',
  'apps/web/app/[locale]/sell/page.tsx', ...modernDisplayPaths, ...modernRangePaths
];

export function personalizeModernUk(files, profile) {
  return transaction(files, profile, ({patch, use, put}) => {
    patch('packages/marketplace-domain/site-config.ts', 'z.enum(["AED", "BGN", "EUR", "USD"])', 'z.enum(["AED", "BGN", "EUR", "GBP", "USD"])');
    patch('packages/marketplace-domain/types.ts', 'export type PriceCurrency = "BGN" | "EUR";', 'export type PriceCurrency = "BGN" | "EUR" | "GBP";');
    patch('packages/marketplace-domain/types.ts', '  mileageUnit: "km";', '  mileageUnit: "km";\n  mileageSourceValue?: number;\n  mileageSourceUnit?: "km" | "mi";');
    patch('packages/marketplace-domain/taxonomy.ts', 'export const priceCurrencies = ["BGN", "EUR"] as const;', 'export const priceCurrencies = ["BGN", "EUR", "GBP"] as const;');
    patch('packages/marketplace-ui/lib/marketplace-filter-config.ts', 'leadSite.currency === "BGN" || leadSite.currency === "EUR"', 'leadSite.currency === "BGN" || leadSite.currency === "EUR" || leadSite.currency === "GBP"');
    put('packages/marketplace-domain/dealer-mileage.ts', ukMileageModule());
    use('packages/marketplace/format.ts', 'formatStockMileage, type MileageStock', '../marketplace-domain/dealer-mileage');
    patch('packages/marketplace/format.ts',
      /export const formatMileage = \(value: number, locale\?: string\) =>\s*\x60\$\{new Intl\.NumberFormat\(normalizeFormattingLocale\(locale\)\)\.format\(value\)\} \$\{\s*isBulgarianLocale\(locale\) \? "км" : "km"\s*\}\x60;/,
      'export const formatMileage = (value: number, locale?: string, original: MileageStock = {}) =>\n  formatStockMileage({ mileage: value, ...original }, locale);');
    for (const name of modernDisplayPaths) {
      patch(name, /formatMileage\(\s*((?:suggestion\.)?listing)\.spec\.mileageValue,\s*(locale|normalizedLocale)\s*\)/,
        'formatMileage($1.spec.mileageValue, $2, $1.spec)');
    }
    use('packages/marketplace-domain/testing/mock-data.ts', 'canonicalMileage, mileageLimitKm', '../dealer-mileage');
    patch('packages/marketplace-domain/testing/mock-data.ts', 'listing.spec.mileageValue <= filters.mileageMax', 'canonicalMileage(listing.spec) <= mileageLimitKm(filters.mileageMax)');
    patch('packages/marketplace-domain/testing/mock-data.ts', 'a.spec.mileageValue - b.spec.mileageValue', 'canonicalMileage(a.spec) - canonicalMileage(b.spec)');
    use('apps/web/app/[locale]/lease/lease-finance-policy.ts', 'canonicalMileage, mileageLimitKm', '../../../../../packages/marketplace-domain/dealer-mileage');
    patch('apps/web/app/[locale]/lease/lease-finance-policy.ts', 'data.spec.mileageValue <= filters.mileageMax', 'canonicalMileage(data.spec) <= mileageLimitKm(filters.mileageMax)');
    patch(modernRangePaths[0], 'text("км", "km")', '"mi"');
    for (const [name, count] of [[modernRangePaths[1], 2], [modernRangePaths[2], 2], [modernRangePaths[3], 2], [modernRangePaths[4], 1]]) patch(name, 'isBg ? "км" : "km"', '"mi"', count);
    patch(modernRangePaths[5], 'isBulgarianMarketplaceLocale(locale) ? " км" : " km"', '" mi"');
    patch(modernRangePaths[6], '\${value} km', '\${value} mi');
    patch(modernRangePaths[6], 'isBulgarianMarketplaceLocale(locale) ? " лв." : " BGN"', '" GBP"');
    patch(modernRangePaths[7], 'kilometres: "км"', 'kilometres: "mi"');
    patch(modernRangePaths[7], 'kilometres: "km"', 'kilometres: "mi"');
    patch('packages/marketplace/filters.ts', '"Lowest km"', '"Lowest mileage"');
    patch('packages/marketplace-ui/lib/marketplace-control-copy.ts', '"Lowest km"', '"Lowest mileage"');
    patch('apps/web/app/[locale]/contact/actions/contact.tsx', '\${request.mileage} km', '\${request.mileage} mi');
    patch('apps/web/app/[locale]/contact/sell-contact-handoff.tsx', 'locale === "bg" ? "км" : "km"', '"mi"');
    patch('apps/web/app/[locale]/contact/sell-contact-handoff.tsx', '\${draft.mileage} km', '\${draft.mileage} mi');
    patch('apps/web/app/[locale]/sell/page.tsx', '"62 000 км"', '"62 000 mi"');
    patch('apps/web/app/[locale]/sell/page.tsx', '"62,000 km"', '"62,000 mi"');
  });
}

const mobileDisplayPaths = [
  'src/components/ShowroomVehicleCard.tsx', 'src/components/VehicleSections.tsx',
  'src/components/DesktopVehicleSummary.tsx', 'src/components/DealerScreens.tsx',
  'src/components/VehicleCard.tsx', 'src/components/NativeCarPark.tsx',
  'src/components/ShowroomFilterSheet.tsx', 'src/lib/vehicle-copy.ts'
];
export const UK_MOBILE_PATHS = [
  'src/lib/locale.ts', 'src/lib/search.ts', 'src/lib/filter-fields.ts', 'src/lib/native-filter-options.ts',
  'src/lib/service-requests.ts', 'src/lib/enquiry.ts', 'src/lib/assistant.ts',
  'src/components/ShowroomInventoryScreen.tsx', 'src/components/ShowroomDesktopFilterFields.tsx',
  'src/components/ShowroomServiceRequest.tsx', ...mobileDisplayPaths
];

export function personalizeMobileUk(files, profile) {
  if (!isUk(profile)) return [];
  const facts = Object.fromEntries(profile.listings.map(listing => [listing.id, ukSourceMileage(listing)]));
  return transaction(files, profile, ({get, put, patch, use}) => {
    put('src/lib/dealer-mileage.ts', ukMileageModule(facts));
    patch('src/lib/locale.ts', "export const defaultLocale: Locale = 'bg';", "export const defaultLocale: Locale = 'en';");
    patch('src/lib/locale.ts', "'en-IE'", "'en-GB'");
    if (!/currency: ["']GBP["']/.test(get('src/lib/locale.ts'))) throw new Error('Mobile UK currency must be generated before presentation');
    use('src/lib/search.ts', 'dealerMileageValue', './dealer-mileage');
    patch('src/lib/search.ts', 'v.mileage >= Number(f.minMileage)', 'dealerMileageValue(v) >= Number(f.minMileage)');
    patch('src/lib/search.ts', 'v.mileage <= Number(f.maxMileage)', 'dealerMileageValue(v) <= Number(f.maxMileage)');
    patch('src/lib/filter-fields.ts', "unit: '€'", "unit: '£'");
    patch('src/lib/filter-fields.ts', "unit: 'km', max: 200000", "unit: 'mi', max: 200000");
    patch('src/lib/native-filter-options.ts', "'Price (€)'", "'Price (£)'");
    patch('src/lib/native-filter-options.ts', "'Mileage (km)'", "'Mileage (mi)'");
    for (const name of mobileDisplayPaths) use(name, 'formatStockMileage', name.startsWith('src/lib/') ? './dealer-mileage' : '../lib/dealer-mileage');
    for (const [name, variable, count] of [
      [mobileDisplayPaths[0], 'vehicle', 1], [mobileDisplayPaths[1], 'v', 2], [mobileDisplayPaths[2], 'v', 1]
    ]) patch(name, "number(" + variable + ".mileage) + ' ' + t('km')", 'formatStockMileage(' + variable + ')', count);
    patch(mobileDisplayPaths[3], "number(v.mileage) + ' km'", 'formatStockMileage(v)');
    patch(mobileDisplayPaths[4], '{number(v.mileage)} km', '{formatStockMileage(v)}', 2);
    patch(mobileDisplayPaths[5], '{number(v.mileage)} km', '{formatStockMileage(v)}');
    patch(mobileDisplayPaths[6], /number\(vehicle\.mileage\) \+\s*' ' \+\s*t\('km'\)/, 'formatStockMileage(vehicle)');
    patch(mobileDisplayPaths[6], "{number(vehicle.mileage)} {t('km')}", '{formatStockMileage(vehicle)}');
    patch(mobileDisplayPaths[7], "localeNumber(vehicle.mileage, locale) + ' ' + t('km')", 'formatStockMileage(vehicle, locale)');
    patch('src/components/ShowroomFilterSheet.tsx', 'unit="km"', 'unit="mi"');
    patch('src/components/ShowroomFilterSheet.tsx', 'unit="€"', 'unit="£"');
    patch('src/components/ShowroomInventoryScreen.tsx', "t('km')", "'mi'");
    patch('src/components/ShowroomDesktopFilterFields.tsx', "0, 200000, 5000, 'km'", "0, 200000, 5000, 'mi'");
    patch('src/components/ShowroomDesktopFilterFields.tsx', "0, 100000, 500, '€'", "0, 100000, 500, '£'");
    patch('src/components/ShowroomServiceRequest.tsx', "'en-IE'", "'en-GB'");
    patch('src/components/ShowroomServiceRequest.tsx', "currency: 'EUR'", "currency: 'GBP'");
    patch('src/components/ShowroomServiceRequest.tsx', "t('km')", "'mi'");
    patch('src/components/ShowroomServiceRequest.tsx', "'Mileage (km)'", "'Mileage (mi)'");
    patch('src/components/ShowroomServiceRequest.tsx', "'Maximum budget (€)'", "'Maximum budget (£)'");
    patch('src/components/ShowroomServiceRequest.tsx', "'Expected price (€) (optional)'", "'Expected price (£) (optional)'");
    patch('src/lib/service-requests.ts', "'Enter the mileage in kilometres.'", "'Enter the mileage in miles.'");
    patch('src/lib/service-requests.ts', "'Mileage (km)'", "'Mileage (mi)'");
    patch('src/lib/service-requests.ts', "'Maximum budget (EUR)'", "'Maximum budget (GBP)'");
    patch('src/lib/service-requests.ts', "'Expected price (EUR)'", "'Expected price (GBP)'");
    patch('src/lib/enquiry.ts', "+ ' km'", "+ ' mi'");
    patch('src/lib/assistant.ts', '|budget|€)', '|budget|£)');
    // Annual leasing mileage retains its own recorded km value and label.
    patch('src/components/VehicleCard.tsx', "'en-IE'", "'en-GB'");
    patch('src/components/VehicleCard.tsx', "currency: 'EUR'", "currency: 'GBP'");
    patch('src/components/VehicleCard.tsx', "' € mth.'", "' GBP mth.'");
  });
}

export const UK_APP_PATHS = [
  'lib/currency.ts', 'lib/inventory-filters.ts', 'lib/inventory-settings.ts',
  'components/DesktopInventoryFilters.tsx', 'components/NativeFilterPane.tsx',
  'components/VehicleCard.tsx', 'components/VehicleBelowFold.tsx',
  'components/VehicleComparison.tsx', 'components/VehicleDetailClient.tsx',
  'components/SellEnquirySheet.tsx'
];
export function personalizeAppUk(files, profile, mileageFacts) {
  if (!isUk(profile)) return [];
  const facts = Object.fromEntries(mileageFacts.map(item => [item.slug,
    item.sourceValue === null ? null : {value: item.sourceValue, unit: item.sourceUnit}]));
  return transaction(files, profile, ({put, patch, use}) => {
    put('lib/dealer-mileage.ts', ukMileageModule(facts));
    patch('lib/currency.ts', "dealer.currency === 'EUR' ? '€' : dealer.currency", "dealer.currency === 'GBP' ? '£' : dealer.currency === 'EUR' ? '€' : dealer.currency");
    use('lib/inventory-filters.ts', 'dealerMileageValue', './dealer-mileage');
    patch('lib/inventory-filters.ts', /Under (30|60|90|120|150),000 kms/g, 'Under $1,000 mi', 5);
    patch('lib/inventory-filters.ts', 'vehicle.mileage < filters.mileageMinimum || vehicle.mileage > filters.mileageMaximum', 'dealerMileageValue(vehicle) < filters.mileageMinimum || dealerMileageValue(vehicle) > filters.mileageMaximum');
    patch('lib/inventory-filters.ts', "vehicle.mileage >= Number(filters.mileage.replace(/\\D/g, ''))", "dealerMileageValue(vehicle) >= Number(filters.mileage.replace(/\\D/g, ''))");
    use('lib/inventory-settings.ts', 'dealerMileageValue', './dealer-mileage');
    patch('lib/inventory-settings.ts', 'Math.ceil(vehicle.mileage / 1000)', 'Math.ceil(dealerMileageValue(vehicle) / 1000)');
    patch('components/DesktopInventoryFilters.tsx', "tx('km')", "'mi'", 3);
    patch('components/NativeFilterPane.tsx', "tx('km')", "'mi'", 3);
    patch('components/NativeFilterPane.tsx', 'maxLabel="Max Kms" minLabel="Min Kms" suffix=" km"', 'maxLabel="Max mi" minLabel="Min mi" suffix=" mi"');
    for (const name of ['components/VehicleCard.tsx', 'components/VehicleBelowFold.tsx', 'components/VehicleComparison.tsx', 'components/VehicleDetailClient.tsx']) {
      use(name, 'formatStockMileage', '@/lib/dealer-mileage');
    }
    patch('components/VehicleCard.tsx', "\${formatPrice(vehicle.mileage)} \${tx('km')}", '\${formatStockMileage(vehicle)}');
    patch('components/VehicleBelowFold.tsx', "\${formatPrice(vehicle.mileage)} \${tx('km')}", '\${formatStockMileage(vehicle)}');
    patch('components/VehicleDetailClient.tsx', "\${tx(formatPrice(vehicle.mileage))} \${tx('km')}", '\${formatStockMileage(vehicle)}');
    patch('components/VehicleComparison.tsx', '{tx(formatPrice(Math.floor(car.mileage / 1000) * 1000))} {tx(" km")}', '{formatStockMileage(car)}');
    patch('components/VehicleComparison.tsx',
      "['Kilometers', columns.map(car=>" + tick + "\${formatPrice(car.originalMileage ?? (native && car.slug===vehicle.slug ? 50005 : car.mileage))} km" + tick + ")]",
      "['Mileage', columns.map(car=>formatStockMileage(car))]");
    patch('components/SellEnquirySheet.tsx', "'Mileage (km)'", "'Mileage (mi)'", 2);
    if (profile.listings.some(item => (item.mediaKind || item.raw?.mediaKind) === 'generated_category_illustration')) {
      for (const name of ['components/VehicleCard.tsx', 'components/VehicleDetailClient.tsx']) {
        patch(name, "tx('Photo unavailable')", "tx('Illustration — not the advertised vehicle')", 2);
      }
    }
  });
}
