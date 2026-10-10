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
    "evidenceUrl": "https://carpointtrade.mobile.bg/obiava-11791184773376059-vw-arteon-2-0-190-r-line",
    "image": "/assets/vehicles/11791184773376059/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "VW",
    "title": "VW Arteon 2.0* 190* R-Line*",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "60 000 км",
    "mileageKm": 60000,
    "mileageKnown": true,
    "mileageValue": 60000,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 21980,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://carpointtrade.mobile.bg/obiava-11791183074371341-mercedes-benz-gle-450-eq-boost-pano-head-up",
    "image": "/assets/vehicles/11791183074371341/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLE 450 EQ Boost* Pano* Head UP*",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "137 000 км",
    "mileageKm": 137000,
    "mileageKnown": true,
    "mileageValue": 137000,
    "mileageUnit": "km",
    "fuel": "Хибриден",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 47980,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://carpointtrade.mobile.bg/obiava-11790856761277539-toyota-corolla-verso",
    "image": "/assets/vehicles/11790856761277539/1.webp",
    "category": "Ван",
    "body": "Ван",
    "make": "Toyota",
    "title": "Toyota Corolla verso",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "255 000 км",
    "mileageKm": 255000,
    "mileageKnown": true,
    "mileageValue": 255000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 1380,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://carpointtrade.mobile.bg/obiava-21763647718712555-toyota-rav4",
    "image": "/assets/vehicles/21763647718712555/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Toyota",
    "title": "Toyota Rav4",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "239 000 км",
    "mileageKm": 239000,
    "mileageKnown": true,
    "mileageValue": 239000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4998,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://carpointtrade.mobile.bg/obiava-11788508879567241-toyota-auris-2-2-177hp-keyless",
    "image": "/assets/vehicles/11788508879567241/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Toyota",
    "title": "Toyota Auris 2.2* 177HP* KEYLESS*",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "241 000 км",
    "mileageKm": 241000,
    "mileageKnown": true,
    "mileageValue": 241000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4190,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://carpointtrade.mobile.bg/obiava-11772557595522560-skoda-octavia-1-5-150hp",
    "image": "/assets/vehicles/11772557595522560/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Skoda",
    "title": "Skoda Octavia 1.5* 150HP*",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "211 000 км",
    "mileageKm": 211000,
    "mileageKnown": true,
    "mileageValue": 211000,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 15590,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://carpointtrade.mobile.bg/obiava-11788861053896464-skoda-fabia-monte-carlo-pano-distronic",
    "image": "/assets/vehicles/11788861053896464/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Skoda",
    "title": "Skoda Fabia MONTE CARLO* PANO* DISTRONIC*",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "147 000 км",
    "mileageKm": 147000,
    "mileageKnown": true,
    "mileageValue": 147000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 7270,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://carpointtrade.mobile.bg/obiava-11782721870640258-peugeot-307-sw",
    "image": "/assets/vehicles/11782721870640258/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Peugeot",
    "title": "Peugeot 307 SW",
    "year": "2003",
    "yearNumber": 2003,
    "mileage": "210 000 км",
    "mileageKm": 210000,
    "mileageKnown": true,
    "mileageValue": 210000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 1690,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
