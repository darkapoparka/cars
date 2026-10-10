import type {Vehicle} from './vehicle';
import {hasPublishedMileage, hasPublishedPrice, vehicleDiscount} from './vehicle-values';

export const inventorySorts = ['default', 'recent', 'price-asc', 'price-desc', 'kms-asc', 'kms-desc', 'discount', 'age-asc', 'age-desc'] as const;
export type InventorySort = (typeof inventorySorts)[number];
export const inventorySortGroups = [
  {title: '', items: [['Best match', 'default'], ['Recently added', 'recent']]},
  {title: 'Discount', items: [['High to low', 'discount']]},
  {title: 'Price', items: [['Low to high', 'price-asc'], ['High to low', 'price-desc']]},
  {title: 'Mileage', items: [['Low to high', 'kms-asc'], ['High to low', 'kms-desc']]},
  {title: 'Car age', items: [['Oldest first', 'age-asc'], ['Newest first', 'age-desc']]},
] as const satisfies readonly {title: string; items: readonly (readonly [string, InventorySort])[]}[];
export function isInventorySort(value: string): value is InventorySort {
  return inventorySorts.some(sort => sort === value);
}
function comparePublished(a: number | undefined, b: number | undefined, direction: number): number {
  if (a === undefined) return b === undefined ? 0 : 1;
  if (b === undefined) return -1;
  return (a - b) * direction;
}
/** Stable, non-mutating ordering; absent values remain last in either direction. */
export function sortInventory(vehicles: readonly Vehicle[], order: string): Vehicle[] {
  if (order === 'default' || !isInventorySort(order)) return [...vehicles];
  const value = (vehicle: Vehicle): number | undefined => {
    if (order.startsWith('price-')) return hasPublishedPrice(vehicle) ? vehicle.price : undefined;
    if (order.startsWith('kms-')) return hasPublishedMileage(vehicle) ? vehicle.mileage : undefined;
    if (order === 'discount') return hasPublishedPrice(vehicle) ? vehicleDiscount(vehicle) : undefined;
    if (order === 'recent') {
      const date = vehicle.listedAt ? Date.parse(vehicle.listedAt) : NaN;
      return Number.isFinite(date) ? date : undefined;
    }
    return Number.isFinite(vehicle.year) && vehicle.year > 0 ? vehicle.year : undefined;
  };
  const direction = order.endsWith('-asc') ? 1 : -1;
  return vehicles.map(vehicle => ({vehicle, value: value(vehicle)}))
    .sort((a, b) => comparePublished(a.value, b.value, direction))
    .map(item => item.vehicle);
}
