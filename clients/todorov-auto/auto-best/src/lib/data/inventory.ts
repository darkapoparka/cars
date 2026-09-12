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
    "evidenceUrl": "https://todorovauto.mobile.bg/obiava-11763371717307272-renault-captur-1-3tce-intens-140ks",
    "sourceId": "11763371717307272",
    "observedAt": "2026-09-09T01:47:15.697Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11763371717307272-1.webp",
    "gallery": [
      "/dealer/stock/11763371717307272-1.webp",
      "/dealer/stock/11763371717307272-2.webp",
      "/dealer/stock/11763371717307272-3.webp",
      "/dealer/stock/11763371717307272-4.webp",
      "/dealer/stock/11763371717307272-5.webp",
      "/dealer/stock/11763371717307272-6.webp"
    ],
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Renault",
    "title": "Renault Captur 1.3 TCe Intens",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "46 000 км",
    "mileageKm": 46000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 16450,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "verification": "sample",
    "evidenceUrl": "https://todorovauto.mobile.bg/obiava-11704208021161812-nissan-micra-ig-tacenta-xtronic92k",
    "sourceId": "11704208021161812",
    "observedAt": "2026-09-09T01:47:15.699Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11704208021161812-1.webp",
    "gallery": [
      "/dealer/stock/11704208021161812-1.webp",
      "/dealer/stock/11704208021161812-2.webp",
      "/dealer/stock/11704208021161812-3.webp",
      "/dealer/stock/11704208021161812-4.webp",
      "/dealer/stock/11704208021161812-5.webp",
      "/dealer/stock/11704208021161812-6.webp"
    ],
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Nissan",
    "title": "Nissan Micra IG-T Acenta Xtronic",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "14 144 км",
    "mileageKm": 14144,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 11950,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "verification": "sample",
    "evidenceUrl": "https://todorovauto.mobile.bg/obiava-11735041255980884-nissan-leaf-2-zeroemission-150ks",
    "sourceId": "11735041255980884",
    "observedAt": "2026-09-09T01:47:15.700Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11735041255980884-1.webp",
    "gallery": [
      "/dealer/stock/11735041255980884-1.webp",
      "/dealer/stock/11735041255980884-2.webp",
      "/dealer/stock/11735041255980884-3.webp",
      "/dealer/stock/11735041255980884-4.webp",
      "/dealer/stock/11735041255980884-5.webp",
      "/dealer/stock/11735041255980884-6.webp"
    ],
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Nissan",
    "title": "Nissan Leaf 2 ZeroEmission",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "102 600 км",
    "mileageKm": 102600,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 11250,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "verification": "sample",
    "evidenceUrl": "https://todorovauto.mobile.bg/obiava-11757098776259646-toyota-yaris-1-5i-hybrid",
    "sourceId": "11757098776259646",
    "observedAt": "2026-09-09T01:47:15.700Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11757098776259646-1.webp",
    "gallery": [
      "/dealer/stock/11757098776259646-1.webp",
      "/dealer/stock/11757098776259646-2.webp",
      "/dealer/stock/11757098776259646-3.webp",
      "/dealer/stock/11757098776259646-4.webp",
      "/dealer/stock/11757098776259646-5.webp",
      "/dealer/stock/11757098776259646-6.webp"
    ],
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Toyota",
    "title": "Toyota Yaris 1.5 Hybrid",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "139 590 км",
    "mileageKm": 139590,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 8690,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "verification": "sample",
    "evidenceUrl": "https://todorovauto.mobile.bg/obiava-11649235957114307-renault-megane-1-5-dci-zen-110-k-s",
    "sourceId": "11649235957114307",
    "observedAt": "2026-09-09T01:47:15.701Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11649235957114307-1.webp",
    "gallery": [
      "/dealer/stock/11649235957114307-1.webp",
      "/dealer/stock/11649235957114307-2.webp",
      "/dealer/stock/11649235957114307-3.webp",
      "/dealer/stock/11649235957114307-4.webp",
      "/dealer/stock/11649235957114307-5.webp",
      "/dealer/stock/11649235957114307-6.webp"
    ],
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Renault",
    "title": "Renault Megane 1.5 dCi Zen",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "129 000 км",
    "mileageKm": 129000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 9800,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "verification": "sample",
    "evidenceUrl": "https://todorovauto.mobile.bg/obiava-11784299299170761-peugeot-2008-1-2pt-allure-premium",
    "sourceId": "11784299299170761",
    "observedAt": "2026-09-09T01:47:15.701Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11784299299170761-1.webp",
    "gallery": [
      "/dealer/stock/11784299299170761-1.webp",
      "/dealer/stock/11784299299170761-2.webp",
      "/dealer/stock/11784299299170761-3.webp",
      "/dealer/stock/11784299299170761-4.webp",
      "/dealer/stock/11784299299170761-5.webp",
      "/dealer/stock/11784299299170761-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Peugeot",
    "title": "Peugeot 2008 Allure Premium",
    "year": "2025",
    "yearNumber": 2025,
    "mileage": "4000 км",
    "mileageKm": 4000,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 24900,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "verification": "sample",
    "evidenceUrl": "https://todorovauto.mobile.bg/obiava-21782384979656784-opel-crossland-x-1-2i-tp-ultim-110-k-s",
    "sourceId": "21782384979656784",
    "observedAt": "2026-09-09T01:47:15.702Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/21782384979656784-1.webp",
    "gallery": [
      "/dealer/stock/21782384979656784-1.webp",
      "/dealer/stock/21782384979656784-2.webp",
      "/dealer/stock/21782384979656784-3.webp",
      "/dealer/stock/21782384979656784-4.webp",
      "/dealer/stock/21782384979656784-5.webp",
      "/dealer/stock/21782384979656784-6.webp"
    ],
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Opel",
    "title": "Opel Crossland X 1.2 TP Ultim",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "115 403 км",
    "mileageKm": 115403,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "360° камера",
      "Подгряване на седалки",
      "Навигация",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 10450,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "verification": "sample",
    "evidenceUrl": "https://todorovauto.mobile.bg/obiava-11701427910651766-opel-astra-1-6cdtiecofenjoy136ks",
    "sourceId": "11701427910651766",
    "observedAt": "2026-09-09T01:47:15.702Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11701427910651766-1.webp",
    "gallery": [
      "/dealer/stock/11701427910651766-1.webp",
      "/dealer/stock/11701427910651766-2.webp",
      "/dealer/stock/11701427910651766-3.webp",
      "/dealer/stock/11701427910651766-4.webp",
      "/dealer/stock/11701427910651766-5.webp",
      "/dealer/stock/11701427910651766-6.webp"
    ],
    "category": "Комби",
    "body": "Wagon",
    "make": "Opel",
    "title": "Opel Astra 1.6 CDTi",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "166 000 км",
    "mileageKm": 166000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Подгряване на седалки",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 7400,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "verification": "sample",
    "evidenceUrl": "https://todorovauto.mobile.bg/obiava-21784126666986144-mercedes-benz-glc-43-amg-4matic-390-k-s",
    "sourceId": "21784126666986144",
    "observedAt": "2026-09-09T01:47:15.704Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/21784126666986144-1.webp",
    "gallery": [
      "/dealer/stock/21784126666986144-1.webp",
      "/dealer/stock/21784126666986144-2.webp",
      "/dealer/stock/21784126666986144-3.webp",
      "/dealer/stock/21784126666986144-4.webp",
      "/dealer/stock/21784126666986144-5.webp",
      "/dealer/stock/21784126666986144-6.webp"
    ],
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLC 43 AMG 4Matic",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "142 065 км",
    "mileageKm": 142065,
    "fuel": "Бензин",
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
    "priceEur": 35750,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "verification": "sample",
    "evidenceUrl": "https://todorovauto.mobile.bg/obiava-11776511305281815-vw-caddy-1-4tsi-bluemotion-technology-dsg",
    "sourceId": "11776511305281815",
    "observedAt": "2026-09-09T01:47:15.705Z",
    "taxLabel": "Цената е с включено ДДС",
    "image": "/dealer/stock/11776511305281815-1.webp",
    "gallery": [
      "/dealer/stock/11776511305281815-1.webp",
      "/dealer/stock/11776511305281815-2.webp",
      "/dealer/stock/11776511305281815-3.webp",
      "/dealer/stock/11776511305281815-4.webp",
      "/dealer/stock/11776511305281815-5.webp",
      "/dealer/stock/11776511305281815-6.webp"
    ],
    "category": "Ван",
    "body": "Minivan",
    "make": "VW",
    "title": "VW Caddy 1.4 TSI DSG",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "192 781 км",
    "mileageKm": 192781,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 9450,
    "href": "/listing-detail-v1/10"
  }
];
export const formatVehiclePrice = (priceEur: number | null | undefined) => typeof priceEur === "number" && priceEur > 0 ? `${new Intl.NumberFormat("bg-BG").format(priceEur)} €` : "Цена при запитване";
