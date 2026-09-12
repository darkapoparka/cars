import dealerPack from './dealer-stock.json';

export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment =
  | '4x4'
  | '360° камера'
  | 'Панорамен покрив'
  | 'Подгряване на седалки'
  | 'Навигация'
  | 'Парктроник'
  | 'Безключово палене'
  | 'Адаптивен круиз контрол';

export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  image: string;
  gallery: readonly string[];
  description: string;
  priceNote: string;
  sourceId: string;
  observedAt: string;
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

// One dated source pack supplies every catalogue, detail and recommendation consumer.
// Public listing evidence is not independent verification of stock or condition.
export const featuredVehicles: Vehicle[] = dealerPack.vehicles.map((vehicle) => ({
  id: vehicle.id,
  verification: 'sample',
  evidenceUrl: vehicle.sourceUrl,
  sourceId: vehicle.sourceId,
  observedAt: vehicle.observedAt,
  image: vehicle.image,
  gallery: vehicle.gallery,
  category: vehicle.bodyLabel,
  body: vehicle.body,
  make: vehicle.make,
  title: vehicle.title,
  year: `${vehicle.year} г.`,
  yearNumber: vehicle.year,
  mileage: `${new Intl.NumberFormat('bg-BG').format(vehicle.mileageKm)} км`,
  mileageKm: vehicle.mileageKm,
  fuel: vehicle.fuel,
  transmission: vehicle.transmission === 'Автоматична' ? 'Автоматик' : vehicle.transmission,
  equipment: vehicle.equipment as VehicleEquipment[],
  condition: vehicle.condition as VehicleCondition,
  priceEur: vehicle.priceEur,
  priceNote: vehicle.priceNote,
  description: vehicle.description,
  href: `/listing-detail-v1/${vehicle.id}`
}));

export const formatVehiclePrice = (priceEur: number) =>
  `${new Intl.NumberFormat('bg-BG', { maximumFractionDigits: 0 }).format(priceEur)} €`;
