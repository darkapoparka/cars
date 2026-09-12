import { dealerFacts, dealerStock } from './dealer';
export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment = string;
export type Vehicle = {
  id: number; sourceId: string; verification: 'sample' | 'verified'; evidenceUrl?: string;
  image: string; gallery: string[]; category: string; body: string; make: string; title: string;
  year: string; yearNumber: number; mileage: string; mileageValue: number;
  distanceUnit: string; fuel: string; transmission: string; equipment: readonly VehicleEquipment[];
  condition: VehicleCondition; priceAmount: number | null; currency: string;
  description: string; viewingLocation: string; sourceUrl: string; observedAt: string;
  href: `/listing-detail-v1/${number}`;
};
export const featuredVehicles: Vehicle[] = dealerStock.map((car, index) => ({
  id: index + 1, sourceId: car.id, verification: 'sample', evidenceUrl: car.sourceUrl,
  image: car.image, gallery: [...car.photos], category: car.body === 'SUV/Crossover' ? 'SUV' : car.body,
  body: car.body === 'SUV/Crossover' ? 'SUV' : car.body, make: car.make,
  title: `${car.make} ${car.model} ${car.trim}`.trim(), year: String(car.year), yearNumber: car.year,
  mileage: `${new Intl.NumberFormat(dealerFacts.locale).format(car.mileage)} ${car.distanceUnit}`,
  mileageValue: car.mileage, distanceUnit: car.distanceUnit, fuel: car.fuel, transmission: car.transmission,
  equipment: [...car.features], condition: 'used', priceAmount: car.price, currency: car.currency,
  description: car.description, viewingLocation: car.viewingLocation, sourceUrl: car.sourceUrl,
  observedAt: car.observedAt, href: `/listing-detail-v1/${index + 1}`
}));
export const formatVehiclePrice = (amount: number | null) => amount === null || !Number.isFinite(amount)
  ? 'Price on request'
  : new Intl.NumberFormat(dealerFacts.locale, { style: 'currency', currency: dealerFacts.currency, maximumFractionDigits: 0 }).format(amount);
