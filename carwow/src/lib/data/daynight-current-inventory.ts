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
    "id": "FA-85208",
    "title": "2003 Porsche 911 Turbo",
    "sourceUrl": "https://www.tdp.ae/",
    "priceEur": "AED 219,900",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2003",
    "mileage": "100,600 km",
    "color": "",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Automatic",
    "body": "Coupe",
    "features": [],
    "image": "/variant-3/dealer/stock/1.svg"
  },
  {
    "id": "FA-85210",
    "title": "2006 Porsche 911 Carrera S Manual",
    "sourceUrl": "https://www.tdp.ae/",
    "priceEur": "AED 189,900",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2006",
    "mileage": "117,800 km",
    "color": "",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Manual",
    "body": "Coupe",
    "features": [],
    "image": "/variant-3/dealer/stock/2.svg"
  },
  {
    "id": "FA-85136",
    "title": "2007 Porsche 911 Turbo",
    "sourceUrl": "https://www.tdp.ae/",
    "priceEur": "AED 299,900",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2007",
    "mileage": "54,500 km",
    "color": "",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Automatic",
    "body": "Coupe",
    "features": [],
    "image": "/variant-3/dealer/stock/3.svg"
  },
  {
    "id": "FA-83283",
    "title": "2015 Porsche 911 Carrera 4 GTS",
    "sourceUrl": "https://www.tdp.ae/",
    "priceEur": "AED 279,900",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2015",
    "mileage": "116,600 km",
    "color": "",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Automatic",
    "body": "Coupe",
    "features": [],
    "image": "/variant-3/dealer/stock/4.svg"
  },
  {
    "id": "FA-84061",
    "title": "2020 Porsche 911 Carrera 4S",
    "sourceUrl": "https://www.tdp.ae/",
    "priceEur": "AED 379,900",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2020",
    "mileage": "105,400 km",
    "color": "",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Automatic",
    "body": "Coupe",
    "features": [],
    "image": "/variant-3/dealer/stock/5.svg"
  },
  {
    "id": "FA-76723",
    "title": "2006 Porsche Boxster",
    "sourceUrl": "https://www.tdp.ae/",
    "priceEur": "AED 44,900",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2006",
    "mileage": "94,000 km",
    "color": "",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Automatic",
    "body": "Convertible",
    "features": [],
    "image": "/variant-3/dealer/stock/6.svg"
  },
  {
    "id": "FA-84119",
    "title": "2008 Porsche Cayenne GTS",
    "sourceUrl": "https://www.tdp.ae/",
    "priceEur": "AED 69,900",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2008",
    "mileage": "44,000 km",
    "color": "",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Automatic",
    "body": "SUV",
    "features": [],
    "image": "/variant-3/dealer/stock/7.svg"
  },
  {
    "id": "FA-80162",
    "title": "2011 Porsche Cayenne Turbo",
    "sourceUrl": "https://www.tdp.ae/",
    "priceEur": "AED 49,900",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2011",
    "mileage": "153,800 km",
    "color": "",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Automatic",
    "body": "SUV",
    "features": [],
    "image": "/variant-3/dealer/stock/8.svg"
  },
  {
    "id": "FA-78089",
    "title": "2013 Porsche Cayenne GTS",
    "sourceUrl": "https://www.tdp.ae/",
    "priceEur": "AED 129,900",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2013",
    "mileage": "29,000 km",
    "color": "",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Automatic",
    "body": "SUV",
    "features": [],
    "image": "/variant-3/dealer/stock/9.svg"
  },
  {
    "id": "FA-83372",
    "title": "2014 Porsche Cayenne Turbo S",
    "sourceUrl": "https://www.tdp.ae/",
    "priceEur": "AED 119,900",
    "priceBgn": "",
    "status": "Dated listing sample — confirm availability",
    "date": "2014",
    "mileage": "41,220 km",
    "color": "",
    "fuel": "Gasoline",
    "power": "",
    "transmission": "Automatic",
    "body": "SUV",
    "features": [],
    "image": "/variant-3/dealer/stock/10.svg"
  }
] satisfies CurrentDayNightListing[];
