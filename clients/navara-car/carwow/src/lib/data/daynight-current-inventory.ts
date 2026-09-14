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
    "id": "11786363468065195",
    "title": "Nissan Micra 1.0 N-Sport",
    "sourceUrl": "https://navara.mobile.bg/obiava-11786363468065195-nissan-micra-1-0-n-sport",
    "priceEur": "10 500 €",
    "priceBgn": "",
    "status": "listing-sample",
    "date": "2021",
    "mileage": "63 800 km",
    "color": "Черен",
    "fuel": "Бензин",
    "power": "92 hp",
    "transmission": "Ръчна",
    "body": "Хечбек",
    "features": [
      "Навигация",
      "Парктроник",
      "Подгряване на седалки",
      "Apple CarPlay / Android Auto"
    ],
    "image": "/navara/vehicles/11786363468065195-1.webp"
  },
  {
    "id": "11782409246983224",
    "title": "VW Polo 1.6 TDI",
    "sourceUrl": "https://navara.mobile.bg/obiava-11782409246983224-vw-polo-1-6-tdi",
    "priceEur": "10 000 €",
    "priceBgn": "",
    "status": "listing-sample",
    "date": "2018",
    "mileage": "125 902 km",
    "color": "Сив",
    "fuel": "Дизел",
    "power": "80 hp",
    "transmission": "Ръчна",
    "body": "Хечбек",
    "features": [
      "Bluetooth",
      "Климатик",
      "ISOFIX",
      "Сензор за дъжд"
    ],
    "image": "/navara/vehicles/11782409246983224-1.webp"
  },
  {
    "id": "11787311216769974",
    "title": "Tesla Model 3 Performance Dual Motor",
    "sourceUrl": "https://navara.mobile.bg/obiava-11787311216769974-tesla-model-3-peformance-dual-motor",
    "priceEur": "32 999 €",
    "priceBgn": "",
    "status": "listing-sample",
    "date": "2022",
    "mileage": "63 900 km",
    "color": "Перла",
    "fuel": "Електрически",
    "power": "534 hp",
    "transmission": "Автоматик",
    "body": "Седан",
    "features": [
      "4x4",
      "Навигация",
      "Парктроник",
      "Подгряване на седалки",
      "Термопомпа"
    ],
    "image": "/navara/vehicles/11787311216769974-1.webp"
  },
  {
    "id": "21780735125049477",
    "title": "Nissan Qashqai 2.0i SV AWD",
    "sourceUrl": "https://navara.mobile.bg/obiava-21780735125049477-nissan-qashqai-2-0i-4x4-automatic-sv-awd",
    "priceEur": "18 499 €",
    "priceBgn": "",
    "status": "listing-sample",
    "date": "2023",
    "mileage": "57 000 km",
    "color": "Бордо",
    "fuel": "Бензин",
    "power": "141 hp",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "4x4",
      "Парктроник",
      "Подгряване на седалки",
      "Камера за заден ход",
      "Шибедах"
    ],
    "image": "/navara/vehicles/21780735125049477-1.webp"
  },
  {
    "id": "11787212062225914",
    "title": "Peugeot e-2008 Allure",
    "sourceUrl": "https://navara.mobile.bg/obiava-11787212062225914-peugeot-2008-e-2008-allure",
    "priceEur": "19 999 €",
    "priceBgn": "",
    "status": "listing-sample",
    "date": "2022",
    "mileage": "59 079 km",
    "color": "Керемиден",
    "fuel": "Електрически",
    "power": "136 hp",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [
      "Парктроник",
      "Подгряване на седалки",
      "Apple CarPlay / Android Auto",
      "Климатроник"
    ],
    "image": "/navara/vehicles/11787212062225914-1.webp"
  },
  {
    "id": "21774534756506554",
    "title": "Opel Mokka 1.4i Газ/Бензин",
    "sourceUrl": "https://navara.mobile.bg/obiava-21774534756506554-opel-mokka-1-4-i-gaz-benzin",
    "priceEur": "6999 €",
    "priceBgn": "",
    "status": "listing-sample",
    "date": "2015",
    "mileage": "182 000 km",
    "color": "Бял",
    "fuel": "Бензин / LPG",
    "power": "140 hp",
    "transmission": "Ръчна",
    "body": "SUV",
    "features": [
      "Газова уредба",
      "Парктроник",
      "Климатроник",
      "ISOFIX"
    ],
    "image": "/navara/vehicles/21774534756506554-1.webp"
  },
  {
    "id": "11784982235652112",
    "title": "Audi A4 1.8i quattro",
    "sourceUrl": "https://navara.mobile.bg/obiava-11784982235652112-audi-a4-1-8-i-quattro",
    "priceEur": "6999 €",
    "priceBgn": "",
    "status": "listing-sample",
    "date": "2009",
    "mileage": "212 000 km",
    "color": "Бял",
    "fuel": "Бензин",
    "power": "160 hp",
    "transmission": "Ръчна",
    "body": "Комби",
    "features": [
      "4x4",
      "Парктроник",
      "Подгряване на седалки",
      "Панорамен люк"
    ],
    "image": "/navara/vehicles/11784982235652112-1.webp"
  },
  {
    "id": "11772183782578045",
    "title": "Mercedes-Benz B 250 e",
    "sourceUrl": "https://navara.mobile.bg/obiava-11772183782578045-mercedes-benz-b-250-b250-e",
    "priceEur": "9999 €",
    "priceBgn": "",
    "status": "listing-sample",
    "date": "2016",
    "mileage": "106 000 km",
    "color": "Червен",
    "fuel": "Електрически",
    "power": "180 hp",
    "transmission": "Автоматик",
    "body": "Хечбек",
    "features": [
      "Навигация",
      "Парктроник",
      "Климатроник",
      "ISOFIX"
    ],
    "image": "/navara/vehicles/11772183782578045-1.webp"
  },
  {
    "id": "11780755712824361",
    "title": "Smart Fortwo 1.0i",
    "sourceUrl": "https://navara.mobile.bg/obiava-11780755712824361-smart-fortwo-1-0i",
    "priceEur": "4500 €",
    "priceBgn": "",
    "status": "listing-sample",
    "date": "2011",
    "mileage": "66 121 km",
    "color": "Черен",
    "fuel": "Бензин",
    "power": "72 hp",
    "transmission": "Автоматик",
    "body": "Хечбек",
    "features": [
      "Климатик",
      "Панорамен люк",
      "Ел. стъкла",
      "Бордкомпютър"
    ],
    "image": "/navara/vehicles/11780755712824361-1.webp"
  }
] satisfies CurrentDayNightListing[];
