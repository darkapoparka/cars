import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

// Representative Excellent Cars public adverts captured 2026-09-07.
export const mockListings: VehicleListing[] = [
  {
    "id": "excellent-21781257688134220",
    "slug": "excellent-21781257688134220",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Mercedes-Benz GLE 350 AMG  DESIGNO",
    "description": "Mercedes-Benz GLE 350 AMG  DESIGNO, 2016 г., дизел, 179 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21781257688134220-mercedes-benz-gle-350-amg-designo-360cam-serv-ist-ambient-diss-har",
    "price": {
      "amount": 32900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-01-1.webp",
        "alt": "Mercedes-Benz GLE 350 AMG  DESIGNO"
      },
      {
        "url": "/assets/excellent/vehicle-01-2.webp",
        "alt": "Mercedes-Benz GLE 350 AMG  DESIGNO"
      },
      {
        "url": "/assets/excellent/vehicle-01-3.webp",
        "alt": "Mercedes-Benz GLE 350 AMG  DESIGNO"
      },
      {
        "url": "/assets/excellent/vehicle-01-4.webp",
        "alt": "Mercedes-Benz GLE 350 AMG  DESIGNO"
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
      "model": "GLE 350 AMG  DESIGNO",
      "year": 2016,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 179000,
      "mileageUnit": "km",
      "enginePowerHp": 258,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T08:00:00.000Z",
    "promoted": false
  },
  {
    "id": "excellent-11785932596351376",
    "slug": "excellent-11785932596351376",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "VW Passat 2.0TDI  HIGHLINE",
    "description": "VW Passat 2.0TDI  HIGHLINE, 2011 г., дизел, 212 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-11785932596351376-vw-passat-2-0tdi-highline-bluemotion-led-automat",
    "price": {
      "amount": 10500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-02-1.webp",
        "alt": "VW Passat 2.0TDI  HIGHLINE"
      },
      {
        "url": "/assets/excellent/vehicle-02-2.webp",
        "alt": "VW Passat 2.0TDI  HIGHLINE"
      },
      {
        "url": "/assets/excellent/vehicle-02-3.webp",
        "alt": "VW Passat 2.0TDI  HIGHLINE"
      },
      {
        "url": "/assets/excellent/vehicle-02-4.webp",
        "alt": "VW Passat 2.0TDI  HIGHLINE"
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
      "model": "Passat 2.0TDI  HIGHLINE",
      "year": 2011,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 212000,
      "mileageUnit": "km",
      "enginePowerHp": 140,
      "colorExterior": "Сребърен"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:59.000Z",
    "promoted": false
  },
  {
    "id": "excellent-11788181514006324",
    "slug": "excellent-11788181514006324",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Skoda Octavia 2.0TDI  4x4",
    "description": "Skoda Octavia 2.0TDI  4x4, 2022 г., дизел, 180 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-11788181514006324-skoda-octavia-2-0tdi-4x4-digital",
    "price": {
      "amount": 17900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-03-1.webp",
        "alt": "Skoda Octavia 2.0TDI  4x4"
      },
      {
        "url": "/assets/excellent/vehicle-03-2.webp",
        "alt": "Skoda Octavia 2.0TDI  4x4"
      },
      {
        "url": "/assets/excellent/vehicle-03-3.webp",
        "alt": "Skoda Octavia 2.0TDI  4x4"
      },
      {
        "url": "/assets/excellent/vehicle-03-4.webp",
        "alt": "Skoda Octavia 2.0TDI  4x4"
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
      "make": "Skoda",
      "model": "Octavia 2.0TDI  4x4",
      "year": 2022,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 180000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:58.000Z",
    "promoted": false
  },
  {
    "id": "excellent-11786795820524833",
    "slug": "excellent-11786795820524833",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Cupra Born RESTYLING  58KW",
    "description": "Cupra Born RESTYLING  58KW, 2022 г., електрически, 67 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-11786795820524833-cupra-born-restyling-58kw-67000km",
    "price": {
      "amount": 22900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-04-1.webp",
        "alt": "Cupra Born RESTYLING  58KW"
      },
      {
        "url": "/assets/excellent/vehicle-04-2.webp",
        "alt": "Cupra Born RESTYLING  58KW"
      },
      {
        "url": "/assets/excellent/vehicle-04-3.webp",
        "alt": "Cupra Born RESTYLING  58KW"
      },
      {
        "url": "/assets/excellent/vehicle-04-4.webp",
        "alt": "Cupra Born RESTYLING  58KW"
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
      "make": "Cupra",
      "model": "Born RESTYLING  58KW",
      "year": 2022,
      "bodyType": "hatchback",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 67000,
      "mileageUnit": "km",
      "enginePowerHp": 204,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:57.000Z",
    "promoted": false
  },
  {
    "id": "excellent-21786794971218528",
    "slug": "excellent-21786794971218528",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Hyundai Kona 1.6HEV  N-LINE",
    "description": "Hyundai Kona 1.6HEV  N-LINE, 2020 г., хибрид, 40 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21786794971218528-hyundai-kona-1-6hev-n-line-40000km",
    "price": {
      "amount": 17900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-05-1.webp",
        "alt": "Hyundai Kona 1.6HEV  N-LINE"
      },
      {
        "url": "/assets/excellent/vehicle-05-2.webp",
        "alt": "Hyundai Kona 1.6HEV  N-LINE"
      },
      {
        "url": "/assets/excellent/vehicle-05-3.webp",
        "alt": "Hyundai Kona 1.6HEV  N-LINE"
      },
      {
        "url": "/assets/excellent/vehicle-05-4.webp",
        "alt": "Hyundai Kona 1.6HEV  N-LINE"
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
      "make": "Hyundai",
      "model": "Kona 1.6HEV  N-LINE",
      "year": 2020,
      "bodyType": "suv",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 40000,
      "mileageUnit": "km",
      "enginePowerHp": 141,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:56.000Z",
    "promoted": false
  },
  {
    "id": "excellent-21786455005208728",
    "slug": "excellent-21786455005208728",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Kia Sportage 1.6D  AUTOMAT",
    "description": "Kia Sportage 1.6D  AUTOMAT, 2017 г., дизел, 180 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21786455005208728-kia-sportage-1-6d-automat",
    "price": {
      "amount": 10900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-06-1.webp",
        "alt": "Kia Sportage 1.6D  AUTOMAT"
      },
      {
        "url": "/assets/excellent/vehicle-06-2.webp",
        "alt": "Kia Sportage 1.6D  AUTOMAT"
      },
      {
        "url": "/assets/excellent/vehicle-06-3.webp",
        "alt": "Kia Sportage 1.6D  AUTOMAT"
      },
      {
        "url": "/assets/excellent/vehicle-06-4.webp",
        "alt": "Kia Sportage 1.6D  AUTOMAT"
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
      "make": "Kia",
      "model": "Sportage 1.6D  AUTOMAT",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 180000,
      "mileageUnit": "km",
      "enginePowerHp": 143,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:55.000Z",
    "promoted": false
  },
  {
    "id": "excellent-21786453972789852",
    "slug": "excellent-21786453972789852",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "VW Tiguan 2.0ТDI  4MOTION",
    "description": "VW Tiguan 2.0ТDI  4MOTION, 2017 г., дизел, 199 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21786453972789852-vw-tiguan-2-0tdi-4motion-swiss",
    "price": {
      "amount": 16990,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-07-1.webp",
        "alt": "VW Tiguan 2.0ТDI  4MOTION"
      },
      {
        "url": "/assets/excellent/vehicle-07-2.webp",
        "alt": "VW Tiguan 2.0ТDI  4MOTION"
      },
      {
        "url": "/assets/excellent/vehicle-07-3.webp",
        "alt": "VW Tiguan 2.0ТDI  4MOTION"
      },
      {
        "url": "/assets/excellent/vehicle-07-4.webp",
        "alt": "VW Tiguan 2.0ТDI  4MOTION"
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
      "model": "Tiguan 2.0ТDI  4MOTION",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 199000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:54.000Z",
    "promoted": false
  },
  {
    "id": "excellent-21786451392501339",
    "slug": "excellent-21786451392501339",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Land Rover Range Rover Evoque HYBRID  NARDO_GREY",
    "description": "Land Rover Range Rover Evoque HYBRID  NARDO_GREY, 2022 г., хибрид, 125 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21786451392501339-land-rover-range-rover-evoque-hybrid-nardo-grey-125000km",
    "price": {
      "amount": 25000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-08-1.webp",
        "alt": "Land Rover Range Rover Evoque HYBRID  NARDO_GREY"
      },
      {
        "url": "/assets/excellent/vehicle-08-2.webp",
        "alt": "Land Rover Range Rover Evoque HYBRID  NARDO_GREY"
      },
      {
        "url": "/assets/excellent/vehicle-08-3.webp",
        "alt": "Land Rover Range Rover Evoque HYBRID  NARDO_GREY"
      },
      {
        "url": "/assets/excellent/vehicle-08-4.webp",
        "alt": "Land Rover Range Rover Evoque HYBRID  NARDO_GREY"
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
      "make": "Land Rover",
      "model": "Range Rover Evoque HYBRID  NARDO_GREY",
      "year": 2022,
      "bodyType": "suv",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 125000,
      "mileageUnit": "km",
      "enginePowerHp": 163,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:53.000Z",
    "promoted": false
  },
  {
    "id": "excellent-21773151499854810",
    "slug": "excellent-21773151499854810",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Audi Q2 2.0TFSI  QUATTRO",
    "description": "Audi Q2 2.0TFSI  QUATTRO, 2018 г., бензин, 133 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21773151499854810-audi-q2-2-0tfsi-quattro-s-line-digital-line-assist",
    "price": {
      "amount": 16900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-09-1.webp",
        "alt": "Audi Q2 2.0TFSI  QUATTRO"
      },
      {
        "url": "/assets/excellent/vehicle-09-2.webp",
        "alt": "Audi Q2 2.0TFSI  QUATTRO"
      },
      {
        "url": "/assets/excellent/vehicle-09-3.webp",
        "alt": "Audi Q2 2.0TFSI  QUATTRO"
      },
      {
        "url": "/assets/excellent/vehicle-09-4.webp",
        "alt": "Audi Q2 2.0TFSI  QUATTRO"
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
      "model": "Q2 2.0TFSI  QUATTRO",
      "year": 2018,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 133000,
      "mileageUnit": "km",
      "enginePowerHp": 190,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:52.000Z",
    "promoted": false
  },
  {
    "id": "excellent-11768639133016485",
    "slug": "excellent-11768639133016485",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Dodge Challenger 5.7HEMI  SRT",
    "description": "Dodge Challenger 5.7HEMI  SRT, 2014 г., бензин, 65 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-11768639133016485-dodge-challenger-5-7hemi-srt",
    "price": {
      "amount": 21500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-10-1.webp",
        "alt": "Dodge Challenger 5.7HEMI  SRT"
      },
      {
        "url": "/assets/excellent/vehicle-10-2.webp",
        "alt": "Dodge Challenger 5.7HEMI  SRT"
      },
      {
        "url": "/assets/excellent/vehicle-10-3.webp",
        "alt": "Dodge Challenger 5.7HEMI  SRT"
      },
      {
        "url": "/assets/excellent/vehicle-10-4.webp",
        "alt": "Dodge Challenger 5.7HEMI  SRT"
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
      "make": "Dodge",
      "model": "Challenger 5.7HEMI  SRT",
      "year": 2014,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 65000,
      "mileageUnit": "km",
      "enginePowerHp": 380,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:51.000Z",
    "promoted": false
  },
  {
    "id": "excellent-21775914499512125",
    "slug": "excellent-21775914499512125",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "VW T-Cross 1.5i  AUTOMAT",
    "description": "VW T-Cross 1.5i  AUTOMAT, 2023 г., бензин, 48 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21775914499512125-vw-t-cross-1-5i-automat-48000km",
    "price": {
      "amount": 21990,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-11-1.webp",
        "alt": "VW T-Cross 1.5i  AUTOMAT"
      },
      {
        "url": "/assets/excellent/vehicle-11-2.webp",
        "alt": "VW T-Cross 1.5i  AUTOMAT"
      },
      {
        "url": "/assets/excellent/vehicle-11-3.webp",
        "alt": "VW T-Cross 1.5i  AUTOMAT"
      },
      {
        "url": "/assets/excellent/vehicle-11-4.webp",
        "alt": "VW T-Cross 1.5i  AUTOMAT"
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
      "model": "T-Cross 1.5i  AUTOMAT",
      "year": 2023,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 48000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Зелен"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:50.000Z",
    "promoted": false
  },
  {
    "id": "excellent-21785575816054903",
    "slug": "excellent-21785575816054903",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Kia Niro PLUG-IN-HYBRID",
    "description": "Kia Niro PLUG-IN-HYBRID, 2019 г., електрически, 118 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21785575816054903-kia-niro-plug-in-hybrid",
    "price": {
      "amount": 16990,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-12-1.webp",
        "alt": "Kia Niro PLUG-IN-HYBRID"
      },
      {
        "url": "/assets/excellent/vehicle-12-2.webp",
        "alt": "Kia Niro PLUG-IN-HYBRID"
      },
      {
        "url": "/assets/excellent/vehicle-12-3.webp",
        "alt": "Kia Niro PLUG-IN-HYBRID"
      },
      {
        "url": "/assets/excellent/vehicle-12-4.webp",
        "alt": "Kia Niro PLUG-IN-HYBRID"
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
      "make": "Kia",
      "model": "Niro PLUG-IN-HYBRID",
      "year": 2019,
      "bodyType": "hatchback",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 118000,
      "mileageUnit": "km",
      "enginePowerHp": 141,
      "colorExterior": ""
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:49.000Z",
    "promoted": false
  },
  {
    "id": "excellent-21773150110056507",
    "slug": "excellent-21773150110056507",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "BMW X3 2.0D  xDrive",
    "description": "BMW X3 2.0D  xDrive, 2014 г., дизел, 188 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21773150110056507-bmw-x3-2-0d-xdrive-m-pack",
    "price": {
      "amount": 12000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-13-1.webp",
        "alt": "BMW X3 2.0D  xDrive"
      },
      {
        "url": "/assets/excellent/vehicle-13-2.webp",
        "alt": "BMW X3 2.0D  xDrive"
      },
      {
        "url": "/assets/excellent/vehicle-13-3.webp",
        "alt": "BMW X3 2.0D  xDrive"
      },
      {
        "url": "/assets/excellent/vehicle-13-4.webp",
        "alt": "BMW X3 2.0D  xDrive"
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
      "model": "X3 2.0D  xDrive",
      "year": 2014,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 188000,
      "mileageUnit": "km",
      "enginePowerHp": 184,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:48.000Z",
    "promoted": false
  },
  {
    "id": "excellent-21785323501482685",
    "slug": "excellent-21785323501482685",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Nissan Juke 1.6Т  NISMO",
    "description": "Nissan Juke 1.6Т  NISMO, 2014 г., бензин, 186 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21785323501482685-nissan-juke-1-6t-nismo-alcantara",
    "price": {
      "amount": 9500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-14-1.webp",
        "alt": "Nissan Juke 1.6Т  NISMO"
      },
      {
        "url": "/assets/excellent/vehicle-14-2.webp",
        "alt": "Nissan Juke 1.6Т  NISMO"
      },
      {
        "url": "/assets/excellent/vehicle-14-3.webp",
        "alt": "Nissan Juke 1.6Т  NISMO"
      },
      {
        "url": "/assets/excellent/vehicle-14-4.webp",
        "alt": "Nissan Juke 1.6Т  NISMO"
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
      "make": "Nissan",
      "model": "Juke 1.6Т  NISMO",
      "year": 2014,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 186000,
      "mileageUnit": "km",
      "enginePowerHp": 200,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:47.000Z",
    "promoted": false
  },
  {
    "id": "excellent-11778320754806394",
    "slug": "excellent-11778320754806394",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Peugeot 308 1.6GT  205h.p",
    "description": "Peugeot 308 1.6GT  205h.p, 2016 г., бензин, 130 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-11778320754806394-peugeot-308-1-6gt-205h-p-panorama-massage",
    "price": {
      "amount": 9200,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-15-1.webp",
        "alt": "Peugeot 308 1.6GT  205h.p"
      },
      {
        "url": "/assets/excellent/vehicle-15-2.webp",
        "alt": "Peugeot 308 1.6GT  205h.p"
      },
      {
        "url": "/assets/excellent/vehicle-15-3.webp",
        "alt": "Peugeot 308 1.6GT  205h.p"
      },
      {
        "url": "/assets/excellent/vehicle-15-4.webp",
        "alt": "Peugeot 308 1.6GT  205h.p"
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
      "make": "Peugeot",
      "model": "308 1.6GT  205h.p",
      "year": 2016,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 130000,
      "mileageUnit": "km",
      "enginePowerHp": 205,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:46.000Z",
    "promoted": false
  },
  {
    "id": "excellent-21781781688732220",
    "slug": "excellent-21781781688732220",
    "category": "car",
    "dealerOrgId": "dealer-excellent-cars",
    "status": "active",
    "title": "Mazda CX-5 2.5i  4x4",
    "description": "Mazda CX-5 2.5i  4x4, 2015 г., бензин, 192 000 км. Данни от публикуваната обява. Потвърдете наличността, оборудването и условията с Excellent Cars. Не се начислява ДДС. Оригинална обява: https://excellent.mobile.bg/obiava-21781781688732220-mazda-cx-5-2-5i-4x4-automat-skyactiv",
    "price": {
      "amount": 14990,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/excellent/vehicle-16-1.webp",
        "alt": "Mazda CX-5 2.5i  4x4"
      },
      {
        "url": "/assets/excellent/vehicle-16-2.webp",
        "alt": "Mazda CX-5 2.5i  4x4"
      },
      {
        "url": "/assets/excellent/vehicle-16-3.webp",
        "alt": "Mazda CX-5 2.5i  4x4"
      },
      {
        "url": "/assets/excellent/vehicle-16-4.webp",
        "alt": "Mazda CX-5 2.5i  4x4"
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
      "make": "Mazda",
      "model": "CX-5 2.5i  4x4",
      "year": 2015,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 192000,
      "mileageUnit": "km",
      "enginePowerHp": 190,
      "colorExterior": "Бордо"
    },
    "seller": {
      "id": "dealer-excellent-cars",
      "type": "dealer",
      "displayName": "Excellent Cars",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T07:59:45.000Z",
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
