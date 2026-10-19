/** Data/formatter adapters for optional pack facts. Existing dealer paths keep
 * their released behavior; unknown mileage never becomes a displayed zero. */
export function adaptPackImportFacts(files, profile) {
  if (profile.factPolicy !== 'dealer-pack-optional-v1') return [];
  const output = new Map(files), prefix = 'import/', changed = [];
  const patch = (name, before, after, count = 1) => {
    const file = prefix + name, bytes = output.get(file);
    if (!bytes) throw Error('Missing pack Import facts boundary: ' + file);
    const text = bytes.toString('utf8');
    if (text.split(before).length !== count + 1) throw Error('Pack Import facts boundary changed: ' + file);
    output.set(file, Buffer.from(text.split(before).join(after))); changed.push(file);
  };
  const mileUnits = profile.business.distanceUnit === 'mi';
  const currency = profile.business.currency;
  if (!/^[A-Z]{3}$/.test(currency)) throw Error('Pack Import facts require the recorded dealer currency');
  // The maintained miles adapter preserves original units and unknown flags.
  // Carry NaN through legacy data-only consumers instead of their zero sentinel.
  if (mileUnits) {
    patch('src/lib/data/daynight.ts', 'const mileageKm = Number.isFinite(canonicalMileage(mileageFacts)) ? canonicalMileage(mileageFacts) : 0;',
      'const mileageKm = canonicalMileage(mileageFacts);');
  } else {
    patch('src/lib/data/daynight.ts', 'const mileageKm = parseMileage(listing.mileage);',
      "const mileageKm = listing.mileage.trim() ? parseMileage(listing.mileage) : Number.NaN;");
    patch('src/lib/data/daynight.ts', "mileage: `${mileageKm.toLocaleString('fr-FR').replace(/\\u202f/g, ' ')} km`,",
      "mileage: Number.isFinite(mileageKm) ? `${mileageKm.toLocaleString('fr-FR').replace(/\\u202f/g, ' ')} km` : '—',");
    patch('src/lib/domain/vehicle-card.ts', "export const formatInventoryKm = (value: number, locale: Locale = 'en') =>\n\t`${formatNumber(value, locale)} ${vehicleUnits[locale].distance}`;",
      "export const formatInventoryKm = (value: number, locale: Locale = 'en') =>\n\tNumber.isFinite(value) ? `${formatNumber(value, locale)} ${vehicleUnits[locale].distance}` : '—';");
  }
  // Comparison hydration consumes the data label directly, bypassing listedPrice.
  patch('src/lib/data/daynight.ts', '\tconst price = Math.round(parseNumber(value));',
    "\tconst price = Math.round(parseNumber(value));\n\tif (!Number.isFinite(price) || price <= 0) return {priceEur: 0, price: 'On request'};");
  patch('src/lib/data/daynight.ts', "price: `${price.toLocaleString('fr-FR').replace(/\\u202f/g, ' ')} EUR`",
    "price: `${price.toLocaleString('fr-FR').replace(/\\u202f/g, ' ')} " + currency + "`");
  patch('src/lib/utils/format.ts', 'export function formatPrice(value: number, options: Intl.NumberFormatOptions = {}) {',
    "export function formatPrice(value: number, options: Intl.NumberFormatOptions = {}) {\n\tif (!Number.isFinite(value) || value <= 0) return 'On request';");
  patch('src/lib/utils/format.ts', 'return `${formatted} EUR`;', 'return `${formatted} ' + currency + '`;');
  patch('src/lib/utils/format.ts', 'export function formatMileage(value: number) {',
    "export function formatMileage(value: number) {\n\tif (!Number.isFinite(value)) return '—';");
  // Both server-rendered legacy views and their client hydration receive the
  // whole vehicle. JSON turns NaN into null; neither is a published odometer.
  const mileageFormatter = signature => `${signature} => {
    if (vehicle.mileageKnown === false) return '—';
    const original = typeof vehicle.mileageValue === 'number' && Number.isFinite(vehicle.mileageValue) && (vehicle.mileageUnit === 'mi' || vehicle.mileageUnit === 'km');
    const value = original ? vehicle.mileageValue : vehicle.mileage;
    if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat(${JSON.stringify(profile.business.locale || 'en-GB')}).format(value) + ' ' + (original ? vehicle.mileageUnit : 'km');
  };`;
  patch('src/lib/server/auxero-template.ts', "const formatKm = (value) => Number(value || 0).toLocaleString('fr-FR').replace(/\\u202f/g, ' ') + ' km';",
    mileageFormatter('const formatKm = (vehicle)'));
  patch('src/lib/server/auxero-template.ts', 'formatKm(vehicle.mileage)', 'formatKm(vehicle)', 2);
  patch('src/lib/server/auxero-listing-data.ts', "const km = (value: number) => `${value.toLocaleString('fr-FR').replace(/\\u202f/g, ' ')} km`;",
    mileageFormatter("const km = (vehicle: {mileage: number; mileageKnown?: boolean; mileageValue?: number; mileageUnit?: 'mi' | 'km'})"));
  patch('src/lib/server/auxero-listing-data.ts', 'km(vehicle.mileage)', 'km(vehicle)', 4);
  for (const amount of ['30 000', '50 000', '70 000', '100 000']) {
    patch('src/lib/server/auxero-listing-data.ts', "label: 'Up to " + amount + " EUR'", "label: 'Up to " + amount + ' ' + currency + "'");
  }
  if (mileUnits) {
    patch('src/lib/server/auxero-listing-data.ts', '\t\tmileage: vehicle.mileage,',
      '\t\tmileage: vehicle.mileage,\n\t\tmileageKnown: vehicle.mileageKnown,\n\t\tmileageValue: vehicle.mileageValue,\n\t\tmileageUnit: vehicle.mileageUnit,');
    patch('src/lib/auxero/compare.ts', 'formatInventoryKm(vehicle.mileage)', 'formatInventoryKm(vehicle.mileage, locale, vehicle)');
    for (const amount of ['50 000', '80 000', '100 000', '150 000']) {
      patch('src/lib/server/auxero-listing-data.ts', "label: 'Up to " + amount + " km'", "label: 'Up to " + amount + " mi'");
    }
  }
  // Numeric price filters cannot classify an omitted price as a free vehicle.
  patch('src/lib/domain/vehicle-search.ts', 'return source.filter((vehicle) => {',
    'return source.filter((vehicle) => {\n\t\tif ((minPrice !== undefined || maxPrice !== undefined) && !(vehicle.price > 0)) return false;');
  for (const file of new Set(changed)) files.set(file, output.get(file));
  return [...new Set(changed)];
}
