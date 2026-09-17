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
    "evidenceUrl": "https://team-auto.mobile.bg/obiava-11783754278742708-toyota-yaris-1-33i-116000km-6-speed-swiss-edition",
    "image": "/dealer/11783754278742708-1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Toyota",
    "title": "Toyota Yaris 1.33I 116000KM 6-SPEED SWISS EDITION",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "116 000 км",
    "mileageKm": 116000,
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 7500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://team-auto.mobile.bg/obiava-21785829117309786-nissan-qashqai-2-0i-131000km-automatic",
    "image": "/dealer/21785829117309786-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Nissan",
    "title": "Nissan Qashqai 2.0i 131000KM AUTOMATIC",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "131 000 км",
    "mileageKm": 131000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4"
    ],
    "condition": "used",
    "priceEur": 7700,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://team-auto.mobile.bg/obiava-11678716951277480-mitsubishi-colt-1-5-i-swiss",
    "image": "/dealer/11678716951277480-1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Mitsubishi",
    "title": "Mitsubishi Colt 1.5 I SWISS",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "189 000 км",
    "mileageKm": 189000,
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2700,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://team-auto.mobile.bg/obiava-11773570472954394-mini-cooper-1-6i-153000km-euro-5-75ps",
    "image": "/dealer/11773570472954394-1.webp",
    "category": "Купе",
    "body": "Coupe",
    "make": "Mini",
    "title": "Mini Cooper 1.6i 153000km EURO-5 75PS.",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "153 000 км",
    "mileageKm": 153000,
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4950,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://team-auto.mobile.bg/obiava-11780222156478967-honda-jazz-1-4-si-automatic-sport-edition",
    "image": "/dealer/11780222156478967-1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Honda",
    "title": "Honda Jazz 1.4-SI AUTOMATIC SPORT EDITION",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "145 000 км",
    "mileageKm": 145000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 7950,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://team-auto.mobile.bg/obiava-21788253346975689-honda-cr-v-2-2-i-ctdi-177000km-executiv",
    "image": "/dealer/21788253346975689-1.webp",
    "category": "Джип",
    "body": "SUV",
    "make": "Honda",
    "title": "Honda Cr-v 2.2 I-CTDI 177000KM EXECUTIV",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "177 000 км",
    "mileageKm": 177000,
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 7500,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://team-auto.mobile.bg/obiava-11782979504874945-vw-golf-vi-tdi-swiss-edition-6-speed-4x4",
    "image": "/dealer/11782979504874945-1.webp",
    "category": "Комби",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Golf VI-TDI SWISS EDITION 6-SPEED 4X4",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "197 000 км",
    "mileageKm": 197000,
    "fuel": "Дизелов",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 5999,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://team-auto.mobile.bg/obiava-11778753257201470-toyota-auris-1-8-hsd-181000km-euro5",
    "image": "/dealer/11778753257201470-1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Toyota",
    "title": "Toyota Auris 1.8 HSD 181000KM EURO5",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "181 000 км",
    "mileageKm": 181000,
    "fuel": "Хибриден",
    "transmission": "Автоматична",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 7500,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://team-auto.mobile.bg/obiava-11777536762184091-suzuki-swift-1-3i-151000km-swiss-edition",
    "image": "/dealer/11777536762184091-1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Suzuki",
    "title": "Suzuki Swift 1.3i 151000km. SWISS EDITION",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "151 000 км",
    "mileageKm": 151000,
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4500,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://team-auto.mobile.bg/obiava-11701247770704576-subaru-impreza-2-0i-swiss-edition",
    "image": "/dealer/11701247770704576-1.webp",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Subaru",
    "title": "Subaru Impreza 2.0i SWISS EDITION",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "207 000 км",
    "mileageKm": 207000,
    "fuel": "Бензинов",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 3300,
    "href": "/listing-detail-v1/10"
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
