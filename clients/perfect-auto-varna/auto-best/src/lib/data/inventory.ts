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
  verification: 'verified' | 'verified';
  evidenceUrl?: string;
  image: string;
  gallery: string[];
  sourceUrl: string;
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

// Equipment facets are limited to recurring features published in Перфект Ауто's
// current adverts for these model families (perfektauto.mobile.bg, checked 2026-08-30).
const inventoryRecords: Omit<Vehicle, 'year' | 'mileage' | 'href' | 'verification'>[] = [
  {
    "id": 1,
    "image": "/assets/perfect-auto/vehicle-01-1.webp",
    "gallery": [
      "/assets/perfect-auto/vehicle-01-1.webp",
      "/assets/perfect-auto/vehicle-01-2.webp",
      "/assets/perfect-auto/vehicle-01-3.webp",
      "/assets/perfect-auto/vehicle-01-4.webp",
      "/assets/perfect-auto/vehicle-01-5.webp"
    ],
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-21788859055085650-mercedes-benz-ml-320-cdi",
    "category": "Джип",
    "body": "Джип",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz ML 320 CDI",
    "yearNumber": 2006,
    "mileageKm": 249000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [],
    "condition": "used",
    "priceEur": 6900
  },
  {
    "id": 2,
    "image": "/assets/perfect-auto/vehicle-02-1.webp",
    "gallery": [
      "/assets/perfect-auto/vehicle-02-1.webp",
      "/assets/perfect-auto/vehicle-02-2.webp",
      "/assets/perfect-auto/vehicle-02-3.webp",
      "/assets/perfect-auto/vehicle-02-4.webp",
      "/assets/perfect-auto/vehicle-02-5.webp"
    ],
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-21788174780697334-mercedes-benz-g-350-4-matic-facelift-bluetec-full-eks-shibedah",
    "category": "Джип",
    "body": "Джип",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz G 350 4 MATIC FACELIFT BLUETEC * FULL ЕКС * Шибедах *",
    "yearNumber": 2015,
    "mileageKm": 151000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 59900
  },
  {
    "id": 3,
    "image": "/assets/perfect-auto/vehicle-03-1.webp",
    "gallery": [
      "/assets/perfect-auto/vehicle-03-1.webp",
      "/assets/perfect-auto/vehicle-03-2.webp",
      "/assets/perfect-auto/vehicle-03-3.webp",
      "/assets/perfect-auto/vehicle-03-4.webp",
      "/assets/perfect-auto/vehicle-03-5.webp"
    ],
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-21788174574608668-audi-q7-50-tdi-facelift-quattro-s-line-maxton-full-rs",
    "category": "Джип",
    "body": "Джип",
    "make": "Audi",
    "title": "Audi Q7 50 TDI FACELIFT QUATTRO* S LINE* MAXTON* FULL* RS",
    "yearNumber": 2022,
    "mileageKm": 136000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 44900
  },
  {
    "id": 4,
    "image": "/assets/perfect-auto/vehicle-04-1.webp",
    "gallery": [
      "/assets/perfect-auto/vehicle-04-1.webp",
      "/assets/perfect-auto/vehicle-04-2.webp",
      "/assets/perfect-auto/vehicle-04-3.webp",
      "/assets/perfect-auto/vehicle-04-4.webp",
      "/assets/perfect-auto/vehicle-04-5.webp"
    ],
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-21787209952978104-lexus-nx-450-chisto-nov-full-ekstri-mark-lev-pano-head-u",
    "category": "Джип",
    "body": "Джип",
    "make": "Lexus",
    "title": "Lexus NX 450 ЧИСТО НОВ * FULL Екстри * MARK LEV * ПАНО * HEAD U",
    "yearNumber": 2026,
    "mileageKm": 0,
    "fuel": "Plug-in хибрид",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 55900
  },
  {
    "id": 5,
    "image": "/assets/perfect-auto/vehicle-05-1.webp",
    "gallery": [
      "/assets/perfect-auto/vehicle-05-1.webp",
      "/assets/perfect-auto/vehicle-05-2.webp",
      "/assets/perfect-auto/vehicle-05-3.webp",
      "/assets/perfect-auto/vehicle-05-4.webp",
      "/assets/perfect-auto/vehicle-05-5.webp"
    ],
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-21787209746596224-bmw-x6-30d-xdrive-swarovski-m-packet-maxton",
    "category": "Джип",
    "body": "Джип",
    "make": "BMW",
    "title": "BMW X6 30d xDrive * SWAROVSKI * M PACKET * MAXTON *",
    "yearNumber": 2022,
    "mileageKm": 138000,
    "fuel": "Дизелов",
    "transmission": "Автоматична",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 48900
  },
  {
    "id": 6,
    "image": "/assets/perfect-auto/vehicle-06-1.webp",
    "gallery": [
      "/assets/perfect-auto/vehicle-06-1.webp",
      "/assets/perfect-auto/vehicle-06-2.webp",
      "/assets/perfect-auto/vehicle-06-3.webp",
      "/assets/perfect-auto/vehicle-06-4.webp",
      "/assets/perfect-auto/vehicle-06-5.webp"
    ],
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-11786890129374054-ford-mustang-kamera",
    "category": "Купе",
    "body": "Купе",
    "make": "Ford",
    "title": "Ford Mustang * КАМЕРА *",
    "yearNumber": 2016,
    "mileageKm": 48000,
    "fuel": "Бензинов",
    "transmission": "Автоматична",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 19900
  }
];

// Current dealer-advertised sample captured 2026-09-10. Preserve source links;
// client promotion requires replacing and verifying each record, including reused photos.
export const featuredVehicles: Vehicle[] = inventoryRecords.map(record => ({
  ...record,
  verification: 'verified',
  year: String(record.yearNumber),
  mileage: `${new Intl.NumberFormat('bg-BG').format(record.mileageKm)} км`,
  href: `/listing-detail-v1/${record.id}`
}));

export const formatVehiclePrice = (priceEur: number) => `${new Intl.NumberFormat('bg-BG').format(priceEur)} €`;
