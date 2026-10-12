import {
  buildMarketplaceSearchHref,
  getCategoryPath,
  getListingPath,
  getRelatedListingsFromInventory,
  parseMarketplaceSearchParams,
  projectPublicDemoDestination,
  projectPublicDemoIdentity,
  type NativeMarketplaceInventory,
} from "@repo/marketplace";
import { getLocalizedPublicPath } from "./public-path";

export interface NativeListingRoute {
  pathname: string;
  listingId: string;
  locale: string;
}

/** Shares the original related ranking, raw-stock country predicate, identity
 * projection and URL builder. This is not a second listing/search engine. */
export function projectNativeListingQuery(
  href: string,
  inventory: NativeMarketplaceInventory,
  route: NativeListingRoute
) {
  const url = new URL(href);
  if (url.pathname !== route.pathname) return;
  const raw = inventory.listings.find(row => row.id === route.listingId);
  if (!raw) return;
  // Supplier detail prices/availability have additional native render branches.
  // The producer must qualify them before broadening this source admission.
  if (raw.supply) return;
  const destinationCountryCode = parseMarketplaceSearchParams(url.searchParams).deliverTo;
  const listing = projectPublicDemoDestination(
    projectPublicDemoIdentity(raw, inventory.identity), destinationCountryCode
  );
  if (!listing) return;
  const rawRelated = getRelatedListingsFromInventory(inventory.listings, listing);
  if (rawRelated.some(row => row.supply)) return;
  const visible = rawRelated.filter(row =>
    !destinationCountryCode || row.supply?.delivery.eligibleCountryCodes.includes(destinationCountryCode) ||
      (destinationCountryCode === "BG" && row.location.country === "Bulgaria")
  );
  const visibleIds = new Set(visible.map(row => row.id));
  const cards = rawRelated.map(row => ({
    listing: projectPublicDemoDestination(projectPublicDemoIdentity(row, inventory.identity), destinationCountryCode) ?? row,
    hidden: !visibleIds.has(row.id),
    priority: false,
    loading: "lazy",
    href: buildMarketplaceSearchHref({ deliverTo: destinationCountryCode },
      getLocalizedPublicPath(route.locale, getListingPath(row))),
  }));
  const rawSearchParams: Record<string, string | string[]> = {};
  for (const key of new Set(url.searchParams.keys())) {
    const values = url.searchParams.getAll(key);
    Object.defineProperty(rawSearchParams, key, { value: values.length === 1 ? values[0] : values,
      enumerable: true, configurable: true });
  }
  return {
    pathname: url.pathname,
    inventorySeal: inventory.inventorySeal,
    listing,
    destinationCountryCode,
    rawSearchParams,
    backHref: buildMarketplaceSearchHref({ category: listing.category, deliverTo: destinationCountryCode },
      getLocalizedPublicPath(route.locale, getCategoryPath(listing.category))),
    related: { hidden: visible.length === 0, visibleIds: visible.map(row => row.id) },
    cards,
    // Existing data-only slot interpreter families remain valid for detail rows.
    controls: { chips: [], mobileQuickFilterItems: [] },
    pagination: { slots: [] },
  };
}

export type NativeListingQuery = NonNullable<ReturnType<typeof projectNativeListingQuery>>;
