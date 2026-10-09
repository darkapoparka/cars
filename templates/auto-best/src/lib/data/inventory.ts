import { formatPrice, localeContract, type Locale } from '$lib/locale/core';
import { templateText } from '$lib/locale/messages';
import { leadSite } from '$config/lead-site';

export const vehicleTypes = ['car', 'motorbike', 'van', 'truck'] as const;
export type VehicleType = typeof vehicleTypes[number];

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
  type: VehicleType;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  image: string;
  category: string;
  body: string;
  make: string;
  /** Optional manufacturer sub-brand used by compact card identity. */
  cardBrand?: string;
  /** Seller-supplied highlight by locale; import/condition claims require record-specific evidence. */
  cardNote?: Partial<Record<Locale, string>>;
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

// Equipment facets are limited to recurring features published in Day & Night's
// current adverts for these model families (daynight.mobile.bg, checked 2026-08-30).
const inventoryRecords: Omit<Vehicle, 'year' | 'mileage' | 'href' | 'verification'>[] = [
  { id: 1, type: 'car', image: leadSite.artwork.inventoryDemo.stock04, category: 'Комби', body: 'Wagon', make: 'Audi', title: 'Audi RS 6 Avant', cardNote: { bg: 'Панорамен покрив', en: 'Panoramic roof' }, yearNumber: 2024, mileageKm: 99701, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'], condition: 'used', priceEur: 68804 },
  { id: 2, type: 'car', image: leadSite.artwork.inventoryDemo.stock01, category: 'SUV купе', body: 'SUV', make: 'Mercedes-Benz', title: 'Mercedes-Benz GLE Coupé', cardNote: { bg: '360° камера', en: '360° camera' }, yearNumber: 2021, mileageKm: 96865, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'], condition: 'used', priceEur: 55403 },
  { id: 3, type: 'car', image: leadSite.artwork.inventoryDemo.stock06, category: 'SUV', body: 'SUV', make: 'Audi', title: 'Audi RS Q8', cardNote: { bg: 'Адаптивен круиз', en: 'Adaptive cruise' }, yearNumber: 2021, mileageKm: 94709, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'], condition: 'used', priceEur: 57480 },
  { id: 4, type: 'car', image: leadSite.artwork.inventoryDemo.stock02, category: 'SUV купе', body: 'SUV', make: 'BMW', title: 'BMW X6 M Sport', cardNote: { bg: 'Безключов достъп', en: 'Keyless entry' }, yearNumber: 2021, mileageKm: 62485, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 54223 },
  { id: 6, type: 'car', image: leadSite.artwork.inventoryDemo.stock03, category: 'Спортбек', body: 'Sportback', make: 'Mercedes-Benz', cardBrand: 'Mercedes-AMG', title: 'Mercedes-AMG GT 4-Door', cardNote: { bg: 'Навигация', en: 'Navigation' }, yearNumber: 2020, mileageKm: 72812, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 61069 },
  { id: 7, type: 'car', image: leadSite.artwork.inventoryDemo.stock02, category: 'SUV купе', body: 'SUV', make: 'BMW', title: 'BMW X6 xDrive', cardNote: { bg: '4×4 задвижване', en: 'All-wheel drive' }, yearNumber: 2020, mileageKm: 76346, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 85635 },
  { id: 8, type: 'car', image: leadSite.artwork.inventoryDemo.stock03, category: 'Купе', body: 'Coupe', make: 'Mercedes-Benz', cardBrand: 'Mercedes-AMG', title: 'Mercedes-AMG GT Coupé', cardNote: { bg: 'Парктроник', en: 'Parking sensors' }, yearNumber: 2023, mileageKm: 49584, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 51365 }
];

// Imported master fixtures are not VIN-verified stock. Preserve source media;
// client promotion requires replacing and verifying each record, including reused photos.
export const featuredVehicles: Vehicle[] = inventoryRecords.map(record => ({
  ...record,
  verification: 'sample',
  year: String(record.yearNumber),
  mileage: `${new Intl.NumberFormat('bg-BG').format(record.mileageKm)} км`,
  href: `/listing-detail-v1/${record.id}`
}));

export const formatVehiclePrice = (amount: number, locale: Locale = localeContract.defaultLocale) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\p{Sc})\s+/u, '$1 ').replace(/\s+([A-Z]{3}|\p{Sc})$/u, ' $1');
