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
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-21717056982373192-mercedes-benz-gl-450",
    "image": "/assets/elit/21717056982373192-0.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GL 450",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "184 000 км",
    "mileageKm": 184000,
    "mileageKnown": true,
    "mileageValue": 184000,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 13500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11700571967441521-volvo-s60",
    "image": "/assets/elit/11700571967441521-0.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Volvo",
    "title": "Volvo S60",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "129 000 км",
    "mileageKm": 129000,
    "mileageKnown": true,
    "mileageValue": 129000,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 10890.52,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11529502627430878-toyota-prius-hybrid",
    "image": "/assets/elit/11529502627430878-0.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Toyota",
    "title": "Toyota Prius  Hybrid",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "60 950 км",
    "mileageKm": 60950,
    "mileageKnown": true,
    "mileageValue": 60950,
    "mileageUnit": "km",
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 16105.69,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11694454110383951-subaru-xv-2-5-sport-4x4",
    "image": "/assets/elit/11694454110383951-0.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Subaru",
    "title": "Subaru XV 2.5 Sport 4x4",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "200 км",
    "mileageKm": 200,
    "mileageKnown": true,
    "mileageValue": 200,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 27800,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11694504370077664-subaru-xv-2-0-limited-4x4",
    "image": "/assets/elit/11694504370077664-0.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Subaru",
    "title": "Subaru XV 2.0 Limited 4x4",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "55 000 км",
    "mileageKm": 55000,
    "mileageKnown": true,
    "mileageValue": 55000,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 19000,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11752520414621839-subaru-xv-2-0-premium-4x4",
    "image": "/assets/elit/11752520414621839-0.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Subaru",
    "title": "Subaru XV 2.0 Premium 4x4",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "78 400 км",
    "mileageKm": 78400,
    "mileageKnown": true,
    "mileageValue": 78400,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 17500,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11671399519745199-subaru-xv-2-0-benzin-4h4",
    "image": "/assets/elit/11671399519745199-0.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Subaru",
    "title": "Subaru XV 2.0 бензин 4х4",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "36 000 км",
    "mileageKm": 36000,
    "mileageKnown": true,
    "mileageValue": 36000,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 17100,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11752522269460399-subaru-xv-2-0-limited-sti",
    "image": "/assets/elit/11752522269460399-0.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Subaru",
    "title": "Subaru XV 2.0 Limited STI",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "110 000 км",
    "mileageKm": 110000,
    "mileageKnown": true,
    "mileageValue": 110000,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 13037.94,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11690723101506266-subaru-outback-3-6r-limited-4h4",
    "image": "/assets/elit/11690723101506266-0.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Subaru",
    "title": "Subaru Outback 3.6R Limited 4х4",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "19 000 км",
    "mileageKm": 19000,
    "mileageKnown": true,
    "mileageValue": 19000,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 25500,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11708792902908882-subaru-outback-3-6-touring-4x4",
    "image": "/assets/elit/11708792902908882-0.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Subaru",
    "title": "Subaru Outback 3.6 Touring 4x4",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "82 000 км",
    "mileageKm": 82000,
    "mileageKnown": true,
    "mileageValue": 82000,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 21500,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11706466498517805-subaru-outback-3-6-limited-4x4",
    "image": "/assets/elit/11706466498517805-0.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Subaru",
    "title": "Subaru Outback 3.6 Limited 4x4",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "48 000 км",
    "mileageKm": 48000,
    "mileageKnown": true,
    "mileageValue": 48000,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 21500,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11693118990022696-subaru-legacy-2-5-limited-4x4",
    "image": "/assets/elit/11693118990022696-0.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Subaru",
    "title": "Subaru Legacy 2.5 Limited 4x4",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "94 000 км",
    "mileageKm": 94000,
    "mileageKnown": true,
    "mileageValue": 94000,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 13000,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11655794958039551-subaru-legacy-2-5-benzin-4h4",
    "image": "/assets/elit/11655794958039551-0.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Subaru",
    "title": "Subaru Legacy 2.5 бензин 4х4",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "137 000 км",
    "mileageKm": 137000,
    "mileageKnown": true,
    "mileageValue": 137000,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 11900,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-11722966256335346-mazda-6-2-5-skyactiv",
    "image": "/assets/elit/11722966256335346-0.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Mazda",
    "title": "Mazda 6 2.5 Skyactiv",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "100 789 км",
    "mileageKm": 100789,
    "mileageKnown": true,
    "mileageValue": 100789,
    "mileageUnit": "km",
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 11913.1,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://elitautoimport.mobile.bg/obiava-21691652621240351-hyundai-santa-fe",
    "image": "/assets/elit/21691652621240351-0.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai Santa fe",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "58 000 км",
    "mileageKm": 58000,
    "mileageKnown": true,
    "mileageValue": 58000,
    "mileageUnit": "km",
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 14316.17,
    "href": "/listing-detail-v1/15"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\p{Sc})\s+/u, '$1 ').replace(/\s+([A-Z]{3}|\p{Sc})$/u, ' $1');
