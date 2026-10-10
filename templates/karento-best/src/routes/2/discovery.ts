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
  body: "hatchback" | "sedan" | "suv" | "pickup" | "coupe" | "convertible";
}

type Sample = Pick<
  DiscoveryCar,
  "id" | "title" | "image" | "make" | "year" | "body" | "arrival"
> & {
  amount: number;
  mileage: number;
  offer?: boolean;
  exclusive?: boolean;
};

/** Sale values are illustrative data for /2, independent of the main rental demo. */
function sample(input: Sample): DiscoveryCar {
  return {
    ...input,
    sample: true,
    offer: input.offer ?? false,
    exclusive: input.exclusive ?? false,
    imageAlt: "Illustrative " + input.title,
    href: "/2?car=" + input.id,
    price: "€" + input.amount,
    priceAmount: input.amount,
    currency: "EUR",
    pricePeriod: "",
    pricePeriodKey: undefined,
    mileage: String(input.mileage) + " km",
    mileageValue: input.mileage,
    mileageUnit: "km",
    action: "View car",
    actionKey: undefined,
    location: "",
    transmission: "",
    fuel: "",
    seats: "",
    rating: "",
    reviews: "",
    reviewCount: undefined,
  };
}

export const discoveryCars: readonly DiscoveryCar[] = [
  sample({
    id: "hyundai-compact",
    title: "Hyundai compact SUV",
    image: "/assets/imgs/cars-listing/cars-listing-3/car-1.png",
    make: "Hyundai",
    year: 2015,
    body: "suv",
    amount: 8900,
    mileage: 142000,
    arrival: 8,
    offer: true,
  }),
  sample({
    id: "honda-suv",
    title: "Honda compact SUV",
    image: "/assets/imgs/cars-listing/cars-listing-3/car-2.png",
    make: "Honda",
    year: 2019,
    body: "suv",
    amount: 16900,
    mileage: 86000,
    arrival: 9,
  }),
  sample({
    id: "toyota-hatch",
    title: "Toyota hatchback",
    image: "/assets/imgs/cars-listing/cars-listing-3/car-3.png",
    make: "Toyota",
    year: 2016,
    body: "hatchback",
    amount: 7900,
    mileage: 97000,
    arrival: 12,
  }),
  sample({
    id: "toyota-compact",
    title: "Toyota compact SUV",
    image: "/assets/imgs/cars-listing/cars-listing-3/car-4.png",
    make: "Toyota",
    year: 2020,
    body: "suv",
    amount: 19900,
    mileage: 68000,
    arrival: 6,
    offer: true,
  }),
  sample({
    id: "hyundai-crossover",
    title: "Hyundai crossover",
    image: "/assets/imgs/cars-listing/cars-listing-3/car-6.png",
    make: "Hyundai",
    year: 2020,
    body: "suv",
    amount: 18900,
    mileage: 54000,
    arrival: 10,
  }),
  sample({
    id: "audi-premium",
    title: "Audi premium SUV",
    image: "/assets/imgs/cars-listing/cars-listing-2/car-4.png",
    make: "Audi",
    year: 2021,
    body: "suv",
    amount: 64900,
    mileage: 43000,
    arrival: 17,
    offer: true,
    exclusive: true,
  }),
  sample({
    id: "kia-saloon",
    title: "Kia saloon",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-18.png",
    make: "Kia",
    year: 2018,
    body: "sedan",
    amount: 13900,
    mileage: 74000,
    arrival: 14,
  }),
  sample({
    id: "porsche-coupe",
    title: "Porsche coupe",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-6.png",
    make: "Porsche",
    year: 2021,
    body: "coupe",
    amount: 58900,
    mileage: 28000,
    arrival: 5,
    offer: true,
    exclusive: true,
  }),
  sample({
    id: "mercedes-suv",
    title: "Mercedes-Benz SUV",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-4.png",
    make: "Mercedes-Benz",
    year: 2021,
    body: "suv",
    amount: 49900,
    mileage: 51000,
    arrival: 15,
    exclusive: true,
  }),
  sample({
    id: "hyundai-family",
    title: "Hyundai family SUV",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-2.png",
    make: "Hyundai",
    year: 2022,
    body: "suv",
    amount: 29900,
    mileage: 32000,
    arrival: 13,
  }),
  sample({
    id: "toyota-crossover",
    title: "Toyota crossover",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-16.png",
    make: "Toyota",
    year: 2022,
    body: "suv",
    amount: 24900,
    mileage: 28000,
    arrival: 11,
  }),
  sample({
    id: "hyundai-saloon",
    title: "Hyundai saloon",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-17.png",
    make: "Hyundai",
    year: 2016,
    body: "sedan",
    amount: 9500,
    mileage: 134000,
    arrival: 4,
  }),
  sample({
    id: "bmw-compact",
    title: "BMW compact SUV",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-7.png",
    make: "BMW",
    year: 2020,
    body: "suv",
    amount: 34900,
    mileage: 68000,
    arrival: 16,
    offer: true,
  }),
  sample({
    id: "mitsubishi-saloon",
    title: "Mitsubishi saloon",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-20.png",
    make: "Mitsubishi",
    year: 2013,
    body: "sedan",
    amount: 6900,
    mileage: 179000,
    arrival: 1,
  }),
  sample({
    id: "bmw-family",
    title: "BMW family SUV",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-12.png",
    make: "BMW",
    year: 2021,
    body: "suv",
    amount: 44900,
    mileage: 38000,
    arrival: 3,
    exclusive: true,
  }),
  sample({
    id: "bmw-sport",
    title: "BMW sport SUV",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-11.png",
    make: "BMW",
    year: 2019,
    body: "suv",
    amount: 25500,
    mileage: 57000,
    arrival: 2,
    offer: true,
  }),
];

export const collections = [
  { id: "newest", title: "newest" },
  { id: "offers", title: "offers" },
  { id: "under-10000", title: "under10" },
  { id: "cheapest", title: "cheapest" },
  { id: "premium", title: "premium" },
  { id: "exclusive", title: "exclusive" },
  { id: "under-20000", title: "under20" },
  { id: "bmw", title: "bmw" },
  { id: "german", title: "german" },
  { id: "suvs", title: "suvs" },
] as const;
export type Collection = (typeof collections)[number];
export type CollectionId = Collection["id"];

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
  maximumPrice: "Maximum price (€)",
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
  sample: "Sample cars · illustrative sale prices",
  sampleDetail:
    "This car and its sale price are illustrative examples for this preview.",
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
  maximumPrice: "Максимална цена (€)",
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
  sample: "Примерни коли · илюстративни продажни цени",
  sampleDetail:
    "Този автомобил и продажната му цена са илюстративни примери за това демо.",
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
