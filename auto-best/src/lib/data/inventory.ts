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
    "evidenceUrl": "https://perfektauto.mobile.bg/obiava-21788859055085650-mercedes-benz-ml-320-cdi",
    "image": "/assets/perfect-auto/vehicle-01-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz ML 320 CDI",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "249 000 км",
    "mileageKm": 249000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 6900,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://perfektauto.mobile.bg/obiava-21788174780697334-mercedes-benz-g-350-4-matic-facelift-bluetec-full-eks-shibedah",
    "image": "/assets/perfect-auto/vehicle-02-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz G 350 4 MATIC FACELIFT BLUETEC * FULL ЕКС * Шибедах *",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "151 000 км",
    "mileageKm": 151000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 59900,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://perfektauto.mobile.bg/obiava-21788174574608668-audi-q7-50-tdi-facelift-quattro-s-line-maxton-full-rs",
    "image": "/assets/perfect-auto/vehicle-03-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q7 50 TDI FACELIFT QUATTRO* S LINE* MAXTON* FULL* RS",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "136 000 км",
    "mileageKm": 136000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Панорамен покрив",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 44900,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://perfektauto.mobile.bg/obiava-21787209952978104-lexus-nx-450-chisto-nov-full-ekstri-mark-lev-pano-head-u",
    "image": "/assets/perfect-auto/vehicle-04-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Lexus",
    "title": "Lexus NX 450 ЧИСТО НОВ * FULL Екстри * MARK LEV * ПАНО * HEAD U",
    "year": "2026",
    "yearNumber": 2026,
    "mileage": "0 км",
    "mileageKm": 0,
    "fuel": "Plug-in хибрид",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Панорамен покрив",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 55900,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://perfektauto.mobile.bg/obiava-21787209746596224-bmw-x6-30d-xdrive-swarovski-m-packet-maxton",
    "image": "/assets/perfect-auto/vehicle-05-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 30d xDrive * SWAROVSKI * M PACKET * MAXTON *",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "138 000 км",
    "mileageKm": 138000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 48900,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://perfektauto.mobile.bg/obiava-11786890129374054-ford-mustang-kamera",
    "image": "/assets/perfect-auto/vehicle-06-1.webp",
    "category": "Купе",
    "body": "Coupe",
    "make": "Ford",
    "title": "Ford Mustang * КАМЕРА *",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "48 000 км",
    "mileageKm": 48000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
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
