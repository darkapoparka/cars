import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "am-1001",
    "slug": "vw-golf-1-4-2007-11784527405061757",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "VW Golf 1.4 БЕНЗИН",
    "description": "VW Golf 1.4 БЕНЗИН, 2007 г., 235 193 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 3600,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-01-1.webp",
        "alt": "VW Golf 1.4 БЕНЗИН"
      },
      {
        "url": "/assets/priselci/vehicle-01-2.webp",
        "alt": "VW Golf 1.4 БЕНЗИН"
      },
      {
        "url": "/assets/priselci/vehicle-01-3.webp",
        "alt": "VW Golf 1.4 БЕНЗИН"
      },
      {
        "url": "/assets/priselci/vehicle-01-4.webp",
        "alt": "VW Golf 1.4 БЕНЗИН"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
      },
      {
        "bg": "Ел. Огледала",
        "en": "Ел. Огледала"
      }
    ],
    "spec": {
      "make": "VW",
      "model": "Golf 1.4 БЕНЗИН",
      "year": 2007,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 235193,
      "mileageUnit": "km",
      "enginePowerHp": 140,
      "colorExterior": "Графит"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1010",
    "slug": "vw-passat-1-4-2010-11758270885113337",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "VW Passat 1.4 БЕНЗИН",
    "description": "VW Passat 1.4 БЕНЗИН, 2010 г., 179 848 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 4299,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-02-1.webp",
        "alt": "VW Passat 1.4 БЕНЗИН"
      },
      {
        "url": "/assets/priselci/vehicle-02-2.webp",
        "alt": "VW Passat 1.4 БЕНЗИН"
      },
      {
        "url": "/assets/priselci/vehicle-02-3.webp",
        "alt": "VW Passat 1.4 БЕНЗИН"
      },
      {
        "url": "/assets/priselci/vehicle-02-4.webp",
        "alt": "VW Passat 1.4 БЕНЗИН"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
      },
      {
        "bg": "Ел. Огледала",
        "en": "Ел. Огледала"
      }
    ],
    "spec": {
      "make": "VW",
      "model": "Passat 1.4 БЕНЗИН",
      "year": 2010,
      "bodyType": "wagon",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 179848,
      "mileageUnit": "km",
      "enginePowerHp": 122,
      "colorExterior": "Графит"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1011",
    "slug": "vw-passat-2-0tdi-commonrail-2008-11753962633467246",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "VW Passat 2.0TDI COMMONRAIL",
    "description": "VW Passat 2.0TDI COMMONRAIL, 2008 г., 210 534 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 3900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-03-1.webp",
        "alt": "VW Passat 2.0TDI COMMONRAIL"
      },
      {
        "url": "/assets/priselci/vehicle-03-2.webp",
        "alt": "VW Passat 2.0TDI COMMONRAIL"
      },
      {
        "url": "/assets/priselci/vehicle-03-3.webp",
        "alt": "VW Passat 2.0TDI COMMONRAIL"
      },
      {
        "url": "/assets/priselci/vehicle-03-4.webp",
        "alt": "VW Passat 2.0TDI COMMONRAIL"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
      },
      {
        "bg": "Датчик за светлина",
        "en": "Датчик за светлина"
      }
    ],
    "spec": {
      "make": "VW",
      "model": "Passat 2.0TDI COMMONRAIL",
      "year": 2008,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 210534,
      "mileageUnit": "km",
      "enginePowerHp": 140,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1012",
    "slug": "seat-ibiza-1-2-2010-11784527857493559",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "Seat Ibiza 1.2 БЕНЗИН",
    "description": "Seat Ibiza 1.2 БЕНЗИН, 2010 г., 175 532 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 3499,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-04-1.webp",
        "alt": "Seat Ibiza 1.2 БЕНЗИН"
      },
      {
        "url": "/assets/priselci/vehicle-04-2.webp",
        "alt": "Seat Ibiza 1.2 БЕНЗИН"
      },
      {
        "url": "/assets/priselci/vehicle-04-3.webp",
        "alt": "Seat Ibiza 1.2 БЕНЗИН"
      },
      {
        "url": "/assets/priselci/vehicle-04-4.webp",
        "alt": "Seat Ibiza 1.2 БЕНЗИН"
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
    "spec": {
      "make": "Seat",
      "model": "Ibiza 1.2 БЕНЗИН",
      "year": 2010,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 175532,
      "mileageUnit": "km",
      "enginePowerHp": 70,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1013",
    "slug": "renault-koleos-2-0-4-4-2010-21754395406651747",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "Renault Koleos 2.0 ДИЗЕЛ 4Х4",
    "description": "Renault Koleos 2.0 ДИЗЕЛ 4Х4, 2010 г., 181 246 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 44299,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-05-1.webp",
        "alt": "Renault Koleos 2.0 ДИЗЕЛ 4Х4"
      },
      {
        "url": "/assets/priselci/vehicle-05-2.webp",
        "alt": "Renault Koleos 2.0 ДИЗЕЛ 4Х4"
      },
      {
        "url": "/assets/priselci/vehicle-05-3.webp",
        "alt": "Renault Koleos 2.0 ДИЗЕЛ 4Х4"
      },
      {
        "url": "/assets/priselci/vehicle-05-4.webp",
        "alt": "Renault Koleos 2.0 ДИЗЕЛ 4Х4"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "4x4",
        "en": "4x4"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Блокаж на диференциала",
        "en": "Блокаж на диференциала"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      }
    ],
    "spec": {
      "make": "Renault",
      "model": "Koleos 2.0 ДИЗЕЛ 4Х4",
      "year": 2010,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 181246,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1014",
    "slug": "peugeot-307-cc-2006-11781856640282742",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "Peugeot 307 CC КАБРИО",
    "description": "Peugeot 307 CC КАБРИО, 2006 г., 205 664 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 2899,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-06-1.webp",
        "alt": "Peugeot 307 CC КАБРИО"
      },
      {
        "url": "/assets/priselci/vehicle-06-2.webp",
        "alt": "Peugeot 307 CC КАБРИО"
      },
      {
        "url": "/assets/priselci/vehicle-06-3.webp",
        "alt": "Peugeot 307 CC КАБРИО"
      },
      {
        "url": "/assets/priselci/vehicle-06-4.webp",
        "alt": "Peugeot 307 CC КАБРИО"
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
    "features": [
      {
        "bg": "2(3) Врати",
        "en": "2(3) Врати"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
      },
      {
        "bg": "Датчик за светлина",
        "en": "Датчик за светлина"
      }
    ],
    "spec": {
      "make": "Peugeot",
      "model": "307 CC КАБРИО",
      "year": 2006,
      "bodyType": "convertible",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 205664,
      "mileageUnit": "km",
      "enginePowerHp": 109,
      "colorExterior": "Червен"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1002",
    "slug": "ford-mondeo-2-0-dizel-2009-11759747090481666",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "Ford Mondeo 2.0 DIZEL",
    "description": "Ford Mondeo 2.0 DIZEL, 2009 г., 235 788 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 3299,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-07-1.webp",
        "alt": "Ford Mondeo 2.0 DIZEL"
      },
      {
        "url": "/assets/priselci/vehicle-07-2.webp",
        "alt": "Ford Mondeo 2.0 DIZEL"
      },
      {
        "url": "/assets/priselci/vehicle-07-3.webp",
        "alt": "Ford Mondeo 2.0 DIZEL"
      },
      {
        "url": "/assets/priselci/vehicle-07-4.webp",
        "alt": "Ford Mondeo 2.0 DIZEL"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "USB",
        "en": "USB"
      },
      {
        "bg": "audio\\video",
        "en": "audio\\video"
      },
      {
        "bg": "IN\\AUX изводи",
        "en": "IN\\AUX изводи"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      }
    ],
    "spec": {
      "make": "Ford",
      "model": "Mondeo 2.0 DIZEL",
      "year": 2009,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 235788,
      "mileageUnit": "km",
      "enginePowerHp": 140,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1003",
    "slug": "peugeot-5008-2-0hdi-150-2011-11776863022154449",
    "category": "van",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "Peugeot 5008 2.0HDI 150К.С",
    "description": "Peugeot 5008 2.0HDI 150К.С, 2011 г., 210 452 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 5099,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-08-1.webp",
        "alt": "Peugeot 5008 2.0HDI 150К.С"
      },
      {
        "url": "/assets/priselci/vehicle-08-2.webp",
        "alt": "Peugeot 5008 2.0HDI 150К.С"
      },
      {
        "url": "/assets/priselci/vehicle-08-3.webp",
        "alt": "Peugeot 5008 2.0HDI 150К.С"
      },
      {
        "url": "/assets/priselci/vehicle-08-4.webp",
        "alt": "Peugeot 5008 2.0HDI 150К.С"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "USB",
        "en": "USB"
      },
      {
        "bg": "audio\\video",
        "en": "audio\\video"
      },
      {
        "bg": "IN\\AUX изводи",
        "en": "IN\\AUX изводи"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      }
    ],
    "spec": {
      "make": "Peugeot",
      "model": "5008 2.0HDI 150К.С",
      "year": 2011,
      "bodyType": "van",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 210452,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1004",
    "slug": "mercedes-benz-c-200-2-2-cdi-2004-11751891575433302",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "Mercedes-Benz C 200 2.2 CDI",
    "description": "Mercedes-Benz C 200 2.2 CDI, 2004 г., 218 432 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 2799,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-09-1.webp",
        "alt": "Mercedes-Benz C 200 2.2 CDI"
      },
      {
        "url": "/assets/priselci/vehicle-09-2.webp",
        "alt": "Mercedes-Benz C 200 2.2 CDI"
      },
      {
        "url": "/assets/priselci/vehicle-09-3.webp",
        "alt": "Mercedes-Benz C 200 2.2 CDI"
      },
      {
        "url": "/assets/priselci/vehicle-09-4.webp",
        "alt": "Mercedes-Benz C 200 2.2 CDI"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
      },
      {
        "bg": "Датчик за светлина",
        "en": "Датчик за светлина"
      }
    ],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "C 200 2.2 CDI",
      "year": 2004,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 218432,
      "mileageUnit": "km",
      "enginePowerHp": 122,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1005",
    "slug": "citroen-c3-picasso-1-6hdi-90-2010-11787126157294169",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "Citroen C3 Picasso 1.6HDI 90К.С",
    "description": "Citroen C3 Picasso 1.6HDI 90К.С, 2010 г., 185 783 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 3499,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-10-1.webp",
        "alt": "Citroen C3 Picasso 1.6HDI 90К.С"
      },
      {
        "url": "/assets/priselci/vehicle-10-2.webp",
        "alt": "Citroen C3 Picasso 1.6HDI 90К.С"
      },
      {
        "url": "/assets/priselci/vehicle-10-3.webp",
        "alt": "Citroen C3 Picasso 1.6HDI 90К.С"
      },
      {
        "url": "/assets/priselci/vehicle-10-4.webp",
        "alt": "Citroen C3 Picasso 1.6HDI 90К.С"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
      },
      {
        "bg": "Датчик за светлина",
        "en": "Датчик за светлина"
      }
    ],
    "spec": {
      "make": "Citroen",
      "model": "C3 Picasso 1.6HDI 90К.С",
      "year": 2010,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 185783,
      "mileageUnit": "km",
      "enginePowerHp": 90,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1006",
    "slug": "audi-a3-1-9-tdi-105ps-2009-11784638939574277",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "Audi A3 1.9 TDI 105ps",
    "description": "Audi A3 1.9 TDI 105ps, 2009 г., 253 746 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 4699,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-11-1.webp",
        "alt": "Audi A3 1.9 TDI 105ps"
      },
      {
        "url": "/assets/priselci/vehicle-11-2.webp",
        "alt": "Audi A3 1.9 TDI 105ps"
      },
      {
        "url": "/assets/priselci/vehicle-11-3.webp",
        "alt": "Audi A3 1.9 TDI 105ps"
      },
      {
        "url": "/assets/priselci/vehicle-11-4.webp",
        "alt": "Audi A3 1.9 TDI 105ps"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
      },
      {
        "bg": "Датчик за светлина",
        "en": "Датчик за светлина"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "A3 1.9 TDI 105ps",
      "year": 2009,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 253746,
      "mileageUnit": "km",
      "enginePowerHp": 105,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1007",
    "slug": "dacia-sandero-1-4-2009-11779190417819998",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ",
    "description": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ, 2009 г., 136 016 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 2500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-12-1.webp",
        "alt": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ"
      },
      {
        "url": "/assets/priselci/vehicle-12-2.webp",
        "alt": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ"
      },
      {
        "url": "/assets/priselci/vehicle-12-3.webp",
        "alt": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ"
      },
      {
        "url": "/assets/priselci/vehicle-12-4.webp",
        "alt": "Dacia Sandero 1.4 БЕНЗИН/ГАЗ"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
      },
      {
        "bg": "Газова уредба",
        "en": "Газова уредба"
      }
    ],
    "spec": {
      "make": "Dacia",
      "model": "Sandero 1.4 БЕНЗИН/ГАЗ",
      "year": 2009,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 136016,
      "mileageUnit": "km",
      "enginePowerHp": 75,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1008",
    "slug": "renault-grand-scenic-1-5dci-2012-11770812815337634",
    "category": "van",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "Renault Grand scenic 1.5DCI",
    "description": "Renault Grand scenic 1.5DCI, 2012 г., 199 811 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 4299,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-13-1.webp",
        "alt": "Renault Grand scenic 1.5DCI"
      },
      {
        "url": "/assets/priselci/vehicle-13-2.webp",
        "alt": "Renault Grand scenic 1.5DCI"
      },
      {
        "url": "/assets/priselci/vehicle-13-3.webp",
        "alt": "Renault Grand scenic 1.5DCI"
      },
      {
        "url": "/assets/priselci/vehicle-13-4.webp",
        "alt": "Renault Grand scenic 1.5DCI"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
      }
    ],
    "spec": {
      "make": "Renault",
      "model": "Grand scenic 1.5DCI",
      "year": 2012,
      "bodyType": "van",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 199811,
      "mileageUnit": "km",
      "enginePowerHp": 110,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1009",
    "slug": "bmw-x3-2-0-4-4-2007-21786691566300206",
    "category": "car",
    "dealerOrgId": "dealer-priselci",
    "status": "active",
    "title": "BMW X3 2.0 ДИЗЕЛ 4Х4",
    "description": "BMW X3 2.0 ДИЗЕЛ 4Х4, 2007 г., 207 195 км. Подбрана обява от 07.09.2026. Потвърдете наличността, оборудването и условията с Автокъща Приселци.",
    "price": {
      "amount": 44399,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/priselci/vehicle-14-1.webp",
        "alt": "BMW X3 2.0 ДИЗЕЛ 4Х4"
      },
      {
        "url": "/assets/priselci/vehicle-14-2.webp",
        "alt": "BMW X3 2.0 ДИЗЕЛ 4Х4"
      },
      {
        "url": "/assets/priselci/vehicle-14-3.webp",
        "alt": "BMW X3 2.0 ДИЗЕЛ 4Х4"
      },
      {
        "url": "/assets/priselci/vehicle-14-4.webp",
        "alt": "BMW X3 2.0 ДИЗЕЛ 4Х4"
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
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Въздушни възглавници - Задни",
        "en": "Въздушни възглавници - Задни"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
      },
      {
        "bg": "Ел. Огледала",
        "en": "Ел. Огледала"
      }
    ],
    "spec": {
      "make": "BMW",
      "model": "X3 2.0 ДИЗЕЛ 4Х4",
      "year": 2007,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 207195,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-priselci",
      "type": "dealer",
      "displayName": "Автокъща Приселци",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/assets/priselci/wordmark.svg"
    },
    "publishedAt": "2026-09-07T09:00:00.000Z",
    "promoted": false
  }
]

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
