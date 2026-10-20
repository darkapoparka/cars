import {
  matchDesktopCatalog,
  vehicleBodyType,
  type DesktopCatalogFilterKey,
  type DesktopCatalogFilters,
  type TypedCatalogItem,
} from "./desktop-catalog.ts";
import { compareBodyTypes } from "./body-type-artwork.ts";

export type DesktopFilterLayout = "drawer" | "modal";
export type DesktopFilterPane =
  | "search"
  | "make"
  | "model"
  | "type"
  | "price"
  | "maxMileage"
  | "fuel"
  | "transmission"
  | "minSeats";

export const desktopFilterGroups = [
  {
    label: "Vehicle",
    labelKey: "catalog.vehicle",
    panes: ["make", "model", "type", "maxMileage"],
  },
  { label: "Price", labelKey: "vehicle.price", panes: ["price"] },
  {
    label: "Specifications",
    labelKey: "vehicle.specifications",
    panes: ["fuel", "transmission", "minSeats"],
  },
] as const;

export const desktopFilterPaneLabels: Record<DesktopFilterPane, string> = {
  search: "Search",
  make: "Make",
  model: "Model",
  type: "Body type",
  price: "Price range",
  maxMileage: "Mileage",
  fuel: "Fuel",
  transmission: "Transmission",
  minSeats: "Seats",
};

export const desktopFilterPaneMessageKeys = {
  search: "action.search",
  make: "catalog.make",
  model: "catalog.model",
  type: "catalog.bodyType",
  price: "catalog.priceRange",
  maxMileage: "vehicle.mileage",
  fuel: "vehicle.fuel",
  transmission: "vehicle.transmission",
  minSeats: "vehicle.seats",
} as const;

export function desktopFilterPaneKeys(
  pane: DesktopFilterPane,
): readonly DesktopCatalogFilterKey[] {
  return pane === "price"
    ? ["minPrice", "budget"]
    : [pane === "search" ? "q" : pane];
}

export function clearDesktopFilterPane(
  filters: DesktopCatalogFilters,
  pane: DesktopFilterPane,
): DesktopCatalogFilters {
  const next = { ...filters };
  for (const key of desktopFilterPaneKeys(pane)) next[key] = "";
  if (pane === "make") next.model = "";
  return next;
}

export function selectDesktopFilterMake(
  filters: DesktopCatalogFilters,
  make: string,
): DesktopCatalogFilters {
  return { ...filters, make, model: "" };
}

export function selectDesktopFilterType(
  filters: DesktopCatalogFilters,
  type: string,
): DesktopCatalogFilters {
  return { ...filters, type, make: "", model: "" };
}

export function desktopFilterChoices(
  items: readonly TypedCatalogItem[],
  filters: DesktopCatalogFilters,
  pane: Exclude<DesktopFilterPane, "search" | "price" | "maxMileage">,
): { value: string; count: number }[] {
  const typeItems = items.filter(
    (item) => !filters.type || vehicleBodyType(item) === filters.type,
  );
  let values: string[];
  switch (pane) {
    case "make":
      values = typeItems.map((item) => item.title.split(" ")[0]);
      break;
    case "model":
      values = filters.make
        ? typeItems
            .filter((item) => item.title.startsWith(filters.make + " "))
            .map((item) => item.title.slice(filters.make.length + 1))
        : [];
      break;
    case "type":
      values = items.map(vehicleBodyType);
      break;
    case "minSeats":
      values = items.flatMap((item) => item.seats?.match(/\d+/)?.[0] ?? []);
      break;
    default:
      values = items.map((item) => item[pane]?.trim() ?? "");
  }
  const base = clearDesktopFilterPane(filters, pane);
  // A body-type change also resets dependent make/model, as in the hero and drawer.
  if (pane === "type") {
    base.make = "";
    base.model = "";
  }
  return [...new Set(values.filter(Boolean))]
    .sort(
      pane === "type"
        ? compareBodyTypes
        : pane === "minSeats"
          ? (a, b) => Number(a) - Number(b)
          : (a, b) => a.localeCompare(b),
    )
    .map((value) => ({
      value,
      count: matchDesktopCatalog(items, { ...base, [pane]: value }).length,
    }));
}

export function removeDesktopFilterSelection(
  filters: DesktopCatalogFilters,
  key: DesktopCatalogFilterKey,
): DesktopCatalogFilters {
  return { ...filters, [key]: "", ...(key === "make" ? { model: "" } : {}) };
}
