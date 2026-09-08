import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "automarket-11785576029711434",
    "slug": "automarket-11785576029711434",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Ford Focus 1.6D 115HP",
    "description": "Ford Focus 1.6D 115HP, 2014 г., 249 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-11785576029711434-ford-focus-1-6d-115hp",
    "price": {
      "amount": 5112,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-01-1.webp",
        "alt": "Ford Focus 1.6D 115HP"
      },
      {
        "url": "/assets/automarket/vehicle-01-2.webp",
        "alt": "Ford Focus 1.6D 115HP"
      },
      {
        "url": "/assets/automarket/vehicle-01-3.webp",
        "alt": "Ford Focus 1.6D 115HP"
      },
      {
        "url": "/assets/automarket/vehicle-01-4.webp",
        "alt": "Ford Focus 1.6D 115HP"
      },
      {
        "url": "/assets/automarket/vehicle-01-5.webp",
        "alt": "Ford Focus 1.6D 115HP"
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
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
        "bg": "Бартер",
        "en": "Бартер"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
      },
      {
        "bg": "Ел. Огледала",
        "en": "Ел. Огледала"
      },
      {
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
      },
      {
        "bg": "Сензор за дъжд",
        "en": "Сензор за дъжд"
      },
      {
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Ford",
      "model": "Focus 1.6D 115HP",
      "year": 2014,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 249000,
      "mileageUnit": "km",
      "enginePowerHp": 115,
      "colorExterior": "Светло сив"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T10:00:00.000Z",
    "promoted": false
  },
  {
    "id": "automarket-11714813323555032",
    "slug": "automarket-11714813323555032",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Opel Astra 1.4i 90HP",
    "description": "Opel Astra 1.4i 90HP, 2006 г., 208 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-11714813323555032-opel-astra-1-4i-90hp",
    "price": {
      "amount": 2555.95,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-02-1.webp",
        "alt": "Opel Astra 1.4i 90HP"
      },
      {
        "url": "/assets/automarket/vehicle-02-2.webp",
        "alt": "Opel Astra 1.4i 90HP"
      },
      {
        "url": "/assets/automarket/vehicle-02-3.webp",
        "alt": "Opel Astra 1.4i 90HP"
      },
      {
        "url": "/assets/automarket/vehicle-02-4.webp",
        "alt": "Opel Astra 1.4i 90HP"
      },
      {
        "url": "/assets/automarket/vehicle-02-5.webp",
        "alt": "Opel Astra 1.4i 90HP"
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
        "bg": "Бартер",
        "en": "Бартер"
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
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатик",
        "en": "Климатик"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Напълно обслужен",
        "en": "Напълно обслужен"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
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
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Opel",
      "model": "Astra 1.4i 90HP",
      "year": 2006,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 208000,
      "mileageUnit": "km",
      "enginePowerHp": 90,
      "colorExterior": "Графит"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:59.000Z",
    "promoted": false
  },
  {
    "id": "automarket-11776340911802527",
    "slug": "automarket-11776340911802527",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Opel Corsa 1.2i 80HP GPL",
    "description": "Opel Corsa 1.2i 80HP GPL, 2009 г., 165 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-11776340911802527-opel-corsa-1-2i-80hp-gpl",
    "price": {
      "amount": 2999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-03-1.webp",
        "alt": "Opel Corsa 1.2i 80HP GPL"
      },
      {
        "url": "/assets/automarket/vehicle-03-2.webp",
        "alt": "Opel Corsa 1.2i 80HP GPL"
      },
      {
        "url": "/assets/automarket/vehicle-03-3.webp",
        "alt": "Opel Corsa 1.2i 80HP GPL"
      },
      {
        "url": "/assets/automarket/vehicle-03-4.webp",
        "alt": "Opel Corsa 1.2i 80HP GPL"
      },
      {
        "url": "/assets/automarket/vehicle-03-5.webp",
        "alt": "Opel Corsa 1.2i 80HP GPL"
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
        "bg": "Бартер",
        "en": "Бартер"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатик",
        "en": "Климатик"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
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
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Opel",
      "model": "Corsa 1.2i 80HP GPL",
      "year": 2009,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 165000,
      "mileageUnit": "km",
      "enginePowerHp": 80,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:58.000Z",
    "promoted": false
  },
  {
    "id": "automarket-11749035353735625",
    "slug": "automarket-11749035353735625",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Ford Fiesta 1.25i 82HP FACE LIFT",
    "description": "Ford Fiesta 1.25i 82HP FACE LIFT, 2012 г., 227 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-11749035353735625-ford-fiesta-1-25i-82hp-face-lift",
    "price": {
      "amount": 3799,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-04-1.webp",
        "alt": "Ford Fiesta 1.25i 82HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-04-2.webp",
        "alt": "Ford Fiesta 1.25i 82HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-04-3.webp",
        "alt": "Ford Fiesta 1.25i 82HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-04-4.webp",
        "alt": "Ford Fiesta 1.25i 82HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-04-5.webp",
        "alt": "Ford Fiesta 1.25i 82HP FACE LIFT"
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бартер",
        "en": "Бартер"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
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
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Ford",
      "model": "Fiesta 1.25i 82HP FACE LIFT",
      "year": 2012,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 227000,
      "mileageUnit": "km",
      "enginePowerHp": 82,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:57.000Z",
    "promoted": false
  },
  {
    "id": "automarket-11646385836417474",
    "slug": "automarket-11646385836417474",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Honda Jazz 1.4 I-VTEC 99HP FACE LIFT",
    "description": "Honda Jazz 1.4 I-VTEC 99HP FACE LIFT, 2009 г., 197 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-11646385836417474-honda-jazz-1-4-i-vtec-99hp-face-lift",
    "price": {
      "amount": 3885.31,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-05-1.webp",
        "alt": "Honda Jazz 1.4 I-VTEC 99HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-05-2.webp",
        "alt": "Honda Jazz 1.4 I-VTEC 99HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-05-3.webp",
        "alt": "Honda Jazz 1.4 I-VTEC 99HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-05-4.webp",
        "alt": "Honda Jazz 1.4 I-VTEC 99HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-05-5.webp",
        "alt": "Honda Jazz 1.4 I-VTEC 99HP FACE LIFT"
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
        "bg": "Бартер",
        "en": "Бартер"
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
      },
      {
        "bg": "Ел. Стъкла",
        "en": "Ел. Стъкла"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Honda",
      "model": "Jazz 1.4 I-VTEC 99HP FACE LIFT",
      "year": 2009,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 197000,
      "mileageUnit": "km",
      "enginePowerHp": 99,
      "colorExterior": "Жълт"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:56.000Z",
    "promoted": false
  },
  {
    "id": "automarket-11730904111658789",
    "slug": "automarket-11730904111658789",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Opel Meriva 1.4 TURBO 120HP GPL",
    "description": "Opel Meriva 1.4 TURBO 120HP GPL, 2012 г., 156 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-11730904111658789-opel-meriva-1-4-turbo-120hp-gpl",
    "price": {
      "amount": 4499,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-06-1.webp",
        "alt": "Opel Meriva 1.4 TURBO 120HP GPL"
      },
      {
        "url": "/assets/automarket/vehicle-06-2.webp",
        "alt": "Opel Meriva 1.4 TURBO 120HP GPL"
      },
      {
        "url": "/assets/automarket/vehicle-06-3.webp",
        "alt": "Opel Meriva 1.4 TURBO 120HP GPL"
      },
      {
        "url": "/assets/automarket/vehicle-06-4.webp",
        "alt": "Opel Meriva 1.4 TURBO 120HP GPL"
      },
      {
        "url": "/assets/automarket/vehicle-06-5.webp",
        "alt": "Opel Meriva 1.4 TURBO 120HP GPL"
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
        "bg": "Бартер",
        "en": "Бартер"
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
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатик",
        "en": "Климатик"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
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
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Opel",
      "model": "Meriva 1.4 TURBO 120HP GPL",
      "year": 2012,
      "bodyType": "van",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 156000,
      "mileageUnit": "km",
      "enginePowerHp": 120,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:55.000Z",
    "promoted": false
  },
  {
    "id": "automarket-11664339654646848",
    "slug": "automarket-11664339654646848",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "VW Golf 1.6TDI 105HP DSG",
    "description": "VW Golf 1.6TDI 105HP DSG, 2010 г., 213 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-11664339654646848-vw-golf-1-6tdi-105hp-dsg",
    "price": {
      "amount": 4999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-07-1.webp",
        "alt": "VW Golf 1.6TDI 105HP DSG"
      },
      {
        "url": "/assets/automarket/vehicle-07-2.webp",
        "alt": "VW Golf 1.6TDI 105HP DSG"
      },
      {
        "url": "/assets/automarket/vehicle-07-3.webp",
        "alt": "VW Golf 1.6TDI 105HP DSG"
      },
      {
        "url": "/assets/automarket/vehicle-07-4.webp",
        "alt": "VW Golf 1.6TDI 105HP DSG"
      },
      {
        "url": "/assets/automarket/vehicle-07-5.webp",
        "alt": "VW Golf 1.6TDI 105HP DSG"
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
        "bg": "Бартер",
        "en": "Бартер"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
        "bg": "Дълга база",
        "en": "Дълга база"
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
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатик",
        "en": "Климатик"
      },
      {
        "bg": "Кожен салон",
        "en": "Кожен салон"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
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
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "VW",
      "model": "Golf 1.6TDI 105HP DSG",
      "year": 2010,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 213000,
      "mileageUnit": "km",
      "enginePowerHp": 105,
      "colorExterior": "Графит"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:54.000Z",
    "promoted": false
  },
  {
    "id": "automarket-21702843989932817",
    "slug": "automarket-21702843989932817",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Nissan Qashqai 1.6i 117HP FACE LIFT",
    "description": "Nissan Qashqai 1.6i 117HP FACE LIFT, 2011 г., 223 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-21702843989932817-nissan-qashqai-1-6i-117hp-face-lift",
    "price": {
      "amount": 5799,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-08-1.webp",
        "alt": "Nissan Qashqai 1.6i 117HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-08-2.webp",
        "alt": "Nissan Qashqai 1.6i 117HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-08-3.webp",
        "alt": "Nissan Qashqai 1.6i 117HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-08-4.webp",
        "alt": "Nissan Qashqai 1.6i 117HP FACE LIFT"
      },
      {
        "url": "/assets/automarket/vehicle-08-5.webp",
        "alt": "Nissan Qashqai 1.6i 117HP FACE LIFT"
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
        "bg": "Бартер",
        "en": "Бартер"
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
        "bg": "Дълга база",
        "en": "Дълга база"
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
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
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
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Теглич",
        "en": "Теглич"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Nissan",
      "model": "Qashqai 1.6i 117HP FACE LIFT",
      "year": 2011,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 223000,
      "mileageUnit": "km",
      "enginePowerHp": 117,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:53.000Z",
    "promoted": false
  },
  {
    "id": "automarket-21777122320477562",
    "slug": "automarket-21777122320477562",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Dacia Duster 1.5DCI 110HP AWD E5A",
    "description": "Dacia Duster 1.5DCI 110HP AWD E5A, 2011 г., 232 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-21777122320477562-dacia-duster-1-5dci-110hp-awd-e5a",
    "price": {
      "amount": 5799,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-09-1.webp",
        "alt": "Dacia Duster 1.5DCI 110HP AWD E5A"
      },
      {
        "url": "/assets/automarket/vehicle-09-2.webp",
        "alt": "Dacia Duster 1.5DCI 110HP AWD E5A"
      },
      {
        "url": "/assets/automarket/vehicle-09-3.webp",
        "alt": "Dacia Duster 1.5DCI 110HP AWD E5A"
      },
      {
        "url": "/assets/automarket/vehicle-09-4.webp",
        "alt": "Dacia Duster 1.5DCI 110HP AWD E5A"
      },
      {
        "url": "/assets/automarket/vehicle-09-5.webp",
        "alt": "Dacia Duster 1.5DCI 110HP AWD E5A"
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "4x4",
        "en": "4x4"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "OFFROAD пакет",
        "en": "OFFROAD пакет"
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
        "bg": "Бартер",
        "en": "Бартер"
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
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатик",
        "en": "Климатик"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
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
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Dacia",
      "model": "Duster 1.5DCI 110HP AWD E5A",
      "year": 2011,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 232000,
      "mileageUnit": "km",
      "enginePowerHp": 110,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:52.000Z",
    "promoted": false
  },
  {
    "id": "automarket-21777123440688076",
    "slug": "automarket-21777123440688076",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Mazda CX-3 1.5D SKYACTIV 105HP AWD AUTO",
    "description": "Mazda CX-3 1.5D SKYACTIV 105HP AWD AUTO, 2016 г., 155 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-21777123440688076-mazda-cx-3-1-5d-skyactiv-105hp-awd-auto",
    "price": {
      "amount": 9999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-10-1.webp",
        "alt": "Mazda CX-3 1.5D SKYACTIV 105HP AWD AUTO"
      },
      {
        "url": "/assets/automarket/vehicle-10-2.webp",
        "alt": "Mazda CX-3 1.5D SKYACTIV 105HP AWD AUTO"
      },
      {
        "url": "/assets/automarket/vehicle-10-3.webp",
        "alt": "Mazda CX-3 1.5D SKYACTIV 105HP AWD AUTO"
      },
      {
        "url": "/assets/automarket/vehicle-10-4.webp",
        "alt": "Mazda CX-3 1.5D SKYACTIV 105HP AWD AUTO"
      },
      {
        "url": "/assets/automarket/vehicle-10-5.webp",
        "alt": "Mazda CX-3 1.5D SKYACTIV 105HP AWD AUTO"
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "4x4",
        "en": "4x4"
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
        "bg": "LED фарове",
        "en": "LED фарове"
      },
      {
        "bg": "Steptronic",
        "en": "Steptronic"
      },
      {
        "bg": "Tiptronic",
        "en": "Tiptronic"
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
        "bg": "Адаптивни предни светлини",
        "en": "Адаптивни предни светлини"
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
        "bg": "Бартер",
        "en": "Бартер"
      },
      {
        "bg": "Безключово палене ",
        "en": "Безключово палене "
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
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Ксенонови фарове",
        "en": "Ксенонови фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
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
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
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
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
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
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Mazda",
      "model": "CX-3 1.5D SKYACTIV 105HP AWD AUTO",
      "year": 2016,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 155000,
      "mileageUnit": "km",
      "enginePowerHp": 105,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:51.000Z",
    "promoted": false
  },
  {
    "id": "automarket-11764611602990623",
    "slug": "automarket-11764611602990623",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "VW Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic",
    "description": "VW Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic, 2016 г., 207 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-11764611602990623-vw-passat-2-0tdi-190hp-4-motion-keyless-go-automatic",
    "price": {
      "amount": 12399,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-11-1.webp",
        "alt": "VW Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic"
      },
      {
        "url": "/assets/automarket/vehicle-11-2.webp",
        "alt": "VW Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic"
      },
      {
        "url": "/assets/automarket/vehicle-11-3.webp",
        "alt": "VW Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic"
      },
      {
        "url": "/assets/automarket/vehicle-11-4.webp",
        "alt": "VW Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic"
      },
      {
        "url": "/assets/automarket/vehicle-11-5.webp",
        "alt": "VW Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic"
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "4x4",
        "en": "4x4"
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
        "bg": "LED фарове",
        "en": "LED фарове"
      },
      {
        "bg": "Steptronic",
        "en": "Steptronic"
      },
      {
        "bg": "Tiptronic",
        "en": "Tiptronic"
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
        "bg": "Адаптивни предни светлини",
        "en": "Адаптивни предни светлини"
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
        "bg": "Бартер",
        "en": "Бартер"
      },
      {
        "bg": "Безключово палене ",
        "en": "Безключово палене "
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Ксенонови фарове",
        "en": "Ксенонови фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
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
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
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
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за измиване на фаровете",
        "en": "Система за измиване на фаровете"
      },
      {
        "bg": "Система за контрол на дистанцията",
        "en": "Система за контрол на дистанцията"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "VW",
      "model": "Passat 2.0TDI 190HP 4-Motion Keyless Go Automatic",
      "year": 2016,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 207000,
      "mileageUnit": "km",
      "enginePowerHp": 190,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:50.000Z",
    "promoted": false
  },
  {
    "id": "automarket-11770373711900410",
    "slug": "automarket-11770373711900410",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Suzuki Swift 1.2 HYBRID 83HP AUTOMATIC",
    "description": "Suzuki Swift 1.2 HYBRID 83HP AUTOMATIC, 2021 г., 39 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-11770373711900410-suzuki-swift-1-2-hybrid-83hp-automatic",
    "price": {
      "amount": 12781,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-12-1.webp",
        "alt": "Suzuki Swift 1.2 HYBRID 83HP AUTOMATIC"
      },
      {
        "url": "/assets/automarket/vehicle-12-2.webp",
        "alt": "Suzuki Swift 1.2 HYBRID 83HP AUTOMATIC"
      },
      {
        "url": "/assets/automarket/vehicle-12-3.webp",
        "alt": "Suzuki Swift 1.2 HYBRID 83HP AUTOMATIC"
      },
      {
        "url": "/assets/automarket/vehicle-12-4.webp",
        "alt": "Suzuki Swift 1.2 HYBRID 83HP AUTOMATIC"
      },
      {
        "url": "/assets/automarket/vehicle-12-5.webp",
        "alt": "Suzuki Swift 1.2 HYBRID 83HP AUTOMATIC"
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
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
        "bg": "LED фарове",
        "en": "LED фарове"
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
        "bg": "Бартер",
        "en": "Бартер"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
      },
      {
        "bg": "Бързи \\ бавни скорости",
        "en": "Бързи \\ бавни скорости"
      },
      {
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
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
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Suzuki",
      "model": "Swift 1.2 HYBRID 83HP AUTOMATIC",
      "year": 2021,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 39000,
      "mileageUnit": "km",
      "enginePowerHp": 83,
      "colorExterior": "Бордо"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:49.000Z",
    "promoted": false
  },
  {
    "id": "automarket-21732197261233954",
    "slug": "automarket-21732197261233954",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "BMW X3 2.0 X-Drive 184HP",
    "description": "BMW X3 2.0 X-Drive 184HP, 2014 г., 249 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-21732197261233954-bmw-x3-2-0-x-drive-184hp",
    "price": {
      "amount": 12526,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-13-1.webp",
        "alt": "BMW X3 2.0 X-Drive 184HP"
      },
      {
        "url": "/assets/automarket/vehicle-13-2.webp",
        "alt": "BMW X3 2.0 X-Drive 184HP"
      },
      {
        "url": "/assets/automarket/vehicle-13-3.webp",
        "alt": "BMW X3 2.0 X-Drive 184HP"
      },
      {
        "url": "/assets/automarket/vehicle-13-4.webp",
        "alt": "BMW X3 2.0 X-Drive 184HP"
      },
      {
        "url": "/assets/automarket/vehicle-13-5.webp",
        "alt": "BMW X3 2.0 X-Drive 184HP"
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "4x4",
        "en": "4x4"
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
        "bg": "LED фарове",
        "en": "LED фарове"
      },
      {
        "bg": "Steptronic",
        "en": "Steptronic"
      },
      {
        "bg": "Tiptronic",
        "en": "Tiptronic"
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
        "bg": "Адаптивни предни светлини",
        "en": "Адаптивни предни светлини"
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
        "bg": "Бартер",
        "en": "Бартер"
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
      },
      {
        "bg": "Въздушни възглавници - Странични",
        "en": "Въздушни възглавници - Странични"
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
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Кожен салон",
        "en": "Кожен салон"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Ксенонови фарове",
        "en": "Ксенонови фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
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
        "bg": "Напълно обслужен",
        "en": "Напълно обслужен"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
      },
      {
        "bg": "С регистрация",
        "en": "С регистрация"
      },
      {
        "bg": "Сензор за дъжд",
        "en": "Сензор за дъжд"
      },
      {
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за измиване на фаровете",
        "en": "Система за измиване на фаровете"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Теглич",
        "en": "Теглич"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "BMW",
      "model": "X3 2.0 X-Drive 184HP",
      "year": 2014,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 249000,
      "mileageUnit": "km",
      "enginePowerHp": 184,
      "colorExterior": "Тъмно син мет."
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:48.000Z",
    "promoted": false
  },
  {
    "id": "automarket-21781689983828599",
    "slug": "automarket-21781689983828599",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "VW Tiguan 2.0TDI 200HP ALLSPACE 4-Motion",
    "description": "VW Tiguan 2.0TDI 200HP ALLSPACE 4-Motion, 2023 г., 147 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-21781689983828599-vw-tiguan-2-0tdi-200hp-allspace-4-motion",
    "price": {
      "amount": 24999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-14-1.webp",
        "alt": "VW Tiguan 2.0TDI 200HP ALLSPACE 4-Motion"
      },
      {
        "url": "/assets/automarket/vehicle-14-2.webp",
        "alt": "VW Tiguan 2.0TDI 200HP ALLSPACE 4-Motion"
      },
      {
        "url": "/assets/automarket/vehicle-14-3.webp",
        "alt": "VW Tiguan 2.0TDI 200HP ALLSPACE 4-Motion"
      },
      {
        "url": "/assets/automarket/vehicle-14-4.webp",
        "alt": "VW Tiguan 2.0TDI 200HP ALLSPACE 4-Motion"
      },
      {
        "url": "/assets/automarket/vehicle-14-5.webp",
        "alt": "VW Tiguan 2.0TDI 200HP ALLSPACE 4-Motion"
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "4x4",
        "en": "4x4"
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
        "bg": "LED фарове",
        "en": "LED фарове"
      },
      {
        "bg": "OFFROAD пакет",
        "en": "OFFROAD пакет"
      },
      {
        "bg": "Steptronic",
        "en": "Steptronic"
      },
      {
        "bg": "Tiptronic",
        "en": "Tiptronic"
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
        "bg": "Автоматично затваряне на багажника",
        "en": "Автоматично затваряне на багажника"
      },
      {
        "bg": "Адаптивни предни светлини",
        "en": "Адаптивни предни светлини"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Бартер",
        "en": "Бартер"
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
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
        "bg": "Ел. разпределяне на спирачното усилие",
        "en": "Ел. разпределяне на спирачното усилие"
      },
      {
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
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
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Отопление на волана",
        "en": "Отопление на волана"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
      },
      {
        "bg": "Сензор за дъжд",
        "en": "Сензор за дъжд"
      },
      {
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за измиване на фаровете",
        "en": "Система за измиване на фаровете"
      },
      {
        "bg": "Система за контрол на дистанцията",
        "en": "Система за контрол на дистанцията"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Система за контрол на спускането",
        "en": "Система за контрол на спускането"
      },
      {
        "bg": "Теглич",
        "en": "Теглич"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "VW",
      "model": "Tiguan 2.0TDI 200HP ALLSPACE 4-Motion",
      "year": 2023,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 147000,
      "mileageUnit": "km",
      "enginePowerHp": 200,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:47.000Z",
    "promoted": false
  },
  {
    "id": "automarket-21784142258144582",
    "slug": "automarket-21784142258144582",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Mercedes-Benz GLC 2.2CDI 170HP 4-Matic Autonatic Navi",
    "description": "Mercedes-Benz GLC 2.2CDI 170HP 4-Matic Autonatic Navi, 2016 г., 165 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-21784142258144582-mercedes-benz-glc-2-2cdi-170hp-4-matic-autonatic-navi",
    "price": {
      "amount": 21999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-15-1.webp",
        "alt": "Mercedes-Benz GLC 2.2CDI 170HP 4-Matic Autonatic Navi"
      },
      {
        "url": "/assets/automarket/vehicle-15-2.webp",
        "alt": "Mercedes-Benz GLC 2.2CDI 170HP 4-Matic Autonatic Navi"
      },
      {
        "url": "/assets/automarket/vehicle-15-3.webp",
        "alt": "Mercedes-Benz GLC 2.2CDI 170HP 4-Matic Autonatic Navi"
      },
      {
        "url": "/assets/automarket/vehicle-15-4.webp",
        "alt": "Mercedes-Benz GLC 2.2CDI 170HP 4-Matic Autonatic Navi"
      },
      {
        "url": "/assets/automarket/vehicle-15-5.webp",
        "alt": "Mercedes-Benz GLC 2.2CDI 170HP 4-Matic Autonatic Navi"
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "4x4",
        "en": "4x4"
      },
      {
        "bg": "Auto Start Stop function",
        "en": "Auto Start Stop function"
      },
      {
        "bg": "LED фарове",
        "en": "LED фарове"
      },
      {
        "bg": "Steptronic",
        "en": "Steptronic"
      },
      {
        "bg": "Tiptronic",
        "en": "Tiptronic"
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
        "bg": "Адаптивни предни светлини",
        "en": "Адаптивни предни светлини"
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
        "bg": "Бартер",
        "en": "Бартер"
      },
      {
        "bg": "Безключово палене ",
        "en": "Безключово палене "
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
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
        "bg": "Ел. разпределяне на спирачното усилие",
        "en": "Ел. разпределяне на спирачното усилие"
      },
      {
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Кожен салон",
        "en": "Кожен салон"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Ксенонови фарове",
        "en": "Ксенонови фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
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
        "bg": "Напълно обслужен",
        "en": "Напълно обслужен"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
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
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
      },
      {
        "bg": "Сензор за дъжд",
        "en": "Сензор за дъжд"
      },
      {
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Система за контрол на спускането",
        "en": "Система за контрол на спускането"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "GLC 2.2CDI 170HP 4-Matic Autonatic Navi",
      "year": 2016,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 165000,
      "mileageUnit": "km",
      "enginePowerHp": 170,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:46.000Z",
    "promoted": false
  },
  {
    "id": "automarket-11750340593495216",
    "slug": "automarket-11750340593495216",
    "category": "car",
    "dealerOrgId": "dealer-automarket-varna",
    "status": "active",
    "title": "Audi A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL",
    "description": "Audi A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL, 2016 г., 218 000 км. Представителна обява към 07.09.2026 г. Потвърдете наличността и условията с Аутомаркет Варна. Не се начислява ДДС. Оригинална обява: https://automarket.mobile.bg/obiava-11750340593495216-audi-a4-allroad-3-0tdi-272hp-automatic-quattro-digital",
    "price": {
      "amount": 15999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/automarket/vehicle-16-1.webp",
        "alt": "Audi A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL"
      },
      {
        "url": "/assets/automarket/vehicle-16-2.webp",
        "alt": "Audi A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL"
      },
      {
        "url": "/assets/automarket/vehicle-16-3.webp",
        "alt": "Audi A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL"
      },
      {
        "url": "/assets/automarket/vehicle-16-4.webp",
        "alt": "Audi A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL"
      },
      {
        "url": "/assets/automarket/vehicle-16-5.webp",
        "alt": "Audi A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL"
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "4x4",
        "en": "4x4"
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
        "bg": "LED фарове",
        "en": "LED фарове"
      },
      {
        "bg": "Steptronic",
        "en": "Steptronic"
      },
      {
        "bg": "Tiptronic",
        "en": "Tiptronic"
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
        "bg": "Адаптивни предни светлини",
        "en": "Адаптивни предни светлини"
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
        "bg": "Бартер",
        "en": "Бартер"
      },
      {
        "bg": "Безключово палене ",
        "en": "Безключово палене "
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
        "bg": "Велурен салон",
        "en": "Велурен салон"
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
      },
      {
        "bg": "Дълга база",
        "en": "Дълга база"
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
        "bg": "Ел. разпределяне на спирачното усилие",
        "en": "Ел. разпределяне на спирачното усилие"
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
        "bg": "Електронна програма за стабилизиране",
        "en": "Електронна програма за стабилизиране"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Кожен салон",
        "en": "Кожен салон"
      },
      {
        "bg": "Контрол на налягането на гумите",
        "en": "Контрол на налягането на гумите"
      },
      {
        "bg": "Ксенонови фарове",
        "en": "Ксенонови фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Лизинг",
        "en": "Лизинг"
      },
      {
        "bg": "Металик",
        "en": "Металик"
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
        "bg": "Напълно обслужен",
        "en": "Напълно обслужен"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Панорамен люк",
        "en": "Панорамен люк"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
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
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
      },
      {
        "bg": "С регистрация",
        "en": "С регистрация"
      },
      {
        "bg": "Сензор за дъжд",
        "en": "Сензор за дъжд"
      },
      {
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за измиване на фаровете",
        "en": "Система за измиване на фаровете"
      },
      {
        "bg": "Система за контрол на дистанцията",
        "en": "Система за контрол на дистанцията"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
      },
      {
        "bg": "Тунинг",
        "en": "Тунинг"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      },
      {
        "bg": "Шибедах",
        "en": "Шибедах"
      }
    ],
    "spec": {
      "make": "Audi",
      "model": "A4 Allroad 3.0TDI 272HP AUTOMATIC QUATTRO DIGITAL",
      "year": 2016,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 218000,
      "mileageUnit": "km",
      "enginePowerHp": 272,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-automarket-varna",
      "type": "dealer",
      "displayName": "Аутомаркет Варна",
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
