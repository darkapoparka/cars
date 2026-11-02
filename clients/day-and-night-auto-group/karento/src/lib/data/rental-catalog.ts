/** Owner-authorized showcase fleet and EUR/day pricing. Not connected to live availability. */
import { rentalDate } from "./journeys.ts";
import { discoveryCars } from "#lib/discovery/discovery.ts";

const rates = [
  ["21784728210405323", 85, "compact"],
  ["11781786688563618", 140, "saloon"],
  ["21781366888650416", 180, "suv"],
  ["21783785043166128", 190, "suv"],
  ["11782122632841845", 290, "saloon"],
  ["21784223776383846", 210, "suv"],
] as const;

export const rentalCars = rates.map(([sourceId, dailyRate, category]) => {
  const car = discoveryCars.find((car) => car.id === sourceId)!;
  return {
    id: "rental-" + sourceId,
    title: car.title,
    make: car.make,
    image: car.image,
    dailyRate,
    category,
  };
});

export function rentalDays(pickup: string, returning: string): number {
  if (!rentalDate(pickup) || !rentalDate(returning)) return 0;
  const days =
    (Date.parse(returning + "T12:00:00Z") - Date.parse(pickup + "T12:00:00Z")) /
    86400000;
  return Number.isInteger(days) && days >= 0 ? Math.max(1, days) : 0;
}

export function filterRentalCars(
  query: string,
  make: string,
  budget: string,
  sort: string,
  category = "",
) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const cars = rentalCars.filter(
    (car) =>
      (!category || car.category === category) &&
      (!make || car.make === make) &&
      (!budget || car.dailyRate <= Number(budget)) &&
      terms.every((term) =>
        `${car.title} ${car.category}`.toLocaleLowerCase().includes(term),
      ),
  );
  return sort === "price-asc" || sort === "price-desc"
    ? cars.toSorted(
        (a, b) =>
          (a.dailyRate - b.dailyRate) * (sort === "price-desc" ? -1 : 1),
      )
    : cars;
}
