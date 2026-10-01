"use client";

import type {
  ListingViewMode,
  MarketplaceSearchParams,
  VehicleTaxonomyMakeOption,
} from "@repo/marketplace";
import type { InventorySearchListing } from "@repo/marketplace/inventory-search";
import type { ReactNode } from "react";
import { formatVehicleCount } from "../lib/marketplace-results-toolbar-policy";
import styles from "./dealer-desktop-toolbar.module.css";
import { DealerHeroSearch } from "./dealer-hero-search";
export interface DealerDesktopToolbarProps {
  assistantSlot?: ReactNode;
  filters: MarketplaceSearchParams;
  locale?: string;
  onViewModeChange?: (mode: ListingViewMode) => void;
  searchListings?: readonly InventorySearchListing[];
  taxonomy?: VehicleTaxonomyMakeOption[];
  totalListings?: number;
  viewMode?: ListingViewMode;
}

export const DealerDesktopToolbar = ({
  assistantSlot,
  searchListings,
  filters,
  locale,
  taxonomy,
  totalListings,
}: DealerDesktopToolbarProps) => {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  return (
    <div className={styles.toolbar} data-slot="dealer-desktop-inventory-hero">
      <div className={styles.content}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>
              {isBg ? "Разгледайте каталога" : "Explore the collection"}
            </p>
            <h1 id="desktop-inventory-title">
              {isBg ? "Автомобили в наличност" : "Vehicles in stock"}
            </h1>
          </div>
          {totalListings !== undefined ? (
            <p className={styles.count}>
              {formatVehicleCount(totalListings, filters.category, locale)}
            </p>
          ) : null}
        </div>
        <DealerHeroSearch
          assistantSlot={assistantSlot}
          filters={filters}
          key={JSON.stringify(filters)}
          locale={locale}
          searchListings={searchListings}
          taxonomy={taxonomy}
        />
      </div>
    </div>
  );
};
