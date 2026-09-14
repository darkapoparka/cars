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
    "id": "21788859055085650",
    "title": "Mercedes-Benz ML 320 CDI",
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-21788859055085650-mercedes-benz-ml-320-cdi",
    "priceEur": "6900 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2006",
    "mileage": "249 000 km",
    "color": "Черен",
    "fuel": "Дизелов",
    "power": "224 hp",
    "transmission": "Автоматична",
    "body": "Джип",
    "features": [],
    "image": "/assets/perfect-auto/vehicle-01-1.webp"
  },
  {
    "id": "21788174780697334",
    "title": "Mercedes-Benz G 350 4 MATIC FACELIFT BLUETEC * FULL ЕКС * Шибедах *",
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-21788174780697334-mercedes-benz-g-350-4-matic-facelift-bluetec-full-eks-shibedah",
    "priceEur": "59 900 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2015",
    "mileage": "151 000 km",
    "color": "Черен",
    "fuel": "Дизелов",
    "power": "258 hp",
    "transmission": "Автоматична",
    "body": "Джип",
    "features": [
      "4x4",
      "Лизинг",
      "Бартер",
      "Навигация",
      "Парктроник",
      "Кожен салон"
    ],
    "image": "/assets/perfect-auto/vehicle-02-1.webp"
  },
  {
    "id": "21788174574608668",
    "title": "Audi Q7 50 TDI FACELIFT QUATTRO* S LINE* MAXTON* FULL* RS",
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-21788174574608668-audi-q7-50-tdi-facelift-quattro-s-line-maxton-full-rs",
    "priceEur": "44 900 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2022",
    "mileage": "136 000 km",
    "color": "Тъмно сив",
    "fuel": "Дизелов",
    "power": "286 hp",
    "transmission": "Автоматична",
    "body": "Джип",
    "features": [
      "4x4",
      "Лизинг",
      "Бартер",
      "Навигация",
      "Парктроник",
      "Кожен салон",
      "Панорамен люк",
      "Head up display"
    ],
    "image": "/assets/perfect-auto/vehicle-03-1.webp"
  },
  {
    "id": "21787209952978104",
    "title": "Lexus NX 450 ЧИСТО НОВ * FULL Екстри * MARK LEV * ПАНО * HEAD U",
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-21787209952978104-lexus-nx-450-chisto-nov-full-ekstri-mark-lev-pano-head-u",
    "priceEur": "55 900 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2026",
    "mileage": "0 km",
    "color": "Червен",
    "fuel": "Plug-in хибрид",
    "power": "304 hp",
    "transmission": "Автоматична",
    "body": "Джип",
    "features": [
      "4x4",
      "Лизинг",
      "Бартер",
      "Навигация",
      "Парктроник",
      "Кожен салон",
      "Панорамен люк",
      "Head up display"
    ],
    "image": "/assets/perfect-auto/vehicle-04-1.webp"
  },
  {
    "id": "21787209746596224",
    "title": "BMW X6 30d xDrive * SWAROVSKI * M PACKET * MAXTON *",
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-21787209746596224-bmw-x6-30d-xdrive-swarovski-m-packet-maxton",
    "priceEur": "48 900 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2022",
    "mileage": "138 000 km",
    "color": "Т.зелен",
    "fuel": "Дизелов",
    "power": "286 hp",
    "transmission": "Автоматична",
    "body": "Джип",
    "features": [
      "4x4",
      "Лизинг",
      "Бартер",
      "Навигация",
      "Парктроник",
      "Кожен салон",
      "Head up display"
    ],
    "image": "/assets/perfect-auto/vehicle-05-1.webp"
  },
  {
    "id": "11786890129374054",
    "title": "Ford Mustang * КАМЕРА *",
    "sourceUrl": "https://perfektauto.mobile.bg/obiava-11786890129374054-ford-mustang-kamera",
    "priceEur": "19 900 €",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2016",
    "mileage": "48 000 km",
    "color": "Черен",
    "fuel": "Бензинов",
    "power": "317 hp",
    "transmission": "Автоматична",
    "body": "Купе",
    "features": [
      "Лизинг",
      "Бартер",
      "Навигация",
      "Парктроник",
      "Кожен салон",
      "Head up display"
    ],
    "image": "/assets/perfect-auto/vehicle-06-1.webp"
  }
] satisfies CurrentDayNightListing[];
