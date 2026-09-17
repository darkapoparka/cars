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
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11774263732166588-audi-q4-q4-e-tron-45-quattro-digital-termopompa-29000km",
    "image": "/assets/legend-auto/vehicle-01-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q4 Q4 e-tron 45 QUATTRO, DIGITAL, ТЕРМОПОМПА 29000km",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "29 000 км",
    "mileageKm": 29000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 37999,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11784618839120443-seat-leon-2-0tdi",
    "image": "/assets/legend-auto/vehicle-02-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Seat",
    "title": "Seat Leon 2.0TDI",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "200 000 км",
    "mileageKm": 200000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 7999,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-21785269571488349-vw-tiguan-2-0tdi-150-k-s-dsg-122000km-navigatsiya",
    "image": "/assets/legend-auto/vehicle-03-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "VW",
    "title": "VW Tiguan 2.0TDI 150 к.с DSG 122000км НАВИГАЦИЯ",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "122 000 км",
    "mileageKm": 122000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 16999,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11788186558085673-vw-passat-2-0tdi-dsg-navigatsiya-podgrev-na-sedalki",
    "image": "/assets/legend-auto/vehicle-04-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat 2.0TDI DSG НАВИГАЦИЯ .ПОДГРЕВ НА СЕДАЛКИ",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "220 000 км",
    "mileageKm": 220000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 9999,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11788202283254523-vw-golf-1-9tdi-105k-s",
    "image": "/assets/legend-auto/vehicle-05-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Golf 1.9TDI 105к.с",
    "year": "2005",
    "yearNumber": 2005,
    "mileage": "205 000 км",
    "mileageKm": 205000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 3599,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11782331844226239-toyota-yaris-1-5-hibrid-kamera-4l-100km",
    "image": "/assets/legend-auto/vehicle-06-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Toyota",
    "title": "Toyota Yaris 1.5 Хибрид Камера 4л/100км",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "169 000 км",
    "mileageKm": 169000,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 7999,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-21787135215316819-toyota-rav4-2-5-hybrid-gaz-full-navigatsiya-kozhen-salon-full",
    "image": "/assets/legend-auto/vehicle-07-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Toyota",
    "title": "Toyota Rav4 2.5 HYBRID/ГАЗ FULL НАВИГАЦИЯ, КОЖЕН САЛОН, FULL",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "252 000 км",
    "mileageKm": 252000,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 26999,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11786699392982478-toyota-auris-2-0d4d",
    "image": "/assets/legend-auto/vehicle-08-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Toyota",
    "title": "Toyota Auris 2.0D4D",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "229 000 км",
    "mileageKm": 229000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4399,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11787054081251501-skoda-scala-1-6tdi",
    "image": "/assets/legend-auto/vehicle-09-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Skoda",
    "title": "Skoda Scala 1.6TDI",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "180 000 км",
    "mileageKm": 180000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 11999,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11787771672265620-renault-zoe-52kw-78000km-sobstvena-bateriya",
    "image": "/assets/legend-auto/vehicle-10-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Renault",
    "title": "Renault Zoe 52kw 78000km Собствена батерия",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "78 000 км",
    "mileageKm": 78000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 14299,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11777013326319103-renault-clio-1-2-benzin",
    "image": "/assets/legend-auto/vehicle-11-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Renault",
    "title": "Renault Clio 1.2 БЕНЗИН",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "150 000 км",
    "mileageKm": 150000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 5199,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11764232323880460-peugeot-508-2-0hdi",
    "image": "/assets/legend-auto/vehicle-12-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Peugeot",
    "title": "Peugeot 508 2.0HDI",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "232 000 км",
    "mileageKm": 232000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4299,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11786966551654053-opel-astra-1-6",
    "image": "/assets/legend-auto/vehicle-13-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Opel",
    "title": "Opel Astra 1.6",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "193 000 км",
    "mileageKm": 193000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6599,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://legendauto1.mobile.bg/obiava-11725562013563390-opel-agila-1-3i-vnos-ot-italiya",
    "image": "/assets/legend-auto/vehicle-14-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Opel",
    "title": "Opel Agila 1.3i Внос от Италия",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "120 000 км",
    "mileageKm": 120000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2500,
    "href": "/listing-detail-v1/14"
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
