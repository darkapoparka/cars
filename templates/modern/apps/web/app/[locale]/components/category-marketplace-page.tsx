import { getNativeMarketplaceRedirect } from "../../../../../packages/marketplace-ui/lib/native-marketplace-inventory";
import { createNativeInitialHref, getNativeCompositionInventory } from "@/lib/native-composition-mode";
import {
  buildMarketplaceSearchHref,
  createMarketplaceSearchParams,
  getVehicleCategory,
  parseMarketplaceSearchParams,
  type VehicleCategory,
  type NativeMarketplaceInventory,
} from "@repo/marketplace";
import {
  getInventoryLayoutCookieName,
  resolveInventoryFilterLayout,
} from "@repo/marketplace/inventory-presentation";
import { isDealershipSite, publicSite } from "@repo/marketplace/site-config";
import { MarketplaceShell } from "@repo/marketplace-ui";
import { log } from "@repo/observability/log";
import { getLocalizedPath, normalizeSeoLocale } from "@repo/seo/metadata";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { getPublicAppBaseUrl } from "@/lib/public-app-url";
import { getPublicInventorySearchListings } from "@/lib/public-inventory-search";
import {
  getPublicMarketplaceListings,
  getPublicVehicleTaxonomies,
  normalizePublicShowroomFilters,
  PUBLIC_LISTING_PAGE_SIZE,
  getPublicNativeMarketplaceInventory,
} from "@/lib/public-marketplace-data";
import { getMarketplacePageRedirect } from "@/lib/public-marketplace-pagination";
import { requirePublicSitePath } from "@/lib/public-site-access";
import { AssistedSearchPanel } from "./assisted-search-panel";
import { Footer } from "./footer";
import { InventoryUnavailable } from "./inventory-states";
import { PublicMarketplaceFrame } from "./public-marketplace-frame";

interface CategoryMarketplacePageProps {
  category: VehicleCategory;
  locale: string;
  make?: string;
  model?: string;
  routePath?: string;
  nativeInventory?: NativeMarketplaceInventory;
  nativeInitialHref?: string;
  nativeFragment?: "controls" | "results" | "navigation" | "overlays";
  searchParams: Record<string, string | string[] | undefined>;
}

const OriginalCategoryMarketplacePage = async ({
  category,
  locale,
  make,
  model,
  routePath,
  searchParams,
  nativeInventory,
  nativeInitialHref,
  nativeFragment,
}: CategoryMarketplacePageProps) => {
  const normalizedLocale = normalizeSeoLocale(locale);
  const categoryPath = routePath ?? getVehicleCategory(category).path;
  requirePublicSitePath(categoryPath);
  const basePath = getLocalizedPath(normalizedLocale, categoryPath);
  const parsed = normalizePublicShowroomFilters(
    parseMarketplaceSearchParams(searchParams)
  );
  const filters = {
    ...parsed,
    category,
    ...(make === undefined ? {} : { make }),
    ...(model === undefined ? {} : { model }),
  };
  if (
    searchParams.location !== undefined ||
    searchParams.radius !== undefined
  ) {
    redirect(buildMarketplaceSearchHref(filters, basePath));
  }
  const hasRouteSearchCriteria =
    createMarketplaceSearchParams({ ...parsed, category: "car" }).size > 0;
  const supportsDiscoveryPresentation =
    isDealershipSite ||
    ((category === "car" || category === "lease") &&
      make === undefined &&
      model === undefined);
  const desktopSearchVariant =
    isDealershipSite ||
    (supportsDiscoveryPresentation && !hasRouteSearchCriteria)
      ? "discovery"
      : "results";

  try {
    const [
      { facets, listings, totalListings },
      taxonomyByCategory,
      cookieStore,
    ] = await Promise.all([
      getPublicMarketplaceListings(filters),
      getPublicVehicleTaxonomies(),
      cookies(),
    ]);
    const pageRedirect = getMarketplacePageRedirect({
      basePath,
      filters,
      pageSize: PUBLIC_LISTING_PAGE_SIZE,
      totalListings,
    });
    if (pageRedirect) {
      redirect(pageRedirect);
    }

    return (
      <>
        <MarketplaceShell
          appBaseUrl={getPublicAppBaseUrl()}
          assistantSlot={
            <AssistedSearchPanel
              basePath={basePath}
              category={category}
              locale={normalizedLocale}
            />
          }
          basePath={basePath}
          defaultViewMode={supportsDiscoveryPresentation ? "grid" : undefined}
          desktopSearchVariant={desktopSearchVariant}
          filters={filters}
          initialDesktopFilterLayout={resolveInventoryFilterLayout(
            cookieStore.get(
              getInventoryLayoutCookieName(publicSite.identity.slug)
            )?.value,
            publicSite.inventory?.desktopFilterLayout ?? "quick"
          )}
          nativeInventory={nativeInventory}
          nativeInitialHref={nativeInitialHref}
          nativeRoute={nativeInventory ? { basePath, category, make, model, supportsDiscoveryPresentation } : undefined}
          nativeFragment={nativeFragment}
          inventoryFacets={facets}
          listings={listings}
          locale={normalizedLocale}
          searchListings={getPublicInventorySearchListings(
            filters.category,
            listings
          )}
          taxonomy={taxonomyByCategory[category]}
          taxonomyByCategory={taxonomyByCategory}
          totalListings={totalListings}
        />
        {nativeFragment ? null : <Footer locale={normalizedLocale} />}
      </>
    );
  } catch (error) {
    unstable_rethrow(error);
    log.error(`Public category route failed for ${categoryPath}.`, { error });
    return (
      <PublicMarketplaceFrame
        activeMode={category === "lease" ? "lease" : "buy"}
        locale={normalizedLocale}
      >
        <InventoryUnavailable locale={normalizedLocale} />
      </PublicMarketplaceFrame>
    );
  }
};

/** Explicit same-graph producer entry; ordinary route exports remain unchanged. */
export const NativeCategoryMarketplacePage = (props: CategoryMarketplacePageProps & { inventorySeal: string }) =>
  CategoryMarketplacePage({ ...props, nativeInventory: getPublicNativeMarketplaceInventory(props.inventorySeal) });

/** Provider-only native route consumer binding, including existing make/model callers. */
export const CategoryMarketplacePage = (props: CategoryMarketplacePageProps) => {
  const inventory = props.nativeInventory ?? getNativeCompositionInventory();
  const basePath = getLocalizedPath(normalizeSeoLocale(props.locale), props.routePath ?? getVehicleCategory(props.category).path);
  if (inventory) {
    const supportsDiscoveryPresentation = isDealershipSite || ((props.category === "car" || props.category === "lease") && props.make === undefined && props.model === undefined);
    const target = getNativeMarketplaceRedirect(createNativeInitialHref(basePath, props.searchParams), { basePath, category: props.category, make: props.make, model: props.model, supportsDiscoveryPresentation }, inventory);
    if (target) redirect(target);
  }
  return OriginalCategoryMarketplacePage({ ...props, nativeInventory: inventory,
    searchParams: inventory ? {} : props.searchParams,
    nativeInitialHref: inventory ? createNativeInitialHref(basePath, {}) : undefined });
};
