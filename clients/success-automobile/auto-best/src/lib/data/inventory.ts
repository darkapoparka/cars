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
    "evidenceUrl": "https://success.mobile.bg/obiava-11788284441880300-mercedes-benz-e-220-amg-burmester-camera-podgrev-alcantar-lizing",
    "sourceId": "11788284441880300",
    "observedAt": "2026-09-09T03:06:11.690Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11788284441880300-1.webp",
    "gallery": [
      "/dealer/stock/11788284441880300-1.webp",
      "/dealer/stock/11788284441880300-2.webp",
      "/dealer/stock/11788284441880300-3.webp",
      "/dealer/stock/11788284441880300-4.webp",
      "/dealer/stock/11788284441880300-5.webp",
      "/dealer/stock/11788284441880300-6.webp"
    ],
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 220 AMG",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "123 999 км",
    "mileageKm": 123999,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 20999,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "sample",
    "evidenceUrl": "https://success.mobile.bg/obiava-21787149042592643-kia-niro-hybrid-camera-jbl-ledd-lizing",
    "sourceId": "21787149042592643",
    "observedAt": "2026-09-09T03:06:11.690Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/21787149042592643-1.webp",
    "gallery": [
      "/dealer/stock/21787149042592643-1.webp",
      "/dealer/stock/21787149042592643-2.webp",
      "/dealer/stock/21787149042592643-3.webp",
      "/dealer/stock/21787149042592643-4.webp",
      "/dealer/stock/21787149042592643-5.webp",
      "/dealer/stock/21787149042592643-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Kia",
    "title": "Kia Niro Hybrid",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "133 000 км",
    "mileageKm": 133000,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 11999,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "sample",
    "evidenceUrl": "https://success.mobile.bg/obiava-11787147891422780-vw-alltrack-panorama-headup-podgrev-obduh-360cam-ledd-fu",
    "sourceId": "11787147891422780",
    "observedAt": "2026-09-09T03:06:11.691Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11787147891422780-1.webp",
    "gallery": [
      "/dealer/stock/11787147891422780-1.webp",
      "/dealer/stock/11787147891422780-2.webp",
      "/dealer/stock/11787147891422780-3.webp",
      "/dealer/stock/11787147891422780-4.webp",
      "/dealer/stock/11787147891422780-5.webp",
      "/dealer/stock/11787147891422780-6.webp"
    ],
    "category": "Комби",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Alltrack",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "130 999 км",
    "mileageKm": 130999,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "360° камера",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 16999,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "sample",
    "evidenceUrl": "https://success.mobile.bg/obiava-11784220398560751-audi-a3-35-sline-camera-ledd-recaro-lizing",
    "sourceId": "11784220398560751",
    "observedAt": "2026-09-09T03:06:11.691Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11784220398560751-1.webp",
    "gallery": [
      "/dealer/stock/11784220398560751-1.webp",
      "/dealer/stock/11784220398560751-2.webp",
      "/dealer/stock/11784220398560751-3.webp",
      "/dealer/stock/11784220398560751-4.webp",
      "/dealer/stock/11784220398560751-5.webp",
      "/dealer/stock/11784220398560751-6.webp"
    ],
    "category": "Седан",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A3 35 S line",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "72 999 км",
    "mileageKm": 72999,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 24999,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "sample",
    "evidenceUrl": "https://success.mobile.bg/obiava-21705706946317965-porsche-cayenne-cupe-chrono-podgrev-obduh-panorama-face-lizi",
    "sourceId": "21705706946317965",
    "observedAt": "2026-09-09T03:06:11.691Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21705706946317965-1.webp",
    "gallery": [
      "/dealer/stock/21705706946317965-1.webp",
      "/dealer/stock/21705706946317965-2.webp",
      "/dealer/stock/21705706946317965-3.webp",
      "/dealer/stock/21705706946317965-4.webp",
      "/dealer/stock/21705706946317965-5.webp",
      "/dealer/stock/21705706946317965-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Porsche",
    "title": "Porsche Cayenne Coupe",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "55 999 км",
    "mileageKm": 55999,
    "fuel": "Plug-in хибрид",
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
    "priceEur": 66999,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "sample",
    "evidenceUrl": "https://success.mobile.bg/obiava-21752669153003762-kia-sportage-2-0-gtline-camera-4x4-ledd-lizing",
    "sourceId": "21752669153003762",
    "observedAt": "2026-09-09T03:06:11.692Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21752669153003762-1.webp",
    "gallery": [
      "/dealer/stock/21752669153003762-1.webp",
      "/dealer/stock/21752669153003762-2.webp",
      "/dealer/stock/21752669153003762-3.webp",
      "/dealer/stock/21752669153003762-4.webp",
      "/dealer/stock/21752669153003762-5.webp",
      "/dealer/stock/21752669153003762-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Kia",
    "title": "Kia Sportage 2.0 GT Line",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "166 999 км",
    "mileageKm": 166999,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 14500,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "sample",
    "evidenceUrl": "https://success.mobile.bg/obiava-11777465890049135-skoda-superb-2-0-camera-face-distronic-lizing",
    "sourceId": "11777465890049135",
    "observedAt": "2026-09-09T03:06:11.692Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11777465890049135-1.webp",
    "gallery": [
      "/dealer/stock/11777465890049135-1.webp",
      "/dealer/stock/11777465890049135-2.webp",
      "/dealer/stock/11777465890049135-3.webp",
      "/dealer/stock/11777465890049135-4.webp",
      "/dealer/stock/11777465890049135-5.webp",
      "/dealer/stock/11777465890049135-6.webp"
    ],
    "category": "Комби",
    "body": "Wagon",
    "make": "Skoda",
    "title": "Skoda Superb 2.0",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "133 999 км",
    "mileageKm": 133999,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 19000,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "sample",
    "evidenceUrl": "https://success.mobile.bg/obiava-21684066785818426-mercedes-benz-glc-220-amg-4matic-burmester-360cam-recaro-lizing",
    "sourceId": "21684066785818426",
    "observedAt": "2026-09-09T03:06:11.692Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21684066785818426-1.webp",
    "gallery": [
      "/dealer/stock/21684066785818426-1.webp",
      "/dealer/stock/21684066785818426-2.webp",
      "/dealer/stock/21684066785818426-3.webp",
      "/dealer/stock/21684066785818426-4.webp",
      "/dealer/stock/21684066785818426-5.webp",
      "/dealer/stock/21684066785818426-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLC 220 AMG 4Matic",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "145 000 км",
    "mileageKm": 145000,
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
    "priceEur": 22999,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "sample",
    "evidenceUrl": "https://success.mobile.bg/obiava-11762241395630584-bmw-530e-mpak-headup-podgrev-360cam-harmann-lineasist",
    "sourceId": "11762241395630584",
    "observedAt": "2026-09-09T03:06:11.692Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11762241395630584-1.webp",
    "gallery": [
      "/dealer/stock/11762241395630584-1.webp",
      "/dealer/stock/11762241395630584-2.webp",
      "/dealer/stock/11762241395630584-3.webp",
      "/dealer/stock/11762241395630584-4.webp",
      "/dealer/stock/11762241395630584-5.webp",
      "/dealer/stock/11762241395630584-6.webp"
    ],
    "category": "Седан",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 530e M Sport",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "88 999 км",
    "mileageKm": 88999,
    "fuel": "Plug-in хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 39999,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "sample",
    "evidenceUrl": "https://success.mobile.bg/obiava-11747591068099753-bmw-m4-competetion-carbon-harmann-podgrev-360cam-liz",
    "sourceId": "11747591068099753",
    "observedAt": "2026-09-09T03:06:11.693Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11747591068099753-1.webp",
    "gallery": [
      "/dealer/stock/11747591068099753-1.webp",
      "/dealer/stock/11747591068099753-2.webp",
      "/dealer/stock/11747591068099753-3.webp",
      "/dealer/stock/11747591068099753-4.webp",
      "/dealer/stock/11747591068099753-5.webp",
      "/dealer/stock/11747591068099753-6.webp"
    ],
    "category": "Кабрио",
    "body": "Convertible",
    "make": "BMW",
    "title": "BMW M4 Competition",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "8000 км",
    "mileageKm": 8000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 66999,
    "href": "/listing-detail-v1/10"
  }
];
export const formatVehiclePrice = (priceEur: number | null | undefined) => typeof priceEur === "number" && priceEur > 0 ? `${new Intl.NumberFormat("bg-BG").format(priceEur)} €` : "Цена при запитване";
