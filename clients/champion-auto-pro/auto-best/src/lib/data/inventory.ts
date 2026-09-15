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
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11787294758482309-bmw-ix-40xdrive-m-sport-h-k-360",
    "image": "/assets/champion/vehicle-01-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW iX 40Xdrive",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "28 000 км",
    "mileageKm": 28000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 43800,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11787311251312869-audi-a6-50tdi-quattro",
    "image": "/assets/champion/vehicle-02-1.webp",
    "category": "Estate",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A6 50TDI Quattro",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "176 000 км",
    "mileageKm": 176000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 23000,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11784794853353090-smart-forfour-22kw-26000km",
    "image": "/assets/champion/vehicle-03-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Smart",
    "title": "Smart Forfour 22kw.-26000км.",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "26 000 км",
    "mileageKm": 26000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 12900,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11784640487309304-mercedes-benz-s-500-amg-packet-63-long",
    "image": "/assets/champion/vehicle-04-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 500 AMG Packet 63 Long",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "265 000 км",
    "mileageKm": 265000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 27999,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11771862221224289-mercedes-benz-s-400-long-full",
    "image": "/assets/champion/vehicle-05-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz S 400 LONG-FULL",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "73 000 км",
    "mileageKm": 73000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 89999,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-21784732491989700-mercedes-benz-ml-350-amg-packet",
    "image": "/assets/champion/vehicle-06-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz ML 350 AMG Packet",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "185 000 км",
    "mileageKm": 185000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 15999,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11784720940119234-audi-a7-s-line-full-108000km",
    "image": "/assets/champion/vehicle-07-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A7 S-Line FULL",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "108 000 км",
    "mileageKm": 108000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 35999,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11783584641538327-mercedes-benz-b-200-amg-line",
    "image": "/assets/champion/vehicle-08-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz B 200 AMG Line",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "95 000 км",
    "mileageKm": 95000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 17999,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-21778484741555035-audi-sq7-s-line",
    "image": "/assets/champion/vehicle-09-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi SQ7 S-Line",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "230 000 км",
    "mileageKm": 230000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 33000,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11758265694582686-audi-rs5-2-9tfsi-v6-quattro",
    "image": "/assets/champion/vehicle-10-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi Rs5 2.9TFSI V6 Quattro",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "182 000 км",
    "mileageKm": 182000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 39999,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11773307576284789-audi-e-tron-2-x-s-line",
    "image": "/assets/champion/vehicle-11-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi E-Tron 2 X S-Line",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "72 000 км",
    "mileageKm": 72000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 31000,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11787215050268120-vw-id-5-pro-82kw-garantsionen-104000km",
    "image": "/assets/champion/vehicle-12-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW ID.5 PRO 82kw",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "104 000 км",
    "mileageKm": 104000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 29999,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-21787142969943440-toyota-highlander-60000km-gaz-prins",
    "image": "/assets/champion/vehicle-13-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Toyota",
    "title": "Toyota Highlander 60000km Газ Prins",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "60 000 км",
    "mileageKm": 60000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 26800,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-21787197677876419-mercedes-benz-eqe-300-led-navi-kam",
    "image": "/assets/champion/vehicle-14-1.webp",
    "category": "Sedan",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz EQE 300",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "47 000 км",
    "mileageKm": 47000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 44999,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-21787200936302723-mercedes-benz-eqc-400-4matic-amg-hud-360kam",
    "image": "/assets/champion/vehicle-15-1.webp",
    "category": "SUV",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz EQC 400",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "68 900 км",
    "mileageKm": 68900,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 38800,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "verification": "verified",
    "evidenceUrl": "https://championautopro.mobile.bg/obiava-11786100747512292-renault-captur-55000-km",
    "image": "/assets/champion/vehicle-16-1.webp",
    "category": "Hatchback",
    "body": "Hatchback",
    "make": "Renault",
    "title": "Renault Captur",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "55 000 км",
    "mileageKm": 55000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 9200,
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
