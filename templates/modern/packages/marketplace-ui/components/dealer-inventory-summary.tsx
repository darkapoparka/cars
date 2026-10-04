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
import { SlidersHorizontal } from "lucide-react";
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
  filterCount,
  filters,
  locale,
  totalListings,
  viewMode,
  onApply,
  onOpenFilters,
  onViewModeChange,
}: {
  children?: ReactNode;
  filterCount: number;
  filters: MarketplaceSearchParams;
  locale?: string;
  totalListings: number;
  viewMode: ListingViewMode;
  onApply: (updates: Partial<MarketplaceSearchParams>) => void;
  onOpenFilters: () => void;
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
      <div className={styles.controls} data-slot="desktop-results-controls">
        <button
          aria-haspopup="dialog"
          className={styles.filters}
          data-slot="desktop-primary-control"
          onClick={(event) => {
            // Safari needs an explicit focus target for dialog dismissal.
            event.currentTarget.focus({ preventScroll: true });
            onOpenFilters();
          }}
          type="button"
        >
          <SlidersHorizontal aria-hidden="true" size={18} />
          <span>{isBg ? "Филтри" : "Filters"}</span>
          {filterCount > 0 ? (
            <span className={styles.filterBadge}>{filterCount}</span>
          ) : null}
        </button>
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
      <div className={styles.displayControls}>
        <MarketplaceViewModeToggle
          className={styles.viewToggle}
          locale={locale}
          onViewModeChange={onViewModeChange}
          viewMode={viewMode}
        />
        {children}
      </div>
    </div>
  );
}
