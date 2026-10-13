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
    "evidenceUrl": "https://fusionauto.mobile.bg/obiava-11790662447767037-audi-a7-bi-tdi-facelift-s-line-smeneni-verigi",
    "image": "/dealer-stock/11790662447767037-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A7 Bi-TDI S-Line",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "350 000 км",
    "mileageKm": 350000,
    "mileageKnown": true,
    "mileageValue": 350000,
    "mileageUnit": "km",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 17500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://fusionauto.mobile.bg/obiava-21780841001174707-mercedes-benz-g-500-lpg-amg-optic-facelift-306",
    "image": "/dealer-stock/21780841001174707-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz G 500 LPG",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "189 000 км",
    "mileageKm": 189000,
    "mileageKnown": true,
    "mileageValue": 189000,
    "mileageUnit": "km",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 36000,
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
