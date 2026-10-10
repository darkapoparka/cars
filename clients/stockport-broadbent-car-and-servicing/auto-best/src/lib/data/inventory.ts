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
    "evidenceUrl": "https://www.ebay.co.uk/itm/860026521888",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Peugeot",
    "title": "2017 Peugeot Partner 850 1.6 BlueHDi 100 Professional Van [non SS] PANEL VAN Die",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "119,000 mi",
    "mileageKm": 191512,
    "mileageKnown": true,
    "mileageValue": 119000,
    "mileageUnit": "mi",
    "fuel": "Not published",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 3995,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/860026533399",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Ford",
    "title": "2020 Ford Transit 2.0 EcoBlue 130ps H3 Trend Van PANEL VAN Diesel Manual",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "92,000 mi",
    "mileageKm": 148060,
    "mileageKnown": true,
    "mileageValue": 92000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 9995,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/860026522289",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Ford",
    "title": "2017 Ford Transit Custom 2.0 TDCi 105ps High Roof Van PANEL VAN Diesel Manual",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "144,000 mi",
    "mileageKm": 231746,
    "mileageKnown": true,
    "mileageValue": 144000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 5995,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/860023676019",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Ford",
    "title": "2018 Ford Transit 2.0 TDCi 130ps H3 Van PANEL VAN Diesel Manual",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "132,000 mi",
    "mileageKm": 212433,
    "mileageKnown": true,
    "mileageValue": 132000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 6795,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/860023304847",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Ford",
    "title": "2021 Ford Transit 2.0 EcoBlue 130ps H3 Leader Van PANEL VAN Diesel Manual",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "48,000 mi",
    "mileageKm": 77249,
    "mileageKnown": true,
    "mileageValue": 48000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 13995,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/860022996391",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Ford",
    "title": "2016 Ford Mondeo 1.5 TDCi ECOnetic Zetec 5dr HATCHBACK Diesel Manual",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "93,500 mi",
    "mileageKm": 150474,
    "mileageKnown": true,
    "mileageValue": 93500,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 4995,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/860019450163",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Ford",
    "title": "2014 Ford Fiesta 1.6 TDCi Titanium ECOnetic 5dr HATCHBACK Diesel Manual",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "85,000 mi",
    "mileageKm": 136794,
    "mileageKnown": true,
    "mileageValue": 85000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 2995,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/860015804779",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Renault",
    "title": "2010 Renault Clio 1.6 VVT Initiale 5dr Auto HATCHBACK Petrol Automatic",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "59,000 mi",
    "mileageKm": 94951,
    "mileageKnown": true,
    "mileageValue": 59000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 3000,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/860011683310",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Peugeot",
    "title": "2013 Peugeot Partner 716 S 1.6 HDi 92 Crew Van PANEL VAN Diesel Manual",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "109,000 mi",
    "mileageKm": 175418,
    "mileageKnown": true,
    "mileageValue": 109000,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 3195,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.ebay.co.uk/itm/860011314014",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Vauxhall",
    "title": "2014 Vauxhall Astra 1.4i 16V SRi 5dr HATCHBACK Petrol Manual",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "77,000 mi",
    "mileageKm": 123919,
    "mileageKnown": true,
    "mileageValue": 77000,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 2795,
    "href": "/listing-detail-v1/10"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
