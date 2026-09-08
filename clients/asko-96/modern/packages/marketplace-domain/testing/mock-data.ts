import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

// Representative stock captured from https://asko96.mobile.bg/ on 2026-09-06.
export const mockListings: VehicleListing[] = [
  {
    "id": "asko-21788444587626928",
    "slug": "asko-21788444587626928",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Toyota Rav4 HYBRID",
    "description": "Toyota Rav4 HYBRID, 2024 г., хибрид, 14 000 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-21788444587626928-toyota-rav4-hybrid-camera-podgrev-car-play-lizing",
    "price": {
      "amount": 36500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-01-1.webp",
        "alt": "Toyota Rav4 HYBRID"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Toyota",
      "model": "Rav4 HYBRID",
      "year": 2024,
      "bodyType": "suv",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 14000,
      "mileageUnit": "km",
      "enginePowerHp": 219,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T10:00:00.000Z",
    "promoted": false
  },
  {
    "id": "asko-11788418194310981",
    "slug": "asko-11788418194310981",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Audi A7 S-LINE",
    "description": "Audi A7 S-LINE, 2011 г., бензин, 211 000 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-11788418194310981-audi-a7-s-line-germany-distr-air-memory-podgrev-auto-h-liz",
    "price": {
      "amount": 14000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-02-1.webp",
        "alt": "Audi A7 S-LINE"
      },
      {
        "url": "/assets/asko96/vehicle-02-2.webp",
        "alt": "Audi A7 S-LINE"
      },
      {
        "url": "/assets/asko96/vehicle-02-3.webp",
        "alt": "Audi A7 S-LINE"
      },
      {
        "url": "/assets/asko96/vehicle-02-4.webp",
        "alt": "Audi A7 S-LINE"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A7 S-LINE",
      "year": 2011,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 211000,
      "mileageUnit": "km",
      "enginePowerHp": 299,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:59.000Z",
    "promoted": false
  },
  {
    "id": "asko-21788361724092359",
    "slug": "asko-21788361724092359",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Mercedes-Benz GLC Coupe 350AMG",
    "description": "Mercedes-Benz GLC Coupe 350AMG, 2018 г., дизел, 179 200 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-21788361724092359-mercedes-benz-glc-coupe-350amg-9gtron-germany-camera-ambient-keyless-go-li",
    "price": {
      "amount": 26000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-03-1.webp",
        "alt": "Mercedes-Benz GLC Coupe 350AMG"
      },
      {
        "url": "/assets/asko96/vehicle-03-2.webp",
        "alt": "Mercedes-Benz GLC Coupe 350AMG"
      },
      {
        "url": "/assets/asko96/vehicle-03-3.webp",
        "alt": "Mercedes-Benz GLC Coupe 350AMG"
      },
      {
        "url": "/assets/asko96/vehicle-03-4.webp",
        "alt": "Mercedes-Benz GLC Coupe 350AMG"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "GLC Coupe 350AMG",
      "year": 2018,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 179200,
      "mileageUnit": "km",
      "enginePowerHp": 258,
      "colorExterior": "Металик"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:58.000Z",
    "promoted": false
  },
  {
    "id": "asko-21788340495159936",
    "slug": "asko-21788340495159936",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Mercedes-Benz GLS 400 AMG",
    "description": "Mercedes-Benz GLS 400 AMG, 2020 г., дизел, 135 141 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Цената е без ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-21788340495159936-mercedes-benz-gls-400-amg-7mesta-pano-distr-360cam-burmest-obduh-vaku-li",
    "price": {
      "amount": 47000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-04-1.webp",
        "alt": "Mercedes-Benz GLS 400 AMG"
      },
      {
        "url": "/assets/asko96/vehicle-04-2.webp",
        "alt": "Mercedes-Benz GLS 400 AMG"
      },
      {
        "url": "/assets/asko96/vehicle-04-3.webp",
        "alt": "Mercedes-Benz GLS 400 AMG"
      },
      {
        "url": "/assets/asko96/vehicle-04-4.webp",
        "alt": "Mercedes-Benz GLS 400 AMG"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "GLS 400 AMG",
      "year": 2020,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 135141,
      "mileageUnit": "km",
      "enginePowerHp": 330,
      "colorExterior": "Металик"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:57.000Z",
    "promoted": false
  },
  {
    "id": "asko-11788268077076934",
    "slug": "asko-11788268077076934",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Mini Countryman ALL4",
    "description": "Mini Countryman ALL4, 2014 г., бензин, 205 000 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-11788268077076934-mini-countryman-all4-germany-panorama-podgrev-lizing",
    "price": {
      "amount": 7777,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-05-1.webp",
        "alt": "Mini Countryman ALL4"
      },
      {
        "url": "/assets/asko96/vehicle-05-2.webp",
        "alt": "Mini Countryman ALL4"
      },
      {
        "url": "/assets/asko96/vehicle-05-3.webp",
        "alt": "Mini Countryman ALL4"
      },
      {
        "url": "/assets/asko96/vehicle-05-4.webp",
        "alt": "Mini Countryman ALL4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mini",
      "model": "Countryman ALL4",
      "year": 2014,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 205000,
      "mileageUnit": "km",
      "enginePowerHp": 163,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:56.000Z",
    "promoted": false
  },
  {
    "id": "asko-21787916905998235",
    "slug": "asko-21787916905998235",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Audi SQ7 FUL LED",
    "description": "Audi SQ7 FUL LED, 2018 г., дизел, 170 000 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-21787916905998235-audi-sq7-ful-led-podgrev-obduh-distron-kamera-lane-asist-li",
    "price": {
      "amount": 32000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-06-1.webp",
        "alt": "Audi SQ7 FUL LED"
      },
      {
        "url": "/assets/asko96/vehicle-06-2.webp",
        "alt": "Audi SQ7 FUL LED"
      },
      {
        "url": "/assets/asko96/vehicle-06-3.webp",
        "alt": "Audi SQ7 FUL LED"
      },
      {
        "url": "/assets/asko96/vehicle-06-4.webp",
        "alt": "Audi SQ7 FUL LED"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "SQ7 FUL LED",
      "year": 2018,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 170000,
      "mileageUnit": "km",
      "enginePowerHp": 435,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:55.000Z",
    "promoted": false
  },
  {
    "id": "asko-11787665314733489",
    "slug": "asko-11787665314733489",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Citroen C5X PLUG IN",
    "description": "Citroen C5X PLUG IN, 2022 г., електрически, 162 000 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Виж оригиналната обява. Оригинална обява: https://asko96.mobile.bg/obiava-11787665314733489-citroen-c5x-plug-in-keyles-panorama-podgrev-head-up-360kamera",
    "price": {
      "amount": 17900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-07-1.webp",
        "alt": "Citroen C5X PLUG IN"
      },
      {
        "url": "/assets/asko96/vehicle-07-2.webp",
        "alt": "Citroen C5X PLUG IN"
      },
      {
        "url": "/assets/asko96/vehicle-07-3.webp",
        "alt": "Citroen C5X PLUG IN"
      },
      {
        "url": "/assets/asko96/vehicle-07-4.webp",
        "alt": "Citroen C5X PLUG IN"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Citroen",
      "model": "C5X PLUG IN",
      "year": 2022,
      "bodyType": "wagon",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 162000,
      "mileageUnit": "km",
      "enginePowerHp": 225,
      "colorExterior": ""
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:54.000Z",
    "promoted": false
  },
  {
    "id": "asko-11787664720233597",
    "slug": "asko-11787664720233597",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Audi A5 S-LINE PLUS",
    "description": "Audi A5 S-LINE PLUS, 2012 г., дизел, 230 000 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-11787664720233597-audi-a5-s-line-plus-edition-germany-bang-olufsen-lane-asis",
    "price": {
      "amount": 14000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-08-1.webp",
        "alt": "Audi A5 S-LINE PLUS"
      },
      {
        "url": "/assets/asko96/vehicle-08-2.webp",
        "alt": "Audi A5 S-LINE PLUS"
      },
      {
        "url": "/assets/asko96/vehicle-08-3.webp",
        "alt": "Audi A5 S-LINE PLUS"
      },
      {
        "url": "/assets/asko96/vehicle-08-4.webp",
        "alt": "Audi A5 S-LINE PLUS"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A5 S-LINE PLUS",
      "year": 2012,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 230000,
      "mileageUnit": "km",
      "enginePowerHp": 245,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:53.000Z",
    "promoted": false
  },
  {
    "id": "asko-11787318670316786",
    "slug": "asko-11787318670316786",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Mercedes-Benz E 220 AMG",
    "description": "Mercedes-Benz E 220 AMG, 2016 г., дизел, 195 530 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-11787318670316786-mercedes-benz-e-220-amg-germany-180camera-ambi-podgrev-park-pilot-lizi",
    "price": {
      "amount": 19500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-09-1.webp",
        "alt": "Mercedes-Benz E 220 AMG"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "E 220 AMG",
      "year": 2016,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 195530,
      "mileageUnit": "km",
      "enginePowerHp": 194,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:52.000Z",
    "promoted": false
  },
  {
    "id": "asko-11787292903991160",
    "slug": "asko-11787292903991160",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Mercedes-Benz S 680 L",
    "description": "Mercedes-Benz S 680 L, 2024 г., бензин, 140 000 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Цената е без ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-11787292903991160-mercedes-benz-s-680-l-v12-maybach-tvx3-distr-pano-obduh-burmester",
    "price": {
      "amount": 120000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-10-1.webp",
        "alt": "Mercedes-Benz S 680 L"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "S 680 L",
      "year": 2024,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 140000,
      "mileageUnit": "km",
      "enginePowerHp": 612,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:51.000Z",
    "promoted": false
  },
  {
    "id": "asko-11787147161945133",
    "slug": "asko-11787147161945133",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Mercedes-Benz S 500 L",
    "description": "Mercedes-Benz S 500 L, 2015 г., бензин, 173 291 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-11787147161945133-mercedes-benz-s-500-l-amg-4m-tvx3-distr-pano-vakuum-hud-obduh-masazh-li",
    "price": {
      "amount": 29500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-11-1.webp",
        "alt": "Mercedes-Benz S 500 L"
      },
      {
        "url": "/assets/asko96/vehicle-11-2.webp",
        "alt": "Mercedes-Benz S 500 L"
      },
      {
        "url": "/assets/asko96/vehicle-11-3.webp",
        "alt": "Mercedes-Benz S 500 L"
      },
      {
        "url": "/assets/asko96/vehicle-11-4.webp",
        "alt": "Mercedes-Benz S 500 L"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "S 500 L",
      "year": 2015,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 173291,
      "mileageUnit": "km",
      "enginePowerHp": 455,
      "colorExterior": "Металик"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:50.000Z",
    "promoted": false
  },
  {
    "id": "asko-21787145927135700",
    "slug": "asko-21787145927135700",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Mini Countryman SD",
    "description": "Mini Countryman SD, 2018 г., дизел, 190 582 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-21787145927135700-mini-countryman-sd-all4-germany-head-up-camera-pano-car-play-lizin",
    "price": {
      "amount": 18500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-12-1.webp",
        "alt": "Mini Countryman SD"
      },
      {
        "url": "/assets/asko96/vehicle-12-2.webp",
        "alt": "Mini Countryman SD"
      },
      {
        "url": "/assets/asko96/vehicle-12-3.webp",
        "alt": "Mini Countryman SD"
      },
      {
        "url": "/assets/asko96/vehicle-12-4.webp",
        "alt": "Mini Countryman SD"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mini",
      "model": "Countryman SD",
      "year": 2018,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 190582,
      "mileageUnit": "km",
      "enginePowerHp": 190,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:49.000Z",
    "promoted": false
  },
  {
    "id": "asko-21786786821064251",
    "slug": "asko-21786786821064251",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Porsche Cayenne S",
    "description": "Porsche Cayenne S, 2018 г., бензин, 165 009 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-21786786821064251-porsche-cayenne-s-germany-pano-digital-air-camera-keyless-go-lizin",
    "price": {
      "amount": 39000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-13-1.webp",
        "alt": "Porsche Cayenne S"
      },
      {
        "url": "/assets/asko96/vehicle-13-2.webp",
        "alt": "Porsche Cayenne S"
      },
      {
        "url": "/assets/asko96/vehicle-13-3.webp",
        "alt": "Porsche Cayenne S"
      },
      {
        "url": "/assets/asko96/vehicle-13-4.webp",
        "alt": "Porsche Cayenne S"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Porsche",
      "model": "Cayenne S",
      "year": 2018,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 165009,
      "mileageUnit": "km",
      "enginePowerHp": 440,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:48.000Z",
    "promoted": false
  },
  {
    "id": "asko-21786778589147860",
    "slug": "asko-21786778589147860",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "Jeep Compass 4x4",
    "description": "Jeep Compass 4x4, 2019 г., дизел, 181 889 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-21786778589147860-jeep-compass-4x4-limited-distron-lane-asyst-car-play-ambi-lizin",
    "price": {
      "amount": 14000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-14-1.webp",
        "alt": "Jeep Compass 4x4"
      },
      {
        "url": "/assets/asko96/vehicle-14-2.webp",
        "alt": "Jeep Compass 4x4"
      },
      {
        "url": "/assets/asko96/vehicle-14-3.webp",
        "alt": "Jeep Compass 4x4"
      },
      {
        "url": "/assets/asko96/vehicle-14-4.webp",
        "alt": "Jeep Compass 4x4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Jeep",
      "model": "Compass 4x4",
      "year": 2019,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 181889,
      "mileageUnit": "km",
      "enginePowerHp": 140,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:47.000Z",
    "promoted": false
  },
  {
    "id": "asko-21786540153108868",
    "slug": "asko-21786540153108868",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "BMW X3 М40D",
    "description": "BMW X3 М40D, 2022 г., дизел, 90 800 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-21786540153108868-bmw-x3-m40d-distr-3dcamera-harman-hud-podgrev-car-play-li",
    "price": {
      "amount": 43900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-15-1.webp",
        "alt": "BMW X3 М40D"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "X3 М40D",
      "year": 2022,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 90800,
      "mileageUnit": "km",
      "enginePowerHp": 340,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:46.000Z",
    "promoted": false
  },
  {
    "id": "asko-11786173977658651",
    "slug": "asko-11786173977658651",
    "category": "car",
    "dealerOrgId": "dealer-asko-96",
    "status": "active",
    "title": "BMW 550 M",
    "description": "BMW 550 M, 2013 г., дизел, 184 120 км. За актуална наличност, оборудване и условия се свържете с АСКО 96. Не се начислява ДДС. Оригинална обява: https://asko96.mobile.bg/obiava-11786173977658651-bmw-550-m-xd-shadow-line-360cam-podgrev-memory-harman-lizi",
    "price": {
      "amount": 17500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/asko96/vehicle-16-1.webp",
        "alt": "BMW 550 M"
      },
      {
        "url": "/assets/asko96/vehicle-16-2.webp",
        "alt": "BMW 550 M"
      },
      {
        "url": "/assets/asko96/vehicle-16-3.webp",
        "alt": "BMW 550 M"
      },
      {
        "url": "/assets/asko96/vehicle-16-4.webp",
        "alt": "BMW 550 M"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "София",
      "region": "Ботевградско шосе",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "550 M",
      "year": 2013,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 184120,
      "mileageUnit": "km",
      "enginePowerHp": 381,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-asko-96",
      "type": "dealer",
      "displayName": "АСКО 96",
      "verificationStatus": "unverified",
      "city": "София"
    },
    "publishedAt": "2026-09-06T09:59:45.000Z",
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
