import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "am-1001",
    "slug": "vw-golf-plus-2006-11755636345481695",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 2800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11755636345481695/1.webp",
        "alt": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг"
      },
      {
        "url": "/assets/vehicles/11755636345481695/2.webp",
        "alt": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг"
      },
      {
        "url": "/assets/vehicles/11755636345481695/3.webp",
        "alt": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг"
      },
      {
        "url": "/assets/vehicles/11755636345481695/4.webp",
        "alt": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "VW",
      "model": "Golf Plus",
      "year": 2006,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 180876,
      "mileageUnit": "km",
      "enginePowerHp": 105
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1010",
    "slug": "vw-caddy-2011-11774253415129356",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 5600,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11774253415129356/1.webp",
        "alt": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг"
      },
      {
        "url": "/assets/vehicles/11774253415129356/2.webp",
        "alt": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг"
      },
      {
        "url": "/assets/vehicles/11774253415129356/3.webp",
        "alt": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг"
      },
      {
        "url": "/assets/vehicles/11774253415129356/4.webp",
        "alt": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "VW",
      "model": "Caddy",
      "year": 2011,
      "bodyType": "other",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 260876,
      "mileageUnit": "km",
      "enginePowerHp": 100
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1011",
    "slug": "toyota-corolla-2022-11780920338607763",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 18500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11780920338607763/1.webp",
        "alt": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км"
      },
      {
        "url": "/assets/vehicles/11780920338607763/2.webp",
        "alt": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км"
      },
      {
        "url": "/assets/vehicles/11780920338607763/3.webp",
        "alt": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км"
      },
      {
        "url": "/assets/vehicles/11780920338607763/4.webp",
        "alt": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "Toyota",
      "model": "Corolla",
      "year": 2022,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 43000,
      "mileageUnit": "km",
      "enginePowerHp": 163
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1012",
    "slug": "toyota-avensis-verso-2003-11785227540991935",
    "category": "van",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 2500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11785227540991935/1.webp",
        "alt": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11785227540991935/2.webp",
        "alt": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11785227540991935/3.webp",
        "alt": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11785227540991935/4.webp",
        "alt": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "Toyota",
      "model": "Avensis verso",
      "year": 2003,
      "bodyType": "van",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 280765,
      "mileageUnit": "km",
      "enginePowerHp": 114
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1013",
    "slug": "smart-mc-2003-11763409304457756",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "Smart Mc Регистриран / Автомат / Климатик / Панорама",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 1200,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11763409304457756/1.webp",
        "alt": "Smart Mc Регистриран / Автомат / Климатик / Панорама"
      },
      {
        "url": "/assets/vehicles/11763409304457756/2.webp",
        "alt": "Smart Mc Регистриран / Автомат / Климатик / Панорама"
      },
      {
        "url": "/assets/vehicles/11763409304457756/3.webp",
        "alt": "Smart Mc Регистриран / Автомат / Климатик / Панорама"
      },
      {
        "url": "/assets/vehicles/11763409304457756/4.webp",
        "alt": "Smart Mc Регистриран / Автомат / Климатик / Панорама"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "Smart",
      "model": "Mc",
      "year": 2003,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 150098,
      "mileageUnit": "km",
      "enginePowerHp": 60
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1014",
    "slug": "peugeot-208-2016-11784058872993223",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "Peugeot 208 125 хил км. / Лизинг / Бартер",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 5000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11784058872993223/1.webp",
        "alt": "Peugeot 208 125 хил км. / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11784058872993223/2.webp",
        "alt": "Peugeot 208 125 хил км. / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11784058872993223/3.webp",
        "alt": "Peugeot 208 125 хил км. / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11784058872993223/4.webp",
        "alt": "Peugeot 208 125 хил км. / Лизинг / Бартер"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "Peugeot",
      "model": "208",
      "year": 2016,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 125654,
      "mileageUnit": "km",
      "enginePowerHp": 67
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1002",
    "slug": "vw-golf-2005-11790879613801923",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "VW Golf Бартер / Лизинг / Навигация",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 2300,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11790879613801923/1.webp",
        "alt": "VW Golf Бартер / Лизинг / Навигация"
      },
      {
        "url": "/assets/vehicles/11790879613801923/2.webp",
        "alt": "VW Golf Бартер / Лизинг / Навигация"
      },
      {
        "url": "/assets/vehicles/11790879613801923/3.webp",
        "alt": "VW Golf Бартер / Лизинг / Навигация"
      },
      {
        "url": "/assets/vehicles/11790879613801923/4.webp",
        "alt": "VW Golf Бартер / Лизинг / Навигация"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "VW",
      "model": "Golf",
      "year": 2005,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 220765,
      "mileageUnit": "km",
      "enginePowerHp": 75
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1003",
    "slug": "vw-touran-2012-11787907499756917",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "VW Touran Регистриран / Обслужен / Бартер / Лизинг",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 7000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11787907499756917/1.webp",
        "alt": "VW Touran Регистриран / Обслужен / Бартер / Лизинг"
      },
      {
        "url": "/assets/vehicles/11787907499756917/2.webp",
        "alt": "VW Touran Регистриран / Обслужен / Бартер / Лизинг"
      },
      {
        "url": "/assets/vehicles/11787907499756917/3.webp",
        "alt": "VW Touran Регистриран / Обслужен / Бартер / Лизинг"
      },
      {
        "url": "/assets/vehicles/11787907499756917/4.webp",
        "alt": "VW Touran Регистриран / Обслужен / Бартер / Лизинг"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "VW",
      "model": "Touran",
      "year": 2012,
      "bodyType": "other",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 171234,
      "mileageUnit": "km",
      "enginePowerHp": 138
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1004",
    "slug": "vw-golf-plus-2006-11755636345481695",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 2800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11755636345481695/1.webp",
        "alt": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг"
      },
      {
        "url": "/assets/vehicles/11755636345481695/2.webp",
        "alt": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг"
      },
      {
        "url": "/assets/vehicles/11755636345481695/3.webp",
        "alt": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг"
      },
      {
        "url": "/assets/vehicles/11755636345481695/4.webp",
        "alt": "VW Golf Plus 1.9 ТДИ 105кс / Бартер / Лизинг"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "VW",
      "model": "Golf Plus",
      "year": 2006,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 180876,
      "mileageUnit": "km",
      "enginePowerHp": 105
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1005",
    "slug": "vw-caddy-2011-11774253415129356",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 5600,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11774253415129356/1.webp",
        "alt": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг"
      },
      {
        "url": "/assets/vehicles/11774253415129356/2.webp",
        "alt": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг"
      },
      {
        "url": "/assets/vehicles/11774253415129356/3.webp",
        "alt": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг"
      },
      {
        "url": "/assets/vehicles/11774253415129356/4.webp",
        "alt": "VW Caddy 1.6 дизел / Регистриран / Обслужен / Лизинг"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "VW",
      "model": "Caddy",
      "year": 2011,
      "bodyType": "other",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 260876,
      "mileageUnit": "km",
      "enginePowerHp": 100
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1006",
    "slug": "toyota-corolla-2022-11780920338607763",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 18500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11780920338607763/1.webp",
        "alt": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км"
      },
      {
        "url": "/assets/vehicles/11780920338607763/2.webp",
        "alt": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км"
      },
      {
        "url": "/assets/vehicles/11780920338607763/3.webp",
        "alt": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км"
      },
      {
        "url": "/assets/vehicles/11780920338607763/4.webp",
        "alt": "Toyota Corolla Бартер / Лизинг / Без забележки!!! 43.000км"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "Toyota",
      "model": "Corolla",
      "year": 2022,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 43000,
      "mileageUnit": "km",
      "enginePowerHp": 163
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1007",
    "slug": "toyota-avensis-verso-2003-11785227540991935",
    "category": "van",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 2500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11785227540991935/1.webp",
        "alt": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11785227540991935/2.webp",
        "alt": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11785227540991935/3.webp",
        "alt": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11785227540991935/4.webp",
        "alt": "Toyota Avensis verso Регистриран / Обслужен / Лизинг / Бартер"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "Toyota",
      "model": "Avensis verso",
      "year": 2003,
      "bodyType": "van",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 280765,
      "mileageUnit": "km",
      "enginePowerHp": 114
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1008",
    "slug": "smart-mc-2003-11763409304457756",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "Smart Mc Регистриран / Автомат / Климатик / Панорама",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 1200,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11763409304457756/1.webp",
        "alt": "Smart Mc Регистриран / Автомат / Климатик / Панорама"
      },
      {
        "url": "/assets/vehicles/11763409304457756/2.webp",
        "alt": "Smart Mc Регистриран / Автомат / Климатик / Панорама"
      },
      {
        "url": "/assets/vehicles/11763409304457756/3.webp",
        "alt": "Smart Mc Регистриран / Автомат / Климатик / Панорама"
      },
      {
        "url": "/assets/vehicles/11763409304457756/4.webp",
        "alt": "Smart Mc Регистриран / Автомат / Климатик / Панорама"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "Smart",
      "model": "Mc",
      "year": 2003,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 150098,
      "mileageUnit": "km",
      "enginePowerHp": 60
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1009",
    "slug": "peugeot-208-2016-11784058872993223",
    "category": "car",
    "dealerOrgId": "dealer-dynamic-auto-varna",
    "status": "active",
    "title": "Peugeot 208 125 хил км. / Лизинг / Бартер",
    "description": "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата.",
    "price": {
      "amount": 5000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/vehicles/11784058872993223/1.webp",
        "alt": "Peugeot 208 125 хил км. / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11784058872993223/2.webp",
        "alt": "Peugeot 208 125 хил км. / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11784058872993223/3.webp",
        "alt": "Peugeot 208 125 хил км. / Лизинг / Бартер"
      },
      {
        "url": "/assets/vehicles/11784058872993223/4.webp",
        "alt": "Peugeot 208 125 хил км. / Лизинг / Бартер"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Варна",
      "country": "BG"
    },
    "spec": {
      "make": "Peugeot",
      "model": "208",
      "year": 2016,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 125654,
      "mileageUnit": "km",
      "enginePowerHp": 67
    },
    "seller": {
      "id": "dealer-dynamic-auto-varna",
      "type": "dealer",
      "displayName": "Dynamic Auto Varna",
      "verificationStatus": "unverified",
      "city": "Варна",
      "logoUrl": "/dealer-brand/logo-on-light.webp"
    },
    "publishedAt": "2026-10-10T09:00:00.000Z",
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
    filters.powerMin === undefined ||
    (listing.spec.enginePowerHp !== undefined &&
      listing.spec.enginePowerHp >= filters.powerMin),
  (listing) =>
    !filters.extra ||
    Boolean(listing.features?.some((feature) => feature.en === filters.extra)),
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
