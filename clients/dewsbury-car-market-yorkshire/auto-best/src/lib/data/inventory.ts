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
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/dewsbury/car-market-yorkshire-10050891",
    "image": "/dealer-stock/coupe.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Nissan",
    "title": "Nissan Gt-R 3.8 V6 Black Edition Auto 4WD Euro 4 2dr",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "71,715 mi",
    "mileageKm": 115414,
    "mileageKnown": true,
    "mileageValue": 71715,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 42495,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/dewsbury/car-market-yorkshire-10050891",
    "image": "/dealer-stock/sedan.webp",
    "category": "Saloon",
    "body": "Saloon",
    "make": "Audi",
    "title": "Audi A6 Saloon 2.0 TDI 40 S line S Tronic quattro Euro 6 (s/s) 4dr",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "34,981 mi",
    "mileageKm": 56296,
    "mileageKnown": true,
    "mileageValue": 34981,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 22995,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/dewsbury/car-market-yorkshire-10050891",
    "image": "/dealer-stock/suv.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Land Rover",
    "title": "Land Rover Range Rover Velar 2.0 D180 R-Dynamic S Auto 4WD Euro 6 (s/s) 5dr",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "66,313 mi",
    "mileageKm": 106720,
    "mileageKnown": true,
    "mileageValue": 66313,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 15495,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/dewsbury/car-market-yorkshire-10050891",
    "image": "/dealer-stock/suv.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLC 2.0 GLC250 AMG Line (Premium Plus) G-Tronic+ 4MATIC Euro 6 (s/s) 5dr",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "120,952 mi",
    "mileageKm": 194653,
    "mileageKnown": true,
    "mileageValue": 120952,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Automatic",
    "equipment": [],
    "condition": "used",
    "priceEur": 12995,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/dewsbury/car-market-yorkshire-10050891",
    "image": "/dealer-stock/hatchback.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Volkswagen",
    "title": "Volkswagen Golf 2.0 TSI BlueMotion Tech R 4Motion Euro 6 (s/s) 5dr",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "82,391 mi",
    "mileageKm": 132595,
    "mileageKnown": true,
    "mileageValue": 82391,
    "mileageUnit": "mi",
    "fuel": "Petrol",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 12995,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://www.autotrader.co.uk/dealers/west-yorkshire/dewsbury/car-market-yorkshire-10050891",
    "image": "/dealer-stock/van.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz Citan 1.5 109 CDI BlueEfficiency L2 Euro 6 (s/s) 5dr",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "105,906 mi",
    "mileageKm": 170439,
    "mileageKnown": true,
    "mileageValue": 105906,
    "mileageUnit": "mi",
    "fuel": "Diesel",
    "transmission": "Manual",
    "equipment": [],
    "condition": "used",
    "priceEur": 4895,
    "href": "/listing-detail-v1/6"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');

/** Allow a currency line break while preserving the locale's grouped digits. */
export const formatVehiclePriceLabel = (amount: number, locale: Locale = localeContract.defaultLocale) =>
  formatVehiclePrice(amount, locale).replace(/([A-Z]{3}|\p{Sc})\s+/u, '$1 ').replace(/\s+([A-Z]{3}|\p{Sc})$/u, ' $1');
