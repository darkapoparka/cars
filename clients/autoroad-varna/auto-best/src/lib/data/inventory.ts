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
    "evidenceUrl": "https://autoroad.mobile.bg/obiava-11764083375105654-peugeot-5008-1-5-hdi-led-keyless-distronik-digital-lane-assist",
    "image": "/assets/vehicles/11764083375105654/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Peugeot",
    "title": "Peugeot 5008 1.5 HDI -LED-KEYLESS-DISTRONIK-DIGITAL-LANE ASSIST",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "197 000 км",
    "mileageKm": 197000,
    "mileageKnown": true,
    "mileageValue": 197000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 13500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autoroad.mobile.bg/obiava-11791216679127136-renault-megane-e-tech-ev-60-220k-s-equilibre-optimum-charge",
    "image": "/assets/vehicles/11791216679127136/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Renault",
    "title": "Renault Megane E-TECH-EV 60-220K.S. Equilibre optimum charge",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "121 000 км",
    "mileageKm": 121000,
    "mileageKnown": true,
    "mileageValue": 121000,
    "mileageUnit": "km",
    "fuel": "Електрически",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 19500,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autoroad.mobile.bg/obiava-21791195488121434-skoda-karoq-1-6-tdi-dsg-kamera-led-face",
    "image": "/assets/vehicles/21791195488121434/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Skoda",
    "title": "Skoda Karoq 1.6 TDI-DSG-KAMERA-LED-FACE",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "205 000 км",
    "mileageKm": 205000,
    "mileageKnown": true,
    "mileageValue": 205000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 11999,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autoroad.mobile.bg/obiava-21778683919459620-skoda-karoq-2-0-tdi-avtomat-4x4-keyless-distronik-digital",
    "image": "/assets/vehicles/21778683919459620/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Skoda",
    "title": "Skoda Karoq 2.0 TDI -AVTOMAT-4x4-KEYLESS-DISTRONIK-DIGITAL",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "163 000 км",
    "mileageKm": 163000,
    "mileageKnown": true,
    "mileageValue": 163000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 14500,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autoroad.mobile.bg/obiava-11785948289956075-mercedes-benz-cla-200-amg-panoram-podgrev-ambient-memori",
    "image": "/assets/vehicles/11785948289956075/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz CLA 200 AMG-PANORAM-PODGREV-AMBIENT-MEMORI",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "170 000 км",
    "mileageKm": 170000,
    "mileageKnown": true,
    "mileageValue": 170000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 25500,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autoroad.mobile.bg/obiava-21781865867073187-audi-q4-sportback-e-tron-82kwh-40-s-line-panorama-ambient",
    "image": "/assets/vehicles/21781865867073187/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q4 SPORTBACK E-TRON 82KWH 40 S LINE-PANORAMA-AMBIENT",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "128 000 км",
    "mileageKm": 128000,
    "mileageKnown": true,
    "mileageValue": 128000,
    "mileageUnit": "km",
    "fuel": "Електрически",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 29999,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autoroad.mobile.bg/obiava-11781957951294075-lotus-eletre-112-kw-612-k-s-akebono-edition",
    "image": "/assets/vehicles/11781957951294075/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Lotus",
    "title": "Lotus Eletre 112 KW-612 K.S.-AKEBONO EDITION",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "90 000 км",
    "mileageKm": 90000,
    "mileageKnown": true,
    "mileageValue": 90000,
    "mileageUnit": "km",
    "fuel": "Електрически",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 69999,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://autoroad.mobile.bg/obiava-11789287072800457-vw-id-4-pro-82kwh-ambient-light-led-soh-91-36",
    "image": "/assets/vehicles/11789287072800457/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "VW",
    "title": "VW ID.4 Pro-82kWh-AMBIENT LIGHT-LED-SOH-91.36%",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "169 000 км",
    "mileageKm": 169000,
    "mileageKnown": true,
    "mileageValue": 169000,
    "mileageUnit": "km",
    "fuel": "Електрически",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 21999,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
