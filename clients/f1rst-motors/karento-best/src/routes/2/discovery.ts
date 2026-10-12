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
    "image": "/dealer/stock/1.svg",
    "imageAlt": "Koenigsegg Jesko Attack 2023",
    "href": "/vehicle?id=1",
    "title": "Koenigsegg Jesko Attack 2023",
    "location": "Dubai",
    "mileage": "0 km",
    "transmission": "Not published in source summary",
    "fuel": "Not published in source summary",
    "seats": "",
    "bodyType": "coupe",
    "price": "21000000 AED",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 21000000,
    "currency": "AED",
    "mileageValue": 0,
    "mileageUnit": "km",
    "fuelType": "other",
    "transmissionType": "other",
    "id": "1",
    "make": "Koenigsegg",
    "year": 2023,
    "body": "coupe",
    "arrival": 10,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer/stock/2.svg",
    "imageAlt": "Bugatti W16 Mistral 2025",
    "href": "/vehicle?id=2",
    "title": "Bugatti W16 Mistral 2025",
    "location": "Dubai",
    "mileage": "0 km",
    "transmission": "Not published in source summary",
    "fuel": "Not published in source summary",
    "seats": "",
    "bodyType": "convertible",
    "price": "34000000 AED",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 34000000,
    "currency": "AED",
    "mileageValue": 0,
    "mileageUnit": "km",
    "fuelType": "other",
    "transmissionType": "other",
    "id": "2",
    "make": "Bugatti",
    "year": 2025,
    "body": "convertible",
    "arrival": 9,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer/stock/3.svg",
    "imageAlt": "Ford GT 2017",
    "href": "/vehicle?id=3",
    "title": "Ford GT 2017",
    "location": "Dubai",
    "mileage": "5669 km",
    "transmission": "Not published in source summary",
    "fuel": "Not published in source summary",
    "seats": "",
    "bodyType": "coupe",
    "price": "2599995 AED",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 2599995,
    "currency": "AED",
    "mileageValue": 5669,
    "mileageUnit": "km",
    "fuelType": "other",
    "transmissionType": "other",
    "id": "3",
    "make": "Ford",
    "year": 2017,
    "body": "coupe",
    "arrival": 8,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer/stock/4.svg",
    "imageAlt": "Porsche Carrera GT 2006",
    "href": "/vehicle?id=4",
    "title": "Porsche Carrera GT 2006",
    "location": "Dubai",
    "mileage": "13000 km",
    "transmission": "Not published in source summary",
    "fuel": "Not published in source summary",
    "seats": "",
    "bodyType": "coupe",
    "price": "11000000 AED",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 11000000,
    "currency": "AED",
    "mileageValue": 13000,
    "mileageUnit": "km",
    "fuelType": "other",
    "transmissionType": "other",
    "id": "4",
    "make": "Porsche",
    "year": 2006,
    "body": "coupe",
    "arrival": 7,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer/stock/5.svg",
    "imageAlt": "Ford GT 2020",
    "href": "/vehicle?id=5",
    "title": "Ford GT 2020",
    "location": "Dubai",
    "mileage": "3250 km",
    "transmission": "Not published in source summary",
    "fuel": "Not published in source summary",
    "seats": "",
    "bodyType": "coupe",
    "price": "2899995 AED",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 2899995,
    "currency": "AED",
    "mileageValue": 3250,
    "mileageUnit": "km",
    "fuelType": "other",
    "transmissionType": "other",
    "id": "5",
    "make": "Ford",
    "year": 2020,
    "body": "coupe",
    "arrival": 6,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer/stock/6.svg",
    "imageAlt": "Ferrari SF90XX Stradale 2024",
    "href": "/vehicle?id=6",
    "title": "Ferrari SF90XX Stradale 2024",
    "location": "Dubai",
    "mileage": "0 km",
    "transmission": "Not published in source summary",
    "fuel": "Not published in source summary",
    "seats": "",
    "bodyType": "coupe",
    "price": "5400000 AED",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5400000,
    "currency": "AED",
    "mileageValue": 0,
    "mileageUnit": "km",
    "fuelType": "other",
    "transmissionType": "other",
    "id": "6",
    "make": "Ferrari",
    "year": 2024,
    "body": "coupe",
    "arrival": 5,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer/stock/7.svg",
    "imageAlt": "Pininfarina Battista Furiosa Package 2024",
    "href": "/vehicle?id=7",
    "title": "Pininfarina Battista Furiosa Package 2024",
    "location": "Dubai",
    "mileage": "10200 km",
    "transmission": "Not published in source summary",
    "fuel": "Not published in source summary",
    "seats": "",
    "bodyType": "coupe",
    "price": "11000000 AED",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 11000000,
    "currency": "AED",
    "mileageValue": 10200,
    "mileageUnit": "km",
    "fuelType": "other",
    "transmissionType": "other",
    "id": "7",
    "make": "Pininfarina",
    "year": 2024,
    "body": "coupe",
    "arrival": 4,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer/stock/8.svg",
    "imageAlt": "Aston Martin Valhalla 2026",
    "href": "/vehicle?id=8",
    "title": "Aston Martin Valhalla 2026",
    "location": "Dubai",
    "mileage": "692 km",
    "transmission": "Not published in source summary",
    "fuel": "Not published in source summary",
    "seats": "",
    "bodyType": "coupe",
    "price": "5500000 AED",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5500000,
    "currency": "AED",
    "mileageValue": 692,
    "mileageUnit": "km",
    "fuelType": "other",
    "transmissionType": "other",
    "id": "8",
    "make": "Aston Martin",
    "year": 2026,
    "body": "coupe",
    "arrival": 3,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer/stock/9.svg",
    "imageAlt": "Bugatti Chiron Sport Noire 2021",
    "href": "/vehicle?id=9",
    "title": "Bugatti Chiron Sport Noire 2021",
    "location": "Dubai",
    "mileage": "2550 km",
    "transmission": "Not published in source summary",
    "fuel": "Not published in source summary",
    "seats": "",
    "bodyType": "coupe",
    "price": "15500000 AED",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 15500000,
    "currency": "AED",
    "mileageValue": 2550,
    "mileageUnit": "km",
    "fuelType": "other",
    "transmissionType": "other",
    "id": "9",
    "make": "Bugatti",
    "year": 2021,
    "body": "coupe",
    "arrival": 2,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/dealer/stock/10.svg",
    "imageAlt": "Porsche 911 S/T 2024",
    "href": "/vehicle?id=10",
    "title": "Porsche 911 S/T 2024",
    "location": "Dubai",
    "mileage": "0 km",
    "transmission": "Not published in source summary",
    "fuel": "Not published in source summary",
    "seats": "",
    "bodyType": "coupe",
    "price": "1779995 AED",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 1779995,
    "currency": "AED",
    "mileageValue": 0,
    "mileageUnit": "km",
    "fuelType": "other",
    "transmissionType": "other",
    "id": "10",
    "make": "Porsche",
    "year": 2024,
    "body": "coupe",
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
  under10: "Up to AED10,000",
  cheapest: "Cheapest cars",
  premium: "Premium cars",
  exclusive: "Exclusive cars",
  under20: "Up to AED20,000",
  bmw: "Explore BMW",
  german: "German favourites",
  suvs: "SUVs for every day",
  all: "All cars",
  pricePill: "Up to AED10k",
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
  maximumPrice: "Maximum price (AED)",
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
  sample: "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with F1rst Motors. Demo forms do not send messages.",
  sampleDetail:
    "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with F1rst Motors. Demo forms do not send messages.",
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
  under10: "До 10 000 AED",
  cheapest: "Най-евтини коли",
  premium: "Премиум коли",
  exclusive: "Ексклузивни коли",
  under20: "До 20 000 AED",
  bmw: "Разгледай BMW",
  german: "Немски автомобили",
  suvs: "SUV за всеки ден",
  all: "Всички коли",
  pricePill: "До 10 000 AED",
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
  maximumPrice: "Максимална цена (AED)",
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
  sample: "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with F1rst Motors. Demo forms do not send messages.",
  sampleDetail:
    "Dated public stock sample, not a live feed. Confirm price, specifications and availability directly with F1rst Motors. Demo forms do not send messages.",
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
