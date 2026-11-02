import { catalogMake } from "./mobile-catalog.ts";

export function saleMakes(cars: readonly { title: string }[]): string[] {
  return [
    ...new Set(cars.map((car) => catalogMake({ ...car, price: "" }))),
  ].sort();
}

export function saleModels(
  cars: readonly { title: string }[],
  make: string,
): string[] {
  if (!make) return [];
  return [
    ...new Set(
      cars
        .filter((car) => catalogMake({ ...car, price: "" }) === make)
        .map((car) => car.title.slice(make.length + 1)),
    ),
  ].sort();
}
