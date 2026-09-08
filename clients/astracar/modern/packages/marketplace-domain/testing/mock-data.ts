import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "astracar-11747499643415236",
    "slug": "astracar-11747499643415236",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Mini Cooper 1.6D EURO4",
    "description": "Mini Cooper 1.6D EURO4, 2009 г., дизел, 143 100 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11747499643415236-mini-cooper-1-6d-euro4",
    "price": {
      "amount": 4000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-01-1.webp",
        "alt": "Mini Cooper 1.6D EURO4"
      },
      {
        "url": "/assets/astracar/vehicle-01-2.webp",
        "alt": "Mini Cooper 1.6D EURO4"
      },
      {
        "url": "/assets/astracar/vehicle-01-3.webp",
        "alt": "Mini Cooper 1.6D EURO4"
      },
      {
        "url": "/assets/astracar/vehicle-01-4.webp",
        "alt": "Mini Cooper 1.6D EURO4"
      },
      {
        "url": "/assets/astracar/vehicle-01-5.webp",
        "alt": "Mini Cooper 1.6D EURO4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mini",
      "model": "Cooper 1.6D EURO4",
      "year": 2009,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 143100,
      "mileageUnit": "km",
      "enginePowerHp": 109,
      "colorExterior": "Зелен"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T10:00:00.000Z",
    "promoted": false
  },
  {
    "id": "astracar-21755975324167565",
    "slug": "astracar-21755975324167565",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Renault Captur 0.9T EURO6B",
    "description": "Renault Captur 0.9T EURO6B, 2017 г., бензин, 127 663 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-21755975324167565-renault-captur-0-9t-euro6b",
    "price": {
      "amount": 9500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-02-1.webp",
        "alt": "Renault Captur 0.9T EURO6B"
      },
      {
        "url": "/assets/astracar/vehicle-02-2.webp",
        "alt": "Renault Captur 0.9T EURO6B"
      },
      {
        "url": "/assets/astracar/vehicle-02-3.webp",
        "alt": "Renault Captur 0.9T EURO6B"
      },
      {
        "url": "/assets/astracar/vehicle-02-4.webp",
        "alt": "Renault Captur 0.9T EURO6B"
      },
      {
        "url": "/assets/astracar/vehicle-02-5.webp",
        "alt": "Renault Captur 0.9T EURO6B"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Renault",
      "model": "Captur 0.9T EURO6B",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 127663,
      "mileageUnit": "km",
      "enginePowerHp": 90,
      "colorExterior": "Охра"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:59.000Z",
    "promoted": false
  },
  {
    "id": "astracar-11737822623289964",
    "slug": "astracar-11737822623289964",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "BMW 535 xDrive FULL EU5B",
    "description": "BMW 535 xDrive FULL EU5B, 2012 г., дизел, 177 390 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11737822623289964-bmw-535-xdrive-full-eu5b",
    "price": {
      "amount": 14600,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-03-1.webp",
        "alt": "BMW 535 xDrive FULL EU5B"
      },
      {
        "url": "/assets/astracar/vehicle-03-2.webp",
        "alt": "BMW 535 xDrive FULL EU5B"
      },
      {
        "url": "/assets/astracar/vehicle-03-3.webp",
        "alt": "BMW 535 xDrive FULL EU5B"
      },
      {
        "url": "/assets/astracar/vehicle-03-4.webp",
        "alt": "BMW 535 xDrive FULL EU5B"
      },
      {
        "url": "/assets/astracar/vehicle-03-5.webp",
        "alt": "BMW 535 xDrive FULL EU5B"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "535 xDrive FULL EU5B",
      "year": 2012,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 177390,
      "mileageUnit": "km",
      "enginePowerHp": 313,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:58.000Z",
    "promoted": false
  },
  {
    "id": "astracar-11763446260159317",
    "slug": "astracar-11763446260159317",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Audi A3 2.0TDI S-LINE QUATTRO",
    "description": "Audi A3 2.0TDI S-LINE QUATTRO, 2006 г., дизел, 181 000 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11763446260159317-audi-a3-2-0tdi-s-line-quattro",
    "price": {
      "amount": 4000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-04-1.webp",
        "alt": "Audi A3 2.0TDI S-LINE QUATTRO"
      },
      {
        "url": "/assets/astracar/vehicle-04-2.webp",
        "alt": "Audi A3 2.0TDI S-LINE QUATTRO"
      },
      {
        "url": "/assets/astracar/vehicle-04-3.webp",
        "alt": "Audi A3 2.0TDI S-LINE QUATTRO"
      },
      {
        "url": "/assets/astracar/vehicle-04-4.webp",
        "alt": "Audi A3 2.0TDI S-LINE QUATTRO"
      },
      {
        "url": "/assets/astracar/vehicle-04-5.webp",
        "alt": "Audi A3 2.0TDI S-LINE QUATTRO"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A3 2.0TDI S-LINE QUATTRO",
      "year": 2006,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 181000,
      "mileageUnit": "km",
      "enginePowerHp": 140,
      "colorExterior": "Кафяв"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:57.000Z",
    "promoted": false
  },
  {
    "id": "astracar-11752951085157214",
    "slug": "astracar-11752951085157214",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Audi A5 2.0TFSI EURO5B",
    "description": "Audi A5 2.0TFSI EURO5B, 2010 г., бензин, 165 170 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11752951085157214-audi-a5-2-0tfsi-euro5b",
    "price": {
      "amount": 7900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-05-1.webp",
        "alt": "Audi A5 2.0TFSI EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-05-2.webp",
        "alt": "Audi A5 2.0TFSI EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-05-3.webp",
        "alt": "Audi A5 2.0TFSI EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-05-4.webp",
        "alt": "Audi A5 2.0TFSI EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-05-5.webp",
        "alt": "Audi A5 2.0TFSI EURO5B"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A5 2.0TFSI EURO5B",
      "year": 2010,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 165170,
      "mileageUnit": "km",
      "enginePowerHp": 180,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:56.000Z",
    "promoted": false
  },
  {
    "id": "astracar-11762018600091690",
    "slug": "astracar-11762018600091690",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Fiat Punto 1.4i EVO EURO4",
    "description": "Fiat Punto 1.4i EVO EURO4, 2010 г., бензин, 139 800 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11762018600091690-fiat-punto-1-4i-evo-euro4",
    "price": {
      "amount": 3900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-06-1.webp",
        "alt": "Fiat Punto 1.4i EVO EURO4"
      },
      {
        "url": "/assets/astracar/vehicle-06-2.webp",
        "alt": "Fiat Punto 1.4i EVO EURO4"
      },
      {
        "url": "/assets/astracar/vehicle-06-3.webp",
        "alt": "Fiat Punto 1.4i EVO EURO4"
      },
      {
        "url": "/assets/astracar/vehicle-06-4.webp",
        "alt": "Fiat Punto 1.4i EVO EURO4"
      },
      {
        "url": "/assets/astracar/vehicle-06-5.webp",
        "alt": "Fiat Punto 1.4i EVO EURO4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Fiat",
      "model": "Punto 1.4i EVO EURO4",
      "year": 2010,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 139800,
      "mileageUnit": "km",
      "enginePowerHp": 78,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:55.000Z",
    "promoted": false
  },
  {
    "id": "astracar-11755359473275644",
    "slug": "astracar-11755359473275644",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Audi A3 1.6TDI EU5B SPORTBAG",
    "description": "Audi A3 1.6TDI EU5B SPORTBAG, 2015 г., дизел, 162 148 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11755359473275644-audi-a3-1-6tdi-eu5b-sportbag",
    "price": {
      "amount": 8900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-07-1.webp",
        "alt": "Audi A3 1.6TDI EU5B SPORTBAG"
      },
      {
        "url": "/assets/astracar/vehicle-07-2.webp",
        "alt": "Audi A3 1.6TDI EU5B SPORTBAG"
      },
      {
        "url": "/assets/astracar/vehicle-07-3.webp",
        "alt": "Audi A3 1.6TDI EU5B SPORTBAG"
      },
      {
        "url": "/assets/astracar/vehicle-07-4.webp",
        "alt": "Audi A3 1.6TDI EU5B SPORTBAG"
      },
      {
        "url": "/assets/astracar/vehicle-07-5.webp",
        "alt": "Audi A3 1.6TDI EU5B SPORTBAG"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A3 1.6TDI EU5B SPORTBAG",
      "year": 2015,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 162148,
      "mileageUnit": "km",
      "enginePowerHp": 105,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:54.000Z",
    "promoted": false
  },
  {
    "id": "astracar-11766248164423161",
    "slug": "astracar-11766248164423161",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Mini Cooper 1.6D EURO5",
    "description": "Mini Cooper 1.6D EURO5, 2010 г., дизел, 150 052 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11766248164423161-mini-cooper-1-6d-euro5",
    "price": {
      "amount": 4200,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-08-1.webp",
        "alt": "Mini Cooper 1.6D EURO5"
      },
      {
        "url": "/assets/astracar/vehicle-08-2.webp",
        "alt": "Mini Cooper 1.6D EURO5"
      },
      {
        "url": "/assets/astracar/vehicle-08-3.webp",
        "alt": "Mini Cooper 1.6D EURO5"
      },
      {
        "url": "/assets/astracar/vehicle-08-4.webp",
        "alt": "Mini Cooper 1.6D EURO5"
      },
      {
        "url": "/assets/astracar/vehicle-08-5.webp",
        "alt": "Mini Cooper 1.6D EURO5"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mini",
      "model": "Cooper 1.6D EURO5",
      "year": 2010,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 150052,
      "mileageUnit": "km",
      "enginePowerHp": 112,
      "colorExterior": "Банан"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:53.000Z",
    "promoted": false
  },
  {
    "id": "astracar-11780761931333448",
    "slug": "astracar-11780761931333448",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Audi A6 2.0TDI EURO5B",
    "description": "Audi A6 2.0TDI EURO5B, 2014 г., дизел, 159 400 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11780761931333448-audi-a6-2-0tdi-euro5b",
    "price": {
      "amount": 8999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-09-1.webp",
        "alt": "Audi A6 2.0TDI EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-09-2.webp",
        "alt": "Audi A6 2.0TDI EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-09-3.webp",
        "alt": "Audi A6 2.0TDI EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-09-4.webp",
        "alt": "Audi A6 2.0TDI EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-09-5.webp",
        "alt": "Audi A6 2.0TDI EURO5B"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A6 2.0TDI EURO5B",
      "year": 2014,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 159400,
      "mileageUnit": "km",
      "enginePowerHp": 177,
      "colorExterior": "Светло сив"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:52.000Z",
    "promoted": false
  },
  {
    "id": "astracar-21780733368439452",
    "slug": "astracar-21780733368439452",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "BMW X7 3.0d xDrive EU6D",
    "description": "BMW X7 3.0d xDrive EU6D, 2020 г., дизел, 190 000 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. ДДС: виж оригиналната обява. Оригинална обява: https://astracar.mobile.bg/obiava-21780733368439452-bmw-x7-3-0d-xdrive-eu6d",
    "price": {
      "amount": 49000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-10-1.webp",
        "alt": "BMW X7 3.0d xDrive EU6D"
      },
      {
        "url": "/assets/astracar/vehicle-10-2.webp",
        "alt": "BMW X7 3.0d xDrive EU6D"
      },
      {
        "url": "/assets/astracar/vehicle-10-3.webp",
        "alt": "BMW X7 3.0d xDrive EU6D"
      },
      {
        "url": "/assets/astracar/vehicle-10-4.webp",
        "alt": "BMW X7 3.0d xDrive EU6D"
      },
      {
        "url": "/assets/astracar/vehicle-10-5.webp",
        "alt": "BMW X7 3.0d xDrive EU6D"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "X7 3.0d xDrive EU6D",
      "year": 2020,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 190000,
      "mileageUnit": "km",
      "enginePowerHp": 265,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:51.000Z",
    "promoted": false
  },
  {
    "id": "astracar-11773504878088103",
    "slug": "astracar-11773504878088103",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Citroen C3 1.2i EURO5B",
    "description": "Citroen C3 1.2i EURO5B, 2013 г., бензин, 136 574 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11773504878088103-citroen-c3-1-2i-euro5b",
    "price": {
      "amount": 4600,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-11-1.webp",
        "alt": "Citroen C3 1.2i EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-11-2.webp",
        "alt": "Citroen C3 1.2i EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-11-3.webp",
        "alt": "Citroen C3 1.2i EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-11-4.webp",
        "alt": "Citroen C3 1.2i EURO5B"
      },
      {
        "url": "/assets/astracar/vehicle-11-5.webp",
        "alt": "Citroen C3 1.2i EURO5B"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Citroen",
      "model": "C3 1.2i EURO5B",
      "year": 2013,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 136574,
      "mileageUnit": "km",
      "enginePowerHp": 82,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:50.000Z",
    "promoted": false
  },
  {
    "id": "astracar-21783183116609383",
    "slug": "astracar-21783183116609383",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Hyundai IX35 1.6GDI EURO5",
    "description": "Hyundai IX35 1.6GDI EURO5, 2012 г., бензин, 56 178 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-21783183116609383-hyundai-ix35-1-6gdi-euro5",
    "price": {
      "amount": 7999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-12-1.webp",
        "alt": "Hyundai IX35 1.6GDI EURO5"
      },
      {
        "url": "/assets/astracar/vehicle-12-2.webp",
        "alt": "Hyundai IX35 1.6GDI EURO5"
      },
      {
        "url": "/assets/astracar/vehicle-12-3.webp",
        "alt": "Hyundai IX35 1.6GDI EURO5"
      },
      {
        "url": "/assets/astracar/vehicle-12-4.webp",
        "alt": "Hyundai IX35 1.6GDI EURO5"
      },
      {
        "url": "/assets/astracar/vehicle-12-5.webp",
        "alt": "Hyundai IX35 1.6GDI EURO5"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Hyundai",
      "model": "IX35 1.6GDI EURO5",
      "year": 2012,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 56178,
      "mileageUnit": "km",
      "enginePowerHp": 135,
      "colorExterior": "Светло сив"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:49.000Z",
    "promoted": false
  },
  {
    "id": "astracar-21783791992541606",
    "slug": "astracar-21783791992541606",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Mercedes-Benz ML 350 3.0CDI PREMIUM EU6",
    "description": "Mercedes-Benz ML 350 3.0CDI PREMIUM EU6, 2010 г., дизел, 182 887 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-21783791992541606-mercedes-benz-ml-350-3-0cdi-premium-eu6",
    "price": {
      "amount": 9500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-13-1.webp",
        "alt": "Mercedes-Benz ML 350 3.0CDI PREMIUM EU6"
      },
      {
        "url": "/assets/astracar/vehicle-13-2.webp",
        "alt": "Mercedes-Benz ML 350 3.0CDI PREMIUM EU6"
      },
      {
        "url": "/assets/astracar/vehicle-13-3.webp",
        "alt": "Mercedes-Benz ML 350 3.0CDI PREMIUM EU6"
      },
      {
        "url": "/assets/astracar/vehicle-13-4.webp",
        "alt": "Mercedes-Benz ML 350 3.0CDI PREMIUM EU6"
      },
      {
        "url": "/assets/astracar/vehicle-13-5.webp",
        "alt": "Mercedes-Benz ML 350 3.0CDI PREMIUM EU6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "ML 350 3.0CDI PREMIUM EU6",
      "year": 2010,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 182887,
      "mileageUnit": "km",
      "enginePowerHp": 211,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:48.000Z",
    "promoted": false
  },
  {
    "id": "astracar-11782577422662538",
    "slug": "astracar-11782577422662538",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Peugeot 2008 1.2 PureTech EU6D",
    "description": "Peugeot 2008 1.2 PureTech EU6D, 2022 г., бензин, 36 216 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11782577422662538-peugeot-2008-1-2-puretech-eu6d",
    "price": {
      "amount": 14000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-14-1.webp",
        "alt": "Peugeot 2008 1.2 PureTech EU6D"
      },
      {
        "url": "/assets/astracar/vehicle-14-2.webp",
        "alt": "Peugeot 2008 1.2 PureTech EU6D"
      },
      {
        "url": "/assets/astracar/vehicle-14-3.webp",
        "alt": "Peugeot 2008 1.2 PureTech EU6D"
      },
      {
        "url": "/assets/astracar/vehicle-14-4.webp",
        "alt": "Peugeot 2008 1.2 PureTech EU6D"
      },
      {
        "url": "/assets/astracar/vehicle-14-5.webp",
        "alt": "Peugeot 2008 1.2 PureTech EU6D"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Peugeot",
      "model": "2008 1.2 PureTech EU6D",
      "year": 2022,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 36216,
      "mileageUnit": "km",
      "enginePowerHp": 100,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:47.000Z",
    "promoted": false
  },
  {
    "id": "astracar-11782575631736534",
    "slug": "astracar-11782575631736534",
    "category": "car",
    "dealerOrgId": "dealer-astracar",
    "status": "active",
    "title": "Citroen Jumpy 1.6HDI L2H1EU6B",
    "description": "Citroen Jumpy 1.6HDI L2H1EU6B, 2017 г., дизел, 186 586 км. Публикувана обява на Астракар. Наличността, оборудването и условията се потвърждават по телефона. Цената е с включено ДДС. Оригинална обява: https://astracar.mobile.bg/obiava-11782575631736534-citroen-jumpy-1-6hdi-l2h1eu6b",
    "price": {
      "amount": 8500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/astracar/vehicle-15-1.webp",
        "alt": "Citroen Jumpy 1.6HDI L2H1EU6B"
      },
      {
        "url": "/assets/astracar/vehicle-15-2.webp",
        "alt": "Citroen Jumpy 1.6HDI L2H1EU6B"
      },
      {
        "url": "/assets/astracar/vehicle-15-3.webp",
        "alt": "Citroen Jumpy 1.6HDI L2H1EU6B"
      },
      {
        "url": "/assets/astracar/vehicle-15-4.webp",
        "alt": "Citroen Jumpy 1.6HDI L2H1EU6B"
      },
      {
        "url": "/assets/astracar/vehicle-15-5.webp",
        "alt": "Citroen Jumpy 1.6HDI L2H1EU6B"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Цар Освободител 282",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Citroen",
      "model": "Jumpy 1.6HDI L2H1EU6B",
      "year": 2017,
      "bodyType": "van",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 186586,
      "mileageUnit": "km",
      "enginePowerHp": 116,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-astracar",
      "type": "dealer",
      "displayName": "Астракар",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:46.000Z",
    "promoted": false
  }
];

const matchesText = (listing: VehicleListing, query: string) => {
  const haystack = [
    listing.title,
    listing.description,
    listing.spec.make,
    listing.spec.model,
    listing.spec.trim,
    listing.location.city,
    listing.seller.displayName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

type ListingPredicate = (listing: VehicleListing) => boolean;
type ListingComparator = (a: VehicleListing, b: VehicleListing) => number;

const createListingPredicates = (
  filters: MarketplaceSearchParams
): ListingPredicate[] => [
  (listing) => listing.status === "active",
  (listing) => listing.category === filters.category,
  (listing) => !filters.q || matchesText(listing, filters.q),
  (listing) => !filters.make || listing.spec.make === filters.make,
  (listing) => !filters.model || listing.spec.model === filters.model,
  (listing) => !filters.location || listing.location.city === filters.location,
  (listing) =>
    !filters.origin ||
    listing.supply?.origin.countryCode === filters.origin ||
    (filters.origin === "BG" &&
      (listing.location.country === "Bulgaria" ||
        listing.location.country === "България")),
  (listing) =>
    !filters.deliverTo ||
    listing.supply?.delivery.eligibleCountryCodes.includes(filters.deliverTo) ||
    (filters.deliverTo === "BG" &&
      (listing.location.country === "Bulgaria" ||
        listing.location.country === "България")),
  (listing) => !filters.currency || listing.price.currency === filters.currency,
  (listing) =>
    filters.priceMin === undefined || listing.price.amount >= filters.priceMin,
  (listing) =>
    filters.priceMax === undefined || listing.price.amount <= filters.priceMax,
  (listing) =>
    filters.yearMin === undefined || listing.spec.year >= filters.yearMin,
  (listing) =>
    filters.yearMax === undefined || listing.spec.year <= filters.yearMax,
  (listing) =>
    filters.mileageMax === undefined ||
    listing.spec.mileageValue <= filters.mileageMax,
  (listing) => !filters.fuel || listing.spec.fuelType === filters.fuel,
  (listing) =>
    !filters.transmission || listing.spec.transmission === filters.transmission,
  (listing) => !filters.body || listing.spec.bodyType === filters.body,
  (listing) => !filters.seller || listing.seller.type === filters.seller,
];

const listingComparators: Record<
  MarketplaceSearchParams["sort"],
  ListingComparator
> = {
  mileage_asc: (a, b) => a.spec.mileageValue - b.spec.mileageValue,
  newest: (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  price_asc: (a, b) => a.price.amount - b.price.amount,
  price_desc: (a, b) => b.price.amount - a.price.amount,
  recommended: (a, b) => Number(b.promoted) - Number(a.promoted),
  year_desc: (a, b) => b.spec.year - a.spec.year,
};

export const getMockListings = (filters: MarketplaceSearchParams) => {
  const predicates = createListingPredicates(filters);

  return mockListings
    .filter((listing) => predicates.every((predicate) => predicate(listing)))
    .sort(listingComparators[filters.sort]);
};

const legacyListingSlugAliases: Readonly<Record<string, string>> = {
  "audi-q5-45-tfsi-quattro-stara-zagora-2021": "bmw-m4-competition-sofia-2021",
};

export const getMockListingBySlug = (slug: string) => {
  const resolvedSlug = legacyListingSlugAliases[slug] ?? slug;
  return mockListings.find((listing) => listing.slug === resolvedSlug);
};

export const getMockListingById = (id: string) =>
  mockListings.find((listing) => listing.id === id);

const scoreRelatedListing = (
  source: VehicleListing,
  candidate: VehicleListing
) =>
  Number(candidate.category === source.category) * 4 +
  Number(candidate.spec.make === source.spec.make) * 3 +
  Number(candidate.location.city === source.location.city) * 2 +
  Number(candidate.promoted);

export const getMockRelatedListings = (source: VehicleListing, limit = 3) =>
  mockListings
    .filter(
      (listing) => listing.status === "active" && listing.id !== source.id
    )
    .map((listing) => ({
      listing,
      score: scoreRelatedListing(source, listing),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ listing }) => listing);

export const mockSavedListingIds = ["am-1001", "am-1003", "am-1008"];

export const getMockSavedListings = () =>
  mockListings.filter((listing) => mockSavedListingIds.includes(listing.id));

export interface MockSavedSearch {
  cadence: "instant" | "daily" | "weekly";
  description: string;
  filters: Partial<MarketplaceSearchParams>;
  id: string;
  lastRunAt: string;
  newMatches: number;
  title: string;
}

export const mockSavedSearches: MockSavedSearch[] = [
  {
    id: "saved-search-premium-suv",
    title: "Premium SUVs under 100k",
    description: "BMW, Audi, and Toyota SUVs with verified sellers.",
    filters: {
      body: "suv",
      category: "car",
      priceMax: 100_000,
      seller: "dealer",
    },
    cadence: "daily",
    newMatches: 3,
    lastRunAt: "2026-06-06T07:00:00.000Z",
  },
  {
    id: "saved-search-lease-ev",
    title: "Lease-ready EVs",
    description: "Electric lease offers with automatic transmission.",
    filters: {
      category: "lease",
      fuel: "electric",
      transmission: "automatic",
    },
    cadence: "instant",
    newMatches: 1,
    lastRunAt: "2026-06-07T06:30:00.000Z",
  },
  {
    id: "saved-search-family-varna",
    title: "Family cars near Varna",
    description: "Low-mileage vehicles in Varna and nearby coastal cities.",
    filters: {
      category: "car",
      location: "Varna",
      mileageMax: 90_000,
    },
    cadence: "weekly",
    newMatches: 0,
    lastRunAt: "2026-06-03T08:00:00.000Z",
  },
];

const sellerListingStatuses: Record<string, VehicleListing["status"]> = {
  "am-1001": "active",
  "am-1003": "pending_review",
  "am-1007": "draft",
};

export const getMockSellerListings = () =>
  mockListings
    .filter((listing) =>
      Object.keys(sellerListingStatuses).includes(listing.id)
    )
    .map((listing) => ({
      ...listing,
      status: sellerListingStatuses[listing.id] ?? listing.status,
    }));

export const getMockSellerListingById = (id: string) =>
  getMockSellerListings().find((listing) => listing.id === id);

export const getMockDealerInventory = () =>
  mockListings.filter((listing) => listing.seller.type === "dealer");

export interface MockDealerLead {
  buyerName: string;
  id: string;
  intent: "test_drive" | "finance" | "trade_in" | "availability";
  listingId: string;
  listingTitle: string;
  receivedAt: string;
  source: "listing" | "saved_search" | "dealer_profile";
  status: "new" | "contacted" | "qualified" | "closed";
}

export const mockDealerLeads: MockDealerLead[] = [
  {
    buyerName: "Nikolay Petrov",
    id: "lead-1001",
    intent: "finance",
    listingId: "am-1001",
    listingTitle: "2020 BMW X5 M50d",
    receivedAt: "2026-06-07T07:30:00.000Z",
    source: "listing",
    status: "new",
  },
  {
    buyerName: "Elena Dimitrova",
    id: "lead-1002",
    intent: "test_drive",
    listingId: "am-1003",
    listingTitle: "2022 Mercedes-Benz GLE 53 AMG Coupe",
    receivedAt: "2026-06-06T15:20:00.000Z",
    source: "saved_search",
    status: "contacted",
  },
  {
    buyerName: "Martin Georgiev",
    id: "lead-1003",
    intent: "availability",
    listingId: "am-1008",
    listingTitle: "2020 Mercedes-Benz AMG GT 43",
    receivedAt: "2026-06-05T12:10:00.000Z",
    source: "dealer_profile",
    status: "qualified",
  },
  {
    buyerName: "Iva Marinova",
    id: "lead-1004",
    intent: "trade_in",
    listingId: "am-1005",
    listingTitle: "2018 Mercedes-Benz V 250d VIP Business",
    receivedAt: "2026-06-04T09:45:00.000Z",
    source: "listing",
    status: "closed",
  },
];

export const getMockDealerStats = () => {
  const inventory = getMockDealerInventory();
  const activeInventory = inventory.filter(
    (listing) => listing.status === "active"
  );
  const newLeads = mockDealerLeads.filter((lead) => lead.status === "new");

  return {
    activeInventory: activeInventory.length,
    averagePrice:
      inventory.reduce((total, listing) => total + listing.price.amount, 0) /
      inventory.length,
    leadCount: mockDealerLeads.length,
    newLeadCount: newLeads.length,
  };
};

export interface MockModerationReport {
  createdAt: string;
  details: string;
  flags: string[];
  id: string;
  listingId: string;
  listingTitle: string;
  reason:
    | "duplicate"
    | "fraud_risk"
    | "incorrect_details"
    | "prohibited_content"
    | "seller_behavior";
  reporter: string;
  severity: "low" | "medium" | "high";
  source: "buyer_report" | "system_flag" | "admin_review";
  status: "new" | "reviewing" | "resolved" | "dismissed";
}

export const mockModerationReports: MockModerationReport[] = [
  {
    id: "report-1001",
    listingId: "am-1003",
    listingTitle: "2022 Mercedes-Benz GLE 53 AMG Coupe",
    reason: "incorrect_details",
    details:
      "Buyer says lease terms in the message thread do not match the listing price.",
    reporter: "Elena Dimitrova",
    source: "buyer_report",
    status: "new",
    severity: "high",
    flags: ["Lease price mismatch", "Recent edit", "High intent lead"],
    createdAt: "2026-06-07T09:20:00.000Z",
  },
  {
    id: "report-1002",
    listingId: "am-1006",
    listingTitle: "2021 Range Rover Sport SVR",
    reason: "duplicate",
    details:
      "System found matching photos and mileage on another active dealer listing.",
    reporter: "System",
    source: "system_flag",
    status: "reviewing",
    severity: "medium",
    flags: ["Photo reuse", "Similar VIN pattern"],
    createdAt: "2026-06-07T06:45:00.000Z",
  },
  {
    id: "report-1003",
    listingId: "am-1002",
    listingTitle: "2021 Mercedes-Benz GLE 400d Coupe",
    reason: "seller_behavior",
    details:
      "Reporter says seller asked to move payment to an unverified channel.",
    reporter: "Nikolay Petrov",
    source: "buyer_report",
    status: "new",
    severity: "high",
    flags: ["Payment risk", "Private seller"],
    createdAt: "2026-06-06T17:30:00.000Z",
  },
  {
    id: "report-1004",
    listingId: "am-1008",
    listingTitle: "2020 Mercedes-Benz AMG GT 43",
    reason: "prohibited_content",
    details:
      "Admin review flagged promotional copy that may overstate warranty coverage.",
    reporter: "Admin review",
    source: "admin_review",
    status: "dismissed",
    severity: "low",
    flags: ["Copy review"],
    createdAt: "2026-06-05T12:10:00.000Z",
  },
];

export interface MockTrustReview {
  city: string;
  documents: string[];
  entityId: string;
  entityName: string;
  entityType: "dealer" | "seller";
  linkedListings: number;
  riskLevel: "low" | "medium" | "high";
  status: "unverified" | "pending" | "verified" | "rejected";
  submittedAt: string;
}

export const mockTrustReviews: MockTrustReview[] = [
  {
    entityId: "dealer-black-sea-ev",
    entityName: "Black Sea EV",
    entityType: "dealer",
    city: "Varna",
    status: "pending",
    riskLevel: "medium",
    linkedListings: 1,
    documents: ["Business registration", "VAT certificate", "Dealer address"],
    submittedAt: "2026-06-07T08:00:00.000Z",
  },
  {
    entityId: "seller-124",
    entityName: "Private seller",
    entityType: "seller",
    city: "Plovdiv",
    status: "pending",
    riskLevel: "high",
    linkedListings: 1,
    documents: ["ID check", "Phone verification"],
    submittedAt: "2026-06-06T16:15:00.000Z",
  },
  {
    entityId: "dealer-trakia-auto",
    entityName: "Trakia Auto",
    entityType: "dealer",
    city: "Stara Zagora",
    status: "verified",
    riskLevel: "low",
    linkedListings: 1,
    documents: ["Business registration", "Dealer address"],
    submittedAt: "2026-06-05T10:30:00.000Z",
  },
  {
    entityId: "seller-882",
    entityName: "Private seller",
    entityType: "seller",
    city: "Varna",
    status: "verified",
    riskLevel: "low",
    linkedListings: 1,
    documents: ["ID check", "Phone verification"],
    submittedAt: "2026-06-04T14:40:00.000Z",
  },
];

export interface MockAuditLogEntry {
  action: string;
  actor: string;
  createdAt: string;
  entityId: string;
  entityType: "listing" | "report" | "seller" | "dealer";
  id: string;
  note: string;
}

export const mockAuditLog: MockAuditLogEntry[] = [
  {
    id: "audit-1001",
    actor: "Admin",
    action: "report.opened",
    entityType: "report",
    entityId: "report-1001",
    note: "Moved Tesla lease report to new queue.",
    createdAt: "2026-06-07T09:25:00.000Z",
  },
  {
    id: "audit-1002",
    actor: "System",
    action: "listing.flagged",
    entityType: "listing",
    entityId: "am-1006",
    note: "Duplicate image match over threshold.",
    createdAt: "2026-06-07T06:45:00.000Z",
  },
  {
    id: "audit-1003",
    actor: "Trust ops",
    action: "dealer.verified",
    entityType: "dealer",
    entityId: "dealer-trakia-auto",
    note: "Business registry and address checks passed.",
    createdAt: "2026-06-06T11:15:00.000Z",
  },
];

export const getMockAdminStats = () => {
  const openReports = mockModerationReports.filter(
    (report) => report.status === "new" || report.status === "reviewing"
  );
  const highRiskReports = mockModerationReports.filter(
    (report) => report.severity === "high"
  );
  const pendingTrustReviews = mockTrustReviews.filter(
    (review) => review.status === "pending"
  );

  return {
    auditEvents: mockAuditLog.length,
    highRiskReports: highRiskReports.length,
    openReports: openReports.length,
    pendingTrustReviews: pendingTrustReviews.length,
  };
};

export interface MockDealerPlan {
  current?: boolean;
  description: string;
  id: string;
  leadCredits: number;
  listingLimit: number;
  monthlyPrice: Money;
  name: string;
  promotionCredits: number;
  support: "standard" | "priority" | "managed";
}

export const mockDealerPlans: MockDealerPlan[] = [
  {
    id: "dealer-starter",
    name: "Starter",
    description: "For small dealers testing AutoMarket inventory.",
    monthlyPrice: { amount: 99, currency: "EUR" },
    listingLimit: 20,
    leadCredits: 25,
    promotionCredits: 0,
    support: "standard",
  },
  {
    id: "dealer-growth",
    name: "Growth",
    description: "More active listings, included leads, and promotion credits.",
    monthlyPrice: { amount: 249, currency: "EUR" },
    listingLimit: 80,
    leadCredits: 120,
    promotionCredits: 4,
    support: "priority",
    current: true,
  },
  {
    id: "dealer-scale",
    name: "Scale",
    description: "High-volume inventory with managed marketplace support.",
    monthlyPrice: { amount: 599, currency: "EUR" },
    listingLimit: 250,
    leadCredits: 400,
    promotionCredits: 12,
    support: "managed",
  },
];

export interface MockPromotionProduct {
  description: string;
  durationDays: number;
  id: string;
  label: string;
  placement: "search_top" | "category_featured" | "lease_partner";
  price: Money;
}

export const mockPromotionProducts: MockPromotionProduct[] = [
  {
    id: "promo-search-top-7",
    label: "Top search boost",
    description: "Promoted placement in relevant search results for 7 days.",
    placement: "search_top",
    durationDays: 7,
    price: { amount: 39, currency: "EUR" },
  },
  {
    id: "promo-category-featured-14",
    label: "Category featured",
    description: "Featured card in category browse pages for 14 days.",
    placement: "category_featured",
    durationDays: 14,
    price: { amount: 79, currency: "EUR" },
  },
  {
    id: "promo-lease-partner-30",
    label: "Lease partner slot",
    description: "Finance and lease partner placement for eligible inventory.",
    placement: "lease_partner",
    durationDays: 30,
    price: { amount: 149, currency: "EUR" },
  },
];

export interface MockActivePromotion {
  clicks: number;
  endsAt: string;
  id: string;
  impressions: number;
  leads: number;
  listingId: string;
  productId: string;
  spend: Money;
  startsAt: string;
  status: "scheduled" | "active" | "ended";
}

export const mockActivePromotions: MockActivePromotion[] = [
  {
    id: "promotion-1001",
    listingId: "am-1001",
    productId: "promo-search-top-7",
    status: "active",
    startsAt: "2026-06-05T08:00:00.000Z",
    endsAt: "2026-06-12T08:00:00.000Z",
    spend: { amount: 39, currency: "EUR" },
    impressions: 4200,
    clicks: 184,
    leads: 8,
  },
  {
    id: "promotion-1002",
    listingId: "am-1003",
    productId: "promo-lease-partner-30",
    status: "active",
    startsAt: "2026-06-01T08:00:00.000Z",
    endsAt: "2026-07-01T08:00:00.000Z",
    spend: { amount: 149, currency: "EUR" },
    impressions: 6100,
    clicks: 246,
    leads: 12,
  },
  {
    id: "promotion-1003",
    listingId: "am-1008",
    productId: "promo-category-featured-14",
    status: "scheduled",
    startsAt: "2026-06-10T08:00:00.000Z",
    endsAt: "2026-06-24T08:00:00.000Z",
    spend: { amount: 79, currency: "EUR" },
    impressions: 0,
    clicks: 0,
    leads: 0,
  },
];

export interface MockDealerBillingAccount {
  currentPlanId: string;
  includedLeadCredits: number;
  invoiceBalance: Money;
  monthlySpend: Money;
  paymentMethod: string;
  renewalDate: string;
  status: "active" | "past_due" | "trialing";
  usedLeadCredits: number;
}

export const mockDealerBillingAccount: MockDealerBillingAccount = {
  currentPlanId: "dealer-growth",
  status: "active",
  renewalDate: "2026-07-01T00:00:00.000Z",
  paymentMethod: "Visa ending 4242",
  invoiceBalance: { amount: 0, currency: "EUR" },
  monthlySpend: { amount: 267, currency: "EUR" },
  includedLeadCredits: 120,
  usedLeadCredits: 74,
};

export const getMockCurrentDealerPlan = () =>
  mockDealerPlans.find(
    (plan) => plan.id === mockDealerBillingAccount.currentPlanId
  ) ?? mockDealerPlans[0];

export const getMockPromotionProductById = (id: string) =>
  mockPromotionProducts.find((product) => product.id === id);

export const getMockMonetizationStats = () => {
  const activePromotions = mockActivePromotions.filter(
    (promotion) => promotion.status === "active"
  );
  const totalLeads = mockActivePromotions.reduce(
    (total, promotion) => total + promotion.leads,
    0
  );
  const totalSpend = mockActivePromotions.reduce(
    (total, promotion) => total + promotion.spend.amount,
    0
  );

  return {
    activePromotions: activePromotions.length,
    leadCreditsRemaining:
      mockDealerBillingAccount.includedLeadCredits -
      mockDealerBillingAccount.usedLeadCredits,
    promotionLeads: totalLeads,
    promotionSpend: { amount: totalSpend, currency: "EUR" } satisfies Money,
  };
};
