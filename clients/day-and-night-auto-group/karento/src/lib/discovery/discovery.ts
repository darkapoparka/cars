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
    sample: false,
    image: "/dealer-inventory/21784728210405323.webp",
    imageAlt: "Mercedes-Benz GLA 45 AMG",
    href: "/vehicle?id=21784728210405323",
    title: "Mercedes-Benz GLA 45 AMG",
    location: "София",
    mileage: "170000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: "",
    bodyType: "coupe",
    price: "26699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 26699,
    currency: "EUR",
    mileageValue: 170000,
    mileageUnit: "km",
    fuelType: "gasoline",
    transmissionType: "automatic",
    id: "21784728210405323",
    make: "Mercedes-Benz",
    year: 2016,
    body: "coupe",
    arrival: 16,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/11782122632841845.webp",
    imageAlt: "Mercedes-Benz S 63 AMG",
    href: "/vehicle?id=11782122632841845",
    title: "Mercedes-Benz S 63 AMG",
    location: "София",
    mileage: "30000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: "",
    bodyType: "other",
    price: "143699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 143699,
    currency: "EUR",
    mileageValue: 30000,
    mileageUnit: "km",
    fuelType: "gasoline",
    transmissionType: "automatic",
    id: "11782122632841845",
    make: "Mercedes-Benz",
    year: 2024,
    body: "other",
    arrival: 15,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/11781786688563618.webp",
    imageAlt: "Mercedes-Benz S 400",
    href: "/vehicle?id=11781786688563618",
    title: "Mercedes-Benz S 400",
    location: "София",
    mileage: "179000 km",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "",
    bodyType: "other",
    price: "48699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 48699,
    currency: "EUR",
    mileageValue: 179000,
    mileageUnit: "km",
    fuelType: "diesel",
    transmissionType: "automatic",
    id: "11781786688563618",
    make: "Mercedes-Benz",
    year: 2019,
    body: "other",
    arrival: 14,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/21781366888650416.webp",
    imageAlt: "Mercedes-Benz GLS 400",
    href: "/vehicle?id=21781366888650416",
    title: "Mercedes-Benz GLS 400",
    location: "София",
    mileage: "149000 km",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "",
    bodyType: "suv",
    price: "72699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 72699,
    currency: "EUR",
    mileageValue: 149000,
    mileageUnit: "km",
    fuelType: "diesel",
    transmissionType: "automatic",
    id: "21781366888650416",
    make: "Mercedes-Benz",
    year: 2021,
    body: "suv",
    arrival: 13,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/21784223776383846.webp",
    imageAlt: "Mercedes-Benz GLE 53 4MATIC",
    href: "/vehicle?id=21784223776383846",
    title: "Mercedes-Benz GLE 53 4MATIC",
    location: "София",
    mileage: "105000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: "",
    bodyType: "suv",
    price: "71699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 71699,
    currency: "EUR",
    mileageValue: 105000,
    mileageUnit: "km",
    fuelType: "gasoline",
    transmissionType: "automatic",
    id: "21784223776383846",
    make: "Mercedes-Benz",
    year: 2022,
    body: "suv",
    arrival: 12,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/21781186627237038.webp",
    imageAlt: "Mercedes-Benz GLE 400 Coupe",
    href: "/vehicle?id=21781186627237038",
    title: "Mercedes-Benz GLE 400 Coupe",
    location: "София",
    mileage: "166000 km",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "",
    bodyType: "suv",
    price: "63699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 63699,
    currency: "EUR",
    mileageValue: 166000,
    mileageUnit: "km",
    fuelType: "diesel",
    transmissionType: "automatic",
    id: "21781186627237038",
    make: "Mercedes-Benz",
    year: 2021,
    body: "suv",
    arrival: 11,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/21775198700636300.webp",
    imageAlt: "Mercedes-Benz GL 63 AMG",
    href: "/vehicle?id=21775198700636300",
    title: "Mercedes-Benz GL 63 AMG",
    location: "София",
    mileage: "139000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: "",
    bodyType: "suv",
    price: "32699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 32699,
    currency: "EUR",
    mileageValue: 139000,
    mileageUnit: "km",
    fuelType: "gasoline",
    transmissionType: "automatic",
    id: "21775198700636300",
    make: "Mercedes-Benz",
    year: 2016,
    body: "suv",
    arrival: 10,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/21758203454344162.webp",
    imageAlt: "Mercedes-Benz G 350",
    href: "/vehicle?id=21758203454344162",
    title: "Mercedes-Benz G 350",
    location: "София",
    mileage: "130000 km",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "",
    bodyType: "suv",
    price: "54699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 54699,
    currency: "EUR",
    mileageValue: 130000,
    mileageUnit: "km",
    fuelType: "diesel",
    transmissionType: "automatic",
    id: "21758203454344162",
    make: "Mercedes-Benz",
    year: 2017,
    body: "suv",
    arrival: 9,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/21781097577012835.webp",
    imageAlt: "Land Rover Range Rover Sport",
    href: "/vehicle?id=21781097577012835",
    title: "Land Rover Range Rover Sport",
    location: "София",
    mileage: "155000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: "",
    bodyType: "suv",
    price: "54699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 54699,
    currency: "EUR",
    mileageValue: 155000,
    mileageUnit: "km",
    fuelType: "gasoline",
    transmissionType: "automatic",
    id: "21781097577012835",
    make: "Land Rover",
    year: 2021,
    body: "suv",
    arrival: 8,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/21783785043166128.webp",
    imageAlt: "BMW X7",
    href: "/vehicle?id=21783785043166128",
    title: "BMW X7",
    location: "София",
    mileage: "150000 km",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "",
    bodyType: "suv",
    price: "53699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 53699,
    currency: "EUR",
    mileageValue: 150000,
    mileageUnit: "km",
    fuelType: "diesel",
    transmissionType: "automatic",
    id: "21783785043166128",
    make: "BMW",
    year: 2021,
    body: "suv",
    arrival: 7,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/21784134153263153.webp",
    imageAlt: "BMW X6",
    href: "/vehicle?id=21784134153263153",
    title: "BMW X6",
    location: "София",
    mileage: "160000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: "",
    bodyType: "suv",
    price: "71669 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 71669,
    currency: "EUR",
    mileageValue: 160000,
    mileageUnit: "km",
    fuelType: "gasoline",
    transmissionType: "automatic",
    id: "21784134153263153",
    make: "BMW",
    year: 2023,
    body: "suv",
    arrival: 6,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/21777637702876978.webp",
    imageAlt: "BMW X6",
    href: "/vehicle?id=21777637702876978",
    title: "BMW X6",
    location: "София",
    mileage: "183000 km",
    transmission: "Automatic",
    fuel: "Diesel",
    seats: "",
    bodyType: "suv",
    price: "28699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 28699,
    currency: "EUR",
    mileageValue: 183000,
    mileageUnit: "km",
    fuelType: "diesel",
    transmissionType: "automatic",
    id: "21777637702876978",
    make: "BMW",
    year: 2017,
    body: "suv",
    arrival: 5,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/11775899765171119.webp",
    imageAlt: "BMW 430",
    href: "/vehicle?id=11775899765171119",
    title: "BMW 430",
    location: "София",
    mileage: "35000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: "",
    bodyType: "other",
    price: "41699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 41699,
    currency: "EUR",
    mileageValue: 35000,
    mileageUnit: "km",
    fuelType: "gasoline",
    transmissionType: "automatic",
    id: "11775899765171119",
    make: "BMW",
    year: 2023,
    body: "other",
    arrival: 4,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/11781969350224394.webp",
    imageAlt: "Audi Rs6",
    href: "/vehicle?id=11781969350224394",
    title: "Audi Rs6",
    location: "София",
    mileage: "169000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: "",
    bodyType: "wagon",
    price: "69699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 69699,
    currency: "EUR",
    mileageValue: 169000,
    mileageUnit: "km",
    fuelType: "gasoline",
    transmissionType: "automatic",
    id: "11781969350224394",
    make: "Audi",
    year: 2020,
    body: "wagon",
    arrival: 3,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/11782541049698048.webp",
    imageAlt: "Mercedes-Benz AMG GT S",
    href: "/vehicle?id=11782541049698048",
    title: "Mercedes-Benz AMG GT S",
    location: "София",
    mileage: "70000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: "",
    bodyType: "coupe",
    price: "88699 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 88699,
    currency: "EUR",
    mileageValue: 70000,
    mileageUnit: "km",
    fuelType: "gasoline",
    transmissionType: "automatic",
    id: "11782541049698048",
    make: "Mercedes-Benz",
    year: 2017,
    body: "coupe",
    arrival: 2,
    offer: false,
    exclusive: false,
  },
  {
    sample: false,
    image: "/dealer-inventory/21762334502775312.webp",
    imageAlt: "Lamborghini Urus",
    href: "/vehicle?id=21762334502775312",
    title: "Lamborghini Urus",
    location: "София",
    mileage: "86000 km",
    transmission: "Automatic",
    fuel: "Petrol",
    seats: "",
    bodyType: "suv",
    price: "172669 EUR",
    pricePeriod: "",
    action: "Enquire",
    rating: "",
    reviews: "",
    priceAmount: 172669,
    currency: "EUR",
    mileageValue: 86000,
    mileageUnit: "km",
    fuelType: "gasoline",
    transmissionType: "automatic",
    id: "21762334502775312",
    make: "Lamborghini",
    year: 2021,
    body: "suv",
    arrival: 1,
    offer: false,
    exclusive: false,
  },
];

export const collections: readonly {
  id: CollectionId;
  title: DiscoveryTextKey;
}[] = [
  {
    id: "newest",
    title: "all",
  },
  {
    id: "cheapest",
    title: "cheapest",
  },
  {
    id: "bmw",
    title: "bmw",
  },
  {
    id: "german",
    title: "german",
  },
  {
    id: "suvs",
    title: "suvs",
  },
];
export type Collection = (typeof collections)[number];
export type CollectionId =
  | "newest"
  | "offers"
  | "under-10000"
  | "cheapest"
  | "premium"
  | "exclusive"
  | "under-20000"
  | "bmw"
  | "german"
  | "suvs";

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

/** Several listings can share a model; offer each supplied name once. */
export function discoveryModels(make: string) {
  return [
    ...new Set(
      discoveryCars.filter((car) => car.make === make).map((car) => car.title),
    ),
  ]
    .map((title) => ({
      value: title,
      label: discoveryModelLabel(make, title),
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
  return "/?" + next.toString() + hash;
}

/** Detail returns stay on Home; bookmarked /2 returns normalize to the same route. */
export function discoveryReturn(value: string | null): string {
  if (!value || !/^\/(?:2)?(?:[?#]|$)/.test(value)) return "/";
  const destination = new URL(value, "https://preview.invalid");
  if (
    !["/", "/2"].includes(destination.pathname) ||
    destination.searchParams.has("car")
  )
    return "/";
  destination.pathname = "/";
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
  sample: "Listing snapshot · confirm availability.",
  sampleDetail: "Listing snapshot · confirm availability.",
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
  sample: "Датирани обяви · потвърдете наличността.",
  sampleDetail: "Датирани обяви · потвърдете наличността.",
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
