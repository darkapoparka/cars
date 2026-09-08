import { eliqStock } from './eliq-stock';

export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment = '4x4' | '360° камера' | 'Панорамен покрив' | 'Подгряване на седалки' | 'Навигация' | 'Парктроник' | 'Безключов достъп' | 'Адаптивен круиз контрол';
export type Vehicle = {
  id: number; verification: 'sample' | 'verified'; evidenceUrl?: string;
  image: string; gallery: string[]; sourceId: string; description: string;
  category: string; body: string; make: string; title: string; year: string; yearNumber: number;
  mileage: string; mileageKm: number; fuel: string; transmission: string;
  equipment: readonly VehicleEquipment[]; condition: VehicleCondition; priceEur: number;
  href: `/listing-detail-v1/${number}`;
};

// Array positions are local route IDs only; preserve the full marketplace ID separately.
export const featuredVehicles: Vehicle[] = eliqStock.map((vehicle, index) => ({
  id: index + 1, sourceId: vehicle.id, verification: 'sample', evidenceUrl: vehicle.sourceUrl,
  image: vehicle.images[0], gallery: vehicle.images, description: vehicle.description,
  category: vehicle.bodyLabel, body: vehicle.body, make: vehicle.make,
  title: `${vehicle.make} ${vehicle.model}`, year: String(vehicle.year), yearNumber: vehicle.year,
  mileage: `${new Intl.NumberFormat('bg-BG').format(vehicle.mileageKm)} км`, mileageKm: vehicle.mileageKm,
  fuel: vehicle.fuel, transmission: vehicle.transmission,
  equipment: [], condition: 'used', priceEur: vehicle.priceEur,
  href: `/listing-detail-v1/${index + 1}`
}));

export const formatVehiclePrice = (priceEur: number) => `${new Intl.NumberFormat('bg-BG').format(priceEur)} €`;
