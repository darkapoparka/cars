"use client";
import { NativeInventoryMetadata } from "./native-inventory-metadata";

import { getMarketplaceMobileQuickFilterItems } from "../lib/native-marketplace-query-policy";
import { NativeMarketplaceQuerySlotsProvider } from "../lib/native-marketplace-query-slots";
import { publicBasePath } from "@repo/internationalization/paths";
import {
  buildMarketplaceSearchHref,
  fallbackVehicleTaxonomy,
  getCategoryPath,
  type ListingViewMode,
  type MarketplaceSearchParams,
  type QuickFilterKey,
  type VehicleCategory,
  type VehicleListing,
  type VehicleTaxonomyMakeOption,
  type NativeMarketplaceInventory,
  projectPublicDemoIdentity,
  projectPublicDemoDestination,
  withSearchParamUpdates,
} from "@repo/marketplace";
import {
  getInventoryLayoutCookieName,
  type PublicInventoryFilterLayout,
} from "@repo/marketplace/inventory-presentation";
import type { InventorySearchListing } from "@repo/marketplace/inventory-search";
import { isDealershipSite, publicSite } from "@repo/marketplace/site-config";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ReactNode,
  type ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { NativeMarketplaceQuerySync } from "./native-marketplace-query-sync";
import { getNativeMarketplaceDesktopVariant, projectNativeMarketplaceView, readNativeMarketplaceFilters, type NativeMarketplaceRoute } from "../lib/native-marketplace-inventory";
import { useMarketplaceOverlayCoordinator } from "../hooks/use-marketplace-overlay-coordinator";
import {
  useMarketplaceListingViewMode,
  useMobileCompactMarketplaceHeader,
} from "../hooks/use-marketplace-shell-state";
import {
  getMarketplaceControlCopy,
  isBulgarianMarketplaceLocale,
} from "../lib/marketplace-control-copy";
import {
  cleanMarketplaceBaseUrl,
  getMarketplaceCurrentPath,
  getMarketplaceMobileDiscoverySummary,
  getMarketplaceQuickFilterLabel,
} from "../lib/marketplace-filter-policy";
import type { MarketplaceModelInventoryCount } from "../lib/model-picker-options";
import { getLocalizedPublicPath } from "../lib/public-path";
import { BottomMarketplaceNav } from "./dealer-bottom-nav";
import { DesktopMarketplaceBar } from "./desktop-discovery-bar";
import type { DesktopFullFilterEntry } from "./desktop-full-filter-dialog";
import { getActiveFilterChips } from "./desktop-marketplace-controls";
import { MarketplaceCategoryPicker } from "./marketplace-category-picker";
import { MarketplaceFullFilterOverlay } from "./marketplace-full-filter-overlay";
import { MarketplaceMakeModelPicker } from "./marketplace-model-picker";
import { MarketplaceQuickFilterDrawer } from "./marketplace-quick-filter-drawer";
import { MarketplaceResults } from "./marketplace-results";
import {
  MobileCompactSearchHeader,
  MobileDealerDiscoveryHeader,
  MobileDealerQuickFilters,
} from "./mobile-dealer-discovery-header";
import { MobileInventorySearch } from "./mobile-inventory-search";

export { DealerBottomNav } from "./dealer-bottom-nav";

interface MarketplaceShellProps {
  appBaseUrl?: string;
  assistantSlot?: ReactNode;
  basePath?: string;
  defaultViewMode?: ListingViewMode;
  desktopDiscoverySlot?: ReactNode;
  desktopSearchVariant?: "discovery" | "results";
  filters: MarketplaceSearchParams;
  initialDesktopFilterLayout?: PublicInventoryFilterLayout;
  inventoryFacets?: {
    categoryCounts?: {
      category: VehicleCategory;
      count: number;
    }[];
    modelCounts: MarketplaceModelInventoryCount[];
    status: "exact";
  };
  listings: VehicleListing[];
  locale?: string;
  searchListings?: readonly InventorySearchListing[];
  taxonomy?: VehicleTaxonomyMakeOption[];
  taxonomyByCategory?: Partial<
    Record<VehicleCategory, VehicleTaxonomyMakeOption[]>
  >;
  totalListings: number;
  nativeInventory?: NativeMarketplaceInventory;
  nativeInitialHref?: string;
  nativeRequestSearch?: string;
  nativeRoute?: NativeMarketplaceRoute;
  nativeFragment?: "controls" | "results" | "navigation" | "overlays";
}

const mobileMarketplaceHeaderClassName =
  "relative z-30 bg-background lg:hidden";


const MarketplaceShellBody = ({
  assistantSlot,
  appBaseUrl,
  basePath,
  desktopSearchVariant: ordinaryDesktopSearchVariant = "discovery",
  desktopDiscoverySlot,
  defaultViewMode = "list",
  filters: initialFilters,
  inventoryFacets: ordinaryInventoryFacets,
  initialDesktopFilterLayout = publicSite.inventory?.desktopFilterLayout ??
    "quick",
  listings: ordinaryListings,
  searchListings: ordinarySearchListings = ordinaryListings,
  locale,
  taxonomy: ordinaryTaxonomy = fallbackVehicleTaxonomy,
  taxonomyByCategory,
  totalListings: ordinaryTotalListings,
  nativeInventory,
  nativeInitialHref,
  nativeRequestSearch,
  nativeRoute,
  nativeFragment,
}: MarketplaceShellProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState(() =>
    nativeInventory && nativeRoute
      ? readNativeMarketplaceFilters(`${nativeInitialHref ?? `https://native-source.invalid${nativeRoute.basePath}`}?${nativeRequestSearch ?? ""}`, nativeRoute) ?? initialFilters
      : initialFilters
  );
  const filtersRef = useRef(filters);
  const [query, setQuery] = useState(filters.q ?? "");
  const nativeView = useMemo(() => nativeInventory ? projectNativeMarketplaceView(nativeInventory, filters) : undefined, [nativeInventory, filters]);
  const listings = nativeView?.listings ?? ordinaryListings;
  const nativeListings = useMemo(() => nativeInventory?.listings
    .map((listing) => projectPublicDemoIdentity(listing, nativeInventory.identity))
    .map((listing) => projectPublicDemoDestination(listing, filters.deliverTo) ?? listing), [nativeInventory, filters.deliverTo]);
  const inventoryFacets = nativeView?.facets ?? ordinaryInventoryFacets;
  const totalListings = nativeView?.totalListings ?? ordinaryTotalListings;
  const searchListings = nativeView?.searchListings ?? ordinarySearchListings;
  const taxonomy = nativeInventory ? taxonomyByCategory?.[filters.category] ?? ordinaryTaxonomy : ordinaryTaxonomy;
  const desktopSearchVariant = nativeInventory && nativeRoute
    ? getNativeMarketplaceDesktopVariant(filters, nativeRoute, isDealershipSite)
    : ordinaryDesktopSearchVariant;
  const [desktopFilterLayout, setDesktopFilterLayout] = useState(
    initialDesktopFilterLayout
  );
  const changeDesktopFilterLayout = async (
    nextLayout: PublicInventoryFilterLayout
  ) => {
    setDesktopFilterLayout(nextLayout);
    try {
      if ("cookieStore" in window) {
        await window.cookieStore.set({
          name: getInventoryLayoutCookieName(publicSite.identity.slug),
          value: nextLayout,
          path: publicBasePath || "/",
          expires: Date.now() + 31_536_000_000,
          sameSite: "lax",
        });
        return;
      }
      // biome-ignore lint/suspicious/noDocumentCookie: Older browsers and non-secure dealer previews need the same bounded preference fallback.
      document.cookie = `${getInventoryLayoutCookieName(publicSite.identity.slug)}=${nextLayout}; Path=${publicBasePath || "/"}; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    } catch {
      // Filtering remains usable when the browser blocks preference storage.
    }
  };
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [makeModelOpen, setMakeModelOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [makeModelInitialStep, setMakeModelInitialStep] = useState<
    "auto" | "make" | "model"
  >("auto");
  const [filterOpen, setFilterOpen] = useState(false);
  const [desktopFilterEntry, setDesktopFilterEntry] =
    useState<DesktopFullFilterEntry>("vehicle");
  const [activeQuickFilter, setActiveQuickFilter] =
    useState<QuickFilterKey | null>(null);
  const [isNavigating, startTransition] = useTransition();
  const [viewMode, changeViewMode] =
    useMarketplaceListingViewMode(defaultViewMode);
  const [mobileCompactHeaderVisible, mobileHeaderSentinelRef] =
    useMobileCompactMarketplaceHeader();

  useEffect(() => {
    if (nativeInventory) return;
    filtersRef.current = initialFilters;
    setFilters(initialFilters);
    setQuery(initialFilters.q ?? "");
  }, [initialFilters, nativeInventory]);

  const currentPath = getMarketplaceCurrentPath({ basePath, locale, pathname });
  const commitFilters = (
    updates: Partial<MarketplaceSearchParams>,
    targetPath = currentPath
  ) => {
    const next = withSearchParamUpdates(filtersRef.current, updates);
    const href = buildMarketplaceSearchHref(next, targetPath);

    filtersRef.current = next;
    setFilters(next);
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  };

  const commitDesktopFilters = (updates: Partial<MarketplaceSearchParams>) => {
    const target = isDealershipSite
      ? getLocalizedPublicPath(
          locale,
          getCategoryPath(updates.category ?? filtersRef.current.category)
        )
      : currentPath;
    commitFilters(updates, target);
  };

  const appUrl = isDealershipSite ? "" : cleanMarketplaceBaseUrl(appBaseUrl);
  const activeFilterChips = useMemo(
    () => getActiveFilterChips(filters, locale),
    [filters, locale]
  );
  const showDealerDesktopLanding =
    Boolean(desktopDiscoverySlot) &&
    isDealershipSite &&
    desktopSearchVariant === "discovery" &&
    filters.category === "car" &&
    filters.sort === "recommended" &&
    filters.page === 1 &&
    activeFilterChips.length === 0;
  const structuredFilterCount = activeFilterChips.filter(
    (chip) => chip.id !== "q"
  ).length;
  const mobileConditionFilterCount = activeFilterChips.filter(
    (chip) =>
      chip.id !== "category" && chip.id !== "make-model" && chip.id !== "q"
  ).length;
  const isBg = isBulgarianMarketplaceLocale(locale);
  const copy = getMarketplaceControlCopy(locale);
  const discoverySummary = getMarketplaceMobileDiscoverySummary(
    filters,
    locale,
    copy.categories[filters.category].label
  );
  const clearFilters = () => {
    const updates = activeFilterChips.reduce<Partial<MarketplaceSearchParams>>(
      (currentUpdates, chip) => Object.assign(currentUpdates, chip.updates),
      {}
    );
    commitDesktopFilters(updates);
  };

  const marketplaceOverlayOpen =
    categoryOpen ||
    makeModelOpen ||
    searchOpen ||
    filterOpen ||
    activeQuickFilter !== null;
  const coordinateMarketplaceOverlay = useMarketplaceOverlayCoordinator(
    marketplaceOverlayOpen
  );
  const openMarketplaceOverlay = (openOverlay: () => void) => {
    coordinateMarketplaceOverlay(() => {
      setCategoryOpen(false);
      setMakeModelOpen(false);
      setSearchOpen(false);
      setFilterOpen(false);
      setActiveQuickFilter(null);
      openOverlay();
    });
  };
  const openDesktopFilterSection = (section: DesktopFullFilterEntry) => {
    openMarketplaceOverlay(() => {
      setDesktopFilterEntry(section);
      setFilterOpen(true);
    });
  };

  const mobileQuickFilterItems = getMarketplaceMobileQuickFilterItems(filters, locale, taxonomy, Boolean(nativeInventory))
    .map(item => ({
      ...item,
      onClick: item.id === "search-query"
        ? () => { setQuery(""); commitFilters({ page: 1, q: undefined }); }
        : item.updates
          ? () => commitFilters({ ...item.updates, page: 1 })
          : () => openMarketplaceOverlay(() => setActiveQuickFilter(item.id as QuickFilterKey)),
    }));

  const content = (
    <>
      <a
        className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-lg bg-foreground px-4 py-3 font-semibold text-background shadow-lg focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        href="#main-content"
      >
        {isBg ? "Към основното съдържание" : "Skip to main content"}
      </a>
      <main
        aria-busy={isNavigating}
        className="min-h-[100dvh] bg-background pb-[calc(5rem+env(safe-area-inset-bottom))] text-foreground lg:pb-0"
        data-slot="marketplace-main"
        data-native-inventory={nativeInventory?.inventorySeal}
        id="main-content"
        tabIndex={-1}
      >
        {isNavigating ? (
          <p aria-live="polite" className="sr-only">
            {isBg ? "Зареждат се обявите…" : "Loading listings…"}
          </p>
        ) : null}

        <div className={mobileMarketplaceHeaderClassName}>
          <MobileDealerDiscoveryHeader
            category={filters.category}
            categoryLabel={copy.categoryDrawer.triggerLabel}
            discoverySummary={discoverySummary}
            filterCount={mobileConditionFilterCount}
            isBg={isBg}
            locale={locale}
            makeModelLabel={getMarketplaceQuickFilterLabel(
              "make-model",
              filters,
              locale
            )}
            onOpenCategory={() =>
              openMarketplaceOverlay(() => setCategoryOpen(true))
            }
            onOpenFilters={() =>
              openMarketplaceOverlay(() => setFilterOpen(true))
            }
            onOpenSearch={() =>
              openMarketplaceOverlay(() => setSearchOpen(true))
            }
            totalListings={totalListings}
          />
          <MobileDealerQuickFilters
            isBg={isBg}
            items={mobileQuickFilterItems}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute h-px w-px lg:hidden"
          ref={mobileHeaderSentinelRef}
        />
        <MobileCompactSearchHeader
          category={filters.category}
          categoryLabel={copy.categoryDrawer.triggerLabel}
          discoverySummary={discoverySummary}
          filterCount={mobileConditionFilterCount}
          isBg={isBg}
          makeModelLabel={getMarketplaceQuickFilterLabel(
            "make-model",
            filters,
            locale
          )}
          onOpenCategory={() =>
            openMarketplaceOverlay(() => setCategoryOpen(true))
          }
          onOpenFilters={() =>
            openMarketplaceOverlay(() => setFilterOpen(true))
          }
          onOpenSearch={() => openMarketplaceOverlay(() => setSearchOpen(true))}
          totalListings={totalListings}
          visible={mobileCompactHeaderVisible}
        />

        <DesktopMarketplaceBar
          appBaseUrl={appUrl}
          assistantSlot={assistantSlot}
          categoryCounts={inventoryFacets?.categoryCounts}
          filterCount={
            isDealershipSite ? activeFilterChips.length : structuredFilterCount
          }
          filters={filters}
          locale={locale}
          onApply={commitDesktopFilters}
          onClearFilters={clearFilters}
          onOpenFilterSection={openDesktopFilterSection}
          onOpenFilters={() =>
            openMarketplaceOverlay(() => setFilterOpen(true))
          }
          onOpenMake={() =>
            openMarketplaceOverlay(() => {
              setMakeModelInitialStep("make");
              setMakeModelOpen(true);
            })
          }
          onOpenModel={() =>
            openMarketplaceOverlay(() => {
              setMakeModelInitialStep("model");
              setMakeModelOpen(true);
            })
          }
          onViewModeChange={changeViewMode}
          query={query}
          searchListings={searchListings}
          setQuery={setQuery}
          showDealerDesktopLanding={showDealerDesktopLanding}
          taxonomy={taxonomy}
          taxonomyByCategory={taxonomyByCategory}
          totalListings={totalListings}
          variant={desktopSearchVariant}
          viewMode={viewMode}
        />

        {showDealerDesktopLanding ? desktopDiscoverySlot : null}

        <MarketplaceResults
          activeFilterCount={activeFilterChips.length}
          appBaseUrl={appUrl}
          currentPath={currentPath}
          desktopFilterLayout={desktopFilterLayout}
          desktopSearchVariant={desktopSearchVariant}
          filters={filters}
          hideDesktop={showDealerDesktopLanding}
          isBg={isBg}
          listings={listings}
          nativeListings={nativeListings}
          locale={locale}
          onApply={commitDesktopFilters}
          onChooseCategory={() =>
            openMarketplaceOverlay(() => setCategoryOpen(true))
          }
          onClearFilters={clearFilters}
          onDesktopFilterLayoutChange={changeDesktopFilterLayout}
          onOpenFilters={() => openDesktopFilterSection("vehicle")}
          onViewModeChange={changeViewMode}
          searchListings={searchListings}
          taxonomy={taxonomy}
          taxonomyByCategory={taxonomyByCategory}
          totalListings={totalListings}
          viewMode={viewMode}
        />

        {marketplaceOverlayOpen ? null : (
          <BottomMarketplaceNav
            appBaseUrl={appUrl}
            filters={filters}
            locale={locale}
          />
        )}

        <MarketplaceCategoryPicker
          filters={filters}
          locale={locale}
          onOpenChange={setCategoryOpen}
          open={categoryOpen}
        />
        <MarketplaceMakeModelPicker
          filters={filters}
          initialStep={makeModelInitialStep}
          locale={locale}
          modelCounts={
            inventoryFacets?.status === "exact"
              ? inventoryFacets.modelCounts
              : undefined
          }
          onApply={commitFilters}
          onDesktopApply={commitDesktopFilters}
          onOpenChange={setMakeModelOpen}
          open={makeModelOpen}
          taxonomy={taxonomy}
        />
        <MobileInventorySearch
          isBg={isBg}
          listings={searchListings}
          locale={locale}
          onOpenChange={setSearchOpen}
          onSearch={(nextQuery) => {
            setQuery(nextQuery);
            commitFilters({ page: 1, q: nextQuery });
          }}
          onSelectMake={(make) => {
            setQuery("");
            commitFilters({
              derivative: undefined,
              make,
              model: undefined,
              page: 1,
              q: undefined,
            });
          }}
          onSelectModel={(make, model) => {
            setQuery("");
            commitFilters({
              derivative: undefined,
              make,
              model,
              page: 1,
              q: undefined,
            });
          }}
          open={searchOpen}
          query={query}
        />
        <MarketplaceFullFilterOverlay
          filters={filters}
          initialDesktopEntry={desktopFilterEntry}
          locale={locale}
          modelCounts={
            inventoryFacets?.status === "exact"
              ? inventoryFacets.modelCounts
              : undefined
          }
          onApply={commitDesktopFilters}
          onDesktopApply={commitDesktopFilters}
          onOpenChange={setFilterOpen}
          open={filterOpen}
          taxonomy={taxonomy}
          taxonomyByCategory={taxonomyByCategory}
        />
        <MarketplaceQuickFilterDrawer
          activeFilter={activeQuickFilter}
          filters={filters}
          locale={locale}
          onApply={commitFilters}
          onClose={() => setActiveQuickFilter(null)}
        />
      </main>
    </>
  );
  if (!nativeInventory) return content;
  if (!nativeRoute) throw new Error("Native marketplace inventory requires an exact route binding");
  if (nativeFragment) {
    // Select the actual React-authored children; no HTML or RSC is generated here.
    // Independent fragment roots need an admitted stable-ID/same-root capture contract.
    const main = content.props.children[1] as ReactElement<{ children: ReactNode[] }>;
    const children = main.props.children;
    const parts = { controls: children.slice(1, 5), results: children.slice(5, 7), navigation: children.slice(7, 8), overlays: children.slice(8) };
    return <NativeMarketplaceQuerySlotsProvider>{parts[nativeFragment]}</NativeMarketplaceQuerySlotsProvider>;
  }
  return (
    <NativeMarketplaceQuerySlotsProvider>
      <NativeInventoryMetadata initialHref={nativeInitialHref ?? `https://native-source.invalid${nativeRoute.basePath}`} />
      <NativeMarketplaceQuerySync
        route={nativeRoute}
        inventory={nativeInventory}
        onChange={(next) => {
          if (JSON.stringify(filtersRef.current) === JSON.stringify(next)) return;
          filtersRef.current = next;
          setFilters(next);
          setQuery(next.q ?? "");
          setCategoryOpen(false);
          setMakeModelOpen(false);
          setSearchOpen(false);
          setFilterOpen(false);
          setActiveQuickFilter(null);
        }}
      />
      {content}
    </NativeMarketplaceQuerySlotsProvider>
  );
};

/** Native producer entry; render inside the same compiled graph/root as hydration. */
export const NativeMarketplaceShellFragment = (props: MarketplaceShellProps & { nativeInventory: NativeMarketplaceInventory; nativeRoute: NativeMarketplaceRoute; nativeFragment: NonNullable<MarketplaceShellProps["nativeFragment"]> }) => <MarketplaceShell {...props} />;
export type { NativeMarketplaceRoute } from "../lib/native-marketplace-inventory";

const NativeMarketplaceShellRequest = (props: MarketplaceShellProps) => {
  const search = useSearchParams();
  return <MarketplaceShellBody {...props} nativeRequestSearch={search.toString()} />;
};
export const MarketplaceShell = (props: MarketplaceShellProps) => props.nativeInventory
  ? <NativeMarketplaceShellRequest {...props} /> : <MarketplaceShellBody {...props} />;
