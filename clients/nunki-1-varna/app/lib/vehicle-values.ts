import type {Vehicle} from './vehicle';

/** A missing published value is not zero, a discount, or a cheap/low-mileage car. */
export function hasPublishedPrice(vehicle: Vehicle): boolean {
  return !vehicle.priceOnRequest && Number.isFinite(vehicle.price) && vehicle.price > 0;
}
export function hasPublishedMileage(vehicle: Vehicle): boolean {
  return !vehicle.mileageOnRequest && Number.isFinite(vehicle.mileage) && vehicle.mileage >= 0;
}
export function hasPublishedMonthlyPayment(vehicle: Vehicle): boolean {
  return hasPublishedPrice(vehicle) && Number.isFinite(vehicle.monthly) && vehicle.monthly > 0;
}
export function vehicleDiscount(vehicle: Vehicle): number {
  if (!hasPublishedPrice(vehicle) || !Number.isFinite(vehicle.previousPrice)) return 0;
  return Math.max(0, (vehicle.previousPrice ?? vehicle.price) - vehicle.price);
}
