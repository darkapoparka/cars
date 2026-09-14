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
    "evidenceUrl": "https://outletcarsvarna.mobile.bg/obiava-21780566866553359-audi-q5-mild-hybrid-s-line-quattro-1-godina-garantsiya",
    "image": "/dealer/inventory/21780566866553359-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q5 Mild Hybrid/S-line/quattro 1 ГОДИНА ГАРАНЦИЯ",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "80 037 км",
    "mileageKm": 80037,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 39500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://outletcarsvarna.mobile.bg/obiava-11780668057655036-citroen-c3-1-2-100hp-garantsiya-do-03-2027g",
    "image": "/dealer/inventory/11780668057655036-1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Citroen",
    "title": "Citroen C3 1.2 100hp ГАРАНЦИЯ ДО 03. 2027г.",
    "year": "2025",
    "yearNumber": 2025,
    "mileage": "34 393 км",
    "mileageKm": 34393,
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 15950,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://outletcarsvarna.mobile.bg/obiava-11778766828983143-opel-corsa-edition",
    "image": "/dealer/inventory/11778766828983143-1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Opel",
    "title": "Opel Corsa Edition",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "73 085 км",
    "mileageKm": 73085,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 14390,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://outletcarsvarna.mobile.bg/obiava-21779776692067869-vw-tiguan-1-5tsi-150hp-garantsiya-do-04-2028",
    "image": "/dealer/inventory/21779776692067869-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "VW",
    "title": "VW Tiguan 1.5TSI 150hp Гаранция до 04.2028",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "97 608 км",
    "mileageKm": 97608,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 23900,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://outletcarsvarna.mobile.bg/obiava-11782296205813235-vw-arteon-r-line-garantsiya-do-04-2028",
    "image": "/dealer/inventory/11782296205813235-1.webp",
    "category": "Седан",
    "body": "Sedan",
    "make": "VW",
    "title": "VW Arteon R-LINE Гаранция до 04.2028",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "115 387 км",
    "mileageKm": 115387,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 23500,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://outletcarsvarna.mobile.bg/obiava-11782392995192464-peugeot-2008-gt",
    "image": "/dealer/inventory/11782392995192464-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Peugeot",
    "title": "Peugeot 2008 GT",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "75 424 км",
    "mileageKm": 75424,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "360° камера",
      "Подгряване на седалки",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 21200,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://outletcarsvarna.mobile.bg/obiava-21786715209008072-audi-q7-4-2-tdi-v8-340-k-s-800-nm-feyslift",
    "image": "/dealer/inventory/21786715209008072-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q7  4.2 TDI V8 (340 к. с. / 800 Nm) | Фейслифт",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "315 000 км",
    "mileageKm": 315000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 11500,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://outletcarsvarna.mobile.bg/obiava-11785245019997658-vw-arteon-r-line",
    "image": "/dealer/inventory/11785245019997658-1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Arteon R-LINE",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "89 543 км",
    "mileageKm": 89543,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 24500,
    "href": "/listing-detail-v1/8"
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
