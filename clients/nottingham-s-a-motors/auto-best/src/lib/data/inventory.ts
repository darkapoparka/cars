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
    "evidenceUrl": "https://www.ebay.co.uk/itm/880002442439",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Abarth",
    "title": "2014 Abarth 500 1.4 16V T-Jet 3dr HATCHBACK Petrol Manual",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "74,000 mi",
    "mileageKm": 119091,
    "mileageKnown": true,
    "mileageValue": 74000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3495,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/178567084197",
    "image": "/dealer-stock/convertible.webp",
    "category": "Convertible",
    "body": "Convertible",
    "make": "Jeep",
    "title": "2008 Jeep Wrangler 2.8 CRD Sahara Unlimited 4dr CONVERTIBLE Diesel Manual",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "115,000 mi",
    "mileageKm": 185075,
    "mileageKnown": true,
    "mileageValue": 115000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 7995,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/178557630733",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Renault",
    "title": "2008 Renault Clio 1.2 16V Extreme 3dr HATCHBACK Petrol Manual",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "94,000 mi",
    "mileageKm": 151278,
    "mileageKnown": true,
    "mileageValue": 94000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 795,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/880001351998",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Vauxhall",
    "title": "2003 Vauxhall Astra 1.6i Envoy 5dr Auto HATCHBACK Petrol Automatic",
    "year": "2003",
    "yearNumber": 2003,
    "mileage": "49,000 mi",
    "mileageKm": 78858,
    "mileageKnown": true,
    "mileageValue": 49000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 1095,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/178521890896",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Ford",
    "title": "2018 Ford Fiesta 1.5 EcoBoost ST-2 3dr HATCHBACK Petrol Manual",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "78,000 mi",
    "mileageKm": 125529,
    "mileageKnown": true,
    "mileageValue": 78000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 7495,
    "href": "/listing-detail-v1/5"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\p{Sc})\s+/u, '$1 ').replace(/\s+([A-Z]{3}|\p{Sc})$/u, ' $1');
