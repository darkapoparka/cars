import type {Vehicle} from './vehicle';
import {isDealer} from './dealer-config';
import dealerImportInventory from './dealer-import-inventory.json';

export type ImportListing = {countryCode: string; vehicle: Vehicle};
type DemoDetails = Pick<Vehicle, 'year' | 'make' | 'model' | 'trim' | 'price' | 'mileage' | 'fuel' | 'body' | 'transmission' | 'image'>;

function demo(slug: string, countryCode: string, details: DemoDetails): ImportListing {
  return {countryCode, vehicle: {...details, slug, monthly: 0, location: '', color: '', badges: [], highlights: [details.fuel], power: '', engine: '', warranty: '', condition: ''}};
}

// Synthetic examples with original generated photos, kept outside dealer stock.
const demoImportListings: ImportListing[] = [
  demo('demo-import-rav4-ca', 'CA', {year: 2021, make: 'Toyota', model: 'RAV4', trim: 'Hybrid AWD', price: 19800, mileage: 72000, fuel: 'Hybrid', body: 'SUV', transmission: 'Automatic', image: '/showroom/imports/rav4-ca-v1.webp'}),
  demo('demo-import-model3-us', 'US', {year: 2022, make: 'Tesla', model: 'Model 3', trim: 'Long Range', price: 22900, mileage: 48000, fuel: 'Electric', body: 'Sedan', transmission: 'Automatic', image: '/showroom/imports/model3-us-v1.webp'}),
  demo('demo-import-320-de', 'DE', {year: 2020, make: 'BMW', model: '320i', trim: 'Sport Line', price: 21500, mileage: 86000, fuel: 'Petrol', body: 'Sedan', transmission: 'Automatic', image: '/showroom/imports/320-de-v1.webp'}),
  demo('demo-import-golf-it', 'IT', {year: 2021, make: 'Volkswagen', model: 'Golf', trim: '1.5 TSI', price: 16400, mileage: 64000, fuel: 'Petrol', body: 'Hatchback', transmission: 'Manual', image: '/showroom/imports/golf-it-v1.webp'}),
  demo('demo-import-a4-nl', 'NL', {year: 2020, make: 'Audi', model: 'A4 Avant', trim: '35 TDI', price: 20700, mileage: 93000, fuel: 'Diesel', body: 'Other', transmission: 'Automatic', image: '/showroom/imports/a4-nl-v1.webp'}),
];

// Client releases supply their own import listings; examples are template-only.
export const importListings: ImportListing[] = isDealer ? dealerImportInventory as ImportListing[] : demoImportListings;
