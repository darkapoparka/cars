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
  images: string[];
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

// Equipment facets are limited to recurring features published in Аутолайф's
// current adverts for these model families (autolife.mobile.bg, checked 2026-08-30).
export const featuredVehicles: Vehicle[] = [
  {
    "id": 1,
    "image": "/assets/autolife/vehicle-01-1.webp",
    "images": [
      "/assets/autolife/vehicle-01-1.webp",
      "/assets/autolife/vehicle-01-2.webp",
      "/assets/autolife/vehicle-01-3.webp",
      "/assets/autolife/vehicle-01-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-21769682585171886-bmw-x4-2-0d-190-m-packet-full-mcar-varna",
    "description": "BMW X4 2.0D-190 M PACKET FULL MCAR VARNA, 2017 г., 190 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X4 2.0D-190",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "190 000 км",
    "mileageKm": 190000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 20500,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "image": "/assets/autolife/vehicle-02-1.webp",
    "images": [
      "/assets/autolife/vehicle-02-1.webp",
      "/assets/autolife/vehicle-02-2.webp",
      "/assets/autolife/vehicle-02-3.webp",
      "/assets/autolife/vehicle-02-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11770980926901387-seat-alhambra-2-0tdi-150-koja-navi-camera-panorama-dsg-distr-el",
    "description": "Seat Alhambra 2.0TDI-150 KOJA NAVI CAMERA PANORAMA DSG DISTR EL., 2015 г., 244 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Ван",
    "body": "Van",
    "make": "Seat",
    "title": "Seat Alhambra 2.0TDI-150",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "244 000 км",
    "mileageKm": 244000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 11999,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "image": "/assets/autolife/vehicle-03-1.webp",
    "images": [
      "/assets/autolife/vehicle-03-1.webp",
      "/assets/autolife/vehicle-03-2.webp",
      "/assets/autolife/vehicle-03-3.webp",
      "/assets/autolife/vehicle-03-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11741772051965725-ford-ka-1-5duratorq-active-euro6d",
    "description": "Ford Ka + 1.5DURATORQ ACTIVE EURO6D, 2018 г., 119 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "Ford",
    "title": "Ford Ka +",
    "year": "2018",
    "yearNumber": 2018,
    "mileage": "119 000 км",
    "mileageKm": 119000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 6999,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "image": "/assets/autolife/vehicle-04-1.webp",
    "images": [
      "/assets/autolife/vehicle-04-1.webp",
      "/assets/autolife/vehicle-04-2.webp",
      "/assets/autolife/vehicle-04-3.webp",
      "/assets/autolife/vehicle-04-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11751025134623319-vw-golf-1-6tdi-bluemotion",
    "description": "VW Golf 1.6TDI BLUEMOTION, 2010 г., 250 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Golf 1.6TDI",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "250 000 км",
    "mileageKm": 250000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4500,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "image": "/assets/autolife/vehicle-05-1.webp",
    "images": [
      "/assets/autolife/vehicle-05-1.webp",
      "/assets/autolife/vehicle-05-2.webp",
      "/assets/autolife/vehicle-05-3.webp",
      "/assets/autolife/vehicle-05-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11768209424885033-seat-altea-facelift-b-gpl",
    "description": "Seat Altea FACELIFT B/GPL, 2010 г., 242 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Seat",
    "title": "Seat Altea FACELIFT",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "242 000 км",
    "mileageKm": 242000,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 3999,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "image": "/assets/autolife/vehicle-06-1.webp",
    "images": [
      "/assets/autolife/vehicle-06-1.webp",
      "/assets/autolife/vehicle-06-2.webp",
      "/assets/autolife/vehicle-06-3.webp",
      "/assets/autolife/vehicle-06-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11762785459915323-audi-a4-sline-4x4-distr-digital-matrix-key-less-blind-spot",
    "description": "Audi A4 Sline 4x4 DISTR DIGITAL MATRIX KEY LESS BLIND SPOT, 2021 г., 186 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Комби",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A4 Sline",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "186 000 км",
    "mileageKm": 186000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 20500,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "image": "/assets/autolife/vehicle-07-1.webp",
    "images": [
      "/assets/autolife/vehicle-07-1.webp",
      "/assets/autolife/vehicle-07-2.webp",
      "/assets/autolife/vehicle-07-3.webp",
      "/assets/autolife/vehicle-07-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11752841612433166-citroen-c5-2-2-hdi-170-full",
    "description": "Citroen C5 2.2 HDI 170 FULL, 2008 г., 217 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Седан",
    "body": "Sedan",
    "make": "Citroen",
    "title": "Citroen C5 2.2",
    "year": "2008",
    "yearNumber": 2008,
    "mileage": "217 000 км",
    "mileageKm": 217000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 3700,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "image": "/assets/autolife/vehicle-08-1.webp",
    "images": [
      "/assets/autolife/vehicle-08-1.webp",
      "/assets/autolife/vehicle-08-2.webp",
      "/assets/autolife/vehicle-08-3.webp",
      "/assets/autolife/vehicle-08-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-21756807262024883-audi-q5-2-0tdi-170-panorama",
    "description": "Audi Q5 2.0TDI-170 PANORAMA, 2009 г., 224 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "Audi",
    "title": "Audi Q5 2.0TDI-170",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "224 000 км",
    "mileageKm": 224000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Парктроник",
      "Панорамен покрив"
    ],
    "condition": "used",
    "priceEur": 7999,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "image": "/assets/autolife/vehicle-09-1.webp",
    "images": [
      "/assets/autolife/vehicle-09-1.webp",
      "/assets/autolife/vehicle-09-2.webp",
      "/assets/autolife/vehicle-09-3.webp",
      "/assets/autolife/vehicle-09-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11768636298551646-vw-touran-2-0tdi-150-distr-camera-dsg",
    "description": "VW Touran 2.0TDI-150 DISTR. CAMERA DSG, 2021 г., 145 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Ван",
    "body": "Van",
    "make": "VW",
    "title": "VW Touran 2.0TDI-150",
    "year": "2021",
    "yearNumber": 2021,
    "mileage": "145 000 км",
    "mileageKm": 145000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 13999,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "image": "/assets/autolife/vehicle-10-1.webp",
    "images": [
      "/assets/autolife/vehicle-10-1.webp",
      "/assets/autolife/vehicle-10-2.webp",
      "/assets/autolife/vehicle-10-3.webp",
      "/assets/autolife/vehicle-10-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-21774977517199416-mercedes-benz-gle-coupe-350cdi-amg-distr-pano-camera-harman-kardon",
    "description": "Mercedes-Benz GLE Coupe 350CDI AMG DISTR. PANO CAMERA HARMAN/KARDON, 2017 г., 189 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz GLE Coupe",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "189 000 км",
    "mileageKm": 189000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 34500,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "image": "/assets/autolife/vehicle-11-1.webp",
    "images": [
      "/assets/autolife/vehicle-11-1.webp",
      "/assets/autolife/vehicle-11-2.webp",
      "/assets/autolife/vehicle-11-3.webp",
      "/assets/autolife/vehicle-11-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-21776689748685033-bmw-x1-2-0d-150-x-drive",
    "description": "BMW X1 2.0D-150 X-DRIVE, 2016 г., 250 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X1 2.0D-150",
    "year": "2016",
    "yearNumber": 2016,
    "mileage": "250 000 км",
    "mileageKm": 250000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Парктроник",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 11500,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "image": "/assets/autolife/vehicle-12-1.webp",
    "images": [
      "/assets/autolife/vehicle-12-1.webp",
      "/assets/autolife/vehicle-12-2.webp",
      "/assets/autolife/vehicle-12-3.webp",
      "/assets/autolife/vehicle-12-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11776774936356749-peugeot-508-active-bluehdi-130-s-s-eat8",
    "description": "Peugeot 508 ACTIVE BLUEHDI 130 S&S EAT8, 2019 г., 175 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Peugeot",
    "title": "Peugeot 508 ACTIVE",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "175 000 км",
    "mileageKm": 175000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Безключов достъп"
    ],
    "condition": "used",
    "priceEur": 12300,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "image": "/assets/autolife/vehicle-13-1.webp",
    "images": [
      "/assets/autolife/vehicle-13-1.webp",
      "/assets/autolife/vehicle-13-2.webp",
      "/assets/autolife/vehicle-13-3.webp",
      "/assets/autolife/vehicle-13-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-21778149802063175-vw-tiguan-facelift-2-0tdi-150-dsg-navi-camera-distr-car-play",
    "description": "VW Tiguan FACELIFT 2.0TDI-150 DSG NAVI CAMERA DISTR CAR PLAY, 2019 г., 214 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "VW",
    "title": "VW Tiguan FACELIFT",
    "year": "2019",
    "yearNumber": 2019,
    "mileage": "214 000 км",
    "mileageKm": 214000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 14999,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "image": "/assets/autolife/vehicle-14-1.webp",
    "images": [
      "/assets/autolife/vehicle-14-1.webp",
      "/assets/autolife/vehicle-14-2.webp",
      "/assets/autolife/vehicle-14-3.webp",
      "/assets/autolife/vehicle-14-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11778155314388381-volvo-s60-napalno-serviziran",
    "description": "Volvo S60 НАПЪЛНО СЕРВИЗИРАН, 2007 г., 470 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Седан",
    "body": "Sedan",
    "make": "Volvo",
    "title": "Volvo S60 НАПЪЛНО",
    "year": "2007",
    "yearNumber": 2007,
    "mileage": "470 000 км",
    "mileageKm": 470000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [],
    "condition": "used",
    "priceEur": 2500,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "image": "/assets/autolife/vehicle-15-1.webp",
    "images": [
      "/assets/autolife/vehicle-15-1.webp",
      "/assets/autolife/vehicle-15-2.webp",
      "/assets/autolife/vehicle-15-3.webp",
      "/assets/autolife/vehicle-15-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11787391986129616-vw-passat-2-0tdi-140",
    "description": "VW Passat 2.0TDI-140, 2012 г., 237 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Комби",
    "body": "Wagon",
    "make": "VW",
    "title": "VW Passat 2.0TDI-140",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "237 000 км",
    "mileageKm": 237000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник",
      "Подгряване на седалки"
    ],
    "condition": "used",
    "priceEur": 6300,
    "href": "/listing-detail-v1/15"
  },
  {
    "id": 16,
    "image": "/assets/autolife/vehicle-16-1.webp",
    "images": [
      "/assets/autolife/vehicle-16-1.webp",
      "/assets/autolife/vehicle-16-2.webp",
      "/assets/autolife/vehicle-16-3.webp",
      "/assets/autolife/vehicle-16-4.webp"
    ],
    "sourceUrl": "https://autolife.mobile.bg/obiava-11779369221509132-vw-polo-1-6-tdi-highline-dsg-navi-car-play-android-auto",
    "description": "VW Polo 1.6 TDI HIGHLINE DSG NAVI CAR PLAY ANDROID AUTO, 2020 г., 140 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "VW",
    "title": "VW Polo 1.6",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "140 000 км",
    "mileageKm": 140000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 9999,
    "href": "/listing-detail-v1/16"
  }
];

export const formatVehiclePrice = (priceEur: number) => `${new Intl.NumberFormat('bg-BG').format(priceEur)} €`;
