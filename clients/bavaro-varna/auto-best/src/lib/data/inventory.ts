import { formatPrice, localeContract, type Locale } from '$lib/locale/core';
import { templateText } from '$lib/locale/messages';

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
  mileageKnown?: boolean;
  mileageValue?: number;
  mileageUnit?: 'km' | 'mi';
  fuel: string;
  transmission: string;
  equipment: readonly VehicleEquipment[];
  condition: VehicleCondition;
  priceEur: number;
  href: `/listing-detail-v1/${number}`;
};

export const featuredVehicles: Vehicle[] = [
  {
    "id": 1,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://bavaro.mobile.bg/obiava-21731000046562940-bmw-x6-m-competition-laser-carbon-keyless-b-w-v-garantsiya",
    "image": "/dealer-stock/21731000046562940-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "43 300 км",
    "mileageKm": 43300,
    "mileageKnown": true,
    "mileageValue": 43300,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 89999,
    "href": "/listing-detail-v1/1"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\p{Sc})\s+/u, '$1 ').replace(/\s+([A-Z]{3}|\p{Sc})$/u, ' $1');
