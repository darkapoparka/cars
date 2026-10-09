import dealerInventory from './dealer-inventory.json';
import {isDealer} from './dealer-config';
import type {Vehicle} from './vehicle';
import {hasPublishedMileage, hasPublishedPrice} from './vehicle-values';

const referenceBounds = {
  minimum: 8000, maximum: 950000, yearMinimum: 2003, yearMaximum: 2026,
  mileageMinimum: 0, mileageMaximum: 530000, engineMinimum: 0, engineMaximum: 7,
  cylinderMinimum: 0, cylinderMaximum: 12,
};
/** Preserve the reference controls, expanding only when a dealer's actual stock needs it. */
export function deriveInventoryBounds(vehicles: readonly Vehicle[], year = new Date().getUTCFullYear()) {
  const bounds = {...referenceBounds, yearMaximum: Math.max(referenceBounds.yearMaximum, year)};
  for (const vehicle of vehicles) {
    if (hasPublishedPrice(vehicle)) {
      bounds.minimum = Math.min(bounds.minimum, Math.floor(vehicle.price / 1000) * 1000);
      bounds.maximum = Math.max(bounds.maximum, Math.ceil(vehicle.price / 1000) * 1000);
    }
    if (Number.isFinite(vehicle.year) && vehicle.year >= 1900) {
      bounds.yearMinimum = Math.min(bounds.yearMinimum, vehicle.year);
      bounds.yearMaximum = Math.max(bounds.yearMaximum, vehicle.year);
    }
    if (hasPublishedMileage(vehicle)) bounds.mileageMaximum = Math.max(bounds.mileageMaximum, Math.ceil(vehicle.mileage / 1000) * 1000);
    const engine = Number.parseFloat(vehicle.engine);
    if (Number.isFinite(engine)) bounds.engineMaximum = Math.max(bounds.engineMaximum, Math.ceil(engine * 10) / 10);
    if (Number.isFinite(vehicle.cylinders)) bounds.cylinderMaximum = Math.max(bounds.cylinderMaximum, vehicle.cylinders ?? 0);
  }
  return bounds;
}
// These files are validated before dev/build. No captured/demo catalogue is imported by the filter engine.
export const inventoryBounds = Object.freeze(deriveInventoryBounds(isDealer ? dealerInventory as Vehicle[] : []));
