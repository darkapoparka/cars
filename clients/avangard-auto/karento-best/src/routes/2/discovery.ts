import type { VehicleCardContent } from "#lib/content.ts";
import { normalizeCatalogBudget } from "#lib/data/mobile-catalog.ts";

export interface DiscoveryCar extends VehicleCardContent {
  priceAmount: number;
  currency: string;
  id: string;
  make: string;
  year: number;
  arrival: number;
  offer: boolean;
  exclusive: boolean;
  body: string;
}


export const discoveryCars: readonly DiscoveryCar[] = [
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-01-1.webp",
    "imageAlt": "VW Passat Alltrack",
    "href": "/vehicle?id=11785010475119627",
    "title": "VW Passat Alltrack",
    "location": "Варна",
    "mileage": "220000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "13500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 13500,
    "currency": "EUR",
    "mileageValue": 220000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11785010475119627",
    "make": "VW",
    "year": 2018,
    "body": "wagon",
    "arrival": 16,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-02-1.webp",
    "imageAlt": "Volvo XC40 2.0D",
    "href": "/vehicle?id=21783748809976935",
    "title": "Volvo XC40 2.0D",
    "location": "Варна",
    "mileage": "166000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "17999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 17999,
    "currency": "EUR",
    "mileageValue": 166000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21783748809976935",
    "make": "Volvo",
    "year": 2019,
    "body": "suv",
    "arrival": 15,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-03-1.webp",
    "imageAlt": "Volvo XC40 T5 inscription",
    "href": "/vehicle?id=21766322242220471",
    "title": "Volvo XC40 T5 inscription",
    "location": "Варна",
    "mileage": "278000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "16900 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 16900,
    "currency": "EUR",
    "mileageValue": 278000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "21766322242220471",
    "make": "Volvo",
    "year": 2019,
    "body": "suv",
    "arrival": 14,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-04-1.webp",
    "imageAlt": "Peugeot 208 1.6HDI",
    "href": "/vehicle?id=11782450720679744",
    "title": "Peugeot 208 1.6HDI",
    "location": "Варна",
    "mileage": "214000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "5800 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5800,
    "currency": "EUR",
    "mileageValue": 214000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11782450720679744",
    "make": "Peugeot",
    "year": 2016,
    "body": "hatchback",
    "arrival": 13,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-05-1.webp",
    "imageAlt": "Peugeot 2008 1.6HDI",
    "href": "/vehicle?id=11782462832415648",
    "title": "Peugeot 2008 1.6HDI",
    "location": "Варна",
    "mileage": "216000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "6999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 6999,
    "currency": "EUR",
    "mileageValue": 216000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11782462832415648",
    "make": "Peugeot",
    "year": 2013,
    "body": "hatchback",
    "arrival": 12,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-06-1.webp",
    "imageAlt": "Nissan Qashqai 1.5dCi",
    "href": "/vehicle?id=21776284342452600",
    "title": "Nissan Qashqai 1.5dCi",
    "location": "Варна",
    "mileage": "175000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "11500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 11500,
    "currency": "EUR",
    "mileageValue": 175000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "21776284342452600",
    "make": "Nissan",
    "year": 2018,
    "body": "suv",
    "arrival": 11,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-07-1.webp",
    "imageAlt": "Mitsubishi Outlander 2.2DI-D",
    "href": "/vehicle?id=21773782041228539",
    "title": "Mitsubishi Outlander 2.2DI-D",
    "location": "Варна",
    "mileage": "167000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "9350 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 9350,
    "currency": "EUR",
    "mileageValue": 167000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "21773782041228539",
    "make": "Mitsubishi",
    "year": 2014,
    "body": "suv",
    "arrival": 10,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-08-1.webp",
    "imageAlt": "Kia Sportage 1.7CRDI",
    "href": "/vehicle?id=21760385289842805",
    "title": "Kia Sportage 1.7CRDI",
    "location": "Варна",
    "mileage": "179000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "8500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 8500,
    "currency": "EUR",
    "mileageValue": 179000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "21760385289842805",
    "make": "Kia",
    "year": 2014,
    "body": "suv",
    "arrival": 9,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-09-1.webp",
    "imageAlt": "BMW X1 2.0D",
    "href": "/vehicle?id=21785012088488667",
    "title": "BMW X1 2.0D",
    "location": "Варна",
    "mileage": "138000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "14500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 14500,
    "currency": "EUR",
    "mileageValue": 138000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21785012088488667",
    "make": "BMW",
    "year": 2016,
    "body": "suv",
    "arrival": 8,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-10-1.webp",
    "imageAlt": "BMW X1 2.0D",
    "href": "/vehicle?id=21746821020349714",
    "title": "BMW X1 2.0D",
    "location": "Варна",
    "mileage": "187000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "5999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5999,
    "currency": "EUR",
    "mileageValue": 187000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "21746821020349714",
    "make": "BMW",
    "year": 2010,
    "body": "suv",
    "arrival": 7,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-11-1.webp",
    "imageAlt": "BMW 320 i",
    "href": "/vehicle?id=11754080933689299",
    "title": "BMW 320 i",
    "location": "Варна",
    "mileage": "187000 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "wagon",
    "price": "6300 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 6300,
    "currency": "EUR",
    "mileageValue": 187000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11754080933689299",
    "make": "BMW",
    "year": 2013,
    "body": "wagon",
    "arrival": 6,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-12-1.webp",
    "imageAlt": "Audi SQ5 3.0V6T ZF",
    "href": "/vehicle?id=21779794798955793",
    "title": "Audi SQ5 3.0V6T ZF",
    "location": "Варна",
    "mileage": "197000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "21999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 21999,
    "currency": "EUR",
    "mileageValue": 197000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "21779794798955793",
    "make": "Audi",
    "year": 2018,
    "body": "suv",
    "arrival": 5,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-13-1.webp",
    "imageAlt": "Audi Q7 Premium Plus",
    "href": "/vehicle?id=21786111867697018",
    "title": "Audi Q7 Premium Plus",
    "location": "Варна",
    "mileage": "255000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "20500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 20500,
    "currency": "EUR",
    "mileageValue": 255000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "21786111867697018",
    "make": "Audi",
    "year": 2017,
    "body": "suv",
    "arrival": 4,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-14-1.webp",
    "imageAlt": "Audi Q5 SQ5 3.0V6T",
    "href": "/vehicle?id=21779802183945718",
    "title": "Audi Q5 SQ5 3.0V6T",
    "location": "Варна",
    "mileage": "197000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "21999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 21999,
    "currency": "EUR",
    "mileageValue": 197000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "21779802183945718",
    "make": "Audi",
    "year": 2018,
    "body": "suv",
    "arrival": 3,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-15-1.webp",
    "imageAlt": "Audi Q5 Premium Plus",
    "href": "/vehicle?id=21762503862293800",
    "title": "Audi Q5 Premium Plus",
    "location": "Варна",
    "mileage": "206000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "17999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 17999,
    "currency": "EUR",
    "mileageValue": 206000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "21762503862293800",
    "make": "Audi",
    "year": 2018,
    "body": "suv",
    "arrival": 2,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/avangard/vehicle-16-1.webp",
    "imageAlt": "Audi A4 2.0TDI",
    "href": "/vehicle?id=11787435697096424",
    "title": "Audi A4 2.0TDI",
    "location": "Варна",
    "mileage": "202000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "6300 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 6300,
    "currency": "EUR",
    "mileageValue": 202000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11787435697096424",
    "make": "Audi",
    "year": 2011,
    "body": "wagon",
    "arrival": 1,
    "offer": false,
    "exclusive": false
  }
];

export const collections: readonly { id: CollectionId; title: DiscoveryTextKey }[] = [
  {
    "id": "newest",
    "title": "all"
  },
  {
    "id": "cheapest",
    "title": "cheapest"
  },
  {
    "id": "bmw",
    "title": "bmw"
  },
  {
    "id": "german",
    "title": "german"
  },
  {
    "id": "suvs",
    "title": "suvs"
  }
];
export type Collection = (typeof collections)[number];
export type CollectionId = "newest" | "offers" | "under-10000" | "cheapest" | "premium" | "exclusive" | "under-20000" | "bmw" | "german" | "suvs";

export function findCollection(id: string | null): Collection | undefined {
  return collections.find((collection) => collection.id === id);
}

export function findCar(id: string | null): DiscoveryCar | undefined {
  return discoveryCars.find((car) => car.id === id);
}

export interface DiscoveryFilters {
  make: string;
  model: string;
  priceMax: string;
  yearFrom: string;
  yearTo: string;
}

export const emptyDiscoveryFilters: Readonly<DiscoveryFilters> = {
  make: "",
  model: "",
  priceMax: "",
  yearFrom: "",
  yearTo: "",
};
export const discoveryBrands = [
  ...new Set(discoveryCars.map((car) => car.make)),
].toSorted((a, b) => a.localeCompare(b));
export const discoveryYears = [
  ...new Set(discoveryCars.map((car) => car.year)),
].toSorted((a, b) => b - a);

export type DiscoveryPanel = "make" | "model" | "price" | "year";
export const discoveryPanels = [
  { id: "make", title: "make" },
  { id: "model", title: "model" },
  { id: "price", title: "price" },
  { id: "year", title: "year" },
] as const;

/** The demo offers its supplied vehicle names; it does not invent model metadata. */
export function discoveryModels(make: string) {
  return discoveryCars
    .filter((car) => car.make === make)
    .map((car) => ({
      value: car.title,
      label: discoveryModelLabel(make, car.title),
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));
}

export function discoveryModelLabel(make: string, value: string): string {
  const name = value.startsWith(make + " ")
    ? value.slice(make.length + 1)
    : value;
  return name ? name[0].toLocaleUpperCase() + name.slice(1) : "";
}

export function readDiscoveryFilters(
  params: Pick<URLSearchParams, "get">,
): DiscoveryFilters {
  const make = params.get("make") ?? "";
  const model = params.get("model") ?? "";
  const year = (key: string) => {
    const value = params.get(key) ?? "";
    return discoveryYears.includes(Number(value)) ? String(Number(value)) : "";
  };
  return {
    make: discoveryBrands.includes(make) ? make : "",
    model: discoveryModels(make).some((option) => option.value === model)
      ? model
      : "",
    priceMax: normalizeCatalogBudget(params.get("priceMax") ?? "") ?? "",
    yearFrom: year("yearFrom"),
    yearTo: year("yearTo"),
  };
}

export function searchCars(
  query: string,
  filters: DiscoveryFilters = emptyDiscoveryFilters,
): DiscoveryCar[] {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const budget = normalizeCatalogBudget(filters.priceMax);
  if (budget === undefined) return [];
  return discoveryCars
    .filter((car) => {
      if (filters.make && car.make !== filters.make) return false;
      if (filters.make && filters.model && car.title !== filters.model)
        return false;
      if (budget && car.priceAmount > Number(budget)) return false;
      if (filters.yearFrom && car.year < Number(filters.yearFrom)) return false;
      if (filters.yearTo && car.year > Number(filters.yearTo)) return false;
      const text =
        `${car.title} ${car.make} ${car.year} ${car.body}`.toLocaleLowerCase();
      return terms.every((term) => text.includes(term));
    })
    .toSorted((a, b) => b.arrival - a.arrival);
}

export function discoveryDestination(
  query: string,
  filters: DiscoveryFilters,
  parameters: Pick<URLSearchParams, "toString"> = new URLSearchParams(),
  hash = "",
): string {
  const next = new URLSearchParams(parameters.toString());
  for (const key of ["car", "collection", "returnTo"]) next.delete(key);
  next.set("q", query.trim());
  for (const key of [
    "make",
    "model",
    "priceMax",
    "yearFrom",
    "yearTo",
  ] as const) {
    const value =
      key === "priceMax"
        ? normalizeCatalogBudget(filters[key])
        : key === "model"
          ? discoveryModels(filters.make).some(
              (option) => option.value === filters.model,
            )
            ? filters.model
            : ""
          : filters[key];
    if (value) next.set(key, value);
    else next.delete(key);
  }
  return "/2?" + next.toString() + hash;
}

/** Detail return links stay inside the mobile experiment, including direct loads. */
export function discoveryReturn(value: string | null): string {
  if (!value || !/^\/2(?:[?#]|$)/.test(value)) return "/2";
  const destination = new URL(value, "https://preview.invalid");
  if (destination.pathname !== "/2" || destination.searchParams.has("car"))
    return "/2";
  destination.searchParams.delete("returnTo");
  return destination.pathname + destination.search + destination.hash;
}

export function discoveryYearLabel(
  filters: DiscoveryFilters,
  locale: "en" | "bg",
): string {
  return filters.yearFrom === filters.yearTo
    ? filters.yearFrom
    : filters.yearFrom && filters.yearTo
      ? filters.yearFrom + "–" + filters.yearTo
      : filters.yearFrom
        ? discoveryText(locale, "yearFrom") + " " + filters.yearFrom
        : filters.yearTo
          ? discoveryText(locale, "yearTo") + " " + filters.yearTo
          : "";
}

export function collectionCars(id: CollectionId): DiscoveryCar[] {
  const byPrice = (a: DiscoveryCar, b: DiscoveryCar) =>
    a.priceAmount - b.priceAmount;
  switch (id) {
    case "newest":
      return discoveryCars.toSorted((a, b) => b.arrival - a.arrival);
    case "offers":
      return discoveryCars.filter((car) => car.offer);
    case "under-10000":
      return discoveryCars
        .filter((car) => car.priceAmount <= 10000)
        .toSorted(byPrice);
    case "cheapest":
      return discoveryCars.toSorted(byPrice);
    case "premium":
      return discoveryCars
        .filter((car) => car.priceAmount >= 40000)
        .toSorted((a, b) => byPrice(b, a));
    case "exclusive":
      return discoveryCars.filter((car) => car.exclusive);
    case "under-20000":
      return discoveryCars
        .filter((car) => car.priceAmount <= 20000)
        .toSorted(byPrice);
    case "bmw":
      return discoveryCars.filter((car) => car.make === "BMW");
    case "german":
      return discoveryCars.filter((car) =>
        ["Audi", "BMW", "Mercedes-Benz", "Volkswagen"].includes(car.make),
      );
    case "suvs":
      return discoveryCars.filter((car) => car.body === "suv");
  }
}

const en = {
  home: "Home",
  newest: "Newest cars",
  offers: "Top offers",
  under10: "Up to €10,000",
  cheapest: "Cheapest cars",
  premium: "Premium cars",
  exclusive: "Exclusive cars",
  under20: "Up to €20,000",
  bmw: "Explore BMW",
  german: "German favourites",
  suvs: "SUVs for every day",
  all: "All cars",
  pricePill: "Up to €10k",
  brandPill: "By brand",
  suvPill: "SUVs",
  explore: "Explore cars",
  search: "Search cars",
  searchPlaceholder: "Search cars or keywords",
  searchResults: "Search results",
  searchIntro: "Choose a brand and your budget.",
  make: "Make",
  model: "Model",
  price: "Price",
  filters: "Search options",
  anyModel: "Any model",
  findMake: "Find a make",
  findModel: "Find a model",
  makeFirst: "Choose a make to see its available cars.",
  chooseMake: "Choose a make",
  modelContext: "Cars from",
  noOptions: "No matching options. Try another search.",
  budget: "Budget",
  anyBudget: "Any price",
  maximumPrice: "Maximum price (EUR)",
  budgetError: "Enter a positive amount, such as 25000.",
  keywordHint: "Add a car or keyword",
  upTo: "Up to",
  removeFilter: "Remove",
  backResults: "Back to results",
  backSearch: "Back to search",
  keyword: "Car or keyword",
  keywordPlaceholder: "Try SUV, Toyota or 2020",
  brand: "Brand",
  anyBrand: "Any brand",
  anyYear: "Any year",
  yearFrom: "From",
  yearTo: "To",
  newer: "2020 or newer",
  yearRange: "Year range",
  clearAll: "Clear all",
  showCars: "Show cars",
  noResults: "No cars found. Try a wider budget, another brand or year.",
  viewAll: "View all",
  back: "Back",
  backHome: "Back to collections",
  sample: "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.",
  sampleDetail:
    "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.",
  year: "Year",
  mileage: "Mileage",
  fuel: "Fuel",
  transmission: "Transmission",
  more: "Explore more cars",
} as const;
export type DiscoveryTextKey = keyof typeof en;
const bg: Record<DiscoveryTextKey, string> = {
  home: "Начало",
  newest: "Най-нови коли",
  offers: "Топ оферти",
  under10: "До 10 000 €",
  cheapest: "Най-евтини коли",
  premium: "Премиум коли",
  exclusive: "Ексклузивни коли",
  under20: "До 20 000 €",
  bmw: "Разгледай BMW",
  german: "Немски автомобили",
  suvs: "SUV за всеки ден",
  all: "Всички коли",
  pricePill: "До 10 000 €",
  brandPill: "По марка",
  suvPill: "SUV",
  explore: "Разгледай коли",
  search: "Търси коли",
  searchPlaceholder: "Търси кола или ключова дума",
  searchResults: "Резултати от търсенето",
  searchIntro: "Избери марка и бюджет.",
  make: "Марка",
  model: "Модел",
  price: "Цена",
  filters: "Опции за търсене",
  anyModel: "Всички модели",
  findMake: "Намери марка",
  findModel: "Намери модел",
  makeFirst: "Избери марка, за да видиш нейните налични коли.",
  chooseMake: "Избери марка",
  modelContext: "Коли от",
  noOptions: "Няма съвпадащи опции. Опитай друго търсене.",
  budget: "Бюджет",
  anyBudget: "Без ограничение",
  maximumPrice: "Максимална цена (EUR)",
  budgetError: "Въведи положителна сума, например 25000.",
  keywordHint: "Добави кола или ключова дума",
  upTo: "До",
  removeFilter: "Премахни",
  backResults: "Назад към резултатите",
  backSearch: "Назад към търсенето",
  keyword: "Кола или ключова дума",
  keywordPlaceholder: "Например SUV, Toyota или 2020",
  brand: "Марка",
  anyBrand: "Всички марки",
  anyYear: "Всички години",
  yearFrom: "От",
  yearTo: "До",
  newer: "2020 или по-нови",
  yearRange: "Години на производство",
  clearAll: "Изчисти",
  showCars: "Виж коли",
  noResults: "Няма намерени коли. Опитай друга марка, кола или година.",
  viewAll: "Виж всички",
  back: "Назад",
  backHome: "Назад към колекциите",
  sample: "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.",
  sampleDetail:
    "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.",
  year: "Година",
  mileage: "Пробег",
  fuel: "Гориво",
  transmission: "Скорости",
  more: "Разгледай още коли",
};
export function discoveryText(
  locale: "en" | "bg",
  key: DiscoveryTextKey,
): string {
  return (locale === "bg" ? bg : en)[key];
}
