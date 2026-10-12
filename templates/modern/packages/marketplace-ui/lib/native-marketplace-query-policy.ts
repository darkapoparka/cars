import type { InventorySearchListing } from "@repo/marketplace/inventory-search";
import { getNativeSidebarQueryBindings } from "./native-sidebar-query-policy";
import { filterLabels, type MarketplaceSearchParams, type QuickFilterKey, type VehicleTaxonomyMakeOption } from "@repo/marketplace";
import { getDesktopPriceQuickFilterLabel, getDesktopQuickFilterLabels } from "./desktop-filter-policy";
import { getMarketplaceQuickFilterLabel } from "./marketplace-filter-policy";
import { getMarketplaceControlCopy } from "./marketplace-control-copy";
import { marketplaceSortLabelsBg } from "./marketplace-filter-config";
import { formatVehicleCount, getActiveFilterChips, getMarketplaceResultTitle, getNativeMarketplaceChipSlots } from "./marketplace-results-toolbar-policy";

export const getDealerInventorySortLabel = (sort: MarketplaceSearchParams["sort"], locale?: string) => {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const selectedSort = sort ?? "recommended";
  const defaultSortLabel = isBg ? "Сортирай" : "Sort";
  const selectedSortLabel = isBg ? marketplaceSortLabelsBg[selectedSort] : filterLabels.sort[selectedSort];
  return selectedSort === "recommended" ? defaultSortLabel : selectedSortLabel;
};
export const getNativeMarketplaceInventoryFields = (filters: MarketplaceSearchParams, locale?: string) => {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const numberFormatter = new Intl.NumberFormat(isBg ? "bg-BG" : "en-US");
  const labels = getDesktopQuickFilterLabels(filters, isBg, numberFormatter);
  const hasPrice = filters.priceMin !== undefined || filters.priceMax !== undefined;
  const price = hasPrice ? getDesktopPriceQuickFilterLabel(filters, isBg, numberFormatter) : isBg ? "Цена" : "Price";
  return { labels, hasPrice, price, make: filters.make || (isBg ? "Всички марки" : "All Makes"), model: filters.model || (isBg ? "Всички модели" : "All Models") };
};
/** Data-only native atom reducer. HTML remains owned by the original React components. */
export const getNativeMarketplaceQueryBindings = (filters: MarketplaceSearchParams, totalListings: number, locale?: string, taxonomy: readonly VehicleTaxonomyMakeOption[] = [], searchListings?: readonly InventorySearchListing[]) => {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const chips = getActiveFilterChips(filters, locale);
  const conditionCount = chips.filter(chip => chip.id !== "category" && chip.id !== "make-model" && chip.id !== "q").length;
  const makeModel = getMakeModelValue(getMarketplaceQuickFilterLabel("make-model", filters, locale), isBg);
  const hasMakeModel = makeModel !== (isBg ? "Всички марки" : "All makes");
  const searchLabel = getMarketplaceControlCopy(isBg ? "bg" : "en").search.makeModelPlaceholder;
  return {
    sidebarFields: getNativeSidebarQueryBindings(filters, locale, searchListings),
    sidebarStatus: { hidden: !(chips.length || filters.q), text: chips.length ? `${isBg ? "Избрани филтри" : "Filters selected"}: ${chips.length}` : `${isBg ? "Търсене" : "Search"}: ${filters.q ?? ""}` },
    mobileSearch: { label: hasMakeModel ? makeModel : searchLabel, ariaLabel: hasMakeModel ? `${isBg ? "Марка и модел" : "Make and model"}: ${makeModel}` : searchLabel },
    mobileFilters: { ariaLabel: `${isBg ? "Отвори филтрите" : "Open filters"}${conditionCount > 0 ? ` (${conditionCount})` : ""}`, title: getConditionsValue(conditionCount, isBg) },
    narrowFiltersAriaLabel: `${isBg ? "Филтри" : "Filters"}${chips.length > 0 ? ` (${chips.length})` : ""}`,
    resultTitle: getMarketplaceResultTitle(filters, locale),
    resultCount: formatVehicleCount(totalListings, filters.category, locale),
    mobileResultCount: String(totalListings) + " " + (isBg ? totalListings === 1 ? "автомобил" : "автомобила" : totalListings === 1 ? "vehicle" : "vehicles"),
    sortLabel: getDealerInventorySortLabel(filters.sort, locale),
    chips: getNativeMarketplaceChipSlots(chips).map(chip => ({ ...chip, ariaLabel: `${isBg ? "Премахни" : "Remove"}: ${chip.label}` })),
    filterCount: chips.length,
    inventoryFields: getNativeMarketplaceInventoryFields(filters, locale),
    activeFields: { make: Boolean(filters.make), model: Boolean(filters.model), price: filters.priceMin !== undefined || filters.priceMax !== undefined, sidebarPrice: Boolean(filters.priceMin || filters.priceMax), year: filters.yearMin !== undefined || filters.yearMax !== undefined, mileage: filters.mileageMax !== undefined, fuel: Boolean(filters.fuel), transmission: Boolean(filters.transmission), body: Boolean(filters.body), seller: Boolean(filters.seller), power: filters.powerMin !== undefined, extras: Boolean(filters.extra), location: Boolean(filters.location), category: filters.category !== "car" },
    mobileConditionFilterCount: chips.filter(chip => chip.id !== "category" && chip.id !== "make-model" && chip.id !== "q").length,
    mobileMakeModelValue: getMakeModelValue(getMarketplaceQuickFilterLabel("make-model", filters, locale), isBg),
    mobileQuickFilterItems: getMarketplaceMobileQuickFilterItems(filters, locale, taxonomy, true).map(item => ({ ...item, hasClearLabel: Boolean(item.clearLabel) })),
    emptyCopy: getMarketplaceResultsEmptyCopy(chips.length > 0, isBg),
  };
};

export const getMakeModelValue = (label: string, isBg: boolean) => {
  if (label === "Марка и модел") {
    return "Всички марки";
  }

  if (label === "Make and model") {
    return "All makes";
  }

  return label || (isBg ? "Всички марки" : "All makes");
};

export const getConditionsValue = (filterCount: number, isBg: boolean) => {
  if (filterCount > 0) {
    if (isBg && filterCount === 1) {
      return "1 активен";
    }

    return isBg ? `${filterCount} активни` : `${filterCount} active`;
  }

  return isBg ? "Всички" : "All";
};

export const getCanonicalAppliedSearchLabel = (
  query: string | undefined,
  taxonomy: readonly VehicleTaxonomyMakeOption[]
) => {
  const normalizedQuery = query?.trim();

  if (!normalizedQuery) {
    return;
  }

  const canonicalMatch = taxonomy
    .flatMap((make) => [
      make.name,
      ...make.models.flatMap((model) => [
        model.name,
        `${make.name} ${model.name}`,
      ]),
    ])
    .find(
      (label) =>
        label.localeCompare(normalizedQuery, undefined, {
          sensitivity: "base",
        }) === 0
    );

  return canonicalMatch ?? normalizedQuery;
};


export const getMarketplaceMobileQuickFilterItems = (
  filters: MarketplaceSearchParams, locale: string | undefined, taxonomy: readonly VehicleTaxonomyMakeOption[], nativeSlots = false
) => {
  const chips = getActiveFilterChips(filters, locale);
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const appliedSearchLabel = getCanonicalAppliedSearchLabel(filters.q, taxonomy);
  const conditionItems = (["price", "year", "mileage", "fuel", "transmission"] as const).map(id => {
    const chip = chips.find(chip => chip.id === id);
    const label = getMarketplaceQuickFilterLabel(id, filters, locale);
    return { id: id as string, label, active: Boolean(chip), hidden: false,
      clearLabel: chip ? isBg ? "Премахни филтъра " + label : "Remove " + label + " filter" : undefined,
      updates: chip?.updates,
    };
  }).sort((first, second) => Number(second.active) - Number(first.active));
  return [
    ...(appliedSearchLabel || nativeSlots ? [{
      id: "search-query", label: appliedSearchLabel ?? "", active: Boolean(appliedSearchLabel), hidden: !appliedSearchLabel,
      clearLabel: appliedSearchLabel ? isBg ? "Премахни филтъра " + appliedSearchLabel : "Remove " + appliedSearchLabel + " filter" : undefined,
      updates: { q: undefined } as Partial<MarketplaceSearchParams>,
    }] : []),
    ...conditionItems,
  ];
};

export const getMarketplaceResultsEmptyCopy = (filtered: boolean, isBg: boolean) => {
  const copy = isBg
    ? {
        filteredTitle: "Няма намерени обяви",
        emptyTitle: "Все още няма обяви в тази категория",
        filteredDescription:
          "Изчистете част от филтрите или изберете друга категория.",
        emptyDescription:
          "Нови обяви се добавят редовно. Разгледайте друга категория.",
      }
    : {
        filteredTitle: "No matching vehicles",
        emptyTitle: "No vehicles in this category yet",
        filteredDescription:
          "Try clearing a few filters or switching the vehicle category.",
        emptyDescription:
          "New listings are added regularly. Browse another category.",
      };
  const title = filtered ? copy.filteredTitle : copy.emptyTitle;
  const description = filtered
    ? copy.filteredDescription
    : copy.emptyDescription;
  return { title, description };
};
