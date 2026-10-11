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
    "image": "/assets/priselci/vehicle-01-1.webp",
    "imageAlt": "VW Golf 1.4 БЕНЗИН",
    "href": "/vehicle?id=11784527405061757",
    "title": "VW Golf 1.4 БЕНЗИН",
    "location": "Варна",
    "mileage": "235193 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "3600 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3600,
    "currency": "EUR",
    "mileageValue": 235193,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11784527405061757",
    "make": "VW",
    "year": 2007,
    "body": "hatchback",
    "arrival": 16,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-02-1.webp",
    "imageAlt": "VW Passat 1.4 БЕНЗИН",
    "href": "/vehicle?id=11758270885113337",
    "title": "VW Passat 1.4 БЕНЗИН",
    "location": "Варна",
    "mileage": "179848 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "wagon",
    "price": "4299 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 4299,
    "currency": "EUR",
    "mileageValue": 179848,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11758270885113337",
    "make": "VW",
    "year": 2010,
    "body": "wagon",
    "arrival": 15,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-03-1.webp",
    "imageAlt": "VW Passat 2.0TDI COMMONRAIL",
    "href": "/vehicle?id=11753962633467246",
    "title": "VW Passat 2.0TDI COMMONRAIL",
    "location": "Варна",
    "mileage": "210534 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "3900 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3900,
    "currency": "EUR",
    "mileageValue": 210534,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11753962633467246",
    "make": "VW",
    "year": 2008,
    "body": "wagon",
    "arrival": 14,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-04-1.webp",
    "imageAlt": "Seat Ibiza 1.2 БЕНЗИН",
    "href": "/vehicle?id=11784527857493559",
    "title": "Seat Ibiza 1.2 БЕНЗИН",
    "location": "Варна",
    "mileage": "175532 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "3499 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3499,
    "currency": "EUR",
    "mileageValue": 175532,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11784527857493559",
    "make": "Seat",
    "year": 2010,
    "body": "hatchback",
    "arrival": 13,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-05-1.webp",
    "imageAlt": "Renault Koleos 2.0 ДИЗЕЛ 4Х4",
    "href": "/vehicle?id=21754395406651747",
    "title": "Renault Koleos 2.0 ДИЗЕЛ 4Х4",
    "location": "Варна",
    "mileage": "181246 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "44299 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 44299,
    "currency": "EUR",
    "mileageValue": 181246,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "21754395406651747",
    "make": "Renault",
    "year": 2010,
    "body": "suv",
    "arrival": 12,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-06-1.webp",
    "imageAlt": "Peugeot 307 CC КАБРИО",
    "href": "/vehicle?id=11781856640282742",
    "title": "Peugeot 307 CC КАБРИО",
    "location": "Варна",
    "mileage": "205664 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "convertible",
    "price": "2899 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 2899,
    "currency": "EUR",
    "mileageValue": 205664,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11781856640282742",
    "make": "Peugeot",
    "year": 2006,
    "body": "convertible",
    "arrival": 11,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-07-1.webp",
    "imageAlt": "Ford Mondeo 2.0 DIZEL",
    "href": "/vehicle?id=11759747090481666",
    "title": "Ford Mondeo 2.0 DIZEL",
    "location": "Варна",
    "mileage": "235788 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "3299 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3299,
    "currency": "EUR",
    "mileageValue": 235788,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11759747090481666",
    "make": "Ford",
    "year": 2009,
    "body": "wagon",
    "arrival": 10,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-08-1.webp",
    "imageAlt": "Peugeot 5008 2.0HDI 150К.С",
    "href": "/vehicle?id=11776863022154449",
    "title": "Peugeot 5008 2.0HDI 150К.С",
    "location": "Варна",
    "mileage": "210452 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "van",
    "price": "5099 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5099,
    "currency": "EUR",
    "mileageValue": 210452,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11776863022154449",
    "make": "Peugeot",
    "year": 2011,
    "body": "van",
    "arrival": 9,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-09-1.webp",
    "imageAlt": "Mercedes-Benz C 200 2.2 CDI",
    "href": "/vehicle?id=11751891575433302",
    "title": "Mercedes-Benz C 200 2.2 CDI",
    "location": "Варна",
    "mileage": "218432 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "2799 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 2799,
    "currency": "EUR",
    "mileageValue": 218432,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11751891575433302",
    "make": "Mercedes-Benz",
    "year": 2004,
    "body": "wagon",
    "arrival": 8,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-10-1.webp",
    "imageAlt": "Citroen C3 Picasso 1.6HDI 90К.С",
    "href": "/vehicle?id=11787126157294169",
    "title": "Citroen C3 Picasso 1.6HDI 90К.С",
    "location": "Варна",
    "mileage": "185783 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "3499 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3499,
    "currency": "EUR",
    "mileageValue": 185783,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11787126157294169",
    "make": "Citroen",
    "year": 2010,
    "body": "hatchback",
    "arrival": 7,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-11-1.webp",
    "imageAlt": "Audi A3 1.9 TDI 105ps",
    "href": "/vehicle?id=11784638939574277",
    "title": "Audi A3 1.9 TDI 105ps",
    "location": "Варна",
    "mileage": "253746 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "4699 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 4699,
    "currency": "EUR",
    "mileageValue": 253746,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11784638939574277",
    "make": "Audi",
    "year": 2009,
    "body": "hatchback",
    "arrival": 6,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-12-1.webp",
    "imageAlt": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ",
    "href": "/vehicle?id=11779190417819998",
    "title": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ",
    "location": "Варна",
    "mileage": "136016 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "2500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 2500,
    "currency": "EUR",
    "mileageValue": 136016,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11779190417819998",
    "make": "Dacia",
    "year": 2009,
    "body": "hatchback",
    "arrival": 5,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-13-1.webp",
    "imageAlt": "Renault Grand scenic 1.5DCI",
    "href": "/vehicle?id=11770812815337634",
    "title": "Renault Grand scenic 1.5DCI",
    "location": "Варна",
    "mileage": "199811 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "van",
    "price": "4299 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 4299,
    "currency": "EUR",
    "mileageValue": 199811,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11770812815337634",
    "make": "Renault",
    "year": 2012,
    "body": "van",
    "arrival": 4,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-14-1.webp",
    "imageAlt": "BMW X3 2.0 ДИЗЕЛ 4Х4",
    "href": "/vehicle?id=21786691566300206",
    "title": "BMW X3 2.0 ДИЗЕЛ 4Х4",
    "location": "Варна",
    "mileage": "207195 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "44399 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 44399,
    "currency": "EUR",
    "mileageValue": 207195,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "21786691566300206",
    "make": "BMW",
    "year": 2007,
    "body": "suv",
    "arrival": 3,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-15-1.webp",
    "imageAlt": "Nissan Qashqai 1.5 DCI",
    "href": "/vehicle?id=21787900875118991",
    "title": "Nissan Qashqai 1.5 DCI",
    "location": "Варна",
    "mileage": "192641 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "5499 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5499,
    "currency": "EUR",
    "mileageValue": 192641,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "21787900875118991",
    "make": "Nissan",
    "year": 2012,
    "body": "suv",
    "arrival": 2,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/priselci/vehicle-16-1.webp",
    "imageAlt": "Mercedes-Benz E 280 3.0CDI V6",
    "href": "/vehicle?id=11763969547989753",
    "title": "Mercedes-Benz E 280 3.0CDI V6",
    "location": "Варна",
    "mileage": "208357 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "sedan",
    "price": "64100 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 64100,
    "currency": "EUR",
    "mileageValue": 208357,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11763969547989753",
    "make": "Mercedes-Benz",
    "year": 2005,
    "body": "sedan",
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
