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
    "evidenceUrl": "https://kapitol.mobile.bg/obiava-21791385455711977-mercedes-benz-glb-200-d-amg-line-night-pack-8-dct-150",
    "image": "/dealer-stock/21791385455711977-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLB 200 D AMG Line",
    "year": "2025",
    "yearNumber": 2025,
    "mileage": "186 000 км",
    "mileageKm": 186000,
    "mileageKnown": true,
    "mileageValue": 186000,
    "mileageUnit": "km",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 29790,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://kapitol.mobile.bg/obiava-21791028313582431-kia-sportage-hev-1-6-t-gdi-active-230",
    "image": "/dealer-stock/21791028313582431-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Kia",
    "title": "Kia Sportage HEV 1.6 T-GDI",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "195 000 км",
    "mileageKm": 195000,
    "mileageKnown": true,
    "mileageValue": 195000,
    "mileageUnit": "km",
    "fuel": "Hybrid",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 19000,
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
