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
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/1.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Koenigsegg",
    "title": "Koenigsegg Jesko Attack 2023",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "0 км",
    "mileageKm": 0,
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "new",
    "priceEur": 21000000,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/2.svg",
    "category": "Convertible",
    "body": "Convertible",
    "make": "Bugatti",
    "title": "Bugatti W16 Mistral 2025",
    "year": "2025",
    "yearNumber": 2025,
    "mileage": "0 км",
    "mileageKm": 0,
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "new",
    "priceEur": 34000000,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/3.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Ford",
    "title": "Ford GT 2017",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "5,669 км",
    "mileageKm": 5669,
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 2599995,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/4.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Porsche",
    "title": "Porsche Carrera GT 2006",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "13,000 км",
    "mileageKm": 13000,
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 11000000,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/5.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Ford",
    "title": "Ford GT 2020",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "3,250 км",
    "mileageKm": 3250,
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 2899995,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/6.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Ferrari",
    "title": "Ferrari SF90XX Stradale 2024",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "0 км",
    "mileageKm": 0,
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "new",
    "priceEur": 5400000,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/7.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Pininfarina",
    "title": "Pininfarina Battista Furiosa Package 2024",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "10,200 км",
    "mileageKm": 10200,
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 11000000,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/8.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Aston Martin",
    "title": "Aston Martin Valhalla 2026",
    "year": "2026",
    "yearNumber": 2026,
    "mileage": "692 км",
    "mileageKm": 692,
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 5500000,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/9.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Bugatti",
    "title": "Bugatti Chiron Sport Noire 2021",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "2,550 км",
    "mileageKm": 2550,
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "used",
    "priceEur": 15500000,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://f1rstmotors.com/cars/available",
    "image": "/dealer/stock/10.svg",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Porsche",
    "title": "Porsche 911 S/T 2024",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "0 км",
    "mileageKm": 0,
    "fuel": "Not published in source summary",
    "transmission": "Not published in source summary",
    "equipment": [],
    "condition": "new",
    "priceEur": 1779995,
    "href": "/listing-detail-v1/10"
  }
];

const inventoryLocale = "en-AE";
const inventoryCurrency = "AED";
export const formatVehiclePrice = (amount: number) =>
  new Intl.NumberFormat(inventoryLocale, {
    style: 'currency',
    currency: inventoryCurrency,
    maximumFractionDigits: 0
  }).format(amount);
