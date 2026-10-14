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
    "evidenceUrl": "https://www.tdp.ae/",
    "image": "/dealer/stock/1.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Porsche",
    "title": "2003 Porsche 911 Turbo",
    "year": "2003",
    "yearNumber": 2003,
    "mileage": "100,600 км",
    "mileageKm": 100600,
    "mileageKnown": true,
    "mileageValue": 100600,
    "mileageUnit": "km",
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 219900,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.tdp.ae/",
    "image": "/dealer/stock/2.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Porsche",
    "title": "2006 Porsche 911 Carrera S Manual",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "117,800 км",
    "mileageKm": 117800,
    "mileageKnown": true,
    "mileageValue": 117800,
    "mileageUnit": "km",
    "fuel": "Gasoline",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 189900,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.tdp.ae/",
    "image": "/dealer/stock/3.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Porsche",
    "title": "2007 Porsche 911 Turbo",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "54,500 км",
    "mileageKm": 54500,
    "mileageKnown": true,
    "mileageValue": 54500,
    "mileageUnit": "km",
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 299900,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.tdp.ae/",
    "image": "/dealer/stock/4.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Porsche",
    "title": "2015 Porsche 911 Carrera 4 GTS",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "116,600 км",
    "mileageKm": 116600,
    "mileageKnown": true,
    "mileageValue": 116600,
    "mileageUnit": "km",
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 279900,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.tdp.ae/",
    "image": "/dealer/stock/5.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Porsche",
    "title": "2020 Porsche 911 Carrera 4S",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "105,400 км",
    "mileageKm": 105400,
    "mileageKnown": true,
    "mileageValue": 105400,
    "mileageUnit": "km",
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 379900,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.tdp.ae/",
    "image": "/dealer/stock/6.svg",
    "category": "Convertible",
    "body": "Convertible",
    "make": "Porsche",
    "title": "2006 Porsche Boxster",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "94,000 км",
    "mileageKm": 94000,
    "mileageKnown": true,
    "mileageValue": 94000,
    "mileageUnit": "km",
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 44900,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.tdp.ae/",
    "image": "/dealer/stock/7.svg",
    "category": "SUV",
    "body": "SUV",
    "make": "Porsche",
    "title": "2008 Porsche Cayenne GTS",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "44,000 км",
    "mileageKm": 44000,
    "mileageKnown": true,
    "mileageValue": 44000,
    "mileageUnit": "km",
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 69900,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.tdp.ae/",
    "image": "/dealer/stock/8.svg",
    "category": "SUV",
    "body": "SUV",
    "make": "Porsche",
    "title": "2011 Porsche Cayenne Turbo",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "153,800 км",
    "mileageKm": 153800,
    "mileageKnown": true,
    "mileageValue": 153800,
    "mileageUnit": "km",
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 49900,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.tdp.ae/",
    "image": "/dealer/stock/9.svg",
    "category": "SUV",
    "body": "SUV",
    "make": "Porsche",
    "title": "2013 Porsche Cayenne GTS",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "29,000 км",
    "mileageKm": 29000,
    "mileageKnown": true,
    "mileageValue": 29000,
    "mileageUnit": "km",
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 129900,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.tdp.ae/",
    "image": "/dealer/stock/10.svg",
    "category": "SUV",
    "body": "SUV",
    "make": "Porsche",
    "title": "2014 Porsche Cayenne Turbo S",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "41,220 км",
    "mileageKm": 41220,
    "mileageKnown": true,
    "mileageValue": 41220,
    "mileageUnit": "km",
    "fuel": "Gasoline",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 119900,
    "href": "/listing-detail-v1/10"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\p{Sc})\s+/u, '$1 ').replace(/\s+([A-Z]{3}|\p{Sc})$/u, ' $1');
