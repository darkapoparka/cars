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
    "evidenceUrl": "https://kolarovcars.mobile.bg/obiava-11791553575767854-kia-k5-ochakvan-vnos-2-0-lpi",
    "image": "/assets/vehicles/11791553575767854/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Kia",
    "title": "Kia K5 ОЧАКВАН ВНОС! 2.0 LPI",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "101 899 км",
    "mileageKm": 101899,
    "mileageKnown": true,
    "mileageValue": 101899,
    "mileageUnit": "km",
    "fuel": "Газ",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 15400,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://kolarovcars.mobile.bg/obiava-11791199226623612-kia-carens-ochakvan-vnos-2-0-lpi-noblesse",
    "image": "/assets/vehicles/11791199226623612/1.webp",
    "category": "Миниван",
    "body": "Minivan",
    "make": "Kia",
    "title": "Kia Carens ОЧАКВАН ВНОС! 2.0 LPI Noblesse",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "158 528 км",
    "mileageKm": 158528,
    "mileageKnown": true,
    "mileageValue": 158528,
    "mileageUnit": "km",
    "fuel": "Газ",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 13800,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://kolarovcars.mobile.bg/obiava-21791198605082937-hyundai-kona-ochakvan-vnos-100-kw-select-2wd",
    "image": "/assets/vehicles/21791198605082937/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai Kona ОЧАКВАН ВНОС! 100 kW Select 2WD",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "68 758 км",
    "mileageKm": 68758,
    "mileageKnown": true,
    "mileageValue": 68758,
    "mileageUnit": "km",
    "fuel": "Електрически",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 19000,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://kolarovcars.mobile.bg/obiava-11790857321805014-hyundai-grandeur-ochakvan-vnos-3-5-lpg-2wd",
    "image": "/assets/vehicles/11790857321805014/1.webp",
    "category": "Стреч лимузина",
    "body": "Стреч лимузина",
    "make": "Hyundai",
    "title": "Hyundai Grandeur ОЧАКВАН ВНОС! 3.5 LPG 2WD",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "45 606 км",
    "mileageKm": 45606,
    "mileageKnown": true,
    "mileageValue": 45606,
    "mileageUnit": "km",
    "fuel": "Газ",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 27900,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "van",
    "verification": "sample",
    "evidenceUrl": "https://kolarovcars.mobile.bg/obiava-11790848955763034-kia-carnival-ochakvan-vnos-hev-7seater-nobless",
    "image": "/assets/vehicles/11790848955763034/1.webp",
    "category": "Миниван",
    "body": "Minivan",
    "make": "Kia",
    "title": "Kia Carnival ОЧАКВАН ВНОС! HEV 7SEATER NOBLESS",
    "year": "2025",
    "yearNumber": 2025,
    "mileage": "7084 км",
    "mileageKm": 7084,
    "mileageKnown": true,
    "mileageValue": 7084,
    "mileageUnit": "km",
    "fuel": "Хибриден",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 39900,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://kolarovcars.mobile.bg/obiava-21779090254494625-hyundai-santa-fe-2-2-2wd",
    "image": "/assets/vehicles/21779090254494625/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai Santa fe 2.2 2WD",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "45 007 км",
    "mileageKm": 45007,
    "mileageKnown": true,
    "mileageValue": 45007,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 22700,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://kolarovcars.mobile.bg/obiava-21771407377667718-hyundai-tucson-2-0-diesel-2wd",
    "image": "/assets/vehicles/21771407377667718/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai Tucson 2.0 Diesel 2WD",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "123 069 км",
    "mileageKm": 123069,
    "mileageKnown": true,
    "mileageValue": 123069,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 13900,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://kolarovcars.mobile.bg/obiava-11779089110175489-kia-picanto-1-0-lpg-deluxe",
    "image": "/assets/vehicles/11779089110175489/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Kia",
    "title": "Kia Picanto 1.0 LPG Deluxe",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "115 657 км",
    "mileageKm": 115657,
    "mileageKnown": true,
    "mileageValue": 115657,
    "mileageUnit": "km",
    "fuel": "Газ",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 11290,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
