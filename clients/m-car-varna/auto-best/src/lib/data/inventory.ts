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
    "evidenceUrl": "https://mcarvarna.mobile.bg/obiava-11791525148007826-bmw-540-xdrive",
    "image": "/dealer-stock/11791525148007826-1.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "BMW",
    "title": "BMW 540 xDrive",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "191 000 км",
    "mileageKm": 191000,
    "mileageKnown": true,
    "mileageValue": 191000,
    "mileageUnit": "km",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 41900,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://mcarvarna.mobile.bg/obiava-11791452660881854-bmw-750-xdrive-sedan",
    "image": "/dealer-stock/11791452660881854-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 750 xDrive",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "70 000 км",
    "mileageKm": 70000,
    "mileageKnown": true,
    "mileageValue": 70000,
    "mileageUnit": "km",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 34900,
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
