import type { MarketplaceSearchParams } from "@repo/marketplace";
import type { InventorySearchListing } from "@repo/marketplace/inventory-search";
import { getDesktopPriceQuickFilterLabel, getDesktopQuickFilterLabels, getLocalizedDesktopCategoryLabel } from "./desktop-filter-policy";

export function getHeroCategoryLabel(
  category: MarketplaceSearchParams["category"],
  isBg: boolean
) {
  if (category === "car") {
    return isBg ? "Автомобили" : "All Cars";
  }
  return getLocalizedDesktopCategoryLabel(category, isBg);
}

export function getHeroPriceLabel(
  filters: MarketplaceSearchParams,
  isBg: boolean,
  formatter: Intl.NumberFormat
) {
  if (filters.priceMin || filters.priceMax) {
    return getDesktopPriceQuickFilterLabel(filters, isBg, formatter);
  }
  return isBg ? "Всяка цена" : "Any Price";
}

export function getSearchOptions(
  searchListings: readonly InventorySearchListing[] | undefined,
  filters: MarketplaceSearchParams,
  isBg: boolean
) {
  const locationOptions = [
    ...new Set([
      ...(searchListings ?? []).flatMap((listing) =>
        listing.location?.city ? [listing.location.city] : []
      ),
      ...(filters.location ? [filters.location] : []),
    ]),
  ]
    .sort()
    .map((city) => ({ value: city, label: city }));
  const equipmentOptions = Array.from(
    new Map(
      (searchListings ?? [])
        .flatMap((listing) => listing.features ?? [])
        .map((feature) => [
          feature.en,
          { value: feature.en, label: isBg ? feature.bg : feature.en },
        ])
    ).values()
  );
  return { locationOptions, equipmentOptions };
}

export const getNativeSidebarQueryBindings = (filters: MarketplaceSearchParams, locale?: string, searchListings?: readonly InventorySearchListing[]) => {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const formatter = new Intl.NumberFormat(isBg ? "bg-BG" : "en-US");
  const { equipmentOptions } = getSearchOptions(searchListings, filters, isBg);
  return { labels: { ...getDesktopQuickFilterLabels(filters, isBg, formatter), make: filters.make || (isBg ? "Всички марки" : "All Makes"), model: filters.model || (isBg ? "Всички модели" : "All Models"), price: getHeroPriceLabel(filters, isBg, formatter), category: getHeroCategoryLabel(filters.category, isBg), power: filters.powerMin ? String(filters.powerMin) + "+ " + (isBg ? "к.с." : "hp") : (isBg ? "Мощност" : "Power"), extras: equipmentOptions.find(option => option.value === filters.extra)?.label ?? filters.extra ?? (isBg ? "Екстри" : "Extras") } };
};
