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
  image: string;
  gallery: string[];
  description: string;
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

// Equipment facets are limited to recurring features published in LEGEND AUTO's
// current adverts for these model families (legendauto1.mobile.bg, checked 2026-08-30).
export const featuredVehicles: Vehicle[] = [
  {
    "id": 1,
    "image": "/assets/legend-auto/vehicle-01-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-01-1.webp",
      "/assets/legend-auto/vehicle-01-2.webp",
      "/assets/legend-auto/vehicle-01-3.webp",
      "/assets/legend-auto/vehicle-01-4.webp",
      "/assets/legend-auto/vehicle-01-5.webp"
    ],
    "description": "Audi Q4 Q4 e-tron 45 QUATTRO, DIGITAL, ТЕРМОПОМПА 29000km. 2024 г., 29 000 км, електрически, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11774263732166588-audi-q4-q4-e-tron-45-quattro-digital-termopompa-29000km",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q4 Q4 e-tron 45 QUATTRO, DIGITAL, ТЕРМОПОМПА 29000km",
    "year": "2024",
    "yearNumber": 2024,
    "mileage": "29 000 км",
    "mileageKm": 29000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник",
      "Подгряване на седалки",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 37999,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "image": "/assets/legend-auto/vehicle-02-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-02-1.webp",
      "/assets/legend-auto/vehicle-02-2.webp",
      "/assets/legend-auto/vehicle-02-3.webp",
      "/assets/legend-auto/vehicle-02-4.webp",
      "/assets/legend-auto/vehicle-02-5.webp"
    ],
    "description": "Seat Leon 2.0TDI. 2017 г., 200 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11784618839120443-seat-leon-2-0tdi",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Seat",
    "title": "Seat Leon 2.0TDI",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "200 000 км",
    "mileageKm": 200000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник",
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 7999,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "image": "/assets/legend-auto/vehicle-03-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-03-1.webp",
      "/assets/legend-auto/vehicle-03-2.webp",
      "/assets/legend-auto/vehicle-03-3.webp",
      "/assets/legend-auto/vehicle-03-4.webp",
      "/assets/legend-auto/vehicle-03-5.webp"
    ],
    "description": "VW Tiguan 2.0TDI 150 к.с DSG 122000км НАВИГАЦИЯ. 2019 г., 122 000 км, дизел, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-21785269571488349-vw-tiguan-2-0tdi-150-k-s-dsg-122000km-navigatsiya",
    "category": "Джип",
    "body": "SUV",
    "make": "VW",
    "title": "VW Tiguan 2.0TDI 150 к.с DSG 122000км НАВИГАЦИЯ",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "122 000 км",
    "mileageKm": 122000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 16999,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "image": "/assets/legend-auto/vehicle-04-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-04-1.webp",
      "/assets/legend-auto/vehicle-04-2.webp",
      "/assets/legend-auto/vehicle-04-3.webp",
      "/assets/legend-auto/vehicle-04-4.webp",
      "/assets/legend-auto/vehicle-04-5.webp"
    ],
    "description": "VW Passat 2.0TDI DSG НАВИГАЦИЯ .ПОДГРЕВ НА СЕДАЛКИ. 2015 г., 220 000 км, дизел, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11788186558085673-vw-passat-2-0tdi-dsg-navigatsiya-podgrev-na-sedalki",
    "category": "Комби",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat 2.0TDI DSG НАВИГАЦИЯ .ПОДГРЕВ НА СЕДАЛКИ",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "220 000 км",
    "mileageKm": 220000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник",
      "Подгряване на седалки",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 9999,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "image": "/assets/legend-auto/vehicle-05-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-05-1.webp",
      "/assets/legend-auto/vehicle-05-2.webp",
      "/assets/legend-auto/vehicle-05-3.webp",
      "/assets/legend-auto/vehicle-05-4.webp",
      "/assets/legend-auto/vehicle-05-5.webp"
    ],
    "description": "VW Golf 1.9TDI 105к.с. 2005 г., 205 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11788202283254523-vw-golf-1-9tdi-105k-s",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Golf 1.9TDI 105к.с",
    "year": "2005",
    "yearNumber": 2005,
    "mileage": "205 000 км",
    "mileageKm": 205000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 3599,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "image": "/assets/legend-auto/vehicle-06-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-06-1.webp",
      "/assets/legend-auto/vehicle-06-2.webp",
      "/assets/legend-auto/vehicle-06-3.webp",
      "/assets/legend-auto/vehicle-06-4.webp",
      "/assets/legend-auto/vehicle-06-5.webp"
    ],
    "description": "Toyota Yaris 1.5 Хибрид Камера 4л/100км. 2012 г., 169 000 км, хибрид, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11782331844226239-toyota-yaris-1-5-hibrid-kamera-4l-100km",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Toyota",
    "title": "Toyota Yaris 1.5 Хибрид Камера 4л/100км",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "169 000 км",
    "mileageKm": 169000,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 7999,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "image": "/assets/legend-auto/vehicle-07-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-07-1.webp",
      "/assets/legend-auto/vehicle-07-2.webp",
      "/assets/legend-auto/vehicle-07-3.webp",
      "/assets/legend-auto/vehicle-07-4.webp",
      "/assets/legend-auto/vehicle-07-5.webp"
    ],
    "description": "Toyota Rav4 2.5 HYBRID/ГАЗ FULL НАВИГАЦИЯ, КОЖЕН САЛОН, FULL. 2022 г., 252 000 км, хибрид, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-21787135215316819-toyota-rav4-2-5-hybrid-gaz-full-navigatsiya-kozhen-salon-full",
    "category": "Джип",
    "body": "SUV",
    "make": "Toyota",
    "title": "Toyota Rav4 2.5 HYBRID/ГАЗ FULL НАВИГАЦИЯ, КОЖЕН САЛОН, FULL",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "252 000 км",
    "mileageKm": 252000,
    "fuel": "Хибрид",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник",
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 26999,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "image": "/assets/legend-auto/vehicle-08-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-08-1.webp",
      "/assets/legend-auto/vehicle-08-2.webp",
      "/assets/legend-auto/vehicle-08-3.webp",
      "/assets/legend-auto/vehicle-08-4.webp",
      "/assets/legend-auto/vehicle-08-5.webp"
    ],
    "description": "Toyota Auris 2.0D4D. 2009 г., 229 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11786699392982478-toyota-auris-2-0d4d",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Toyota",
    "title": "Toyota Auris 2.0D4D",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "229 000 км",
    "mileageKm": 229000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4399,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "image": "/assets/legend-auto/vehicle-09-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-09-1.webp",
      "/assets/legend-auto/vehicle-09-2.webp",
      "/assets/legend-auto/vehicle-09-3.webp",
      "/assets/legend-auto/vehicle-09-4.webp",
      "/assets/legend-auto/vehicle-09-5.webp"
    ],
    "description": "Skoda Scala 1.6TDI. 2019 г., 180 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11787054081251501-skoda-scala-1-6tdi",
    "category": "Комби",
    "body": "Wagon",
    "make": "Skoda",
    "title": "Skoda Scala 1.6TDI",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "180 000 км",
    "mileageKm": 180000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник",
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 11999,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "image": "/assets/legend-auto/vehicle-10-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-10-1.webp",
      "/assets/legend-auto/vehicle-10-2.webp",
      "/assets/legend-auto/vehicle-10-3.webp",
      "/assets/legend-auto/vehicle-10-4.webp",
      "/assets/legend-auto/vehicle-10-5.webp"
    ],
    "description": "Renault Zoe 52kw 78000km Собствена батерия. 2020 г., 78 000 км, електрически, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11787771672265620-renault-zoe-52kw-78000km-sobstvena-bateriya",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Renault",
    "title": "Renault Zoe 52kw 78000km Собствена батерия",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "78 000 км",
    "mileageKm": 78000,
    "fuel": "Електрически",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 14299,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "image": "/assets/legend-auto/vehicle-11-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-11-1.webp",
      "/assets/legend-auto/vehicle-11-2.webp",
      "/assets/legend-auto/vehicle-11-3.webp",
      "/assets/legend-auto/vehicle-11-4.webp",
      "/assets/legend-auto/vehicle-11-5.webp"
    ],
    "description": "Renault Clio 1.2 БЕНЗИН. 2014 г., 150 000 км, бензин, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11777013326319103-renault-clio-1-2-benzin",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Renault",
    "title": "Renault Clio 1.2 БЕНЗИН",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "150 000 км",
    "mileageKm": 150000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 5199,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "image": "/assets/legend-auto/vehicle-12-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-12-1.webp",
      "/assets/legend-auto/vehicle-12-2.webp",
      "/assets/legend-auto/vehicle-12-3.webp",
      "/assets/legend-auto/vehicle-12-4.webp",
      "/assets/legend-auto/vehicle-12-5.webp"
    ],
    "description": "Peugeot 508 2.0HDI. 2013 г., 232 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11764232323880460-peugeot-508-2-0hdi",
    "category": "Комби",
    "body": "Wagon",
    "make": "Peugeot",
    "title": "Peugeot 508 2.0HDI",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "232 000 км",
    "mileageKm": 232000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4299,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "image": "/assets/legend-auto/vehicle-13-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-13-1.webp",
      "/assets/legend-auto/vehicle-13-2.webp",
      "/assets/legend-auto/vehicle-13-3.webp",
      "/assets/legend-auto/vehicle-13-4.webp",
      "/assets/legend-auto/vehicle-13-5.webp"
    ],
    "description": "Opel Astra 1.6. 2017 г., 193 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11786966551654053-opel-astra-1-6",
    "category": "Комби",
    "body": "Wagon",
    "make": "Opel",
    "title": "Opel Astra 1.6",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "193 000 км",
    "mileageKm": 193000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6599,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "image": "/assets/legend-auto/vehicle-14-1.webp",
    "gallery": [
      "/assets/legend-auto/vehicle-14-1.webp",
      "/assets/legend-auto/vehicle-14-2.webp",
      "/assets/legend-auto/vehicle-14-3.webp",
      "/assets/legend-auto/vehicle-14-4.webp",
      "/assets/legend-auto/vehicle-14-5.webp"
    ],
    "description": "Opel Agila 1.3i Внос от Италия. 2008 г., 120 000 км, бензин, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед.",
    "sourceUrl": "https://legendauto1.mobile.bg/obiava-11725562013563390-opel-agila-1-3i-vnos-ot-italiya",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Opel",
    "title": "Opel Agila 1.3i Внос от Италия",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "120 000 км",
    "mileageKm": 120000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2500,
    "href": "/listing-detail-v1/14"
  }
];

export const formatVehiclePrice = (priceEur: number) => `${new Intl.NumberFormat('bg-BG').format(priceEur)} €`;
