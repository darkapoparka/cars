import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

// Local preview snapshot. publishedAt is snapshot ordering time, not the source advert publication date.
export const mockListings: VehicleListing[] = [
  {
    "id": "11783754278742708",
    "slug": "toyota-yaris-742708",
    "category": "car",
    "dealerOrgId": "dealer-kg-team-auto",
    "status": "active",
    "title": "Toyota Yaris 1.33I 116000KM 6-SPEED SWISS EDITION",
    "description": "Примерни обяви към 09.09.2026 г. Не са жив каталог. Потвърдете цена, наличност и данни с продавача. Източник: https://team-auto.mobile.bg/obiava-11783754278742708-toyota-yaris-1-33i-116000km-6-speed-swiss-edition",
    "price": {
      "amount": 7500.0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/11783754278742708-1.webp",
        "alt": "Toyota Yaris 1.33I 116000KM 6-SPEED SWISS EDITION — снимка от обявата"
      },
      {
        "url": "/dealer/11783754278742708-2.webp",
        "alt": "Toyota Yaris 1.33I 116000KM 6-SPEED SWISS EDITION — снимка от обявата"
      },
      {
        "url": "/dealer/11783754278742708-3.webp",
        "alt": "Toyota Yaris 1.33I 116000KM 6-SPEED SWISS EDITION — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
      "country": "България"
    },
    "features": [
      {
        "bg": "Навигация",
        "en": "Навигация"
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
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Климатик",
        "en": "Климатик"
      }
    ],
    "spec": {
      "make": "Toyota",
      "model": "Yaris",
      "trim": "1.33I 116000KM 6-SPEED SWISS EDITION",
      "year": 2014,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 116000,
      "mileageUnit": "km",
      "enginePowerHp": 99,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-kg-team-auto",
      "type": "dealer",
      "displayName": "K-G Team Auto",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "21785829117309786",
    "slug": "nissan-qashqai-309786",
    "category": "car",
    "dealerOrgId": "dealer-kg-team-auto",
    "status": "active",
    "title": "Nissan Qashqai 2.0i 131000KM AUTOMATIC",
    "description": "Примерни обяви към 09.09.2026 г. Не са жив каталог. Потвърдете цена, наличност и данни с продавача. Източник: https://team-auto.mobile.bg/obiava-21785829117309786-nissan-qashqai-2-0i-131000km-automatic",
    "price": {
      "amount": 7700.0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/21785829117309786-1.webp",
        "alt": "Nissan Qashqai 2.0i 131000KM AUTOMATIC — снимка от обявата"
      },
      {
        "url": "/dealer/21785829117309786-2.webp",
        "alt": "Nissan Qashqai 2.0i 131000KM AUTOMATIC — снимка от обявата"
      },
      {
        "url": "/dealer/21785829117309786-3.webp",
        "alt": "Nissan Qashqai 2.0i 131000KM AUTOMATIC — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
      "country": "България"
    },
    "features": [
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
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
        "bg": "Климатроник",
        "en": "Климатроник"
      }
    ],
    "spec": {
      "make": "Nissan",
      "model": "Qashqai",
      "trim": "2.0i 131000KM AUTOMATIC",
      "year": 2014,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 131000,
      "mileageUnit": "km",
      "enginePowerHp": 141,
      "colorExterior": "Перла"
    },
    "seller": {
      "id": "dealer-kg-team-auto",
      "type": "dealer",
      "displayName": "K-G Team Auto",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "11678716951277480",
    "slug": "mitsubishi-colt-277480",
    "category": "car",
    "dealerOrgId": "dealer-kg-team-auto",
    "status": "active",
    "title": "Mitsubishi Colt 1.5 I SWISS",
    "description": "Примерни обяви към 09.09.2026 г. Не са жив каталог. Потвърдете цена, наличност и данни с продавача. Източник: https://team-auto.mobile.bg/obiava-11678716951277480-mitsubishi-colt-1-5-i-swiss",
    "price": {
      "amount": 2700.0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/11678716951277480-1.webp",
        "alt": "Mitsubishi Colt 1.5 I SWISS — снимка от обявата"
      },
      {
        "url": "/dealer/11678716951277480-2.webp",
        "alt": "Mitsubishi Colt 1.5 I SWISS — снимка от обявата"
      },
      {
        "url": "/dealer/11678716951277480-3.webp",
        "alt": "Mitsubishi Colt 1.5 I SWISS — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
      "country": "България"
    },
    "features": [
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Климатик",
        "en": "Климатик"
      }
    ],
    "spec": {
      "make": "Mitsubishi",
      "model": "Colt",
      "trim": "1.5 I SWISS",
      "year": 2007,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 189000,
      "mileageUnit": "km",
      "enginePowerHp": 109,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-kg-team-auto",
      "type": "dealer",
      "displayName": "K-G Team Auto",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "11773570472954394",
    "slug": "mini-cooper-954394",
    "category": "car",
    "dealerOrgId": "dealer-kg-team-auto",
    "status": "active",
    "title": "Mini Cooper 1.6i 153000km EURO-5 75PS.",
    "description": "Примерни обяви към 09.09.2026 г. Не са жив каталог. Потвърдете цена, наличност и данни с продавача. Източник: https://team-auto.mobile.bg/obiava-11773570472954394-mini-cooper-1-6i-153000km-euro-5-75ps",
    "price": {
      "amount": 4950.0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/11773570472954394-1.webp",
        "alt": "Mini Cooper 1.6i 153000km EURO-5 75PS. — снимка от обявата"
      },
      {
        "url": "/dealer/11773570472954394-2.webp",
        "alt": "Mini Cooper 1.6i 153000km EURO-5 75PS. — снимка от обявата"
      },
      {
        "url": "/dealer/11773570472954394-3.webp",
        "alt": "Mini Cooper 1.6i 153000km EURO-5 75PS. — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
      "country": "България"
    },
    "features": [
      {
        "bg": "Парктроник",
        "en": "Парктроник"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      }
    ],
    "spec": {
      "make": "Mini",
      "model": "Cooper",
      "trim": "1.6i 153000km EURO-5 75PS.",
      "year": 2013,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 153000,
      "mileageUnit": "km",
      "enginePowerHp": 75,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-kg-team-auto",
      "type": "dealer",
      "displayName": "K-G Team Auto",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "11780222156478967",
    "slug": "honda-jazz-478967",
    "category": "car",
    "dealerOrgId": "dealer-kg-team-auto",
    "status": "active",
    "title": "Honda Jazz 1.4-SI AUTOMATIC SPORT EDITION",
    "description": "Примерни обяви към 09.09.2026 г. Не са жив каталог. Потвърдете цена, наличност и данни с продавача. Източник: https://team-auto.mobile.bg/obiava-11780222156478967-honda-jazz-1-4-si-automatic-sport-edition",
    "price": {
      "amount": 7950.0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/11780222156478967-1.webp",
        "alt": "Honda Jazz 1.4-SI AUTOMATIC SPORT EDITION — снимка от обявата"
      },
      {
        "url": "/dealer/11780222156478967-2.webp",
        "alt": "Honda Jazz 1.4-SI AUTOMATIC SPORT EDITION — снимка от обявата"
      },
      {
        "url": "/dealer/11780222156478967-3.webp",
        "alt": "Honda Jazz 1.4-SI AUTOMATIC SPORT EDITION — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
      "country": "България"
    },
    "features": [
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      }
    ],
    "spec": {
      "make": "Honda",
      "model": "Jazz",
      "trim": "1.4-SI AUTOMATIC SPORT EDITION",
      "year": 2013,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 145000,
      "mileageUnit": "km",
      "enginePowerHp": 99,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-kg-team-auto",
      "type": "dealer",
      "displayName": "K-G Team Auto",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "21788253346975689",
    "slug": "honda-cr-v-975689",
    "category": "car",
    "dealerOrgId": "dealer-kg-team-auto",
    "status": "active",
    "title": "Honda Cr-v 2.2 I-CTDI 177000KM EXECUTIV",
    "description": "Примерни обяви към 09.09.2026 г. Не са жив каталог. Потвърдете цена, наличност и данни с продавача. Източник: https://team-auto.mobile.bg/obiava-21788253346975689-honda-cr-v-2-2-i-ctdi-177000km-executiv",
    "price": {
      "amount": 7500.0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/21788253346975689-1.webp",
        "alt": "Honda Cr-v 2.2 I-CTDI 177000KM EXECUTIV — снимка от обявата"
      },
      {
        "url": "/dealer/21788253346975689-2.webp",
        "alt": "Honda Cr-v 2.2 I-CTDI 177000KM EXECUTIV — снимка от обявата"
      },
      {
        "url": "/dealer/21788253346975689-3.webp",
        "alt": "Honda Cr-v 2.2 I-CTDI 177000KM EXECUTIV — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
      "country": "България"
    },
    "features": [
      {
        "bg": "Навигация",
        "en": "Навигация"
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
        "bg": "4x4",
        "en": "4x4"
      },
      {
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Подгряване на седалките",
        "en": "Подгряване на седалките"
      }
    ],
    "spec": {
      "make": "Honda",
      "model": "Cr-v",
      "trim": "2.2 I-CTDI 177000KM EXECUTIV",
      "year": 2009,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 177000,
      "mileageUnit": "km",
      "enginePowerHp": 140,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-kg-team-auto",
      "type": "dealer",
      "displayName": "K-G Team Auto",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "11782979504874945",
    "slug": "vw-golf-874945",
    "category": "car",
    "dealerOrgId": "dealer-kg-team-auto",
    "status": "active",
    "title": "VW Golf VI-TDI SWISS EDITION 6-SPEED 4X4",
    "description": "Примерни обяви към 09.09.2026 г. Не са жив каталог. Потвърдете цена, наличност и данни с продавача. Източник: https://team-auto.mobile.bg/obiava-11782979504874945-vw-golf-vi-tdi-swiss-edition-6-speed-4x4",
    "price": {
      "amount": 5999.0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/11782979504874945-1.webp",
        "alt": "VW Golf VI-TDI SWISS EDITION 6-SPEED 4X4 — снимка от обявата"
      },
      {
        "url": "/dealer/11782979504874945-2.webp",
        "alt": "VW Golf VI-TDI SWISS EDITION 6-SPEED 4X4 — снимка от обявата"
      },
      {
        "url": "/dealer/11782979504874945-3.webp",
        "alt": "VW Golf VI-TDI SWISS EDITION 6-SPEED 4X4 — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
      "country": "България"
    },
    "features": [
      {
        "bg": "Парктроник",
        "en": "Парктроник"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
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
        "bg": "Климатик",
        "en": "Климатик"
      }
    ],
    "spec": {
      "make": "VW",
      "model": "Golf",
      "trim": "VI-TDI SWISS EDITION 6-SPEED 4X4",
      "year": 2013,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 197000,
      "mileageUnit": "km",
      "enginePowerHp": 105,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-kg-team-auto",
      "type": "dealer",
      "displayName": "K-G Team Auto",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "11778753257201470",
    "slug": "toyota-auris-201470",
    "category": "car",
    "dealerOrgId": "dealer-kg-team-auto",
    "status": "active",
    "title": "Toyota Auris 1.8 HSD 181000KM EURO5",
    "description": "Примерни обяви към 09.09.2026 г. Не са жив каталог. Потвърдете цена, наличност и данни с продавача. Източник: https://team-auto.mobile.bg/obiava-11778753257201470-toyota-auris-1-8-hsd-181000km-euro5",
    "price": {
      "amount": 7500.0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/11778753257201470-1.webp",
        "alt": "Toyota Auris 1.8 HSD 181000KM EURO5 — снимка от обявата"
      },
      {
        "url": "/dealer/11778753257201470-2.webp",
        "alt": "Toyota Auris 1.8 HSD 181000KM EURO5 — снимка от обявата"
      },
      {
        "url": "/dealer/11778753257201470-3.webp",
        "alt": "Toyota Auris 1.8 HSD 181000KM EURO5 — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
      "country": "България"
    },
    "features": [
      {
        "bg": "Навигация",
        "en": "Навигация"
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
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Подгряване на седалките",
        "en": "Подгряване на седалките"
      }
    ],
    "spec": {
      "make": "Toyota",
      "model": "Auris",
      "trim": "1.8 HSD 181000KM EURO5",
      "year": 2011,
      "bodyType": "hatchback",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 181000,
      "mileageUnit": "km",
      "enginePowerHp": 99,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-kg-team-auto",
      "type": "dealer",
      "displayName": "K-G Team Auto",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "11777536762184091",
    "slug": "suzuki-swift-184091",
    "category": "car",
    "dealerOrgId": "dealer-kg-team-auto",
    "status": "active",
    "title": "Suzuki Swift 1.3i 151000km. SWISS EDITION",
    "description": "Примерни обяви към 09.09.2026 г. Не са жив каталог. Потвърдете цена, наличност и данни с продавача. Източник: https://team-auto.mobile.bg/obiava-11777536762184091-suzuki-swift-1-3i-151000km-swiss-edition",
    "price": {
      "amount": 4500.0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/11777536762184091-1.webp",
        "alt": "Suzuki Swift 1.3i 151000km. SWISS EDITION — снимка от обявата"
      },
      {
        "url": "/dealer/11777536762184091-2.webp",
        "alt": "Suzuki Swift 1.3i 151000km. SWISS EDITION — снимка от обявата"
      },
      {
        "url": "/dealer/11777536762184091-3.webp",
        "alt": "Suzuki Swift 1.3i 151000km. SWISS EDITION — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
      "country": "България"
    },
    "features": [
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Климатик",
        "en": "Климатик"
      }
    ],
    "spec": {
      "make": "Suzuki",
      "model": "Swift",
      "trim": "1.3i 151000km. SWISS EDITION",
      "year": 2010,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 151000,
      "mileageUnit": "km",
      "enginePowerHp": 92,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-kg-team-auto",
      "type": "dealer",
      "displayName": "K-G Team Auto",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "11701247770704576",
    "slug": "subaru-impreza-704576",
    "category": "car",
    "dealerOrgId": "dealer-kg-team-auto",
    "status": "active",
    "title": "Subaru Impreza 2.0i SWISS EDITION",
    "description": "Примерни обяви към 09.09.2026 г. Не са жив каталог. Потвърдете цена, наличност и данни с продавача. Източник: https://team-auto.mobile.bg/obiava-11701247770704576-subaru-impreza-2-0i-swiss-edition",
    "price": {
      "amount": 3300.0,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/11701247770704576-1.webp",
        "alt": "Subaru Impreza 2.0i SWISS EDITION — снимка от обявата"
      },
      {
        "url": "/dealer/11701247770704576-2.webp",
        "alt": "Subaru Impreza 2.0i SWISS EDITION — снимка от обявата"
      },
      {
        "url": "/dealer/11701247770704576-3.webp",
        "alt": "Subaru Impreza 2.0i SWISS EDITION — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
      "country": "България"
    },
    "features": [
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "4x4",
        "en": "4x4"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Подгряване на седалките",
        "en": "Подгряване на седалките"
      }
    ],
    "spec": {
      "make": "Subaru",
      "model": "Impreza",
      "trim": "2.0i SWISS EDITION",
      "year": 2007,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 207000,
      "mileageUnit": "km",
      "enginePowerHp": 160,
      "colorExterior": "Светло сив"
    },
    "seller": {
      "id": "dealer-kg-team-auto",
      "type": "dealer",
      "displayName": "K-G Team Auto",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo.png"
    },
    "publishedAt": "2026-09-09T00:00:00.000Z",
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
