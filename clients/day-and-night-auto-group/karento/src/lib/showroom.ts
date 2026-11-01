export interface ListingInput {
  id: string;
  title: string;
  make: string;
  year: number;
  image: string;
  priceAmount: number | null;
  currency: string;
  mileageValue: number;
  fuelType: string;
  transmissionType: string;
  color: string;
  powerHp?: number | null;
  raw?: { power?: string };
}
export interface Car {
  id: string;
  title: string;
  originalTitle: string;
  make: string;
  model: string;
  year: number;
  image: string;
  priceAmount: number | null;
  currency: string;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  power: number | null;
  expectedImport: boolean;
}
export interface Filters {
  make: string;
  model: string;
  budget: string;
  sort: string;
  view: "grid" | "list";
}
export interface ShowroomData {
  business: {
    slug: string;
    name: string;
    shortName: string;
    phoneHref: string;
    phoneDisplay: string;
    address: string;
    logo: string;
    observedAt: string;
    services: string[];
  };
  cars: Car[];
  filters: Filters;
  queryKey: string;
  today: string;
}
export const budgets = [20000, 30000, 50000, 75000, 100000, 150000];
export function normalizeCar(car: ListingInput): Car {
  const make =
    car.make === "Land" && /^Land Rover\b/i.test(car.title)
      ? "Land Rover"
      : car.make;
  const escaped = make.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const model = car.title
    .replace(new RegExp("^" + escaped + "\\s*", "i"), "")
    .split(
      /\s+(?:Очакван|ОЧАКВАН|Mercedes|BMW|Audi|LAMBORGHINI|Range Rover SPORT|AMG360)/,
    )[0]
    .trim();
  const match = /^(\d+(?:[.,]\d+)?)\s*(?:hp|к\.?\s*с\.?)$/i.exec(
    car.raw?.power?.trim() || "",
  );
  const power =
    car.powerHp ?? (match ? Number(match[1].replace(",", ".")) : null);
  return {
    id: car.id,
    title: `${make} ${model}`,
    originalTitle: car.title,
    make,
    model,
    year: car.year,
    image: car.image,
    priceAmount: car.priceAmount,
    currency: car.currency,
    mileage: car.mileageValue,
    color: car.color,
    fuel:
      (
        {
          gasoline: "Petrol",
          diesel: "Diesel",
          hybrid: "Hybrid",
          electric: "Electric",
          lpg: "LPG",
        } as Record<string, string>
      )[car.fuelType] || "",
    transmission:
      ({ automatic: "Automatic", manual: "Manual" } as Record<string, string>)[
        car.transmissionType
      ] || "",
    power: power && power > 0 ? power : null,
    expectedImport: /очакван/i.test(car.title),
  };
}
export function readFilters(params: URLSearchParams): Filters {
  const sort = params.get("sort") || "featured";
  const budget = params.get("budget") || "";
  return {
    make: (params.get("make") || "").trim().slice(0, 80),
    model: (params.get("model") || "").trim().slice(0, 100),
    budget: budgets.includes(Number(budget)) ? budget : "",
    sort: ["featured", "price-asc", "price-desc", "year-desc"].includes(sort)
      ? sort
      : "featured",
    view: params.get("view") === "list" ? "list" : "grid",
  };
}
export function filterCars(cars: Car[], filters: Filters): Car[] {
  const result = cars.filter(
    (car) =>
      (!filters.make || car.make === filters.make) &&
      (!filters.model || car.model === filters.model) &&
      (!filters.budget ||
        (car.priceAmount !== null &&
          car.priceAmount <= Number(filters.budget))),
  );
  if (filters.sort === "price-asc")
    result.sort(
      (a, b) => (a.priceAmount ?? Infinity) - (b.priceAmount ?? Infinity),
    );
  if (filters.sort === "price-desc")
    result.sort(
      (a, b) => (b.priceAmount ?? -Infinity) - (a.priceAmount ?? -Infinity),
    );
  if (filters.sort === "year-desc") result.sort((a, b) => b.year - a.year);
  return result;
}
export function inventoryUrl(filters: Filters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (
      value &&
      !(key === "sort" && value === "featured") &&
      !(key === "view" && value === "grid")
    )
      params.set(key, value);
  }
  const query = params.toString();
  return "/vehicles" + (query ? "?" + query : "");
}
export function nextDate(date: string): string {
  const timestamp = Date.parse(date);
  return Number.isFinite(timestamp)
    ? new Date(timestamp + 86400000).toISOString().slice(0, 10)
    : "";
}
export function money(amount: number | null, currency = "EUR"): string {
  return amount === null
    ? "Price on request"
    : new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency,
        maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      }).format(amount);
}
export function rentalDateError(
  pickup: string,
  dropoff: string,
  today: string,
): string {
  const valid = (date: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(Date.parse(date)) &&
    new Date(date).toISOString().slice(0, 10) === date;
  if (!valid(pickup) || !valid(dropoff))
    return "Choose a pickup date and a return date.";
  if (pickup < today) return "Pickup must be today or later.";
  if (dropoff <= pickup) return "Return must be after your pickup date.";
  return "";
}
