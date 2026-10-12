"use client";

import { cn } from "@repo/design-system/lib/utils";
import {
  buildMarketplaceSearchHref,
  getListingPath,
  type ListingViewMode,
  type MarketplaceSearchParams,
  type VehicleListing,
  type VehicleTaxonomyMakeOption,
} from "@repo/marketplace";
import type { PublicInventoryFilterLayout } from "@repo/marketplace/inventory-presentation";
import type { InventorySearchListing } from "@repo/marketplace/inventory-search";
import { isDealershipSite } from "@repo/marketplace/site-config";
import { useEffect } from "react";
import { getAccountListingSaveFlowHref } from "../lib/account-save-flow";
import { takeInventoryReturnScrollY } from "../lib/inventory-return";
import {
  getMarketplaceListingGridClassName,
  getMarketplaceResultsSectionClassName,
  shouldHideDesktopResultSummary,
} from "../lib/marketplace-results-policy";
import { getLocalizedPublicPath } from "../lib/public-path";
import { DealerHeroSearch } from "./dealer-hero-search";
import dealerStyles from "./dealer-inventory.module.css";
import { DealerInventoryFilters } from "./dealer-inventory-filters";
import { ResultToolbar } from "./desktop-marketplace-controls";
import { MarketplacePagination } from "./marketplace-pagination";
import { MarketplaceResultsEmptyState } from "./marketplace-results-empty-state";
import { VehicleCard } from "./vehicle-card";
import { getMarketplacePriorityListingCount } from "../lib/native-marketplace-card-policy";
import { getNativeMarketplaceResultSlots } from "../lib/native-marketplace-result-slots";

// Dealer grid: frame gutters, panel padding, sidebar, grid gaps and card borders.
const dealerImageSizes = {
  sidebar:
    "(max-width: 1279px) calc((100vw - 412px) / 2), (max-width: 1494px) calc((100vw - 470px) / 3), 337px",
  quick:
    "(max-width: 1199px) calc((100vw - 166px) / 3), (max-width: 1399px) calc((100vw - 184px) / 4), (max-width: 1494px) calc((100vw - 202px) / 5), 256px",
  list: "272px",
} as const;

export const MarketplaceResults = ({
  activeFilterCount,
  appBaseUrl,
  currentPath,
  desktopSearchVariant,
  desktopFilterLayout,
  filters,
  hideDesktop = false,
  isBg,
  listings,
  nativeListings,
  locale,
  searchListings,
  taxonomy,
  taxonomyByCategory,
  onChooseCategory,
  onApply,
  onClearFilters,
  onDesktopFilterLayoutChange,
  onOpenFilters,
  onViewModeChange,
  totalListings,
  viewMode,
}: {
  activeFilterCount: number;
  appBaseUrl: string;
  currentPath: string;
  desktopSearchVariant: "discovery" | "results";
  desktopFilterLayout: PublicInventoryFilterLayout;
  filters: MarketplaceSearchParams;
  hideDesktop?: boolean;
  isBg: boolean;
  listings: VehicleListing[];
  nativeListings?: readonly VehicleListing[];
  locale?: string;
  searchListings?: readonly InventorySearchListing[];
  taxonomy?: VehicleTaxonomyMakeOption[];
  taxonomyByCategory?: Partial<
    Record<MarketplaceSearchParams["category"], VehicleTaxonomyMakeOption[]>
  >;
  onChooseCategory: () => void;
  onApply: (updates: Partial<MarketplaceSearchParams>) => void;
  onClearFilters: () => void;
  onDesktopFilterLayoutChange: (layout: PublicInventoryFilterLayout) => void;
  onOpenFilters: () => void;
  onViewModeChange: (viewMode: ListingViewMode) => void;
  totalListings: number;
  viewMode: ListingViewMode;
}) => {
  const useWideInventoryGrid = viewMode === "grid" && listings.length >= 4;
  const slotRows = getNativeMarketplaceResultSlots(listings, nativeListings);
  const singularLabel = isBg ? "автомобил" : "vehicle";
  const pluralLabel = isBg ? "автомобила" : "vehicles";
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const scrollY = takeInventoryReturnScrollY();
      if (scrollY !== null) {
        window.scrollTo(0, scrollY);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const useDiscoveryInventoryGrid =
    desktopSearchVariant === "discovery" && viewMode === "grid";
  const regularPresentation = useDiscoveryInventoryGrid
    ? "discovery"
    : "default";
  const priorityListingCount =
    getMarketplacePriorityListingCount(useDiscoveryInventoryGrid, useWideInventoryGrid);

  return (
    <section
      className={cn(
        getMarketplaceResultsSectionClassName(desktopSearchVariant),
        isDealershipSite && dealerStyles.results,
        hideDesktop && "lg:hidden"
      )}
      data-native-query-scope={nativeListings ? "results" : undefined}
      data-desktop-hidden={hideDesktop}
      data-filter-layout={isDealershipSite ? desktopFilterLayout : undefined}
      data-slot={isDealershipSite ? "dealer-inventory-panel" : undefined}
    >
      {isDealershipSite && !hideDesktop ? (
        <DealerInventoryFilters
          filters={filters}
          layout={desktopFilterLayout}
          locale={locale}
          onApply={onApply}
          onClearFilters={onClearFilters}
          onLayoutChange={onDesktopFilterLayoutChange}
          onViewModeChange={onViewModeChange}
          totalListings={totalListings}
          viewMode={viewMode}
        />
      ) : null}
      {isDealershipSite && !hideDesktop && (
        <aside
          className={dealerStyles.sidebar}
          data-slot="dealer-inventory-sidebar"
          hidden={desktopFilterLayout !== "sidebar"}
        >
          <DealerHeroSearch
            compact
            filters={filters}
            key={JSON.stringify(filters)}
            locale={locale}
            searchListings={searchListings}
            taxonomy={taxonomy}
            taxonomyByCategory={taxonomyByCategory}
          />
        </aside>
      )}
      <div className="min-w-0">
        <p
          data-native-query-slot={nativeListings ? "results-mobile-count" : undefined}
          aria-live="polite"
          className={cn(
            "mb-2 text-micro text-muted-foreground tabular-nums lg:hidden",
            activeFilterCount === 0 && "sr-only"
          )}
        >
          {nativeListings ? `${totalListings} ${totalListings === 1 ? singularLabel : pluralLabel}` : [totalListings, " ", totalListings === 1 ? singularLabel : pluralLabel]}
        </p>
        <div className={isDealershipSite ? "lg:hidden" : undefined}>
          <ResultToolbar
            filters={filters}
            hideDesktopSummary={shouldHideDesktopResultSummary(
              desktopSearchVariant
            )}
            locale={locale}
            onOpenFilters={onOpenFilters}
            onViewModeChange={onViewModeChange}
            totalListings={totalListings}
            viewMode={viewMode}
          />
        </div>
        {listings.length > 0 || nativeListings ? (
          <>
            <div
              className={cn(
                "grid items-start gap-2 lg:gap-4",
                isDealershipSite && dealerStyles.grid,
                getMarketplaceListingGridClassName({
                  listingCount: listings.length,
                  useDiscoveryInventoryGrid,
                  useWideInventoryGrid,
                  viewMode,
                })
              )}
              data-slot="marketplace-listing-grid"
              data-native-result-grid={nativeListings ? "stable" : undefined}
              hidden={nativeListings && listings.length === 0 ? true : undefined}
              style={nativeListings && listings.length === 0 ? { display: "none" } : undefined}
              data-view={viewMode}
            >
              {slotRows.map(({ listing, hidden, visibleIndex }) => (
                <VehicleCard
                  compactDesktopGrid={isDealershipSite}
                  density="compact"
                  desktopImageSizes={
                    isDealershipSite
                      ? dealerImageSizes[
                          viewMode === "list" ? "list" : desktopFilterLayout
                        ]
                      : undefined
                  }
                  desktopLayout={viewMode}
                  href={buildMarketplaceSearchHref(
                    { deliverTo: filters.deliverTo },
                    getLocalizedPublicPath(locale, getListingPath(listing))
                  )}
                  key={listing.id}
                  listing={listing}
                  nativeInventorySlot={nativeListings ? { id: listing.id, hidden } : undefined}
                  locale={locale}
                  presentation={
                    isDealershipSite ? "showroom" : regularPresentation
                  }
                  priority={!hidden && visibleIndex < priorityListingCount}
                  saveHref={getAccountListingSaveFlowHref(appBaseUrl, listing)}
                  viewMode={viewMode}
                />
              ))}
            </div>
            {nativeListings ? (
              <div data-native-result-empty="stable" hidden={listings.length > 0} style={listings.length > 0 ? { display: "none" } : undefined}>
                <MarketplaceResultsEmptyState
                  nativeQuerySlots={Boolean(nativeListings)}
                  currentPath={currentPath}
                  filtered={activeFilterCount > 0}
                  filters={filters}
                  isBg={isBg}
                  onChooseCategory={onChooseCategory}
                />
              </div>
            ) : null}
            <MarketplacePagination
              nativeSlotTotalListings={nativeListings?.length}
              basePath={currentPath}
              filters={filters}
              locale={locale}
              totalListings={totalListings}
            />
          </>
        ) : (
          <MarketplaceResultsEmptyState
                  nativeQuerySlots={Boolean(nativeListings)}
            currentPath={currentPath}
            filtered={activeFilterCount > 0}
            filters={filters}
            isBg={isBg}
            onChooseCategory={onChooseCategory}
          />
        )}
      </div>
    </section>
  );
};
