import stockData from './dealer-stock.json';

export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment =
  | '4x4' | '360° камера' | 'Панорамен покрив' | 'Подгряване на седалки'
  | 'Навигация' | 'Парктроник' | 'Безключов достъп' | 'Адаптивен круиз контрол'
  | 'Климатик' | 'Климатроник' | 'Газова уредба' | 'ISOFIX';

export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  sourceId: string;
  observedAt: string;
  availability: 'advertised-unverified';
  image: string;
  images: readonly string[];
  imagePending: boolean;
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
  priceQualification: string;
  description: string;
  powerHp: number | null;
  engineCc: number;
  color: string;
  emissions: string;
  href: `/listing-detail-v1/${number}`;
};

const equipmentValues: readonly VehicleEquipment[] = [
  '4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки',
  'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол',
  'Климатик', 'Климатроник', 'Газова уредба', 'ISOFIX'
];
const isEquipment = (value: string): value is VehicleEquipment =>
  equipmentValues.some(item => item === value);
const isLocalImage = (value: string): boolean =>
  value.startsWith('/assets/images/lead/') && !value.includes('..') && !value.includes('\\');
const numberFormat = new Intl.NumberFormat('bg-BG');

/** One dated snapshot drives cards, filtering, details and recommendations. */
export const featuredVehicles: Vehicle[] = stockData.listings.map<Vehicle>(record => {
  if (!Number.isSafeInteger(record.id) || record.id < 1 ||
      !Number.isFinite(record.priceEur) || record.priceEur <= 0 ||
      !Number.isSafeInteger(record.mileageKm) || record.mileageKm < 0 ||
      record.priceCurrency !== 'EUR') {
    throw new Error(`Invalid published sample record: ${record.sourceId}`);
  }
  const images = (record.localImages as string[]).filter(isLocalImage);
  return {
    ...record,
    verification: 'sample',
    availability: 'advertised-unverified',
    condition: 'used',
    equipment: record.equipment.filter(isEquipment),
    image: images[0] ?? '/assets/images/lead/stock-photo-pending.svg',
    images,
    imagePending: images.length === 0,
    year: String(record.yearNumber),
    mileage: `${numberFormat.format(record.mileageKm)} км`,
    href: `/listing-detail-v1/${record.id}`
  };
});

/** Missing or invalid prices never become a zero-euro offer. */
export const formatVehiclePrice = (priceEur: number | null | undefined): string =>
  typeof priceEur === 'number' && Number.isFinite(priceEur) && priceEur > 0
    ? `${numberFormat.format(priceEur)} €`
    : 'Цена при запитване';
