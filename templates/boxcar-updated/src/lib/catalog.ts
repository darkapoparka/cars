import data from "../data/vehicles.json";
export interface Vehicle {
  id: string;
  slug: string;
  legacySlug?: string;
  originalPath?: string;
  title: string;
  make: string;
  model: string;
  price: number;
  image: string;
  gallery: string[];
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  condition: string;
  body: string;
  engine: string;
  drive: string;
  color: string;
  doors: number;
  seats: number;
  features: string[];
  badge: string;
}
export const vehicles: Vehicle[] = data;
export const makes = [...new Set(vehicles.map((v) => v.make))].sort();
export const bodies = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Truck",
  "Van",
];
export const fuels = [...new Set(vehicles.map((v) => v.fuel))].sort();
export const money = (value: number, decimals = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
export const number = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);
export const vehicleBySlug = (slug: string) =>
  vehicles.find((v) => v.slug === slug);
export function detailHref(
  v: Vehicle,
  returnTo = window.location.pathname + window.location.search,
) {
  return `/vehicle/${v.slug}/?return=${encodeURIComponent(returnTo)}`;
}
