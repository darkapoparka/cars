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
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/1.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Koenigsegg",
    "title": "Koenigsegg Jesko Attack 2023",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "0 км",
    "mileageKm": 0,
    "mileageKnown": true,
    "mileageValue": 0,
    "mileageUnit": "km",
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "new",
    "priceEur": 21000000,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/2.webp",
    "category": "Convertible",
    "body": "Convertible",
    "make": "Bugatti",
    "title": "Bugatti W16 Mistral 2025",
    "year": "2025",
    "yearNumber": 2025,
    "mileage": "0 км",
    "mileageKm": 0,
    "mileageKnown": true,
    "mileageValue": 0,
    "mileageUnit": "km",
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "new",
    "priceEur": 34000000,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/3.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Ford",
    "title": "Ford GT 2017",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "5,669 км",
    "mileageKm": 5669,
    "mileageKnown": true,
    "mileageValue": 5669,
    "mileageUnit": "km",
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 2599995,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/4.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Porsche",
    "title": "Porsche Carrera GT 2006",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "13,000 км",
    "mileageKm": 13000,
    "mileageKnown": true,
    "mileageValue": 13000,
    "mileageUnit": "km",
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 11000000,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/5.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Ford",
    "title": "Ford GT 2020",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "3,250 км",
    "mileageKm": 3250,
    "mileageKnown": true,
    "mileageValue": 3250,
    "mileageUnit": "km",
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 2899995,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/6.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Ferrari",
    "title": "Ferrari SF90XX Stradale 2024",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "0 км",
    "mileageKm": 0,
    "mileageKnown": true,
    "mileageValue": 0,
    "mileageUnit": "km",
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "new",
    "priceEur": 5400000,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/7.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Pininfarina",
    "title": "Pininfarina Battista Furiosa Package 2024",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "10,200 км",
    "mileageKm": 10200,
    "mileageKnown": true,
    "mileageValue": 10200,
    "mileageUnit": "km",
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 11000000,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/8.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Aston Martin",
    "title": "Aston Martin Valhalla 2026",
    "year": "2026",
    "yearNumber": 2026,
    "mileage": "692 км",
    "mileageKm": 692,
    "mileageKnown": true,
    "mileageValue": 692,
    "mileageUnit": "km",
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 5500000,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/9.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Bugatti",
    "title": "Bugatti Chiron Sport Noire 2021",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "2,550 км",
    "mileageKm": 2550,
    "mileageKnown": true,
    "mileageValue": 2550,
    "mileageUnit": "km",
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 15500000,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/10.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Porsche",
    "title": "Porsche 911 S/T 2024",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "0 км",
    "mileageKm": 0,
    "mileageKnown": true,
    "mileageValue": 0,
    "mileageUnit": "km",
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "new",
    "priceEur": 1779995,
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
