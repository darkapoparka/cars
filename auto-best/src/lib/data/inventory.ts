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
    "evidenceUrl": "https://autolife.mobile.bg/obiava-21769682585171886-bmw-x4-2-0d-190-m-packet-full-mcar-varna",
    "image": "/assets/autolife/vehicle-01-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X4 2.0D-190",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "190 000 км",
    "mileageKm": 190000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 20500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11770980926901387-seat-alhambra-2-0tdi-150-koja-navi-camera-panorama-dsg-distr-el",
    "image": "/assets/autolife/vehicle-02-1.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "Seat",
    "title": "Seat Alhambra 2.0TDI-150",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "244 000 км",
    "mileageKm": 244000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 11999,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11741772051965725-ford-ka-1-5duratorq-active-euro6d",
    "image": "/assets/autolife/vehicle-03-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Ford",
    "title": "Ford Ka +",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "119 000 км",
    "mileageKm": 119000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6999,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11751025134623319-vw-golf-1-6tdi-bluemotion",
    "image": "/assets/autolife/vehicle-04-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Golf 1.6TDI",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "250 000 км",
    "mileageKm": 250000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 4500,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11768209424885033-seat-altea-facelift-b-gpl",
    "image": "/assets/autolife/vehicle-05-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Seat",
    "title": "Seat Altea FACELIFT",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "242 000 км",
    "mileageKm": 242000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 3999,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11762785459915323-audi-a4-sline-4x4-distr-digital-matrix-key-less-blind-spot",
    "image": "/assets/autolife/vehicle-06-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A4 Sline",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "186 000 км",
    "mileageKm": 186000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 20500,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11752841612433166-citroen-c5-2-2-hdi-170-full",
    "image": "/assets/autolife/vehicle-07-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Citroen",
    "title": "Citroen C5 2.2",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "217 000 км",
    "mileageKm": 217000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 3700,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-21756807262024883-audi-q5-2-0tdi-170-panorama",
    "image": "/assets/autolife/vehicle-08-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q5 2.0TDI-170",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "224 000 км",
    "mileageKm": 224000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 7999,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11768636298551646-vw-touran-2-0tdi-150-distr-camera-dsg",
    "image": "/assets/autolife/vehicle-09-1.webp",
    "category": "Van",
    "body": "Minivan",
    "make": "VW",
    "title": "VW Touran 2.0TDI-150",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "145 000 км",
    "mileageKm": 145000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 13999,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-21774977517199416-mercedes-benz-gle-coupe-350cdi-amg-distr-pano-camera-harman-kardon",
    "image": "/assets/autolife/vehicle-10-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLE Coupe",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "189 000 км",
    "mileageKm": 189000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 34500,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-21776689748685033-bmw-x1-2-0d-150-x-drive",
    "image": "/assets/autolife/vehicle-11-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X1 2.0D-150",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "250 000 км",
    "mileageKm": 250000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 11500,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11776774936356749-peugeot-508-active-bluehdi-130-s-s-eat8",
    "image": "/assets/autolife/vehicle-12-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Peugeot",
    "title": "Peugeot 508 ACTIVE",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "175 000 км",
    "mileageKm": 175000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 12300,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-21778149802063175-vw-tiguan-facelift-2-0tdi-150-dsg-navi-camera-distr-car-play",
    "image": "/assets/autolife/vehicle-13-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "VW",
    "title": "VW Tiguan FACELIFT",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "214 000 км",
    "mileageKm": 214000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "360° камера",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 14999,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11778155314388381-volvo-s60-napalno-serviziran",
    "image": "/assets/autolife/vehicle-14-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Volvo",
    "title": "Volvo S60 НАПЪЛНО",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "470 000 км",
    "mileageKm": 470000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 2500,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11787391986129616-vw-passat-2-0tdi-140",
    "image": "/assets/autolife/vehicle-15-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat 2.0TDI-140",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "237 000 км",
    "mileageKm": 237000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6300,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "verification": "verified",
    "evidenceUrl": "https://autolife.mobile.bg/obiava-11779369221509132-vw-polo-1-6-tdi-highline-dsg-navi-car-play-android-auto",
    "image": "/assets/autolife/vehicle-16-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Polo 1.6",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "140 000 км",
    "mileageKm": 140000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 9999,
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
