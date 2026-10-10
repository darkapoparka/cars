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
    "evidenceUrl": "https://dreamdrive.mobile.bg/obiava-11790190994561881-vw-golf-2-0-tdi-150-4motion",
    "image": "/assets/vehicles/11790190994561881/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Golf 2.0 TDI 150 4Motion",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "227 000 км",
    "mileageKm": 227000,
    "mileageKnown": true,
    "mileageValue": 227000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 8999,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dreamdrive.mobile.bg/obiava-11791398612800365-audi-a4-2-0-tdi-s-line-led-navi",
    "image": "/assets/vehicles/11791398612800365/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A4 2.0 TDI S LINE LED NAVI",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "237 000 км",
    "mileageKm": 237000,
    "mileageKnown": true,
    "mileageValue": 237000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 6900,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dreamdrive.mobile.bg/obiava-11789907842576383-vw-passat-2-0-tdi-alltrack-digital",
    "image": "/assets/vehicles/11789907842576383/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat 2.0 TDI ALLTRACK DIGITAL",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "226 000 км",
    "mileageKm": 226000,
    "mileageKnown": true,
    "mileageValue": 226000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 14200,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dreamdrive.mobile.bg/obiava-11789911583559651-toyota-yaris-1-3vvti",
    "image": "/assets/vehicles/11789911583559651/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Toyota",
    "title": "Toyota Yaris 1.3vvti",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "188 000 км",
    "mileageKm": 188000,
    "mileageKnown": true,
    "mileageValue": 188000,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3600,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dreamdrive.mobile.bg/obiava-21789906623508409-suzuki-vitara-1-6ddis-120ks-4x4",
    "image": "/assets/vehicles/21789906623508409/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Suzuki",
    "title": "Suzuki Vitara 1.6DDIS 120кс 4x4",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "200 000 км",
    "mileageKm": 200000,
    "mileageKnown": true,
    "mileageValue": 200000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 10500,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dreamdrive.mobile.bg/obiava-11789907068377884-suzuki-sx4-1-6i-120ks-4x4-160-000-km",
    "image": "/assets/vehicles/11789907068377884/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Suzuki",
    "title": "Suzuki SX4 1.6i 120кс 4x4 160.000 КМ",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "160 000 км",
    "mileageKm": 160000,
    "mileageKnown": true,
    "mileageValue": 160000,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 5900,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dreamdrive.mobile.bg/obiava-11789910526546898-renault-megane-1-9-dci-gt-line-230-000-km",
    "image": "/assets/vehicles/11789910526546898/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Renault",
    "title": "Renault Megane 1.9 DCI GT LINE 230.000 КМ",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "230 000 км",
    "mileageKm": 230000,
    "mileageKnown": true,
    "mileageValue": 230000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3999,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://dreamdrive.mobile.bg/obiava-11789909936155141-peugeot-3008-1-6hdi-120ks-avtomatik",
    "image": "/assets/vehicles/11789909936155141/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Peugeot",
    "title": "Peugeot 3008 1.6HDI 120кс АВТОМАТИК",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "170 000 км",
    "mileageKm": 170000,
    "mileageKnown": true,
    "mileageValue": 170000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 13600,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
