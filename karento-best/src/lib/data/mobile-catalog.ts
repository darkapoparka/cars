export interface CatalogFilters {
  q: string;
  make: string;
  model: string;
  budget: string;
  sort: string;
}

export type CatalogPanel =
  | "search"
  | "filters"
  | "make"
  | "model"
  | "budget"
  | "sort";
export type CatalogItem = { title: string; price: string };
export const catalogFilterKeys = ["q", "make", "model", "budget"] as const;
export const emptyCatalogFilters: Readonly<CatalogFilters> = {
  q: "",
  make: "",
  model: "",
  budget: "",
  sort: "",
};
export const catalogSortOptions = [
  { value: "", label: "Default order", labelKey: "catalog.order.default" },
  {
    value: "price-asc",
    label: "Price: low first",
    labelKey: "catalog.order.priceAsc",
  },
  {
    value: "price-desc",
    label: "Price: high first",
    labelKey: "catalog.order.priceDesc",
  },
] as const;

export function normalizeCatalogBudget(value: string): string | undefined {
  const budget = value.trim().replace(",", ".");
  if (!budget) return "";
  if (!/^\d+(?:\.\d+)?$/.test(budget)) return undefined;
  const amount = Number(budget);
  return Number.isFinite(amount) && amount > 0 ? budget : undefined;
}

export function readCatalogFilters(
  parameters: Pick<URLSearchParams, "get">,
): CatalogFilters {
  const budget = parameters.get("budget") ?? "";
  const make = parameters.get("make") ?? "";
  return {
    q: parameters.get("q")?.trim() ?? "",
    make,
    model: make ? (parameters.get("model") ?? "") : "",
    budget: normalizeCatalogBudget(budget) ?? "",
    sort: ["price-asc", "price-desc"].includes(parameters.get("sort") ?? "")
      ? parameters.get("sort")!
      : "",
  };
}

export function matchCatalog<T extends CatalogItem>(
  items: readonly T[],
  filters: CatalogFilters,
): T[] {
  const budget = normalizeCatalogBudget(filters.budget);
  if (budget === undefined) return [];
  const price = (item: CatalogItem) =>
    Number(item.price.replace(/[^\d.]/g, ""));
  const filtered = items.filter(
    (item) =>
      (!filters.q ||
        item.title.toLowerCase().includes(filters.q.toLowerCase())) &&
      (!filters.make || item.title.startsWith(filters.make + " ")) &&
      (!filters.model || item.title === filters.make + " " + filters.model) &&
      (!budget || price(item) <= Number(budget)),
  );
  return filters.sort
    ? filtered.toSorted(
        (a, b) =>
          (price(a) - price(b)) * (filters.sort === "price-desc" ? -1 : 1),
      )
    : filtered;
}

export function catalogDestination(
  pathname: string,
  filters: CatalogFilters,
  parameters: Pick<URLSearchParams, "toString"> = new URLSearchParams(),
  hash = "",
): string {
  const next = new URLSearchParams(parameters.toString());
  next.delete("filters");
  for (const key of [...catalogFilterKeys, "sort"] as const) {
    const value =
      key === "budget" ? normalizeCatalogBudget(filters.budget) : filters[key];
    if (value) next.set(key, value);
    else next.delete(key);
  }
  const query = next.toString();
  return pathname + (query ? "?" + query : "") + hash;
}
