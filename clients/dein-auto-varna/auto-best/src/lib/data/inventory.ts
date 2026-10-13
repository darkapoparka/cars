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
    "evidenceUrl": "https://deinauto.mobile.bg/obiava-11786124378124232-vw-passat",
    "image": "/dealer-stock/11786124378124232-1.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "Volkswagen",
    "title": "VW Passat",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "80 700 км",
    "mileageKm": 80700,
    "mileageKnown": true,
    "mileageValue": 80700,
    "mileageUnit": "km",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 20500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://deinauto.mobile.bg/obiava-11790325495830727-audi-a5-45-tdi-quattro",
    "image": "/dealer-stock/11790325495830727-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A5 45 TDI quattro",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "119 715 км",
    "mileageKm": 119715,
    "mileageKnown": true,
    "mileageValue": 119715,
    "mileageUnit": "km",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 21500,
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
