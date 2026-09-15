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
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11786049135297264-rolls-royce-ghost",
    "image": "/assets/ivo-auto/vehicle-01-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Rolls-Royce",
    "title": "Rolls-Royce Ghost",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "66 000 км",
    "mileageKm": 66000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 105000,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11784822971964926-audi-a4-s-line-4x4-2-0t",
    "image": "/assets/ivo-auto/vehicle-02-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A4 S-line 4x4 2.0T",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "195 000 км",
    "mileageKm": 195000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 2800,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11775231551222536-porsche-panamera-turbo-4-8i",
    "image": "/assets/ivo-auto/vehicle-03-1.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Porsche",
    "title": "Porsche Panamera Turbo 4.8i",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "145 000 км",
    "mileageKm": 145000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 21000,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-21784804233950248-dodge-durango-3-6-face-lift-gaz-inzh-6-1",
    "image": "/assets/ivo-auto/vehicle-04-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Dodge",
    "title": "Dodge Durango 3.6 Face Lift Газ.Инж. 6+ 1",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "202 000 км",
    "mileageKm": 202000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 13900,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11784710943679925-bmw-520-m-paket-digital",
    "image": "/assets/ivo-auto/vehicle-05-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 520 M-пакет Digital",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "165 000 км",
    "mileageKm": 165000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 19000,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11780924566736048-vw-touran-1-6tdi-avtomat-6-1",
    "image": "/assets/ivo-auto/vehicle-06-1.webp",
    "category": "Minivan",
    "body": "Minivan",
    "make": "VW",
    "title": "VW Touran 1.6TDI Автомат 6+ 1",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "210 000 км",
    "mileageKm": 210000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 3999,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11778070752693531-vw-cc-2-0i",
    "image": "/assets/ivo-auto/vehicle-07-1.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "VW",
    "title": "VW CC 2.0i",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "214 000 км",
    "mileageKm": 214000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 9000,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-21779453321117197-bmw-x5-4-0d-face-lift-8sk",
    "image": "/assets/ivo-auto/vehicle-08-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X5 4.0D Face Lift 8ск.",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "196 000 км",
    "mileageKm": 196000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 9500,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-21779444147151936-bmw-x5-3-0d-face-lift",
    "image": "/assets/ivo-auto/vehicle-09-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X5 3.0D Face Lift",
    "year": "2005",
    "yearNumber": 2005,
    "mileage": "195 000 км",
    "mileageKm": 195000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 4600,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11780659371731573-bmw-418-d-m-paket",
    "image": "/assets/ivo-auto/vehicle-10-1.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "BMW",
    "title": "BMW 418 D M-Пакет",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "149 000 км",
    "mileageKm": 149000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 16200,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-21781871293573646-subaru-b9-tribeca-3-0-gaz-inzh",
    "image": "/assets/ivo-auto/vehicle-11-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Subaru",
    "title": "Subaru B9 tribeca 3.0 Газ.Инж.",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "170 000 км",
    "mileageKm": 170000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 3999,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-21762959348847465-mercedes-benz-ml-250-amg-paket",
    "image": "/assets/ivo-auto/vehicle-12-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz ML 250 AMG-Пакет",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "130 000 км",
    "mileageKm": 130000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 14500,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11774893593485843-mercedes-benz-s-500-4matic-gaz-inzh",
    "image": "/assets/ivo-auto/vehicle-13-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 500 4Matic Газ.Инж",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "290 000 км",
    "mileageKm": 290000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 10000,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11756369185395904-bmw-730-d-m-paket",
    "image": "/assets/ivo-auto/vehicle-14-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 730 D M-Пакет",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "214 000 км",
    "mileageKm": 214000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 11000,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11775822194120541-bmw-m5",
    "image": "/assets/ivo-auto/vehicle-15-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW M5",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "218 000 км",
    "mileageKm": 218000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 30000,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "verification": "verified",
    "evidenceUrl": "https://ivoauto-varna.mobile.bg/obiava-11769186790854071-audi-a8-full-led",
    "image": "/assets/ivo-auto/vehicle-16-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A8 Full Led",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "215 000 км",
    "mileageKm": 215000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 15500,
    "href": "/listing-detail-v1/16"
  }
];

const inventoryLocale = "bg-BG";
const inventoryCurrency = "EUR";
export const formatVehiclePrice = (amount: number) =>
  new Intl.NumberFormat(inventoryLocale, {
    style: 'currency',
    currency: inventoryCurrency,
    maximumFractionDigits: 0
  }).format(amount);
