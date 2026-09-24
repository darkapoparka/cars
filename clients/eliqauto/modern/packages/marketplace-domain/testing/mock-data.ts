import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "am-1001",
    "slug": "2014-11779989521200947",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%",
    "description": "2014 Audi A5 with S Line, facelift. 245 hp, diesel, automatic transmission.",
    "price": {
      "amount": 12880,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11779989521200947/img-01.webp",
        "alt": "Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11779989521200947/img-02.webp",
        "alt": "Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11779989521200947/img-03.webp",
        "alt": "Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11779989521200947/img-04.webp",
        "alt": "Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11779989521200947/img-05.webp",
        "alt": "Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11779989521200947/img-06.webp",
        "alt": "Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Audi",
      "model": "Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%",
      "year": 2014,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 172000,
      "mileageUnit": "km",
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1010",
    "slug": "2017-11780007305121982",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "BMW 750 I LONG XDRIVE LED NAVI 360 B&W ЛИЗИНГ 100%",
    "description": "2017 BMW 750 with xDrive, long. 450 hp, petrol, automatic transmission.",
    "price": {
      "amount": 24880,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11780007305121982/img-02.webp",
        "alt": "BMW 750 I LONG XDRIVE LED NAVI 360 B&W ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780007305121982/img-03.webp",
        "alt": "BMW 750 I LONG XDRIVE LED NAVI 360 B&W ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780007305121982/img-04.webp",
        "alt": "BMW 750 I LONG XDRIVE LED NAVI 360 B&W ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780007305121982/img-05.webp",
        "alt": "BMW 750 I LONG XDRIVE LED NAVI 360 B&W ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780007305121982/img-06.webp",
        "alt": "BMW 750 I LONG XDRIVE LED NAVI 360 B&W ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "BMW",
      "model": "BMW 750 I LONG XDRIVE LED NAVI 360 B&W ЛИЗИНГ 100%",
      "year": 2017,
      "bodyType": "other",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 163000,
      "mileageUnit": "km",
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1011",
    "slug": "2009-11780175636720970",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Mercedes-Benz S 500 LONG FACELIFT LED ПАНО H&K 3XTV ЛИЗИНГ 100%",
    "description": "2009 Mercedes-Benz S 500 with facelift, long. 388 hp, petrol, automatic transmission.",
    "price": {
      "amount": 13660,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11780175636720970/img-02.webp",
        "alt": "Mercedes-Benz S 500 LONG FACELIFT LED ПАНО H&K 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780175636720970/img-03.webp",
        "alt": "Mercedes-Benz S 500 LONG FACELIFT LED ПАНО H&K 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780175636720970/img-04.webp",
        "alt": "Mercedes-Benz S 500 LONG FACELIFT LED ПАНО H&K 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780175636720970/img-05.webp",
        "alt": "Mercedes-Benz S 500 LONG FACELIFT LED ПАНО H&K 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780175636720970/img-06.webp",
        "alt": "Mercedes-Benz S 500 LONG FACELIFT LED ПАНО H&K 3XTV ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Mercedes-Benz",
      "model": "Mercedes-Benz S 500 LONG FACELIFT LED ПАНО H&K 3XTV ЛИЗИНГ 100%",
      "year": 2009,
      "bodyType": "other",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 180000,
      "mileageUnit": "km",
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": true
  },
  {
    "id": "am-1012",
    "slug": "2014-11780176585830804",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Mercedes-Benz CLA 200 D FACELIFT AMG LINE LED NAVI ЛИЗИНГ 100%",
    "description": "2014 Mercedes-Benz CLA 200 with AMG, facelift. 136 hp, diesel, automatic transmission.",
    "price": {
      "amount": 13660,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11780176585830804/img-02.webp",
        "alt": "Mercedes-Benz CLA 200 D FACELIFT AMG LINE LED NAVI ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780176585830804/img-03.webp",
        "alt": "Mercedes-Benz CLA 200 D FACELIFT AMG LINE LED NAVI ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780176585830804/img-04.webp",
        "alt": "Mercedes-Benz CLA 200 D FACELIFT AMG LINE LED NAVI ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780176585830804/img-05.webp",
        "alt": "Mercedes-Benz CLA 200 D FACELIFT AMG LINE LED NAVI ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780176585830804/img-06.webp",
        "alt": "Mercedes-Benz CLA 200 D FACELIFT AMG LINE LED NAVI ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780176585830804/img-01.webp",
        "alt": "Mercedes-Benz CLA 200 D FACELIFT AMG LINE LED NAVI ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Mercedes-Benz",
      "model": "Mercedes-Benz CLA 200 D FACELIFT AMG LINE LED NAVI ЛИЗИНГ 100%",
      "year": 2014,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 180000,
      "mileageUnit": "km",
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1013",
    "slug": "2019-11780177315125298",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Mercedes-Benz S 560 LONG FACELIFT AMG LINE ПАНО BURM HUD ЛИЗИНГ 100%",
    "description": "2019 Mercedes-Benz S 560 with AMG, facelift, long. 469 hp, petrol, automatic transmission.",
    "price": {
      "amount": 0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11780177315125298/img-01.webp",
        "alt": "Mercedes-Benz S 560 LONG FACELIFT AMG LINE ПАНО BURM HUD ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780177315125298/img-02.webp",
        "alt": "Mercedes-Benz S 560 LONG FACELIFT AMG LINE ПАНО BURM HUD ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780177315125298/img-03.webp",
        "alt": "Mercedes-Benz S 560 LONG FACELIFT AMG LINE ПАНО BURM HUD ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780177315125298/img-04.webp",
        "alt": "Mercedes-Benz S 560 LONG FACELIFT AMG LINE ПАНО BURM HUD ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780177315125298/img-05.webp",
        "alt": "Mercedes-Benz S 560 LONG FACELIFT AMG LINE ПАНО BURM HUD ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780177315125298/img-06.webp",
        "alt": "Mercedes-Benz S 560 LONG FACELIFT AMG LINE ПАНО BURM HUD ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Mercedes-Benz",
      "model": "Mercedes-Benz S 560 LONG FACELIFT AMG LINE ПАНО BURM HUD ЛИЗИНГ 100%",
      "year": 2019,
      "bodyType": "other",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 177000,
      "mileageUnit": "km",
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1014",
    "slug": "2022-11780254722465322",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Mercedes-Benz S 400 D LONG AMG LINE LED ПАНО 5D BURM HUD ЛИЗИНГ 100%",
    "description": "2022 Mercedes-Benz S 400 with AMG, long. 330 hp, diesel, automatic transmission.",
    "price": {
      "amount": 77880,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11780254722465322/img-01.webp",
        "alt": "Mercedes-Benz S 400 D LONG AMG LINE LED ПАНО 5D BURM HUD ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780254722465322/img-02.webp",
        "alt": "Mercedes-Benz S 400 D LONG AMG LINE LED ПАНО 5D BURM HUD ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780254722465322/img-03.webp",
        "alt": "Mercedes-Benz S 400 D LONG AMG LINE LED ПАНО 5D BURM HUD ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780254722465322/img-04.webp",
        "alt": "Mercedes-Benz S 400 D LONG AMG LINE LED ПАНО 5D BURM HUD ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780254722465322/img-05.webp",
        "alt": "Mercedes-Benz S 400 D LONG AMG LINE LED ПАНО 5D BURM HUD ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780254722465322/img-06.webp",
        "alt": "Mercedes-Benz S 400 D LONG AMG LINE LED ПАНО 5D BURM HUD ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Mercedes-Benz",
      "model": "Mercedes-Benz S 400 D LONG AMG LINE LED ПАНО 5D BURM HUD ЛИЗИНГ 100%",
      "year": 2022,
      "bodyType": "other",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 80000,
      "mileageUnit": "km",
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1002",
    "slug": "2020-11780906851194765",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Audi A8 50TDI QUATTRO MATRIX ПАНО B&O 3XTV ЛИЗИНГ 100%",
    "description": "2020 Audi A8 with quattro, Matrix. 286 hp, diesel, automatic transmission.",
    "price": {
      "amount": 39660,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11780906851194765/img-01.webp",
        "alt": "Audi A8 50TDI QUATTRO MATRIX ПАНО B&O 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780906851194765/img-02.webp",
        "alt": "Audi A8 50TDI QUATTRO MATRIX ПАНО B&O 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780906851194765/img-03.webp",
        "alt": "Audi A8 50TDI QUATTRO MATRIX ПАНО B&O 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780906851194765/img-04.webp",
        "alt": "Audi A8 50TDI QUATTRO MATRIX ПАНО B&O 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780906851194765/img-05.webp",
        "alt": "Audi A8 50TDI QUATTRO MATRIX ПАНО B&O 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780906851194765/img-06.webp",
        "alt": "Audi A8 50TDI QUATTRO MATRIX ПАНО B&O 3XTV ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Audi",
      "model": "Audi A8 50TDI QUATTRO MATRIX ПАНО B&O 3XTV ЛИЗИНГ 100%",
      "year": 2020,
      "bodyType": "other",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 158000,
      "mileageUnit": "km",
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1003",
    "slug": "2023-11780907716855488",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Mercedes-Benz GLS 450 I 4MATIC FULL AMG LINE LED ПАНО BURM ЛИЗИНГ 100%",
    "description": "2023 Mercedes-Benz GLS 450 with AMG, 4MATIC. 367 hp, petrol, automatic transmission.",
    "price": {
      "amount": 81745,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11780907716855488/img-01.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL AMG LINE LED ПАНО BURM ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780907716855488/img-02.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL AMG LINE LED ПАНО BURM ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780907716855488/img-03.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL AMG LINE LED ПАНО BURM ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780907716855488/img-04.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL AMG LINE LED ПАНО BURM ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780907716855488/img-05.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL AMG LINE LED ПАНО BURM ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780907716855488/img-06.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL AMG LINE LED ПАНО BURM ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Mercedes-Benz",
      "model": "Mercedes-Benz GLS 450 I 4MATIC FULL AMG LINE LED ПАНО BURM ЛИЗИНГ 100%",
      "year": 2023,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 72000,
      "mileageUnit": "km",
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1004",
    "slug": "2018-11780909888518340",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Mercedes-Benz E 220 D FULL AMG LINE LED ПАНО BURM 3XTV ЛИЗИНГ 100%",
    "description": "2018 Mercedes-Benz E 220 with AMG. 194 hp, diesel, automatic transmission.",
    "price": {
      "amount": 25660,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11780909888518340/img-01.webp",
        "alt": "Mercedes-Benz E 220 D FULL AMG LINE LED ПАНО BURM 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780909888518340/img-02.webp",
        "alt": "Mercedes-Benz E 220 D FULL AMG LINE LED ПАНО BURM 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780909888518340/img-03.webp",
        "alt": "Mercedes-Benz E 220 D FULL AMG LINE LED ПАНО BURM 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780909888518340/img-04.webp",
        "alt": "Mercedes-Benz E 220 D FULL AMG LINE LED ПАНО BURM 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780909888518340/img-05.webp",
        "alt": "Mercedes-Benz E 220 D FULL AMG LINE LED ПАНО BURM 3XTV ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11780909888518340/img-06.webp",
        "alt": "Mercedes-Benz E 220 D FULL AMG LINE LED ПАНО BURM 3XTV ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Mercedes-Benz",
      "model": "Mercedes-Benz E 220 D FULL AMG LINE LED ПАНО BURM 3XTV ЛИЗИНГ 100%",
      "year": 2018,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 200000,
      "mileageUnit": "km",
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1005",
    "slug": "2021-11781187597210481",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Mercedes-Benz GLS 450 I 4MATIC FULL MAYBACH ПАНО BURM 360 ЛИЗИНГ 100%",
    "description": "2021 Mercedes-Benz GLS 450 with 4MATIC, Maybach. 367 hp, petrol, automatic transmission.",
    "price": {
      "amount": 79660,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11781187597210481/img-01.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL MAYBACH ПАНО BURM 360 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781187597210481/img-02.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL MAYBACH ПАНО BURM 360 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781187597210481/img-03.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL MAYBACH ПАНО BURM 360 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781187597210481/img-04.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL MAYBACH ПАНО BURM 360 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781187597210481/img-05.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL MAYBACH ПАНО BURM 360 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781187597210481/img-06.webp",
        "alt": "Mercedes-Benz GLS 450 I 4MATIC FULL MAYBACH ПАНО BURM 360 ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Mercedes-Benz",
      "model": "Mercedes-Benz GLS 450 I 4MATIC FULL MAYBACH ПАНО BURM 360 ЛИЗИНГ 100%",
      "year": 2021,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 78000,
      "mileageUnit": "km",
      "colorExterior": "Червен"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1006",
    "slug": "2020-11781207164422554",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Mercedes-Benz AMG GT 53 4MATIC+ LED DESIGNO BURM 360 ЛИЗИНГ 100%",
    "description": "2020 Mercedes-Benz AMG GT 53 with 4MATIC+, designo. 367 hp, petrol, automatic transmission.",
    "price": {
      "amount": 64880,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11781207164422554/img-01.webp",
        "alt": "Mercedes-Benz AMG GT 53 4MATIC+ LED DESIGNO BURM 360 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781207164422554/img-02.webp",
        "alt": "Mercedes-Benz AMG GT 53 4MATIC+ LED DESIGNO BURM 360 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781207164422554/img-03.webp",
        "alt": "Mercedes-Benz AMG GT 53 4MATIC+ LED DESIGNO BURM 360 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781207164422554/img-04.webp",
        "alt": "Mercedes-Benz AMG GT 53 4MATIC+ LED DESIGNO BURM 360 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781207164422554/img-05.webp",
        "alt": "Mercedes-Benz AMG GT 53 4MATIC+ LED DESIGNO BURM 360 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781207164422554/img-06.webp",
        "alt": "Mercedes-Benz AMG GT 53 4MATIC+ LED DESIGNO BURM 360 ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Mercedes-Benz",
      "model": "Mercedes-Benz AMG GT 53 4MATIC+ LED DESIGNO BURM 360 ЛИЗИНГ 100%",
      "year": 2020,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 135000,
      "mileageUnit": "km",
      "colorExterior": "Зелен"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1007",
    "slug": "2020-11781211980587571",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "BMW 750 D XDRIVE BLACK FIRE EDITION 1OF150 ЛИЗИНГ 100%",
    "description": "2020 BMW 750 with xDrive, Black Fire Edition. 400 hp, diesel, automatic transmission.",
    "price": {
      "amount": 57880,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11781211980587571/img-01.webp",
        "alt": "BMW 750 D XDRIVE BLACK FIRE EDITION 1OF150 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781211980587571/img-02.webp",
        "alt": "BMW 750 D XDRIVE BLACK FIRE EDITION 1OF150 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781211980587571/img-03.webp",
        "alt": "BMW 750 D XDRIVE BLACK FIRE EDITION 1OF150 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781211980587571/img-04.webp",
        "alt": "BMW 750 D XDRIVE BLACK FIRE EDITION 1OF150 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781211980587571/img-05.webp",
        "alt": "BMW 750 D XDRIVE BLACK FIRE EDITION 1OF150 ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781211980587571/img-06.webp",
        "alt": "BMW 750 D XDRIVE BLACK FIRE EDITION 1OF150 ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "BMW",
      "model": "BMW 750 D XDRIVE BLACK FIRE EDITION 1OF150 ЛИЗИНГ 100%",
      "year": 2020,
      "bodyType": "other",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 87000,
      "mileageUnit": "km",
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1008",
    "slug": "2020-11781244995278530",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Audi A8 50TDI LONG MATRIX ПАНО 3XTV B&O ЛИЗИНГ 100%",
    "description": "2020 Audi A8 with Matrix, long. 286 hp, diesel, automatic transmission.",
    "price": {
      "amount": 39660,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11781244995278530/img-01.webp",
        "alt": "Audi A8 50TDI LONG MATRIX ПАНО 3XTV B&O ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781244995278530/img-02.webp",
        "alt": "Audi A8 50TDI LONG MATRIX ПАНО 3XTV B&O ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781244995278530/img-03.webp",
        "alt": "Audi A8 50TDI LONG MATRIX ПАНО 3XTV B&O ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781244995278530/img-04.webp",
        "alt": "Audi A8 50TDI LONG MATRIX ПАНО 3XTV B&O ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781244995278530/img-05.webp",
        "alt": "Audi A8 50TDI LONG MATRIX ПАНО 3XTV B&O ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781244995278530/img-06.webp",
        "alt": "Audi A8 50TDI LONG MATRIX ПАНО 3XTV B&O ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Audi",
      "model": "Audi A8 50TDI LONG MATRIX ПАНО 3XTV B&O ЛИЗИНГ 100%",
      "year": 2020,
      "bodyType": "other",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 164000,
      "mileageUnit": "km",
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
    "promoted": false
  },
  {
    "id": "am-1009",
    "slug": "2017-11781281410239020",
    "category": "car",
    "dealerOrgId": "dealer-eliqauto",
    "status": "active",
    "title": "Mercedes-Benz C 63 AMG S V8 BITURBO LED NAVI BURM ЛИЗИНГ 100%",
    "description": "2017 Mercedes-Benz C 63 with AMG, biturbo. 510 hp, petrol, automatic transmission.",
    "price": {
      "amount": 39660,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/eliqauto/cars/11781281410239020/img-01.webp",
        "alt": "Mercedes-Benz C 63 AMG S V8 BITURBO LED NAVI BURM ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781281410239020/img-02.webp",
        "alt": "Mercedes-Benz C 63 AMG S V8 BITURBO LED NAVI BURM ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781281410239020/img-03.webp",
        "alt": "Mercedes-Benz C 63 AMG S V8 BITURBO LED NAVI BURM ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781281410239020/img-04.webp",
        "alt": "Mercedes-Benz C 63 AMG S V8 BITURBO LED NAVI BURM ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781281410239020/img-05.webp",
        "alt": "Mercedes-Benz C 63 AMG S V8 BITURBO LED NAVI BURM ЛИЗИНГ 100%"
      },
      {
        "url": "/assets/eliqauto/cars/11781281410239020/img-06.webp",
        "alt": "Mercedes-Benz C 63 AMG S V8 BITURBO LED NAVI BURM ЛИЗИНГ 100%"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пазарджик",
      "region": "Пазарджик",
      "country": "Bulgaria"
    },
    "spec": {
      "make": "Mercedes-Benz",
      "model": "Mercedes-Benz C 63 AMG S V8 BITURBO LED NAVI BURM ЛИЗИНГ 100%",
      "year": 2017,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 170000,
      "mileageUnit": "km",
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-eliqauto",
      "type": "dealer",
      "displayName": "ELIQ AUTO",
      "verificationStatus": "unverified",
      "city": "Пазарджик",
      "logoUrl": "/dealer-brand/logo-on-light-20260919.webp"
    },
    "publishedAt": "2026-01-01T09:00:00.000Z",
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
