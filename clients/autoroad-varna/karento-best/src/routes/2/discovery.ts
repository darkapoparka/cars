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
    "image": "/assets/vehicles/11764083375105654/1.webp",
    "imageAlt": "Peugeot 5008 1.5 HDI -LED-KEYLESS-DISTRONIK-DIGITAL-LANE ASSIST",
    "href": "/vehicle?id=11764083375105654",
    "title": "Peugeot 5008 1.5 HDI -LED-KEYLESS-DISTRONIK-DIGITAL-LANE ASSIST",
    "location": "Варна",
    "mileage": "197000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "13500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 13500,
    "currency": "EUR",
    "mileageValue": 197000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11764083375105654",
    "make": "Peugeot",
    "year": 2021,
    "body": "suv",
    "arrival": 8,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/11791216679127136/1.webp",
    "imageAlt": "Renault Megane E-TECH-EV 60-220K.S. Equilibre optimum charge",
    "href": "/vehicle?id=11791216679127136",
    "title": "Renault Megane E-TECH-EV 60-220K.S. Equilibre optimum charge",
    "location": "Варна",
    "mileage": "121000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "hatchback",
    "price": "19500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 19500,
    "currency": "EUR",
    "mileageValue": 121000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "11791216679127136",
    "make": "Renault",
    "year": 2023,
    "body": "hatchback",
    "arrival": 7,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/21791195488121434/1.webp",
    "imageAlt": "Skoda Karoq 1.6 TDI-DSG-KAMERA-LED-FACE",
    "href": "/vehicle?id=21791195488121434",
    "title": "Skoda Karoq 1.6 TDI-DSG-KAMERA-LED-FACE",
    "location": "Варна",
    "mileage": "205000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "suv",
    "price": "11999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 11999,
    "currency": "EUR",
    "mileageValue": 205000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21791195488121434",
    "make": "Skoda",
    "year": 2020,
    "body": "suv",
    "arrival": 6,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/21778683919459620/1.webp",
    "imageAlt": "Skoda Karoq 2.0 TDI -AVTOMAT-4x4-KEYLESS-DISTRONIK-DIGITAL",
    "href": "/vehicle?id=21778683919459620",
    "title": "Skoda Karoq 2.0 TDI -AVTOMAT-4x4-KEYLESS-DISTRONIK-DIGITAL",
    "location": "Варна",
    "mileage": "163000 km",
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
    "mileageValue": 163000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "21778683919459620",
    "make": "Skoda",
    "year": 2022,
    "body": "suv",
    "arrival": 5,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/11785948289956075/1.webp",
    "imageAlt": "Mercedes-Benz CLA 200 AMG-PANORAM-PODGREV-AMBIENT-MEMORI",
    "href": "/vehicle?id=11785948289956075",
    "title": "Mercedes-Benz CLA 200 AMG-PANORAM-PODGREV-AMBIENT-MEMORI",
    "location": "Варна",
    "mileage": "170000 km",
    "transmission": "Automatic",
    "fuel": "Diesel",
    "seats": "",
    "bodyType": "wagon",
    "price": "25500 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 25500,
    "currency": "EUR",
    "mileageValue": 170000,
    "mileageUnit": "km",
    "fuelType": "diesel",
    "transmissionType": "automatic",
    "id": "11785948289956075",
    "make": "Mercedes-Benz",
    "year": 2022,
    "body": "wagon",
    "arrival": 4,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/21781865867073187/1.webp",
    "imageAlt": "Audi Q4 SPORTBACK E-TRON 82KWH 40 S LINE-PANORAMA-AMBIENT",
    "href": "/vehicle?id=21781865867073187",
    "title": "Audi Q4 SPORTBACK E-TRON 82KWH 40 S LINE-PANORAMA-AMBIENT",
    "location": "Варна",
    "mileage": "128000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "suv",
    "price": "29999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 29999,
    "currency": "EUR",
    "mileageValue": 128000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "21781865867073187",
    "make": "Audi",
    "year": 2022,
    "body": "suv",
    "arrival": 3,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/11781957951294075/1.webp",
    "imageAlt": "Lotus Eletre 112 KW-612 K.S.-AKEBONO EDITION",
    "href": "/vehicle?id=11781957951294075",
    "title": "Lotus Eletre 112 KW-612 K.S.-AKEBONO EDITION",
    "location": "Варна",
    "mileage": "90000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "suv",
    "price": "69999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 69999,
    "currency": "EUR",
    "mileageValue": 90000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "11781957951294075",
    "make": "Lotus",
    "year": 2024,
    "body": "suv",
    "arrival": 2,
    "offer": false,
    "exclusive": false
  },
  {
    "sample": false,
    "image": "/assets/vehicles/11789287072800457/1.webp",
    "imageAlt": "VW ID.4 Pro-82kWh-AMBIENT LIGHT-LED-SOH-91.36%",
    "href": "/vehicle?id=11789287072800457",
    "title": "VW ID.4 Pro-82kWh-AMBIENT LIGHT-LED-SOH-91.36%",
    "location": "Варна",
    "mileage": "169000 km",
    "transmission": "Automatic",
    "fuel": "Electric",
    "seats": "",
    "bodyType": "suv",
    "price": "21999 EUR",
    "pricePeriod": "",
    "action": "Enquire",
    "rating": "",
    "reviews": "",
    "priceAmount": 21999,
    "currency": "EUR",
    "mileageValue": 169000,
    "mileageUnit": "km",
    "fuelType": "electric",
    "transmissionType": "automatic",
    "id": "11789287072800457",
    "make": "VW",
    "year": 2021,
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
