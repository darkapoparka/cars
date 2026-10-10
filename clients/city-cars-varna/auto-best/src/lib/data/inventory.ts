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
    "evidenceUrl": "https://city_cars.mobile.bg/obiava-11791382885730376-opel-zafira-tourer-2-0-cdti-6-1-mesta-evro-6v-nov-vnos",
    "image": "/assets/vehicles/11791382885730376/1.webp",
    "category": "Миниван",
    "body": "Minivan",
    "make": "Opel",
    "title": "Opel Zafira TOURER 2.0 CDTI 6+ 1 МЕСТА ЕВРО 6В - НОВ ВНОС",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "171 000 км",
    "mileageKm": 171000,
    "mileageKnown": true,
    "mileageValue": 171000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 5500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://city_cars.mobile.bg/obiava-21791296931163018-bmw-x3-2-0d-x-drive-m-pack-nov-vnos",
    "image": "/assets/vehicles/21791296931163018/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X3 2.0d X Drive M Pack нов внос",
    "year": "2005",
    "yearNumber": 2005,
    "mileage": "195 000 км",
    "mileageKm": 195000,
    "mileageKnown": true,
    "mileageValue": 195000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4300,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://city_cars.mobile.bg/obiava-11791295165673002-audi-a6-3-0-tdi-quatro-nov-vnos",
    "image": "/assets/vehicles/11791295165673002/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A6 3.0 TDI Quatro НОВ ВНОС",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "290 000 км",
    "mileageKm": 290000,
    "mileageKnown": true,
    "mileageValue": 290000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 3300,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://city_cars.mobile.bg/obiava-11790952448716027-mercedes-benz-c-320-4matic-amg-avantgarde",
    "image": "/assets/vehicles/11790952448716027/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz C 320 4MATIC AMG AVANTGARDE",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "192 000 км",
    "mileageKm": 192000,
    "mileageKnown": true,
    "mileageValue": 192000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 7100,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://city_cars.mobile.bg/obiava-11790685723628799-mini-one-1-6i-2010-g-nov-vnos",
    "image": "/assets/vehicles/11790685723628799/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Mini",
    "title": "Mini One 1.6i 2010 г. нов внос",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "109 000 км",
    "mileageKm": 109000,
    "mileageKnown": true,
    "mileageValue": 109000,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3400,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://city_cars.mobile.bg/obiava-11790421466350380-vw-touran-2-0-tdi-170-ks-nov-vnos",
    "image": "/assets/vehicles/11790421466350380/1.webp",
    "category": "Миниван",
    "body": "Minivan",
    "make": "VW",
    "title": "VW Touran 2.0 TDI 170 кс НОВ ВНОС",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "204 000 км",
    "mileageKm": 204000,
    "mileageKnown": true,
    "mileageValue": 204000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3100,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://city_cars.mobile.bg/obiava-11790421108936976-vw-touran-cross-2-0-tdi-6-1-mesta-nov-vnos",
    "image": "/assets/vehicles/11790421108936976/1.webp",
    "category": "Миниван",
    "body": "Minivan",
    "make": "VW",
    "title": "VW Touran CROSS 2.0 TDI 6+ 1 МЕСТА НОВ ВНОС",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "165 000 км",
    "mileageKm": 165000,
    "mileageKnown": true,
    "mileageValue": 165000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4800,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://city_cars.mobile.bg/obiava-11790415547111474-audi-a4-2-0-tdi-s-line-nov-vnos",
    "image": "/assets/vehicles/11790415547111474/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A4 2.0 TDI S- LINE НОВ ВНОС",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "179 000 км",
    "mileageKm": 179000,
    "mileageKnown": true,
    "mileageValue": 179000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 6100,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
