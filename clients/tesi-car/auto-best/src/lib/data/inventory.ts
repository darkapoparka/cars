import facts from './dealer-facts.json';

export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment = string;
export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified' | 'source-snapshot';
  evidenceUrl?: string;
  image: string;
  gallery: string[];
  category: string;
  body: string;
  make: string;
  model: string;
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
  sourceId: string;
  powerHp: number;
  engineCc: number;
  doors: string;
  color: string;
  availability: 'advertised-unverified';
};

const bodies: Record<string, string> = { suv: 'SUV', hatchback: 'Хечбек', van: 'Миниван', sedan: 'Седан', wagon: 'Комби', coupe: 'Купе' };
const fuels: Record<string, string> = { diesel: 'Дизел', gasoline: 'Бензин', hybrid: 'Хибрид', electric: 'Електрически' };
const number = new Intl.NumberFormat('bg-BG');

// Source checkpoint: original public photo URLs are temporary until the local
// asset transfer is committed. They are never replaced by another dealer's stock.
export const featuredVehicles: Vehicle[] = facts.vehicles.map(record => ({
  id: record.id,
  verification: 'source-snapshot',
  evidenceUrl: record.sourceUrl,
  image: record.photos[0].sourceUrl,
  gallery: record.photos.map(photo => photo.sourceUrl),
  category: bodies[record.body] ?? record.body,
  body: bodies[record.body] ?? record.body,
  make: record.make,
  model: record.model,
  title: record.title,
  year: String(record.year),
  yearNumber: record.year,
  mileage: `${number.format(record.mileageKm)} км`,
  mileageKm: record.mileageKm,
  fuel: fuels[record.fuel] ?? record.fuel,
  transmission: record.transmission === 'automatic' ? 'Автоматик' : 'Ръчна',
  equipment: record.features,
  condition: 'used',
  priceEur: record.price,
  href: `/listing-detail-v1/${record.id}`,
  sourceId: record.sourceId,
  powerHp: record.powerHp,
  engineCc: record.engineCc,
  doors: record.doors,
  color: record.color,
  availability: 'advertised-unverified'
}));

export const formatVehiclePrice = (priceEur: number) => `${number.format(priceEur)} €`;
