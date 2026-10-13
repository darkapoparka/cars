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
    "evidenceUrl": "https://vaencars.mobile.bg/obiava-11790770761188035-mg-s6-luxury-awd",
    "image": "/dealer-stock/11790770761188035-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "MG",
    "title": "MG S6 Luxury",
    "year": "2026",
    "yearNumber": 2026,
    "mileage": "20 км",
    "mileageKm": 20,
    "mileageKnown": true,
    "mileageValue": 20,
    "mileageUnit": "km",
    "fuel": "Electric",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "new",
    "priceEur": 46990,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://vaencars.mobile.bg/obiava-11790767561385627-mg-s6-luxury-long-range",
    "image": "/dealer-stock/11790767561385627-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "MG",
    "title": "MG S6 Luxury Long Range",
    "year": "2026",
    "yearNumber": 2026,
    "mileage": "20 км",
    "mileageKm": 20,
    "mileageKnown": true,
    "mileageValue": 20,
    "mileageUnit": "km",
    "fuel": "Electric",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "new",
    "priceEur": 42990,
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
