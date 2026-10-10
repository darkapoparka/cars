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
    "image": "/assets/vehicles/11790190994561881/1.webp",
    "imageAlt": "VW Golf 2.0 TDI 150 4Motion",
    "href": "/vehicle?id=11790190994561881",
    "title": "VW Golf 2.0 TDI 150 4Motion",
    "location": "Варна",
    "mileage": "227000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "hatchback",
    "price": "8999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 8999,
    "currency": "EUR",
    "mileageValue": 227000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11790190994561881",
    "make": "VW",
    "year": 2013,
    "body": "hatchback",
    "arrival": 8,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/11791398612800365/1.webp",
    "imageAlt": "Audi A4 2.0 TDI S LINE LED NAVI",
    "href": "/vehicle?id=11791398612800365",
    "title": "Audi A4 2.0 TDI S LINE LED NAVI",
    "location": "Варна",
    "mileage": "237000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "6900 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 6900,
    "currency": "EUR",
    "mileageValue": 237000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11791398612800365",
    "make": "Audi",
    "year": 2010,
    "body": "wagon",
    "arrival": 7,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/11789907842576383/1.webp",
    "imageAlt": "VW Passat 2.0 TDI ALLTRACK DIGITAL",
    "href": "/vehicle?id=11789907842576383",
    "title": "VW Passat 2.0 TDI ALLTRACK DIGITAL",
    "location": "Варна",
    "mileage": "226000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "14200 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 14200,
    "currency": "EUR",
    "mileageValue": 226000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11789907842576383",
    "make": "VW",
    "year": 2016,
    "body": "wagon",
    "arrival": 6,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/11789911583559651/1.webp",
    "imageAlt": "Toyota Yaris 1.3vvti",
    "href": "/vehicle?id=11789911583559651",
    "title": "Toyota Yaris 1.3vvti",
    "location": "Варна",
    "mileage": "188000 km",
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
    "mileageValue": 188000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11789911583559651",
    "make": "Toyota",
    "year": 2008,
    "body": "hatchback",
    "arrival": 5,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/21789906623508409/1.webp",
    "imageAlt": "Suzuki Vitara 1.6DDIS 120кс 4x4",
    "href": "/vehicle?id=21789906623508409",
    "title": "Suzuki Vitara 1.6DDIS 120кс 4x4",
    "location": "Варна",
    "mileage": "200000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "10500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 10500,
    "currency": "EUR",
    "mileageValue": 200000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "21789906623508409",
    "make": "Suzuki",
    "year": 2017,
    "body": "suv",
    "arrival": 4,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/11789907068377884/1.webp",
    "imageAlt": "Suzuki SX4 1.6i 120кс 4x4 160.000 КМ",
    "href": "/vehicle?id=11789907068377884",
    "title": "Suzuki SX4 1.6i 120кс 4x4 160.000 КМ",
    "location": "Варна",
    "mileage": "160000 km",
    "transmission": "Manual",
    "fuel": "Petrol",
    "seats": "",
    "bodyType": "suv",
    "price": "5900 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 5900,
    "currency": "EUR",
    "mileageValue": 160000,
    "mileageUnit": "km",
    "fuelType": "gasoline",
    "transmissionType": "manual",
    "id": "11789907068377884",
    "make": "Suzuki",
    "year": 2010,
    "body": "suv",
    "arrival": 3,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/11789910526546898/1.webp",
    "imageAlt": "Renault Megane 1.9 DCI GT LINE 230.000 КМ",
    "href": "/vehicle?id=11789910526546898",
    "title": "Renault Megane 1.9 DCI GT LINE 230.000 КМ",
    "location": "Варна",
    "mileage": "230000 km",
    "transmission": "Manual",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "3999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 3999,
    "currency": "EUR",
    "mileageValue": 230000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "manual",
    "id": "11789910526546898",
    "make": "Renault",
    "year": 2011,
    "body": "wagon",
    "arrival": 2,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/11789909936155141/1.webp",
    "imageAlt": "Peugeot 3008 1.6HDI 120кс АВТОМАТИК",
    "href": "/vehicle?id=11789909936155141",
    "title": "Peugeot 3008 1.6HDI 120кс АВТОМАТИК",
    "location": "Варна",
    "mileage": "170000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "13600 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 13600,
    "currency": "EUR",
    "mileageValue": 170000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11789909936155141",
    "make": "Peugeot",
    "year": 2017,
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
  sample: "Датирана извадка от публични обяви, не складова система в реално време. Потвърдете цената, ДДС и наличността. Обявите за очакван внос не означават наличен автомобил във Варна.",
  sampleDetail:
    "Датирана извадка от публични обяви, не складова система в реално време. Потвърдете цената, ДДС и наличността. Обявите за очакван внос не означават наличен автомобил във Варна.",
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
  sample: "Датирана извадка от публични обяви, не складова система в реално време. Потвърдете цената, ДДС и наличността. Обявите за очакван внос не означават наличен автомобил във Варна.",
  sampleDetail:
    "Датирана извадка от публични обяви, не складова система в реално време. Потвърдете цената, ДДС и наличността. Обявите за очакван внос не означават наличен автомобил във Варна.",
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
