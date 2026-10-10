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
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/189038456623",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Ford",
    "title": "2014 Ford Transit Connect 1.6 TDCi 115ps LWB 3 Seater PANEL VAN Diesel Manual",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "115,000 mi",
    "mileageKm": 185075,
    "mileageKnown": true,
    "mileageValue": 115000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 4950,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/189026984290",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Vauxhall",
    "title": "2014 Vauxhall Astra 1.6i 16V Limited Edition 5dr HATCHBACK Petrol Manual",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "110,000 mi",
    "mileageKm": 177028,
    "mileageKnown": true,
    "mileageValue": 110000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 600,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/189001222071",
    "image": "/dealer-stock/wagon.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "Ford",
    "title": "2016 Ford Mondeo 1.5 EcoBoost Titanium 5dr ESTATE Petrol Manual",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "108,000 mi",
    "mileageKm": 173809,
    "mileageKnown": true,
    "mileageValue": 108000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3950,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/189001115867",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "MINI",
    "title": "2014 MINI Hatch 1.5 Cooper 3dr HATCHBACK Petrol Manual",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "120,000 mi",
    "mileageKm": 193121,
    "mileageKnown": true,
    "mileageValue": 120000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 2950,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/189001107042",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Ford",
    "title": "2015 Ford Mondeo 1.6 TDCi ECOnetic Titanium 5dr HATCHBACK Diesel Manual",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "155,000 mi",
    "mileageKm": 249448,
    "mileageKnown": true,
    "mileageValue": 155000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 2500,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/188987508854",
    "image": "/dealer-stock/sedan.webp",
    "category": "Saloon",
    "body": "Saloon",
    "make": "Mercedes-Benz",
    "title": "2007 Mercedes-Benz C Class C220 CDI Sport 4dr Auto SALOON Diesel Automatic",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "115,000 mi",
    "mileageKm": 185075,
    "mileageKnown": true,
    "mileageValue": 115000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 1850,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/188945492227",
    "image": "/dealer-stock/wagon.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "Chevrolet",
    "title": "2011 Chevrolet Captiva 2.0 VCDi LT 5dr FWD ESTATE Diesel Manual",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "85,000 mi",
    "mileageKm": 136794,
    "mileageKnown": true,
    "mileageValue": 85000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 1500,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/188941416002",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Volkswagen",
    "title": "2009 Volkswagen Golf Plus 1.6 TDI 105 SE 5dr DSG HATCHBACK Diesel Automatic",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "115,000 mi",
    "mileageKm": 185075,
    "mileageKnown": true,
    "mileageValue": 115000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 2450,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/188941382536",
    "image": "/dealer-stock/coupe.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "BMW",
    "title": "2007 BMW 3 Series 320i 2.0i Special Edition 2dr Coupe COUPE Petrol Manual",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "79,000 mi",
    "mileageKm": 127138,
    "mileageKnown": true,
    "mileageValue": 79000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 2000,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/188941314819",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Volkswagen",
    "title": "2008 Volkswagen Golf 1.6 Match FSI 5dr HATCHBACK Petrol Manual",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "99,000 mi",
    "mileageKm": 159325,
    "mileageKnown": true,
    "mileageValue": 99000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 1500,
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
