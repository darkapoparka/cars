import stock from './dealer-stock.json';

export type VehicleCondition = 'new' | 'used' | 'unknown';
export type VehicleEquipment = string;

export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  image: string;
  gallery: string[];
  sourceId: string;
  description: string;
  priceNote: string;
  conditionLabel: string;
  sourceLocation: string;
  powerHp: number;
  engineCc: number | null;
  category: string;
  body: string;
  make: string;
  title: string;
  year: string;
  yearNumber: number;
  mileage: string;
  mileageKm: number;
  fuel: string;
  transmission: string;
  equipment: readonly VehicleEquipment[];
  condition: VehicleCondition;
  priceEur: number;
  href: `/listing-detail-v1/${number}`;
};


/** Eight dated public listing examples, not independently verified live stock. */
export const featuredVehicles: Vehicle[] = stock.vehicles.map((vehicle) => ({
 id: vehicle.id, sourceId: vehicle.sourceId, verification: 'sample', evidenceUrl: vehicle.sourceUrl,
 image: vehicle.image, gallery: [...vehicle.gallery], description: vehicle.description, priceNote: vehicle.priceNote, conditionLabel: vehicle.conditionLabel,
 sourceLocation: vehicle.viewingLocation, powerHp: vehicle.powerHp, engineCc: vehicle.engineCc,
 category: vehicle.bodyLabel, body: vehicle.body === 'Pickup' ? 'Pickup Truck' : vehicle.body, make: vehicle.make, title: vehicle.title,
 year: String(vehicle.year), yearNumber: vehicle.year, mileage: new Intl.NumberFormat('bg-BG').format(vehicle.mileageKm) + ' км', mileageKm: vehicle.mileageKm,
 fuel: vehicle.fuel, transmission: vehicle.transmission === 'Автоматична' ? 'Автоматик' : vehicle.transmission, equipment: [...vehicle.equipment],
 condition: vehicle.condition === 'new' ? 'new' : vehicle.condition === 'unknown' ? 'unknown' : 'used', priceEur: vehicle.priceEur, href: '/listing-detail-v1/' + vehicle.id as Vehicle['href']
}));
export const formatVehiclePrice = (value: number) => Number.isFinite(value) && value > 0 ? new Intl.NumberFormat('bg-BG').format(value) + ' €' : 'Цена при запитване';
