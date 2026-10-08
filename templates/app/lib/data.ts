import {isDealer} from './dealer-config';
import dealerInventory from './dealer-inventory.json';
export {formatPrice} from './format';
import {capturedVehicles} from './captured-inventory';
import {capturedRelatedVehicles} from './captured-related';

import type {Vehicle} from './vehicle';
export type {Vehicle} from './vehicle';

const existingVehicles: Vehicle[] = [
  {
    slug: '2024-toyota-fortuner-exr', year: 2024, make: 'Toyota', model: 'Fortuner', trim: 'EXR • GCC Specs',
    price: 94099, previousPrice: 100999, monthly: 1430, mileage: 50000, fuel: 'Petrol', transmission: 'Automatic',
    body: 'SUV', location: 'Millennium Place Hotel Barsha, Dubai', image: '/reference-assets/fortuner.jpg', color: 'Graphite Grey',
    badges: ['1.99% interest rate*', '6,900 OFF'], highlights: ['Great condition', 'Cruise control', 'Apple CarPlay'],
    power: '164 hp', engine: '2.7L', warranty: 'Assured warranty included', condition: 'Low imperfections',
  },
  {
    slug: '2023-suzuki-ciaz-glx', year: 2023, make: 'Suzuki', model: 'Ciaz', trim: 'GLX • GCC Specs',
    price: 28799, monthly: 438, mileage: 92000, fuel: 'Petrol', transmission: 'Automatic',
    body: 'Sedan', location: 'Millennium Place Hotel Barsha, Dubai', image: '/reference-assets/vehicle-details/9714842062/photo-0.jpg', color: 'Pearl White',
    badges: ['1.99% interest rate*'], highlights: ['Cruise control', 'GCC Specs'],
    power: '103 hp', engine: '1.5L', warranty: 'Assured warranty included', condition: 'Great condition',
  },
  {
    slug: '2025-toyota-veloz-gx', year: 2025, make: 'Toyota', model: 'Veloz', trim: 'GX • GCC Specs',
    price: 64699, monthly: 984, mileage: 47000, fuel: 'Petrol', transmission: 'Automatic',
    body: 'MPV', location: 'Millennium Place Hotel Barsha, Dubai', image: '/reference-assets/vehicle-details/9718403147/photo-0.jpg', color: 'Metallic Grey',
    badges: ['1.99% interest rate*'], highlights: ['7 seats', 'GCC Specs'],
    power: '105 hp', engine: '1.5L', warranty: 'Assured warranty included', condition: 'Great condition',
  },
  {
    slug: '2024-toyota-land-cruiser-exr', year: 2024, make: 'Toyota', model: 'Land Cruiser', trim: 'EXR • GCC Specs',
    price: 224599, previousPrice: 227999, monthly: 3413, mileage: 44000, fuel: 'Petrol', transmission: 'Automatic',
    body: 'SUV', location: 'Millennium Place Hotel Barsha, Dubai', image: '/reference-assets/land-cruiser-native-card.png', color: 'White',
    badges: ['1.99% interest rate*'], highlights: ['DC Fast Charging'],
    power: 'Not captured', engine: 'Not captured', warranty: 'Reference listing', condition: 'Reference listing',
  },
  {
    slug: '2023-haval-h6-gt-top', year: 2023, make: 'Haval', model: 'H6 GT', trim: 'TOP • GCC Specs',
    price: 55399, previousPrice: 61900, monthly: 842, mileage: 69000, fuel: 'Petrol', transmission: 'Automatic',
    body: 'SUV', location: 'Millennium Place Hotel Barsha, Dubai', image: '/cars/car-01.webp', color: 'Sapphire Blue',
    badges: ['1.99% interest rate*', '6,501 OFF'], highlights: ['Service history', 'Boosted engine', 'Cruise control'],
    power: '201 hp', engine: '2.0L Turbo', warranty: '3 months assured warranty', condition: 'Great condition',
  },
  {
    slug: '2022-mitsubishi-xpander-mid', year: 2022, make: 'Mitsubishi', model: 'Xpander', trim: 'MID • GCC Specs',
    price: 41099, previousPrice: 44500, monthly: 625, mileage: 78000, fuel: 'Petrol', transmission: 'Automatic',
    body: 'MPV', location: 'Millennium Place Hotel Barsha, Dubai', image: '/cars/car-02.webp', color: 'Pearl White',
    badges: ['COMING SOON', '3,401 OFF'], highlights: ['7 seats', 'Dealer maintained', 'Family ready'],
    power: '103 hp', engine: '1.5L', warranty: '3 months assured warranty', condition: 'Good condition',
  },
  {
    slug: '2021-mercedes-c200-amg', year: 2021, make: 'Mercedes-Benz', model: 'C 200', trim: 'AMG LINE • GCC Specs',
    price: 107500, previousPrice: 112000, monthly: 1650, mileage: 48200, fuel: 'Petrol', transmission: 'Automatic',
    body: 'Sedan', location: 'Dubai delivery hub', image: '/cars/car-04.webp', color: 'Obsidian Black',
    badges: ['FEATURED', '4,500 OFF'], highlights: ['Panoramic roof', 'Burmester audio', '360° camera'],
    power: '204 hp', engine: '1.5L Turbo', warranty: '6 months premium warranty', condition: 'Like new',
  },
  {
    slug: '2023-bmw-x3-xdrive30i', year: 2023, make: 'BMW', model: 'X3', trim: 'xDRIVE30i • GCC Specs',
    price: 173900, previousPrice: 179500, monthly: 2635, mileage: 22900, fuel: 'Petrol', transmission: 'Automatic',
    body: 'SUV', location: 'Dubai delivery hub', image: '/cars/car-05.webp', color: 'Alpine White',
    badges: ['LOW MILEAGE', '5,600 OFF'], highlights: ['M Sport package', 'Head-up display', 'Adaptive cruise'],
    power: '252 hp', engine: '2.0L Turbo', warranty: '12 months dealer warranty', condition: 'Like new',
  },
  {
    slug: '2022-audi-a5-sportback', year: 2022, make: 'Audi', model: 'A5 Sportback', trim: 'S LINE • GCC Specs',
    price: 149900, previousPrice: 154000, monthly: 2270, mileage: 35100, fuel: 'Petrol', transmission: 'Automatic',
    body: 'Hatchback', location: 'Sharjah collection point', image: '/cars/car-06.webp', color: 'Glacier White',
    badges: ['NEW ARRIVAL', '4,100 OFF'], highlights: ['Matrix LED', 'Virtual cockpit', 'Quattro'],
    power: '249 hp', engine: '2.0L Turbo', warranty: '6 months showroom warranty', condition: 'Great condition',
  },
];

export const brands = ['Mercedes-Benz', 'BMW', 'Audi', 'Toyota', 'Kia', 'Volkswagen'];
export const categories = [
  { title: 'SUV', subtitle: 'Ready for every road', image: '/cutouts/compact-suv.png' },
  { title: 'Sedan', subtitle: 'Comfort for every day', image: '/cutouts/sedan.png' },
  { title: 'Luxury', subtitle: 'Premium cars in budget', image: '/cutouts/premium-suv.png' },
];

const capturedBySlug = new Map(capturedVehicles.map(vehicle => [vehicle.slug, vehicle]));
const mergedVehicles: Vehicle[] = [
  ...existingVehicles.map(vehicle => ({...vehicle, ...capturedBySlug.get(vehicle.slug)})),
  ...capturedVehicles.filter(vehicle => !existingVehicles.some(existing => existing.slug === vehicle.slug)),
  ...capturedRelatedVehicles.filter(vehicle => !existingVehicles.some(existing => existing.slug === vehicle.slug) && !capturedBySlug.has(vehicle.slug)),
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
