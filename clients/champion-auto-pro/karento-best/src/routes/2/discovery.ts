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
    "image": "/assets/champion/vehicle-01-1.webp",
    "imageAlt": "BMW iX 40Xdrive",
    "href": "/vehicle?id=11787294758482309",
    "title": "BMW iX 40Xdrive",
    "location": "Варна",
    "mileage": "28000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "suv",
    "price": "43800 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 43800,
    "currency": "EUR",
    "mileageValue": 28000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "11787294758482309",
    "make": "BMW",
    "year": 2022,
    "body": "suv",
    "arrival": 16,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-02-1.webp",
    "imageAlt": "Audi A6 50TDI Quattro",
    "href": "/vehicle?id=11787311251312869",
    "title": "Audi A6 50TDI Quattro",
    "location": "Варна",
    "mileage": "176000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "23000 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 23000,
    "currency": "EUR",
    "mileageValue": 176000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11787311251312869",
    "make": "Audi",
    "year": 2019,
    "body": "wagon",
    "arrival": 15,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-03-1.webp",
    "imageAlt": "Smart Forfour 22kw.-26000км.",
    "href": "/vehicle?id=11784794853353090",
    "title": "Smart Forfour 22kw.-26000км.",
    "location": "Варна",
    "mileage": "26000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "hatchback",
    "price": "12900 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 12900,
    "currency": "EUR",
    "mileageValue": 26000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "11784794853353090",
    "make": "Smart",
    "year": 2021,
    "body": "hatchback",
    "arrival": 14,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-04-1.webp",
    "imageAlt": "Mercedes-Benz S 500 AMG Packet 63 Long",
    "href": "/vehicle?id=11784640487309304",
    "title": "Mercedes-Benz S 500 AMG Packet 63 Long",
    "location": "Варна",
    "mileage": "265000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "sedan",
    "price": "27999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 27999,
    "currency": "EUR",
    "mileageValue": 265000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "11784640487309304",
    "make": "Mercedes-Benz",
    "year": 2014,
    "body": "sedan",
    "arrival": 13,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-05-1.webp",
    "imageAlt": "Mercedes-Benz S 400 LONG-FULL",
    "href": "/vehicle?id=11771862221224289",
    "title": "Mercedes-Benz S 400 LONG-FULL",
    "location": "Варна",
    "mileage": "73000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "sedan",
    "price": "89999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 89999,
    "currency": "EUR",
    "mileageValue": 73000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11771862221224289",
    "make": "Mercedes-Benz",
    "year": 2023,
    "body": "sedan",
    "arrival": 12,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-06-1.webp",
    "imageAlt": "Mercedes-Benz ML 350 AMG Packet",
    "href": "/vehicle?id=21784732491989700",
    "title": "Mercedes-Benz ML 350 AMG Packet",
    "location": "Варна",
    "mileage": "185000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "15999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 15999,
    "currency": "EUR",
    "mileageValue": 185000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21784732491989700",
    "make": "Mercedes-Benz",
    "year": 2012,
    "body": "suv",
    "arrival": 11,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-07-1.webp",
    "imageAlt": "Audi A7 S-Line FULL",
    "href": "/vehicle?id=11784720940119234",
    "title": "Audi A7 S-Line FULL",
    "location": "Варна",
    "mileage": "108000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "35999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 35999,
    "currency": "EUR",
    "mileageValue": 108000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11784720940119234",
    "make": "Audi",
    "year": 2020,
    "body": "hatchback",
    "arrival": 10,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-08-1.webp",
    "imageAlt": "Mercedes-Benz B 200 AMG Line",
    "href": "/vehicle?id=11783584641538327",
    "title": "Mercedes-Benz B 200 AMG Line",
    "location": "Варна",
    "mileage": "95000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "17999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 17999,
    "currency": "EUR",
    "mileageValue": 95000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11783584641538327",
    "make": "Mercedes-Benz",
    "year": 2020,
    "body": "hatchback",
    "arrival": 9,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-09-1.webp",
    "imageAlt": "Audi SQ7 S-Line",
    "href": "/vehicle?id=21778484741555035",
    "title": "Audi SQ7 S-Line",
    "location": "Варна",
    "mileage": "230000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "33000 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 33000,
    "currency": "EUR",
    "mileageValue": 230000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21778484741555035",
    "make": "Audi",
    "year": 2017,
    "body": "suv",
    "arrival": 8,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-10-1.webp",
    "imageAlt": "Audi Rs5 2.9TFSI V6 Quattro",
    "href": "/vehicle?id=11758265694582686",
    "title": "Audi Rs5 2.9TFSI V6 Quattro",
    "location": "Варна",
    "mileage": "182000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "sedan",
    "price": "39999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 39999,
    "currency": "EUR",
    "mileageValue": 182000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "11758265694582686",
    "make": "Audi",
    "year": 2020,
    "body": "sedan",
    "arrival": 7,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-11-1.webp",
    "imageAlt": "Audi E-Tron 2 X S-Line",
    "href": "/vehicle?id=11773307576284789",
    "title": "Audi E-Tron 2 X S-Line",
    "location": "Варна",
    "mileage": "72000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "suv",
    "price": "31000 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 31000,
    "currency": "EUR",
    "mileageValue": 72000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "11773307576284789",
    "make": "Audi",
    "year": 2021,
    "body": "suv",
    "arrival": 6,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-12-1.webp",
    "imageAlt": "VW ID.5 PRO 82kw",
    "href": "/vehicle?id=11787215050268120",
    "title": "VW ID.5 PRO 82kw",
    "location": "Варна",
    "mileage": "104000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "hatchback",
    "price": "29999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 29999,
    "currency": "EUR",
    "mileageValue": 104000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "11787215050268120",
    "make": "VW",
    "year": 2023,
    "body": "hatchback",
    "arrival": 5,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-13-1.webp",
    "imageAlt": "Toyota Highlander 60000km Газ Prins",
    "href": "/vehicle?id=21787142969943440",
    "title": "Toyota Highlander 60000km Газ Prins",
    "location": "Варна",
    "mileage": "60000 km",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "26800 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 26800,
    "currency": "EUR",
    "mileageValue": 60000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "21787142969943440",
    "make": "Toyota",
    "year": 2019,
    "body": "suv",
    "arrival": 4,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-14-1.webp",
    "imageAlt": "Mercedes-Benz EQE 300",
    "href": "/vehicle?id=21787197677876419",
    "title": "Mercedes-Benz EQE 300",
    "location": "Варна",
    "mileage": "47000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "sedan",
    "price": "44999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 44999,
    "currency": "EUR",
    "mileageValue": 47000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "21787197677876419",
    "make": "Mercedes-Benz",
    "year": 2023,
    "body": "sedan",
    "arrival": 3,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-15-1.webp",
    "imageAlt": "Mercedes-Benz EQC 400",
    "href": "/vehicle?id=21787200936302723",
    "title": "Mercedes-Benz EQC 400",
    "location": "Варна",
    "mileage": "68900 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "suv",
    "price": "38800 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 38800,
    "currency": "EUR",
    "mileageValue": 68900,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "21787200936302723",
    "make": "Mercedes-Benz",
    "year": 2021,
    "body": "suv",
    "arrival": 2,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/champion/vehicle-16-1.webp",
    "imageAlt": "Renault Captur",
    "href": "/vehicle?id=11786100747512292",
    "title": "Renault Captur",
    "location": "Варна",
    "mileage": "55000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "9200 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 9200,
    "currency": "EUR",
    "mileageValue": 55000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11786100747512292",
    "make": "Renault",
    "year": 2015,
    "body": "hatchback",
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
  sample: "Подбрани публикувани обяви. Наличностите и условията се потвърждават по телефона.",
  sampleDetail:
    "Подбрани публикувани обяви. Наличностите и условията се потвърждават по телефона.",
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
  sample: "Подбрани публикувани обяви. Наличностите и условията се потвърждават по телефона.",
  sampleDetail:
    "Подбрани публикувани обяви. Наличностите и условията се потвърждават по телефона.",
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
