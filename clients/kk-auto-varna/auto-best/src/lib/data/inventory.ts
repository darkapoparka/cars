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
    "evidenceUrl": "https://github.com/darkapoparka/cars/blob/b1f0f5609c7c249cfd0649c122849ff2cbb8dfde/templates/modern/apps/web/public/desktop-boxcars/page-banner-art-provenance.md",
    "image": "/dealer-stock/demo-estate.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "Demo",
    "title": "Demo Estate — illustration",
    "year": "2026",
    "yearNumber": 2026,
    "mileage": "12 000 км",
    "mileageKm": 12000,
    "mileageKnown": true,
    "mileageValue": 12000,
    "mileageUnit": "km",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 23900,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://github.com/darkapoparka/cars/blob/b1f0f5609c7c249cfd0649c122849ff2cbb8dfde/templates/modern/apps/web/public/desktop-boxcars/page-banner-art-provenance.md",
    "image": "/dealer-stock/demo-suv.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Demo",
    "title": "Demo SUV — illustration",
    "year": "2026",
    "yearNumber": 2026,
    "mileage": "8000 км",
    "mileageKm": 8000,
    "mileageKnown": true,
    "mileageValue": 8000,
    "mileageUnit": "km",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 28900,
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
