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
    "evidenceUrl": "https://valkovcars.mobile.bg/obiava-11770728962537417-volvo-v60-2-0-d3",
    "image": "/dealer-stock/11770728962537417-1.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "Volvo",
    "title": "Volvo V60 2.0 D3",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "290 000 км",
    "mileageKm": 290000,
    "mileageKnown": true,
    "mileageValue": 290000,
    "mileageUnit": "km",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 10300,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://valkovcars.mobile.bg/obiava-11772080668154587-bmw-320-2-0xdrive-luxury",
    "image": "/dealer-stock/11772080668154587-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 320 2.0 xDrive Luxury",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "180 000 км",
    "mileageKm": 180000,
    "mileageKnown": true,
    "mileageValue": 180000,
    "mileageUnit": "km",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 7300,
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
