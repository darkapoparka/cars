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
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://bavaria.mobile.bg/obiava-11789996935203115-vw-touran-1-6-gaz-benzin",
    "image": "/dealer-stock/11789996935203115-1.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Volkswagen",
    "title": "VW Touran 1.6 LPG/Petrol",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "160 000 км",
    "mileageKm": 160000,
    "mileageKnown": true,
    "mileageValue": 160000,
    "mileageUnit": "km",
    "fuel": "LPG",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3790,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://bavaria.mobile.bg/obiava-11787839012622133-dacia-lodgy-1-5-dci-6-1-mecta",
    "image": "/dealer-stock/11787839012622133-1.webp",
    "category": "MPV",
    "body": "MPV",
    "make": "Dacia",
    "title": "Dacia Lodgy 1.5 dCi",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "199 000 км",
    "mileageKm": 199000,
    "mileageKnown": true,
    "mileageValue": 199000,
    "mileageUnit": "km",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 6699,
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
