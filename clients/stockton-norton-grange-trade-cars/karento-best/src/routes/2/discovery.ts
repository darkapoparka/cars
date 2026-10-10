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
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2016 Peugeot 208 1.6 BlueHDi Active 5dr HATCHBACK Diesel Manual",
    "href": "/vehicle?id=820214219013",
    "title": "2016 Peugeot 208 1.6 BlueHDi Active 5dr HATCHBACK Diesel Manual",
    "location": "Stockton-on-Tees",
    "mileage": "80000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "3490 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3490,
    "currency": "GBP",
    "mileageValue": 80000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "820214219013",
    "make": "Peugeot",
    "year": 2016,
    "body": "hatchback",
    "arrival": 10,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/van.webp",
    "imageAlt": "2016 Ford Grand C-Max 1.5 TDCi Titanium 5dr MPV Diesel Manual",
    "href": "/vehicle?id=820210366321",
    "title": "2016 Ford Grand C-Max 1.5 TDCi Titanium 5dr MPV Diesel Manual",
    "location": "Stockton-on-Tees",
    "mileage": "103000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "other",
    "price": "4990 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 4990,
    "currency": "GBP",
    "mileageValue": 103000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "820210366321",
    "make": "Ford",
    "year": 2016,
    "body": "other",
    "arrival": 9,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2016 Ford Focus 1.5 TDCi 120 Titanium 5dr HATCHBACK Diesel Manual",
    "href": "/vehicle?id=820209853597",
    "title": "2016 Ford Focus 1.5 TDCi 120 Titanium 5dr HATCHBACK Diesel Manual",
    "location": "Stockton-on-Tees",
    "mileage": "103000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "3990 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3990,
    "currency": "GBP",
    "mileageValue": 103000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "820209853597",
    "make": "Ford",
    "year": 2016,
    "body": "hatchback",
    "arrival": 8,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2017 Nissan Qashqai 1.5 dCi N-Vision 5dr HATCHBACK Diesel Manual",
    "href": "/vehicle?id=820206910321",
    "title": "2017 Nissan Qashqai 1.5 dCi N-Vision 5dr HATCHBACK Diesel Manual",
    "location": "Stockton-on-Tees",
    "mileage": "93000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "5990 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5990,
    "currency": "GBP",
    "mileageValue": 93000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "820206910321",
    "make": "Nissan",
    "year": 2017,
    "body": "hatchback",
    "arrival": 7,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2017 Vauxhall Corsa 1.4 SRi Vx-line 3dr HATCHBACK Petrol Manual",
    "href": "/vehicle?id=820199748020",
    "title": "2017 Vauxhall Corsa 1.4 SRi Vx-line 3dr HATCHBACK Petrol Manual",
    "location": "Stockton-on-Tees",
    "mileage": "75401 mi",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "4750 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 4750,
    "currency": "GBP",
    "mileageValue": 75401,
    "mileageUnit": "mi",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "820199748020",
    "make": "Vauxhall",
    "year": 2017,
    "body": "hatchback",
    "arrival": 6,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2013 Audi A1 1.4 TFSI Sport 5dr HATCHBACK Petrol Manual",
    "href": "/vehicle?id=820174486495",
    "title": "2013 Audi A1 1.4 TFSI Sport 5dr HATCHBACK Petrol Manual",
    "location": "Stockton-on-Tees",
    "mileage": "80000 mi",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "5490 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5490,
    "currency": "GBP",
    "mileageValue": 80000,
    "mileageUnit": "mi",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "820174486495",
    "make": "Audi",
    "year": 2013,
    "body": "hatchback",
    "arrival": 5,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2018 Nissan Qashqai 1.5 dCi 115 N-Connecta 5dr HATCHBACK Diesel Manual",
    "href": "/vehicle?id=820154120347",
    "title": "2018 Nissan Qashqai 1.5 dCi 115 N-Connecta 5dr HATCHBACK Diesel Manual",
    "location": "Stockton-on-Tees",
    "mileage": "92418 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "7490 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 7490,
    "currency": "GBP",
    "mileageValue": 92418,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "820154120347",
    "make": "Nissan",
    "year": 2018,
    "body": "hatchback",
    "arrival": 4,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2014 Ford Fiesta 1.25 82 Zetec 3dr HATCHBACK Petrol Manual",
    "href": "/vehicle?id=820133361606",
    "title": "2014 Ford Fiesta 1.25 82 Zetec 3dr HATCHBACK Petrol Manual",
    "location": "Stockton-on-Tees",
    "mileage": "51000 mi",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "hatchback",
    "price": "4650 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 4650,
    "currency": "GBP",
    "mileageValue": 51000,
    "mileageUnit": "mi",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "820133361606",
    "make": "Ford",
    "year": 2014,
    "body": "hatchback",
    "arrival": 3,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2017 Nissan Juke 1.5 dCi N-Connecta 5dr HATCHBACK Diesel Manual",
    "href": "/vehicle?id=820133263757",
    "title": "2017 Nissan Juke 1.5 dCi N-Connecta 5dr HATCHBACK Diesel Manual",
    "location": "Stockton-on-Tees",
    "mileage": "101000 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "4290 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 4290,
    "currency": "GBP",
    "mileageValue": 101000,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "820133263757",
    "make": "Nissan",
    "year": 2017,
    "body": "hatchback",
    "arrival": 2,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer-stock/hatchback.webp",
    "imageAlt": "2015 Nissan Juke 1.5 dCi Acenta Premium 5dr HATCHBACK Diesel Manual",
    "href": "/vehicle?id=820110031882",
    "title": "2015 Nissan Juke 1.5 dCi Acenta Premium 5dr HATCHBACK Diesel Manual",
    "location": "Stockton-on-Tees",
    "mileage": "83830 mi",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "3990 GBP",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3990,
    "currency": "GBP",
    "mileageValue": 83830,
    "mileageUnit": "mi",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "820110031882",
    "make": "Nissan",
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
    "id": "german",
    "title": "german"
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
