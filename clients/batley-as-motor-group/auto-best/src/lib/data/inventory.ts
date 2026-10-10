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
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/batley/as-motor-group-10033673",
    "image": "/dealer-stock/suv.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi SQ5 3.0 BiTDI V6 Tiptronic quattro Euro 6 (s/s) 5dr",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "105,000 mi",
    "mileageKm": 168981,
    "mileageKnown": true,
    "mileageValue": 105000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 12995,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/batley/as-motor-group-10033673",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Volkswagen",
    "title": "Volkswagen Golf 2.0 TSI BlueMotion Tech R DSG 4Motion Euro 6 (s/s) 5dr",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "114,000 mi",
    "mileageKm": 183465,
    "mileageKnown": true,
    "mileageValue": 114000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 10995,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/batley/as-motor-group-10033673",
    "image": "/dealer-stock/suv.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Porsche",
    "title": "Porsche Cayenne 3.0 TD V6 Tiptronic 4WD Euro 5 (s/s) 5dr",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "126,000 mi",
    "mileageKm": 202777,
    "mileageKnown": true,
    "mileageValue": 126000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 9395,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/batley/as-motor-group-10033673",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Other",
    "body": "Other",
    "make": "Nissan",
    "title": "Nissan Navara 2.5 dCi Tekna Auto 4WD Euro 5 4dr",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "99,000 mi",
    "mileageKm": 159325,
    "mileageKnown": true,
    "mileageValue": 99000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 5295,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/batley/as-motor-group-10033673",
    "image": "/dealer-stock/suv.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Nissan",
    "title": "Nissan Qashqai 1.6 dCi N-Connecta Euro 6 (s/s) 5dr",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "128,000 mi",
    "mileageKm": 205996,
    "mileageKnown": true,
    "mileageValue": 128000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 5095,
    "href": "/listing-detail-v1/5"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3})\s+/u, '$1 ').replace(/\s+([A-Z]{3})$/u, ' $1');
