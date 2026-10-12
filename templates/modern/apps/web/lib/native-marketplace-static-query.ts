import {
  buildMarketplaceSearchHref,
  getListingPath,
  projectPublicDemoDestination,
  projectPublicDemoIdentity,
  type NativeMarketplaceInventory,
  type VehicleTaxonomyMakeOption,
} from "@repo/marketplace";
import {
  getNativeMarketplaceDesktopVariant,
  getNativeMarketplaceRedirect,
  projectNativeMarketplaceView,
  readNativeMarketplaceFilters,
  type NativeMarketplaceRoute,
} from "../../../packages/marketplace-ui/lib/native-marketplace-inventory";
import { getNativeMarketplaceResultSlots } from "../../../packages/marketplace-ui/lib/native-marketplace-result-slots";
import { getNativeMarketplaceQueryBindings } from "../../../packages/marketplace-ui/lib/native-marketplace-query-policy";
import { getNativeMarketplacePaginationSlots } from "../../../packages/marketplace-ui/lib/marketplace-pagination-policy";
import { getMarketplaceListingGridClassName } from "../../../packages/marketplace-ui/lib/marketplace-results-policy";
import { getMarketplacePriorityListingCount, getNativeMarketplaceCardDeliveryLabel } from "../../../packages/marketplace-ui/lib/native-marketplace-card-policy";
import { getLocalizedPublicPath } from "../../../packages/marketplace-ui/lib/public-path";
import { createNativeMarketplaceCategoryMetadata } from "./native-marketplace-metadata";

export const nativeQueryAbi = 1;
export interface NativeStaticQueryContext {
  inventory: NativeMarketplaceInventory;
  route: NativeMarketplaceRoute;
  categoryPath: string;
  locale: string;
  taxonomy: readonly VehicleTaxonomyMakeOption[];
  dealership: boolean;
  viewMode: "list" | "grid";
}

/** Emit this data-only entry separately; no vinext/React server entry may precede it. */
export const evaluateNativeMarketplaceStaticQuery = (href: string, context: NativeStaticQueryContext) => {
  const { inventory, route, categoryPath, locale, taxonomy, dealership, viewMode } = context;
  const filters = readNativeMarketplaceFilters(href, route);
  if (!filters) return;
  const url = new URL(href);
  const redirect = getNativeMarketplaceRedirect(href, route, inventory);
  const projected = projectNativeMarketplaceView(inventory, filters);
  const rawSearchParams: Record<string, string | string[]> = {};
  for (const key of new Set(url.searchParams.keys())) {
    const values = url.searchParams.getAll(key);
    Object.defineProperty(rawSearchParams, key, { value: values.length === 1 ? values[0] : values, enumerable: true, configurable: true });
  }
  const metadata = createNativeMarketplaceCategoryMetadata({ category: filters.category, locale, make: route.make, model: route.model, path: categoryPath, searchParams: rawSearchParams });
  const full = inventory.listings.map(listing => projectPublicDemoIdentity(listing, inventory.identity)).map(listing => projectPublicDemoDestination(listing, filters.deliverTo) ?? listing);
  const rows = getNativeMarketplaceResultSlots(projected.listings, full);
  const totalPages = Math.ceil(projected.totalListings / inventory.pageSize);
  const currentPage = Math.min(Math.max(filters.page, 1), totalPages);
  const desktopVariant = getNativeMarketplaceDesktopVariant(filters, route, dealership);
  const priorityCount = getMarketplacePriorityListingCount(desktopVariant === "discovery" && viewMode === "grid", viewMode === "grid" && projected.listings.length >= 4);
  return {
    pathname: url.pathname,
    inventorySeal: inventory.inventorySeal,
    filters,
    rawSearchParams,
    redirect,
    metadata,
    projected,
    controls: getNativeMarketplaceQueryBindings(filters, projected.totalListings, locale, taxonomy, projected.searchListings),
    layout: { gridHidden: projected.listings.length === 0, emptyHidden: projected.listings.length > 0, gridClass: getMarketplaceListingGridClassName({ listingCount: projected.listings.length, useDiscoveryInventoryGrid: desktopVariant === "discovery" && viewMode === "grid", useWideInventoryGrid: viewMode === "grid" && projected.listings.length >= 4, viewMode }) },
    cards: rows.map(row => ({ ...row,
      href: buildMarketplaceSearchHref({ deliverTo: filters.deliverTo }, getLocalizedPublicPath(locale, getListingPath(row.listing))),
      deliveryLabel: getNativeMarketplaceCardDeliveryLabel(row.listing, locale),
      priority: !row.hidden && row.visibleIndex < priorityCount,
      loading: !row.hidden && row.visibleIndex < priorityCount ? "eager" : "lazy",
    })),
    emptyAction: { filtered: getNativeMarketplaceQueryBindings(filters, projected.totalListings, locale, taxonomy, projected.searchListings).filterCount > 0, href: buildMarketplaceSearchHref({ category: filters.category, page: 1, sort: "recommended" }, route.basePath) },
    pagination: { totalPages, currentPage,
      hidden: totalPages <= 1,
      previous: { hidden: currentPage <= 1, href: buildMarketplaceSearchHref({ ...filters, page: Math.max(1, currentPage - 1) }, route.basePath) },
      next: { hidden: currentPage >= totalPages, href: buildMarketplaceSearchHref({ ...filters, page: Math.max(1, Math.min(totalPages, currentPage + 1)) }, route.basePath) },
      slots: getNativeMarketplacePaginationSlots(currentPage, totalPages, Math.ceil(inventory.listings.length / inventory.pageSize)).map(row => ({ ...row, current: row.page === currentPage, href: buildMarketplaceSearchHref({ ...filters, page: row.page }, route.basePath) })),
    },
  };
};
