import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "21787584817368418",
    "slug": "hyundai-ix35-368418",
    "category": "car",
    "dealerOrgId": "dealer-voivodov-auto-antonio",
    "status": "active",
    "title": "Hyundai IX35",
    "description": "Hyundai IX35, 2012 г., 175 679 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://voivodovauto.mobile.bg/obiava-21787584817368418-hyundai-ix35-nov-vnos-ot-italiya",
    "price": {
      "amount": 5800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21787584817368418-1.webp",
        "alt": "Hyundai IX35 — снимка 1"
      },
      {
        "url": "/dealer/stock/21787584817368418-2.webp",
        "alt": "Hyundai IX35 — снимка 2"
      },
      {
        "url": "/dealer/stock/21787584817368418-3.webp",
        "alt": "Hyundai IX35 — снимка 3"
      },
      {
        "url": "/dealer/stock/21787584817368418-4.webp",
        "alt": "Hyundai IX35 — снимка 4"
      },
      {
        "url": "/dealer/stock/21787584817368418-5.webp",
        "alt": "Hyundai IX35 — снимка 5"
      },
      {
        "url": "/dealer/stock/21787584817368418-6.webp",
        "alt": "Hyundai IX35 — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Въстанически",
      "country": "България"
    },
    "features": [
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
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
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
      }
    ],
    "spec": {
      "make": "Hyundai",
      "model": "IX35",
      "year": 2012,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 175679,
      "mileageUnit": "km",
      "enginePowerHp": 115,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-voivodov-auto-antonio",
      "type": "dealer",
      "displayName": "VOIVODOV AUTO & ANTONIO",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:28:23.511Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "21778688064239119",
    "slug": "toyota-rav4-hybrid-239119",
    "category": "car",
    "dealerOrgId": "dealer-voivodov-auto-antonio",
    "status": "active",
    "title": "Toyota RAV4 Hybrid",
    "description": "Toyota RAV4 Hybrid, 2017 г., 175 447 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://voivodovauto.mobile.bg/obiava-21778688064239119-toyota-rav4-hibrid-nov-vnos-ot-italiya",
    "price": {
      "amount": 14800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21778688064239119-1.webp",
        "alt": "Toyota RAV4 Hybrid — снимка 1"
      },
      {
        "url": "/dealer/stock/21778688064239119-2.webp",
        "alt": "Toyota RAV4 Hybrid — снимка 2"
      },
      {
        "url": "/dealer/stock/21778688064239119-3.webp",
        "alt": "Toyota RAV4 Hybrid — снимка 3"
      },
      {
        "url": "/dealer/stock/21778688064239119-4.webp",
        "alt": "Toyota RAV4 Hybrid — снимка 4"
      },
      {
        "url": "/dealer/stock/21778688064239119-5.webp",
        "alt": "Toyota RAV4 Hybrid — снимка 5"
      },
      {
        "url": "/dealer/stock/21778688064239119-6.webp",
        "alt": "Toyota RAV4 Hybrid — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Въстанически",
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
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
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
        "bg": "Ксенонови фарове",
        "en": "Ксенонови фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      },
      {
        "bg": "360 camera \\ Задна камера",
        "en": "360 camera \\ Задна камера"
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
        "bg": "Автоматично затваряне на багажника",
        "en": "Автоматично затваряне на багажника"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      }
    ],
    "spec": {
      "make": "Toyota",
      "model": "RAV4 Hybrid",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 175447,
      "mileageUnit": "km",
      "enginePowerHp": 197,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-voivodov-auto-antonio",
      "type": "dealer",
      "displayName": "VOIVODOV AUTO & ANTONIO",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:28:23.511Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11781437915261347",
    "slug": "opel-corsa-261347",
    "category": "car",
    "dealerOrgId": "dealer-voivodov-auto-antonio",
    "status": "active",
    "title": "Opel Corsa",
    "description": "Opel Corsa, 2018 г., 46 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://voivodovauto.mobile.bg/obiava-11781437915261347-opel-corsa-nov-vnos-ot-italiya",
    "price": {
      "amount": 5800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11781437915261347-1.webp",
        "alt": "Opel Corsa — снимка 1"
      },
      {
        "url": "/dealer/stock/11781437915261347-2.webp",
        "alt": "Opel Corsa — снимка 2"
      },
      {
        "url": "/dealer/stock/11781437915261347-3.webp",
        "alt": "Opel Corsa — снимка 3"
      },
      {
        "url": "/dealer/stock/11781437915261347-4.webp",
        "alt": "Opel Corsa — снимка 4"
      },
      {
        "url": "/dealer/stock/11781437915261347-5.webp",
        "alt": "Opel Corsa — снимка 5"
      },
      {
        "url": "/dealer/stock/11781437915261347-6.webp",
        "alt": "Opel Corsa — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Въстанически",
      "country": "България"
    },
    "features": [
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
        "bg": "2(3) Врати",
        "en": "2(3) Врати"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "Бордкомпютър",
        "en": "Бордкомпютър"
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
        "bg": "Климатик",
        "en": "Климатик"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      }
    ],
    "spec": {
      "make": "Opel",
      "model": "Corsa",
      "year": 2018,
      "bodyType": "coupe",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 46000,
      "mileageUnit": "km",
      "enginePowerHp": 70,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-voivodov-auto-antonio",
      "type": "dealer",
      "displayName": "VOIVODOV AUTO & ANTONIO",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:28:23.511Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "21784640560836463",
    "slug": "mazda-cx-5-836463",
    "category": "car",
    "dealerOrgId": "dealer-voivodov-auto-antonio",
    "status": "active",
    "title": "Mazda CX-5",
    "description": "Mazda CX-5, 2013 г., 173 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://voivodovauto.mobile.bg/obiava-21784640560836463-mazda-cx-5-nov-vnos-ot-italiya",
    "price": {
      "amount": 6800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21784640560836463-1.webp",
        "alt": "Mazda CX-5 — снимка 1"
      },
      {
        "url": "/dealer/stock/21784640560836463-2.webp",
        "alt": "Mazda CX-5 — снимка 2"
      },
      {
        "url": "/dealer/stock/21784640560836463-3.webp",
        "alt": "Mazda CX-5 — снимка 3"
      },
      {
        "url": "/dealer/stock/21784640560836463-4.webp",
        "alt": "Mazda CX-5 — снимка 4"
      },
      {
        "url": "/dealer/stock/21784640560836463-5.webp",
        "alt": "Mazda CX-5 — снимка 5"
      },
      {
        "url": "/dealer/stock/21784640560836463-6.webp",
        "alt": "Mazda CX-5 — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Въстанически",
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
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
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
        "bg": "Ксенонови фарове",
        "en": "Ксенонови фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "DVD, TV",
        "en": "DVD, TV"
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
        "bg": "Климатроник",
        "en": "Климатроник"
      },
      {
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      }
    ],
    "spec": {
      "make": "Mazda",
      "model": "CX-5",
      "year": 2013,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 173000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-voivodov-auto-antonio",
      "type": "dealer",
      "displayName": "VOIVODOV AUTO & ANTONIO",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:28:23.512Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "21776177602007255",
    "slug": "jeep-cherokee-007255",
    "category": "car",
    "dealerOrgId": "dealer-voivodov-auto-antonio",
    "status": "active",
    "title": "Jeep Cherokee",
    "description": "Jeep Cherokee, 2016 г., 146 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://voivodovauto.mobile.bg/obiava-21776177602007255-jeep-cherokee-nov-vnos-ot-italiya-4h4",
    "price": {
      "amount": 10500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21776177602007255-1.webp",
        "alt": "Jeep Cherokee — снимка 1"
      },
      {
        "url": "/dealer/stock/21776177602007255-2.webp",
        "alt": "Jeep Cherokee — снимка 2"
      },
      {
        "url": "/dealer/stock/21776177602007255-3.webp",
        "alt": "Jeep Cherokee — снимка 3"
      },
      {
        "url": "/dealer/stock/21776177602007255-4.webp",
        "alt": "Jeep Cherokee — снимка 4"
      },
      {
        "url": "/dealer/stock/21776177602007255-5.webp",
        "alt": "Jeep Cherokee — снимка 5"
      },
      {
        "url": "/dealer/stock/21776177602007255-6.webp",
        "alt": "Jeep Cherokee — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Въстанически",
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
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "4x4",
        "en": "4x4"
      },
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
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
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      }
    ],
    "spec": {
      "make": "Jeep",
      "model": "Cherokee",
      "year": 2016,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 146000,
      "mileageUnit": "km",
      "enginePowerHp": 200,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-voivodov-auto-antonio",
      "type": "dealer",
      "displayName": "VOIVODOV AUTO & ANTONIO",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:28:23.512Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11781213566653263",
    "slug": "honda-jazz-automatic-653263",
    "category": "car",
    "dealerOrgId": "dealer-voivodov-auto-antonio",
    "status": "active",
    "title": "Honda Jazz Automatic",
    "description": "Honda Jazz Automatic, 2020 г., 24 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://voivodovauto.mobile.bg/obiava-11781213566653263-honda-jazz-avtomat-realni-kilometri",
    "price": {
      "amount": 16890,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11781213566653263-1.webp",
        "alt": "Honda Jazz Automatic — снимка 1"
      },
      {
        "url": "/dealer/stock/11781213566653263-2.webp",
        "alt": "Honda Jazz Automatic — снимка 2"
      },
      {
        "url": "/dealer/stock/11781213566653263-3.webp",
        "alt": "Honda Jazz Automatic — снимка 3"
      },
      {
        "url": "/dealer/stock/11781213566653263-4.webp",
        "alt": "Honda Jazz Automatic — снимка 4"
      },
      {
        "url": "/dealer/stock/11781213566653263-5.webp",
        "alt": "Honda Jazz Automatic — снимка 5"
      },
      {
        "url": "/dealer/stock/11781213566653263-6.webp",
        "alt": "Honda Jazz Automatic — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Въстанически",
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
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
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
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "360 camera \\ Задна камера",
        "en": "360 camera \\ Задна камера"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
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
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Сензор за дъжд",
        "en": "Сензор за дъжд"
      },
      {
        "bg": "Система за измиване на фаровете",
        "en": "Система за измиване на фаровете"
      }
    ],
    "spec": {
      "make": "Honda",
      "model": "Jazz Automatic",
      "year": 2020,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 24000,
      "mileageUnit": "km",
      "enginePowerHp": 131,
      "colorExterior": "Металик"
    },
    "seller": {
      "id": "dealer-voivodov-auto-antonio",
      "type": "dealer",
      "displayName": "VOIVODOV AUTO & ANTONIO",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:28:23.512Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "21784225734010518",
    "slug": "honda-cr-v-hybrid-010518",
    "category": "car",
    "dealerOrgId": "dealer-voivodov-auto-antonio",
    "status": "active",
    "title": "Honda CR-V Hybrid",
    "description": "Honda CR-V Hybrid, 2023 г., 79 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://voivodovauto.mobile.bg/obiava-21784225734010518-honda-cr-v-realni-kilometri-sas-servizna-knizhka",
    "price": {
      "amount": 24999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21784225734010518-1.webp",
        "alt": "Honda CR-V Hybrid — снимка 1"
      },
      {
        "url": "/dealer/stock/21784225734010518-2.webp",
        "alt": "Honda CR-V Hybrid — снимка 2"
      },
      {
        "url": "/dealer/stock/21784225734010518-3.webp",
        "alt": "Honda CR-V Hybrid — снимка 3"
      },
      {
        "url": "/dealer/stock/21784225734010518-4.webp",
        "alt": "Honda CR-V Hybrid — снимка 4"
      },
      {
        "url": "/dealer/stock/21784225734010518-5.webp",
        "alt": "Honda CR-V Hybrid — снимка 5"
      },
      {
        "url": "/dealer/stock/21784225734010518-6.webp",
        "alt": "Honda CR-V Hybrid — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Въстанически",
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
        "bg": "Ксенонови фарове",
        "en": "Ксенонови фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      },
      {
        "bg": "360 camera \\ Задна камера",
        "en": "360 camera \\ Задна камера"
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
        "bg": "DVD, TV",
        "en": "DVD, TV"
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
      "make": "Honda",
      "model": "CR-V Hybrid",
      "year": 2023,
      "bodyType": "suv",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 79000,
      "mileageUnit": "km",
      "enginePowerHp": 146,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-voivodov-auto-antonio",
      "type": "dealer",
      "displayName": "VOIVODOV AUTO & ANTONIO",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:28:23.513Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11781101254100384",
    "slug": "toyota-prius-100384",
    "category": "car",
    "dealerOrgId": "dealer-voivodov-auto-antonio",
    "status": "active",
    "title": "Toyota Prius",
    "description": "Toyota Prius, 2009 г., 159 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://voivodovauto.mobile.bg/obiava-11781101254100384-toyota-prius-nov-vnos-ot-italiya",
    "price": {
      "amount": 8200,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11781101254100384-1.webp",
        "alt": "Toyota Prius — снимка 1"
      },
      {
        "url": "/dealer/stock/11781101254100384-2.webp",
        "alt": "Toyota Prius — снимка 2"
      },
      {
        "url": "/dealer/stock/11781101254100384-3.webp",
        "alt": "Toyota Prius — снимка 3"
      },
      {
        "url": "/dealer/stock/11781101254100384-4.webp",
        "alt": "Toyota Prius — снимка 4"
      },
      {
        "url": "/dealer/stock/11781101254100384-5.webp",
        "alt": "Toyota Prius — снимка 5"
      },
      {
        "url": "/dealer/stock/11781101254100384-6.webp",
        "alt": "Toyota Prius — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Въстанически",
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
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
      },
      {
        "bg": "Система за контрол на дистанцията",
        "en": "Система за контрол на дистанцията"
      },
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      },
      {
        "bg": "Велурен салон",
        "en": "Велурен салон"
      },
      {
        "bg": "Head up display",
        "en": "Head up display"
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
        "bg": "Ел. усилвател на волана",
        "en": "Ел. усилвател на волана"
      },
      {
        "bg": "Климатроник",
        "en": "Климатроник"
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
      "make": "Toyota",
      "model": "Prius",
      "year": 2009,
      "bodyType": "sedan",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 159000,
      "mileageUnit": "km",
      "enginePowerHp": 100,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-voivodov-auto-antonio",
      "type": "dealer",
      "displayName": "VOIVODOV AUTO & ANTONIO",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:28:23.514Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "21775747569183753",
    "slug": "skoda-yeti-183753",
    "category": "car",
    "dealerOrgId": "dealer-voivodov-auto-antonio",
    "status": "active",
    "title": "Skoda Yeti",
    "description": "Skoda Yeti, 2015 г., 143 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://voivodovauto.mobile.bg/obiava-21775747569183753-skoda-yeti-nov-vnos-ot-italiya",
    "price": {
      "amount": 6700,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21775747569183753-1.webp",
        "alt": "Skoda Yeti — снимка 1"
      },
      {
        "url": "/dealer/stock/21775747569183753-2.webp",
        "alt": "Skoda Yeti — снимка 2"
      },
      {
        "url": "/dealer/stock/21775747569183753-3.webp",
        "alt": "Skoda Yeti — снимка 3"
      },
      {
        "url": "/dealer/stock/21775747569183753-4.webp",
        "alt": "Skoda Yeti — снимка 4"
      },
      {
        "url": "/dealer/stock/21775747569183753-5.webp",
        "alt": "Skoda Yeti — снимка 5"
      },
      {
        "url": "/dealer/stock/21775747569183753-6.webp",
        "alt": "Skoda Yeti — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Въстанически",
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
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
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
        "bg": "Климатик",
        "en": "Климатик"
      }
    ],
    "spec": {
      "make": "Skoda",
      "model": "Yeti",
      "year": 2015,
      "bodyType": "other",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 143000,
      "mileageUnit": "km",
      "enginePowerHp": 105,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-voivodov-auto-antonio",
      "type": "dealer",
      "displayName": "VOIVODOV AUTO & ANTONIO",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:28:23.514Z",
    "promoted": false,
    "priceTaxLabel": "Не се начислява ДДС"
  },
  {
    "id": "11775730754815024",
    "slug": "skoda-octavia-815024",
    "category": "car",
    "dealerOrgId": "dealer-voivodov-auto-antonio",
    "status": "active",
    "title": "Skoda Octavia",
    "description": "Skoda Octavia, 2018 г., 204 000 км. Не се начислява ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://voivodovauto.mobile.bg/obiava-11775730754815024-skoda-octavia-nov-vnos-ot-italiya",
    "price": {
      "amount": 10100,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11775730754815024-1.webp",
        "alt": "Skoda Octavia — снимка 1"
      },
      {
        "url": "/dealer/stock/11775730754815024-2.webp",
        "alt": "Skoda Octavia — снимка 2"
      },
      {
        "url": "/dealer/stock/11775730754815024-3.webp",
        "alt": "Skoda Octavia — снимка 3"
      },
      {
        "url": "/dealer/stock/11775730754815024-4.webp",
        "alt": "Skoda Octavia — снимка 4"
      },
      {
        "url": "/dealer/stock/11775730754815024-5.webp",
        "alt": "Skoda Octavia — снимка 5"
      },
      {
        "url": "/dealer/stock/11775730754815024-6.webp",
        "alt": "Skoda Octavia — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Въстанически",
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
        "bg": "Система за защита от пробуксуване",
        "en": "Система за защита от пробуксуване"
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
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
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
        "bg": "Регулиране на волана",
        "en": "Регулиране на волана"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      }
    ],
    "spec": {
      "make": "Skoda",
      "model": "Octavia",
      "year": 2018,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 204000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-voivodov-auto-antonio",
      "type": "dealer",
      "displayName": "VOIVODOV AUTO & ANTONIO",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T03:28:23.514Z",
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
