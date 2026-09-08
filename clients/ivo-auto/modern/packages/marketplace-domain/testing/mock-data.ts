import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "ivo-11786049135297264",
    "slug": "ivo-11786049135297264",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "Rolls-Royce Ghost",
    "description": "Rolls-Royce Ghost, 2011 г., 66 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11786049135297264-rolls-royce-ghost",
    "price": {
      "amount": 105000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-01-1.webp",
        "alt": "Rolls-Royce Ghost"
      },
      {
        "url": "/assets/ivo-auto/vehicle-01-2.webp",
        "alt": "Rolls-Royce Ghost"
      },
      {
        "url": "/assets/ivo-auto/vehicle-01-3.webp",
        "alt": "Rolls-Royce Ghost"
      },
      {
        "url": "/assets/ivo-auto/vehicle-01-4.webp",
        "alt": "Rolls-Royce Ghost"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Rolls-Royce",
      "model": "Ghost",
      "year": 2011,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 66000,
      "mileageUnit": "km",
      "enginePowerHp": 580,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T10:00:00.000Z",
    "promoted": false
  },
  {
    "id": "ivo-11784822971964926",
    "slug": "ivo-11784822971964926",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "Audi A4 S-line 4x4 2.0T",
    "description": "Audi A4 S-line 4x4 2.0T, 2008 г., 195 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11784822971964926-audi-a4-s-line-4x4-2-0t",
    "price": {
      "amount": 2800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-02-1.webp",
        "alt": "Audi A4 S-line 4x4 2.0T"
      },
      {
        "url": "/assets/ivo-auto/vehicle-02-2.webp",
        "alt": "Audi A4 S-line 4x4 2.0T"
      },
      {
        "url": "/assets/ivo-auto/vehicle-02-3.webp",
        "alt": "Audi A4 S-line 4x4 2.0T"
      },
      {
        "url": "/assets/ivo-auto/vehicle-02-4.webp",
        "alt": "Audi A4 S-line 4x4 2.0T"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [
      {
        "bg": "4x4",
        "en": "4x4"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "A4 S-line 4x4 2.0T",
      "year": 2008,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 195000,
      "mileageUnit": "km",
      "enginePowerHp": 200,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:59.000Z",
    "promoted": false
  },
  {
    "id": "ivo-11775231551222536",
    "slug": "ivo-11775231551222536",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "Porsche Panamera Turbo 4.8i",
    "description": "Porsche Panamera Turbo 4.8i, 2010 г., 145 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11775231551222536-porsche-panamera-turbo-4-8i",
    "price": {
      "amount": 21000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-03-1.webp",
        "alt": "Porsche Panamera Turbo 4.8i"
      },
      {
        "url": "/assets/ivo-auto/vehicle-03-2.webp",
        "alt": "Porsche Panamera Turbo 4.8i"
      },
      {
        "url": "/assets/ivo-auto/vehicle-03-3.webp",
        "alt": "Porsche Panamera Turbo 4.8i"
      },
      {
        "url": "/assets/ivo-auto/vehicle-03-4.webp",
        "alt": "Porsche Panamera Turbo 4.8i"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [
      {
        "bg": "4x4",
        "en": "4x4"
      }
    ],
    "spec": {
      "make": "Porsche",
      "model": "Panamera Turbo 4.8i",
      "year": 2010,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 145000,
      "mileageUnit": "km",
      "enginePowerHp": 500,
      "colorExterior": "Син"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:58.000Z",
    "promoted": false
  },
  {
    "id": "ivo-21784804233950248",
    "slug": "ivo-21784804233950248",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "Dodge Durango 3.6 Face Lift Газ.Инж. 6+ 1",
    "description": "Dodge Durango 3.6 Face Lift Газ.Инж. 6+ 1, 2015 г., 202 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-21784804233950248-dodge-durango-3-6-face-lift-gaz-inzh-6-1",
    "price": {
      "amount": 13900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-04-1.webp",
        "alt": "Dodge Durango 3.6 Face Lift Газ.Инж. 6+ 1"
      },
      {
        "url": "/assets/ivo-auto/vehicle-04-2.webp",
        "alt": "Dodge Durango 3.6 Face Lift Газ.Инж. 6+ 1"
      },
      {
        "url": "/assets/ivo-auto/vehicle-04-3.webp",
        "alt": "Dodge Durango 3.6 Face Lift Газ.Инж. 6+ 1"
      },
      {
        "url": "/assets/ivo-auto/vehicle-04-4.webp",
        "alt": "Dodge Durango 3.6 Face Lift Газ.Инж. 6+ 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [
      {
        "bg": "4x4",
        "en": "4x4"
      }
    ],
    "spec": {
      "make": "Dodge",
      "model": "Durango 3.6 Face Lift Газ.Инж. 6+ 1",
      "year": 2015,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 202000,
      "mileageUnit": "km",
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:57.000Z",
    "promoted": false
  },
  {
    "id": "ivo-11784710943679925",
    "slug": "ivo-11784710943679925",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "BMW 520 M-пакет Digital",
    "description": "BMW 520 M-пакет Digital, 2018 г., 165 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11784710943679925-bmw-520-m-paket-digital",
    "price": {
      "amount": 19000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-05-1.webp",
        "alt": "BMW 520 M-пакет Digital"
      },
      {
        "url": "/assets/ivo-auto/vehicle-05-2.webp",
        "alt": "BMW 520 M-пакет Digital"
      },
      {
        "url": "/assets/ivo-auto/vehicle-05-3.webp",
        "alt": "BMW 520 M-пакет Digital"
      },
      {
        "url": "/assets/ivo-auto/vehicle-05-4.webp",
        "alt": "BMW 520 M-пакет Digital"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "520 M-пакет Digital",
      "year": 2018,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 165000,
      "mileageUnit": "km",
      "enginePowerHp": 190,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:56.000Z",
    "promoted": false
  },
  {
    "id": "ivo-11780924566736048",
    "slug": "ivo-11780924566736048",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "VW Touran 1.6TDI Автомат 6+ 1",
    "description": "VW Touran 1.6TDI Автомат 6+ 1, 2012 г., 210 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11780924566736048-vw-touran-1-6tdi-avtomat-6-1",
    "price": {
      "amount": 3999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-06-1.webp",
        "alt": "VW Touran 1.6TDI Автомат 6+ 1"
      },
      {
        "url": "/assets/ivo-auto/vehicle-06-2.webp",
        "alt": "VW Touran 1.6TDI Автомат 6+ 1"
      },
      {
        "url": "/assets/ivo-auto/vehicle-06-3.webp",
        "alt": "VW Touran 1.6TDI Автомат 6+ 1"
      },
      {
        "url": "/assets/ivo-auto/vehicle-06-4.webp",
        "alt": "VW Touran 1.6TDI Автомат 6+ 1"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "VW",
      "model": "Touran 1.6TDI Автомат 6+ 1",
      "year": 2012,
      "bodyType": "van",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 210000,
      "mileageUnit": "km",
      "enginePowerHp": 105,
      "colorExterior": "Сребърен"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:55.000Z",
    "promoted": false
  },
  {
    "id": "ivo-11778070752693531",
    "slug": "ivo-11778070752693531",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "VW CC 2.0i",
    "description": "VW CC 2.0i, 2013 г., 214 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11778070752693531-vw-cc-2-0i",
    "price": {
      "amount": 9000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-07-1.webp",
        "alt": "VW CC 2.0i"
      },
      {
        "url": "/assets/ivo-auto/vehicle-07-2.webp",
        "alt": "VW CC 2.0i"
      },
      {
        "url": "/assets/ivo-auto/vehicle-07-3.webp",
        "alt": "VW CC 2.0i"
      },
      {
        "url": "/assets/ivo-auto/vehicle-07-4.webp",
        "alt": "VW CC 2.0i"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "VW",
      "model": "CC 2.0i",
      "year": 2013,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 214000,
      "mileageUnit": "km",
      "enginePowerHp": 211,
      "colorExterior": "Бордо"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:54.000Z",
    "promoted": false
  },
  {
    "id": "ivo-21779453321117197",
    "slug": "ivo-21779453321117197",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "BMW X5 4.0D Face Lift 8ск.",
    "description": "BMW X5 4.0D Face Lift 8ск., 2011 г., 196 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-21779453321117197-bmw-x5-4-0d-face-lift-8sk",
    "price": {
      "amount": 9500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-08-1.webp",
        "alt": "BMW X5 4.0D Face Lift 8ск."
      },
      {
        "url": "/assets/ivo-auto/vehicle-08-2.webp",
        "alt": "BMW X5 4.0D Face Lift 8ск."
      },
      {
        "url": "/assets/ivo-auto/vehicle-08-3.webp",
        "alt": "BMW X5 4.0D Face Lift 8ск."
      },
      {
        "url": "/assets/ivo-auto/vehicle-08-4.webp",
        "alt": "BMW X5 4.0D Face Lift 8ск."
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [
      {
        "bg": "4x4",
        "en": "4x4"
      }
    ],
    "spec": {
      "make": "BMW",
      "model": "X5 4.0D Face Lift 8ск.",
      "year": 2011,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 196000,
      "mileageUnit": "km",
      "enginePowerHp": 313,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:53.000Z",
    "promoted": false
  },
  {
    "id": "ivo-21779444147151936",
    "slug": "ivo-21779444147151936",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "BMW X5 3.0D Face Lift",
    "description": "BMW X5 3.0D Face Lift, 2005 г., 195 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-21779444147151936-bmw-x5-3-0d-face-lift",
    "price": {
      "amount": 4600,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-09-1.webp",
        "alt": "BMW X5 3.0D Face Lift"
      },
      {
        "url": "/assets/ivo-auto/vehicle-09-2.webp",
        "alt": "BMW X5 3.0D Face Lift"
      },
      {
        "url": "/assets/ivo-auto/vehicle-09-3.webp",
        "alt": "BMW X5 3.0D Face Lift"
      },
      {
        "url": "/assets/ivo-auto/vehicle-09-4.webp",
        "alt": "BMW X5 3.0D Face Lift"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [
      {
        "bg": "4x4",
        "en": "4x4"
      }
    ],
    "spec": {
      "make": "BMW",
      "model": "X5 3.0D Face Lift",
      "year": 2005,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 195000,
      "mileageUnit": "km",
      "enginePowerHp": 218,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:52.000Z",
    "promoted": false
  },
  {
    "id": "ivo-11780659371731573",
    "slug": "ivo-11780659371731573",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "BMW 418 D M-Пакет",
    "description": "BMW 418 D M-Пакет, 2017 г., 149 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11780659371731573-bmw-418-d-m-paket",
    "price": {
      "amount": 16200,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-10-1.webp",
        "alt": "BMW 418 D M-Пакет"
      },
      {
        "url": "/assets/ivo-auto/vehicle-10-2.webp",
        "alt": "BMW 418 D M-Пакет"
      },
      {
        "url": "/assets/ivo-auto/vehicle-10-3.webp",
        "alt": "BMW 418 D M-Пакет"
      },
      {
        "url": "/assets/ivo-auto/vehicle-10-4.webp",
        "alt": "BMW 418 D M-Пакет"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "418 D M-Пакет",
      "year": 2017,
      "bodyType": "coupe",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 149000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:51.000Z",
    "promoted": false
  },
  {
    "id": "ivo-21781871293573646",
    "slug": "ivo-21781871293573646",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "Subaru B9 tribeca 3.0 Газ.Инж.",
    "description": "Subaru B9 tribeca 3.0 Газ.Инж., 2006 г., 170 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-21781871293573646-subaru-b9-tribeca-3-0-gaz-inzh",
    "price": {
      "amount": 3999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-11-1.webp",
        "alt": "Subaru B9 tribeca 3.0 Газ.Инж."
      },
      {
        "url": "/assets/ivo-auto/vehicle-11-2.webp",
        "alt": "Subaru B9 tribeca 3.0 Газ.Инж."
      },
      {
        "url": "/assets/ivo-auto/vehicle-11-3.webp",
        "alt": "Subaru B9 tribeca 3.0 Газ.Инж."
      },
      {
        "url": "/assets/ivo-auto/vehicle-11-4.webp",
        "alt": "Subaru B9 tribeca 3.0 Газ.Инж."
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [
      {
        "bg": "4x4",
        "en": "4x4"
      }
    ],
    "spec": {
      "make": "Subaru",
      "model": "B9 tribeca 3.0 Газ.Инж.",
      "year": 2006,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 170000,
      "mileageUnit": "km",
      "enginePowerHp": 250,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:50.000Z",
    "promoted": false
  },
  {
    "id": "ivo-21762959348847465",
    "slug": "ivo-21762959348847465",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "Mercedes-Benz ML 250 AMG-Пакет",
    "description": "Mercedes-Benz ML 250 AMG-Пакет, 2014 г., 130 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-21762959348847465-mercedes-benz-ml-250-amg-paket",
    "price": {
      "amount": 14500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-12-1.webp",
        "alt": "Mercedes-Benz ML 250 AMG-Пакет"
      },
      {
        "url": "/assets/ivo-auto/vehicle-12-2.webp",
        "alt": "Mercedes-Benz ML 250 AMG-Пакет"
      },
      {
        "url": "/assets/ivo-auto/vehicle-12-3.webp",
        "alt": "Mercedes-Benz ML 250 AMG-Пакет"
      },
      {
        "url": "/assets/ivo-auto/vehicle-12-4.webp",
        "alt": "Mercedes-Benz ML 250 AMG-Пакет"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [
      {
        "bg": "4x4",
        "en": "4x4"
      }
    ],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "ML 250 AMG-Пакет",
      "year": 2014,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 130000,
      "mileageUnit": "km",
      "enginePowerHp": 204,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:49.000Z",
    "promoted": false
  },
  {
    "id": "ivo-11774893593485843",
    "slug": "ivo-11774893593485843",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "Mercedes-Benz S 500 4Matic Газ.Инж",
    "description": "Mercedes-Benz S 500 4Matic Газ.Инж, 2007 г., 290 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11774893593485843-mercedes-benz-s-500-4matic-gaz-inzh",
    "price": {
      "amount": 10000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-13-1.webp",
        "alt": "Mercedes-Benz S 500 4Matic Газ.Инж"
      },
      {
        "url": "/assets/ivo-auto/vehicle-13-2.webp",
        "alt": "Mercedes-Benz S 500 4Matic Газ.Инж"
      },
      {
        "url": "/assets/ivo-auto/vehicle-13-3.webp",
        "alt": "Mercedes-Benz S 500 4Matic Газ.Инж"
      },
      {
        "url": "/assets/ivo-auto/vehicle-13-4.webp",
        "alt": "Mercedes-Benz S 500 4Matic Газ.Инж"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [
      {
        "bg": "4x4",
        "en": "4x4"
      }
    ],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "S 500 4Matic Газ.Инж",
      "year": 2007,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 290000,
      "mileageUnit": "km",
      "enginePowerHp": 388,
      "colorExterior": "Син"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:48.000Z",
    "promoted": false
  },
  {
    "id": "ivo-11756369185395904",
    "slug": "ivo-11756369185395904",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "BMW 730 D M-Пакет",
    "description": "BMW 730 D M-Пакет, 2010 г., 214 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11756369185395904-bmw-730-d-m-paket",
    "price": {
      "amount": 11000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-14-1.webp",
        "alt": "BMW 730 D M-Пакет"
      },
      {
        "url": "/assets/ivo-auto/vehicle-14-2.webp",
        "alt": "BMW 730 D M-Пакет"
      },
      {
        "url": "/assets/ivo-auto/vehicle-14-3.webp",
        "alt": "BMW 730 D M-Пакет"
      },
      {
        "url": "/assets/ivo-auto/vehicle-14-4.webp",
        "alt": "BMW 730 D M-Пакет"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "730 D M-Пакет",
      "year": 2010,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 214000,
      "mileageUnit": "km",
      "enginePowerHp": 245,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:47.000Z",
    "promoted": false
  },
  {
    "id": "ivo-11775822194120541",
    "slug": "ivo-11775822194120541",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "BMW M5",
    "description": "BMW M5, 2008 г., 218 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11775822194120541-bmw-m5",
    "price": {
      "amount": 30000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-15-1.webp",
        "alt": "BMW M5"
      },
      {
        "url": "/assets/ivo-auto/vehicle-15-2.webp",
        "alt": "BMW M5"
      },
      {
        "url": "/assets/ivo-auto/vehicle-15-3.webp",
        "alt": "BMW M5"
      },
      {
        "url": "/assets/ivo-auto/vehicle-15-4.webp",
        "alt": "BMW M5"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "M5",
      "year": 2008,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 218000,
      "mileageUnit": "km",
      "enginePowerHp": 507,
      "colorExterior": "Tъмно син"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:46.000Z",
    "promoted": false
  },
  {
    "id": "ivo-11769186790854071",
    "slug": "ivo-11769186790854071",
    "category": "car",
    "dealerOrgId": "dealer-ivo-auto",
    "status": "active",
    "title": "Audi A8 Full Led",
    "description": "Audi A8 Full Led, 2013 г., 215 000 км. Публикувана обява на Иво Ауто. Потвърдете наличността, оборудването и условията по телефона. Не се начислява ДДС. Оригинална обява: https://ivoauto-varna.mobile.bg/obiava-11769186790854071-audi-a8-full-led",
    "price": {
      "amount": 15500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/ivo-auto/vehicle-16-1.webp",
        "alt": "Audi A8 Full Led"
      },
      {
        "url": "/assets/ivo-auto/vehicle-16-2.webp",
        "alt": "Audi A8 Full Led"
      },
      {
        "url": "/assets/ivo-auto/vehicle-16-3.webp",
        "alt": "Audi A8 Full Led"
      },
      {
        "url": "/assets/ivo-auto/vehicle-16-4.webp",
        "alt": "Audi A8 Full Led"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Владислав Варненчик",
      "country": "България"
    },
    "features": [
      {
        "bg": "4x4",
        "en": "4x4"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "A8 Full Led",
      "year": 2013,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 215000,
      "mileageUnit": "km",
      "enginePowerHp": 250,
      "colorExterior": "Tъмно син"
    },
    "seller": {
      "id": "dealer-ivo-auto",
      "type": "dealer",
      "displayName": "Иво Ауто",
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
