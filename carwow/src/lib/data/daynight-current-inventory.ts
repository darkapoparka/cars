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
    "id": "is-1001",
    "title": "Audi R8 Performance V10",
    "sourceUrl": "https://www.isauto.net/avtomobili-i-djipove/audi-r8-perfomance-v10-bang-olufsen-audi-keramik-carbon-10",
    "priceEur": "148 224 €",
    "priceBgn": "",
    "status": "Датирана обява — потвърдете наличността",
    "date": "2021",
    "mileage": "75 000 km",
    "color": "",
    "fuel": "Бензин",
    "power": "",
    "transmission": "Автоматик",
    "body": "Купе",
    "features": [],
    "image": "/variant-3/dealer/inventory-1.webp"
  },
  {
    "id": "is-1002",
    "title": "Audi Q7 50 TDI",
    "sourceUrl": "https://www.isauto.net/avtomobili-i-djipove/audi-q7-50tdi-virtual-podgrev-4-zoni-kamera360-9",
    "priceEur": "67 439 €",
    "priceBgn": "",
    "status": "Датирана обява — потвърдете наличността",
    "date": "2022",
    "mileage": "57 500 km",
    "color": "",
    "fuel": "Дизел",
    "power": "",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [],
    "image": "/variant-3/dealer/inventory-2.webp"
  },
  {
    "id": "is-1003",
    "title": "BMW M5",
    "sourceUrl": "https://www.isauto.net/avtomobili-i-djipove/bmw-m5-keramika-xdrive-m-sport-bowers-wilk-adaptiveled-8",
    "priceEur": "71 530 €",
    "priceBgn": "",
    "status": "Датирана обява — потвърдете наличността",
    "date": "2018",
    "mileage": "61 000 km",
    "color": "",
    "fuel": "Бензин",
    "power": "",
    "transmission": "Автоматик",
    "body": "Седан",
    "features": [],
    "image": "/variant-3/dealer/inventory-3.webp"
  },
  {
    "id": "is-1004",
    "title": "BMW X5 xDrive",
    "sourceUrl": "https://www.isauto.net/avtomobili-i-djipove/bmw-x5-xdrive-sport-podgrev-panorama-6-1-7",
    "priceEur": "24 491 €",
    "priceBgn": "",
    "status": "Датирана обява — потвърдете наличността",
    "date": "2014",
    "mileage": "196 000 km",
    "color": "",
    "fuel": "Дизел",
    "power": "",
    "transmission": "Автоматик",
    "body": "SUV",
    "features": [],
    "image": "/variant-3/dealer/inventory-4.webp"
  },
  {
    "id": "is-1005",
    "title": "BMW 750 M Performance",
    "sourceUrl": "https://www.isauto.net/avtomobili-i-djipove/bmw-750-m-perfomance-laser-alkantar-virtual-harman-kardon-3",
    "priceEur": "61 304 €",
    "priceBgn": "",
    "status": "Датирана обява — потвърдете наличността",
    "date": "2019",
    "mileage": "167 000 km",
    "color": "",
    "fuel": "Дизел",
    "power": "",
    "transmission": "Автоматик",
    "body": "Седан",
    "features": [],
    "image": "/variant-3/dealer/inventory-5.webp"
  },
  {
    "id": "is-1006",
    "title": "Audi A5 Sportback 2.0 TDI",
    "sourceUrl": "https://www.isauto.net/avtomobili-i-djipove/audi-a5-sportback-2-0tdi-sline-ambient-virtual-podgrev-pdc-f1-745",
    "priceEur": "19 900 €",
    "priceBgn": "",
    "status": "Датирана обява — потвърдете наличността",
    "date": "2018",
    "mileage": "175 000 km",
    "color": "",
    "fuel": "Дизел",
    "power": "",
    "transmission": "Автоматик",
    "body": "Хечбек",
    "features": [],
    "image": "/variant-3/dealer/inventory-6.webp"
  }
] satisfies CurrentDayNightListing[];
