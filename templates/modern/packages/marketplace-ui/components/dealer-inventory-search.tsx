import { useNativeMarketplaceQuerySlots } from "../lib/native-marketplace-query-slots";
import { Button } from "@repo/design-system/components/ui/button";
import { type MarketplaceSearchParams, withCategory } from "@repo/marketplace";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import type { MouseEvent } from "react";
import { getNativeMarketplaceInventoryFields } from "../lib/native-marketplace-query-policy";
import searchStyles from "./dealer-hero-search.module.css";
import inventoryStyles from "./dealer-inventory.module.css";
import styles from "./dealer-inventory-search.module.css";
import { DealerVehicleTypeField } from "./dealer-vehicle-type-field";
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
  slot,
  value,
  nativeField,
}: {
  active: boolean;
  disabled: boolean;
  label: string;
  onOpen: () => void;
  slot: string;
  value: string;
  nativeField: "make" | "model";
}) {
  const nativeSlots = useNativeMarketplaceQuerySlots();
  return (
    <div className={searchStyles.filterField}>
      <Button
        aria-haspopup="dialog"
        aria-label={label}
        aria-pressed={active}
        className={searchStyles.field}
        data-native-query-slot={nativeSlots ? `inventory-trigger:${nativeField}` : undefined}
        data-slot={slot}
        disabled={disabled}
        onClick={(event) => openFromButton(event, onOpen)}
        title={value}
        type="button"
        variant="ghost"
      >
        <span data-native-query-slot={nativeSlots ? `inventory-label:${nativeField}` : undefined}>{value}</span>
        <ChevronDown aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

/** Shared hero controls; each page supplies its own draft or URL-state owner. */
export function DealerInventorySearch({
  context = "inventory",
  disabled = false,
  filterCount,
  filters,
  locale,
  onApply,
  onOpenFilters,
  onOpenSection,
  onSearch,
  refinementSections,
}: {
  context?: "home" | "inventory";
  disabled?: boolean;
  filterCount: number;
  filters: MarketplaceSearchParams;
  locale?: string;
  onApply?: (updates: Partial<MarketplaceSearchParams>) => void;
  onOpenFilters: () => void;
  onOpenSection: (section: DesktopFullFilterEntry) => void;
  onSearch?: () => void;
  refinementSections?: readonly DesktopFullFilterEntry[];
}) {
  const nativeSlots = useNativeMarketplaceQuerySlots();
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const text = (bg: string, en: string) => (isBg ? bg : en);
  const { labels, hasPrice, price, make, model } = getNativeMarketplaceInventoryFields(filters, locale);

  return (
    <div
      className={styles.controls}
      data-native-query-scope={nativeSlots ? "inventory-search" : undefined}
      data-slot="dealer-inventory-search-controls"
    >
      <div
        className={`${searchStyles.desktopSearch} ${styles.search}`}
        data-search-context="inventory"
        data-slot="dealer-inventory-search"
        data-surface="hero"
      >
        <fieldset
          aria-label={text("Търсене на превозни средства", "Vehicle search")}
          className={searchStyles.form}
        >
          <DealerVehicleTypeField
            category={filters.category}
            disabled={disabled || !onApply}
            isBg={isBg}
            onSelect={(category) => onApply?.(withCategory(filters, category))}
            slot={
              context === "home"
                ? "desktop-hero-category"
                : "dealer-inventory-type"
            }
          />
          <SearchField
            nativeField="make"
            active={Boolean(filters.make)}
            disabled={disabled}
            label={text("Марка", "Make")}
            onOpen={() => onOpenSection("make")}
            slot={
              context === "home"
                ? "desktop-hero-make"
                : "dealer-inventory-search-field"
            }
            value={make}
          />
          <SearchField
            nativeField="model"
            active={Boolean(filters.model)}
            disabled={disabled}
            label={text("Модел", "Model")}
            onOpen={() => onOpenSection("model")}
            slot={
              context === "home"
                ? "desktop-hero-model"
                : "dealer-inventory-search-field"
            }
            value={model}
          />
          <Button
            aria-haspopup={onSearch ? undefined : "dialog"}
            aria-label={text("Търси", "Search")}
            className={searchStyles.submit}
            data-slot={
              context === "home"
                ? "desktop-hero-submit"
                : "dealer-inventory-search-open"
            }
            disabled={disabled}
            onClick={(event) =>
              openFromButton(event, onSearch ?? (() => onOpenSection("search")))
            }
            type="button"
          >
            <Search aria-hidden="true" size={20} />
          </Button>
        </fieldset>
        <fieldset
          aria-label={text("Бързи филтри", "Quick filters")}
          className={styles.refinements}
          data-slot={
            context === "home"
              ? "desktop-home-refinements"
              : "dealer-inventory-hero-filters"
          }
        >
          {(
            [
              {
                section: "price",
                label: price,
                name: text("Цена", "Price"),
                active: hasPrice,
              },
              {
                section: "year",
                label: labels.year,
                name: text("Година", "Year"),
                active:
                  filters.yearMin !== undefined ||
                  filters.yearMax !== undefined,
              },
              {
                section: "mileage",
                label: labels.mileage,
                name: text("Пробег", "Mileage"),
                active: filters.mileageMax !== undefined,
              },
              {
                section: "fuel",
                label: labels.fuel,
                name: text("Гориво", "Fuel"),
                active: Boolean(filters.fuel),
              },
              {
                section: "transmission",
                label: labels.transmission,
                name: text("Скорости", "Gearbox"),
                active: Boolean(filters.transmission),
              },
            ] as const
          )
            .filter(({ section }) =>
              refinementSections ? refinementSections.includes(section) : true
            )
            .map(({ section, label, name, active }) => (
              <Button
                aria-haspopup="dialog"
                aria-label={name}
                aria-pressed={active}
                className={`${searchStyles.categoryPill} ${styles.refinement}`}
                disabled={disabled}
                data-native-query-slot={nativeSlots ? `inventory-trigger:${section}` : undefined}
                key={section}
                onClick={(event) =>
                  openFromButton(event, () => onOpenSection(section))
                }
                title={label}
                type="button"
                variant="ghost"
              >
                <span data-native-query-slot={nativeSlots ? `inventory-label:${section}` : undefined}>{label}</span>
                <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
              </Button>
            ))}
          <Button
            aria-haspopup="dialog"
            className={searchStyles.categoryPill}
            data-slot={
              context === "home"
                ? "desktop-hero-filters"
                : "desktop-primary-control"
            }
            disabled={disabled}
            onClick={(event) => openFromButton(event, onOpenFilters)}
            type="button"
            variant="ghost"
          >
            <SlidersHorizontal aria-hidden="true" size={18} />
            <span>{text("Филтри", "Filters")}</span>
            {filterCount > 0 || nativeSlots ? (
              <span data-native-query-slot={nativeSlots ? "inventory-filter-count" : undefined} hidden={nativeSlots ? filterCount === 0 : undefined} style={nativeSlots && filterCount === 0 ? { display: "none" } : undefined} className={inventoryStyles.filterBadge}>{filterCount}</span>
            ) : null}
          </Button>
        </fieldset>
      </div>
    </div>
  );
}
