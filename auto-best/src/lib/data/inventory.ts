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
    "evidenceUrl": "https://www.isauto.net/avtomobili-i-djipove/audi-r8-perfomance-v10-bang-olufsen-audi-keramik-carbon-10",
    "image": "/dealer/inventory-1.webp",
    "category": "Купе",
    "body": "Coupe",
    "make": "Audi",
    "title": "Audi R8 Performance V10",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "75 000 км",
    "mileageKm": 75000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 148224,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://www.isauto.net/avtomobili-i-djipove/audi-q7-50tdi-virtual-podgrev-4-zoni-kamera360-9",
    "image": "/dealer/inventory-2.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q7 50 TDI",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "57 500 км",
    "mileageKm": 57500,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 67439,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://www.isauto.net/avtomobili-i-djipove/bmw-m5-keramika-xdrive-m-sport-bowers-wilk-adaptiveled-8",
    "image": "/dealer/inventory-3.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW M5",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "61 000 км",
    "mileageKm": 61000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 71530,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://www.isauto.net/avtomobili-i-djipove/bmw-x5-xdrive-sport-podgrev-panorama-6-1-7",
    "image": "/dealer/inventory-4.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X5 xDrive",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "196 000 км",
    "mileageKm": 196000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 24491,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://www.isauto.net/avtomobili-i-djipove/bmw-750-m-perfomance-laser-alkantar-virtual-harman-kardon-3",
    "image": "/dealer/inventory-5.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 750 M Performance",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "167 000 км",
    "mileageKm": 167000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 61304,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://www.isauto.net/avtomobili-i-djipove/audi-a5-sportback-2-0tdi-sline-ambient-virtual-podgrev-pdc-f1-745",
    "image": "/dealer/inventory-6.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A5 Sportback 2.0 TDI",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "175 000 км",
    "mileageKm": 175000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 19900,
    "href": "/listing-detail-v1/6"
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
