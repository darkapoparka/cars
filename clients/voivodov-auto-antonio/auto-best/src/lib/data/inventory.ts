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
  sourceId: string;
  observedAt: string;
  taxLabel: string;
  gallery: string[];
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


// Source-backed advertisement sample; not a live or independently verified stock feed.
export const featuredVehicles: Vehicle[] = [
  {
    "id": 1,
    "verification": "sample",
    "evidenceUrl": "https://voivodovauto.mobile.bg/obiava-21787584817368418-hyundai-ix35-nov-vnos-ot-italiya",
    "sourceId": "21787584817368418",
    "observedAt": "2026-09-09T03:28:23.511Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21787584817368418-1.webp",
    "gallery": [
      "/dealer/stock/21787584817368418-1.webp",
      "/dealer/stock/21787584817368418-2.webp",
      "/dealer/stock/21787584817368418-3.webp",
      "/dealer/stock/21787584817368418-4.webp",
      "/dealer/stock/21787584817368418-5.webp",
      "/dealer/stock/21787584817368418-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai IX35",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "175 679 км",
    "mileageKm": 175679,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 5800,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "sample",
    "evidenceUrl": "https://voivodovauto.mobile.bg/obiava-21778688064239119-toyota-rav4-hibrid-nov-vnos-ot-italiya",
    "sourceId": "21778688064239119",
    "observedAt": "2026-09-09T03:28:23.511Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21778688064239119-1.webp",
    "gallery": [
      "/dealer/stock/21778688064239119-1.webp",
      "/dealer/stock/21778688064239119-2.webp",
      "/dealer/stock/21778688064239119-3.webp",
      "/dealer/stock/21778688064239119-4.webp",
      "/dealer/stock/21778688064239119-5.webp",
      "/dealer/stock/21778688064239119-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Toyota",
    "title": "Toyota RAV4 Hybrid",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "175 447 км",
    "mileageKm": 175447,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 14800,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "sample",
    "evidenceUrl": "https://voivodovauto.mobile.bg/obiava-11781437915261347-opel-corsa-nov-vnos-ot-italiya",
    "sourceId": "11781437915261347",
    "observedAt": "2026-09-09T03:28:23.511Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11781437915261347-1.webp",
    "gallery": [
      "/dealer/stock/11781437915261347-1.webp",
      "/dealer/stock/11781437915261347-2.webp",
      "/dealer/stock/11781437915261347-3.webp",
      "/dealer/stock/11781437915261347-4.webp",
      "/dealer/stock/11781437915261347-5.webp",
      "/dealer/stock/11781437915261347-6.webp"
    ],
    "category": "Купе",
    "body": "Coupe",
    "make": "Opel",
    "title": "Opel Corsa",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "46 000 км",
    "mileageKm": 46000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 5800,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "sample",
    "evidenceUrl": "https://voivodovauto.mobile.bg/obiava-21784640560836463-mazda-cx-5-nov-vnos-ot-italiya",
    "sourceId": "21784640560836463",
    "observedAt": "2026-09-09T03:28:23.512Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21784640560836463-1.webp",
    "gallery": [
      "/dealer/stock/21784640560836463-1.webp",
      "/dealer/stock/21784640560836463-2.webp",
      "/dealer/stock/21784640560836463-3.webp",
      "/dealer/stock/21784640560836463-4.webp",
      "/dealer/stock/21784640560836463-5.webp",
      "/dealer/stock/21784640560836463-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Mazda",
    "title": "Mazda CX-5",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "173 000 км",
    "mileageKm": 173000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6800,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "sample",
    "evidenceUrl": "https://voivodovauto.mobile.bg/obiava-21776177602007255-jeep-cherokee-nov-vnos-ot-italiya-4h4",
    "sourceId": "21776177602007255",
    "observedAt": "2026-09-09T03:28:23.512Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21776177602007255-1.webp",
    "gallery": [
      "/dealer/stock/21776177602007255-1.webp",
      "/dealer/stock/21776177602007255-2.webp",
      "/dealer/stock/21776177602007255-3.webp",
      "/dealer/stock/21776177602007255-4.webp",
      "/dealer/stock/21776177602007255-5.webp",
      "/dealer/stock/21776177602007255-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Jeep",
    "title": "Jeep Cherokee",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "146 000 км",
    "mileageKm": 146000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 10500,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "sample",
    "evidenceUrl": "https://voivodovauto.mobile.bg/obiava-11781213566653263-honda-jazz-avtomat-realni-kilometri",
    "sourceId": "11781213566653263",
    "observedAt": "2026-09-09T03:28:23.512Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11781213566653263-1.webp",
    "gallery": [
      "/dealer/stock/11781213566653263-1.webp",
      "/dealer/stock/11781213566653263-2.webp",
      "/dealer/stock/11781213566653263-3.webp",
      "/dealer/stock/11781213566653263-4.webp",
      "/dealer/stock/11781213566653263-5.webp",
      "/dealer/stock/11781213566653263-6.webp"
    ],
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Honda",
    "title": "Honda Jazz Automatic",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "24 000 км",
    "mileageKm": 24000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "360° камера",
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 16890,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "sample",
    "evidenceUrl": "https://voivodovauto.mobile.bg/obiava-21784225734010518-honda-cr-v-realni-kilometri-sas-servizna-knizhka",
    "sourceId": "21784225734010518",
    "observedAt": "2026-09-09T03:28:23.513Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21784225734010518-1.webp",
    "gallery": [
      "/dealer/stock/21784225734010518-1.webp",
      "/dealer/stock/21784225734010518-2.webp",
      "/dealer/stock/21784225734010518-3.webp",
      "/dealer/stock/21784225734010518-4.webp",
      "/dealer/stock/21784225734010518-5.webp",
      "/dealer/stock/21784225734010518-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Honda",
    "title": "Honda CR-V Hybrid",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "79 000 км",
    "mileageKm": 79000,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 24999,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "sample",
    "evidenceUrl": "https://voivodovauto.mobile.bg/obiava-11781101254100384-toyota-prius-nov-vnos-ot-italiya",
    "sourceId": "11781101254100384",
    "observedAt": "2026-09-09T03:28:23.514Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11781101254100384-1.webp",
    "gallery": [
      "/dealer/stock/11781101254100384-1.webp",
      "/dealer/stock/11781101254100384-2.webp",
      "/dealer/stock/11781101254100384-3.webp",
      "/dealer/stock/11781101254100384-4.webp",
      "/dealer/stock/11781101254100384-5.webp",
      "/dealer/stock/11781101254100384-6.webp"
    ],
    "category": "Седан",
    "body": "Sedan",
    "make": "Toyota",
    "title": "Toyota Prius",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "159 000 км",
    "mileageKm": 159000,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 8200,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "sample",
    "evidenceUrl": "https://voivodovauto.mobile.bg/obiava-21775747569183753-skoda-yeti-nov-vnos-ot-italiya",
    "sourceId": "21775747569183753",
    "observedAt": "2026-09-09T03:28:23.514Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21775747569183753-1.webp",
    "gallery": [
      "/dealer/stock/21775747569183753-1.webp",
      "/dealer/stock/21775747569183753-2.webp",
      "/dealer/stock/21775747569183753-3.webp",
      "/dealer/stock/21775747569183753-4.webp",
      "/dealer/stock/21775747569183753-5.webp",
      "/dealer/stock/21775747569183753-6.webp"
    ],
    "category": "Миниван",
    "body": "Миниван",
    "make": "Skoda",
    "title": "Skoda Yeti",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "143 000 км",
    "mileageKm": 143000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6700,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "sample",
    "evidenceUrl": "https://voivodovauto.mobile.bg/obiava-11775730754815024-skoda-octavia-nov-vnos-ot-italiya",
    "sourceId": "11775730754815024",
    "observedAt": "2026-09-09T03:28:23.514Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11775730754815024-1.webp",
    "gallery": [
      "/dealer/stock/11775730754815024-1.webp",
      "/dealer/stock/11775730754815024-2.webp",
      "/dealer/stock/11775730754815024-3.webp",
      "/dealer/stock/11775730754815024-4.webp",
      "/dealer/stock/11775730754815024-5.webp",
      "/dealer/stock/11775730754815024-6.webp"
    ],
    "category": "Седан",
    "body": "Sedan",
    "make": "Skoda",
    "title": "Skoda Octavia",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "204 000 км",
    "mileageKm": 204000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 10100,
    "href": "/listing-detail-v1/10"
  }
];
export const formatVehiclePrice = (priceEur: number | null | undefined) => typeof priceEur === "number" && priceEur > 0 ? `${new Intl.NumberFormat("bg-BG").format(priceEur)} €` : "Цена при запитване";
