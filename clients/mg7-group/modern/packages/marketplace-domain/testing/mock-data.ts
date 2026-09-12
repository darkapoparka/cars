import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "21785564544332885",
    "slug": "bmw-x7-40d-xdrive-m-sport-332885",
    "category": "car",
    "dealerOrgId": "dealer-mg7-group",
    "status": "active",
    "title": "BMW X7 40d xDrive M Sport",
    "description": "BMW X7 40d xDrive M Sport, 2023 г., 45 000 км. Цената е без ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://mg7group.mobile.bg/obiava-21785564544332885-bmw-x7-40d-xdrive-m-sport-facelift-carbon-1-vi-sobstvenik",
    "price": {
      "amount": 61900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21785564544332885-1.webp",
        "alt": "BMW X7 40d xDrive M Sport — снимка 1"
      },
      {
        "url": "/dealer/stock/21785564544332885-2.webp",
        "alt": "BMW X7 40d xDrive M Sport — снимка 2"
      },
      {
        "url": "/dealer/stock/21785564544332885-3.webp",
        "alt": "BMW X7 40d xDrive M Sport — снимка 3"
      },
      {
        "url": "/dealer/stock/21785564544332885-4.webp",
        "alt": "BMW X7 40d xDrive M Sport — снимка 4"
      },
      {
        "url": "/dealer/stock/21785564544332885-5.webp",
        "alt": "BMW X7 40d xDrive M Sport — снимка 5"
      },
      {
        "url": "/dealer/stock/21785564544332885-6.webp",
        "alt": "BMW X7 40d xDrive M Sport — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Промишлена зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "X7 40d xDrive M Sport",
      "year": 2023,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 45000,
      "mileageUnit": "km",
      "enginePowerHp": 352,
      "colorExterior": "Не е посочен"
    },
    "seller": {
      "id": "dealer-mg7-group",
      "type": "dealer",
      "displayName": "MG7 Group",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:00:38.748Z",
    "promoted": false,
    "priceTaxLabel": "Цената е без ДДС"
  },
  {
    "id": "21745605265440995",
    "slug": "mercedes-benz-g-63-amg-440995",
    "category": "car",
    "dealerOrgId": "dealer-mg7-group",
    "status": "active",
    "title": "Mercedes-Benz G 63 AMG",
    "description": "Mercedes-Benz G 63 AMG, 2025 г., 22 000 км. Цената е без ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://mg7group.mobile.bg/obiava-21745605265440995-mercedes-benz-g-63-amg-2025g-nov-ot-silvar-star",
    "price": {
      "amount": 181000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21745605265440995-1.webp",
        "alt": "Mercedes-Benz G 63 AMG — снимка 1"
      },
      {
        "url": "/dealer/stock/21745605265440995-2.webp",
        "alt": "Mercedes-Benz G 63 AMG — снимка 2"
      },
      {
        "url": "/dealer/stock/21745605265440995-3.webp",
        "alt": "Mercedes-Benz G 63 AMG — снимка 3"
      },
      {
        "url": "/dealer/stock/21745605265440995-4.webp",
        "alt": "Mercedes-Benz G 63 AMG — снимка 4"
      },
      {
        "url": "/dealer/stock/21745605265440995-5.webp",
        "alt": "Mercedes-Benz G 63 AMG — снимка 5"
      },
      {
        "url": "/dealer/stock/21745605265440995-6.webp",
        "alt": "Mercedes-Benz G 63 AMG — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Промишлена зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "G 63 AMG",
      "year": 2025,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 22000,
      "mileageUnit": "km",
      "enginePowerHp": 605,
      "colorExterior": "Не е посочен"
    },
    "seller": {
      "id": "dealer-mg7-group",
      "type": "dealer",
      "displayName": "MG7 Group",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:00:38.749Z",
    "promoted": false,
    "priceTaxLabel": "Цената е без ДДС"
  },
  {
    "id": "11786258864975456",
    "slug": "bmw-850-v8-gran-coupe-975456",
    "category": "car",
    "dealerOrgId": "dealer-mg7-group",
    "status": "active",
    "title": "BMW 850 V8 Gran Coupe",
    "description": "BMW 850 V8 Gran Coupe, 2022 г., 107 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://mg7group.mobile.bg/obiava-11786258864975456-bmw-850-v8-gran-coupe-1-vi-sobstvenik-v-garantsiya",
    "price": {
      "amount": 54555,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11786258864975456-1.webp",
        "alt": "BMW 850 V8 Gran Coupe — снимка 1"
      },
      {
        "url": "/dealer/stock/11786258864975456-2.webp",
        "alt": "BMW 850 V8 Gran Coupe — снимка 2"
      },
      {
        "url": "/dealer/stock/11786258864975456-3.webp",
        "alt": "BMW 850 V8 Gran Coupe — снимка 3"
      },
      {
        "url": "/dealer/stock/11786258864975456-4.webp",
        "alt": "BMW 850 V8 Gran Coupe — снимка 4"
      },
      {
        "url": "/dealer/stock/11786258864975456-5.webp",
        "alt": "BMW 850 V8 Gran Coupe — снимка 5"
      },
      {
        "url": "/dealer/stock/11786258864975456-6.webp",
        "alt": "BMW 850 V8 Gran Coupe — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Промишлена зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "850 V8 Gran Coupe",
      "year": 2022,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 107000,
      "mileageUnit": "km",
      "enginePowerHp": 531,
      "colorExterior": "Не е посочен"
    },
    "seller": {
      "id": "dealer-mg7-group",
      "type": "dealer",
      "displayName": "MG7 Group",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:00:38.749Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "21782394387362812",
    "slug": "bmw-x6-m-sport-362812",
    "category": "car",
    "dealerOrgId": "dealer-mg7-group",
    "status": "active",
    "title": "BMW X6 M Sport",
    "description": "BMW X6 M Sport, 2020 г., 141 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://mg7group.mobile.bg/obiava-21782394387362812-bmw-x6-m-sport-v-garantsiya-do-09-2027g",
    "price": {
      "amount": 45000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21782394387362812-1.webp",
        "alt": "BMW X6 M Sport — снимка 1"
      },
      {
        "url": "/dealer/stock/21782394387362812-2.webp",
        "alt": "BMW X6 M Sport — снимка 2"
      },
      {
        "url": "/dealer/stock/21782394387362812-3.webp",
        "alt": "BMW X6 M Sport — снимка 3"
      },
      {
        "url": "/dealer/stock/21782394387362812-4.webp",
        "alt": "BMW X6 M Sport — снимка 4"
      },
      {
        "url": "/dealer/stock/21782394387362812-5.webp",
        "alt": "BMW X6 M Sport — снимка 5"
      },
      {
        "url": "/dealer/stock/21782394387362812-6.webp",
        "alt": "BMW X6 M Sport — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Промишлена зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "X6 M Sport",
      "year": 2020,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 141000,
      "mileageUnit": "km",
      "enginePowerHp": 286,
      "colorExterior": "Не е посочен"
    },
    "seller": {
      "id": "dealer-mg7-group",
      "type": "dealer",
      "displayName": "MG7 Group",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:00:38.749Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11774522821457814",
    "slug": "mercedes-benz-e-53-amg-coupe-457814",
    "category": "car",
    "dealerOrgId": "dealer-mg7-group",
    "status": "active",
    "title": "Mercedes-Benz E 53 AMG Coupe",
    "description": "Mercedes-Benz E 53 AMG Coupe, 2019 г., 144 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://mg7group.mobile.bg/obiava-11774522821457814-mercedes-benz-e-53-amg-coupe-amg",
    "price": {
      "amount": 31000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11774522821457814-1.webp",
        "alt": "Mercedes-Benz E 53 AMG Coupe — снимка 1"
      },
      {
        "url": "/dealer/stock/11774522821457814-2.webp",
        "alt": "Mercedes-Benz E 53 AMG Coupe — снимка 2"
      },
      {
        "url": "/dealer/stock/11774522821457814-3.webp",
        "alt": "Mercedes-Benz E 53 AMG Coupe — снимка 3"
      },
      {
        "url": "/dealer/stock/11774522821457814-4.webp",
        "alt": "Mercedes-Benz E 53 AMG Coupe — снимка 4"
      },
      {
        "url": "/dealer/stock/11774522821457814-5.webp",
        "alt": "Mercedes-Benz E 53 AMG Coupe — снимка 5"
      },
      {
        "url": "/dealer/stock/11774522821457814-6.webp",
        "alt": "Mercedes-Benz E 53 AMG Coupe — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Промишлена зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "E 53 AMG Coupe",
      "year": 2019,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 144000,
      "mileageUnit": "km",
      "enginePowerHp": 435,
      "colorExterior": "Не е посочен"
    },
    "seller": {
      "id": "dealer-mg7-group",
      "type": "dealer",
      "displayName": "MG7 Group",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:00:38.749Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11784017637362453",
    "slug": "chevrolet-camaro-362453",
    "category": "car",
    "dealerOrgId": "dealer-mg7-group",
    "status": "active",
    "title": "Chevrolet Camaro",
    "description": "Chevrolet Camaro, 2000 г., 90 700 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://mg7group.mobile.bg/obiava-11784017637362453-chevrolet-camaro-palna-servizna-istoriya-90-700km",
    "price": {
      "amount": 5300,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11784017637362453-1.webp",
        "alt": "Chevrolet Camaro — снимка 1"
      },
      {
        "url": "/dealer/stock/11784017637362453-2.webp",
        "alt": "Chevrolet Camaro — снимка 2"
      },
      {
        "url": "/dealer/stock/11784017637362453-3.webp",
        "alt": "Chevrolet Camaro — снимка 3"
      },
      {
        "url": "/dealer/stock/11784017637362453-4.webp",
        "alt": "Chevrolet Camaro — снимка 4"
      },
      {
        "url": "/dealer/stock/11784017637362453-5.webp",
        "alt": "Chevrolet Camaro — снимка 5"
      },
      {
        "url": "/dealer/stock/11784017637362453-6.webp",
        "alt": "Chevrolet Camaro — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Промишлена зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Chevrolet",
      "model": "Camaro",
      "year": 2000,
      "bodyType": "convertible",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 90700,
      "mileageUnit": "km",
      "enginePowerHp": 193,
      "colorExterior": "Не е посочен"
    },
    "seller": {
      "id": "dealer-mg7-group",
      "type": "dealer",
      "displayName": "MG7 Group",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:00:38.750Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11787220789122620",
    "slug": "bmw-840ci-m-sport-122620",
    "category": "car",
    "dealerOrgId": "dealer-mg7-group",
    "status": "active",
    "title": "BMW 840Ci M Sport",
    "description": "BMW 840Ci M Sport, 1995 г., 173 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://mg7group.mobile.bg/obiava-11787220789122620-bmw-840-ci-m-sport",
    "price": {
      "amount": 24900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11787220789122620-1.webp",
        "alt": "BMW 840Ci M Sport — снимка 1"
      },
      {
        "url": "/dealer/stock/11787220789122620-2.webp",
        "alt": "BMW 840Ci M Sport — снимка 2"
      },
      {
        "url": "/dealer/stock/11787220789122620-3.webp",
        "alt": "BMW 840Ci M Sport — снимка 3"
      },
      {
        "url": "/dealer/stock/11787220789122620-4.webp",
        "alt": "BMW 840Ci M Sport — снимка 4"
      },
      {
        "url": "/dealer/stock/11787220789122620-5.webp",
        "alt": "BMW 840Ci M Sport — снимка 5"
      },
      {
        "url": "/dealer/stock/11787220789122620-6.webp",
        "alt": "BMW 840Ci M Sport — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Промишлена зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "840Ci M Sport",
      "year": 1995,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 173000,
      "mileageUnit": "km",
      "enginePowerHp": 286,
      "colorExterior": "Не е посочен"
    },
    "seller": {
      "id": "dealer-mg7-group",
      "type": "dealer",
      "displayName": "MG7 Group",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:00:38.750Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11787219518736875",
    "slug": "audi-a8-50-tdi-v6-736875",
    "category": "car",
    "dealerOrgId": "dealer-mg7-group",
    "status": "active",
    "title": "Audi A8 50 TDI V6",
    "description": "Audi A8 50 TDI V6, 2018 г., 175 000 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://mg7group.mobile.bg/obiava-11787219518736875-audi-a8-50-tdi-v6",
    "price": {
      "amount": 29900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11787219518736875-1.webp",
        "alt": "Audi A8 50 TDI V6 — снимка 1"
      },
      {
        "url": "/dealer/stock/11787219518736875-2.webp",
        "alt": "Audi A8 50 TDI V6 — снимка 2"
      },
      {
        "url": "/dealer/stock/11787219518736875-3.webp",
        "alt": "Audi A8 50 TDI V6 — снимка 3"
      },
      {
        "url": "/dealer/stock/11787219518736875-4.webp",
        "alt": "Audi A8 50 TDI V6 — снимка 4"
      },
      {
        "url": "/dealer/stock/11787219518736875-5.webp",
        "alt": "Audi A8 50 TDI V6 — снимка 5"
      },
      {
        "url": "/dealer/stock/11787219518736875-6.webp",
        "alt": "Audi A8 50 TDI V6 — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Промишлена зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A8 50 TDI V6",
      "year": 2018,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 175000,
      "mileageUnit": "km",
      "enginePowerHp": 286,
      "colorExterior": "Не е посочен"
    },
    "seller": {
      "id": "dealer-mg7-group",
      "type": "dealer",
      "displayName": "MG7 Group",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:00:38.750Z",
    "promoted": false,
    "priceTaxLabel": "Цената е с включено ДДС"
  },
  {
    "id": "11787042642128831",
    "slug": "audi-a6-allroad-50-tdi-v6-128831",
    "category": "car",
    "dealerOrgId": "dealer-mg7-group",
    "status": "active",
    "title": "Audi A6 Allroad 50 TDI V6",
    "description": "Audi A6 Allroad 50 TDI V6, 2020 г., 115 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://mg7group.mobile.bg/obiava-11787042642128831-audi-a6-allroad-50-tdi-v6-286hp-dosie-ot-0-km",
    "price": {
      "amount": 27000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11787042642128831-1.webp",
        "alt": "Audi A6 Allroad 50 TDI V6 — снимка 1"
      },
      {
        "url": "/dealer/stock/11787042642128831-2.webp",
        "alt": "Audi A6 Allroad 50 TDI V6 — снимка 2"
      },
      {
        "url": "/dealer/stock/11787042642128831-3.webp",
        "alt": "Audi A6 Allroad 50 TDI V6 — снимка 3"
      },
      {
        "url": "/dealer/stock/11787042642128831-4.webp",
        "alt": "Audi A6 Allroad 50 TDI V6 — снимка 4"
      },
      {
        "url": "/dealer/stock/11787042642128831-5.webp",
        "alt": "Audi A6 Allroad 50 TDI V6 — снимка 5"
      },
      {
        "url": "/dealer/stock/11787042642128831-6.webp",
        "alt": "Audi A6 Allroad 50 TDI V6 — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Промишлена зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A6 Allroad 50 TDI V6",
      "year": 2020,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 115000,
      "mileageUnit": "km",
      "enginePowerHp": 286,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-mg7-group",
      "type": "dealer",
      "displayName": "MG7 Group",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:00:38.750Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11754657468074384",
    "slug": "porsche-911-997-turbo-074384",
    "category": "car",
    "dealerOrgId": "dealer-mg7-group",
    "status": "active",
    "title": "Porsche 911 997 Turbo",
    "description": "Porsche 911 997 Turbo, 2008 г., 79 907 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://mg7group.mobile.bg/obiava-11754657468074384-porsche-911-997-turbo-mezger-carbon-akrapovic",
    "price": {
      "amount": 83000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11754657468074384-1.webp",
        "alt": "Porsche 911 997 Turbo — снимка 1"
      },
      {
        "url": "/dealer/stock/11754657468074384-2.webp",
        "alt": "Porsche 911 997 Turbo — снимка 2"
      },
      {
        "url": "/dealer/stock/11754657468074384-3.webp",
        "alt": "Porsche 911 997 Turbo — снимка 3"
      },
      {
        "url": "/dealer/stock/11754657468074384-4.webp",
        "alt": "Porsche 911 997 Turbo — снимка 4"
      },
      {
        "url": "/dealer/stock/11754657468074384-5.webp",
        "alt": "Porsche 911 997 Turbo — снимка 5"
      },
      {
        "url": "/dealer/stock/11754657468074384-6.webp",
        "alt": "Porsche 911 997 Turbo — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Промишлена зона — Север",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Porsche",
      "model": "911 997 Turbo",
      "year": 2008,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 79907,
      "mileageUnit": "km",
      "enginePowerHp": 480,
      "colorExterior": "Не е посочен"
    },
    "seller": {
      "id": "dealer-mg7-group",
      "type": "dealer",
      "displayName": "MG7 Group",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:00:38.750Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
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
