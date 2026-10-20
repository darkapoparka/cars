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
    "image": "/assets/excellent/vehicle-01-1.webp",
    "imageAlt": "Mercedes-Benz GLE 350 AMG  DESIGNO",
    "href": "/vehicle?id=21781257688134220",
    "title": "Mercedes-Benz GLE 350 AMG  DESIGNO",
    "location": "Варна",
    "mileage": "179000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "32900 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 32900,
    "currency": "EUR",
    "mileageValue": 179000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21781257688134220",
    "make": "Mercedes-Benz",
    "year": 2016,
    "body": "suv",
    "arrival": 16,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-02-1.webp",
    "imageAlt": "VW Passat 2.0TDI  HIGHLINE",
    "href": "/vehicle?id=11785932596351376",
    "title": "VW Passat 2.0TDI  HIGHLINE",
    "location": "Варна",
    "mileage": "212000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "sedan",
    "price": "10500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 10500,
    "currency": "EUR",
    "mileageValue": 212000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11785932596351376",
    "make": "VW",
    "year": 2011,
    "body": "sedan",
    "arrival": 15,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-03-1.webp",
    "imageAlt": "Skoda Octavia 2.0TDI  4x4",
    "href": "/vehicle?id=11788181514006324",
    "title": "Skoda Octavia 2.0TDI  4x4",
    "location": "Варна",
    "mileage": "180000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "17900 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 17900,
    "currency": "EUR",
    "mileageValue": 180000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11788181514006324",
    "make": "Skoda",
    "year": 2022,
    "body": "wagon",
    "arrival": 14,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-04-1.webp",
    "imageAlt": "Cupra Born RESTYLING  58KW",
    "href": "/vehicle?id=11786795820524833",
    "title": "Cupra Born RESTYLING  58KW",
    "location": "Варна",
    "mileage": "67000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "hatchback",
    "price": "22900 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 22900,
    "currency": "EUR",
    "mileageValue": 67000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "11786795820524833",
    "make": "Cupra",
    "year": 2022,
    "body": "hatchback",
    "arrival": 13,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-05-1.webp",
    "imageAlt": "Hyundai Kona 1.6HEV  N-LINE",
    "href": "/vehicle?id=21786794971218528",
    "title": "Hyundai Kona 1.6HEV  N-LINE",
    "location": "Варна",
    "mileage": "40000 km",
    "transmission": "Automatic",
    "fuel": "Hybrid",
    "seats": "",
    "bodyType": "suv",
    "price": "17900 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 17900,
    "currency": "EUR",
    "mileageValue": 40000,
    "mileageUnit": "km",
    "fuelType": "hybrid",
    "transmissionType": "automatic",
    "id": "21786794971218528",
    "make": "Hyundai",
    "year": 2020,
    "body": "suv",
    "arrival": 12,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-06-1.webp",
    "imageAlt": "Kia Sportage 1.6D  AUTOMAT",
    "href": "/vehicle?id=21786455005208728",
    "title": "Kia Sportage 1.6D  AUTOMAT",
    "location": "Варна",
    "mileage": "180000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "10900 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 10900,
    "currency": "EUR",
    "mileageValue": 180000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21786455005208728",
    "make": "Kia",
    "year": 2017,
    "body": "suv",
    "arrival": 11,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-07-1.webp",
    "imageAlt": "VW Tiguan 2.0ТDI  4MOTION",
    "href": "/vehicle?id=21786453972789852",
    "title": "VW Tiguan 2.0ТDI  4MOTION",
    "location": "Варна",
    "mileage": "199000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "16990 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 16990,
    "currency": "EUR",
    "mileageValue": 199000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21786453972789852",
    "make": "VW",
    "year": 2017,
    "body": "suv",
    "arrival": 10,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-08-1.webp",
    "imageAlt": "Land Rover Range Rover Evoque HYBRID  NARDO_GREY",
    "href": "/vehicle?id=21786451392501339",
    "title": "Land Rover Range Rover Evoque HYBRID  NARDO_GREY",
    "location": "Варна",
    "mileage": "125000 km",
    "transmission": "Automatic",
    "fuel": "Hybrid",
    "seats": "",
    "bodyType": "suv",
    "price": "25000 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 25000,
    "currency": "EUR",
    "mileageValue": 125000,
    "mileageUnit": "km",
    "fuelType": "hybrid",
    "transmissionType": "automatic",
    "id": "21786451392501339",
    "make": "Land Rover",
    "year": 2022,
    "body": "suv",
    "arrival": 9,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-09-1.webp",
    "imageAlt": "Audi Q2 2.0TFSI  QUATTRO",
    "href": "/vehicle?id=21773151499854810",
    "title": "Audi Q2 2.0TFSI  QUATTRO",
    "location": "Варна",
    "mileage": "133000 km",
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
    "mileageValue": 133000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "21773151499854810",
    "make": "Audi",
    "year": 2018,
    "body": "suv",
    "arrival": 8,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-10-1.webp",
    "imageAlt": "Dodge Challenger 5.7HEMI  SRT",
    "href": "/vehicle?id=11768639133016485",
    "title": "Dodge Challenger 5.7HEMI  SRT",
    "location": "Варна",
    "mileage": "65000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "coupe",
    "price": "21500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 21500,
    "currency": "EUR",
    "mileageValue": 65000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "11768639133016485",
    "make": "Dodge",
    "year": 2014,
    "body": "coupe",
    "arrival": 7,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-11-1.webp",
    "imageAlt": "VW T-Cross 1.5i  AUTOMAT",
    "href": "/vehicle?id=21775914499512125",
    "title": "VW T-Cross 1.5i  AUTOMAT",
    "location": "Варна",
    "mileage": "48000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "21990 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 21990,
    "currency": "EUR",
    "mileageValue": 48000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "21775914499512125",
    "make": "VW",
    "year": 2023,
    "body": "suv",
    "arrival": 6,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-12-1.webp",
    "imageAlt": "Kia Niro PLUG-IN-HYBRID",
    "href": "/vehicle?id=21785575816054903",
    "title": "Kia Niro PLUG-IN-HYBRID",
    "location": "Варна",
    "mileage": "118000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "hatchback",
    "price": "16990 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 16990,
    "currency": "EUR",
    "mileageValue": 118000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "21785575816054903",
    "make": "Kia",
    "year": 2019,
    "body": "hatchback",
    "arrival": 5,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-13-1.webp",
    "imageAlt": "BMW X3 2.0D  xDrive",
    "href": "/vehicle?id=21773150110056507",
    "title": "BMW X3 2.0D  xDrive",
    "location": "Варна",
    "mileage": "188000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "12000 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 12000,
    "currency": "EUR",
    "mileageValue": 188000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21773150110056507",
    "make": "BMW",
    "year": 2014,
    "body": "suv",
    "arrival": 4,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-14-1.webp",
    "imageAlt": "Nissan Juke 1.6Т  NISMO",
    "href": "/vehicle?id=21785323501482685",
    "title": "Nissan Juke 1.6Т  NISMO",
    "location": "Варна",
    "mileage": "186000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "9500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 9500,
    "currency": "EUR",
    "mileageValue": 186000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "21785323501482685",
    "make": "Nissan",
    "year": 2014,
    "body": "suv",
    "arrival": 3,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-15-1.webp",
    "imageAlt": "Peugeot 308 1.6GT  205h.p",
    "href": "/vehicle?id=11778320754806394",
    "title": "Peugeot 308 1.6GT  205h.p",
    "location": "Варна",
    "mileage": "130000 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "9200 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 9200,
    "currency": "EUR",
    "mileageValue": 130000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11778320754806394",
    "make": "Peugeot",
    "year": 2016,
    "body": "hatchback",
    "arrival": 2,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/excellent/vehicle-16-1.webp",
    "imageAlt": "Mazda CX-5 2.5i  4x4",
    "href": "/vehicle?id=21781781688732220",
    "title": "Mazda CX-5 2.5i  4x4",
    "location": "Варна",
    "mileage": "192000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "14990 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 14990,
    "currency": "EUR",
    "mileageValue": 192000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "21781781688732220",
    "make": "Mazda",
    "year": 2015,
    "body": "suv",
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
  sample: "Подбрани публикувани обяви към 07.09.2026. Наличностите и условията се потвърждават по телефона.",
  sampleDetail:
    "Подбрани публикувани обяви към 07.09.2026. Наличностите и условията се потвърждават по телефона.",
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
  sample: "Подбрани публикувани обяви към 07.09.2026. Наличностите и условията се потвърждават по телефона.",
  sampleDetail:
    "Подбрани публикувани обяви към 07.09.2026. Наличностите и условията се потвърждават по телефона.",
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
