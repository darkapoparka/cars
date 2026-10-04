import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import type {
  ListingViewMode,
  MarketplaceSearchParams,
} from "@repo/marketplace";
import type { PublicInventoryFilterLayout } from "@repo/marketplace/inventory-presentation";
import { publicSite } from "@repo/marketplace/site-config";
import { LayoutTemplate, PanelLeft, SlidersHorizontal, X } from "lucide-react";
import { getActiveFilterChips } from "../lib/marketplace-results-toolbar-policy";
import styles from "./dealer-inventory.module.css";
import { DealerInventorySummary } from "./dealer-inventory-summary";

/** Desktop catalog filters reuse the same URL state and accessible dialogs. */
export function DealerInventoryFilters({
  filterCount,
  filters,
  locale,
  layout,
  onLayoutChange,
  onApply,
  onClearFilters,
  onOpenFilters,
  onViewModeChange,
  totalListings,
  viewMode,
}: {
  filterCount: number;
  filters: MarketplaceSearchParams;
  locale?: string;
  layout: PublicInventoryFilterLayout;
  onLayoutChange: (layout: PublicInventoryFilterLayout) => void;
  onApply: (updates: Partial<MarketplaceSearchParams>) => void;
  onClearFilters: () => void;
  onOpenFilters: () => void;
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
        filterCount={filterCount}
        filters={filters}
        locale={locale}
        onApply={onApply}
        onOpenFilters={onOpenFilters}
        onViewModeChange={onViewModeChange}
        totalListings={totalListings}
        viewMode={viewMode}
      >
        {publicSite.identity.desktopPreview ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label={isBg ? "Преглед на шаблона" : "Template preview"}
                className={styles.previewTrigger}
                data-slot="dealer-inventory-preview"
                title={isBg ? "Преглед на шаблона" : "Template preview"}
                type="button"
              >
                <LayoutTemplate aria-hidden="true" size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={styles.previewMenu}>
              <DropdownMenuLabel>
                {isBg ? "Изглед на филтрите" : "Filter layout"}
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                onValueChange={(value) =>
                  onLayoutChange(value as PublicInventoryFilterLayout)
                }
                value={layout}
              >
                <DropdownMenuRadioItem value="quick">
                  <SlidersHorizontal aria-hidden="true" size={16} />
                  {isBg ? "Бързи филтри" : "Quick filters"}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="sidebar">
                  <PanelLeft aria-hidden="true" size={16} />
                  {isBg ? "Страничен панел" : "Sidebar"}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
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
