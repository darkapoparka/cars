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
    "image": "/assets/automarket/vehicle-01-1.webp",
    "imageAlt": "Ford Focus 1.6D 115HP",
    "href": "/vehicle?id=11785576029711434",
    "title": "Ford Focus 1.6D 115HP",
    "location": "Варна",
    "mileage": "249000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "5112 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5112,
    "currency": "EUR",
    "mileageValue": 249000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11785576029711434",
    "make": "Ford",
    "year": 2014,
    "body": "wagon",
    "arrival": 16,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-02-1.webp",
    "imageAlt": "Opel Astra 1.4i 90HP",
    "href": "/vehicle?id=11714813323555032",
    "title": "Opel Astra 1.4i 90HP",
    "location": "Варна",
    "mileage": "208000 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "2555.95 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 2555.95,
    "currency": "EUR",
    "mileageValue": 208000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11714813323555032",
    "make": "Opel",
    "year": 2006,
    "body": "hatchback",
    "arrival": 15,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-03-1.webp",
    "imageAlt": "Opel Corsa 1.2i 80HP GPL",
    "href": "/vehicle?id=11776340911802527",
    "title": "Opel Corsa 1.2i 80HP GPL",
    "location": "Варна",
    "mileage": "165000 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "2999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 2999,
    "currency": "EUR",
    "mileageValue": 165000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11776340911802527",
    "make": "Opel",
    "year": 2009,
    "body": "hatchback",
    "arrival": 14,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-04-1.webp",
    "imageAlt": "Ford Fiesta 1.25i 82HP FACE LIFT",
    "href": "/vehicle?id=11749035353735625",
    "title": "Ford Fiesta 1.25i 82HP FACE LIFT",
    "location": "Варна",
    "mileage": "227000 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "3799 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3799,
    "currency": "EUR",
    "mileageValue": 227000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11749035353735625",
    "make": "Ford",
    "year": 2012,
    "body": "hatchback",
    "arrival": 13,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-05-1.webp",
    "imageAlt": "Honda Jazz 1.4 I-VTEC 99HP FACE LIFT",
    "href": "/vehicle?id=11646385836417474",
    "title": "Honda Jazz 1.4 I-VTEC 99HP FACE LIFT",
    "location": "Варна",
    "mileage": "197000 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "3885.31 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3885.31,
    "currency": "EUR",
    "mileageValue": 197000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11646385836417474",
    "make": "Honda",
    "year": 2009,
    "body": "hatchback",
    "arrival": 12,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-06-1.webp",
    "imageAlt": "Opel Meriva 1.4 TURBO 120HP GPL",
    "href": "/vehicle?id=11730904111658789",
    "title": "Opel Meriva 1.4 TURBO 120HP GPL",
    "location": "Варна",
    "mileage": "156000 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "van",
    "price": "4499 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 4499,
    "currency": "EUR",
    "mileageValue": 156000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11730904111658789",
    "make": "Opel",
    "year": 2012,
    "body": "van",
    "arrival": 11,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-07-1.webp",
    "imageAlt": "VW Golf 1.6TDI 105HP DSG",
    "href": "/vehicle?id=11664339654646848",
    "title": "VW Golf 1.6TDI 105HP DSG",
    "location": "Варна",
    "mileage": "213000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "4999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 4999,
    "currency": "EUR",
    "mileageValue": 213000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11664339654646848",
    "make": "VW",
    "year": 2010,
    "body": "wagon",
    "arrival": 10,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-08-1.webp",
    "imageAlt": "Nissan Qashqai 1.6i 117HP FACE LIFT",
    "href": "/vehicle?id=21702843989932817",
    "title": "Nissan Qashqai 1.6i 117HP FACE LIFT",
    "location": "Варна",
    "mileage": "223000 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "5799 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5799,
    "currency": "EUR",
    "mileageValue": 223000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "21702843989932817",
    "make": "Nissan",
    "year": 2011,
    "body": "suv",
    "arrival": 9,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-09-1.webp",
    "imageAlt": "Dacia Duster 1.5DCI 110HP AWD E5A",
    "href": "/vehicle?id=21777122320477562",
    "title": "Dacia Duster 1.5DCI 110HP AWD E5A",
    "location": "Варна",
    "mileage": "232000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "5799 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5799,
    "currency": "EUR",
    "mileageValue": 232000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "21777122320477562",
    "make": "Dacia",
    "year": 2011,
    "body": "suv",
    "arrival": 8,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-10-1.webp",
    "imageAlt": "Mazda CX-3 1.5D SKYACTIV 105HP AWD AUTO",
    "href": "/vehicle?id=21777123440688076",
    "title": "Mazda CX-3 1.5D SKYACTIV 105HP AWD AUTO",
    "location": "Варна",
    "mileage": "155000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "9999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 9999,
    "currency": "EUR",
    "mileageValue": 155000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21777123440688076",
    "make": "Mazda",
    "year": 2016,
    "body": "suv",
    "arrival": 7,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-11-1.webp",
    "imageAlt": "VW Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic",
    "href": "/vehicle?id=11764611602990623",
    "title": "VW Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic",
    "location": "Варна",
    "mileage": "207000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "12399 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 12399,
    "currency": "EUR",
    "mileageValue": 207000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11764611602990623",
    "make": "VW",
    "year": 2016,
    "body": "wagon",
    "arrival": 6,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-12-1.webp",
    "imageAlt": "Suzuki Swift 1.2 HYBRID 83HP AUTOMATIC",
    "href": "/vehicle?id=11770373711900410",
    "title": "Suzuki Swift 1.2 HYBRID 83HP AUTOMATIC",
    "location": "Варна",
    "mileage": "39000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "12781 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 12781,
    "currency": "EUR",
    "mileageValue": 39000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "11770373711900410",
    "make": "Suzuki",
    "year": 2021,
    "body": "hatchback",
    "arrival": 5,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-13-1.webp",
    "imageAlt": "BMW X3 2.0 X-Drive 184HP",
    "href": "/vehicle?id=21732197261233954",
    "title": "BMW X3 2.0 X-Drive 184HP",
    "location": "Варна",
    "mileage": "249000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "12526 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 12526,
    "currency": "EUR",
    "mileageValue": 249000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21732197261233954",
    "make": "BMW",
    "year": 2014,
    "body": "suv",
    "arrival": 4,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-14-1.webp",
    "imageAlt": "VW Tiguan 2.0TDI 200HP ALLSPACE 4-Motion",
    "href": "/vehicle?id=21781689983828599",
    "title": "VW Tiguan 2.0TDI 200HP ALLSPACE 4-Motion",
    "location": "Варна",
    "mileage": "147000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "24999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 24999,
    "currency": "EUR",
    "mileageValue": 147000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21781689983828599",
    "make": "VW",
    "year": 2023,
    "body": "suv",
    "arrival": 3,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-15-1.webp",
    "imageAlt": "Mercedes-Benz GLC 2.2CDI 170HP 4-Matic Autonatic Navi",
    "href": "/vehicle?id=21784142258144582",
    "title": "Mercedes-Benz GLC 2.2CDI 170HP 4-Matic Autonatic Navi",
    "location": "Варна",
    "mileage": "165000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "21999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 21999,
    "currency": "EUR",
    "mileageValue": 165000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21784142258144582",
    "make": "Mercedes-Benz",
    "year": 2016,
    "body": "suv",
    "arrival": 2,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/automarket/vehicle-16-1.webp",
    "imageAlt": "Audi A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL",
    "href": "/vehicle?id=11750340593495216",
    "title": "Audi A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL",
    "location": "Варна",
    "mileage": "218000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "15999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 15999,
    "currency": "EUR",
    "mileageValue": 218000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11750340593495216",
    "make": "Audi",
    "year": 2016,
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
  sample: "Представителни обяви към 07.09.2026 г. Потвърдете наличността и условията по телефона.",
  sampleDetail:
    "Представителни обяви към 07.09.2026 г. Потвърдете наличността и условията по телефона.",
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
  sample: "Представителни обяви към 07.09.2026 г. Потвърдете наличността и условията по телефона.",
  sampleDetail:
    "Представителни обяви към 07.09.2026 г. Потвърдете наличността и условията по телефона.",
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
