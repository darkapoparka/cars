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
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dynamicautovarna.mobile.bg/obiava-11755636345481695-vw-golf-plus-1-9-tdi-105ks-barter-lizing",
    "image": "/assets/vehicles/11755636345481695/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "180 876 км",
    "mileageKm": 180876,
    "mileageKnown": true,
    "mileageValue": 180876,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2800,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dynamicautovarna.mobile.bg/obiava-11774253415129356-vw-caddy-1-6-dizel-registriran-obsluzhen-lizing",
    "image": "/assets/vehicles/11774253415129356/1.webp",
    "category": "Ван",
    "body": "Ван",
    "make": "VW",
    "title": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "260 876 км",
    "mileageKm": 260876,
    "mileageKnown": true,
    "mileageValue": 260876,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 5600,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dynamicautovarna.mobile.bg/obiava-11780920338607763-toyota-corolla-barter-lizing-bez-zabelezhki-43-000km",
    "image": "/assets/vehicles/11780920338607763/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Toyota",
    "title": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "43 000 км",
    "mileageKm": 43000,
    "mileageKnown": true,
    "mileageValue": 43000,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 18500,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://dynamicautovarna.mobile.bg/obiava-11785227540991935-toyota-avensis-verso-registriran-obsluzhen-lizing-barter",
    "image": "/assets/vehicles/11785227540991935/1.webp",
    "category": "Миниван",
    "body": "Minivan",
    "make": "Toyota",
    "title": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер",
    "year": "2003",
    "yearNumber": 2003,
    "mileage": "280 765 км",
    "mileageKm": 280765,
    "mileageKnown": true,
    "mileageValue": 280765,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2500,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dynamicautovarna.mobile.bg/obiava-11763409304457756-smart-mc-registriran-avtomat-klimatik-panorama",
    "image": "/assets/vehicles/11763409304457756/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Smart",
    "title": "Smart Mc Регистриран / Автомат / Климатик / Панорама",
    "year": "2003",
    "yearNumber": 2003,
    "mileage": "150 098 км",
    "mileageKm": 150098,
    "mileageKnown": true,
    "mileageValue": 150098,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 1200,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dynamicautovarna.mobile.bg/obiava-11784058872993223-peugeot-208-125-hil-km-lizing-barter",
    "image": "/assets/vehicles/11784058872993223/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Peugeot",
    "title": "Peugeot 208 125 хил км. / Лизинг / Бартер",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "125 654 км",
    "mileageKm": 125654,
    "mileageKnown": true,
    "mileageValue": 125654,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 5000,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dynamicautovarna.mobile.bg/obiava-11790879613801923-vw-golf-barter-lizing-navigatsiya",
    "image": "/assets/vehicles/11790879613801923/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Golf Бартер / Лизинг / Навигация",
    "year": "2005",
    "yearNumber": 2005,
    "mileage": "220 765 км",
    "mileageKm": 220765,
    "mileageKnown": true,
    "mileageValue": 220765,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2300,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dynamicautovarna.mobile.bg/obiava-11787907499756917-vw-touran-registriran-obsluzhen-barter-lizing",
    "image": "/assets/vehicles/11787907499756917/1.webp",
    "category": "Ван",
    "body": "Ван",
    "make": "VW",
    "title": "VW Touran Регистриран / Обслужен / Бартер / Лизинг",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "171 234 км",
    "mileageKm": 171234,
    "mileageKnown": true,
    "mileageValue": 171234,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 7000,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
