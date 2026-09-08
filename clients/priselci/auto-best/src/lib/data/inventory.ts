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
  sourceUrl: string;
  description: string;
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

// Representative Mobile.bg sale listings captured 2026-09-07; confirm availability.
export const featuredVehicles: Vehicle[] = [
  {
    "id": 1,
    "image": "/assets/priselci/vehicle-01-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-01-1.webp",
      "/assets/priselci/vehicle-01-2.webp",
      "/assets/priselci/vehicle-01-3.webp",
      "/assets/priselci/vehicle-01-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11784527405061757-vw-golf-1-4-benzin",
    "description": "VW Golf 1.4 БЕНЗИН, 2007 г., 235 193 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Golf 1.4 БЕНЗИН",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "235 193 км",
    "mileageKm": 235193,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3600,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "image": "/assets/priselci/vehicle-02-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-02-1.webp",
      "/assets/priselci/vehicle-02-2.webp",
      "/assets/priselci/vehicle-02-3.webp",
      "/assets/priselci/vehicle-02-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11758270885113337-vw-passat-1-4-benzin",
    "description": "VW Passat 1.4 БЕНЗИН, 2010 г., 179 848 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Комби",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat 1.4 БЕНЗИН",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "179 848 км",
    "mileageKm": 179848,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4299,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "image": "/assets/priselci/vehicle-03-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-03-1.webp",
      "/assets/priselci/vehicle-03-2.webp",
      "/assets/priselci/vehicle-03-3.webp",
      "/assets/priselci/vehicle-03-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11753962633467246-vw-passat-2-0tdi-commonrail",
    "description": "VW Passat 2.0TDI COMMONRAIL, 2008 г., 210 534 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Комби",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat 2.0TDI COMMONRAIL",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "210 534 км",
    "mileageKm": 210534,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3900,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "image": "/assets/priselci/vehicle-04-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-04-1.webp",
      "/assets/priselci/vehicle-04-2.webp",
      "/assets/priselci/vehicle-04-3.webp",
      "/assets/priselci/vehicle-04-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11784527857493559-seat-ibiza-1-2-benzin",
    "description": "Seat Ibiza 1.2 БЕНЗИН, 2010 г., 175 532 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Seat",
    "title": "Seat Ibiza 1.2 БЕНЗИН",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "175 532 км",
    "mileageKm": 175532,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3499,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "image": "/assets/priselci/vehicle-05-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-05-1.webp",
      "/assets/priselci/vehicle-05-2.webp",
      "/assets/priselci/vehicle-05-3.webp",
      "/assets/priselci/vehicle-05-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-21754395406651747-renault-koleos-2-0-dizel-4h4",
    "description": "Renault Koleos 2.0 ДИЗЕЛ 4Х4, 2010 г., 181 246 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "SUV",
    "body": "SUV",
    "make": "Renault",
    "title": "Renault Koleos 2.0 ДИЗЕЛ 4Х4",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "181 246 км",
    "mileageKm": 181246,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 44299,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "image": "/assets/priselci/vehicle-06-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-06-1.webp",
      "/assets/priselci/vehicle-06-2.webp",
      "/assets/priselci/vehicle-06-3.webp",
      "/assets/priselci/vehicle-06-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11781856640282742-peugeot-307-cc-kabrio",
    "description": "Peugeot 307 CC КАБРИО, 2006 г., 205 664 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Кабрио",
    "body": "Convertible",
    "make": "Peugeot",
    "title": "Peugeot 307 CC КАБРИО",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "205 664 км",
    "mileageKm": 205664,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2899,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "image": "/assets/priselci/vehicle-07-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-07-1.webp",
      "/assets/priselci/vehicle-07-2.webp",
      "/assets/priselci/vehicle-07-3.webp",
      "/assets/priselci/vehicle-07-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11759747090481666-ford-mondeo-2-0-dizel",
    "description": "Ford Mondeo 2.0 DIZEL, 2009 г., 235 788 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Комби",
    "body": "Wagon",
    "make": "Ford",
    "title": "Ford Mondeo 2.0 DIZEL",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "235 788 км",
    "mileageKm": 235788,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3299,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "image": "/assets/priselci/vehicle-08-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-08-1.webp",
      "/assets/priselci/vehicle-08-2.webp",
      "/assets/priselci/vehicle-08-3.webp",
      "/assets/priselci/vehicle-08-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11776863022154449-peugeot-5008-2-0hdi-150k-s",
    "description": "Peugeot 5008 2.0HDI 150К.С, 2011 г., 210 452 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Ван",
    "body": "Minivan",
    "make": "Peugeot",
    "title": "Peugeot 5008 2.0HDI 150К.С",
    "year": "2011",
    "yearNumber": 2011,
    "mileage": "210 452 км",
    "mileageKm": 210452,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 5099,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "image": "/assets/priselci/vehicle-09-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-09-1.webp",
      "/assets/priselci/vehicle-09-2.webp",
      "/assets/priselci/vehicle-09-3.webp",
      "/assets/priselci/vehicle-09-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11751891575433302-mercedes-benz-c-200-2-2-cdi",
    "description": "Mercedes-Benz C 200 2.2 CDI, 2004 г., 218 432 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Комби",
    "body": "Wagon",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz C 200 2.2 CDI",
    "year": "2004",
    "yearNumber": 2004,
    "mileage": "218 432 км",
    "mileageKm": 218432,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2799,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "image": "/assets/priselci/vehicle-10-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-10-1.webp",
      "/assets/priselci/vehicle-10-2.webp",
      "/assets/priselci/vehicle-10-3.webp",
      "/assets/priselci/vehicle-10-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11787126157294169-citroen-c3-picasso-1-6hdi-90k-s",
    "description": "Citroen C3 Picasso 1.6HDI 90К.С, 2010 г., 185 783 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Citroen",
    "title": "Citroen C3 Picasso 1.6HDI 90К.С",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "185 783 км",
    "mileageKm": 185783,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3499,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "image": "/assets/priselci/vehicle-11-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-11-1.webp",
      "/assets/priselci/vehicle-11-2.webp",
      "/assets/priselci/vehicle-11-3.webp",
      "/assets/priselci/vehicle-11-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11784638939574277-audi-a3-1-9-tdi-105ps",
    "description": "Audi A3 1.9 TDI 105ps, 2009 г., 253 746 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A3 1.9 TDI 105ps",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "253 746 км",
    "mileageKm": 253746,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4699,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "image": "/assets/priselci/vehicle-12-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-12-1.webp",
      "/assets/priselci/vehicle-12-2.webp",
      "/assets/priselci/vehicle-12-3.webp",
      "/assets/priselci/vehicle-12-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11779190417819998-dacia-sandero-1-4-benzin-gaz",
    "description": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ, 2009 г., 136 016 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Dacia",
    "title": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "136 016 км",
    "mileageKm": 136016,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 2500,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "image": "/assets/priselci/vehicle-13-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-13-1.webp",
      "/assets/priselci/vehicle-13-2.webp",
      "/assets/priselci/vehicle-13-3.webp",
      "/assets/priselci/vehicle-13-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11770812815337634-renault-grand-scenic-1-5dci",
    "description": "Renault Grand scenic 1.5DCI, 2012 г., 199 811 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Ван",
    "body": "Minivan",
    "make": "Renault",
    "title": "Renault Grand scenic 1.5DCI",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "199 811 км",
    "mileageKm": 199811,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4299,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "image": "/assets/priselci/vehicle-14-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-14-1.webp",
      "/assets/priselci/vehicle-14-2.webp",
      "/assets/priselci/vehicle-14-3.webp",
      "/assets/priselci/vehicle-14-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-21786691566300206-bmw-x3-2-0-dizel-4h4",
    "description": "BMW X3 2.0 ДИЗЕЛ 4Х4, 2007 г., 207 195 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "SUV",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X3 2.0 ДИЗЕЛ 4Х4",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "207 195 км",
    "mileageKm": 207195,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 44399,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "image": "/assets/priselci/vehicle-15-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-15-1.webp",
      "/assets/priselci/vehicle-15-2.webp",
      "/assets/priselci/vehicle-15-3.webp",
      "/assets/priselci/vehicle-15-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-21787900875118991-nissan-qashqai-1-5-dci",
    "description": "Nissan Qashqai 1.5 DCI, 2012 г., 192 641 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "SUV",
    "body": "SUV",
    "make": "Nissan",
    "title": "Nissan Qashqai 1.5 DCI",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "192 641 км",
    "mileageKm": 192641,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 5499,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "image": "/assets/priselci/vehicle-16-1.webp",
    "gallery": [
      "/assets/priselci/vehicle-16-1.webp",
      "/assets/priselci/vehicle-16-2.webp",
      "/assets/priselci/vehicle-16-3.webp",
      "/assets/priselci/vehicle-16-4.webp"
    ],
    "sourceUrl": "https://priselci.mobile.bg/obiava-11763969547989753-mercedes-benz-e-280-3-0cdi-v6",
    "description": "Mercedes-Benz E 280 3.0CDI V6, 2005 г., 208 357 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "category": "Седан",
    "body": "Sedan",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz E 280 3.0CDI V6",
    "year": "2005",
    "yearNumber": 2005,
    "mileage": "208 357 км",
    "mileageKm": 208357,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 64100,
    "href": "/listing-detail-v1/16"
  }
];

export const formatVehiclePrice = (priceEur: number) => `${new Intl.NumberFormat('bg-BG').format(priceEur)} €`;
