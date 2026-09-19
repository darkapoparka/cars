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
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11747499643415236-mini-cooper-1-6d-euro4",
    "image": "/assets/astracar/vehicle-01-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Mini",
    "title": "Mini Cooper 1.6D EURO4",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "143 100 км",
    "mileageKm": 143100,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4000,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-21755975324167565-renault-captur-0-9t-euro6b",
    "image": "/assets/astracar/vehicle-02-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Renault",
    "title": "Renault Captur 0.9T EURO6B",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "127 663 км",
    "mileageKm": 127663,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 9500,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11737822623289964-bmw-535-xdrive-full-eu5b",
    "image": "/assets/astracar/vehicle-03-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 535 xDrive FULL EU5B",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "177 390 км",
    "mileageKm": 177390,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 14600,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11763446260159317-audi-a3-2-0tdi-s-line-quattro",
    "image": "/assets/astracar/vehicle-04-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A3 2.0TDI S-LINE QUATTRO",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "181 000 км",
    "mileageKm": 181000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4000,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11752951085157214-audi-a5-2-0tfsi-euro5b",
    "image": "/assets/astracar/vehicle-05-1.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Audi",
    "title": "Audi A5 2.0TFSI EURO5B",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "165 170 км",
    "mileageKm": 165170,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 7900,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11762018600091690-fiat-punto-1-4i-evo-euro4",
    "image": "/assets/astracar/vehicle-06-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Fiat",
    "title": "Fiat Punto 1.4i EVO EURO4",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "139 800 км",
    "mileageKm": 139800,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 3900,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11755359473275644-audi-a3-1-6tdi-eu5b-sportbag",
    "image": "/assets/astracar/vehicle-07-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A3 1.6TDI EU5B SPORTBAG",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "162 148 км",
    "mileageKm": 162148,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 8900,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11766248164423161-mini-cooper-1-6d-euro5",
    "image": "/assets/astracar/vehicle-08-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Mini",
    "title": "Mini Cooper 1.6D EURO5",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "150 052 км",
    "mileageKm": 150052,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4200,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11780761931333448-audi-a6-2-0tdi-euro5b",
    "image": "/assets/astracar/vehicle-09-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A6 2.0TDI EURO5B",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "159 400 км",
    "mileageKm": 159400,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "360° камера",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 8999,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-21780733368439452-bmw-x7-3-0d-xdrive-eu6d",
    "image": "/assets/astracar/vehicle-10-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X7 3.0d xDrive EU6D",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "190 000 км",
    "mileageKm": 190000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 49000,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11773504878088103-citroen-c3-1-2i-euro5b",
    "image": "/assets/astracar/vehicle-11-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Citroen",
    "title": "Citroen C3 1.2i EURO5B",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "136 574 км",
    "mileageKm": 136574,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4600,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-21783183116609383-hyundai-ix35-1-6gdi-euro5",
    "image": "/assets/astracar/vehicle-12-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai IX35 1.6GDI EURO5",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "56 178 км",
    "mileageKm": 56178,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 7999,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-21783791992541606-mercedes-benz-ml-350-3-0cdi-premium-eu6",
    "image": "/assets/astracar/vehicle-13-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz ML 350 3.0CDI PREMIUM EU6",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "182 887 км",
    "mileageKm": 182887,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 9500,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11782577422662538-peugeot-2008-1-2-puretech-eu6d",
    "image": "/assets/astracar/vehicle-14-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Peugeot",
    "title": "Peugeot 2008 1.2 PureTech EU6D",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "36 216 км",
    "mileageKm": 36216,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "360° камера",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 14000,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://astracar.mobile.bg/obiava-11782575631736534-citroen-jumpy-1-6hdi-l2h1eu6b",
    "image": "/assets/astracar/vehicle-15-1.webp",
    "category": "Minivan",
    "body": "Minivan",
    "make": "Citroen",
    "title": "Citroen Jumpy 1.6HDI L2H1EU6B",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "186 586 км",
    "mileageKm": 186586,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 8500,
    "href": "/listing-detail-v1/15"
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
