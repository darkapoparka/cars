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
    "evidenceUrl": "https://www.pistonheads.com/buy/listing/20722137",
    "image": "/dealer-stock/sedan.webp",
    "category": "Saloon",
    "body": "Saloon",
    "make": "Chrysler",
    "title": "Chrysler Sebring 2.4 Limited Saloon 4dr Petrol Automatic (211 g/km, 167 bhp)",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "100,000 mi",
    "mileageKm": 160934,
    "mileageKnown": true,
    "mileageValue": 100000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Auto",
    "equipment": [],
    "condition": "used",
    "priceEur": 1499,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.pistonheads.com/buy/listing/21144493",
    "image": "/dealer-stock/suv.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Land Rover",
    "title": "Land Rover Discovery Sport 2.0 TD4 HSE Black SUV 5dr Diesel Auto 4WD Euro 6 (s/s) (180 ps)",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "107,000 mi",
    "mileageKm": 172200,
    "mileageKnown": true,
    "mileageValue": 107000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Auto",
    "equipment": [],
    "condition": "used",
    "priceEur": 7499,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.pistonheads.com/buy/listing/20977893",
    "image": "/dealer-stock/van.webp",
    "category": "MPV",
    "body": "MPV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz R-Class 3.0 R320 CDI SE L MPV 5dr Diesel 7G-Tronic (246 g/km, 221 bhp)",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "97,000 mi",
    "mileageKm": 156106,
    "mileageKnown": true,
    "mileageValue": 97000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Auto",
    "equipment": [],
    "condition": "used",
    "priceEur": 2699,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.pistonheads.com/buy/listing/21086505",
    "image": "/dealer-stock/wagon.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A4 3.0 TDI SE Estate 5dr Diesel S Tronic quattro Euro 4 (240 ps)",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "150,000 mi",
    "mileageKm": 241402,
    "mileageKnown": true,
    "mileageValue": 150000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Auto",
    "equipment": [],
    "condition": "used",
    "priceEur": 3299,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.pistonheads.com/buy/listing/20877963",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Renault",
    "title": "Renault Megane 1.5 dCi Expression Hatchback 5dr Diesel Manual Euro 5 (110 ps)",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "72,000 mi",
    "mileageKm": 115873,
    "mileageKnown": true,
    "mileageValue": 72000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 1499,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.pistonheads.com/buy/listing/21180529",
    "image": "/dealer-stock/suv.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai Santa Fe 2.2 CRDi Premium SE SUV 5dr Diesel Auto 4WD Euro 5 (7 seat) (194 bhp)",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "171,000 mi",
    "mileageKm": 275198,
    "mileageKnown": true,
    "mileageValue": 171000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Auto",
    "equipment": [],
    "condition": "used",
    "priceEur": 3199,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.pistonheads.com/buy/listing/21170923",
    "image": "/dealer-stock/suv.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Volvo",
    "title": "Volvo XC60 2.4 D5 R-Design SUV 5dr Diesel Geartronic AWD Euro 5 (205 ps)",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "141,000 mi",
    "mileageKm": 226918,
    "mileageKnown": true,
    "mileageValue": 141000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Auto",
    "equipment": [],
    "condition": "used",
    "priceEur": 3799,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.pistonheads.com/buy/listing/20562332",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "MINI",
    "title": "MINI Hatchback 1.5 Cooper Hatchback 5dr Petrol Manual Euro 6 (s/s) (136 ps)",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "123,000 mi",
    "mileageKm": 197949,
    "mileageKnown": true,
    "mileageValue": 123000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 2499,
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
