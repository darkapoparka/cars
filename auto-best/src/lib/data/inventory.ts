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
    "evidenceUrl": "https://asko96.mobile.bg/obiava-21788444587626928-toyota-rav4-hybrid-camera-podgrev-car-play-lizing",
    "image": "/assets/asko96/vehicle-01-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Toyota",
    "title": "Toyota Rav4 HYBRID",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "14 000 км",
    "mileageKm": 14000,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 36500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-11788418194310981-audi-a7-s-line-germany-distr-air-memory-podgrev-auto-h-liz",
    "image": "/assets/asko96/vehicle-02-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A7 S-LINE",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "211 000 км",
    "mileageKm": 211000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 14000,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-21788361724092359-mercedes-benz-glc-coupe-350amg-9gtron-germany-camera-ambient-keyless-go-li",
    "image": "/assets/asko96/vehicle-03-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLC Coupe 350AMG",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "179 200 км",
    "mileageKm": 179200,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 26000,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-21788340495159936-mercedes-benz-gls-400-amg-7mesta-pano-distr-360cam-burmest-obduh-vaku-li",
    "image": "/assets/asko96/vehicle-04-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLS 400 AMG",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "135 141 км",
    "mileageKm": 135141,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 47000,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-11788268077076934-mini-countryman-all4-germany-panorama-podgrev-lizing",
    "image": "/assets/asko96/vehicle-05-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Mini",
    "title": "Mini Countryman ALL4",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "205 000 км",
    "mileageKm": 205000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 7777,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-21787916905998235-audi-sq7-ful-led-podgrev-obduh-distron-kamera-lane-asist-li",
    "image": "/assets/asko96/vehicle-06-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi SQ7 FUL LED",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "170 000 км",
    "mileageKm": 170000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 32000,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-11787665314733489-citroen-c5x-plug-in-keyles-panorama-podgrev-head-up-360kamera",
    "image": "/assets/asko96/vehicle-07-1.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "Citroen",
    "title": "Citroen C5X PLUG IN",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "162 000 км",
    "mileageKm": 162000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 17900,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-11787664720233597-audi-a5-s-line-plus-edition-germany-bang-olufsen-lane-asis",
    "image": "/assets/asko96/vehicle-08-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A5 S-LINE PLUS",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "230 000 км",
    "mileageKm": 230000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 14000,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-11787318670316786-mercedes-benz-e-220-amg-germany-180camera-ambi-podgrev-park-pilot-lizi",
    "image": "/assets/asko96/vehicle-09-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 220 AMG",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "195 530 км",
    "mileageKm": 195530,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 19500,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-11787292903991160-mercedes-benz-s-680-l-v12-maybach-tvx3-distr-pano-obduh-burmester",
    "image": "/assets/asko96/vehicle-10-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 680 L",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "140 000 км",
    "mileageKm": 140000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 120000,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-11787147161945133-mercedes-benz-s-500-l-amg-4m-tvx3-distr-pano-vakuum-hud-obduh-masazh-li",
    "image": "/assets/asko96/vehicle-11-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 500 L",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "173 291 км",
    "mileageKm": 173291,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 29500,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-21787145927135700-mini-countryman-sd-all4-germany-head-up-camera-pano-car-play-lizin",
    "image": "/assets/asko96/vehicle-12-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Mini",
    "title": "Mini Countryman SD",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "190 582 км",
    "mileageKm": 190582,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 18500,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-21786786821064251-porsche-cayenne-s-germany-pano-digital-air-camera-keyless-go-lizin",
    "image": "/assets/asko96/vehicle-13-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Porsche",
    "title": "Porsche Cayenne S",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "165 009 км",
    "mileageKm": 165009,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 39000,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-21786778589147860-jeep-compass-4x4-limited-distron-lane-asyst-car-play-ambi-lizin",
    "image": "/assets/asko96/vehicle-14-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Jeep",
    "title": "Jeep Compass 4x4",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "181 889 км",
    "mileageKm": 181889,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 14000,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-21786540153108868-bmw-x3-m40d-distr-3dcamera-harman-hud-podgrev-car-play-li",
    "image": "/assets/asko96/vehicle-15-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X3 М40D",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "90 800 км",
    "mileageKm": 90800,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 43900,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "verification": "verified",
    "evidenceUrl": "https://asko96.mobile.bg/obiava-11786173977658651-bmw-550-m-xd-shadow-line-360cam-podgrev-memory-harman-lizi",
    "image": "/assets/asko96/vehicle-16-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 550 M",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "184 120 км",
    "mileageKm": 184120,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 17500,
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
