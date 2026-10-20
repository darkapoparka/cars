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
    "evidenceUrl": "https://express_auto.mobile.bg/obiava-11791655661973701-nissan-note-1-4i",
    "image": "/dealer-stock/11791655661973701-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Nissan",
    "title": "Nissan Note 1.4",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "168 000 км",
    "mileageKm": 168000,
    "mileageKnown": true,
    "mileageValue": 168000,
    "mileageUnit": "km",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3390,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://express_auto.mobile.bg/obiava-11791655386104961-hyundai-ioniq-pehv",
    "image": "/dealer-stock/11791655386104961-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Hyundai",
    "title": "Hyundai Ioniq Plug-in Hybrid",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "126 000 км",
    "mileageKm": 126000,
    "mileageKnown": true,
    "mileageValue": 126000,
    "mileageUnit": "km",
    "fuel": "Plug-in Hybrid",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 14999,
    "href": "/listing-detail-v1/2"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\p{Sc})\s+/u, '$1 ').replace(/\s+([A-Z]{3}|\p{Sc})$/u, ' $1');
