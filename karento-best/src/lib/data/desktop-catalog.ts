import {
  catalogDestination,
  catalogFilterKeys,
  matchCatalog,
  readCatalogFilters,
  type CatalogFilters,
  type CatalogItem,
} from "./mobile-catalog.ts";

export interface DesktopCatalogFilters extends CatalogFilters {
  type: string;
  minPrice: string;
  fuel: string;
  transmission: string;
  maxMileage: string;
  minSeats: string;
}

export const desktopCatalogFilterKeys = [
  "type",
  ...catalogFilterKeys,
  "minPrice",
  "fuel",
  "transmission",
  "maxMileage",
  "minSeats",
] as const;

export type DesktopCatalogFilterKey = (typeof desktopCatalogFilterKeys)[number];

export const desktopCatalogFilterLabels: Record<
  DesktopCatalogFilterKey,
  string
> = {
  type: "Type",
  q: "Search",
  make: "Make",
  model: "Model",
  budget: "Maximum price",
  minPrice: "Minimum price",
  fuel: "Fuel",
  transmission: "Transmission",
  maxMileage: "Maximum mileage",
  minSeats: "Minimum seats",
};

export const desktopCatalogFilterMessageKeys = {
  type: "catalog.type",
  q: "action.search",
  make: "catalog.make",
  model: "catalog.model",
  budget: "catalog.maximumPrice",
  minPrice: "catalog.minimumPrice",
  fuel: "vehicle.fuel",
  transmission: "vehicle.transmission",
  maxMileage: "catalog.maximumMileage",
  minSeats: "catalog.minimumSeats",
} as const;

export type TypedCatalogItem = CatalogItem & {
  bodyType?: string;
  sample?: boolean;
  fuel?: string;
  transmission?: string;
  mileage?: string;
  seats?: string;
};

// Explicit sample classifications. Ambiguous body variants remain unclassified.
// A real dealer listing must provide its own bodyType through the content boundary.
const sampleBodyTypes: Readonly<Record<string, string>> = {
  "Hyundai Sonata SEL Plus": "Sedan",
  "Buick Enclave Avenir": "SUV",
  "Chevrolet Silverado": "Pickup",
  "Subaru Outback Limited XT": "Estate",
  "Jeep Wrangler": "SUV",
  "Kia Telluride SX": "SUV",
  "Mini Cooper S Hardtop 2 Door": "Hatchback",
  "Audi Q5 2.0T Premium Plus": "SUV",
  "GMC Sierra 2500HD Denali": "Pickup",
  "Toyota Camry LE Hybrid": "Sedan",
};

export function vehicleBodyType(item: TypedCatalogItem): string {
  return (
    item.bodyType ??
    (item.sample && Object.hasOwn(sampleBodyTypes, item.title)
      ? sampleBodyTypes[item.title]
      : "")
  );
}

export function readDesktopCatalogFilters(
  parameters: Pick<URLSearchParams, "get">,
): DesktopCatalogFilters {
  return {
    ...readCatalogFilters(parameters),
    type: parameters.get("type")?.trim() ?? "",
    minPrice: positiveParameter(parameters, "minPrice"),
    fuel: parameters.get("fuel")?.trim() ?? "",
    transmission: parameters.get("transmission")?.trim() ?? "",
    maxMileage: positiveParameter(parameters, "maxMileage"),
    minSeats: positiveParameter(parameters, "minSeats", true),
  };
}

function positiveParameter(
  parameters: Pick<URLSearchParams, "get">,
  key: string,
  integer = false,
): string {
  const value = Number(parameters.get(key));
  return Number.isFinite(value) &&
    value > 0 &&
    (!integer || Number.isInteger(value))
    ? String(value)
    : "";
}

export function catalogMileageInMiles(value = ""): number | null {
  const match = value
    .trim()
    .match(/^([\d,]+(?:\.\d+)?)\s*(miles?|mi|km|kilomet(?:er|re)s?)$/i);
  if (!match) return null;
  const amount = Number(match[1].replaceAll(",", ""));
  return Number.isFinite(amount)
    ? amount * (/^(km|kilo)/i.test(match[2]) ? 0.621371192 : 1)
    : null;
}

function catalogSeats(value = ""): number | null {
  const match = value.trim().match(/^(\d+)\s*(?:seats?)?$/i);
  return match ? Number(match[1]) : null;
}

export function desktopCatalogFilterValue(
  key: DesktopCatalogFilterKey,
  value: string,
  currency: string,
  locale: string,
): string {
  const amount = Number(value).toLocaleString(locale);
  if (key === "budget") return `Up to ${currency}${amount}`;
  if (key === "minPrice") return `From ${currency}${amount}`;
  if (key === "maxMileage") return `Up to ${amount} miles`;
  if (key === "minSeats") return `${amount}+ seats`;
  return value;
}

export function matchDesktopCatalog<T extends TypedCatalogItem>(
  items: readonly T[],
  filters: DesktopCatalogFilters,
): T[] {
  return matchCatalog(items, filters).filter((item) => {
    const mileage = catalogMileageInMiles(item.mileage);
    const seats = catalogSeats(item.seats);
    const price = Number(item.price.replace(/[^\d.]/g, ""));
    return (
      (!filters.type || vehicleBodyType(item) === filters.type) &&
      (!filters.minPrice || price >= Number(filters.minPrice)) &&
      (!filters.fuel || item.fuel?.trim() === filters.fuel) &&
      (!filters.transmission ||
        item.transmission?.trim() === filters.transmission) &&
      (!filters.maxMileage ||
        (mileage !== null && mileage <= Number(filters.maxMileage))) &&
      (!filters.minSeats ||
        (seats !== null && seats >= Number(filters.minSeats)))
    );
  });
}

export function desktopCatalogDestination(
  pathname: string,
  filters: DesktopCatalogFilters,
  parameters: Pick<URLSearchParams, "toString"> = new URLSearchParams(),
  hash = "#vehicle-results",
): string {
  const remaining = new URLSearchParams(parameters.toString());
  for (const key of desktopCatalogFilterKeys) {
    if (filters[key]) remaining.set(key, filters[key]);
    else remaining.delete(key);
  }
  return catalogDestination(pathname, filters, remaining, hash);
}

export function clearDesktopCatalogDestination(
  pathname: string,
  parameters: Pick<URLSearchParams, "toString">,
): string {
  return desktopCatalogDestination(
    pathname,
    readDesktopCatalogFilters(new URLSearchParams()),
    parameters,
  );
}

export function removeDesktopCatalogFilterDestination(
  pathname: string,
  parameters: Pick<URLSearchParams, "toString">,
  key: DesktopCatalogFilterKey,
): string {
  const remaining = new URLSearchParams(parameters.toString());
  remaining.delete("filters");
  remaining.delete(key);
  if (key === "make") remaining.delete("model");
  const query = remaining.toString();
  return pathname + (query ? "?" + query : "") + "#vehicle-results";
}

export function selectDesktopCatalogTypeDestination(
  pathname: string,
  parameters: Pick<URLSearchParams, "toString">,
  type: string,
): string {
  const remaining = new URLSearchParams(parameters.toString());
  remaining.delete("filters");
  if ((remaining.get("type") ?? "") !== type) {
    remaining.delete("make");
    remaining.delete("model");
  }
  if (type) remaining.set("type", type);
  else remaining.delete("type");
  const query = remaining.toString();
  return pathname + (query ? "?" + query : "") + "#vehicle-results";
}
