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

// Representative published listings captured 2026-09-07; availability requires confirmation.
export const featuredVehicles: Vehicle[] = [
  {
    "id": 1,
    "image": "/assets/astracar/vehicle-01-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-01-1.webp",
      "/assets/astracar/vehicle-01-2.webp",
      "/assets/astracar/vehicle-01-3.webp",
      "/assets/astracar/vehicle-01-4.webp",
      "/assets/astracar/vehicle-01-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11747499643415236-mini-cooper-1-6d-euro4",
    "description": "Mini Cooper 1.6D EURO4, 2009 г., дизел, 143 100 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Mini",
    "title": "Mini Cooper 1.6D EURO4",
    "year": "2009",
    "yearNumber": 2009,
    "mileage": "143 100 км",
    "mileageKm": 143100,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4000,
    "href": "/listing-detail-v1/1"
  },
  {
    "id": 2,
    "image": "/assets/astracar/vehicle-02-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-02-1.webp",
      "/assets/astracar/vehicle-02-2.webp",
      "/assets/astracar/vehicle-02-3.webp",
      "/assets/astracar/vehicle-02-4.webp",
      "/assets/astracar/vehicle-02-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-21755975324167565-renault-captur-0-9t-euro6b",
    "description": "Renault Captur 0.9T EURO6B, 2017 г., бензин, 127 663 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "Renault",
    "title": "Renault Captur 0.9T EURO6B",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "127 663 км",
    "mileageKm": 127663,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 9500,
    "href": "/listing-detail-v1/2"
  },
  {
    "id": 3,
    "image": "/assets/astracar/vehicle-03-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-03-1.webp",
      "/assets/astracar/vehicle-03-2.webp",
      "/assets/astracar/vehicle-03-3.webp",
      "/assets/astracar/vehicle-03-4.webp",
      "/assets/astracar/vehicle-03-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11737822623289964-bmw-535-xdrive-full-eu5b",
    "description": "BMW 535 xDrive FULL EU5B, 2012 г., дизел, 177 390 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Седан",
    "body": "Sedan",
    "make": "BMW",
    "title": "BMW 535 xDrive FULL EU5B",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "177 390 км",
    "mileageKm": 177390,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 14600,
    "href": "/listing-detail-v1/3"
  },
  {
    "id": 4,
    "image": "/assets/astracar/vehicle-04-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-04-1.webp",
      "/assets/astracar/vehicle-04-2.webp",
      "/assets/astracar/vehicle-04-3.webp",
      "/assets/astracar/vehicle-04-4.webp",
      "/assets/astracar/vehicle-04-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11763446260159317-audi-a3-2-0tdi-s-line-quattro",
    "description": "Audi A3 2.0TDI S-LINE QUATTRO, 2006 г., дизел, 181 000 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A3 2.0TDI S-LINE QUATTRO",
    "year": "2006",
    "yearNumber": 2006,
    "mileage": "181 000 км",
    "mileageKm": 181000,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "4x4",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4000,
    "href": "/listing-detail-v1/4"
  },
  {
    "id": 5,
    "image": "/assets/astracar/vehicle-05-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-05-1.webp",
      "/assets/astracar/vehicle-05-2.webp",
      "/assets/astracar/vehicle-05-3.webp",
      "/assets/astracar/vehicle-05-4.webp",
      "/assets/astracar/vehicle-05-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11752951085157214-audi-a5-2-0tfsi-euro5b",
    "description": "Audi A5 2.0TFSI EURO5B, 2010 г., бензин, 165 170 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Купе",
    "body": "Coupe",
    "make": "Audi",
    "title": "Audi A5 2.0TFSI EURO5B",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "165 170 км",
    "mileageKm": 165170,
    "fuel": "Бензин",
    "transmission": "Автоматик",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 7900,
    "href": "/listing-detail-v1/5"
  },
  {
    "id": 6,
    "image": "/assets/astracar/vehicle-06-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-06-1.webp",
      "/assets/astracar/vehicle-06-2.webp",
      "/assets/astracar/vehicle-06-3.webp",
      "/assets/astracar/vehicle-06-4.webp",
      "/assets/astracar/vehicle-06-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11762018600091690-fiat-punto-1-4i-evo-euro4",
    "description": "Fiat Punto 1.4i EVO EURO4, 2010 г., бензин, 139 800 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Fiat",
    "title": "Fiat Punto 1.4i EVO EURO4",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "139 800 км",
    "mileageKm": 139800,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация"
    ],
    "condition": "used",
    "priceEur": 3900,
    "href": "/listing-detail-v1/6"
  },
  {
    "id": 7,
    "image": "/assets/astracar/vehicle-07-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-07-1.webp",
      "/assets/astracar/vehicle-07-2.webp",
      "/assets/astracar/vehicle-07-3.webp",
      "/assets/astracar/vehicle-07-4.webp",
      "/assets/astracar/vehicle-07-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11755359473275644-audi-a3-1-6tdi-eu5b-sportbag",
    "description": "Audi A3 1.6TDI EU5B SPORTBAG, 2015 г., дизел, 162 148 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Audi",
    "title": "Audi A3 1.6TDI EU5B SPORTBAG",
    "year": "2015",
    "yearNumber": 2015,
    "mileage": "162 148 км",
    "mileageKm": 162148,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 8900,
    "href": "/listing-detail-v1/7"
  },
  {
    "id": 8,
    "image": "/assets/astracar/vehicle-08-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-08-1.webp",
      "/assets/astracar/vehicle-08-2.webp",
      "/assets/astracar/vehicle-08-3.webp",
      "/assets/astracar/vehicle-08-4.webp",
      "/assets/astracar/vehicle-08-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11766248164423161-mini-cooper-1-6d-euro5",
    "description": "Mini Cooper 1.6D EURO5, 2010 г., дизел, 150 052 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Mini",
    "title": "Mini Cooper 1.6D EURO5",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "150 052 км",
    "mileageKm": 150052,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [],
    "condition": "used",
    "priceEur": 4200,
    "href": "/listing-detail-v1/8"
  },
  {
    "id": 9,
    "image": "/assets/astracar/vehicle-09-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-09-1.webp",
      "/assets/astracar/vehicle-09-2.webp",
      "/assets/astracar/vehicle-09-3.webp",
      "/assets/astracar/vehicle-09-4.webp",
      "/assets/astracar/vehicle-09-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11780761931333448-audi-a6-2-0tdi-euro5b",
    "description": "Audi A6 2.0TDI EURO5B, 2014 г., дизел, 159 400 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Комби",
    "body": "Wagon",
    "make": "Audi",
    "title": "Audi A6 2.0TDI EURO5B",
    "year": "2014",
    "yearNumber": 2014,
    "mileage": "159 400 км",
    "mileageKm": 159400,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 8999,
    "href": "/listing-detail-v1/9"
  },
  {
    "id": 10,
    "image": "/assets/astracar/vehicle-10-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-10-1.webp",
      "/assets/astracar/vehicle-10-2.webp",
      "/assets/astracar/vehicle-10-3.webp",
      "/assets/astracar/vehicle-10-4.webp",
      "/assets/astracar/vehicle-10-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-21780733368439452-bmw-x7-3-0d-xdrive-eu6d",
    "description": "BMW X7 3.0d xDrive EU6D, 2020 г., дизел, 190 000 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "BMW",
    "title": "BMW X7 3.0d xDrive EU6D",
    "year": "2020",
    "yearNumber": 2020,
    "mileage": "190 000 км",
    "mileageKm": 190000,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 49000,
    "href": "/listing-detail-v1/10"
  },
  {
    "id": 11,
    "image": "/assets/astracar/vehicle-11-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-11-1.webp",
      "/assets/astracar/vehicle-11-2.webp",
      "/assets/astracar/vehicle-11-3.webp",
      "/assets/astracar/vehicle-11-4.webp",
      "/assets/astracar/vehicle-11-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11773504878088103-citroen-c3-1-2i-euro5b",
    "description": "Citroen C3 1.2i EURO5B, 2013 г., бензин, 136 574 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Хечбек",
    "body": "Hatchback",
    "make": "Citroen",
    "title": "Citroen C3 1.2i EURO5B",
    "year": "2013",
    "yearNumber": 2013,
    "mileage": "136 574 км",
    "mileageKm": 136574,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 4600,
    "href": "/listing-detail-v1/11"
  },
  {
    "id": 12,
    "image": "/assets/astracar/vehicle-12-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-12-1.webp",
      "/assets/astracar/vehicle-12-2.webp",
      "/assets/astracar/vehicle-12-3.webp",
      "/assets/astracar/vehicle-12-4.webp",
      "/assets/astracar/vehicle-12-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-21783183116609383-hyundai-ix35-1-6gdi-euro5",
    "description": "Hyundai IX35 1.6GDI EURO5, 2012 г., бензин, 56 178 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "Hyundai",
    "title": "Hyundai IX35 1.6GDI EURO5",
    "year": "2012",
    "yearNumber": 2012,
    "mileage": "56 178 км",
    "mileageKm": 56178,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 7999,
    "href": "/listing-detail-v1/12"
  },
  {
    "id": 13,
    "image": "/assets/astracar/vehicle-13-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-13-1.webp",
      "/assets/astracar/vehicle-13-2.webp",
      "/assets/astracar/vehicle-13-3.webp",
      "/assets/astracar/vehicle-13-4.webp",
      "/assets/astracar/vehicle-13-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-21783791992541606-mercedes-benz-ml-350-3-0cdi-premium-eu6",
    "description": "Mercedes-Benz ML 350 3.0CDI PREMIUM EU6, 2010 г., дизел, 182 887 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "Mercedes-Benz",
    "title": "Mercedes-Benz ML 350 3.0CDI PREMIUM EU6",
    "year": "2010",
    "yearNumber": 2010,
    "mileage": "182 887 км",
    "mileageKm": 182887,
    "fuel": "Дизел",
    "transmission": "Автоматик",
    "equipment": [
      "4x4",
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 9500,
    "href": "/listing-detail-v1/13"
  },
  {
    "id": 14,
    "image": "/assets/astracar/vehicle-14-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-14-1.webp",
      "/assets/astracar/vehicle-14-2.webp",
      "/assets/astracar/vehicle-14-3.webp",
      "/assets/astracar/vehicle-14-4.webp",
      "/assets/astracar/vehicle-14-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11782577422662538-peugeot-2008-1-2-puretech-eu6d",
    "description": "Peugeot 2008 1.2 PureTech EU6D, 2022 г., бензин, 36 216 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Джип",
    "body": "SUV",
    "make": "Peugeot",
    "title": "Peugeot 2008 1.2 PureTech EU6D",
    "year": "2022",
    "yearNumber": 2022,
    "mileage": "36 216 км",
    "mileageKm": 36216,
    "fuel": "Бензин",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 14000,
    "href": "/listing-detail-v1/14"
  },
  {
    "id": 15,
    "image": "/assets/astracar/vehicle-15-1.webp",
    "gallery": [
      "/assets/astracar/vehicle-15-1.webp",
      "/assets/astracar/vehicle-15-2.webp",
      "/assets/astracar/vehicle-15-3.webp",
      "/assets/astracar/vehicle-15-4.webp",
      "/assets/astracar/vehicle-15-5.webp"
    ],
    "sourceUrl": "https://astracar.mobile.bg/obiava-11782575631736534-citroen-jumpy-1-6hdi-l2h1eu6b",
    "description": "Citroen Jumpy 1.6HDI L2H1EU6B, 2017 г., дизел, 186 586 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона.",
    "category": "Ван",
    "body": "Minivan",
    "make": "Citroen",
    "title": "Citroen Jumpy 1.6HDI L2H1EU6B",
    "year": "2017",
    "yearNumber": 2017,
    "mileage": "186 586 км",
    "mileageKm": 186586,
    "fuel": "Дизел",
    "transmission": "Ръчна",
    "equipment": [
      "Навигация",
      "Парктроник"
    ],
    "condition": "used",
    "priceEur": 8500,
    "href": "/listing-detail-v1/15"
  }
];
export const formatVehiclePrice = (priceEur: number) => new Intl.NumberFormat('bg-BG').format(priceEur) + ' €';
