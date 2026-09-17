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
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21781257688134220-mercedes-benz-gle-350-amg-designo-360cam-serv-ist-ambient-diss-har",
    "image": "/assets/excellent/vehicle-01-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLE 350 AMG  DESIGNO",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "179 000 км",
    "mileageKm": 179000,
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
    "priceEur": 32900,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-11785932596351376-vw-passat-2-0tdi-highline-bluemotion-led-automat",
    "image": "/assets/excellent/vehicle-02-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "VW",
    "title": "VW Passat 2.0TDI  HIGHLINE",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "212 000 км",
    "mileageKm": 212000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 10500,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-11788181514006324-skoda-octavia-2-0tdi-4x4-digital",
    "image": "/assets/excellent/vehicle-03-1.webp",
    "category": "Wagon",
    "body": "Wagon",
    "make": "Skoda",
    "title": "Skoda Octavia 2.0TDI  4x4",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "180 000 км",
    "mileageKm": 180000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 17900,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-11786795820524833-cupra-born-restyling-58kw-67000km",
    "image": "/assets/excellent/vehicle-04-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Cupra",
    "title": "Cupra Born RESTYLING  58KW",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "67 000 км",
    "mileageKm": 67000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 22900,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21786794971218528-hyundai-kona-1-6hev-n-line-40000km",
    "image": "/assets/excellent/vehicle-05-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai Kona 1.6HEV  N-LINE",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "40 000 км",
    "mileageKm": 40000,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 17900,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21786455005208728-kia-sportage-1-6d-automat",
    "image": "/assets/excellent/vehicle-06-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Kia",
    "title": "Kia Sportage 1.6D  AUTOMAT",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "180 000 км",
    "mileageKm": 180000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 10900,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21786453972789852-vw-tiguan-2-0tdi-4motion-swiss",
    "image": "/assets/excellent/vehicle-07-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "VW",
    "title": "VW Tiguan 2.0ТDI  4MOTION",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "199 000 км",
    "mileageKm": 199000,
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
    "priceEur": 16990,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21786451392501339-land-rover-range-rover-evoque-hybrid-nardo-grey-125000km",
    "image": "/assets/excellent/vehicle-08-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Land Rover",
    "title": "Land Rover Range Rover Evoque HYBRID  NARDO_GREY",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "125 000 км",
    "mileageKm": 125000,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 25000,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21773151499854810-audi-q2-2-0tfsi-quattro-s-line-digital-line-assist",
    "image": "/assets/excellent/vehicle-09-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q2 2.0TFSI  QUATTRO",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "133 000 км",
    "mileageKm": 133000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 16900,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-11768639133016485-dodge-challenger-5-7hemi-srt",
    "image": "/assets/excellent/vehicle-10-1.webp",
    "category": "Coupe",
    "body": "Coupe",
    "make": "Dodge",
    "title": "Dodge Challenger 5.7HEMI  SRT",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "65 000 км",
    "mileageKm": 65000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 21500,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21775914499512125-vw-t-cross-1-5i-automat-48000km",
    "image": "/assets/excellent/vehicle-11-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "VW",
    "title": "VW T-Cross 1.5i  AUTOMAT",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "48 000 км",
    "mileageKm": 48000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 21990,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21785575816054903-kia-niro-plug-in-hybrid",
    "image": "/assets/excellent/vehicle-12-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Kia",
    "title": "Kia Niro PLUG-IN-HYBRID",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "118 000 км",
    "mileageKm": 118000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 16990,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21773150110056507-bmw-x3-2-0d-xdrive-m-pack",
    "image": "/assets/excellent/vehicle-13-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X3 2.0D  xDrive",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "188 000 км",
    "mileageKm": 188000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 12000,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21785323501482685-nissan-juke-1-6t-nismo-alcantara",
    "image": "/assets/excellent/vehicle-14-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Nissan",
    "title": "Nissan Juke 1.6Т  NISMO",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "186 000 км",
    "mileageKm": 186000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 9500,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-11778320754806394-peugeot-308-1-6gt-205h-p-panorama-massage",
    "image": "/assets/excellent/vehicle-15-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Peugeot",
    "title": "Peugeot 308 1.6GT  205h.p",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "130 000 км",
    "mileageKm": 130000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 9200,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "verification": "verified",
    "evidenceUrl": "https://excellent.mobile.bg/obiava-21781781688732220-mazda-cx-5-2-5i-4x4-automat-skyactiv",
    "image": "/assets/excellent/vehicle-16-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mazda",
    "title": "Mazda CX-5 2.5i  4x4",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "192 000 км",
    "mileageKm": 192000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 14990,
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
