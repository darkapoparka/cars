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
    "evidenceUrl": "https://icars.mobile.bg/obiava-11760378435449508-bmw-740-d-xdrive-garantsiya-04-2028",
    "sourceId": "11760378435449508",
    "observedAt": "2026-09-09T03:38:01.402Z",
    "taxLabel": "Цената е без ДДС",
    "image": "/dealer/stock/11760378435449508-1.webp",
    "gallery": [
      "/dealer/stock/11760378435449508-1.webp",
      "/dealer/stock/11760378435449508-2.webp",
      "/dealer/stock/11760378435449508-3.webp",
      "/dealer/stock/11760378435449508-4.webp",
      "/dealer/stock/11760378435449508-5.webp",
      "/dealer/stock/11760378435449508-6.webp"
    ],
    "category": "Стреч лимузина",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 740d xDrive",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "85 000 км",
    "mileageKm": 85000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 71999,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "sample",
    "evidenceUrl": "https://icars.mobile.bg/obiava-21769205380054749-bmw-x6-m-package",
    "sourceId": "21769205380054749",
    "observedAt": "2026-09-09T03:38:01.402Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21769205380054749-1.webp",
    "gallery": [
      "/dealer/stock/21769205380054749-1.webp",
      "/dealer/stock/21769205380054749-2.webp",
      "/dealer/stock/21769205380054749-3.webp",
      "/dealer/stock/21769205380054749-4.webp",
      "/dealer/stock/21769205380054749-5.webp",
      "/dealer/stock/21769205380054749-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 M Package",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "230 000 км",
    "mileageKm": 230000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 22500,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "sample",
    "evidenceUrl": "https://icars.mobile.bg/obiava-21782908599914903-hyundai-tucson-ix35",
    "sourceId": "21782908599914903",
    "observedAt": "2026-09-09T03:38:01.403Z",
    "taxLabel": "Цената е без ДДС",
    "image": "/dealer/stock/21782908599914903-1.webp",
    "gallery": [
      "/dealer/stock/21782908599914903-1.webp",
      "/dealer/stock/21782908599914903-2.webp",
      "/dealer/stock/21782908599914903-3.webp",
      "/dealer/stock/21782908599914903-4.webp",
      "/dealer/stock/21782908599914903-5.webp",
      "/dealer/stock/21782908599914903-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai Tucson ix35",
    "year": "2025",
    "yearNumber": 2025,
    "mileage": "8000 км",
    "mileageKm": 8000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 34999,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "sample",
    "evidenceUrl": "https://icars.mobile.bg/obiava-11782907735294061-opel-corsa-e",
    "sourceId": "11782907735294061",
    "observedAt": "2026-09-09T03:38:01.403Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11782907735294061-1.webp",
    "gallery": [
      "/dealer/stock/11782907735294061-1.webp",
      "/dealer/stock/11782907735294061-2.webp",
      "/dealer/stock/11782907735294061-3.webp",
      "/dealer/stock/11782907735294061-4.webp",
      "/dealer/stock/11782907735294061-5.webp",
      "/dealer/stock/11782907735294061-6.webp"
    ],
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Opel",
    "title": "Opel Corsa E",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "36 644 км",
    "mileageKm": 36644,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 8999,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "sample",
    "evidenceUrl": "https://icars.mobile.bg/obiava-11752078175497458-audi-rs6-avant-performance",
    "sourceId": "11752078175497458",
    "observedAt": "2026-09-09T03:38:01.403Z",
    "taxLabel": "Цената е без ДДС",
    "image": "/dealer/stock/11752078175497458-1.webp",
    "gallery": [
      "/dealer/stock/11752078175497458-1.webp",
      "/dealer/stock/11752078175497458-2.webp",
      "/dealer/stock/11752078175497458-3.webp",
      "/dealer/stock/11752078175497458-4.webp",
      "/dealer/stock/11752078175497458-5.webp",
      "/dealer/stock/11752078175497458-6.webp"
    ],
    "category": "Комби",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi RS6 Avant Performance",
    "year": "2025",
    "yearNumber": 2025,
    "mileage": "20 000 км",
    "mileageKm": 20000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 123000,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "sample",
    "evidenceUrl": "https://icars.mobile.bg/obiava-11780753459695554-mercedes-benz-cls-400",
    "sourceId": "11780753459695554",
    "observedAt": "2026-09-09T03:38:01.404Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11780753459695554-1.webp",
    "gallery": [
      "/dealer/stock/11780753459695554-1.webp",
      "/dealer/stock/11780753459695554-2.webp",
      "/dealer/stock/11780753459695554-3.webp",
      "/dealer/stock/11780753459695554-4.webp",
      "/dealer/stock/11780753459695554-5.webp",
      "/dealer/stock/11780753459695554-6.webp"
    ],
    "category": "Купе",
    "body": "Coupe",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz CLS 400",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "145 000 км",
    "mileageKm": 145000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 30999,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "sample",
    "evidenceUrl": "https://icars.mobile.bg/obiava-21751722135031902-porsche-cayenne-turbo-4-0-v8-550-ks",
    "sourceId": "21751722135031902",
    "observedAt": "2026-09-09T03:38:01.404Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21751722135031902-1.webp",
    "gallery": [
      "/dealer/stock/21751722135031902-1.webp",
      "/dealer/stock/21751722135031902-2.webp",
      "/dealer/stock/21751722135031902-3.webp",
      "/dealer/stock/21751722135031902-4.webp",
      "/dealer/stock/21751722135031902-5.webp",
      "/dealer/stock/21751722135031902-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Porsche",
    "title": "Porsche Cayenne Turbo 4.0 V8",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "192 000 км",
    "mileageKm": 192000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 49500,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "sample",
    "evidenceUrl": "https://icars.mobile.bg/obiava-11695297184317225-audi-a8-50-tdi-s-line-sportpacket-b-o-massage",
    "sourceId": "11695297184317225",
    "observedAt": "2026-09-09T03:38:01.405Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11695297184317225-1.webp",
    "gallery": [
      "/dealer/stock/11695297184317225-1.webp",
      "/dealer/stock/11695297184317225-2.webp",
      "/dealer/stock/11695297184317225-3.webp",
      "/dealer/stock/11695297184317225-4.webp",
      "/dealer/stock/11695297184317225-5.webp",
      "/dealer/stock/11695297184317225-6.webp"
    ],
    "category": "Седан",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A8 50 TDI S line",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "235 000 км",
    "mileageKm": 235000,
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
    "priceEur": 37999,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "sample",
    "evidenceUrl": "https://icars.mobile.bg/obiava-21725449678653350-bmw-x5-30d-xdrive",
    "sourceId": "21725449678653350",
    "observedAt": "2026-09-09T03:38:01.405Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/21725449678653350-1.webp",
    "gallery": [
      "/dealer/stock/21725449678653350-1.webp",
      "/dealer/stock/21725449678653350-2.webp",
      "/dealer/stock/21725449678653350-3.webp",
      "/dealer/stock/21725449678653350-4.webp",
      "/dealer/stock/21725449678653350-5.webp",
      "/dealer/stock/21725449678653350-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X5 30d xDrive",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "192 000 км",
    "mileageKm": 192000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 32500,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "sample",
    "evidenceUrl": "https://icars.mobile.bg/obiava-11711117396768513-mercedes-benz-v-300-4matic-amg-line-long",
    "sourceId": "11711117396768513",
    "observedAt": "2026-09-09T03:38:01.406Z",
    "taxLabel": "Цената е без ДДС",
    "image": "/dealer/stock/11711117396768513-1.webp",
    "gallery": [
      "/dealer/stock/11711117396768513-1.webp",
      "/dealer/stock/11711117396768513-2.webp",
      "/dealer/stock/11711117396768513-3.webp",
      "/dealer/stock/11711117396768513-4.webp",
      "/dealer/stock/11711117396768513-5.webp",
      "/dealer/stock/11711117396768513-6.webp"
    ],
    "category": "Ван",
    "body": "Minivan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz V 300 4Matic AMG Line Long",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "149 000 км",
    "mileageKm": 149000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Панорамен покрив",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 50999,
    "href": "/listing-detail-v1/10"
  }
];
export const formatVehiclePrice = (priceEur: number | null | undefined) => typeof priceEur === "number" && priceEur > 0 ? `${new Intl.NumberFormat("bg-BG").format(priceEur)} €` : "Цена при запитване";
