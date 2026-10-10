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
    "evidenceUrl": "https://pmselect.mobile.bg/obiava-21783597634982178-infiniti-fx-30-3-0tdi-lizing-barter",
    "image": "/assets/vehicles/21783597634982178/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Infiniti",
    "title": "Infiniti Fx 30 3.0tdi лизинг/бартер",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "230 000 км",
    "mileageKm": 230000,
    "mileageKnown": true,
    "mileageValue": 230000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 10500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://pmselect.mobile.bg/obiava-11788776602444544-mercedes-benz-cls-500-lizing-barter",
    "image": "/assets/vehicles/11788776602444544/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz CLS 500 ЛИЗИНГ/БАРТЕР",
    "year": "2005",
    "yearNumber": 2005,
    "mileage": "312 000 км",
    "mileageKm": 312000,
    "mileageKnown": true,
    "mileageValue": 312000,
    "mileageUnit": "km",
    "fuel": "Газ",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 9500,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://pmselect.mobile.bg/obiava-11778481183815155-mini-cooper-s-all4-hamann-pop-corn-4x4-lizing-2400-parvonachalna",
    "image": "/assets/vehicles/11778481183815155/1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Mini",
    "title": "Mini Cooper s ALL4 HAMANN POP CORN 4X4 лизинг 2400 първоначална",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "180 000 км",
    "mileageKm": 180000,
    "mileageKnown": true,
    "mileageValue": 180000,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 7999,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://pmselect.mobile.bg/obiava-11791448820015715-mercedes-benz-c-300-4-matic-360-amg-line-lizing-s-9800-parvonachalna",
    "image": "/assets/vehicles/11791448820015715/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz C 300 4-MATIC/360/AMG line лизинг с 9800 първоначална",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "85 789 км",
    "mileageKm": 85789,
    "mileageKnown": true,
    "mileageValue": 85789,
    "mileageUnit": "km",
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 31500,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://pmselect.mobile.bg/obiava-21788698028085342-bmw-x6-lizing-top-tsena",
    "image": "/assets/vehicles/21788698028085342/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 ЛИЗИНГ ТОП ЦЕНА",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "126 000 км",
    "mileageKm": 126000,
    "mileageKnown": true,
    "mileageValue": 126000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 19999,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://pmselect.mobile.bg/obiava-21788697561330482-bmw-x6-lizing-s-6800-parvonachalna-full-top-tsena",
    "image": "/assets/vehicles/21788697561330482/1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 Лизинг с 6800 първоначална FULL ТОП ЦЕНА",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "126 000 км",
    "mileageKm": 126000,
    "mileageKnown": true,
    "mileageValue": 126000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 19999,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://pmselect.mobile.bg/obiava-11790688719193230-audi-a6-3-0bitdi-competition-lizing-6000-parvonachalna",
    "image": "/assets/vehicles/11790688719193230/1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A6 3.0BiTDI COMPETITION ЛИЗИНГ 6000 първоначална",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "200 000 км",
    "mileageKm": 200000,
    "mileageKnown": true,
    "mileageValue": 200000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 18500,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "type": "car",
    "verification": "sample",
    "evidenceUrl": "https://pmselect.mobile.bg/obiava-11790684148327126-mercedes-benz-s-350-amg-long-300d-hybrid-9000-parvonachalna-vnoska",
    "image": "/assets/vehicles/11790684148327126/1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 350 AMG LONG 300d HYBRID, 9000 първоначална вноска",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "209 000 км",
    "mileageKm": 209000,
    "mileageKnown": true,
    "mileageValue": 209000,
    "mileageUnit": "km",
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 27999,
    "href": "/listing-detail-v1/8"
  }
];

export const formatVehiclePrice = (
  amount: number,
  locale: Locale = localeContract.defaultLocale
) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');
