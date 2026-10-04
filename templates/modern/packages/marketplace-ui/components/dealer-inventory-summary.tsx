import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import {
  filterLabels,
  type ListingViewMode,
  type MarketplaceSearchParams,
  sortOptions,
} from "@repo/marketplace";
import type { ReactNode } from "react";
import { marketplaceSortLabelsBg } from "../lib/marketplace-filter-config";
import {
  formatVehicleCount,
  getMarketplaceResultTitle,
} from "../lib/marketplace-results-toolbar-policy";
import styles from "./dealer-inventory.module.css";
import { MarketplaceViewModeToggle } from "./desktop-marketplace-controls";

/** Desktop catalogue controls share the same search and results on Home. */
export function DealerInventorySummary({
  children,
  filters,
  locale,
  totalListings,
  viewMode,
  onApply,
  onViewModeChange,
}: {
  children?: ReactNode;
  filters: MarketplaceSearchParams;
  locale?: string;
  totalListings: number;
  viewMode: ListingViewMode;
  onApply: (updates: Partial<MarketplaceSearchParams>) => void;
  onViewModeChange: (mode: ListingViewMode) => void;
}) {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const selectedSort = filters.sort ?? "recommended";
  return (
    <div className={styles.summary} data-slot="dealer-inventory-summary">
      <div className={styles.heading}>
        <h2>{getMarketplaceResultTitle(filters, locale)}</h2>
        <output aria-live="polite" data-slot="dealer-inventory-count">
          {formatVehicleCount(totalListings, filters.category, locale)}
        </output>
      </div>
      {children}
      <div className={styles.controls} data-slot="desktop-results-controls">
        <Select
          onValueChange={(sort) =>
            onApply({ sort: sort as MarketplaceSearchParams["sort"] })
          }
          value={selectedSort}
        >
          <SelectTrigger
            aria-label={isBg ? "Подреждане" : "Sort order"}
            className={styles.sort}
          >
            <span className={styles.sortLabel}>
              {isBg ? "Подреди:" : "Sort:"}
            </span>
            <SelectValue>
              {isBg
                ? marketplaceSortLabelsBg[selectedSort]
                : filterLabels.sort[selectedSort]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end" className={styles.sortMenu} sideOffset={6}>
            {sortOptions.map((sort) => (
              <SelectItem className={styles.sortOption} key={sort} value={sort}>
                {isBg ? marketplaceSortLabelsBg[sort] : filterLabels.sort[sort]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <MarketplaceViewModeToggle
        className={styles.viewToggle}
        locale={locale}
        onViewModeChange={onViewModeChange}
        viewMode={viewMode}
      />
    </div>
  );
}
