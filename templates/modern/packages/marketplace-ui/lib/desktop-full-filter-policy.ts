import type { MarketplaceSearchParams } from "@repo/marketplace";
import { getMarketplaceControlCopy } from "./marketplace-control-copy";
import { getMarketplaceFilterSummary } from "./marketplace-filter-summary";

export const desktopFullFilterSections = [
  "vehicle",
  "price",
  "year",
  "mileage",
  "fuel",
  "transmission",
  "body",
  "search",
  "category",
  "location",
  "origin",
  "deliver-to",
  "seller",
] as const;
export type DesktopFullFilterSection =
  (typeof desktopFullFilterSections)[number];
export type DesktopFullFilterEntry =
  | DesktopFullFilterSection
  | "make"
  | "model";

export const desktopFullFilterGroups = [
  {
    id: "vehicle",
    bg: "Автомобил",
    en: "Vehicle",
    sections: ["vehicle", "search"],
  },
  {
    id: "budget",
    bg: "Цена и година",
    en: "Price and year",
    sections: ["price", "year", "mileage"],
  },
  {
    id: "details",
    bg: "Характеристики",
    en: "Specifications",
    sections: ["category", "body", "fuel", "transmission", "seller"],
  },
  {
    id: "location",
    bg: "Местоположение",
    en: "Location",
    sections: ["location", "origin", "deliver-to"],
  },
] as const;
export type DesktopFullFilterGroup =
  (typeof desktopFullFilterGroups)[number]["id"];

export function getDesktopFullFilterGroup(section: DesktopFullFilterSection) {
  return (
    desktopFullFilterGroups.find((group) =>
      (group.sections as readonly DesktopFullFilterSection[]).includes(section)
    )?.id ?? "vehicle"
  );
}

export function getDesktopFullFilterLabel(
  section: DesktopFullFilterSection,
  locale?: string
) {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  if (section === "vehicle") {
    return isBg ? "Марка и модел" : "Make and model";
  }
  if (section === "search") {
    return isBg ? "Ключова дума" : "Keyword";
  }
  if (section === "category") {
    return isBg ? "Категория" : "Category";
  }
  return getMarketplaceControlCopy(locale).filters[section];
}

export function getDesktopFullFilterSummary(
  section: DesktopFullFilterSection,
  draft: MarketplaceSearchParams,
  locale?: string
) {
  if (section === "vehicle") {
    return [draft.make, draft.model].filter(Boolean).join(" ");
  }
  if (section === "search") {
    return draft.q;
  }
  if (section === "category") {
    return getMarketplaceControlCopy(locale).categories[draft.category].label;
  }
  return getMarketplaceFilterSummary(section, draft, locale);
}

const clearUpdates: Partial<
  Record<DesktopFullFilterSection, Partial<MarketplaceSearchParams>>
> = {
  vehicle: {
    make: undefined,
    model: undefined,
    derivative: undefined,
    trim: undefined,
  },
  price: { priceMin: undefined, priceMax: undefined, currency: undefined },
  year: { yearMin: undefined, yearMax: undefined },
  mileage: { mileageMax: undefined },
  search: { q: undefined },
  "deliver-to": { deliverTo: undefined },
};
export const clearDesktopFullFilterSection = (
  section: DesktopFullFilterSection,
  draft: MarketplaceSearchParams
): MarketplaceSearchParams => ({
  ...draft,
  ...(clearUpdates[section] ?? { [section]: undefined }),
});
