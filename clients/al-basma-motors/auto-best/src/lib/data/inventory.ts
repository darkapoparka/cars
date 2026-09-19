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
    "evidenceUrl": "https://albasmamotors.com/car/cmtl6wllu000up1mcmlq0al57",
    "image": "/dealer/stock/cmtl6wllu000up1mcmlq0al57/1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Lexus",
    "title": "Lexus CT200h Platinum",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "168,000 км",
    "mileageKm": 168000,
    "fuel": "Hybrid",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 64000,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://albasmamotors.com/car/cmtl6pxpd000qp1mcvd0b9ktz",
    "image": "/dealer/stock/cmtl6pxpd000qp1mcvd0b9ktz/1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Lexus",
    "title": "Lexus IS300 Platinum",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "40,000 км",
    "mileageKm": 40000,
    "fuel": "Petrol",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 105000,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://albasmamotors.com/car/cmqev42oy00i8p13h9qatx95x",
    "image": "/dealer/stock/cmqev42oy00i8p13h9qatx95x/1.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Lexus",
    "title": "Lexus RC-F",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "140,000 км",
    "mileageKm": 140000,
    "fuel": "Petrol",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 150000,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://albasmamotors.com/car/cmtfwz86o011dp1we5d9fkdvp",
    "image": "/dealer/stock/cmtfwz86o011dp1we5d9fkdvp/1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Lexus",
    "title": "Lexus IS350 F-Sport",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "151,000 км",
    "mileageKm": 151000,
    "fuel": "Petrol",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 140000,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://albasmamotors.com/car/cmte58re000ykp1we0fkcsw8e",
    "image": "/dealer/stock/cmte58re000ykp1we0fkcsw8e/1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Lexus",
    "title": "Lexus GS250 Platinum",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "52,000 км",
    "mileageKm": 52000,
    "fuel": "Petrol",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 65000,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://albasmamotors.com/car/cmtb7oa3k00rsp1weiw6cwm9m",
    "image": "/dealer/stock/cmtb7oa3k00rsp1weiw6cwm9m/1.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Lexus",
    "title": "Lexus RC350 F-Sport",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "120,000 км",
    "mileageKm": 120000,
    "fuel": "Petrol",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 80000,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://albasmamotors.com/car/cmt6yyshu00ljp1wewaxpucal",
    "image": "/dealer/stock/cmt6yyshu00ljp1wewaxpucal/1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Lexus",
    "title": "Lexus ES350 F-Sport",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "77,000 км",
    "mileageKm": 77000,
    "fuel": "Petrol",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 145000,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://albasmamotors.com/car/cmt4d2ajl00gsp1wehldp9v1e",
    "image": "/dealer/stock/cmt4d2ajl00gsp1wehldp9v1e/1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Lexus",
    "title": "Lexus LX570 Signature",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "228,000 км",
    "mileageKm": 228000,
    "fuel": "Petrol",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 175000,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://albasmamotors.com/car/cmt4czt2400gqp1weg7ck3qba",
    "image": "/dealer/stock/cmt4czt2400gqp1weg7ck3qba/1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Lexus",
    "title": "Lexus TX350 Platinum",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "53,000 км",
    "mileageKm": 53000,
    "fuel": "Petrol",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 185000,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://albasmamotors.com/car/cms38d0r90058p1a10q2alud6",
    "image": "/dealer/stock/cms38d0r90058p1a10q2alud6/1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Lexus",
    "title": "Lexus RX350 Premier",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "12,000 км",
    "mileageKm": 12000,
    "fuel": "Petrol",
    "transmission": "Not published",
    "equipment": [],
    "condition": "used",
    "priceEur": 165000,
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
