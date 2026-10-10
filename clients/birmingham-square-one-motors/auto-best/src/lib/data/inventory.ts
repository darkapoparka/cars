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
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/birmingham/birmingham/square-one-motors-10042456",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Ford",
    "title": "Ford Fiesta 1.25 Zetec Euro 6 5dr",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "46,000 mi",
    "mileageKm": 74030,
    "mileageKnown": true,
    "mileageValue": 46000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 4000,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/birmingham/birmingham/square-one-motors-10042456",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Volkswagen",
    "title": "Volkswagen Golf 1.6 TDI BlueMotion Tech S Euro 5 (s/s) 5dr",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "152,385 mi",
    "mileageKm": 245240,
    "mileageKnown": true,
    "mileageValue": 152385,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 2895,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/birmingham/birmingham/square-one-motors-10042456",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Ford",
    "title": "Ford Transit 2.2 TDCi 280 Duratorq Tourneo Limited Minibus 5dr Diesel Manual L1 H1 (113 bhp)",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "158,538 mi",
    "mileageKm": 255142,
    "mileageKnown": true,
    "mileageValue": 158538,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 2500,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/birmingham/birmingham/square-one-motors-10042456",
    "image": "/dealer-stock/convertible.webp",
    "category": "Convertible",
    "body": "Convertible",
    "make": "BMW",
    "title": "BMW Z4 2.2i SE Auto Euro 3 2dr",
    "year": "2004",
    "yearNumber": 2004,
    "mileage": "75,408 mi",
    "mileageKm": 121357,
    "mileageKnown": true,
    "mileageValue": 75408,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 2495,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/birmingham/birmingham/square-one-motors-10042456",
    "image": "/dealer-stock/coupe.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Smart",
    "title": "Smart Fortwo 0.8 CDI Pulse SoftTouch Euro 5 2dr",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "119,033 mi",
    "mileageKm": 191565,
    "mileageKnown": true,
    "mileageValue": 119033,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 2195,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/birmingham/birmingham/square-one-motors-10042456",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Volkswagen",
    "title": "Volkswagen Caddy Maxi 1.9 TDi Maxi FWD 5dr",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "140,178 mi",
    "mileageKm": 225595,
    "mileageKnown": true,
    "mileageValue": 140178,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 1395,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/birmingham/birmingham/square-one-motors-10042456",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Ford",
    "title": "Ford Transit Connect 1.8 TDCi T230 LX L3 H3 4dr",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "193,794 mi",
    "mileageKm": 311881,
    "mileageKnown": true,
    "mileageValue": 193794,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 1195,
    "href": "/listing-detail-v1/7"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3})\s+/u, '$1 ').replace(/\s+([A-Z]{3})$/u, ' $1');
