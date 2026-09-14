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
    "evidenceUrl": "https://navara.mobile.bg/obiava-11786363468065195-nissan-micra-1-0-n-sport",
    "image": "/navara/vehicles/11786363468065195-1.webp",
    "category": "Хечбек",
    "body": "hatchback",
    "make": "Nissan",
    "title": "Nissan Micra 1.0 N-Sport",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "63 800 км",
    "mileageKm": 63800,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 10500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://navara.mobile.bg/obiava-11782409246983224-vw-polo-1-6-tdi",
    "image": "/navara/vehicles/11782409246983224-1.webp",
    "category": "Хечбек",
    "body": "hatchback",
    "make": "Volkswagen",
    "title": "VW Polo 1.6 TDI",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "125 902 км",
    "mileageKm": 125902,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 10000,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://navara.mobile.bg/obiava-11787311216769974-tesla-model-3-peformance-dual-motor",
    "image": "/navara/vehicles/11787311216769974-1.webp",
    "category": "Седан",
    "body": "sedan",
    "make": "Tesla",
    "title": "Tesla Model 3 Performance Dual Motor",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "63 900 км",
    "mileageKm": 63900,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 32999,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://navara.mobile.bg/obiava-21780735125049477-nissan-qashqai-2-0i-4x4-automatic-sv-awd",
    "image": "/navara/vehicles/21780735125049477-1.webp",
    "category": "SUV",
    "body": "suv",
    "make": "Nissan",
    "title": "Nissan Qashqai 2.0i SV AWD",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "57 000 км",
    "mileageKm": 57000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 18499,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://navara.mobile.bg/obiava-11787212062225914-peugeot-2008-e-2008-allure",
    "image": "/navara/vehicles/11787212062225914-1.webp",
    "category": "SUV",
    "body": "suv",
    "make": "Peugeot",
    "title": "Peugeot e-2008 Allure",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "59 079 км",
    "mileageKm": 59079,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 19999,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://navara.mobile.bg/obiava-21774534756506554-opel-mokka-1-4-i-gaz-benzin",
    "image": "/navara/vehicles/21774534756506554-1.webp",
    "category": "SUV",
    "body": "suv",
    "make": "Opel",
    "title": "Opel Mokka 1.4i Газ/Бензин",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "182 000 км",
    "mileageKm": 182000,
    "fuel": "Бензин / LPG",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6999,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://navara.mobile.bg/obiava-11784982235652112-audi-a4-1-8-i-quattro",
    "image": "/navara/vehicles/11784982235652112-1.webp",
    "category": "Комби",
    "body": "wagon",
    "make": "Audi",
    "title": "Audi A4 1.8i quattro",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "212 000 км",
    "mileageKm": 212000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6999,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://navara.mobile.bg/obiava-11772183782578045-mercedes-benz-b-250-b250-e",
    "image": "/navara/vehicles/11772183782578045-1.webp",
    "category": "Хечбек",
    "body": "hatchback",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz B 250 e",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "106 000 км",
    "mileageKm": 106000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 9999,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://navara.mobile.bg/obiava-11780755712824361-smart-fortwo-1-0i",
    "image": "/navara/vehicles/11780755712824361-1.webp",
    "category": "Хечбек",
    "body": "hatchback",
    "make": "Smart",
    "title": "Smart Fortwo 1.0i",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "66 121 км",
    "mileageKm": 66121,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Панорамен покрив"
    ],
    "condition": "used",
    "priceEur": 4500,
    "href": "/listing-detail-v1/9"
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
