import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "11760378435449508",
    "slug": "bmw-740d-xdrive-449508",
    "category": "car",
    "dealerOrgId": "dealer-icars-plovdiv",
    "status": "active",
    "title": "BMW 740d xDrive",
    "description": "BMW 740d xDrive, 2023 г., 85 000 км. Цената е без ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://icars.mobile.bg/obiava-11760378435449508-bmw-740-d-xdrive-garantsiya-04-2028",
    "price": {
      "amount": 71999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11760378435449508-1.webp",
        "alt": "BMW 740d xDrive — снимка 1"
      },
      {
        "url": "/dealer/stock/11760378435449508-2.webp",
        "alt": "BMW 740d xDrive — снимка 2"
      },
      {
        "url": "/dealer/stock/11760378435449508-3.webp",
        "alt": "BMW 740d xDrive — снимка 3"
      },
      {
        "url": "/dealer/stock/11760378435449508-4.webp",
        "alt": "BMW 740d xDrive — снимка 4"
      },
      {
        "url": "/dealer/stock/11760378435449508-5.webp",
        "alt": "BMW 740d xDrive — снимка 5"
      },
      {
        "url": "/dealer/stock/11760378435449508-6.webp",
        "alt": "BMW 740d xDrive — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "740d xDrive",
      "year": 2023,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 85000,
      "mileageUnit": "km",
      "enginePowerHp": 300,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-icars-plovdiv",
      "type": "dealer",
      "displayName": "icars",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:38:01.402Z",
    "promoted": false,
    "priceTaxLabel": "Цената е без ДДС"
  },
  {
    "id": "21769205380054749",
    "slug": "bmw-x6-m-package-054749",
    "category": "car",
    "dealerOrgId": "dealer-icars-plovdiv",
    "status": "active",
    "title": "BMW X6 M Package",
    "description": "BMW X6 M Package, 2017 г., 230 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://icars.mobile.bg/obiava-21769205380054749-bmw-x6-m-package",
    "price": {
      "amount": 22500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21769205380054749-1.webp",
        "alt": "BMW X6 M Package — снимка 1"
      },
      {
        "url": "/dealer/stock/21769205380054749-2.webp",
        "alt": "BMW X6 M Package — снимка 2"
      },
      {
        "url": "/dealer/stock/21769205380054749-3.webp",
        "alt": "BMW X6 M Package — снимка 3"
      },
      {
        "url": "/dealer/stock/21769205380054749-4.webp",
        "alt": "BMW X6 M Package — снимка 4"
      },
      {
        "url": "/dealer/stock/21769205380054749-5.webp",
        "alt": "BMW X6 M Package — снимка 5"
      },
      {
        "url": "/dealer/stock/21769205380054749-6.webp",
        "alt": "BMW X6 M Package — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "X6 M Package",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 230000,
      "mileageUnit": "km",
      "enginePowerHp": 306,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-icars-plovdiv",
      "type": "dealer",
      "displayName": "icars",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:38:01.402Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "21782908599914903",
    "slug": "hyundai-tucson-ix35-914903",
    "category": "car",
    "dealerOrgId": "dealer-icars-plovdiv",
    "status": "active",
    "title": "Hyundai Tucson ix35",
    "description": "Hyundai Tucson ix35, 2025 г., 8000 км. Цената е без ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://icars.mobile.bg/obiava-21782908599914903-hyundai-tucson-ix35",
    "price": {
      "amount": 34999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21782908599914903-1.webp",
        "alt": "Hyundai Tucson ix35 — снимка 1"
      },
      {
        "url": "/dealer/stock/21782908599914903-2.webp",
        "alt": "Hyundai Tucson ix35 — снимка 2"
      },
      {
        "url": "/dealer/stock/21782908599914903-3.webp",
        "alt": "Hyundai Tucson ix35 — снимка 3"
      },
      {
        "url": "/dealer/stock/21782908599914903-4.webp",
        "alt": "Hyundai Tucson ix35 — снимка 4"
      },
      {
        "url": "/dealer/stock/21782908599914903-5.webp",
        "alt": "Hyundai Tucson ix35 — снимка 5"
      },
      {
        "url": "/dealer/stock/21782908599914903-6.webp",
        "alt": "Hyundai Tucson ix35 — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Hyundai",
      "model": "Tucson ix35",
      "year": 2025,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 8000,
      "mileageUnit": "km",
      "enginePowerHp": 180,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-icars-plovdiv",
      "type": "dealer",
      "displayName": "icars",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:38:01.403Z",
    "promoted": false,
    "priceTaxLabel": "Цената е без ДДС"
  },
  {
    "id": "11782907735294061",
    "slug": "opel-corsa-e-294061",
    "category": "car",
    "dealerOrgId": "dealer-icars-plovdiv",
    "status": "active",
    "title": "Opel Corsa E",
    "description": "Opel Corsa E, 2018 г., 36 644 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://icars.mobile.bg/obiava-11782907735294061-opel-corsa-e",
    "price": {
      "amount": 8999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11782907735294061-1.webp",
        "alt": "Opel Corsa E — снимка 1"
      },
      {
        "url": "/dealer/stock/11782907735294061-2.webp",
        "alt": "Opel Corsa E — снимка 2"
      },
      {
        "url": "/dealer/stock/11782907735294061-3.webp",
        "alt": "Opel Corsa E — снимка 3"
      },
      {
        "url": "/dealer/stock/11782907735294061-4.webp",
        "alt": "Opel Corsa E — снимка 4"
      },
      {
        "url": "/dealer/stock/11782907735294061-5.webp",
        "alt": "Opel Corsa E — снимка 5"
      },
      {
        "url": "/dealer/stock/11782907735294061-6.webp",
        "alt": "Opel Corsa E — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Opel",
      "model": "Corsa E",
      "year": 2018,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 36644,
      "mileageUnit": "km",
      "enginePowerHp": 111,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-icars-plovdiv",
      "type": "dealer",
      "displayName": "icars",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:38:01.403Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11752078175497458",
    "slug": "audi-rs6-avant-performance-497458",
    "category": "car",
    "dealerOrgId": "dealer-icars-plovdiv",
    "status": "active",
    "title": "Audi RS6 Avant Performance",
    "description": "Audi RS6 Avant Performance, 2025 г., 20 000 км. Цената е без ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://icars.mobile.bg/obiava-11752078175497458-audi-rs6-avant-performance",
    "price": {
      "amount": 123000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11752078175497458-1.webp",
        "alt": "Audi RS6 Avant Performance — снимка 1"
      },
      {
        "url": "/dealer/stock/11752078175497458-2.webp",
        "alt": "Audi RS6 Avant Performance — снимка 2"
      },
      {
        "url": "/dealer/stock/11752078175497458-3.webp",
        "alt": "Audi RS6 Avant Performance — снимка 3"
      },
      {
        "url": "/dealer/stock/11752078175497458-4.webp",
        "alt": "Audi RS6 Avant Performance — снимка 4"
      },
      {
        "url": "/dealer/stock/11752078175497458-5.webp",
        "alt": "Audi RS6 Avant Performance — снимка 5"
      },
      {
        "url": "/dealer/stock/11752078175497458-6.webp",
        "alt": "Audi RS6 Avant Performance — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "RS6 Avant Performance",
      "year": 2025,
      "bodyType": "wagon",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 20000,
      "mileageUnit": "km",
      "enginePowerHp": 630,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-icars-plovdiv",
      "type": "dealer",
      "displayName": "icars",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:38:01.403Z",
    "promoted": false,
    "priceTaxLabel": "Цената е без ДДС"
  },
  {
    "id": "11780753459695554",
    "slug": "mercedes-benz-cls-400-695554",
    "category": "car",
    "dealerOrgId": "dealer-icars-plovdiv",
    "status": "active",
    "title": "Mercedes-Benz CLS 400",
    "description": "Mercedes-Benz CLS 400, 2018 г., 145 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://icars.mobile.bg/obiava-11780753459695554-mercedes-benz-cls-400",
    "price": {
      "amount": 30999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11780753459695554-1.webp",
        "alt": "Mercedes-Benz CLS 400 — снимка 1"
      },
      {
        "url": "/dealer/stock/11780753459695554-2.webp",
        "alt": "Mercedes-Benz CLS 400 — снимка 2"
      },
      {
        "url": "/dealer/stock/11780753459695554-3.webp",
        "alt": "Mercedes-Benz CLS 400 — снимка 3"
      },
      {
        "url": "/dealer/stock/11780753459695554-4.webp",
        "alt": "Mercedes-Benz CLS 400 — снимка 4"
      },
      {
        "url": "/dealer/stock/11780753459695554-5.webp",
        "alt": "Mercedes-Benz CLS 400 — снимка 5"
      },
      {
        "url": "/dealer/stock/11780753459695554-6.webp",
        "alt": "Mercedes-Benz CLS 400 — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "CLS 400",
      "year": 2018,
      "bodyType": "coupe",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 145000,
      "mileageUnit": "km",
      "enginePowerHp": 340,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-icars-plovdiv",
      "type": "dealer",
      "displayName": "icars",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:38:01.404Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "21751722135031902",
    "slug": "porsche-cayenne-turbo-4-0-v8-031902",
    "category": "car",
    "dealerOrgId": "dealer-icars-plovdiv",
    "status": "active",
    "title": "Porsche Cayenne Turbo 4.0 V8",
    "description": "Porsche Cayenne Turbo 4.0 V8, 2018 г., 192 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://icars.mobile.bg/obiava-21751722135031902-porsche-cayenne-turbo-4-0-v8-550-ks",
    "price": {
      "amount": 49500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21751722135031902-1.webp",
        "alt": "Porsche Cayenne Turbo 4.0 V8 — снимка 1"
      },
      {
        "url": "/dealer/stock/21751722135031902-2.webp",
        "alt": "Porsche Cayenne Turbo 4.0 V8 — снимка 2"
      },
      {
        "url": "/dealer/stock/21751722135031902-3.webp",
        "alt": "Porsche Cayenne Turbo 4.0 V8 — снимка 3"
      },
      {
        "url": "/dealer/stock/21751722135031902-4.webp",
        "alt": "Porsche Cayenne Turbo 4.0 V8 — снимка 4"
      },
      {
        "url": "/dealer/stock/21751722135031902-5.webp",
        "alt": "Porsche Cayenne Turbo 4.0 V8 — снимка 5"
      },
      {
        "url": "/dealer/stock/21751722135031902-6.webp",
        "alt": "Porsche Cayenne Turbo 4.0 V8 — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Porsche",
      "model": "Cayenne Turbo 4.0 V8",
      "year": 2018,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 192000,
      "mileageUnit": "km",
      "enginePowerHp": 550,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-icars-plovdiv",
      "type": "dealer",
      "displayName": "icars",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:38:01.404Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11695297184317225",
    "slug": "audi-a8-50-tdi-s-line-317225",
    "category": "car",
    "dealerOrgId": "dealer-icars-plovdiv",
    "status": "active",
    "title": "Audi A8 50 TDI S line",
    "description": "Audi A8 50 TDI S line, 2019 г., 235 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://icars.mobile.bg/obiava-11695297184317225-audi-a8-50-tdi-s-line-sportpacket-b-o-massage",
    "price": {
      "amount": 37999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11695297184317225-1.webp",
        "alt": "Audi A8 50 TDI S line — снимка 1"
      },
      {
        "url": "/dealer/stock/11695297184317225-2.webp",
        "alt": "Audi A8 50 TDI S line — снимка 2"
      },
      {
        "url": "/dealer/stock/11695297184317225-3.webp",
        "alt": "Audi A8 50 TDI S line — снимка 3"
      },
      {
        "url": "/dealer/stock/11695297184317225-4.webp",
        "alt": "Audi A8 50 TDI S line — снимка 4"
      },
      {
        "url": "/dealer/stock/11695297184317225-5.webp",
        "alt": "Audi A8 50 TDI S line — снимка 5"
      },
      {
        "url": "/dealer/stock/11695297184317225-6.webp",
        "alt": "Audi A8 50 TDI S line — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона — Север",
      "country": "България"
    },
    "features": [
      {
        "bg": "Адаптивни предни светлини",
        "en": "Адаптивни предни светлини"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
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
        "bg": "Ел. разпределяне на спирачното усилие",
        "en": "Ел. разпределяне на спирачното усилие"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за контрол на дистанцията",
        "en": "Система за контрол на дистанцията"
      },
      {
        "bg": "Система за контрол на спускането",
        "en": "Система за контрол на спускането"
      },
      {
        "bg": "4x4",
        "en": "4x4"
      },
      {
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "LED фарове",
        "en": "LED фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Каско",
        "en": "Каско"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      },
      {
        "bg": "Кожен салон",
        "en": "Кожен салон"
      },
      {
        "bg": "Auto Start Stop function",
        "en": "Auto Start Stop function"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "Steptronic, Tiptronic",
        "en": "Steptronic, Tiptronic"
      },
      {
        "bg": "USB, audio\\video, IN\\AUX изводи",
        "en": "USB, audio\\video, IN\\AUX изводи"
      },
      {
        "bg": "Адаптивно въздушно окачване",
        "en": "Адаптивно въздушно окачване"
      },
      {
        "bg": "Безключово палене",
        "en": "Безключово палене"
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
        "bg": "Датчик за светлина",
        "en": "Датчик за светлина"
      },
      {
        "bg": "Ел. Огледала",
        "en": "Ел. Огледала"
      },
      {
        "bg": "Ел. Стъкла",
        "en": "Ел. Стъкла"
      },
      {
        "bg": "Ел. регулиране на седалките",
        "en": "Ел. регулиране на седалките"
      },
      {
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Навигация",
        "en": "Навигация"
      },
      {
        "bg": "Подгряване на седалките",
        "en": "Подгряване на седалките"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Сензор за дъжд",
        "en": "Сензор за дъжд"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система за измиване на фаровете",
        "en": "Система за измиване на фаровете"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "A8 50 TDI S line",
      "year": 2019,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 235000,
      "mileageUnit": "km",
      "enginePowerHp": 286,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-icars-plovdiv",
      "type": "dealer",
      "displayName": "icars",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:38:01.405Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "21725449678653350",
    "slug": "bmw-x5-30d-xdrive-653350",
    "category": "car",
    "dealerOrgId": "dealer-icars-plovdiv",
    "status": "active",
    "title": "BMW X5 30d xDrive",
    "description": "BMW X5 30d xDrive, 2019 г., 192 000 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://icars.mobile.bg/obiava-21725449678653350-bmw-x5-30d-xdrive",
    "price": {
      "amount": 32500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21725449678653350-1.webp",
        "alt": "BMW X5 30d xDrive — снимка 1"
      },
      {
        "url": "/dealer/stock/21725449678653350-2.webp",
        "alt": "BMW X5 30d xDrive — снимка 2"
      },
      {
        "url": "/dealer/stock/21725449678653350-3.webp",
        "alt": "BMW X5 30d xDrive — снимка 3"
      },
      {
        "url": "/dealer/stock/21725449678653350-4.webp",
        "alt": "BMW X5 30d xDrive — снимка 4"
      },
      {
        "url": "/dealer/stock/21725449678653350-5.webp",
        "alt": "BMW X5 30d xDrive — снимка 5"
      },
      {
        "url": "/dealer/stock/21725449678653350-6.webp",
        "alt": "BMW X5 30d xDrive — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона — Север",
      "country": "България"
    },
    "features": [
      {
        "bg": "GPS система за проследяване",
        "en": "GPS система за проследяване"
      },
      {
        "bg": "Адаптивни предни светлини",
        "en": "Адаптивни предни светлини"
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
        "bg": "Ел. разпределяне на спирачното усилие",
        "en": "Ел. разпределяне на спирачното усилие"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за динамична устойчивост",
        "en": "Система за динамична устойчивост"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за контрол на дистанцията",
        "en": "Система за контрол на дистанцията"
      },
      {
        "bg": "Система за контрол на спускането",
        "en": "Система за контрол на спускането"
      },
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      },
      {
        "bg": "Кожен салон",
        "en": "Кожен салон"
      },
      {
        "bg": "Auto Start Stop function",
        "en": "Auto Start Stop function"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "Безключово палене",
        "en": "Безключово палене"
      },
      {
        "bg": "Ел. Огледала",
        "en": "Ел. Огледала"
      },
      {
        "bg": "Ел. Стъкла",
        "en": "Ел. Стъкла"
      },
      {
        "bg": "Ел. регулиране на седалките",
        "en": "Ел. регулиране на седалките"
      },
      {
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Навигация",
        "en": "Навигация"
      },
      {
        "bg": "Подгряване на предното стъкло",
        "en": "Подгряване на предното стъкло"
      },
      {
        "bg": "Подгряване на седалките",
        "en": "Подгряване на седалките"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Сензор за дъжд",
        "en": "Сензор за дъжд"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система за измиване на фаровете",
        "en": "Система за измиване на фаровете"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      }
    ],
    "spec": {
      "make": "BMW",
      "model": "X5 30d xDrive",
      "year": 2019,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 192000,
      "mileageUnit": "km",
      "enginePowerHp": 265,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-icars-plovdiv",
      "type": "dealer",
      "displayName": "icars",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:38:01.405Z",
    "promoted": false,
    "priceTaxLabel": "Цената е с включено ДДС"
  },
  {
    "id": "11711117396768513",
    "slug": "mercedes-benz-v-300-4matic-amg-line-long-768513",
    "category": "car",
    "dealerOrgId": "dealer-icars-plovdiv",
    "status": "active",
    "title": "Mercedes-Benz V 300 4Matic AMG Line Long",
    "description": "Mercedes-Benz V 300 4Matic AMG Line Long, 2020 г., 149 000 км. Цената е без ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://icars.mobile.bg/obiava-11711117396768513-mercedes-benz-v-300-4matic-amg-line-long",
    "price": {
      "amount": 50999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11711117396768513-1.webp",
        "alt": "Mercedes-Benz V 300 4Matic AMG Line Long — снимка 1"
      },
      {
        "url": "/dealer/stock/11711117396768513-2.webp",
        "alt": "Mercedes-Benz V 300 4Matic AMG Line Long — снимка 2"
      },
      {
        "url": "/dealer/stock/11711117396768513-3.webp",
        "alt": "Mercedes-Benz V 300 4Matic AMG Line Long — снимка 3"
      },
      {
        "url": "/dealer/stock/11711117396768513-4.webp",
        "alt": "Mercedes-Benz V 300 4Matic AMG Line Long — снимка 4"
      },
      {
        "url": "/dealer/stock/11711117396768513-5.webp",
        "alt": "Mercedes-Benz V 300 4Matic AMG Line Long — снимка 5"
      },
      {
        "url": "/dealer/stock/11711117396768513-6.webp",
        "alt": "Mercedes-Benz V 300 4Matic AMG Line Long — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона — Север",
      "country": "България"
    },
    "features": [
      {
        "bg": "Адаптивни предни светлини",
        "en": "Адаптивни предни светлини"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
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
        "bg": "Ел. разпределяне на спирачното усилие",
        "en": "Ел. разпределяне на спирачното усилие"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за динамична устойчивост",
        "en": "Система за динамична устойчивост"
      },
      {
        "bg": "Система за контрол на дистанцията",
        "en": "Система за контрол на дистанцията"
      },
      {
        "bg": "Система за контрол на спускането",
        "en": "Система за контрол на спускането"
      },
      {
        "bg": "4x4",
        "en": "4x4"
      },
      {
        "bg": "7 места",
        "en": "7 места"
      },
      {
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "LED фарове",
        "en": "LED фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Панорамен люк",
        "en": "Панорамен люк"
      },
      {
        "bg": "Каско",
        "en": "Каско"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      },
      {
        "bg": "Кожен салон",
        "en": "Кожен салон"
      },
      {
        "bg": "Auto Start Stop function",
        "en": "Auto Start Stop function"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "USB, audio\\video, IN\\AUX изводи",
        "en": "USB, audio\\video, IN\\AUX изводи"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Датчик за светлина",
        "en": "Датчик за светлина"
      },
      {
        "bg": "Ел. Огледала",
        "en": "Ел. Огледала"
      },
      {
        "bg": "Ел. Стъкла",
        "en": "Ел. Стъкла"
      },
      {
        "bg": "Ел. регулиране на седалките",
        "en": "Ел. регулиране на седалките"
      },
      {
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Навигация",
        "en": "Навигация"
      },
      {
        "bg": "Печка",
        "en": "Печка"
      },
      {
        "bg": "Подгряване на предното стъкло",
        "en": "Подгряване на предното стъкло"
      },
      {
        "bg": "Подгряване на седалките",
        "en": "Подгряване на седалките"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Сензор за дъжд",
        "en": "Сензор за дъжд"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система за измиване на фаровете",
        "en": "Система за измиване на фаровете"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      }
    ],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "V 300 4Matic AMG Line Long",
      "year": 2020,
      "bodyType": "van",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 149000,
      "mileageUnit": "km",
      "enginePowerHp": 239,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-icars-plovdiv",
      "type": "dealer",
      "displayName": "icars",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:38:01.406Z",
    "promoted": false,
    "priceTaxLabel": "Цената е без ДДС"
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

const legacyListingSlugAliases: Readonly<Record<string, string>> = {};

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

export const mockSavedListingIds = [] as string[];

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

export const mockSavedSearches: MockSavedSearch[] = [];

const sellerListingStatuses: Record<string, VehicleListing["status"]> = {};

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

export const mockDealerLeads: MockDealerLead[] = [];

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

export const mockModerationReports: MockModerationReport[] = [];

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

export const mockTrustReviews: MockTrustReview[] = [];

export interface MockAuditLogEntry {
  action: string;
  actor: string;
  createdAt: string;
  entityId: string;
  entityType: "listing" | "report" | "seller" | "dealer";
  id: string;
  note: string;
}

export const mockAuditLog: MockAuditLogEntry[] = [];

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

export const mockActivePromotions: MockActivePromotion[] = [];

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
