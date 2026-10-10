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
    "evidenceUrl": "https://prime_auto.mobile.bg/obiava-11789057604356727-vw-polo-1-4tsi-gti-dsg-euro-5",
    "image": "/assets/vehicles/11789057604356727/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Polo 1.4TSI GTI DSG Euro-5",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "181 900 км",
    "mileageKm": 181900,
    "mileageKnown": true,
    "mileageValue": 181900,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 7900,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://prime_auto.mobile.bg/obiava-11727598230994767-vw-touran-1-4tsi-automat-135900km-euro-6",
    "image": "/assets/vehicles/11727598230994767/1.webp",
    "category": "Ван",
    "body": "Ван",
    "make": "VW",
    "title": "VW Touran 1.4TSI Automat 135900km Euro-6",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "135 900 км",
    "mileageKm": 135900,
    "mileageKnown": true,
    "mileageValue": 135900,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 11900,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://prime_auto.mobile.bg/obiava-11785245881133037-mercedes-benz-c-300-cdi-4-matic-facelift",
    "image": "/assets/vehicles/11785245881133037/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz C 300 CDI 4-Matic FaceLift",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "205 500 км",
    "mileageKm": 205500,
    "mileageKnown": true,
    "mileageValue": 205500,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 7300,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://prime_auto.mobile.bg/obiava-11759398098504216-mercedes-benz-c-200-amg-distronic-android-euro-6",
    "image": "/assets/vehicles/11759398098504216/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz C 200 AMG Distronic Android Euro-6",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "212 500 км",
    "mileageKm": 212500,
    "mileageKnown": true,
    "mileageValue": 212500,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 15900,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://prime_auto.mobile.bg/obiava-11791461227440727-bmw-316-2-0d-f30-bixenon-smenena-veriga",
    "image": "/assets/vehicles/11791461227440727/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 316 2.0d F30 * BiXenon * Сменена Верига*",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "250 190 км",
    "mileageKm": 250190,
    "mileageKnown": true,
    "mileageValue": 250190,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 7700,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://prime_auto.mobile.bg/obiava-11791389088202604-peugeot-2008-1-6hdi-allure-euro-5",
    "image": "/assets/vehicles/11791389088202604/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Peugeot",
    "title": "Peugeot 2008 1.6HDi ALLURE EURO-5",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "164 000 км",
    "mileageKm": 164000,
    "mileageKnown": true,
    "mileageValue": 164000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 6700,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://prime_auto.mobile.bg/obiava-11775554915564927-peugeot-308-1-6-allure-masazh-kamera-fullled-96500km",
    "image": "/assets/vehicles/11775554915564927/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Peugeot",
    "title": "Peugeot 308 1.6 Allure, Масаж, Камера, FullLed 96500km",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "96 500 км",
    "mileageKm": 96500,
    "mileageKnown": true,
    "mileageValue": 96500,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 6900,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://prime_auto.mobile.bg/obiava-21782065548423198-nissan-patrol-y60-gr-2-8td-116k-s",
    "image": "/assets/vehicles/21782065548423198/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Nissan",
    "title": "Nissan Patrol Y60 GR 2.8TD 116к.с.",
    "year": "1992",
    "yearNumber": 1992,
    "mileage": "207 300 км",
    "mileageKm": 207300,
    "mileageKnown": true,
    "mileageValue": 207300,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 12999,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
