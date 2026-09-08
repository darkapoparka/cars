import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "legend-11774263732166588",
    "slug": "legend-11774263732166588",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Audi Q4 Q4 e-tron 45 QUATTRO, DIGITAL, ТЕРМОПОМПА 29000km",
    "description": "Audi Q4 Q4 e-tron 45 QUATTRO, DIGITAL, ТЕРМОПОМПА 29000km. 2024 г., 29 000 км, електрически, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11774263732166588-audi-q4-q4-e-tron-45-quattro-digital-termopompa-29000km",
    "price": {
      "amount": 37999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-01-1.webp",
        "alt": "Audi Q4 Q4 e-tron 45 QUATTRO, DIGITAL, ТЕРМОПОМПА 29000km"
      },
      {
        "url": "/assets/legend-auto/vehicle-01-2.webp",
        "alt": "Audi Q4 Q4 e-tron 45 QUATTRO, DIGITAL, ТЕРМОПОМПА 29000km"
      },
      {
        "url": "/assets/legend-auto/vehicle-01-3.webp",
        "alt": "Audi Q4 Q4 e-tron 45 QUATTRO, DIGITAL, ТЕРМОПОМПА 29000km"
      },
      {
        "url": "/assets/legend-auto/vehicle-01-4.webp",
        "alt": "Audi Q4 Q4 e-tron 45 QUATTRO, DIGITAL, ТЕРМОПОМПА 29000km"
      },
      {
        "url": "/assets/legend-auto/vehicle-01-5.webp",
        "alt": "Audi Q4 Q4 e-tron 45 QUATTRO, DIGITAL, ТЕРМОПОМПА 29000km"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
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
        "bg": "Apple CarPlay \\ Android Auto",
        "en": "Apple CarPlay \\ Android Auto"
      },
      {
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "DVD",
        "en": "DVD"
      },
      {
        "bg": "TV",
        "en": "TV"
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
        "bg": "Автоматично затваряне на багажника",
        "en": "Автоматично затваряне на багажника"
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
        "bg": "Безключово палене ",
        "en": "Безключово палене "
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
        "bg": "Ел. разпределяне на спирачното усилие",
        "en": "Ел. разпределяне на спирачното усилие"
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
        "bg": "Лети джанти",
        "en": "Лети джанти"
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
        "bg": "Термопомпа",
        "en": "Термопомпа"
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
      "make": "Audi",
      "model": "Q4",
      "year": 2024,
      "bodyType": "suv",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 29000,
      "mileageUnit": "km",
      "enginePowerHp": 282,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T00:00:00.000Z",
    "promoted": false
  },
  {
    "id": "legend-11784618839120443",
    "slug": "legend-11784618839120443",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Seat Leon 2.0TDI",
    "description": "Seat Leon 2.0TDI. 2017 г., 200 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11784618839120443-seat-leon-2-0tdi",
    "price": {
      "amount": 7999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-02-1.webp",
        "alt": "Seat Leon 2.0TDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-02-2.webp",
        "alt": "Seat Leon 2.0TDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-02-3.webp",
        "alt": "Seat Leon 2.0TDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-02-4.webp",
        "alt": "Seat Leon 2.0TDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-02-5.webp",
        "alt": "Seat Leon 2.0TDI"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
      "country": "България"
    },
    "features": [
      {
        "bg": "Аларма",
        "en": "Аларма"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
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
        "bg": "Климатроник",
        "en": "Климатроник"
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
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
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
      "make": "Seat",
      "model": "Leon",
      "year": 2017,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 200000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:59.000Z",
    "promoted": false
  },
  {
    "id": "legend-21785269571488349",
    "slug": "legend-21785269571488349",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "VW Tiguan 2.0TDI 150 к.с DSG 122000км НАВИГАЦИЯ",
    "description": "VW Tiguan 2.0TDI 150 к.с DSG 122000км НАВИГАЦИЯ. 2019 г., 122 000 км, дизел, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-21785269571488349-vw-tiguan-2-0tdi-150-k-s-dsg-122000km-navigatsiya",
    "price": {
      "amount": 16999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-03-1.webp",
        "alt": "VW Tiguan 2.0TDI 150 к.с DSG 122000км НАВИГАЦИЯ"
      },
      {
        "url": "/assets/legend-auto/vehicle-03-2.webp",
        "alt": "VW Tiguan 2.0TDI 150 к.с DSG 122000км НАВИГАЦИЯ"
      },
      {
        "url": "/assets/legend-auto/vehicle-03-3.webp",
        "alt": "VW Tiguan 2.0TDI 150 к.с DSG 122000км НАВИГАЦИЯ"
      },
      {
        "url": "/assets/legend-auto/vehicle-03-4.webp",
        "alt": "VW Tiguan 2.0TDI 150 к.с DSG 122000км НАВИГАЦИЯ"
      },
      {
        "url": "/assets/legend-auto/vehicle-03-5.webp",
        "alt": "VW Tiguan 2.0TDI 150 к.с DSG 122000км НАВИГАЦИЯ"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
      "country": "България"
    },
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Apple CarPlay \\ Android Auto",
        "en": "Apple CarPlay \\ Android Auto"
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
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "VW",
      "model": "Tiguan",
      "year": 2019,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 122000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:58.000Z",
    "promoted": false
  },
  {
    "id": "legend-11788186558085673",
    "slug": "legend-11788186558085673",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "VW Passat 2.0TDI DSG НАВИГАЦИЯ .ПОДГРЕВ НА СЕДАЛКИ",
    "description": "VW Passat 2.0TDI DSG НАВИГАЦИЯ .ПОДГРЕВ НА СЕДАЛКИ. 2015 г., 220 000 км, дизел, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11788186558085673-vw-passat-2-0tdi-dsg-navigatsiya-podgrev-na-sedalki",
    "price": {
      "amount": 9999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-04-1.webp",
        "alt": "VW Passat 2.0TDI DSG НАВИГАЦИЯ .ПОДГРЕВ НА СЕДАЛКИ"
      },
      {
        "url": "/assets/legend-auto/vehicle-04-2.webp",
        "alt": "VW Passat 2.0TDI DSG НАВИГАЦИЯ .ПОДГРЕВ НА СЕДАЛКИ"
      },
      {
        "url": "/assets/legend-auto/vehicle-04-3.webp",
        "alt": "VW Passat 2.0TDI DSG НАВИГАЦИЯ .ПОДГРЕВ НА СЕДАЛКИ"
      },
      {
        "url": "/assets/legend-auto/vehicle-04-4.webp",
        "alt": "VW Passat 2.0TDI DSG НАВИГАЦИЯ .ПОДГРЕВ НА СЕДАЛКИ"
      },
      {
        "url": "/assets/legend-auto/vehicle-04-5.webp",
        "alt": "VW Passat 2.0TDI DSG НАВИГАЦИЯ .ПОДГРЕВ НА СЕДАЛКИ"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
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
        "bg": "Безключово палене ",
        "en": "Безключово палене "
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
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
      "make": "VW",
      "model": "Passat",
      "year": 2015,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 220000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:57.000Z",
    "promoted": false
  },
  {
    "id": "legend-11788202283254523",
    "slug": "legend-11788202283254523",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "VW Golf 1.9TDI 105к.с",
    "description": "VW Golf 1.9TDI 105к.с. 2005 г., 205 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11788202283254523-vw-golf-1-9tdi-105k-s",
    "price": {
      "amount": 3599,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-05-1.webp",
        "alt": "VW Golf 1.9TDI 105к.с"
      },
      {
        "url": "/assets/legend-auto/vehicle-05-2.webp",
        "alt": "VW Golf 1.9TDI 105к.с"
      },
      {
        "url": "/assets/legend-auto/vehicle-05-3.webp",
        "alt": "VW Golf 1.9TDI 105к.с"
      },
      {
        "url": "/assets/legend-auto/vehicle-05-4.webp",
        "alt": "VW Golf 1.9TDI 105к.с"
      },
      {
        "url": "/assets/legend-auto/vehicle-05-5.webp",
        "alt": "VW Golf 1.9TDI 105к.с"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
      "country": "България"
    },
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Антиблокираща система",
        "en": "Антиблокираща система"
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
        "bg": "Металик",
        "en": "Металик"
      },
      {
        "bg": "Нов внос",
        "en": "Нов внос"
      },
      {
        "bg": "Подгряване на седалките",
        "en": "Подгряване на седалките"
      },
      {
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      }
    ],
    "spec": {
      "make": "VW",
      "model": "Golf",
      "year": 2005,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 205000,
      "mileageUnit": "km",
      "enginePowerHp": 105,
      "colorExterior": "Tъмно син"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:56.000Z",
    "promoted": false
  },
  {
    "id": "legend-11782331844226239",
    "slug": "legend-11782331844226239",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Toyota Yaris 1.5 Хибрид Камера 4л/100км",
    "description": "Toyota Yaris 1.5 Хибрид Камера 4л/100км. 2012 г., 169 000 км, хибрид, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11782331844226239-toyota-yaris-1-5-hibrid-kamera-4l-100km",
    "price": {
      "amount": 7999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-06-1.webp",
        "alt": "Toyota Yaris 1.5 Хибрид Камера 4л/100км"
      },
      {
        "url": "/assets/legend-auto/vehicle-06-2.webp",
        "alt": "Toyota Yaris 1.5 Хибрид Камера 4л/100км"
      },
      {
        "url": "/assets/legend-auto/vehicle-06-3.webp",
        "alt": "Toyota Yaris 1.5 Хибрид Камера 4л/100км"
      },
      {
        "url": "/assets/legend-auto/vehicle-06-4.webp",
        "alt": "Toyota Yaris 1.5 Хибрид Камера 4л/100км"
      },
      {
        "url": "/assets/legend-auto/vehicle-06-5.webp",
        "alt": "Toyota Yaris 1.5 Хибрид Камера 4л/100км"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
      "country": "България"
    },
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
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
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Toyota",
      "model": "Yaris",
      "year": 2012,
      "bodyType": "hatchback",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 169000,
      "mileageUnit": "km",
      "colorExterior": "Зелен"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:55.000Z",
    "promoted": false
  },
  {
    "id": "legend-21787135215316819",
    "slug": "legend-21787135215316819",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Toyota Rav4 2.5 HYBRID/ГАЗ FULL НАВИГАЦИЯ, КОЖЕН САЛОН, FULL",
    "description": "Toyota Rav4 2.5 HYBRID/ГАЗ FULL НАВИГАЦИЯ, КОЖЕН САЛОН, FULL. 2022 г., 252 000 км, хибрид, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-21787135215316819-toyota-rav4-2-5-hybrid-gaz-full-navigatsiya-kozhen-salon-full",
    "price": {
      "amount": 26999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-07-1.webp",
        "alt": "Toyota Rav4 2.5 HYBRID/ГАЗ FULL НАВИГАЦИЯ, КОЖЕН САЛОН, FULL"
      },
      {
        "url": "/assets/legend-auto/vehicle-07-2.webp",
        "alt": "Toyota Rav4 2.5 HYBRID/ГАЗ FULL НАВИГАЦИЯ, КОЖЕН САЛОН, FULL"
      },
      {
        "url": "/assets/legend-auto/vehicle-07-3.webp",
        "alt": "Toyota Rav4 2.5 HYBRID/ГАЗ FULL НАВИГАЦИЯ, КОЖЕН САЛОН, FULL"
      },
      {
        "url": "/assets/legend-auto/vehicle-07-4.webp",
        "alt": "Toyota Rav4 2.5 HYBRID/ГАЗ FULL НАВИГАЦИЯ, КОЖЕН САЛОН, FULL"
      },
      {
        "url": "/assets/legend-auto/vehicle-07-5.webp",
        "alt": "Toyota Rav4 2.5 HYBRID/ГАЗ FULL НАВИГАЦИЯ, КОЖЕН САЛОН, FULL"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
      "country": "България"
    },
    "features": [
      {
        "bg": "360 camera \\ Задна камера",
        "en": "360 camera \\ Задна камера"
      },
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Auto Start Stop function",
        "en": "Auto Start Stop function"
      },
      {
        "bg": "Apple CarPlay \\ Android Auto",
        "en": "Apple CarPlay \\ Android Auto"
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
        "bg": "Автоматично затваряне на багажника",
        "en": "Автоматично затваряне на багажника"
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
        "bg": "Газова уредба",
        "en": "Газова уредба"
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
        "bg": "Лети джанти",
        "en": "Лети джанти"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
      },
      {
        "bg": "Спойлери",
        "en": "Спойлери"
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
      "make": "Toyota",
      "model": "Rav4",
      "year": 2022,
      "bodyType": "suv",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 252000,
      "mileageUnit": "km",
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:54.000Z",
    "promoted": false
  },
  {
    "id": "legend-11786699392982478",
    "slug": "legend-11786699392982478",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Toyota Auris 2.0D4D",
    "description": "Toyota Auris 2.0D4D. 2009 г., 229 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11786699392982478-toyota-auris-2-0d4d",
    "price": {
      "amount": 4399,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-08-1.webp",
        "alt": "Toyota Auris 2.0D4D"
      },
      {
        "url": "/assets/legend-auto/vehicle-08-2.webp",
        "alt": "Toyota Auris 2.0D4D"
      },
      {
        "url": "/assets/legend-auto/vehicle-08-3.webp",
        "alt": "Toyota Auris 2.0D4D"
      },
      {
        "url": "/assets/legend-auto/vehicle-08-4.webp",
        "alt": "Toyota Auris 2.0D4D"
      },
      {
        "url": "/assets/legend-auto/vehicle-08-5.webp",
        "alt": "Toyota Auris 2.0D4D"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
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
        "bg": "Климатроник",
        "en": "Климатроник"
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
        "bg": "Мултифункционален волан",
        "en": "Мултифункционален волан"
      },
      {
        "bg": "Парктроник",
        "en": "Парктроник"
      },
      {
        "bg": "С регистрация",
        "en": "С регистрация"
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
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Toyota",
      "model": "Auris",
      "year": 2009,
      "bodyType": "hatchback",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 229000,
      "mileageUnit": "km",
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:53.000Z",
    "promoted": false
  },
  {
    "id": "legend-11787054081251501",
    "slug": "legend-11787054081251501",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Skoda Scala 1.6TDI",
    "description": "Skoda Scala 1.6TDI. 2019 г., 180 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11787054081251501-skoda-scala-1-6tdi",
    "price": {
      "amount": 11999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-09-1.webp",
        "alt": "Skoda Scala 1.6TDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-09-2.webp",
        "alt": "Skoda Scala 1.6TDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-09-3.webp",
        "alt": "Skoda Scala 1.6TDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-09-4.webp",
        "alt": "Skoda Scala 1.6TDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-09-5.webp",
        "alt": "Skoda Scala 1.6TDI"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
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
        "bg": "Apple CarPlay \\ Android Auto",
        "en": "Apple CarPlay \\ Android Auto"
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
        "bg": "Автоматично затваряне на багажника",
        "en": "Автоматично затваряне на багажника"
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
        "bg": "Система за контрол на скоростта (автопилот)",
        "en": "Система за контрол на скоростта (автопилот)"
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
      "make": "Skoda",
      "model": "Scala",
      "year": 2019,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 180000,
      "mileageUnit": "km",
      "enginePowerHp": 110,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:52.000Z",
    "promoted": false
  },
  {
    "id": "legend-11787771672265620",
    "slug": "legend-11787771672265620",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Renault Zoe 52kw 78000km Собствена батерия",
    "description": "Renault Zoe 52kw 78000km Собствена батерия. 2020 г., 78 000 км, електрически, автоматик скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11787771672265620-renault-zoe-52kw-78000km-sobstvena-bateriya",
    "price": {
      "amount": 14299,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-10-1.webp",
        "alt": "Renault Zoe 52kw 78000km Собствена батерия"
      },
      {
        "url": "/assets/legend-auto/vehicle-10-2.webp",
        "alt": "Renault Zoe 52kw 78000km Собствена батерия"
      },
      {
        "url": "/assets/legend-auto/vehicle-10-3.webp",
        "alt": "Renault Zoe 52kw 78000km Собствена батерия"
      },
      {
        "url": "/assets/legend-auto/vehicle-10-4.webp",
        "alt": "Renault Zoe 52kw 78000km Собствена батерия"
      },
      {
        "url": "/assets/legend-auto/vehicle-10-5.webp",
        "alt": "Renault Zoe 52kw 78000km Собствена батерия"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
      "country": "България"
    },
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "Apple CarPlay \\ Android Auto",
        "en": "Apple CarPlay \\ Android Auto"
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
        "bg": "Климатик",
        "en": "Климатик"
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
        "bg": "Лети джанти",
        "en": "Лети джанти"
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
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Renault",
      "model": "Zoe",
      "year": 2020,
      "bodyType": "hatchback",
      "fuelType": "electric",
      "transmission": "automatic",
      "mileageValue": 78000,
      "mileageUnit": "km",
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:51.000Z",
    "promoted": false
  },
  {
    "id": "legend-11777013326319103",
    "slug": "legend-11777013326319103",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Renault Clio 1.2 БЕНЗИН",
    "description": "Renault Clio 1.2 БЕНЗИН. 2014 г., 150 000 км, бензин, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11777013326319103-renault-clio-1-2-benzin",
    "price": {
      "amount": 5199,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-11-1.webp",
        "alt": "Renault Clio 1.2 БЕНЗИН"
      },
      {
        "url": "/assets/legend-auto/vehicle-11-2.webp",
        "alt": "Renault Clio 1.2 БЕНЗИН"
      },
      {
        "url": "/assets/legend-auto/vehicle-11-3.webp",
        "alt": "Renault Clio 1.2 БЕНЗИН"
      },
      {
        "url": "/assets/legend-auto/vehicle-11-4.webp",
        "alt": "Renault Clio 1.2 БЕНЗИН"
      },
      {
        "url": "/assets/legend-auto/vehicle-11-5.webp",
        "alt": "Renault Clio 1.2 БЕНЗИН"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
      "country": "България"
    },
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
      },
      {
        "bg": "LED фарове",
        "en": "LED фарове"
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
        "bg": "Лети джанти",
        "en": "Лети джанти"
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
        "bg": "Серво усилвател на волана",
        "en": "Серво усилвател на волана"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Renault",
      "model": "Clio",
      "year": 2014,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 150000,
      "mileageUnit": "km",
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:50.000Z",
    "promoted": false
  },
  {
    "id": "legend-11764232323880460",
    "slug": "legend-11764232323880460",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Peugeot 508 2.0HDI",
    "description": "Peugeot 508 2.0HDI. 2013 г., 232 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11764232323880460-peugeot-508-2-0hdi",
    "price": {
      "amount": 4299,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-12-1.webp",
        "alt": "Peugeot 508 2.0HDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-12-2.webp",
        "alt": "Peugeot 508 2.0HDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-12-3.webp",
        "alt": "Peugeot 508 2.0HDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-12-4.webp",
        "alt": "Peugeot 508 2.0HDI"
      },
      {
        "url": "/assets/legend-auto/vehicle-12-5.webp",
        "alt": "Peugeot 508 2.0HDI"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
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
        "bg": "Лети джанти",
        "en": "Лети джанти"
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
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Peugeot",
      "model": "508",
      "year": 2013,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 232000,
      "mileageUnit": "km",
      "enginePowerHp": 140,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:49.000Z",
    "promoted": false
  },
  {
    "id": "legend-11786966551654053",
    "slug": "legend-11786966551654053",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Opel Astra 1.6",
    "description": "Opel Astra 1.6. 2017 г., 193 000 км, дизел, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11786966551654053-opel-astra-1-6",
    "price": {
      "amount": 6599,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-13-1.webp",
        "alt": "Opel Astra 1.6"
      },
      {
        "url": "/assets/legend-auto/vehicle-13-2.webp",
        "alt": "Opel Astra 1.6"
      },
      {
        "url": "/assets/legend-auto/vehicle-13-3.webp",
        "alt": "Opel Astra 1.6"
      },
      {
        "url": "/assets/legend-auto/vehicle-13-4.webp",
        "alt": "Opel Astra 1.6"
      },
      {
        "url": "/assets/legend-auto/vehicle-13-5.webp",
        "alt": "Opel Astra 1.6"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
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
        "bg": "Лети джанти",
        "en": "Лети джанти"
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
        "bg": "Парктроник",
        "en": "Парктроник"
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
        "bg": "Халогенни фарове",
        "en": "Халогенни фарове"
      },
      {
        "bg": "Централно заключване",
        "en": "Централно заключване"
      }
    ],
    "spec": {
      "make": "Opel",
      "model": "Astra",
      "year": 2017,
      "bodyType": "wagon",
      "fuelType": "diesel",
      "transmission": "manual",
      "mileageValue": 193000,
      "mileageUnit": "km",
      "enginePowerHp": 161,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:48.000Z",
    "promoted": false
  },
  {
    "id": "legend-11725562013563390",
    "slug": "legend-11725562013563390",
    "category": "car",
    "dealerOrgId": "dealer-legend-auto",
    "status": "active",
    "title": "Opel Agila 1.3i Внос от Италия",
    "description": "Opel Agila 1.3i Внос от Италия. 2008 г., 120 000 км, бензин, ръчна скоростна кутия. Публикувана оферта от LEGEND AUTO. Потвърдете наличността и характеристиките преди оглед. Не се начислява ДДС. Оригинална обява: https://legendauto1.mobile.bg/obiava-11725562013563390-opel-agila-1-3i-vnos-ot-italiya",
    "price": {
      "amount": 2500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/legend-auto/vehicle-14-1.webp",
        "alt": "Opel Agila 1.3i Внос от Италия"
      },
      {
        "url": "/assets/legend-auto/vehicle-14-2.webp",
        "alt": "Opel Agila 1.3i Внос от Италия"
      },
      {
        "url": "/assets/legend-auto/vehicle-14-3.webp",
        "alt": "Opel Agila 1.3i Внос от Италия"
      },
      {
        "url": "/assets/legend-auto/vehicle-14-4.webp",
        "alt": "Opel Agila 1.3i Внос от Италия"
      },
      {
        "url": "/assets/legend-auto/vehicle-14-5.webp",
        "alt": "Opel Agila 1.3i Внос от Италия"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "бул. Цар Освободител 289, срещу МАКАО",
      "country": "България"
    },
    "features": [
      {
        "bg": "4(5) Врати",
        "en": "4(5) Врати"
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
        "bg": "Климатик",
        "en": "Климатик"
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
        "bg": "Сервизна книжка",
        "en": "Сервизна книжка"
      },
      {
        "bg": "Система ISOFIX",
        "en": "Система ISOFIX"
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
      "make": "Opel",
      "model": "Agila",
      "year": 2008,
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 120000,
      "mileageUnit": "km",
      "colorExterior": "Светло син"
    },
    "seller": {
      "id": "dealer-legend-auto",
      "type": "dealer",
      "displayName": "LEGEND AUTO",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-06T23:59:47.000Z",
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
