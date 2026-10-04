import { Button } from "@repo/design-system/components/ui/button";
import type { MarketplaceSearchParams } from "@repo/marketplace";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import type { MouseEvent } from "react";
import { getDesktopPriceQuickFilterLabel } from "../lib/desktop-filter-policy";
import searchStyles from "./dealer-hero-search.module.css";
import styles from "./dealer-inventory-search.module.css";
import type { DesktopFullFilterEntry } from "./desktop-full-filter-dialog";

function openFromButton(
  event: MouseEvent<HTMLButtonElement>,
  onOpen: () => void
) {
  // Safari does not focus pointer-clicked buttons; the dialog needs a return target.
  event.currentTarget.focus({ preventScroll: true });
  onOpen();
}

function SearchField({
  active,
  disabled,
  label,
  onOpen,
  value,
}: {
  active: boolean;
  disabled: boolean;
  label: string;
  onOpen: () => void;
  value: string;
}) {
  return (
    <div className={searchStyles.filterField}>
      <Button
        aria-haspopup="dialog"
        aria-label={label}
        aria-pressed={active}
        className={searchStyles.field}
        data-slot="dealer-inventory-search-field"
        disabled={disabled}
        onClick={(event) => openFromButton(event, onOpen)}
        title={value}
        type="button"
        variant="ghost"
      >
        <span>{value}</span>
        <ChevronDown aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

/** Home's search styling with the inventory's existing filter controller. */
export function DealerInventorySearch({
  disabled = false,
  filterCount,
  filters,
  locale,
  onOpenSection,
}: {
  disabled?: boolean;
  filterCount: number;
  filters: MarketplaceSearchParams;
  locale?: string;
  onOpenSection: (section: DesktopFullFilterEntry) => void;
}) {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const text = (bg: string, en: string) => (isBg ? bg : en);
  const hasPrice =
    filters.priceMin !== undefined || filters.priceMax !== undefined;
  const price = hasPrice
    ? getDesktopPriceQuickFilterLabel(
        filters,
        isBg,
        new Intl.NumberFormat(isBg ? "bg-BG" : "en-US")
      )
    : text("Всяка цена", "Any Price");

  return (
    <div
      className={styles.controls}
      data-slot="dealer-inventory-search-controls"
    >
      <div
        className={searchStyles.desktopSearch}
        data-search-context="inventory"
        data-slot="dealer-inventory-search"
        data-surface="hero"
      >
        <fieldset
          aria-label={text("Търсене на автомобили", "Vehicle search")}
          className={searchStyles.form}
        >
          <SearchField
            active={Boolean(filters.make)}
            disabled={disabled}
            label={text("Марка", "Make")}
            onOpen={() => onOpenSection("make")}
            value={filters.make || text("Всички марки", "All Makes")}
          />
          <SearchField
            active={Boolean(filters.model)}
            disabled={disabled}
            label={text("Модел", "Model")}
            onOpen={() => onOpenSection("model")}
            value={filters.model || text("Всички модели", "All Models")}
          />
          <SearchField
            active={hasPrice}
            disabled={disabled}
            label={text("Цена", "Price")}
            onOpen={() => onOpenSection("price")}
            value={price}
          />
          <Button
            aria-haspopup="dialog"
            className={searchStyles.submit}
            data-slot="dealer-inventory-search-open"
            disabled={disabled}
            onClick={(event) =>
              openFromButton(event, () => onOpenSection("search"))
            }
            type="button"
          >
            <Search aria-hidden="true" size={20} />
            <span>{text("Търси автомобили", "Search cars")}</span>
          </Button>
        </fieldset>
      </div>
      <button
        aria-haspopup="dialog"
        aria-label={text("Филтри", "Filters")}
        className={styles.filters}
        data-slot="desktop-primary-control"
        disabled={disabled}
        onClick={(event) =>
          openFromButton(event, () => onOpenSection("vehicle"))
        }
        type="button"
      >
        <SlidersHorizontal aria-hidden="true" size={20} />
        <span>{text("Филтри", "Filters")}</span>
        {filterCount > 0 ? (
          <span className={styles.badge}>{filterCount}</span>
        ) : null}
      </button>
    </div>
  );
}
