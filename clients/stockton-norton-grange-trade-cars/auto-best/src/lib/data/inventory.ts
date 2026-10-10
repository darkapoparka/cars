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
    "evidenceUrl": "https://www.ebay.co.uk/itm/820214219013",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Peugeot",
    "title": "2016 Peugeot 208 1.6 BlueHDi Active 5dr HATCHBACK Diesel Manual",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "80,000 mi",
    "mileageKm": 128748,
    "mileageKnown": true,
    "mileageValue": 80000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3490,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/820210366321",
    "image": "/dealer-stock/van.webp",
    "category": "MPV",
    "body": "MPV",
    "make": "Ford",
    "title": "2016 Ford Grand C-Max 1.5 TDCi Titanium 5dr MPV Diesel Manual",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "103,000 mi",
    "mileageKm": 165762,
    "mileageKnown": true,
    "mileageValue": 103000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 4990,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/820209853597",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Ford",
    "title": "2016 Ford Focus 1.5 TDCi 120 Titanium 5dr HATCHBACK Diesel Manual",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "103,000 mi",
    "mileageKm": 165762,
    "mileageKnown": true,
    "mileageValue": 103000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3990,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/820206910321",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Nissan",
    "title": "2017 Nissan Qashqai 1.5 dCi N-Vision 5dr HATCHBACK Diesel Manual",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "93,000 mi",
    "mileageKm": 149669,
    "mileageKnown": true,
    "mileageValue": 93000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 5990,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/820199748020",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Vauxhall",
    "title": "2017 Vauxhall Corsa 1.4 SRi Vx-line 3dr HATCHBACK Petrol Manual",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "75,401 mi",
    "mileageKm": 121346,
    "mileageKnown": true,
    "mileageValue": 75401,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 4750,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/820174486495",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Audi",
    "title": "2013 Audi A1 1.4 TFSI Sport 5dr HATCHBACK Petrol Manual",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "80,000 mi",
    "mileageKm": 128748,
    "mileageKnown": true,
    "mileageValue": 80000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 5490,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/820154120347",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Nissan",
    "title": "2018 Nissan Qashqai 1.5 dCi 115 N-Connecta 5dr HATCHBACK Diesel Manual",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "92,418 mi",
    "mileageKm": 148732,
    "mileageKnown": true,
    "mileageValue": 92418,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 7490,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/820133361606",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Ford",
    "title": "2014 Ford Fiesta 1.25 82 Zetec 3dr HATCHBACK Petrol Manual",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "51,000 mi",
    "mileageKm": 82077,
    "mileageKnown": true,
    "mileageValue": 51000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 4650,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/820133263757",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Nissan",
    "title": "2017 Nissan Juke 1.5 dCi N-Connecta 5dr HATCHBACK Diesel Manual",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "101,000 mi",
    "mileageKm": 162544,
    "mileageKnown": true,
    "mileageValue": 101000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 4290,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/820110031882",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Nissan",
    "title": "2015 Nissan Juke 1.5 dCi Acenta Premium 5dr HATCHBACK Diesel Manual",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "83,830 mi",
    "mileageKm": 134911,
    "mileageKnown": true,
    "mileageValue": 83830,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3990,
    "href": "/listing-detail-v1/10"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3})\s+/u, '$1 ').replace(/\s+([A-Z]{3})$/u, ' $1');
