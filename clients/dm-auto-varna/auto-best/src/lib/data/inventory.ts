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
    "evidenceUrl": "https://dmautovarna.mobile.bg/obiava-21791544163341152-bmw-x5-registriran-s-gazov-inzhektsion",
    "image": "/assets/vehicles/21791544163341152/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X5 Регистриран с Газов инжекцион",
    "year": "2002",
    "yearNumber": 2002,
    "mileage": "202 313 км",
    "mileageKm": 202313,
    "mileageKnown": true,
    "mileageValue": 202313,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 4449,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dmautovarna.mobile.bg/obiava-21790863081842896-land-rover-range-rover-sport",
    "image": "/assets/vehicles/21790863081842896/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Land Rover",
    "title": "Land Rover Range Rover Sport",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "207 520 км",
    "mileageKm": 207520,
    "mileageKnown": true,
    "mileageValue": 207520,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 17499,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dmautovarna.mobile.bg/obiava-11790773105725043-mercedes-benz-a-180-registriran-vsichko-plateno",
    "image": "/assets/vehicles/11790773105725043/1.webp",
    "category": "Купе",
    "body": "Coupe",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz A 180 Регистриран всичко платено",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "226 313 км",
    "mileageKm": 226313,
    "mileageKnown": true,
    "mileageValue": 226313,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2099,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dmautovarna.mobile.bg/obiava-11790612635782674-audi-a7-s-line-50-tdi",
    "image": "/assets/vehicles/11790612635782674/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A7 S-Line 50 TDI",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "239 520 км",
    "mileageKm": 239520,
    "mileageKnown": true,
    "mileageValue": 239520,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 31999,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dmautovarna.mobile.bg/obiava-11790518149051725-audi-a8-50-tdi-matrix",
    "image": "/assets/vehicles/11790518149051725/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A8 50 TDI MATRIX",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "228 530 км",
    "mileageKm": 228530,
    "mileageKnown": true,
    "mileageValue": 228530,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 33999,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dmautovarna.mobile.bg/obiava-21790339935983598-mercedes-benz-gle-350-coupe-4matic-2016-g",
    "image": "/assets/vehicles/21790339935983598/1.webp",
    "category": "Купе",
    "body": "Coupe",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLE 350 Coupe 4MATIC | 2016 г",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "233 613 км",
    "mileageKm": 233613,
    "mileageKnown": true,
    "mileageValue": 233613,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 29499,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dmautovarna.mobile.bg/obiava-11782111379336466-vw-touran-2-0-tdi-7-mesten-registriran",
    "image": "/assets/vehicles/11782111379336466/1.webp",
    "category": "Ван",
    "body": "Ван",
    "make": "VW",
    "title": "VW Touran 2.0 TDI/7 Местен/ Регистриран",
    "year": "2005",
    "yearNumber": 2005,
    "mileage": "241 111 км",
    "mileageKm": 241111,
    "mileageKnown": true,
    "mileageValue": 241111,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2799,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dmautovarna.mobile.bg/obiava-11780510025520950-toyota-avensis-2-0-d4d-126k-c",
    "image": "/assets/vehicles/11780510025520950/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Toyota",
    "title": "Toyota Avensis 2.0 D4D 126k.c",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "163 525 км",
    "mileageKm": 163525,
    "mileageKnown": true,
    "mileageValue": 163525,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 5999,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
