export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment =
  | '4x4'
  | '360° камера'
  | 'Панорамен покрив'
  | 'Подгряване на седалки'
  | 'Навигация'
  | 'Парктроник'
  | 'Безключов достъп'
  | 'Адаптивен круиз контрол';

export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  image: string;
  category: string;
  body: string;
  make: string;
  title: string;
  model: string;
  version: string;
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

// Equipment facets are limited to recurring features published in Day & Night's
// current adverts for these model families (daynight.mobile.bg, checked 2026-08-30).
type InventoryRecord = Omit<Vehicle, 'year' | 'mileage' | 'href' | 'verification'> & { verification?: Vehicle['verification'] };
const inventoryRecords: InventoryRecord[] = [
  { id: 1, image: '/assets/images/lead/day-night-stock-04.webp', category: 'Комби', body: 'Wagon', make: 'Audi', title: 'Audi RS 6 Avant', model: 'RS 6 Avant', version: 'RS', yearNumber: 2024, mileageKm: 99701, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'], condition: 'used', priceEur: 68804 },
  { id: 2, image: '/assets/images/lead/day-night-stock-01.webp', category: 'SUV купе', body: 'SUV', make: 'Mercedes-Benz', title: 'Mercedes-Benz GLE Coupé', model: 'GLE Coupé', version: '', yearNumber: 2021, mileageKm: 96865, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'], condition: 'used', priceEur: 55403 },
  { id: 3, image: '/assets/images/lead/day-night-stock-06.webp', category: 'SUV', body: 'SUV', make: 'Audi', title: 'Audi RS Q8', model: 'RS Q8', version: 'RS', yearNumber: 2021, mileageKm: 94709, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'], condition: 'used', priceEur: 57480 },
  { id: 4, image: '/assets/images/lead/day-night-stock-02.webp', category: 'SUV купе', body: 'SUV', make: 'BMW', title: 'BMW X6 M Sport', model: 'X6 M Sport', version: 'M Sport', yearNumber: 2021, mileageKm: 62485, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 54223 },
  { id: 5, image: '/assets/images/lead/day-night-stock-05.webp', category: 'SUV', body: 'SUV', make: 'Land Rover', title: 'Range Rover Sport', model: 'Range Rover Sport', version: '', yearNumber: 2019, mileageKm: 84426, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 68313 },
  { id: 6, image: '/assets/images/lead/day-night-stock-03.webp', category: 'Спортбек', body: 'Sportback', make: 'Mercedes-Benz', title: 'Mercedes-AMG GT 4-Door', model: 'Mercedes-AMG GT 4-Door', version: 'AMG', yearNumber: 2020, mileageKm: 72812, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 61069 },
  { id: 7, image: '/assets/images/lead/day-night-stock-02.webp', category: 'SUV купе', body: 'SUV', make: 'BMW', title: 'BMW X6 xDrive', model: 'X6 xDrive', version: 'xDrive', yearNumber: 2020, mileageKm: 76346, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 85635 },
  { id: 8, image: '/assets/images/lead/day-night-stock-03.webp', category: 'Купе', body: 'Coupe', make: 'Mercedes-Benz', title: 'Mercedes-AMG GT Coupé', model: 'Mercedes-AMG GT Coupé', version: 'AMG', yearNumber: 2023, mileageKm: 49584, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 51365 }
];

// Imported master fixtures are not VIN-verified stock. Preserve source media;
// client promotion requires replacing and verifying each record, including reused photos.
const numberFormat = new Intl.NumberFormat('bg-BG');

export const featuredVehicles: Vehicle[] = inventoryRecords.map(record => ({
  ...record,
  verification: record.verification ?? 'sample',
  year: String(record.yearNumber),
  mileage: `${numberFormat.format(record.mileageKm)} км`,
  href: `/listing-detail-v1/${record.id}`
}));

export const formatVehiclePrice = (priceEur: number) => `${numberFormat.format(priceEur)} €`;
