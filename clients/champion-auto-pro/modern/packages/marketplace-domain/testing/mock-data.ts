import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

// Representative stock snapshot, 2026-09-07.
export const mockListings: VehicleListing[] = [
  {
    "id": "champion-11787294758482309",
    "slug": "champion-11787294758482309",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "BMW iX 40Xdrive",
    "description": "BMW iX 40Xdrive, 2022 г., електрически, 28 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11787294758482309-bmw-ix-40xdrive-m-sport-h-k-360",
    "price": {
      "amount": 43800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-01-1.webp",
        "alt": "BMW iX 40Xdrive"
      },
      {
        "url": "/assets/champion/vehicle-01-2.webp",
        "alt": "BMW iX 40Xdrive"
      },
      {
        "url": "/assets/champion/vehicle-01-3.webp",
        "alt": "BMW iX 40Xdrive"
      },
      {
        "url": "/assets/champion/vehicle-01-4.webp",
        "alt": "BMW iX 40Xdrive"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "iX 40Xdrive",
      "year": 2022,
      "bodyType": "suv",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 28000,
      "mileageUnit": "km",
      "enginePowerHp": 326,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T10:00:00.000Z",
    "promoted": false
  },
  {
    "id": "champion-11787311251312869",
    "slug": "champion-11787311251312869",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Audi A6 50TDI Quattro",
    "description": "Audi A6 50TDI Quattro, 2019 г., дизел, 176 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11787311251312869-audi-a6-50tdi-quattro",
    "price": {
      "amount": 23000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-02-1.webp",
        "alt": "Audi A6 50TDI Quattro"
      },
      {
        "url": "/assets/champion/vehicle-02-2.webp",
        "alt": "Audi A6 50TDI Quattro"
      },
      {
        "url": "/assets/champion/vehicle-02-3.webp",
        "alt": "Audi A6 50TDI Quattro"
      },
      {
        "url": "/assets/champion/vehicle-02-4.webp",
        "alt": "Audi A6 50TDI Quattro"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A6 50TDI Quattro",
      "year": 2019,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 176000,
      "mileageUnit": "km",
      "enginePowerHp": 286,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:59.000Z",
    "promoted": false
  },
  {
    "id": "champion-11784794853353090",
    "slug": "champion-11784794853353090",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Smart Forfour 22kw.-26000км.",
    "description": "Smart Forfour 22kw.-26000км., 2021 г., електрически, 26 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11784794853353090-smart-forfour-22kw-26000km",
    "price": {
      "amount": 12900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-03-1.webp",
        "alt": "Smart Forfour 22kw.-26000км."
      },
      {
        "url": "/assets/champion/vehicle-03-2.webp",
        "alt": "Smart Forfour 22kw.-26000км."
      },
      {
        "url": "/assets/champion/vehicle-03-3.webp",
        "alt": "Smart Forfour 22kw.-26000км."
      },
      {
        "url": "/assets/champion/vehicle-03-4.webp",
        "alt": "Smart Forfour 22kw.-26000км."
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Smart",
      "model": "Forfour 22kw.-26000км.",
      "year": 2021,
      "bodyType": "hatchback",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 26000,
      "mileageUnit": "km",
      "enginePowerHp": 82,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:58.000Z",
    "promoted": false
  },
  {
    "id": "champion-11784640487309304",
    "slug": "champion-11784640487309304",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Mercedes-Benz S 500 AMG Packet 63 Long",
    "description": "Mercedes-Benz S 500 AMG Packet 63 Long, 2014 г., бензин, 265 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11784640487309304-mercedes-benz-s-500-amg-packet-63-long",
    "price": {
      "amount": 27999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-04-1.webp",
        "alt": "Mercedes-Benz S 500 AMG Packet 63 Long"
      },
      {
        "url": "/assets/champion/vehicle-04-2.webp",
        "alt": "Mercedes-Benz S 500 AMG Packet 63 Long"
      },
      {
        "url": "/assets/champion/vehicle-04-3.webp",
        "alt": "Mercedes-Benz S 500 AMG Packet 63 Long"
      },
      {
        "url": "/assets/champion/vehicle-04-4.webp",
        "alt": "Mercedes-Benz S 500 AMG Packet 63 Long"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "S 500 AMG Packet 63 Long",
      "year": 2014,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 265000,
      "mileageUnit": "km",
      "enginePowerHp": 455,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:57.000Z",
    "promoted": false
  },
  {
    "id": "champion-11771862221224289",
    "slug": "champion-11771862221224289",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Mercedes-Benz S 400 LONG-FULL",
    "description": "Mercedes-Benz S 400 LONG-FULL, 2023 г., дизел, 73 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11771862221224289-mercedes-benz-s-400-long-full",
    "price": {
      "amount": 89999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-05-1.webp",
        "alt": "Mercedes-Benz S 400 LONG-FULL"
      },
      {
        "url": "/assets/champion/vehicle-05-2.webp",
        "alt": "Mercedes-Benz S 400 LONG-FULL"
      },
      {
        "url": "/assets/champion/vehicle-05-3.webp",
        "alt": "Mercedes-Benz S 400 LONG-FULL"
      },
      {
        "url": "/assets/champion/vehicle-05-4.webp",
        "alt": "Mercedes-Benz S 400 LONG-FULL"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "S 400 LONG-FULL",
      "year": 2023,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 73000,
      "mileageUnit": "km",
      "enginePowerHp": 330,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:56.000Z",
    "promoted": false
  },
  {
    "id": "champion-21784732491989700",
    "slug": "champion-21784732491989700",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Mercedes-Benz ML 350 AMG Packet",
    "description": "Mercedes-Benz ML 350 AMG Packet, 2012 г., дизел, 185 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-21784732491989700-mercedes-benz-ml-350-amg-packet",
    "price": {
      "amount": 15999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-06-1.webp",
        "alt": "Mercedes-Benz ML 350 AMG Packet"
      },
      {
        "url": "/assets/champion/vehicle-06-2.webp",
        "alt": "Mercedes-Benz ML 350 AMG Packet"
      },
      {
        "url": "/assets/champion/vehicle-06-3.webp",
        "alt": "Mercedes-Benz ML 350 AMG Packet"
      },
      {
        "url": "/assets/champion/vehicle-06-4.webp",
        "alt": "Mercedes-Benz ML 350 AMG Packet"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "ML 350 AMG Packet",
      "year": 2012,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 185000,
      "mileageUnit": "km",
      "enginePowerHp": 258,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:55.000Z",
    "promoted": false
  },
  {
    "id": "champion-11784720940119234",
    "slug": "champion-11784720940119234",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Audi A7 S-Line FULL",
    "description": "Audi A7 S-Line FULL, 2020 г., дизел, 108 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11784720940119234-audi-a7-s-line-full-108000km",
    "price": {
      "amount": 35999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-07-1.webp",
        "alt": "Audi A7 S-Line FULL"
      },
      {
        "url": "/assets/champion/vehicle-07-2.webp",
        "alt": "Audi A7 S-Line FULL"
      },
      {
        "url": "/assets/champion/vehicle-07-3.webp",
        "alt": "Audi A7 S-Line FULL"
      },
      {
        "url": "/assets/champion/vehicle-07-4.webp",
        "alt": "Audi A7 S-Line FULL"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A7 S-Line FULL",
      "year": 2020,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 108000,
      "mileageUnit": "km",
      "enginePowerHp": 286,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:54.000Z",
    "promoted": false
  },
  {
    "id": "champion-11783584641538327",
    "slug": "champion-11783584641538327",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Mercedes-Benz B 200 AMG Line",
    "description": "Mercedes-Benz B 200 AMG Line, 2020 г., дизел, 95 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11783584641538327-mercedes-benz-b-200-amg-line",
    "price": {
      "amount": 17999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-08-1.webp",
        "alt": "Mercedes-Benz B 200 AMG Line"
      },
      {
        "url": "/assets/champion/vehicle-08-2.webp",
        "alt": "Mercedes-Benz B 200 AMG Line"
      },
      {
        "url": "/assets/champion/vehicle-08-3.webp",
        "alt": "Mercedes-Benz B 200 AMG Line"
      },
      {
        "url": "/assets/champion/vehicle-08-4.webp",
        "alt": "Mercedes-Benz B 200 AMG Line"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "B 200 AMG Line",
      "year": 2020,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 95000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:53.000Z",
    "promoted": false
  },
  {
    "id": "champion-21778484741555035",
    "slug": "champion-21778484741555035",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Audi SQ7 S-Line",
    "description": "Audi SQ7 S-Line, 2017 г., дизел, 230 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-21778484741555035-audi-sq7-s-line",
    "price": {
      "amount": 33000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-09-1.webp",
        "alt": "Audi SQ7 S-Line"
      },
      {
        "url": "/assets/champion/vehicle-09-2.webp",
        "alt": "Audi SQ7 S-Line"
      },
      {
        "url": "/assets/champion/vehicle-09-3.webp",
        "alt": "Audi SQ7 S-Line"
      },
      {
        "url": "/assets/champion/vehicle-09-4.webp",
        "alt": "Audi SQ7 S-Line"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "SQ7 S-Line",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 230000,
      "mileageUnit": "km",
      "enginePowerHp": 435,
      "colorExterior": "Графит"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:52.000Z",
    "promoted": false
  },
  {
    "id": "champion-11758265694582686",
    "slug": "champion-11758265694582686",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Audi Rs5 2.9TFSI V6 Quattro",
    "description": "Audi Rs5 2.9TFSI V6 Quattro, 2020 г., бензин, 182 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11758265694582686-audi-rs5-2-9tfsi-v6-quattro",
    "price": {
      "amount": 39999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-10-1.webp",
        "alt": "Audi Rs5 2.9TFSI V6 Quattro"
      },
      {
        "url": "/assets/champion/vehicle-10-2.webp",
        "alt": "Audi Rs5 2.9TFSI V6 Quattro"
      },
      {
        "url": "/assets/champion/vehicle-10-3.webp",
        "alt": "Audi Rs5 2.9TFSI V6 Quattro"
      },
      {
        "url": "/assets/champion/vehicle-10-4.webp",
        "alt": "Audi Rs5 2.9TFSI V6 Quattro"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "Rs5 2.9TFSI V6 Quattro",
      "year": 2020,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 182000,
      "mileageUnit": "km",
      "enginePowerHp": 450,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:51.000Z",
    "promoted": false
  },
  {
    "id": "champion-11773307576284789",
    "slug": "champion-11773307576284789",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Audi E-Tron 2 X S-Line",
    "description": "Audi E-Tron 2 X S-Line, 2021 г., електрически, 72 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11773307576284789-audi-e-tron-2-x-s-line",
    "price": {
      "amount": 31000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-11-1.webp",
        "alt": "Audi E-Tron 2 X S-Line"
      },
      {
        "url": "/assets/champion/vehicle-11-2.webp",
        "alt": "Audi E-Tron 2 X S-Line"
      },
      {
        "url": "/assets/champion/vehicle-11-3.webp",
        "alt": "Audi E-Tron 2 X S-Line"
      },
      {
        "url": "/assets/champion/vehicle-11-4.webp",
        "alt": "Audi E-Tron 2 X S-Line"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "E-Tron 2 X S-Line",
      "year": 2021,
      "bodyType": "suv",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 72000,
      "mileageUnit": "km",
      "enginePowerHp": 313,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:50.000Z",
    "promoted": false
  },
  {
    "id": "champion-11787215050268120",
    "slug": "champion-11787215050268120",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "VW ID.5 PRO 82kw",
    "description": "VW ID.5 PRO 82kw, 2023 г., електрически, 104 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11787215050268120-vw-id-5-pro-82kw-garantsionen-104000km",
    "price": {
      "amount": 29999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-12-1.webp",
        "alt": "VW ID.5 PRO 82kw"
      },
      {
        "url": "/assets/champion/vehicle-12-2.webp",
        "alt": "VW ID.5 PRO 82kw"
      },
      {
        "url": "/assets/champion/vehicle-12-3.webp",
        "alt": "VW ID.5 PRO 82kw"
      },
      {
        "url": "/assets/champion/vehicle-12-4.webp",
        "alt": "VW ID.5 PRO 82kw"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "VW",
      "model": "ID.5 PRO 82kw",
      "year": 2023,
      "bodyType": "hatchback",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 104000,
      "mileageUnit": "km",
      "enginePowerHp": 204,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:49.000Z",
    "promoted": false
  },
  {
    "id": "champion-21787142969943440",
    "slug": "champion-21787142969943440",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Toyota Highlander 60000km Газ Prins",
    "description": "Toyota Highlander 60000km Газ Prins, 2019 г., бензин, 60 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-21787142969943440-toyota-highlander-60000km-gaz-prins",
    "price": {
      "amount": 26800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-13-1.webp",
        "alt": "Toyota Highlander 60000km Газ Prins"
      },
      {
        "url": "/assets/champion/vehicle-13-2.webp",
        "alt": "Toyota Highlander 60000km Газ Prins"
      },
      {
        "url": "/assets/champion/vehicle-13-3.webp",
        "alt": "Toyota Highlander 60000km Газ Prins"
      },
      {
        "url": "/assets/champion/vehicle-13-4.webp",
        "alt": "Toyota Highlander 60000km Газ Prins"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Toyota",
      "model": "Highlander 60000km Газ Prins",
      "year": 2019,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 60000,
      "mileageUnit": "km",
      "enginePowerHp": 295,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:48.000Z",
    "promoted": false
  },
  {
    "id": "champion-21787197677876419",
    "slug": "champion-21787197677876419",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Mercedes-Benz EQE 300",
    "description": "Mercedes-Benz EQE 300, 2023 г., електрически, 47 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-21787197677876419-mercedes-benz-eqe-300-led-navi-kam",
    "price": {
      "amount": 44999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-14-1.webp",
        "alt": "Mercedes-Benz EQE 300"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "EQE 300",
      "year": 2023,
      "bodyType": "sedan",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 47000,
      "mileageUnit": "km",
      "enginePowerHp": 245,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:47.000Z",
    "promoted": false
  },
  {
    "id": "champion-21787200936302723",
    "slug": "champion-21787200936302723",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Mercedes-Benz EQC 400",
    "description": "Mercedes-Benz EQC 400, 2021 г., електрически, 68 900 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-21787200936302723-mercedes-benz-eqc-400-4matic-amg-hud-360kam",
    "price": {
      "amount": 38800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-15-1.webp",
        "alt": "Mercedes-Benz EQC 400"
      },
      {
        "url": "/assets/champion/vehicle-15-2.webp",
        "alt": "Mercedes-Benz EQC 400"
      },
      {
        "url": "/assets/champion/vehicle-15-3.webp",
        "alt": "Mercedes-Benz EQC 400"
      },
      {
        "url": "/assets/champion/vehicle-15-4.webp",
        "alt": "Mercedes-Benz EQC 400"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "EQC 400",
      "year": 2021,
      "bodyType": "suv",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 68900,
      "mileageUnit": "km",
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:46.000Z",
    "promoted": false
  },
  {
    "id": "champion-11786100747512292",
    "slug": "champion-11786100747512292",
    "category": "car",
    "dealerOrgId": "dealer-champion-auto-pro",
    "status": "active",
    "title": "Renault Captur",
    "description": "Renault Captur, 2015 г., дизел, 55 000 км. Публикувана обява към 07.09.2026. Наличност, оборудване и условия се потвърждават с Champion Auto Pro. Не се начислява ДДС. Оригинална обява: https://championautopro.mobile.bg/obiava-11786100747512292-renault-captur-55000-km",
    "price": {
      "amount": 9200,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/champion/vehicle-16-1.webp",
        "alt": "Renault Captur"
      },
      {
        "url": "/assets/champion/vehicle-16-2.webp",
        "alt": "Renault Captur"
      },
      {
        "url": "/assets/champion/vehicle-16-3.webp",
        "alt": "Renault Captur"
      },
      {
        "url": "/assets/champion/vehicle-16-4.webp",
        "alt": "Renault Captur"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Renault",
      "model": "Captur",
      "year": 2015,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 55000,
      "mileageUnit": "km",
      "enginePowerHp": 90,
      "colorExterior": "Червен"
    },
    "seller": {
      "id": "dealer-champion-auto-pro",
      "type": "dealer",
      "displayName": "Champion Auto Pro",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:45.000Z",
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
