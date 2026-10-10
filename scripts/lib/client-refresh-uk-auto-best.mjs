/**
 * Restore the approved Auto Best stock-module contract in generated UK dealers.
 * Pinned source: 2afd974c23d4f4cfb290ed99a00f46074793be3a.
 * The repair adds one optional type member and the native price-label export;
 * no factual stock, locale policy, consumer, asset or template is rewritten.
 */
export const UK_AUTO_BEST_INVENTORY_PATHS = Object.freeze(['src/lib/data/inventory.ts']);
const sourcePath = UK_AUTO_BEST_INVENTORY_PATHS[0];
const legacyExports = ['vehicleTypes', 'VehicleType', 'VehicleCondition', 'VehicleEquipment',
  'Vehicle', 'featuredVehicles', 'formatVehiclePrice'];
const priceBoundary = [
  'export const formatVehiclePrice = (',
  '  amount: number,',
  '  locale: Locale = localeContract.defaultLocale',
  ") => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');"
].join('\n');
const priceLabel = [
  '',
  "/** Allow a currency line break while preserving the locale's grouped digits. */",
  'export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>',
  "  formatVehiclePrice(amount, locale).replace(/([A-Z]{3})\\s+/u, '$1 ').replace(/\\s+([A-Z]{3})$/u, ' $1');",
  ''
].join('\n');
const identityBoundary = '  make: string;\n  title: string;';
const identityContract = [
  '  make: string;',
  '  /** Optional manufacturer sub-brand used by compact card identity. */',
  '  cardBrand?: string;',
  '  title: string;'
].join('\n');
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function validateInventory(source, profile) {
  const matches = [...source.matchAll(/^export const featuredVehicles: Vehicle\[\] = (\[\n[\s\S]*?\n\]);$/gm)];
  if (matches.length !== 1 || !Array.isArray(profile.listings) || !profile.listings.length ||
      profile.business.currency !== 'GBP') throw Error('Auto Best UK inventory boundary changed.');
  const records = JSON.parse(matches[0][1]);
  if (records.length !== profile.listings.length) throw Error('Auto Best UK factual inventory count changed.');
  records.forEach((record, index) => {
    const item = profile.listings[index], amount = Number(item.priceAmount || 0);
    const facts = {id:index + 1, make:item.make, title:item.title, year:String(item.year),
      yearNumber:item.year, priceEur:amount, image:item.image, fuel:item.fuel,
      transmission:item.transmission, condition:item.condition,
      evidenceUrl:item.sourceUrl || profile.business.inventoryUrl,
      href:'/listing-detail-v1/' + (index + 1)};
    if (item.currency !== 'GBP' || !Number.isFinite(amount) || amount < 0 ||
        Object.entries(facts).some(([key, value]) => !equal(record[key], value))) {
      throw Error('Auto Best UK factual inventory mismatch: ' + item.id);
    }
  });
  return matches[0][0];
}

/** Mutates only the returned paths, atomically; accepts string or Buffer values. */
export function repairAutoBestUkInventoryContract(files, profile) {
  if (profile?.business?.countryCode !== 'GB' || profile.business.distanceUnit !== 'mi') return [];
  if (!(files instanceof Map) || !files.has(sourcePath)) throw Error('Auto Best UK inventory source is required.');
  const input = files.get(sourcePath);
  if (!Buffer.isBuffer(input) && typeof input !== 'string') throw Error('Auto Best UK inventory source must be text.');
  const source = String(input).replace(/\r\n/g, '\n');
  const exports = [...source.matchAll(/^export (?:const|type) ([A-Za-z_$][\w$]*)/gm)].map(match => match[1]);
  if (!equal(exports, legacyExports) || source.split(identityBoundary).length !== 2 ||
      source.split(priceBoundary).length !== 2 || !source.endsWith(priceBoundary + '\n')) {
    throw Error('Auto Best UK inventory contract boundary changed.');
  }
  const inventoryBefore = validateInventory(source, profile);
  const output = source.replace(identityBoundary, identityContract) + priceLabel;
  if (validateInventory(output, profile) !== inventoryBefore) throw Error('Auto Best UK repair changed factual records.');
  files.set(sourcePath, Buffer.isBuffer(input) ? Buffer.from(output) : output);
  return [...UK_AUTO_BEST_INVENTORY_PATHS];
}
