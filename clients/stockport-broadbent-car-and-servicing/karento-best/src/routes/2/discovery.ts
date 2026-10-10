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
    "image": "/dealer-stock/van.webp",
    "imageAlt": "2017 Peugeot Partner 850 1.6 BlueHDi 100 Professional Van [non SS] PANEL VAN Die",
    "href": "/vehicle?id=860026521888",
    "title": "2017 Peugeot Partner 850 1.6 BlueHDi 100 Professional Van [non SS] PANEL VAN Die",
    "location": "Bredbury, Stockport",
    "mileage": "119000 mi",
    "transmission": "",
    "fuel": "",
    "seats": "",
    "bodyType": "van",
    "price": "3995 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3995,
    "currency": "GBP",
    "mileageValue": 119000,
    "mileageUnit": "mi",
    "id": "860026521888",
    "make": "Peugeot",
    "year": 2017,
    "body": "van",
    "arrival": 10,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/van.webp",
    "imageAlt": "2020 Ford Transit 2.0 EcoBlue 130ps H3 Trend Van PANEL VAN Diesel Manual",
    "href": "/vehicle?id=860026533399",
    "title": "2020 Ford Transit 2.0 EcoBlue 130ps H3 Trend Van PANEL VAN Diesel Manual",
    "location": "Bredbury, Stockport",
    "mileage": "92000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "van",
    "price": "9995 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 9995,
    "currency": "GBP",
    "mileageValue": 92000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "860026533399",
    "make": "Ford",
    "year": 2020,
    "body": "van",
    "arrival": 9,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/van.webp",
    "imageAlt": "2017 Ford Transit Custom 2.0 TDCi 105ps High Roof Van PANEL VAN Diesel Manual",
    "href": "/vehicle?id=860026522289",
    "title": "2017 Ford Transit Custom 2.0 TDCi 105ps High Roof Van PANEL VAN Diesel Manual",
    "location": "Bredbury, Stockport",
    "mileage": "144000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "van",
    "price": "5995 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5995,
    "currency": "GBP",
    "mileageValue": 144000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "860026522289",
    "make": "Ford",
    "year": 2017,
    "body": "van",
    "arrival": 8,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/van.webp",
    "imageAlt": "2018 Ford Transit 2.0 TDCi 130ps H3 Van PANEL VAN Diesel Manual",
    "href": "/vehicle?id=860023676019",
    "title": "2018 Ford Transit 2.0 TDCi 130ps H3 Van PANEL VAN Diesel Manual",
    "location": "Bredbury, Stockport",
    "mileage": "132000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "van",
    "price": "6795 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 6795,
    "currency": "GBP",
    "mileageValue": 132000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "860023676019",
    "make": "Ford",
    "year": 2018,
    "body": "van",
    "arrival": 7,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/van.webp",
    "imageAlt": "2021 Ford Transit 2.0 EcoBlue 130ps H3 Leader Van PANEL VAN Diesel Manual",
    "href": "/vehicle?id=860023304847",
    "title": "2021 Ford Transit 2.0 EcoBlue 130ps H3 Leader Van PANEL VAN Diesel Manual",
    "location": "Bredbury, Stockport",
    "mileage": "48000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "van",
    "price": "13995 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 13995,
    "currency": "GBP",
    "mileageValue": 48000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "860023304847",
    "make": "Ford",
    "year": 2021,
    "body": "van",
    "arrival": 6,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2016 Ford Mondeo 1.5 TDCi ECOnetic Zetec 5dr HATCHBACK Diesel Manual",
    "href": "/vehicle?id=860022996391",
    "title": "2016 Ford Mondeo 1.5 TDCi ECOnetic Zetec 5dr HATCHBACK Diesel Manual",
    "location": "Bredbury, Stockport",
    "mileage": "93500 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "4995 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 4995,
    "currency": "GBP",
    "mileageValue": 93500,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "860022996391",
    "make": "Ford",
    "year": 2016,
    "body": "hatchback",
    "arrival": 5,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2014 Ford Fiesta 1.6 TDCi Titanium ECOnetic 5dr HATCHBACK Diesel Manual",
    "href": "/vehicle?id=860019450163",
    "title": "2014 Ford Fiesta 1.6 TDCi Titanium ECOnetic 5dr HATCHBACK Diesel Manual",
    "location": "Bredbury, Stockport",
    "mileage": "85000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "2995 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 2995,
    "currency": "GBP",
    "mileageValue": 85000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "860019450163",
    "make": "Ford",
    "year": 2014,
    "body": "hatchback",
    "arrival": 4,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2010 Renault Clio 1.6 VVT Initiale 5dr Auto HATCHBACK Petrol Automatic",
    "href": "/vehicle?id=860015804779",
    "title": "2010 Renault Clio 1.6 VVT Initiale 5dr Auto HATCHBACK Petrol Automatic",
    "location": "Bredbury, Stockport",
    "mileage": "59000 mi",
    "transmission": "Automatic",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "3000 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3000,
    "currency": "GBP",
    "mileageValue": 59000,
    "mileageUnit": "mi",
    "fuelType": "gasoline",
    "transmissionType": "automatic",
    "id": "860015804779",
    "make": "Renault",
    "year": 2010,
    "body": "hatchback",
    "arrival": 3,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/van.webp",
    "imageAlt": "2013 Peugeot Partner 716 S 1.6 HDi 92 Crew Van PANEL VAN Diesel Manual",
    "href": "/vehicle?id=860011683310",
    "title": "2013 Peugeot Partner 716 S 1.6 HDi 92 Crew Van PANEL VAN Diesel Manual",
    "location": "Bredbury, Stockport",
    "mileage": "109000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "van",
    "price": "3195 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3195,
    "currency": "GBP",
    "mileageValue": 109000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "860011683310",
    "make": "Peugeot",
    "year": 2013,
    "body": "van",
    "arrival": 2,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2014 Vauxhall Astra 1.4i 16V SRi 5dr HATCHBACK Petrol Manual",
    "href": "/vehicle?id=860011314014",
    "title": "2014 Vauxhall Astra 1.4i 16V SRi 5dr HATCHBACK Petrol Manual",
    "location": "Bredbury, Stockport",
    "mileage": "77000 mi",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "2795 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 2795,
    "currency": "GBP",
    "mileageValue": 77000,
    "mileageUnit": "mi",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "860011314014",
    "make": "Vauxhall",
    "year": 2014,
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
  under10: "Up to £10,000",
  cheapest: "Cheapest cars",
  premium: "Premium cars",
  exclusive: "Exclusive cars",
  under20: "Up to £20,000",
  bmw: "Explore BMW",
  german: "German favourites",
  suvs: "SUVs for every day",
  all: "All cars",
  pricePill: "Up to £10k",
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
  maximumPrice: "Maximum price (GBP)",
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
  sample: "Vehicle images are generated illustrations, not photographs of the advertised vehicles. Listing details were observed on 10 October 2026; confirm each original advert, price, condition and availability with the dealership.",
  sampleDetail:
    "Vehicle images are generated illustrations, not photographs of the advertised vehicles. Listing details were observed on 10 October 2026; confirm each original advert, price, condition and availability with the dealership.",
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
  under10: "До 10 000 £",
  cheapest: "Най-евтини коли",
  premium: "Премиум коли",
  exclusive: "Ексклузивни коли",
  under20: "До 20 000 £",
  bmw: "Разгледай BMW",
  german: "Немски автомобили",
  suvs: "SUV за всеки ден",
  all: "Всички коли",
  pricePill: "До 10 000 £",
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
  maximumPrice: "Максимална цена (GBP)",
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
  sample: "Vehicle images are generated illustrations, not photographs of the advertised vehicles. Listing details were observed on 10 October 2026; confirm each original advert, price, condition and availability with the dealership.",
  sampleDetail:
    "Vehicle images are generated illustrations, not photographs of the advertised vehicles. Listing details were observed on 10 October 2026; confirm each original advert, price, condition and availability with the dealership.",
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
