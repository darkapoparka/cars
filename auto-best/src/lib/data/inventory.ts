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
    "evidenceUrl": "https://www.ebay.co.uk/itm/800753431171",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Audi",
    "title": "2013 Audi A1 1.6 TDI S Line 5dr HATCHBACK Diesel Manual",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "119,612 mi",
    "mileageKm": 192497,
    "mileageKnown": true,
    "mileageValue": 119612,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3000,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/800729940509",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Vauxhall",
    "title": "2021 Vauxhall Corsa 1.2 SE 5dr HATCHBACK Petrol Manual",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "32,590 mi",
    "mileageKm": 52449,
    "mileageKnown": true,
    "mileageValue": 32590,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 6500,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/800722114749",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Citroen",
    "title": "2023 Citroen C3 1.2 PureTech Elle 5dr HATCHBACK Petrol Manual",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "3,441 mi",
    "mileageKm": 5538,
    "mileageKnown": true,
    "mileageValue": 3441,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 8000,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/800696671424",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Renault",
    "title": "2016 Renault Clio 0.9 TCE 90 Dynamique Nav 5dr HATCHBACK Petrol Manual",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "54,322 mi",
    "mileageKm": 87423,
    "mileageKnown": true,
    "mileageValue": 54322,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3500,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/800682432068",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Vauxhall",
    "title": "2015 Vauxhall Corsa 1.4 Limited Edition 3dr HATCHBACK Petrol Manual",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "75,185 mi",
    "mileageKm": 120999,
    "mileageKnown": true,
    "mileageValue": 75185,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3300,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/800637144674",
    "image": "/dealer-stock/wagon.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "Audi",
    "title": "2013 Audi Q5 2.0 TDI Quattro S Line Plus 5dr ESTATE Diesel Manual",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "81,414 mi",
    "mileageKm": 131023,
    "mileageKnown": true,
    "mileageValue": 81414,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 7500,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/800632116283",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Nissan",
    "title": "2016 Nissan Qashqai 1.5 dCi Tekna 5dr HATCHBACK Diesel Manual",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "109,154 mi",
    "mileageKm": 175666,
    "mileageKnown": true,
    "mileageValue": 109154,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3400,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/800549423064",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Audi",
    "title": "2016 Audi A1 1.4 TFSI Sport 5dr HATCHBACK Petrol Manual",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "91,421 mi",
    "mileageKm": 147128,
    "mileageKnown": true,
    "mileageValue": 91421,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 4000,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\p{Sc})\s+/u, '$1 ').replace(/\s+([A-Z]{3}|\p{Sc})$/u, ' $1');
