import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "11763371717307272",
    "slug": "renault-captur-1-3-tce-intens-307272",
    "category": "car",
    "dealerOrgId": "dealer-todorov-auto",
    "status": "active",
    "title": "Renault Captur 1.3 TCe Intens",
    "description": "Renault Captur 1.3 TCe Intens, 2021 г., 46 000 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://todorovauto.mobile.bg/obiava-11763371717307272-renault-captur-1-3tce-intens-140ks",
    "price": {
      "amount": 16450,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11763371717307272-1.webp",
        "alt": "Renault Captur 1.3 TCe Intens — снимка 1"
      },
      {
        "url": "/dealer/stock/11763371717307272-2.webp",
        "alt": "Renault Captur 1.3 TCe Intens — снимка 2"
      },
      {
        "url": "/dealer/stock/11763371717307272-3.webp",
        "alt": "Renault Captur 1.3 TCe Intens — снимка 3"
      },
      {
        "url": "/dealer/stock/11763371717307272-4.webp",
        "alt": "Renault Captur 1.3 TCe Intens — снимка 4"
      },
      {
        "url": "/dealer/stock/11763371717307272-5.webp",
        "alt": "Renault Captur 1.3 TCe Intens — снимка 5"
      },
      {
        "url": "/dealer/stock/11763371717307272-6.webp",
        "alt": "Renault Captur 1.3 TCe Intens — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Изгрев",
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
        "bg": "Безключово палене",
        "en": "Безключово палене"
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
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      }
    ],
    "spec": {
      "make": "Renault",
      "model": "Captur 1.3 TCe Intens",
      "year": 2021,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 46000,
      "mileageUnit": "km",
      "enginePowerHp": 140,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-todorov-auto",
      "type": "dealer",
      "displayName": "Автосалон Тодоров",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T01:47:15.697Z",
    "promoted": false
  },
  {
    "id": "11704208021161812",
    "slug": "nissan-micra-ig-t-acenta-xtronic-161812",
    "category": "car",
    "dealerOrgId": "dealer-todorov-auto",
    "status": "active",
    "title": "Nissan Micra IG-T Acenta Xtronic",
    "description": "Nissan Micra IG-T Acenta Xtronic, 2021 г., 14 144 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://todorovauto.mobile.bg/obiava-11704208021161812-nissan-micra-ig-tacenta-xtronic92k",
    "price": {
      "amount": 11950,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11704208021161812-1.webp",
        "alt": "Nissan Micra IG-T Acenta Xtronic — снимка 1"
      },
      {
        "url": "/dealer/stock/11704208021161812-2.webp",
        "alt": "Nissan Micra IG-T Acenta Xtronic — снимка 2"
      },
      {
        "url": "/dealer/stock/11704208021161812-3.webp",
        "alt": "Nissan Micra IG-T Acenta Xtronic — снимка 3"
      },
      {
        "url": "/dealer/stock/11704208021161812-4.webp",
        "alt": "Nissan Micra IG-T Acenta Xtronic — снимка 4"
      },
      {
        "url": "/dealer/stock/11704208021161812-5.webp",
        "alt": "Nissan Micra IG-T Acenta Xtronic — снимка 5"
      },
      {
        "url": "/dealer/stock/11704208021161812-6.webp",
        "alt": "Nissan Micra IG-T Acenta Xtronic — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Изгрев",
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
        "bg": "Металик",
        "en": "Металик"
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
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      }
    ],
    "spec": {
      "make": "Nissan",
      "model": "Micra IG-T Acenta Xtronic",
      "year": 2021,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 14144,
      "mileageUnit": "km",
      "enginePowerHp": 92,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-todorov-auto",
      "type": "dealer",
      "displayName": "Автосалон Тодоров",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T01:47:15.699Z",
    "promoted": false
  },
  {
    "id": "11735041255980884",
    "slug": "nissan-leaf-2-zeroemission-980884",
    "category": "car",
    "dealerOrgId": "dealer-todorov-auto",
    "status": "active",
    "title": "Nissan Leaf 2 ZeroEmission",
    "description": "Nissan Leaf 2 ZeroEmission, 2018 г., 102 600 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://todorovauto.mobile.bg/obiava-11735041255980884-nissan-leaf-2-zeroemission-150ks",
    "price": {
      "amount": 11250,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11735041255980884-1.webp",
        "alt": "Nissan Leaf 2 ZeroEmission — снимка 1"
      },
      {
        "url": "/dealer/stock/11735041255980884-2.webp",
        "alt": "Nissan Leaf 2 ZeroEmission — снимка 2"
      },
      {
        "url": "/dealer/stock/11735041255980884-3.webp",
        "alt": "Nissan Leaf 2 ZeroEmission — снимка 3"
      },
      {
        "url": "/dealer/stock/11735041255980884-4.webp",
        "alt": "Nissan Leaf 2 ZeroEmission — снимка 4"
      },
      {
        "url": "/dealer/stock/11735041255980884-5.webp",
        "alt": "Nissan Leaf 2 ZeroEmission — снимка 5"
      },
      {
        "url": "/dealer/stock/11735041255980884-6.webp",
        "alt": "Nissan Leaf 2 ZeroEmission — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Изгрев",
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
        "bg": "Безключово палене",
        "en": "Безключово палене"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      }
    ],
    "spec": {
      "make": "Nissan",
      "model": "Leaf 2 ZeroEmission",
      "year": 2018,
      "bodyType": "hatchback",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 102600,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Резидав"
    },
    "seller": {
      "id": "dealer-todorov-auto",
      "type": "dealer",
      "displayName": "Автосалон Тодоров",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T01:47:15.700Z",
    "promoted": false
  },
  {
    "id": "11757098776259646",
    "slug": "toyota-yaris-1-5-hybrid-259646",
    "category": "car",
    "dealerOrgId": "dealer-todorov-auto",
    "status": "active",
    "title": "Toyota Yaris 1.5 Hybrid",
    "description": "Toyota Yaris 1.5 Hybrid, 2017 г., 139 590 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://todorovauto.mobile.bg/obiava-11757098776259646-toyota-yaris-1-5i-hybrid",
    "price": {
      "amount": 8690,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11757098776259646-1.webp",
        "alt": "Toyota Yaris 1.5 Hybrid — снимка 1"
      },
      {
        "url": "/dealer/stock/11757098776259646-2.webp",
        "alt": "Toyota Yaris 1.5 Hybrid — снимка 2"
      },
      {
        "url": "/dealer/stock/11757098776259646-3.webp",
        "alt": "Toyota Yaris 1.5 Hybrid — снимка 3"
      },
      {
        "url": "/dealer/stock/11757098776259646-4.webp",
        "alt": "Toyota Yaris 1.5 Hybrid — снимка 4"
      },
      {
        "url": "/dealer/stock/11757098776259646-5.webp",
        "alt": "Toyota Yaris 1.5 Hybrid — снимка 5"
      },
      {
        "url": "/dealer/stock/11757098776259646-6.webp",
        "alt": "Toyota Yaris 1.5 Hybrid — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Изгрев",
      "country": "България"
    },
    "features": [
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
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
        "bg": "Сензор за дъжд",
        "en": "Сензор за дъжд"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Хомологация N1",
        "en": "Хомологация N1"
      }
    ],
    "spec": {
      "make": "Toyota",
      "model": "Yaris 1.5 Hybrid",
      "year": 2017,
      "bodyType": "hatchback",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 139590,
      "mileageUnit": "km",
      "enginePowerHp": 75,
      "colorExterior": "Червен"
    },
    "seller": {
      "id": "dealer-todorov-auto",
      "type": "dealer",
      "displayName": "Автосалон Тодоров",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T01:47:15.700Z",
    "promoted": false
  },
  {
    "id": "11649235957114307",
    "slug": "renault-megane-1-5-dci-zen-114307",
    "category": "car",
    "dealerOrgId": "dealer-todorov-auto",
    "status": "active",
    "title": "Renault Megane 1.5 dCi Zen",
    "description": "Renault Megane 1.5 dCi Zen, 2016 г., 129 000 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://todorovauto.mobile.bg/obiava-11649235957114307-renault-megane-1-5-dci-zen-110-k-s",
    "price": {
      "amount": 9800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11649235957114307-1.webp",
        "alt": "Renault Megane 1.5 dCi Zen — снимка 1"
      },
      {
        "url": "/dealer/stock/11649235957114307-2.webp",
        "alt": "Renault Megane 1.5 dCi Zen — снимка 2"
      },
      {
        "url": "/dealer/stock/11649235957114307-3.webp",
        "alt": "Renault Megane 1.5 dCi Zen — снимка 3"
      },
      {
        "url": "/dealer/stock/11649235957114307-4.webp",
        "alt": "Renault Megane 1.5 dCi Zen — снимка 4"
      },
      {
        "url": "/dealer/stock/11649235957114307-5.webp",
        "alt": "Renault Megane 1.5 dCi Zen — снимка 5"
      },
      {
        "url": "/dealer/stock/11649235957114307-6.webp",
        "alt": "Renault Megane 1.5 dCi Zen — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Изгрев",
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
        "bg": "Металик",
        "en": "Металик"
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
        "bg": "Каско",
        "en": "Каско"
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
        "bg": "Безключово палене",
        "en": "Безключово палене"
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
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      }
    ],
    "spec": {
      "make": "Renault",
      "model": "Megane 1.5 dCi Zen",
      "year": 2016,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 129000,
      "mileageUnit": "km",
      "enginePowerHp": 110,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-todorov-auto",
      "type": "dealer",
      "displayName": "Автосалон Тодоров",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T01:47:15.701Z",
    "promoted": false
  },
  {
    "id": "11784299299170761",
    "slug": "peugeot-2008-allure-premium-170761",
    "category": "car",
    "dealerOrgId": "dealer-todorov-auto",
    "status": "active",
    "title": "Peugeot 2008 Allure Premium",
    "description": "Peugeot 2008 Allure Premium, 2025 г., 4000 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://todorovauto.mobile.bg/obiava-11784299299170761-peugeot-2008-1-2pt-allure-premium",
    "price": {
      "amount": 24900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11784299299170761-1.webp",
        "alt": "Peugeot 2008 Allure Premium — снимка 1"
      },
      {
        "url": "/dealer/stock/11784299299170761-2.webp",
        "alt": "Peugeot 2008 Allure Premium — снимка 2"
      },
      {
        "url": "/dealer/stock/11784299299170761-3.webp",
        "alt": "Peugeot 2008 Allure Premium — снимка 3"
      },
      {
        "url": "/dealer/stock/11784299299170761-4.webp",
        "alt": "Peugeot 2008 Allure Premium — снимка 4"
      },
      {
        "url": "/dealer/stock/11784299299170761-5.webp",
        "alt": "Peugeot 2008 Allure Premium — снимка 5"
      },
      {
        "url": "/dealer/stock/11784299299170761-6.webp",
        "alt": "Peugeot 2008 Allure Premium — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Изгрев",
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
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
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
        "bg": "Apple CarPlay \\ Android Auto",
        "en": "Apple CarPlay \\ Android Auto"
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
        "bg": "Безключово палене",
        "en": "Безключово палене"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      }
    ],
    "spec": {
      "make": "Peugeot",
      "model": "2008 Allure Premium",
      "year": 2025,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 4000,
      "mileageUnit": "km",
      "enginePowerHp": 130,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-todorov-auto",
      "type": "dealer",
      "displayName": "Автосалон Тодоров",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T01:47:15.701Z",
    "promoted": false
  },
  {
    "id": "21782384979656784",
    "slug": "opel-crossland-x-1-2-tp-ultim-656784",
    "category": "car",
    "dealerOrgId": "dealer-todorov-auto",
    "status": "active",
    "title": "Opel Crossland X 1.2 TP Ultim",
    "description": "Opel Crossland X 1.2 TP Ultim, 2018 г., 115 403 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://todorovauto.mobile.bg/obiava-21782384979656784-opel-crossland-x-1-2i-tp-ultim-110-k-s",
    "price": {
      "amount": 10450,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21782384979656784-1.webp",
        "alt": "Opel Crossland X 1.2 TP Ultim — снимка 1"
      },
      {
        "url": "/dealer/stock/21782384979656784-2.webp",
        "alt": "Opel Crossland X 1.2 TP Ultim — снимка 2"
      },
      {
        "url": "/dealer/stock/21782384979656784-3.webp",
        "alt": "Opel Crossland X 1.2 TP Ultim — снимка 3"
      },
      {
        "url": "/dealer/stock/21782384979656784-4.webp",
        "alt": "Opel Crossland X 1.2 TP Ultim — снимка 4"
      },
      {
        "url": "/dealer/stock/21782384979656784-5.webp",
        "alt": "Opel Crossland X 1.2 TP Ultim — снимка 5"
      },
      {
        "url": "/dealer/stock/21782384979656784-6.webp",
        "alt": "Opel Crossland X 1.2 TP Ultim — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Изгрев",
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
        "bg": "LED фарове",
        "en": "LED фарове"
      },
      {
        "bg": "Лети джанти",
        "en": "Лети джанти"
      },
      {
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
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
        "bg": "Apple CarPlay \\ Android Auto",
        "en": "Apple CarPlay \\ Android Auto"
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
        "bg": "Безключово палене",
        "en": "Безключово палене"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      }
    ],
    "spec": {
      "make": "Opel",
      "model": "Crossland X 1.2 TP Ultim",
      "year": 2018,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 115403,
      "mileageUnit": "km",
      "enginePowerHp": 110,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-todorov-auto",
      "type": "dealer",
      "displayName": "Автосалон Тодоров",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T01:47:15.702Z",
    "promoted": false
  },
  {
    "id": "11701427910651766",
    "slug": "opel-astra-1-6-cdti-651766",
    "category": "car",
    "dealerOrgId": "dealer-todorov-auto",
    "status": "active",
    "title": "Opel Astra 1.6 CDTi",
    "description": "Opel Astra 1.6 CDTi, 2017 г., 166 000 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://todorovauto.mobile.bg/obiava-11701427910651766-opel-astra-1-6cdtiecofenjoy136ks",
    "price": {
      "amount": 7400,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11701427910651766-1.webp",
        "alt": "Opel Astra 1.6 CDTi — снимка 1"
      },
      {
        "url": "/dealer/stock/11701427910651766-2.webp",
        "alt": "Opel Astra 1.6 CDTi — снимка 2"
      },
      {
        "url": "/dealer/stock/11701427910651766-3.webp",
        "alt": "Opel Astra 1.6 CDTi — снимка 3"
      },
      {
        "url": "/dealer/stock/11701427910651766-4.webp",
        "alt": "Opel Astra 1.6 CDTi — снимка 4"
      },
      {
        "url": "/dealer/stock/11701427910651766-5.webp",
        "alt": "Opel Astra 1.6 CDTi — снимка 5"
      },
      {
        "url": "/dealer/stock/11701427910651766-6.webp",
        "alt": "Opel Astra 1.6 CDTi — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Изгрев",
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
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
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
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Навигация",
        "en": "Навигация"
      },
      {
        "bg": "Отопление на волана",
        "en": "Отопление на волана"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      }
    ],
    "spec": {
      "make": "Opel",
      "model": "Astra 1.6 CDTi",
      "year": 2017,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 166000,
      "mileageUnit": "km",
      "enginePowerHp": 136,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-todorov-auto",
      "type": "dealer",
      "displayName": "Автосалон Тодоров",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T01:47:15.702Z",
    "promoted": false
  },
  {
    "id": "21784126666986144",
    "slug": "mercedes-benz-glc-43-amg-4matic-986144",
    "category": "car",
    "dealerOrgId": "dealer-todorov-auto",
    "status": "active",
    "title": "Mercedes-Benz GLC 43 AMG 4Matic",
    "description": "Mercedes-Benz GLC 43 AMG 4Matic, 2020 г., 142 065 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://todorovauto.mobile.bg/obiava-21784126666986144-mercedes-benz-glc-43-amg-4matic-390-k-s",
    "price": {
      "amount": 35750,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21784126666986144-1.webp",
        "alt": "Mercedes-Benz GLC 43 AMG 4Matic — снимка 1"
      },
      {
        "url": "/dealer/stock/21784126666986144-2.webp",
        "alt": "Mercedes-Benz GLC 43 AMG 4Matic — снимка 2"
      },
      {
        "url": "/dealer/stock/21784126666986144-3.webp",
        "alt": "Mercedes-Benz GLC 43 AMG 4Matic — снимка 3"
      },
      {
        "url": "/dealer/stock/21784126666986144-4.webp",
        "alt": "Mercedes-Benz GLC 43 AMG 4Matic — снимка 4"
      },
      {
        "url": "/dealer/stock/21784126666986144-5.webp",
        "alt": "Mercedes-Benz GLC 43 AMG 4Matic — снимка 5"
      },
      {
        "url": "/dealer/stock/21784126666986144-6.webp",
        "alt": "Mercedes-Benz GLC 43 AMG 4Matic — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Изгрев",
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
        "bg": "Рейлинг на покрива",
        "en": "Рейлинг на покрива"
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
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Шибедах",
        "en": "Шибедах"
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
        "bg": "360 camera \\ Задна камера",
        "en": "360 camera \\ Задна камера"
      },
      {
        "bg": "Apple CarPlay \\ Android Auto",
        "en": "Apple CarPlay \\ Android Auto"
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
        "bg": "Автоматично затваряне на багажника",
        "en": "Автоматично затваряне на багажника"
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
        "bg": "Вентилация на седалките",
        "en": "Вентилация на седалките"
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
        "bg": "Отопление на волана",
        "en": "Отопление на волана"
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
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      }
    ],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "GLC 43 AMG 4Matic",
      "year": 2020,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 142065,
      "mileageUnit": "km",
      "enginePowerHp": 390,
      "colorExterior": "Тъмно сив"
    },
    "seller": {
      "id": "dealer-todorov-auto",
      "type": "dealer",
      "displayName": "Автосалон Тодоров",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T01:47:15.704Z",
    "promoted": false
  },
  {
    "id": "11776511305281815",
    "slug": "vw-caddy-1-4-tsi-dsg-281815",
    "category": "car",
    "dealerOrgId": "dealer-todorov-auto",
    "status": "active",
    "title": "VW Caddy 1.4 TSI DSG",
    "description": "VW Caddy 1.4 TSI DSG, 2017 г., 192 781 км. Цената е с включено ДДС. Публикувана обява, наблюдавана на 09.09.2026 г. Наличността, техническото състояние и условията се потвърждават от продавача. Източник: https://todorovauto.mobile.bg/obiava-11776511305281815-vw-caddy-1-4tsi-bluemotion-technology-dsg",
    "price": {
      "amount": 9450,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11776511305281815-1.webp",
        "alt": "VW Caddy 1.4 TSI DSG — снимка 1"
      },
      {
        "url": "/dealer/stock/11776511305281815-2.webp",
        "alt": "VW Caddy 1.4 TSI DSG — снимка 2"
      },
      {
        "url": "/dealer/stock/11776511305281815-3.webp",
        "alt": "VW Caddy 1.4 TSI DSG — снимка 3"
      },
      {
        "url": "/dealer/stock/11776511305281815-4.webp",
        "alt": "VW Caddy 1.4 TSI DSG — снимка 4"
      },
      {
        "url": "/dealer/stock/11776511305281815-5.webp",
        "alt": "VW Caddy 1.4 TSI DSG — снимка 5"
      },
      {
        "url": "/dealer/stock/11776511305281815-6.webp",
        "alt": "VW Caddy 1.4 TSI DSG — снимка 6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Бургас",
      "region": "Изгрев",
      "country": "България"
    },
    "features": [
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
      },
      {
        "bg": "Въздушни възглавници - Предни",
        "en": "Въздушни възглавници - Предни"
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
        "bg": "Централно заключване",
        "en": "Централно заключване"
      },
      {
        "bg": "Auto Start Stop function",
        "en": "Auto Start Stop function"
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
        "bg": "Ел. Огледала",
        "en": "Ел. Огледала"
      },
      {
        "bg": "Ел. Стъкла",
        "en": "Ел. Стъкла"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Хомологация N1",
        "en": "Хомологация N1"
      }
    ],
    "spec": {
      "make": "VW",
      "model": "Caddy 1.4 TSI DSG",
      "year": 2017,
      "bodyType": "van",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 192781,
      "mileageUnit": "km",
      "enginePowerHp": 125,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-todorov-auto",
      "type": "dealer",
      "displayName": "Автосалон Тодоров",
      "verificationStatus": "unverified",
      "city": "Бургас",
      "logoUrl": "/dealer/logo-light.png"
    },
    "publishedAt": "2026-09-09T01:47:15.705Z",
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
