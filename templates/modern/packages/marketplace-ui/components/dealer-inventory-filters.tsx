import type {
  ListingViewMode,
  MarketplaceSearchParams,
} from "@repo/marketplace";
import type { PublicInventoryFilterLayout } from "@repo/marketplace/inventory-presentation";
import { PanelLeft, SlidersHorizontal } from "lucide-react";
import styles from "./dealer-inventory.module.css";
import { DealerInventorySummary } from "./dealer-inventory-summary";
import type { DesktopFullFilterSection } from "./desktop-full-filter-dialog";
import { DesktopQuickFilters } from "./desktop-quick-filters";

/** Desktop catalog filters reuse the same URL state and accessible dialogs. */
export function DealerInventoryFilters({
  filters,
  locale,
  filterCount,
  layout,
  onLayoutChange,
  onApply,
  onClearFilters,
  onOpenFilters,
  onOpenMake,
  onOpenModel,
  onOpenSection,
  onViewModeChange,
  totalListings,
  viewMode,
}: {
  filters: MarketplaceSearchParams;
  locale?: string;
  filterCount: number;
  layout: PublicInventoryFilterLayout;
  onLayoutChange: (layout: PublicInventoryFilterLayout) => void;
  onApply: (updates: Partial<MarketplaceSearchParams>) => void;
  onClearFilters: () => void;
  onOpenFilters: () => void;
  onOpenMake: () => void;
  onOpenModel: () => void;
  onOpenSection: (section: DesktopFullFilterSection) => void;
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
      {layout === "quick" ? (
        <div className={styles.quickFilters} data-slot="dealer-inventory-rail">
          <DesktopQuickFilters
            compact
            filterCount={filterCount}
            filters={filters}
            isBg={isBg}
            layout="toolbar"
            numberFormatter={new Intl.NumberFormat(isBg ? "bg-BG" : "en-US")}
            onApply={onApply}
            onClearFilters={onClearFilters}
            onOpenFilters={onOpenFilters}
            onOpenMake={onOpenMake}
            onOpenModel={onOpenModel}
            onOpenSection={onOpenSection}
            showSearchChip
            showSort={false}
          />
        </div>
      ) : null}
    </section>
  );
}
