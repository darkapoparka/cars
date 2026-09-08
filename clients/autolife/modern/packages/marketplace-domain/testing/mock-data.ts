import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "autolife-21769682585171886",
    "slug": "autolife-21769682585171886",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "BMW X4 2.0D-190",
    "description": "BMW X4 2.0D-190 M PACKET FULL MCAR VARNA, 2017 г., 190 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-21769682585171886-bmw-x4-2-0d-190-m-packet-full-mcar-varna",
    "price": {
      "amount": 20500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-01-1.webp",
        "alt": "BMW X4 2.0D-190"
      },
      {
        "url": "/assets/autolife/vehicle-01-2.webp",
        "alt": "BMW X4 2.0D-190"
      },
      {
        "url": "/assets/autolife/vehicle-01-3.webp",
        "alt": "BMW X4 2.0D-190"
      },
      {
        "url": "/assets/autolife/vehicle-01-4.webp",
        "alt": "BMW X4 2.0D-190"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "X4 2.0D-190",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 190000,
      "mileageUnit": "km",
      "enginePowerHp": 190,
      "colorExterior": "Червен"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11770980926901387",
    "slug": "autolife-11770980926901387",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "Seat Alhambra 2.0TDI-150",
    "description": "Seat Alhambra 2.0TDI-150 KOJA NAVI CAMERA PANORAMA DSG DISTR EL., 2015 г., 244 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-11770980926901387-seat-alhambra-2-0tdi-150-koja-navi-camera-panorama-dsg-distr-el",
    "price": {
      "amount": 11999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-02-1.webp",
        "alt": "Seat Alhambra 2.0TDI-150"
      },
      {
        "url": "/assets/autolife/vehicle-02-2.webp",
        "alt": "Seat Alhambra 2.0TDI-150"
      },
      {
        "url": "/assets/autolife/vehicle-02-3.webp",
        "alt": "Seat Alhambra 2.0TDI-150"
      },
      {
        "url": "/assets/autolife/vehicle-02-4.webp",
        "alt": "Seat Alhambra 2.0TDI-150"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Seat",
      "model": "Alhambra 2.0TDI-150",
      "year": 2015,
      "bodyType": "van",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 244000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Tъмно син"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:59.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11741772051965725",
    "slug": "autolife-11741772051965725",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "Ford Ka +",
    "description": "Ford Ka + 1.5DURATORQ ACTIVE EURO6D, 2018 г., 119 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-11741772051965725-ford-ka-1-5duratorq-active-euro6d",
    "price": {
      "amount": 6999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-03-1.webp",
        "alt": "Ford Ka +"
      },
      {
        "url": "/assets/autolife/vehicle-03-2.webp",
        "alt": "Ford Ka +"
      },
      {
        "url": "/assets/autolife/vehicle-03-3.webp",
        "alt": "Ford Ka +"
      },
      {
        "url": "/assets/autolife/vehicle-03-4.webp",
        "alt": "Ford Ka +"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Ford",
      "model": "Ka +",
      "year": 2018,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 119000,
      "mileageUnit": "km",
      "enginePowerHp": 95,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:58.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11751025134623319",
    "slug": "autolife-11751025134623319",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "VW Golf 1.6TDI",
    "description": "VW Golf 1.6TDI BLUEMOTION, 2010 г., 250 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-11751025134623319-vw-golf-1-6tdi-bluemotion",
    "price": {
      "amount": 4500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-04-1.webp",
        "alt": "VW Golf 1.6TDI"
      },
      {
        "url": "/assets/autolife/vehicle-04-2.webp",
        "alt": "VW Golf 1.6TDI"
      },
      {
        "url": "/assets/autolife/vehicle-04-3.webp",
        "alt": "VW Golf 1.6TDI"
      },
      {
        "url": "/assets/autolife/vehicle-04-4.webp",
        "alt": "VW Golf 1.6TDI"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "VW",
      "model": "Golf 1.6TDI",
      "year": 2010,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 250000,
      "mileageUnit": "km",
      "enginePowerHp": 105,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:57.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11768209424885033",
    "slug": "autolife-11768209424885033",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "Seat Altea FACELIFT",
    "description": "Seat Altea FACELIFT B/GPL, 2010 г., 242 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-11768209424885033-seat-altea-facelift-b-gpl",
    "price": {
      "amount": 3999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-05-1.webp",
        "alt": "Seat Altea FACELIFT"
      },
      {
        "url": "/assets/autolife/vehicle-05-2.webp",
        "alt": "Seat Altea FACELIFT"
      },
      {
        "url": "/assets/autolife/vehicle-05-3.webp",
        "alt": "Seat Altea FACELIFT"
      },
      {
        "url": "/assets/autolife/vehicle-05-4.webp",
        "alt": "Seat Altea FACELIFT"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Seat",
      "model": "Altea FACELIFT",
      "year": 2010,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 242000,
      "mileageUnit": "km",
      "enginePowerHp": 85,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:56.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11762785459915323",
    "slug": "autolife-11762785459915323",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "Audi A4 Sline",
    "description": "Audi A4 Sline 4x4 DISTR DIGITAL MATRIX KEY LESS BLIND SPOT, 2021 г., 186 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Виж оригиналната обява. Оригинална обява: https://autolife.mobile.bg/obiava-11762785459915323-audi-a4-sline-4x4-distr-digital-matrix-key-less-blind-spot",
    "price": {
      "amount": 20500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-06-1.webp",
        "alt": "Audi A4 Sline"
      },
      {
        "url": "/assets/autolife/vehicle-06-2.webp",
        "alt": "Audi A4 Sline"
      },
      {
        "url": "/assets/autolife/vehicle-06-3.webp",
        "alt": "Audi A4 Sline"
      },
      {
        "url": "/assets/autolife/vehicle-06-4.webp",
        "alt": "Audi A4 Sline"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "A4 Sline",
      "year": 2021,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 186000,
      "mileageUnit": "km",
      "enginePowerHp": 204,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:55.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11752841612433166",
    "slug": "autolife-11752841612433166",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "Citroen C5 2.2",
    "description": "Citroen C5 2.2 HDI 170 FULL, 2008 г., 217 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-11752841612433166-citroen-c5-2-2-hdi-170-full",
    "price": {
      "amount": 3700,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-07-1.webp",
        "alt": "Citroen C5 2.2"
      },
      {
        "url": "/assets/autolife/vehicle-07-2.webp",
        "alt": "Citroen C5 2.2"
      },
      {
        "url": "/assets/autolife/vehicle-07-3.webp",
        "alt": "Citroen C5 2.2"
      },
      {
        "url": "/assets/autolife/vehicle-07-4.webp",
        "alt": "Citroen C5 2.2"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Citroen",
      "model": "C5 2.2",
      "year": 2008,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 217000,
      "mileageUnit": "km",
      "enginePowerHp": 170,
      "colorExterior": "Тъмно син мет."
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:54.000Z",
    "promoted": false
  },
  {
    "id": "autolife-21756807262024883",
    "slug": "autolife-21756807262024883",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "Audi Q5 2.0TDI-170",
    "description": "Audi Q5 2.0TDI-170 PANORAMA, 2009 г., 224 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-21756807262024883-audi-q5-2-0tdi-170-panorama",
    "price": {
      "amount": 7999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-08-1.webp",
        "alt": "Audi Q5 2.0TDI-170"
      },
      {
        "url": "/assets/autolife/vehicle-08-2.webp",
        "alt": "Audi Q5 2.0TDI-170"
      },
      {
        "url": "/assets/autolife/vehicle-08-3.webp",
        "alt": "Audi Q5 2.0TDI-170"
      },
      {
        "url": "/assets/autolife/vehicle-08-4.webp",
        "alt": "Audi Q5 2.0TDI-170"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Audi",
      "model": "Q5 2.0TDI-170",
      "year": 2009,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 224000,
      "mileageUnit": "km",
      "enginePowerHp": 170,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:53.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11768636298551646",
    "slug": "autolife-11768636298551646",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "VW Touran 2.0TDI-150",
    "description": "VW Touran 2.0TDI-150 DISTR. CAMERA DSG, 2021 г., 145 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-11768636298551646-vw-touran-2-0tdi-150-distr-camera-dsg",
    "price": {
      "amount": 13999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-09-1.webp",
        "alt": "VW Touran 2.0TDI-150"
      },
      {
        "url": "/assets/autolife/vehicle-09-2.webp",
        "alt": "VW Touran 2.0TDI-150"
      },
      {
        "url": "/assets/autolife/vehicle-09-3.webp",
        "alt": "VW Touran 2.0TDI-150"
      },
      {
        "url": "/assets/autolife/vehicle-09-4.webp",
        "alt": "VW Touran 2.0TDI-150"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "VW",
      "model": "Touran 2.0TDI-150",
      "year": 2021,
      "bodyType": "van",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 145000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:52.000Z",
    "promoted": false
  },
  {
    "id": "autolife-21774977517199416",
    "slug": "autolife-21774977517199416",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "Mercedes-Benz GLE Coupe",
    "description": "Mercedes-Benz GLE Coupe 350CDI AMG DISTR. PANO CAMERA HARMAN/KARDON, 2017 г., 189 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-21774977517199416-mercedes-benz-gle-coupe-350cdi-amg-distr-pano-camera-harman-kardon",
    "price": {
      "amount": 34500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-10-1.webp",
        "alt": "Mercedes-Benz GLE Coupe"
      },
      {
        "url": "/assets/autolife/vehicle-10-2.webp",
        "alt": "Mercedes-Benz GLE Coupe"
      },
      {
        "url": "/assets/autolife/vehicle-10-3.webp",
        "alt": "Mercedes-Benz GLE Coupe"
      },
      {
        "url": "/assets/autolife/vehicle-10-4.webp",
        "alt": "Mercedes-Benz GLE Coupe"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "GLE Coupe",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 189000,
      "mileageUnit": "km",
      "enginePowerHp": 258,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:51.000Z",
    "promoted": false
  },
  {
    "id": "autolife-21776689748685033",
    "slug": "autolife-21776689748685033",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "BMW X1 2.0D-150",
    "description": "BMW X1 2.0D-150 X-DRIVE, 2016 г., 250 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-21776689748685033-bmw-x1-2-0d-150-x-drive",
    "price": {
      "amount": 11500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-11-1.webp",
        "alt": "BMW X1 2.0D-150"
      },
      {
        "url": "/assets/autolife/vehicle-11-2.webp",
        "alt": "BMW X1 2.0D-150"
      },
      {
        "url": "/assets/autolife/vehicle-11-3.webp",
        "alt": "BMW X1 2.0D-150"
      },
      {
        "url": "/assets/autolife/vehicle-11-4.webp",
        "alt": "BMW X1 2.0D-150"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "BMW",
      "model": "X1 2.0D-150",
      "year": 2016,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 250000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:50.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11776774936356749",
    "slug": "autolife-11776774936356749",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "Peugeot 508 ACTIVE",
    "description": "Peugeot 508 ACTIVE BLUEHDI 130 S&S EAT8, 2019 г., 175 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-11776774936356749-peugeot-508-active-bluehdi-130-s-s-eat8",
    "price": {
      "amount": 12300,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-12-1.webp",
        "alt": "Peugeot 508 ACTIVE"
      },
      {
        "url": "/assets/autolife/vehicle-12-2.webp",
        "alt": "Peugeot 508 ACTIVE"
      },
      {
        "url": "/assets/autolife/vehicle-12-3.webp",
        "alt": "Peugeot 508 ACTIVE"
      },
      {
        "url": "/assets/autolife/vehicle-12-4.webp",
        "alt": "Peugeot 508 ACTIVE"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Peugeot",
      "model": "508 ACTIVE",
      "year": 2019,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 175000,
      "mileageUnit": "km",
      "enginePowerHp": 130,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:49.000Z",
    "promoted": false
  },
  {
    "id": "autolife-21778149802063175",
    "slug": "autolife-21778149802063175",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "VW Tiguan FACELIFT",
    "description": "VW Tiguan FACELIFT 2.0TDI-150 DSG NAVI CAMERA DISTR CAR PLAY, 2019 г., 214 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-21778149802063175-vw-tiguan-facelift-2-0tdi-150-dsg-navi-camera-distr-car-play",
    "price": {
      "amount": 14999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-13-1.webp",
        "alt": "VW Tiguan FACELIFT"
      },
      {
        "url": "/assets/autolife/vehicle-13-2.webp",
        "alt": "VW Tiguan FACELIFT"
      },
      {
        "url": "/assets/autolife/vehicle-13-3.webp",
        "alt": "VW Tiguan FACELIFT"
      },
      {
        "url": "/assets/autolife/vehicle-13-4.webp",
        "alt": "VW Tiguan FACELIFT"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "VW",
      "model": "Tiguan FACELIFT",
      "year": 2019,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 214000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:48.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11778155314388381",
    "slug": "autolife-11778155314388381",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "Volvo S60 НАПЪЛНО",
    "description": "Volvo S60 НАПЪЛНО СЕРВИЗИРАН, 2007 г., 470 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-11778155314388381-volvo-s60-napalno-serviziran",
    "price": {
      "amount": 2500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-14-1.webp",
        "alt": "Volvo S60 НАПЪЛНО"
      },
      {
        "url": "/assets/autolife/vehicle-14-2.webp",
        "alt": "Volvo S60 НАПЪЛНО"
      },
      {
        "url": "/assets/autolife/vehicle-14-3.webp",
        "alt": "Volvo S60 НАПЪЛНО"
      },
      {
        "url": "/assets/autolife/vehicle-14-4.webp",
        "alt": "Volvo S60 НАПЪЛНО"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Volvo",
      "model": "S60 НАПЪЛНО",
      "year": 2007,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 470000,
      "mileageUnit": "km",
      "enginePowerHp": 185,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:47.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11787391986129616",
    "slug": "autolife-11787391986129616",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "VW Passat 2.0TDI-140",
    "description": "VW Passat 2.0TDI-140, 2012 г., 237 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-11787391986129616-vw-passat-2-0tdi-140",
    "price": {
      "amount": 6300,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-15-1.webp",
        "alt": "VW Passat 2.0TDI-140"
      },
      {
        "url": "/assets/autolife/vehicle-15-2.webp",
        "alt": "VW Passat 2.0TDI-140"
      },
      {
        "url": "/assets/autolife/vehicle-15-3.webp",
        "alt": "VW Passat 2.0TDI-140"
      },
      {
        "url": "/assets/autolife/vehicle-15-4.webp",
        "alt": "VW Passat 2.0TDI-140"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "VW",
      "model": "Passat 2.0TDI-140",
      "year": 2012,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 237000,
      "mileageUnit": "km",
      "enginePowerHp": 140,
      "colorExterior": "Светло сив"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:46.000Z",
    "promoted": false
  },
  {
    "id": "autolife-11779369221509132",
    "slug": "autolife-11779369221509132",
    "category": "car",
    "dealerOrgId": "dealer-autolife",
    "status": "active",
    "title": "VW Polo 1.6",
    "description": "VW Polo 1.6 TDI HIGHLINE DSG NAVI CAR PLAY ANDROID AUTO, 2020 г., 140 000 км. Публикувана обява на Аутолайф. Потвърдете наличността, оборудването и цената по телефона. Не се начислява ДДС. Оригинална обява: https://autolife.mobile.bg/obiava-11779369221509132-vw-polo-1-6-tdi-highline-dsg-navi-car-play-android-auto",
    "price": {
      "amount": 9999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/autolife/vehicle-16-1.webp",
        "alt": "VW Polo 1.6"
      },
      {
        "url": "/assets/autolife/vehicle-16-2.webp",
        "alt": "VW Polo 1.6"
      },
      {
        "url": "/assets/autolife/vehicle-16-3.webp",
        "alt": "VW Polo 1.6"
      },
      {
        "url": "/assets/autolife/vehicle-16-4.webp",
        "alt": "VW Polo 1.6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "Тополи",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "VW",
      "model": "Polo 1.6",
      "year": 2020,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 140000,
      "mileageUnit": "km",
      "enginePowerHp": 95,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-autolife",
      "type": "dealer",
      "displayName": "Аутолайф",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:45.000Z",
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
