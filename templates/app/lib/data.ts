import {isDealer} from './dealer-config';
import dealerInventory from './dealer-inventory.json';
export {formatPrice} from './format';
import {capturedVehicles} from './captured-inventory';
import {capturedRelatedVehicles} from './captured-related';

import type {Vehicle} from './vehicle';
export type {Vehicle} from './vehicle';

import {demoVehicles as existingVehicles} from './fixtures/demo-vehicles';

const existingSlugs = new Set(existingVehicles.map(vehicle => vehicle.slug));
const capturedBySlug = new Map(capturedVehicles.map(vehicle => [vehicle.slug, vehicle]));
const mergedVehicles: Vehicle[] = [
  ...existingVehicles.map(vehicle => ({...vehicle, ...capturedBySlug.get(vehicle.slug)})),
  ...capturedVehicles.filter(vehicle => !existingSlugs.has(vehicle.slug)),
  ...capturedRelatedVehicles.filter(vehicle => !existingSlugs.has(vehicle.slug) && !capturedBySlug.has(vehicle.slug)),
];
const nativeFirst = ['2024-toyota-fortuner-exr', '2023-suzuki-ciaz-glx', '2025-toyota-veloz-gx',
  '9718423696', '9718425910', '9718424077', '9714841440', '9714842271'];
const rank = (vehicle: Vehicle) => {
  const position = nativeFirst.findIndex(key => key === vehicle.slug || key === vehicle.referenceId);
  return position < 0 ? nativeFirst.length : position;
};
export const vehicles: Vehicle[] = isDealer ? dealerInventory as Vehicle[] : mergedVehicles.sort((a, b) => rank(a) - rank(b));
export const homeFeed = isDealer ? vehicles : [
  ...vehicles.filter(vehicle => rank(vehicle) < nativeFirst.length),
  ...capturedVehicles.filter(vehicle => rank(vehicle) === nativeFirst.length),
];
export const hotDeals = isDealer ? vehicles.slice(0, 4) : capturedVehicles.filter(vehicle =>
  ['9718349728', '9714839863', '9714841097'].includes(vehicle.referenceId ?? ''));

const vehiclesBySlug = new Map(vehicles.map(vehicle => [vehicle.slug, vehicle]));
export const getVehicle = (slug: string) => vehiclesBySlug.get(slug);
