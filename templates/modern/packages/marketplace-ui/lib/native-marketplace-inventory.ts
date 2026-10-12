import { publicBasePath } from "@repo/internationalization/paths";
import {
  buildMarketplaceSearchHref,
  createMarketplaceSearchParams,
  parseMarketplaceSearchParams,
  projectPublicDemoMarketplaceListings,
  type MarketplaceSearchParams,
  type NativeMarketplaceInventory,
  type VehicleCategory,
} from "@repo/marketplace";
import { toInventorySearchListing } from "@repo/marketplace/inventory-search";

export interface NativeMarketplaceRoute {
  basePath: string;
  category?: VehicleCategory;
  make?: string;
  model?: string;
  supportsDiscoveryPresentation?: boolean;
}

export const getNativeMarketplaceDesktopVariant = (
  filters: MarketplaceSearchParams,
  route: NativeMarketplaceRoute,
  dealership: boolean
): "discovery" | "results" =>
  dealership || (route.supportsDiscoveryPresentation &&
    createMarketplaceSearchParams({ ...filters, category: "car" }).size === 0)
    ? "discovery" : "results";

const routePath = (route: NativeMarketplaceRoute) =>
  publicBasePath && route.basePath !== publicBasePath &&
  !route.basePath.startsWith(`${publicBasePath}/`)
    ? `${publicBasePath}${route.basePath}`
    : route.basePath;

/** Same native parser and route overrides; original showroom ignores city/radius. */
export const readNativeMarketplaceFilters = (
  href: string,
  route: NativeMarketplaceRoute
): MarketplaceSearchParams | undefined => {
  const url = new URL(href);
  if (url.pathname !== routePath(route)) return;
  return {
    ...parseMarketplaceSearchParams(url.searchParams),
    location: undefined,
    radius: undefined,
    ...(route.category === undefined ? {} : { category: route.category }),
    ...(route.make === undefined ? {} : { make: route.make }),
    ...(route.model === undefined ? {} : { model: route.model }),
  };
};

export const projectNativeMarketplaceView = (
  inventory: NativeMarketplaceInventory,
  filters: MarketplaceSearchParams
) => {
  const projection = projectPublicDemoMarketplaceListings(
    inventory.listings, filters, inventory.pageSize, inventory.identity
  );
  return {
    ...projection,
    // Preserve original demo suggestions: raw category stock, not current result page.
    searchListings: inventory.listings
      .filter((listing) => listing.category === filters.category)
      .map(toInventorySearchListing),
  };
};

/** Native direct-response producer must perform these redirects before composition. */
export const getNativeMarketplaceRedirect = (
  href: string,
  route: NativeMarketplaceRoute,
  inventory: NativeMarketplaceInventory
) => {
  const filters = readNativeMarketplaceFilters(href, route);
  if (!filters) return;
  const url = new URL(href);
  if (url.searchParams.has("location") || url.searchParams.has("radius")) {
    return buildMarketplaceSearchHref(filters, route.basePath);
  }
  const total = projectNativeMarketplaceView(inventory, filters).totalListings;
  const lastPage = Math.max(1, Math.ceil(total / inventory.pageSize));
  return filters.page > lastPage
    ? buildMarketplaceSearchHref({ ...filters, page: lastPage }, route.basePath)
    : undefined;
};
