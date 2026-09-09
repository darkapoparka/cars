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
    "evidenceUrl": "https://mg7group.mobile.bg/obiava-21785564544332885-bmw-x7-40d-xdrive-m-sport-facelift-carbon-1-vi-sobstvenik",
    "sourceId": "21785564544332885",
    "observedAt": "2026-09-09T03:00:38.748Z",
    "taxLabel": "Цената е без ДДС",
    "image": "/dealer/stock/21785564544332885-1.webp",
    "gallery": [
      "/dealer/stock/21785564544332885-1.webp",
      "/dealer/stock/21785564544332885-2.webp",
      "/dealer/stock/21785564544332885-3.webp",
      "/dealer/stock/21785564544332885-4.webp",
      "/dealer/stock/21785564544332885-5.webp",
      "/dealer/stock/21785564544332885-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X7 40d xDrive M Sport",
    "year": "2023",
    "yearNumber": 2023,
    "mileage": "45 000 км",
    "mileageKm": 45000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 61900,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "sample",
    "evidenceUrl": "https://mg7group.mobile.bg/obiava-21745605265440995-mercedes-benz-g-63-amg-2025g-nov-ot-silvar-star",
    "sourceId": "21745605265440995",
    "observedAt": "2026-09-09T03:00:38.749Z",
    "taxLabel": "Цената е без ДДС",
    "image": "/dealer/stock/21745605265440995-1.webp",
    "gallery": [
      "/dealer/stock/21745605265440995-1.webp",
      "/dealer/stock/21745605265440995-2.webp",
      "/dealer/stock/21745605265440995-3.webp",
      "/dealer/stock/21745605265440995-4.webp",
      "/dealer/stock/21745605265440995-5.webp",
      "/dealer/stock/21745605265440995-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz G 63 AMG",
    "year": "2025",
    "yearNumber": 2025,
    "mileage": "22 000 км",
    "mileageKm": 22000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 181000,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "sample",
    "evidenceUrl": "https://mg7group.mobile.bg/obiava-11786258864975456-bmw-850-v8-gran-coupe-1-vi-sobstvenik-v-garantsiya",
    "sourceId": "11786258864975456",
    "observedAt": "2026-09-09T03:00:38.749Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11786258864975456-1.webp",
    "gallery": [
      "/dealer/stock/11786258864975456-1.webp",
      "/dealer/stock/11786258864975456-2.webp",
      "/dealer/stock/11786258864975456-3.webp",
      "/dealer/stock/11786258864975456-4.webp",
      "/dealer/stock/11786258864975456-5.webp",
      "/dealer/stock/11786258864975456-6.webp"
    ],
    "category": "Седан",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 850 V8 Gran Coupe",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "107 000 км",
    "mileageKm": 107000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 54555,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "sample",
    "evidenceUrl": "https://mg7group.mobile.bg/obiava-21782394387362812-bmw-x6-m-sport-v-garantsiya-do-09-2027g",
    "sourceId": "21782394387362812",
    "observedAt": "2026-09-09T03:00:38.749Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/21782394387362812-1.webp",
    "gallery": [
      "/dealer/stock/21782394387362812-1.webp",
      "/dealer/stock/21782394387362812-2.webp",
      "/dealer/stock/21782394387362812-3.webp",
      "/dealer/stock/21782394387362812-4.webp",
      "/dealer/stock/21782394387362812-5.webp",
      "/dealer/stock/21782394387362812-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X6 M Sport",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "141 000 км",
    "mileageKm": 141000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 45000,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "sample",
    "evidenceUrl": "https://mg7group.mobile.bg/obiava-11774522821457814-mercedes-benz-e-53-amg-coupe-amg",
    "sourceId": "11774522821457814",
    "observedAt": "2026-09-09T03:00:38.749Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11774522821457814-1.webp",
    "gallery": [
      "/dealer/stock/11774522821457814-1.webp",
      "/dealer/stock/11774522821457814-2.webp",
      "/dealer/stock/11774522821457814-3.webp",
      "/dealer/stock/11774522821457814-4.webp",
      "/dealer/stock/11774522821457814-5.webp",
      "/dealer/stock/11774522821457814-6.webp"
    ],
    "category": "Купе",
    "body": "Coupe",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 53 AMG Coupe",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "144 000 км",
    "mileageKm": 144000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 31000,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "sample",
    "evidenceUrl": "https://mg7group.mobile.bg/obiava-11784017637362453-chevrolet-camaro-palna-servizna-istoriya-90-700km",
    "sourceId": "11784017637362453",
    "observedAt": "2026-09-09T03:00:38.750Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11784017637362453-1.webp",
    "gallery": [
      "/dealer/stock/11784017637362453-1.webp",
      "/dealer/stock/11784017637362453-2.webp",
      "/dealer/stock/11784017637362453-3.webp",
      "/dealer/stock/11784017637362453-4.webp",
      "/dealer/stock/11784017637362453-5.webp",
      "/dealer/stock/11784017637362453-6.webp"
    ],
    "category": "Кабрио",
    "body": "Convertible",
    "make": "Chevrolet",
    "title": "Chevrolet Camaro",
    "year": "2000",
    "yearNumber": 2000,
    "mileage": "90 700 км",
    "mileageKm": 90700,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 5300,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "sample",
    "evidenceUrl": "https://mg7group.mobile.bg/obiava-11787220789122620-bmw-840-ci-m-sport",
    "sourceId": "11787220789122620",
    "observedAt": "2026-09-09T03:00:38.750Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11787220789122620-1.webp",
    "gallery": [
      "/dealer/stock/11787220789122620-1.webp",
      "/dealer/stock/11787220789122620-2.webp",
      "/dealer/stock/11787220789122620-3.webp",
      "/dealer/stock/11787220789122620-4.webp",
      "/dealer/stock/11787220789122620-5.webp",
      "/dealer/stock/11787220789122620-6.webp"
    ],
    "category": "Купе",
    "body": "Coupe",
    "make": "BMW",
    "title": "BMW 840Ci M Sport",
    "year": "1995",
    "yearNumber": 1995,
    "mileage": "173 000 км",
    "mileageKm": 173000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 24900,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "sample",
    "evidenceUrl": "https://mg7group.mobile.bg/obiava-11787219518736875-audi-a8-50-tdi-v6",
    "sourceId": "11787219518736875",
    "observedAt": "2026-09-09T03:00:38.750Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11787219518736875-1.webp",
    "gallery": [
      "/dealer/stock/11787219518736875-1.webp",
      "/dealer/stock/11787219518736875-2.webp",
      "/dealer/stock/11787219518736875-3.webp",
      "/dealer/stock/11787219518736875-4.webp",
      "/dealer/stock/11787219518736875-5.webp",
      "/dealer/stock/11787219518736875-6.webp"
    ],
    "category": "Седан",
    "body": "Sedan",
    "make": "Audi",
    "title": "Audi A8 50 TDI V6",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "175 000 км",
    "mileageKm": 175000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 29900,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "sample",
    "evidenceUrl": "https://mg7group.mobile.bg/obiava-11787042642128831-audi-a6-allroad-50-tdi-v6-286hp-dosie-ot-0-km",
    "sourceId": "11787042642128831",
    "observedAt": "2026-09-09T03:00:38.750Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11787042642128831-1.webp",
    "gallery": [
      "/dealer/stock/11787042642128831-1.webp",
      "/dealer/stock/11787042642128831-2.webp",
      "/dealer/stock/11787042642128831-3.webp",
      "/dealer/stock/11787042642128831-4.webp",
      "/dealer/stock/11787042642128831-5.webp",
      "/dealer/stock/11787042642128831-6.webp"
    ],
    "category": "Комби",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A6 Allroad 50 TDI V6",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "115 000 км",
    "mileageKm": 115000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 27000,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "sample",
    "evidenceUrl": "https://mg7group.mobile.bg/obiava-11754657468074384-porsche-911-997-turbo-mezger-carbon-akrapovic",
    "sourceId": "11754657468074384",
    "observedAt": "2026-09-09T03:00:38.750Z",
    "taxLabel": "Не се начислява ДДС",
    "image": "/dealer/stock/11754657468074384-1.webp",
    "gallery": [
      "/dealer/stock/11754657468074384-1.webp",
      "/dealer/stock/11754657468074384-2.webp",
      "/dealer/stock/11754657468074384-3.webp",
      "/dealer/stock/11754657468074384-4.webp",
      "/dealer/stock/11754657468074384-5.webp",
      "/dealer/stock/11754657468074384-6.webp"
    ],
    "category": "Купе",
    "body": "Coupe",
    "make": "Porsche",
    "title": "Porsche 911 997 Turbo",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "79 907 км",
    "mileageKm": 79907,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 83000,
    "href": "/listing-detail-v1/10"
  }
];
export const formatVehiclePrice = (priceEur: number | null | undefined) => typeof priceEur === "number" && priceEur > 0 ? `${new Intl.NumberFormat("bg-BG").format(priceEur)} €` : "Цена при запитване";
