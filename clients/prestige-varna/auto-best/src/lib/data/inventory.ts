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
    "evidenceUrl": "",
    "image": "/assets/images/lead/day-night-stock-04.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi RS 6 Avant",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "99 701 км",
    "mileageKm": 99701,
    "mileageKnown": true,
    "mileageValue": 99701,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп",
      "Адаптивен круиз контрол"
    ],
    "condition": "used",
    "priceEur": 68804,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "",
    "image": "/assets/images/lead/day-night-stock-01.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLE Coupé",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "96 865 км",
    "mileageKm": 96865,
    "mileageKnown": true,
    "mileageValue": 96865,
    "mileageUnit": "km",
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп",
      "Адаптивен круиз контрол"
    ],
    "condition": "used",
    "priceEur": 55403,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "",
    "image": "/assets/images/lead/day-night-stock-06.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi RS Q8",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "94 709 км",
    "mileageKm": 94709,
    "mileageKnown": true,
    "mileageValue": 94709,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп",
      "Адаптивен круиз контрол"
    ],
    "condition": "used",
    "priceEur": 57480,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "",
    "image": "/assets/images/lead/day-night-stock-02.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 M Sport",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "62 485 км",
    "mileageKm": 62485,
    "mileageKnown": true,
    "mileageValue": 62485,
    "mileageUnit": "km",
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 54223,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "",
    "image": "/assets/images/lead/day-night-stock-03.webp",
    "category": "Sportback",
    "body": "Sportback",
    "make": "Mercedes-Benz",
    "title": "Mercedes-AMG GT 4-Door",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "72 812 км",
    "mileageKm": 72812,
    "mileageKnown": true,
    "mileageValue": 72812,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 61069,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "",
    "image": "/assets/images/lead/day-night-stock-02.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 xDrive",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "76 346 км",
    "mileageKm": 76346,
    "mileageKnown": true,
    "mileageValue": 76346,
    "mileageUnit": "km",
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 85635,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "",
    "image": "/assets/images/lead/day-night-stock-03.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Mercedes-Benz",
    "title": "Mercedes-AMG GT Coupé",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "49 584 км",
    "mileageKm": 49584,
    "mileageKnown": true,
    "mileageValue": 49584,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 51365,
    "href": "/listing-detail-v1/7"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\p{Sc})\s+/u, '$1 ').replace(/\s+([A-Z]{3}|\p{Sc})$/u, ' $1');
