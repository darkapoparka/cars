/**
 * Small per-design map onto schemas already consumed by the applications. The
 * dealer facts/stock pack remains the source of truth; these typed exports are
 * adapter targets, not a second content registry.
 */
export const DEALER_CONTENT_CONTRACT_VERSION = 1;

export const dealerContentContract = Object.freeze({
  'auto-best': Object.freeze({
    facts: 'business-facts.json',
    stock: 'stock.json',
    identity: Object.freeze({ path: 'src/lib/config/brand.ts', export: 'brand' }),
    inventory: Object.freeze({ path: 'src/lib/data/inventory.ts', export: 'featuredVehicles' }),
    locale: Object.freeze({ config: 'src/lib/config/locale.ts', catalog: 'localization/dealer.reviewed.json' }),
    media: Object.freeze({ publicRoot: 'static', logos: ['business-facts.json.logo', 'business-facts.json.logoDark'], inventoryImages: 'stock.json.listings[].images' })
  }),
  modern: Object.freeze({
    facts: 'business-facts.json',
    stock: 'stock.json',
    identity: Object.freeze({ path: 'packages/marketplace/lead-site.ts', export: 'leadSite' }),
    inventory: Object.freeze({ path: 'packages/marketplace-domain/testing/mock-data.ts', export: 'mockListings' }),
    locale: Object.freeze({ localized: Object.freeze({ path: 'packages/marketplace/lead-site.ts', field: 'localizedCopy' }) }),
    media: Object.freeze({ publicRoot: 'apps/web/public', logos: ['business-facts.json.logo'], inventoryImages: 'stock.json.listings[].images' })
  }),
  carwow: Object.freeze({
    facts: 'business-facts.json',
    stock: 'stock.json',
    identity: Object.freeze({ path: 'src/lib/data/daynight-site.ts', export: 'daynightDealerText + daynightSite' }),
    inventory: Object.freeze({ path: 'src/lib/data/daynight-current-inventory.ts', export: 'currentDayNightListings' }),
    locale: Object.freeze({ config: 'src/lib/locale/config.ts', catalog: 'localization/dealer.reviewed.json' }),
    media: Object.freeze({ publicRoot: 'static', logos: ['business-facts.json.logo', 'business-facts.json.logoDark'], inventoryImages: 'stock.json.listings[].images' })
  }),
  import: Object.freeze({
    facts: 'business-facts.json',
    stock: 'stock.json',
    identity: Object.freeze({ path: 'src/lib/config/dealer.ts', exports: ['daynightContact', 'daynightBrand', 'daynightAssets'] }),
    inventory: Object.freeze({ path: 'src/lib/data/daynight-listings.json', export: 'listings' }),
    locale: Object.freeze({ config: 'src/lib/config/dealer.ts', copy: 'src/lib/config/dealer-copy.ts' }),
    media: Object.freeze({ publicRoot: 'static', logos: ['business-facts.json.logo', 'business-facts.json.logoDark'], inventoryImages: 'stock.json.listings[].images' })
  })
});

export function contractForTemplate(key) {
  const contract = dealerContentContract[key];
  if (!contract) throw new Error(`No dealer-content contract for template ${key}`);
  return contract;
}
