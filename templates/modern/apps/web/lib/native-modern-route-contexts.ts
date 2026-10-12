import {
  buildVehicleTaxonomyOptions,
  curatedVehicleTaxonomy,
  getMakePath,
  getModelPath,
  getListingPath,
  vehicleCategories,
  slugifyMakeModel,
  type VehicleCategory,
} from "@repo/marketplace";
import { isDealershipSite } from "@repo/marketplace/site-config";
import { localizedPath, withBasePath } from "@repo/internationalization/paths";
import { getPublicLocales } from "./public-locale-policy";
import { buildPublicInventoryTaxonomy } from "./public-inventory-taxonomy";
import { getNativeImmutablePublicInventory } from "./native-immutable-public-inventory";
import type { NativeStaticQueryContext } from "./native-marketplace-static-query";
import type { NativeListingStaticQueryContext } from "./native-listing-static-query";
export interface NativeModernRouteProtocol {
  routePattern: string;
  renderedPath: string;
  params: Readonly<Record<string, string>>;
}
export type NativeModernRouteContext = (NativeStaticQueryContext | NativeListingStaticQueryContext) & {
  protocol: Readonly<NativeModernRouteProtocol>;
};

/** Same demo taxonomy and route resolution inputs as the original source.
 * Includes empty curated model routes beneath an actual inventory make. */
export function createNativeModernRouteContexts(inventorySeal: string) {
  const inventory = getNativeImmutablePublicInventory(inventorySeal);
  const pairs = (category: VehicleCategory) => [...new Map(inventory.listings
    .filter(row => row.category === category)
    .map(row => [`${row.spec.make}\u0000${row.spec.model}`, { make: row.spec.make, model: row.spec.model }] as const)).values()];
  const taxonomy = new Map(vehicleCategories.map(category => {
    const fallback = buildVehicleTaxonomyOptions(curatedVehicleTaxonomy, category.id);
    return [category.id, fallback.length ? fallback : buildPublicInventoryTaxonomy(pairs(category.id))] as const;
  }));
  const routes = new Map<string, NativeModernRouteContext>();
  const addCategory = (locale: string, category: VehicleCategory, categoryPath: string, make?: string, model?: string) => {
    const basePath = localizedPath(locale, categoryPath);
    const supportsDiscoveryPresentation = isDealershipSite ||
      ((category === "car" || category === "lease") && make === undefined && model === undefined);
    const pathname = withBasePath(basePath);
    // Original make/model resolution keeps the first slug match. Curated aliases
    // can share a canonical slug; preserve that source ordering.
    if (routes.has(pathname)) return;
    const params = Object.freeze({ locale, ...(make === undefined ? {} : { make: slugifyMakeModel(make) }),
      ...(model === undefined ? {} : { model: slugifyMakeModel(model) }) });
    const protocol = Object.freeze({ renderedPath: basePath, params,
      routePattern: make === undefined ? `/:locale${categoryPath}` : model === undefined ? "/:locale/cars/:make" : "/:locale/cars/:make/:model" });
    routes.set(pathname, { inventory, protocol, route: { basePath, category, make, model, supportsDiscoveryPresentation },
      categoryPath, locale, taxonomy: taxonomy.get(category) ?? [], dealership: isDealershipSite,
      viewMode: supportsDiscoveryPresentation ? "grid" : "list" });
  };
  for (const locale of getPublicLocales()) {
    for (const category of vehicleCategories) addCategory(locale, category.id, category.path);
    const carPairs = pairs("car");
    for (const make of new Set(carPairs.map(pair => pair.make))) {
      addCategory(locale, "car", getMakePath(make), make);
      const models = [...new Set([...carPairs.filter(pair => pair.make === make).map(pair => pair.model),
        ...(taxonomy.get("car")?.find(row => row.name === make)?.models.map(row => row.name) ?? [])])];
      for (const model of models) addCategory(locale, "car", getModelPath(make, model), make, model);
    }
    for (const row of inventory.listings) {
      const pathname = withBasePath(localizedPath(locale, getListingPath(row)));
      if (routes.has(pathname)) throw new Error("Duplicate source native listing route");
      const protocol = Object.freeze({ routePattern: "/:locale/listing/:slug",
        renderedPath: localizedPath(locale, getListingPath(row)), params: Object.freeze({ locale, slug: row.slug }) });
      routes.set(pathname, { kind: "listing", inventory, protocol, route: { pathname, listingId: row.id, locale } });
    }
  }
  return { inventory, taxonomy, routes };
}
