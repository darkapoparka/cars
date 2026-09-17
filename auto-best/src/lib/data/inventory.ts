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
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11784527405061757-vw-golf-1-4-benzin",
    "image": "/assets/priselci/vehicle-01-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Golf 1.4 БЕНЗИН",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "235 193 км",
    "mileageKm": 235193,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3600,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11758270885113337-vw-passat-1-4-benzin",
    "image": "/assets/priselci/vehicle-02-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat 1.4 БЕНЗИН",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "179 848 км",
    "mileageKm": 179848,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 4299,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11753962633467246-vw-passat-2-0tdi-commonrail",
    "image": "/assets/priselci/vehicle-03-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat 2.0TDI COMMONRAIL",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "210 534 км",
    "mileageKm": 210534,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 3900,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11784527857493559-seat-ibiza-1-2-benzin",
    "image": "/assets/priselci/vehicle-04-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Seat",
    "title": "Seat Ibiza 1.2 БЕНЗИН",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "175 532 км",
    "mileageKm": 175532,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3499,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-21754395406651747-renault-koleos-2-0-dizel-4h4",
    "image": "/assets/priselci/vehicle-05-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Renault",
    "title": "Renault Koleos 2.0 ДИЗЕЛ 4Х4",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "181 246 км",
    "mileageKm": 181246,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 44299,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11781856640282742-peugeot-307-cc-kabrio",
    "image": "/assets/priselci/vehicle-06-1.webp",
    "category": "Convertible",
    "body": "Convertible",
    "make": "Peugeot",
    "title": "Peugeot 307 CC КАБРИО",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "205 664 км",
    "mileageKm": 205664,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 2899,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11759747090481666-ford-mondeo-2-0-dizel",
    "image": "/assets/priselci/vehicle-07-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Ford",
    "title": "Ford Mondeo 2.0 DIZEL",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "235 788 км",
    "mileageKm": 235788,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3299,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11776863022154449-peugeot-5008-2-0hdi-150k-s",
    "image": "/assets/priselci/vehicle-08-1.webp",
    "category": "Minivan",
    "body": "Minivan",
    "make": "Peugeot",
    "title": "Peugeot 5008 2.0HDI 150К.С",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "210 452 км",
    "mileageKm": 210452,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 5099,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11751891575433302-mercedes-benz-c-200-2-2-cdi",
    "image": "/assets/priselci/vehicle-09-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz C 200 2.2 CDI",
    "year": "2004",
    "yearNumber": 2004,
    "mileage": "218 432 км",
    "mileageKm": 218432,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 2799,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11787126157294169-citroen-c3-picasso-1-6hdi-90k-s",
    "image": "/assets/priselci/vehicle-10-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Citroen",
    "title": "Citroen C3 Picasso 1.6HDI 90К.С",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "185 783 км",
    "mileageKm": 185783,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3499,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11784638939574277-audi-a3-1-9-tdi-105ps",
    "image": "/assets/priselci/vehicle-11-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A3 1.9 TDI 105ps",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "253 746 км",
    "mileageKm": 253746,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Панорамен покрив"
    ],
    "condition": "used",
    "priceEur": 4699,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11779190417819998-dacia-sandero-1-4-benzin-gaz",
    "image": "/assets/priselci/vehicle-12-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Dacia",
    "title": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "136 016 км",
    "mileageKm": 136016,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2500,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11770812815337634-renault-grand-scenic-1-5dci",
    "image": "/assets/priselci/vehicle-13-1.webp",
    "category": "Minivan",
    "body": "Minivan",
    "make": "Renault",
    "title": "Renault Grand scenic 1.5DCI",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "199 811 км",
    "mileageKm": 199811,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4299,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-21786691566300206-bmw-x3-2-0-dizel-4h4",
    "image": "/assets/priselci/vehicle-14-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X3 2.0 ДИЗЕЛ 4Х4",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "207 195 км",
    "mileageKm": 207195,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 44399,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-21787900875118991-nissan-qashqai-1-5-dci",
    "image": "/assets/priselci/vehicle-15-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Nissan",
    "title": "Nissan Qashqai 1.5 DCI",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "192 641 км",
    "mileageKm": 192641,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 5499,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "verification": "verified",
    "evidenceUrl": "https://priselci.mobile.bg/obiava-11763969547989753-mercedes-benz-e-280-3-0cdi-v6",
    "image": "/assets/priselci/vehicle-16-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 280 3.0CDI V6",
    "year": "2005",
    "yearNumber": 2005,
    "mileage": "208 357 км",
    "mileageKm": 208357,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 64100,
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
