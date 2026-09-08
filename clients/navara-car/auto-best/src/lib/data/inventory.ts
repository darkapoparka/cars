import source from './navara-data.json';

export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment = string;

export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  image: string;
  gallery: readonly string[];
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
  powerHp: number;
  color: string;
  engineCc: number | null;
  batteryKwh: number | null;
  doorsLabel: string;
  observedAt: string;
  availabilityLabel: string;
  href: `/listing-detail-v1/${number}`;
};

// Dated publisher-supplied samples, not VIN-verified stock or a live inventory feed.
// The same immutable source set is copied into each independent application.
export const featuredVehicles: Vehicle[] = source.vehicles.map((record) => ({
  id: record.id,
  verification: 'sample',
  evidenceUrl: record.sourceUrl,
  image: record.images[0],
  gallery: [...record.images],
  category: record.body,
  body: record.bodyType,
  make: record.make,
  title: record.title,
  year: String(record.year),
  yearNumber: record.year,
  mileage: `${new Intl.NumberFormat('bg-BG').format(record.mileageKm)} км`,
  mileageKm: record.mileageKm,
  fuel: record.fuel,
  transmission: record.transmission,
  equipment: [...record.features],
  condition: 'used',
  priceEur: record.priceEur,
  powerHp: record.powerHp,
  color: record.color,
  engineCc: record.engineCc,
  batteryKwh: record.batteryKwh,
  doorsLabel: record.doorsLabel,
  observedAt: record.observedAt,
  availabilityLabel: source.availabilityLabel,
  href: `/listing-detail-v1/${record.id}`
}));

export const inventoryNotice = source.inventoryNotice;
export const formatVehiclePrice = (priceEur: number | null | undefined) =>
  typeof priceEur === 'number' && Number.isFinite(priceEur) && priceEur > 0
    ? `${new Intl.NumberFormat('bg-BG').format(priceEur)} €`
    : 'Цена при запитване';
