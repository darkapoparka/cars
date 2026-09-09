import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "kc-11788863173361582",
    "slug": "toyota-camry-2-5-hybrid-comfort-361582",
    "category": "car",
    "dealerOrgId": "dealer-kris-car-plovdiv",
    "status": "active",
    "title": "Toyota Camry 2.5 Hybrid Comfort",
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. За хибридите не е извършена проверка на състоянието на батерията. Цената е с включено ДДС Източник: https://kris_car.mobile.bg/obiava-11788863173361582-toyota-camry-comfort-2-5-dual-vvti-hybrid-b-garantsiya-do-2032g",
    "price": {
      "amount": 29460,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11788863173361582-1.webp",
        "alt": "Toyota Camry 2.5 Hybrid Comfort — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11788863173361582-2.webp",
        "alt": "Toyota Camry 2.5 Hybrid Comfort — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11788863173361582-3.webp",
        "alt": "Toyota Camry 2.5 Hybrid Comfort — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11788863173361582-4.webp",
        "alt": "Toyota Camry 2.5 Hybrid Comfort — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона - Изток",
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
        "bg": "Каско",
        "en": "Каско"
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
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      }
    ],
    "spec": {
      "make": "Toyota",
      "model": "Camry",
      "year": 2022,
      "bodyType": "sedan",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 87358,
      "mileageUnit": "km",
      "enginePowerHp": 218,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-kris-car-plovdiv",
      "type": "dealer",
      "displayName": "Крис Кар",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/brand/logo-light.png"
    },
    "promoted": false,
    "publishedAt": "2026-09-08T13:26:00+03:00",
    "supply": {
      "nativePrice": {
        "amount": 29460,
        "currency": "EUR"
      },
      "origin": {
        "city": "Пловдив",
        "country": "България",
        "countryCode": "BG"
      },
      "delivery": {
        "eligibleCountryCodes": [],
        "status": "unknown"
      },
      "documentCount": 0,
      "landedCostStatus": "not_calculated",
      "priceConversion": {
        "status": "native"
      },
      "provenance": {
        "sourceKind": "manual",
        "sourceDisplayName": "Крис Кар / Mobile.bg — извадка 09.09.2026",
        "externalReference": "11788863173361582",
        "freshnessStatus": "unknown"
      },
      "supplier": {
        "verifiedImporter": false,
        "orgType": "dealer",
        "trustStatus": "unverified"
      }
    }
  },
  {
    "id": "kc-21788856265448667",
    "slug": "seat-ateca-4x4-2-0-tdi-448667",
    "category": "car",
    "dealerOrgId": "dealer-kris-car-plovdiv",
    "status": "active",
    "title": "SEAT Ateca 4x4 2.0 TDI",
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. Цената е с включено ДДС Източник: https://kris_car.mobile.bg/obiava-21788856265448667-seat-ateca-4h4-190ks",
    "price": {
      "amount": 21960,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21788856265448667-1.webp",
        "alt": "SEAT Ateca 4x4 2.0 TDI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/21788856265448667-2.webp",
        "alt": "SEAT Ateca 4x4 2.0 TDI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/21788856265448667-3.webp",
        "alt": "SEAT Ateca 4x4 2.0 TDI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/21788856265448667-4.webp",
        "alt": "SEAT Ateca 4x4 2.0 TDI — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона - Изток",
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
        "bg": "Автоматично затваряне на багажника",
        "en": "Автоматично затваряне на багажника"
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
      "make": "Seat",
      "model": "Ateca",
      "year": 2020,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 77257,
      "mileageUnit": "km",
      "enginePowerHp": 190,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-kris-car-plovdiv",
      "type": "dealer",
      "displayName": "Крис Кар",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/brand/logo-light.png"
    },
    "promoted": false,
    "publishedAt": "2026-09-08T11:31:00+03:00",
    "supply": {
      "nativePrice": {
        "amount": 21960,
        "currency": "EUR"
      },
      "origin": {
        "city": "Пловдив",
        "country": "България",
        "countryCode": "BG"
      },
      "delivery": {
        "eligibleCountryCodes": [],
        "status": "unknown"
      },
      "documentCount": 0,
      "landedCostStatus": "not_calculated",
      "priceConversion": {
        "status": "native"
      },
      "provenance": {
        "sourceKind": "manual",
        "sourceDisplayName": "Крис Кар / Mobile.bg — извадка 09.09.2026",
        "externalReference": "21788856265448667",
        "freshnessStatus": "unknown"
      },
      "supplier": {
        "verifiedImporter": false,
        "orgType": "dealer",
        "trustStatus": "unverified"
      }
    }
  },
  {
    "id": "kc-21781080017250424",
    "slug": "volkswagen-tiguan-elegance-4x4-250424",
    "category": "car",
    "dealerOrgId": "dealer-kris-car-plovdiv",
    "status": "active",
    "title": "Volkswagen Tiguan Elegance 4x4",
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. Цената е с включено ДДС Източник: https://kris_car.mobile.bg/obiava-21781080017250424-vw-tiguan-elegance-s-garantsiya-4h4-2-0tdi-a-t",
    "price": {
      "amount": 32560,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/21781080017250424-1.webp",
        "alt": "Volkswagen Tiguan Elegance 4x4 — снимка от обявата"
      },
      {
        "url": "/dealer/stock/21781080017250424-2.webp",
        "alt": "Volkswagen Tiguan Elegance 4x4 — снимка от обявата"
      },
      {
        "url": "/dealer/stock/21781080017250424-3.webp",
        "alt": "Volkswagen Tiguan Elegance 4x4 — снимка от обявата"
      },
      {
        "url": "/dealer/stock/21781080017250424-4.webp",
        "alt": "Volkswagen Tiguan Elegance 4x4 — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона - Изток",
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
        "bg": "Каско",
        "en": "Каско"
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
      "make": "Volkswagen",
      "model": "Tiguan",
      "year": 2021,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 128422,
      "mileageUnit": "km",
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-kris-car-plovdiv",
      "type": "dealer",
      "displayName": "Крис Кар",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/brand/logo-light.png"
    },
    "promoted": false,
    "publishedAt": "2026-09-05T08:18:00+03:00",
    "supply": {
      "nativePrice": {
        "amount": 32560,
        "currency": "EUR"
      },
      "origin": {
        "city": "Пловдив",
        "country": "България",
        "countryCode": "BG"
      },
      "delivery": {
        "eligibleCountryCodes": [],
        "status": "unknown"
      },
      "documentCount": 0,
      "landedCostStatus": "not_calculated",
      "priceConversion": {
        "status": "native"
      },
      "provenance": {
        "sourceKind": "manual",
        "sourceDisplayName": "Крис Кар / Mobile.bg — извадка 09.09.2026",
        "externalReference": "21781080017250424",
        "freshnessStatus": "unknown"
      },
      "supplier": {
        "verifiedImporter": false,
        "orgType": "dealer",
        "trustStatus": "unverified"
      }
    }
  },
  {
    "id": "kc-11780494813207389",
    "slug": "volkswagen-golf-1-5-etsi-207389",
    "category": "car",
    "dealerOrgId": "dealer-kris-car-plovdiv",
    "status": "active",
    "title": "Volkswagen Golf 1.5 eTSI",
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. За хибридите не е извършена проверка на състоянието на батерията. Цената е с включено ДДС Източник: https://kris_car.mobile.bg/obiava-11780494813207389-vw-golf-1-5-e-tsi-150ks-a-t",
    "price": {
      "amount": 21860,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11780494813207389-1.webp",
        "alt": "Volkswagen Golf 1.5 eTSI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11780494813207389-2.webp",
        "alt": "Volkswagen Golf 1.5 eTSI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11780494813207389-3.webp",
        "alt": "Volkswagen Golf 1.5 eTSI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11780494813207389-4.webp",
        "alt": "Volkswagen Golf 1.5 eTSI — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона - Изток",
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
        "bg": "Каско",
        "en": "Каско"
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
      },
      {
        "bg": "Хладилна жабка",
        "en": "Хладилна жабка"
      }
    ],
    "spec": {
      "make": "Volkswagen",
      "model": "Golf",
      "year": 2022,
      "bodyType": "hatchback",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 83965,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-kris-car-plovdiv",
      "type": "dealer",
      "displayName": "Крис Кар",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/brand/logo-light.png"
    },
    "promoted": false,
    "publishedAt": "2026-09-05T08:18:00+03:00",
    "supply": {
      "nativePrice": {
        "amount": 21860,
        "currency": "EUR"
      },
      "origin": {
        "city": "Пловдив",
        "country": "България",
        "countryCode": "BG"
      },
      "delivery": {
        "eligibleCountryCodes": [],
        "status": "unknown"
      },
      "documentCount": 0,
      "landedCostStatus": "not_calculated",
      "priceConversion": {
        "status": "native"
      },
      "provenance": {
        "sourceKind": "manual",
        "sourceDisplayName": "Крис Кар / Mobile.bg — извадка 09.09.2026",
        "externalReference": "11780494813207389",
        "freshnessStatus": "unknown"
      },
      "supplier": {
        "verifiedImporter": false,
        "orgType": "dealer",
        "trustStatus": "unverified"
      }
    }
  },
  {
    "id": "kc-11788352260592650",
    "slug": "volkswagen-arteon-2-0-tdi-592650",
    "category": "car",
    "dealerOrgId": "dealer-kris-car-plovdiv",
    "status": "active",
    "title": "Volkswagen Arteon 2.0 TDI",
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. Цената е с включено ДДС Източник: https://kris_car.mobile.bg/obiava-11788352260592650-vw-arteon-s-garantsiya-a-t-190ks",
    "price": {
      "amount": 25460,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11788352260592650-1.webp",
        "alt": "Volkswagen Arteon 2.0 TDI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11788352260592650-2.webp",
        "alt": "Volkswagen Arteon 2.0 TDI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11788352260592650-3.webp",
        "alt": "Volkswagen Arteon 2.0 TDI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11788352260592650-4.webp",
        "alt": "Volkswagen Arteon 2.0 TDI — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона - Изток",
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
        "bg": "Безключово палене",
        "en": "Безключово палене"
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
      "make": "Volkswagen",
      "model": "Arteon",
      "year": 2020,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 94910,
      "mileageUnit": "km",
      "enginePowerHp": 190,
      "colorExterior": "Перла"
    },
    "seller": {
      "id": "dealer-kris-car-plovdiv",
      "type": "dealer",
      "displayName": "Крис Кар",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/brand/logo-light.png"
    },
    "promoted": false,
    "publishedAt": "2026-09-05T08:17:00+03:00",
    "supply": {
      "nativePrice": {
        "amount": 25460,
        "currency": "EUR"
      },
      "origin": {
        "city": "Пловдив",
        "country": "България",
        "countryCode": "BG"
      },
      "delivery": {
        "eligibleCountryCodes": [],
        "status": "unknown"
      },
      "documentCount": 0,
      "landedCostStatus": "not_calculated",
      "priceConversion": {
        "status": "native"
      },
      "provenance": {
        "sourceKind": "manual",
        "sourceDisplayName": "Крис Кар / Mobile.bg — извадка 09.09.2026",
        "externalReference": "11788352260592650",
        "freshnessStatus": "unknown"
      },
      "supplier": {
        "verifiedImporter": false,
        "orgType": "dealer",
        "trustStatus": "unverified"
      }
    }
  },
  {
    "id": "kc-11760713901930244",
    "slug": "toyota-yaris-1-5-hybrid-930244",
    "category": "car",
    "dealerOrgId": "dealer-kris-car-plovdiv",
    "status": "active",
    "title": "Toyota Yaris 1.5 Hybrid",
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. За хибридите не е извършена проверка на състоянието на батерията. Цената е с включено ДДС Източник: https://kris_car.mobile.bg/obiava-11760713901930244-toyota-yaris-kamera-1-5-hybrid-a-t-v-garantsiya",
    "price": {
      "amount": 17560,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11760713901930244-1.webp",
        "alt": "Toyota Yaris 1.5 Hybrid — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11760713901930244-2.webp",
        "alt": "Toyota Yaris 1.5 Hybrid — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11760713901930244-3.webp",
        "alt": "Toyota Yaris 1.5 Hybrid — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11760713901930244-4.webp",
        "alt": "Toyota Yaris 1.5 Hybrid — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона - Изток",
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
        "bg": "Bluetooth \\ handsfree система",
        "en": "Bluetooth \\ handsfree система"
      },
      {
        "bg": "Steptronic, Tiptronic",
        "en": "Steptronic, Tiptronic"
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
      "make": "Toyota",
      "model": "Yaris",
      "year": 2021,
      "bodyType": "hatchback",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 79828,
      "mileageUnit": "km",
      "enginePowerHp": 115,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-kris-car-plovdiv",
      "type": "dealer",
      "displayName": "Крис Кар",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/brand/logo-light.png"
    },
    "promoted": false,
    "publishedAt": "2026-09-05T08:17:00+03:00",
    "supply": {
      "nativePrice": {
        "amount": 17560,
        "currency": "EUR"
      },
      "origin": {
        "city": "Пловдив",
        "country": "България",
        "countryCode": "BG"
      },
      "delivery": {
        "eligibleCountryCodes": [],
        "status": "unknown"
      },
      "documentCount": 0,
      "landedCostStatus": "not_calculated",
      "priceConversion": {
        "status": "native"
      },
      "provenance": {
        "sourceKind": "manual",
        "sourceDisplayName": "Крис Кар / Mobile.bg — извадка 09.09.2026",
        "externalReference": "11760713901930244",
        "freshnessStatus": "unknown"
      },
      "supplier": {
        "verifiedImporter": false,
        "orgType": "dealer",
        "trustStatus": "unverified"
      }
    }
  },
  {
    "id": "kc-11762013228736167",
    "slug": "toyota-corolla-1-6-executive-736167",
    "category": "car",
    "dealerOrgId": "dealer-kris-car-plovdiv",
    "status": "active",
    "title": "Toyota Corolla 1.6 Executive",
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. Цената е с включено ДДС Източник: https://kris_car.mobile.bg/obiava-11762013228736167-toyota-corolla-executive-kamera-1-6-m-t-b-garantsiya",
    "price": {
      "amount": 19760,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11762013228736167-1.webp",
        "alt": "Toyota Corolla 1.6 Executive — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11762013228736167-2.webp",
        "alt": "Toyota Corolla 1.6 Executive — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11762013228736167-3.webp",
        "alt": "Toyota Corolla 1.6 Executive — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11762013228736167-4.webp",
        "alt": "Toyota Corolla 1.6 Executive — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона - Изток",
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
      "make": "Toyota",
      "model": "Corolla",
      "year": 2020,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 86291,
      "mileageUnit": "km",
      "enginePowerHp": 132,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-kris-car-plovdiv",
      "type": "dealer",
      "displayName": "Крис Кар",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/brand/logo-light.png"
    },
    "promoted": false,
    "publishedAt": "2026-09-05T08:17:00+03:00",
    "supply": {
      "nativePrice": {
        "amount": 19760,
        "currency": "EUR"
      },
      "origin": {
        "city": "Пловдив",
        "country": "България",
        "countryCode": "BG"
      },
      "delivery": {
        "eligibleCountryCodes": [],
        "status": "unknown"
      },
      "documentCount": 0,
      "landedCostStatus": "not_calculated",
      "priceConversion": {
        "status": "native"
      },
      "provenance": {
        "sourceKind": "manual",
        "sourceDisplayName": "Крис Кар / Mobile.bg — извадка 09.09.2026",
        "externalReference": "11762013228736167",
        "freshnessStatus": "unknown"
      },
      "supplier": {
        "verifiedImporter": false,
        "orgType": "dealer",
        "trustStatus": "unverified"
      }
    }
  },
  {
    "id": "kc-11744304007224639",
    "slug": "skoda-superb-2-0-tdi-224639",
    "category": "car",
    "dealerOrgId": "dealer-kris-car-plovdiv",
    "status": "active",
    "title": "Škoda Superb 2.0 TDI",
    "description": "Данни от обявата към 09.09.2026 г.; наличност, пробег и оборудване се потвърждават с продавача. Гаранционните твърдения в източника не са независимо проверени; поискайте валиден сертификат и условия. Цената е с включено ДДС Източник: https://kris_car.mobile.bg/obiava-11744304007224639-skoda-superb-s-garantsiya-2-0tdi-a-t-200ks",
    "price": {
      "amount": 26860,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/stock/11744304007224639-1.webp",
        "alt": "Škoda Superb 2.0 TDI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11744304007224639-2.webp",
        "alt": "Škoda Superb 2.0 TDI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11744304007224639-3.webp",
        "alt": "Škoda Superb 2.0 TDI — снимка от обявата"
      },
      {
        "url": "/dealer/stock/11744304007224639-4.webp",
        "alt": "Škoda Superb 2.0 TDI — снимка от обявата"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Пловдив",
      "region": "Индустриална зона - Изток",
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
      "make": "Skoda",
      "model": "Superb",
      "year": 2021,
      "bodyType": "sedan",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 117501,
      "mileageUnit": "km",
      "enginePowerHp": 200,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-kris-car-plovdiv",
      "type": "dealer",
      "displayName": "Крис Кар",
      "verificationStatus": "unverified",
      "city": "Пловдив",
      "logoUrl": "/dealer/brand/logo-light.png"
    },
    "promoted": false,
    "publishedAt": "2026-09-05T08:16:00+03:00",
    "supply": {
      "nativePrice": {
        "amount": 26860,
        "currency": "EUR"
      },
      "origin": {
        "city": "Пловдив",
        "country": "България",
        "countryCode": "BG"
      },
      "delivery": {
        "eligibleCountryCodes": [],
        "status": "unknown"
      },
      "documentCount": 0,
      "landedCostStatus": "not_calculated",
      "priceConversion": {
        "status": "native"
      },
      "provenance": {
        "sourceKind": "manual",
        "sourceDisplayName": "Крис Кар / Mobile.bg — извадка 09.09.2026",
        "externalReference": "11744304007224639",
        "freshnessStatus": "unknown"
      },
      "supplier": {
        "verifiedImporter": false,
        "orgType": "dealer",
        "trustStatus": "unverified"
      }
    }
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

export const mockSavedListingIds = [];

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
