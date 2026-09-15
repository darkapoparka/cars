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
    "evidenceUrl": "https://automarket.mobile.bg/obiava-11785576029711434-ford-focus-1-6d-115hp",
    "image": "/assets/automarket/vehicle-01-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Ford",
    "title": "Ford Focus 1.6D 115HP",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "249 000 км",
    "mileageKm": 249000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 5112,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-11714813323555032-opel-astra-1-4i-90hp",
    "image": "/assets/automarket/vehicle-02-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Opel",
    "title": "Opel Astra 1.4i 90HP",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "208 000 км",
    "mileageKm": 208000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2555.95,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-11776340911802527-opel-corsa-1-2i-80hp-gpl",
    "image": "/assets/automarket/vehicle-03-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Opel",
    "title": "Opel Corsa 1.2i 80HP GPL",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "165 000 км",
    "mileageKm": 165000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 2999,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-11749035353735625-ford-fiesta-1-25i-82hp-face-lift",
    "image": "/assets/automarket/vehicle-04-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Ford",
    "title": "Ford Fiesta 1.25i 82HP FACE LIFT",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "227 000 км",
    "mileageKm": 227000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 3799,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-11646385836417474-honda-jazz-1-4-i-vtec-99hp-face-lift",
    "image": "/assets/automarket/vehicle-05-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Honda",
    "title": "Honda Jazz 1.4 I-VTEC 99HP FACE LIFT",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "197 000 км",
    "mileageKm": 197000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3885.31,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-11730904111658789-opel-meriva-1-4-turbo-120hp-gpl",
    "image": "/assets/automarket/vehicle-06-1.webp",
    "category": "Minivan",
    "body": "Minivan",
    "make": "Opel",
    "title": "Opel Meriva 1.4 TURBO 120HP GPL",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "156 000 км",
    "mileageKm": 156000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4499,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-11664339654646848-vw-golf-1-6tdi-105hp-dsg",
    "image": "/assets/automarket/vehicle-07-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Golf 1.6TDI 105HP DSG",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "213 000 км",
    "mileageKm": 213000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4999,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-21702843989932817-nissan-qashqai-1-6i-117hp-face-lift",
    "image": "/assets/automarket/vehicle-08-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Nissan",
    "title": "Nissan Qashqai 1.6i 117HP FACE LIFT",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "223 000 км",
    "mileageKm": 223000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 5799,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-21777122320477562-dacia-duster-1-5dci-110hp-awd-e5a",
    "image": "/assets/automarket/vehicle-09-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Dacia",
    "title": "Dacia Duster 1.5DCI 110HP AWD E5A",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "232 000 км",
    "mileageKm": 232000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 5799,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-21777123440688076-mazda-cx-3-1-5d-skyactiv-105hp-awd-auto",
    "image": "/assets/automarket/vehicle-10-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mazda",
    "title": "Mazda CX-3 1.5D SKYACTIV 105HP AWD AUTO",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "155 000 км",
    "mileageKm": 155000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 9999,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-11764611602990623-vw-passat-2-0tdi-190hp-4-motion-keyless-go-automatic",
    "image": "/assets/automarket/vehicle-11-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "207 000 км",
    "mileageKm": 207000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 12399,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-11770373711900410-suzuki-swift-1-2-hybrid-83hp-automatic",
    "image": "/assets/automarket/vehicle-12-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Suzuki",
    "title": "Suzuki Swift 1.2 HYBRID 83HP AUTOMATIC",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "39 000 км",
    "mileageKm": 39000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 12781,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-21732197261233954-bmw-x3-2-0-x-drive-184hp",
    "image": "/assets/automarket/vehicle-13-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X3 2.0 X-Drive 184HP",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "249 000 км",
    "mileageKm": 249000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 12526,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-21781689983828599-vw-tiguan-2-0tdi-200hp-allspace-4-motion",
    "image": "/assets/automarket/vehicle-14-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "VW",
    "title": "VW Tiguan 2.0TDI 200HP ALLSPACE 4-Motion",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "147 000 км",
    "mileageKm": 147000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 24999,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-21784142258144582-mercedes-benz-glc-2-2cdi-170hp-4-matic-autonatic-navi",
    "image": "/assets/automarket/vehicle-15-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLC 2.2CDI 170HP 4-Matic Autonatic Navi",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "165 000 км",
    "mileageKm": 165000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 21999,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "verification": "verified",
    "evidenceUrl": "https://automarket.mobile.bg/obiava-11750340593495216-audi-a4-allroad-3-0tdi-272hp-automatic-quattro-digital",
    "image": "/assets/automarket/vehicle-16-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "218 000 км",
    "mileageKm": 218000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 15999,
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
