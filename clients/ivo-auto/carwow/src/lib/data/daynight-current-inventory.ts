// Dealer listing snapshot normalized from the canonical Cars source pack.
export type CurrentDayNightListing = {
  id: string;
  title: string;
  sourceUrl: string;
  priceEur: string;
  priceBgn: string;
  status: string;
  date: string;
  mileage: string;
  color: string;
  fuel: string;
  power: string;
  transmission: string;
  body: string;
  features: string[];
  image: string;
};

export const currentDayNightListings = [
  {
    "id": "11786049135297264",
    "title": "Rolls-Royce Ghost",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11786049135297264-rolls-royce-ghost",
    "priceEur": "105 000 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2011",
    "mileage": "66 000 km",
    "color": "Черен",
    "fuel": "Бензин",
    "power": "580 hp",
    "transmission": "Автоматик",
    "body": "Sedan",
    "features": [],
    "image": "/assets/ivo-auto/vehicle-01-1.webp"
  },
  {
    "id": "11784822971964926",
    "title": "Audi A4 S-line 4x4 2.0T",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11784822971964926-audi-a4-s-line-4x4-2-0t",
    "priceEur": "2800 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2008",
    "mileage": "195 000 km",
    "color": "Черен",
    "fuel": "Бензин",
    "power": "200 hp",
    "transmission": "Автоматик",
    "body": "Sedan",
    "features": [
      "4x4"
    ],
    "image": "/assets/ivo-auto/vehicle-02-1.webp"
  },
  {
    "id": "11775231551222536",
    "title": "Porsche Panamera Turbo 4.8i",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11775231551222536-porsche-panamera-turbo-4-8i",
    "priceEur": "21 000 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2010",
    "mileage": "145 000 km",
    "color": "Син",
    "fuel": "Бензин",
    "power": "500 hp",
    "transmission": "Автоматик",
    "body": "Coupe",
    "features": [
      "4x4"
    ],
    "image": "/assets/ivo-auto/vehicle-03-1.webp"
  },
  {
    "id": "21784804233950248",
    "title": "Dodge Durango 3.6 Face Lift Газ.Инж. 6+ 1",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-21784804233950248-dodge-durango-3-6-face-lift-gaz-inzh-6-1",
    "priceEur": "13 900 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2015",
    "mileage": "202 000 km",
    "color": "Тъмно сив",
    "fuel": "Бензин",
    "power": "",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4"
    ],
    "image": "/assets/ivo-auto/vehicle-04-1.webp"
  },
  {
    "id": "11784710943679925",
    "title": "BMW 520 M-пакет Digital",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11784710943679925-bmw-520-m-paket-digital",
    "priceEur": "19 000 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2018",
    "mileage": "165 000 km",
    "color": "Черен",
    "fuel": "Дизел",
    "power": "190 hp",
    "transmission": "Автоматик",
    "body": "Sedan",
    "features": [],
    "image": "/assets/ivo-auto/vehicle-05-1.webp"
  },
  {
    "id": "11780924566736048",
    "title": "VW Touran 1.6TDI Автомат 6+ 1",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11780924566736048-vw-touran-1-6tdi-avtomat-6-1",
    "priceEur": "3999 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2012",
    "mileage": "210 000 km",
    "color": "Сребърен",
    "fuel": "Дизел",
    "power": "105 hp",
    "transmission": "Автоматик",
    "body": "Minivan",
    "features": [],
    "image": "/assets/ivo-auto/vehicle-06-1.webp"
  },
  {
    "id": "11778070752693531",
    "title": "VW CC 2.0i",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11778070752693531-vw-cc-2-0i",
    "priceEur": "9000 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2013",
    "mileage": "214 000 km",
    "color": "Бордо",
    "fuel": "Бензин",
    "power": "211 hp",
    "transmission": "Автоматик",
    "body": "Coupe",
    "features": [],
    "image": "/assets/ivo-auto/vehicle-07-1.webp"
  },
  {
    "id": "21779453321117197",
    "title": "BMW X5 4.0D Face Lift 8ск.",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-21779453321117197-bmw-x5-4-0d-face-lift-8sk",
    "priceEur": "9500 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2011",
    "mileage": "196 000 km",
    "color": "Черен",
    "fuel": "Дизел",
    "power": "313 hp",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4"
    ],
    "image": "/assets/ivo-auto/vehicle-08-1.webp"
  },
  {
    "id": "21779444147151936",
    "title": "BMW X5 3.0D Face Lift",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-21779444147151936-bmw-x5-3-0d-face-lift",
    "priceEur": "4600 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2005",
    "mileage": "195 000 km",
    "color": "Черен",
    "fuel": "Дизел",
    "power": "218 hp",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4"
    ],
    "image": "/assets/ivo-auto/vehicle-09-1.webp"
  },
  {
    "id": "11780659371731573",
    "title": "BMW 418 D M-Пакет",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11780659371731573-bmw-418-d-m-paket",
    "priceEur": "16 200 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2017",
    "mileage": "149 000 km",
    "color": "Тъмно сив",
    "fuel": "Дизел",
    "power": "150 hp",
    "transmission": "Автоматик",
    "body": "Coupe",
    "features": [],
    "image": "/assets/ivo-auto/vehicle-10-1.webp"
  },
  {
    "id": "21781871293573646",
    "title": "Subaru B9 tribeca 3.0 Газ.Инж.",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-21781871293573646-subaru-b9-tribeca-3-0-gaz-inzh",
    "priceEur": "3999 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2006",
    "mileage": "170 000 km",
    "color": "Сив",
    "fuel": "Бензин",
    "power": "250 hp",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4"
    ],
    "image": "/assets/ivo-auto/vehicle-11-1.webp"
  },
  {
    "id": "21762959348847465",
    "title": "Mercedes-Benz ML 250 AMG-Пакет",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-21762959348847465-mercedes-benz-ml-250-amg-paket",
    "priceEur": "14 500 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2014",
    "mileage": "130 000 km",
    "color": "Бял",
    "fuel": "Дизел",
    "power": "204 hp",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4"
    ],
    "image": "/assets/ivo-auto/vehicle-12-1.webp"
  },
  {
    "id": "11774893593485843",
    "title": "Mercedes-Benz S 500 4Matic Газ.Инж",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11774893593485843-mercedes-benz-s-500-4matic-gaz-inzh",
    "priceEur": "10 000 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2007",
    "mileage": "290 000 km",
    "color": "Син",
    "fuel": "Бензин",
    "power": "388 hp",
    "transmission": "Автоматик",
    "body": "Sedan",
    "features": [
      "4x4"
    ],
    "image": "/assets/ivo-auto/vehicle-13-1.webp"
  },
  {
    "id": "11756369185395904",
    "title": "BMW 730 D M-Пакет",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11756369185395904-bmw-730-d-m-paket",
    "priceEur": "11 000 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2010",
    "mileage": "214 000 km",
    "color": "Черен",
    "fuel": "Дизел",
    "power": "245 hp",
    "transmission": "Автоматик",
    "body": "Sedan",
    "features": [],
    "image": "/assets/ivo-auto/vehicle-14-1.webp"
  },
  {
    "id": "11775822194120541",
    "title": "BMW M5",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11775822194120541-bmw-m5",
    "priceEur": "30 000 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2008",
    "mileage": "218 000 km",
    "color": "Tъмно син",
    "fuel": "Бензин",
    "power": "507 hp",
    "transmission": "Автоматик",
    "body": "Sedan",
    "features": [],
    "image": "/assets/ivo-auto/vehicle-15-1.webp"
  },
  {
    "id": "11769186790854071",
    "title": "Audi A8 Full Led",
    "sourceUrl": "https://ivoauto-varna.mobile.bg/obiava-11769186790854071-audi-a8-full-led",
    "priceEur": "15 500 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2013",
    "mileage": "215 000 km",
    "color": "Tъмно син",
    "fuel": "Дизел",
    "power": "250 hp",
    "transmission": "Автоматик",
    "body": "Sedan",
    "features": [
      "4x4"
    ],
    "image": "/assets/ivo-auto/vehicle-16-1.webp"
  }
] satisfies CurrentDayNightListing[];
