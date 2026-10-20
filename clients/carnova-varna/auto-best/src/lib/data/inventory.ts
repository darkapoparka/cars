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
    "evidenceUrl": "https://carnova.mobile.bg/obiava-11789992722402350-toyota-corolla-1-8-hybrid-ts-toyota-relax",
    "image": "/dealer-stock/11789992722402350-1.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "Toyota",
    "title": "Toyota Corolla 1.8 Hybrid TS",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "80 111 км",
    "mileageKm": 80111,
    "mileageKnown": true,
    "mileageValue": 80111,
    "mileageUnit": "km",
    "fuel": "Hybrid",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 19900,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://carnova.mobile.bg/obiava-11780304679998646-vw-golf-1-5-etsi-dsg-life-s-garantsiya-realni-km",
    "image": "/dealer-stock/11780304679998646-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Volkswagen",
    "title": "VW Golf 1.5 eTSI DSG Life",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "115 794 км",
    "mileageKm": 115794,
    "mileageKnown": true,
    "mileageValue": 115794,
    "mileageUnit": "km",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 17999,
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
