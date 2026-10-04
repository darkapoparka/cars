import type {
  ListingViewMode,
  MarketplaceSearchParams,
} from "@repo/marketplace";
import type { PublicInventoryFilterLayout } from "@repo/marketplace/inventory-presentation";
import { PanelLeft, SlidersHorizontal, X } from "lucide-react";
import { getActiveFilterChips } from "../lib/marketplace-results-toolbar-policy";
import styles from "./dealer-inventory.module.css";
import { DealerInventorySummary } from "./dealer-inventory-summary";

/** Desktop catalog filters reuse the same URL state and accessible dialogs. */
export function DealerInventoryFilters({
  filters,
  locale,
  layout,
  onLayoutChange,
  onApply,
  onClearFilters,
  onViewModeChange,
  totalListings,
  viewMode,
}: {
  filters: MarketplaceSearchParams;
  locale?: string;
  layout: PublicInventoryFilterLayout;
  onLayoutChange: (layout: PublicInventoryFilterLayout) => void;
  onApply: (updates: Partial<MarketplaceSearchParams>) => void;
  onClearFilters: () => void;
  onViewModeChange: (viewMode: ListingViewMode) => void;
  totalListings: number;
  viewMode: ListingViewMode;
}) {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  return (
    <section
      aria-label={isBg ? "Филтри за автомобили" : "Vehicle filters"}
      className={styles.filterBar}
      data-filter-layout={layout}
      data-slot="dealer-inventory-filters"
    >
      <DealerInventorySummary
        filters={filters}
        locale={locale}
        onApply={onApply}
        onViewModeChange={onViewModeChange}
        totalListings={totalListings}
        viewMode={viewMode}
      >
        <fieldset
          aria-label={isBg ? "Изглед на филтрите" : "Filter layout"}
          className={styles.layoutToggle}
        >
          <button
            aria-label={isBg ? "Бързи филтри" : "Quick filters"}
            aria-pressed={layout === "quick"}
            onClick={() => onLayoutChange("quick")}
            type="button"
          >
            <SlidersHorizontal aria-hidden="true" size={16} />
            {isBg ? "Бързи" : "Quick"}
          </button>
          <button
            aria-label={isBg ? "Страничен панел" : "Sidebar"}
            aria-pressed={layout === "sidebar"}
            onClick={() => onLayoutChange("sidebar")}
            type="button"
          >
            <PanelLeft aria-hidden="true" size={16} />
            {isBg ? "Панел" : "Sidebar"}
          </button>
        </fieldset>
      </DealerInventorySummary>
      <DealerInventoryAppliedFilters
        filters={filters}
        isBg={isBg}
        locale={locale}
        onApply={onApply}
        onClearFilters={onClearFilters}
      />
    </section>
  );
}

function DealerInventoryAppliedFilters({
  filters,
  isBg,
  locale,
  onApply,
  onClearFilters,
}: {
  filters: MarketplaceSearchParams;
  isBg: boolean;
  locale?: string;
  onApply: (updates: Partial<MarketplaceSearchParams>) => void;
  onClearFilters: () => void;
}) {
  const chips = getActiveFilterChips(filters, locale);
  if (chips.length === 0) {
    return null;
  }
  return (
    <fieldset
      aria-label={isBg ? "Приложени филтри" : "Applied filters"}
      className={styles.activeFilters}
    >
      {chips.map((chip) => (
        <button
          aria-label={`${isBg ? "Премахни" : "Remove"}: ${chip.label}`}
          className={styles.activeFilter}
          data-filter-id={chip.id}
          data-slot="dealer-inventory-active-filter"
          key={chip.id}
          onClick={() => onApply(chip.updates)}
          type="button"
        >
          <span>{chip.label}</span>
          <X aria-hidden="true" size={14} />
        </button>
      ))}
      <button
        className={styles.clearFilters}
        data-slot="desktop-clear-all-filters"
        onClick={onClearFilters}
        type="button"
      >
        {isBg ? "Изчисти всички" : "Clear all"}
      </button>
    </fieldset>
  );
}
