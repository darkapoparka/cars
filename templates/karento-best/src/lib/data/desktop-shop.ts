import { translate } from "#lib/i18n/messages.ts";
import type { Locale } from "#lib/i18n/locales.ts";
import type { ListingProduct } from "./vehicle-listing.ts";
import {
  shopCategories,
  type ShopProductFacets,
} from "./shop-reference-facets.ts";

/** Filters describe the supplied reference collection, not live stock. */
export interface DesktopShopFilters {
  q: string;
  category: string;
  brand: string;
  minPrice: string;
  budget: string;
  sort: string;
}

export const shopFilterKeys = [
  "q",
  "category",
  "brand",
  "minPrice",
  "budget",
] as const;
export const shopSortOptions = [
  {
    value: "",
    label: "Default order",
    labelKey: "reference.dynamic.shop-sort-options..label",
  },
  {
    value: "price-asc",
    label: "Price: low first",
    labelKey: "reference.dynamic.shop-sort-options.price-asc.label",
  },
  {
    value: "price-desc",
    label: "Price: high first",
    labelKey: "reference.dynamic.shop-sort-options.price-desc.label",
  },
  {
    value: "name-asc",
    label: "Name: A–Z",
    labelKey: "reference.dynamic.shop-sort-options.name-asc.label",
  },
] as const;

function priceFilter(value: string | null): string {
  const trimmed = value?.trim() ?? "";
  return trimmed && Number.isFinite(Number(trimmed)) && Number(trimmed) >= 0
    ? trimmed
    : "";
}

export function readDesktopShopFilters(
  parameters: Pick<URLSearchParams, "get">,
): DesktopShopFilters {
  const sort = parameters.get("sort") ?? "";
  const category = parameters.get("category") ?? "";
  return {
    q: parameters.get("q")?.trim() ?? "",
    category: shopCategories.some((option) => option.value === category)
      ? category
      : "",
    brand: parameters.get("brand")?.trim() ?? "",
    minPrice: priceFilter(parameters.get("minPrice")),
    budget: priceFilter(parameters.get("budget")),
    sort: shopSortOptions.some((option) => option.value === sort) ? sort : "",
  };
}

function productPrice(product: Pick<ListingProduct, "price">): number {
  const digits = product.price.replace(/[^\d.]/g, "");
  return digits ? Number(digits) : NaN;
}

export function matchDesktopShop<
  T extends Pick<ListingProduct, "title" | "price"> & ShopProductFacets,
>(products: readonly T[], filters: DesktopShopFilters): T[] {
  const terms = filters.q.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const results = products.filter(
    (product) =>
      terms.every((term) => product.title.toLocaleLowerCase().includes(term)) &&
      (!filters.category || product.category === filters.category) &&
      (!filters.brand ||
        product.brand?.toLocaleLowerCase() ===
          filters.brand.toLocaleLowerCase()) &&
      (!filters.minPrice ||
        productPrice(product) >= Number(filters.minPrice)) &&
      (!filters.budget || productPrice(product) <= Number(filters.budget)),
  );
  if (filters.sort === "name-asc")
    return results.toSorted((a, b) => a.title.localeCompare(b.title));
  if (filters.sort === "price-asc" || filters.sort === "price-desc")
    return results.toSorted((a, b) => {
      const aPrice = productPrice(a);
      const bPrice = productPrice(b);
      if (!Number.isFinite(aPrice)) return Number.isFinite(bPrice) ? 1 : 0;
      if (!Number.isFinite(bPrice)) return -1;
      return (aPrice - bPrice) * (filters.sort === "price-desc" ? -1 : 1);
    });
  return results;
}

export function desktopShopDestination(
  pathname: string,
  filters: DesktopShopFilters,
  parameters: Pick<URLSearchParams, "toString"> = new URLSearchParams(),
  hash = "",
): string {
  const next = new URLSearchParams(parameters.toString());
  next.delete("filters");
  for (const key of [...shopFilterKeys, "sort"] as const) {
    if (filters[key]) next.set(key, filters[key]);
    else next.delete(key);
  }
  const query = next.toString();
  return pathname + (query ? "?" + query : "") + hash;
}

export function shopFilterLabel(
  key: (typeof shopFilterKeys)[number],
  value: string,
  language: Locale = "en",
): string {
  if (key === "minPrice")
    return translate(language, "reference.shop.price.minimum", {
      amount: value,
    });
  if (key === "budget")
    return translate(language, "reference.shop.price.maximum", {
      amount: value,
    });
  if (key === "category") {
    const category = shopCategories.find((option) => option.value === value);
    return category ? translate(language, category.labelKey) : value;
  }
  return value;
}
