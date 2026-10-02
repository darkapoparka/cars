"use client";

import type {
  ListingViewMode,
  MarketplaceSearchParams,
  VehicleTaxonomyMakeOption,
} from "@repo/marketplace";
import type { InventorySearchListing } from "@repo/marketplace/inventory-search";
import type { ReactNode } from "react";
import { getMarketplaceResultTitle } from "../lib/marketplace-results-toolbar-policy";
import { DealerDesktopHero } from "./dealer-desktop-hero";
import styles from "./dealer-desktop-toolbar.module.css";
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
  filters,
  locale,
}: DealerDesktopToolbarProps) => {
  return (
    <div className={styles.toolbar} data-slot="dealer-desktop-inventory-hero">
      <DealerDesktopHero
        description={
          locale?.startsWith("bg")
            ? "Намерете следващия си автомобил. Разгледайте наличностите и сравнете детайлите."
            : "Find your next car. Browse our inventory and compare the details."
        }
        locale={locale}
        title={getMarketplaceResultTitle(filters, locale)}
        variant="inventory"
      />
    </div>
  );
};
