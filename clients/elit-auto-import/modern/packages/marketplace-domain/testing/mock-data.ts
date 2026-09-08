import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "elit-21717056982373192",
    "slug": "elit-21717056982373192",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Mercedes-Benz GL 450",
    "description": "Mercedes GL 450 4matic V8 Facelift ( X164 ) Автомобилът е внос от САЩ. Пробегът е в мили (114300 мили - 184000 км).  В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус.  Постоянен внос от САЩ на бензинови автомобили в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-21717056982373192-mercedes-benz-gl-450",
    "price": {
      "amount": 13500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/21717056982373192-0.webp",
        "alt": "Mercedes-Benz GL 450"
      },
      {
        "url": "/assets/elit/21717056982373192-1.webp",
        "alt": "Mercedes-Benz GL 450"
      },
      {
        "url": "/assets/elit/21717056982373192-2.webp",
        "alt": "Mercedes-Benz GL 450"
      },
      {
        "url": "/assets/elit/21717056982373192-3.webp",
        "alt": "Mercedes-Benz GL 450"
      },
      {
        "url": "/assets/elit/21717056982373192-4.webp",
        "alt": "Mercedes-Benz GL 450"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mercedes-Benz",
      "model": "GL 450",
      "year": 2010,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 184000,
      "mileageUnit": "km",
      "enginePowerHp": 340,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T10:00:00.000Z",
    "promoted": false
  },
  {
    "id": "elit-11700571967441521",
    "slug": "elit-11700571967441521",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Volvo S60",
    "description": "ПРИ ЗАКУПУВАНЕ НА АВТОМОБИЛ ОТ НАС МОЖЕ ДА ВИ ГО ДОСТАВИМ ДО ВСЯКО НАСЕЛЕНО МЯСТО В СТРАНАТА СЪС СОБСТВЕН ТРАНСПОРТ ! ! !  Volvo S60 Автомобилът в внос от Америка! Паркинг забележки! Пробегът е в мили (206500km)! В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус. Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11700571967441521-volvo-s60",
    "price": {
      "amount": 10890.52,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11700571967441521-0.webp",
        "alt": "Volvo S60"
      },
      {
        "url": "/assets/elit/11700571967441521-1.webp",
        "alt": "Volvo S60"
      },
      {
        "url": "/assets/elit/11700571967441521-2.webp",
        "alt": "Volvo S60"
      },
      {
        "url": "/assets/elit/11700571967441521-3.webp",
        "alt": "Volvo S60"
      },
      {
        "url": "/assets/elit/11700571967441521-4.webp",
        "alt": "Volvo S60"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Volvo",
      "model": "S60",
      "year": 2013,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 129000,
      "mileageUnit": "km",
      "enginePowerHp": 250,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:59.000Z",
    "promoted": false
  },
  {
    "id": "elit-11529502627430878",
    "slug": "elit-11529502627430878",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Toyota Prius  Hybrid",
    "description": "ПРИ ЗАКУПУВАНЕ НА АВТОМОБИЛ ОТ НАС МОЖЕ ДА ВИ ГО ДОСТАВИМ ДО ВСЯКО НАСЕЛЕНО МЯСТО В СТРАНАТА СЪС СОБСТВЕН ТРАНСПОРТ ! ! !  Пета еко категория Перфектен автомобил внос от Америка   абсолютно реални километри  камера Нови гуми всичко платено годишна винетка 2. 5 литра разход градско каране 3. 5 лира извънградско автомобила се ползва всеки ден - за оглед с предварителна уговорка Мы говорим по русски tel. /viber/whatsapp+359887777887 Пробегът е по данни на продавача. ДДС: вижте оригиналната обява. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11529502627430878-toyota-prius-hybrid",
    "price": {
      "amount": 16105.69,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11529502627430878-0.webp",
        "alt": "Toyota Prius  Hybrid"
      },
      {
        "url": "/assets/elit/11529502627430878-1.webp",
        "alt": "Toyota Prius  Hybrid"
      },
      {
        "url": "/assets/elit/11529502627430878-2.webp",
        "alt": "Toyota Prius  Hybrid"
      },
      {
        "url": "/assets/elit/11529502627430878-3.webp",
        "alt": "Toyota Prius  Hybrid"
      },
      {
        "url": "/assets/elit/11529502627430878-4.webp",
        "alt": "Toyota Prius  Hybrid"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Toyota",
      "model": "Prius  Hybrid",
      "year": 2016,
      "bodyType": "sedan",
      "fuelType": "hybrid",
      "transmission": "automatic",
      "mileageValue": 60950,
      "mileageUnit": "km",
      "enginePowerHp": 99,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:58.000Z",
    "promoted": false
  },
  {
    "id": "elit-11694454110383951",
    "slug": "elit-11694454110383951",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Subaru XV 2.5 Sport 4x4",
    "description": "ПРИ ЗАКУПУВАНЕ НА АВТОМОБИЛ ОТ НАС МОЖЕ ДА ВИ ГО ДОСТАВИМ ДО ВСЯКО НАСЕЛЕНО МЯСТО В СТРАНАТА СЪС СОБСТВЕН ТРАНСПОРТ ! ! !  2. 5 бензин 4х4 МОТОРЪТ Е С ВЕРИГА-FB25 Пробегът е в мили.  В цената са калкулирани всички разходи(мито, ДДС, технотест). Euro 6!  Продажба с фактура и договор без разходи за нотариус Автомобилът е внос от Америка, произведен е в Япония, без разлика от европейските модели. Постоянен внос от САЩ и Япония на бензинови автомобили от марката Subaru в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11694454110383951-subaru-xv-2-5-sport-4x4",
    "price": {
      "amount": 27800,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11694454110383951-0.webp",
        "alt": "Subaru XV 2.5 Sport 4x4"
      },
      {
        "url": "/assets/elit/11694454110383951-1.webp",
        "alt": "Subaru XV 2.5 Sport 4x4"
      },
      {
        "url": "/assets/elit/11694454110383951-2.webp",
        "alt": "Subaru XV 2.5 Sport 4x4"
      },
      {
        "url": "/assets/elit/11694454110383951-3.webp",
        "alt": "Subaru XV 2.5 Sport 4x4"
      },
      {
        "url": "/assets/elit/11694454110383951-4.webp",
        "alt": "Subaru XV 2.5 Sport 4x4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Subaru",
      "model": "XV 2.5 Sport 4x4",
      "year": 2021,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 200,
      "mileageUnit": "km",
      "enginePowerHp": 182,
      "colorExterior": "Жълт"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:57.000Z",
    "promoted": false
  },
  {
    "id": "elit-11694504370077664",
    "slug": "elit-11694504370077664",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Subaru XV 2.0 Limited 4x4",
    "description": "ПРИ ЗАКУПУВАНЕ НА АВТОМОБИЛ ОТ НАС МОЖЕ ДА ВИ ГО ДОСТАВИМ ДО ВСЯКО НАСЕЛЕНО МЯСТО В СТРАНАТА СЪС СОБСТВЕН ТРАНСПОРТ ! ! !  2. 0 бензин 4х4 МОТОРЪТ Е С ВЕРИГА-FB20 Пробегът е в мили.  В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус Автомобилът е внос от Америка, произведен е в Япония, без разлика от европейските модели. Постоянен внос от САЩ и Япония на бензинови автомобили от марката Subaru в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11694504370077664-subaru-xv-2-0-limited-4x4",
    "price": {
      "amount": 19000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11694504370077664-0.webp",
        "alt": "Subaru XV 2.0 Limited 4x4"
      },
      {
        "url": "/assets/elit/11694504370077664-1.webp",
        "alt": "Subaru XV 2.0 Limited 4x4"
      },
      {
        "url": "/assets/elit/11694504370077664-2.webp",
        "alt": "Subaru XV 2.0 Limited 4x4"
      },
      {
        "url": "/assets/elit/11694504370077664-3.webp",
        "alt": "Subaru XV 2.0 Limited 4x4"
      },
      {
        "url": "/assets/elit/11694504370077664-4.webp",
        "alt": "Subaru XV 2.0 Limited 4x4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Subaru",
      "model": "XV 2.0 Limited 4x4",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 55000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:56.000Z",
    "promoted": false
  },
  {
    "id": "elit-11752520414621839",
    "slug": "elit-11752520414621839",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Subaru XV 2.0 Premium 4x4",
    "description": "ПРИ ЗАКУПУВАНЕ НА АВТОМОБИЛ ОТ НАС МОЖЕ ДА ВИ ГО ДОСТАВИМ ДО ВСЯКО НАСЕЛЕНО МЯСТО В СТРАНАТА СЪС СОБСТВЕН ТРАНСПОРТ ! ! !  2. 0 бензин 4х4 МОТОРЪТ Е С ВЕРИГА-FB20 Пробегът е в мили. 126000 км В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус Автомобилът е внос от Америка, произведен е в Япония, без разлика от европейските модели. Постоянен внос от САЩ и Япония на бензинови автомобили от марката Subaru в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11752520414621839-subaru-xv-2-0-premium-4x4",
    "price": {
      "amount": 17500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11752520414621839-0.webp",
        "alt": "Subaru XV 2.0 Premium 4x4"
      },
      {
        "url": "/assets/elit/11752520414621839-1.webp",
        "alt": "Subaru XV 2.0 Premium 4x4"
      },
      {
        "url": "/assets/elit/11752520414621839-2.webp",
        "alt": "Subaru XV 2.0 Premium 4x4"
      },
      {
        "url": "/assets/elit/11752520414621839-3.webp",
        "alt": "Subaru XV 2.0 Premium 4x4"
      },
      {
        "url": "/assets/elit/11752520414621839-4.webp",
        "alt": "Subaru XV 2.0 Premium 4x4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Subaru",
      "model": "XV 2.0 Premium 4x4",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 78400,
      "mileageUnit": "km",
      "enginePowerHp": 152,
      "colorExterior": "Оранжев"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:55.000Z",
    "promoted": false
  },
  {
    "id": "elit-11671399519745199",
    "slug": "elit-11671399519745199",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Subaru XV 2.0 бензин 4х4",
    "description": "ПРИ ЗАКУПУВАНЕ НА АВТОМОБИЛ ОТ НАС МОЖЕ ДА ВИ ГО ДОСТАВИМ ДО ВСЯКО НАСЕЛЕНО МЯСТО В СТРАНАТА СЪС СОБСТВЕН ТРАНСПОРТ ! ! !  2. 0 бензин 4х4 МОТОРЪТ Е С ВЕРИГА-FB20 Пробегът е в мили.  В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус Автомобилът е внос от Америка, произведен е в Япония, без разлика от европейските модели. Постоянен внос от САЩ и Япония на бензинови автомобили от марката Subaru в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11671399519745199-subaru-xv-2-0-benzin-4h4",
    "price": {
      "amount": 17100,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11671399519745199-0.webp",
        "alt": "Subaru XV 2.0 бензин 4х4"
      },
      {
        "url": "/assets/elit/11671399519745199-1.webp",
        "alt": "Subaru XV 2.0 бензин 4х4"
      },
      {
        "url": "/assets/elit/11671399519745199-2.webp",
        "alt": "Subaru XV 2.0 бензин 4х4"
      },
      {
        "url": "/assets/elit/11671399519745199-3.webp",
        "alt": "Subaru XV 2.0 бензин 4х4"
      },
      {
        "url": "/assets/elit/11671399519745199-4.webp",
        "alt": "Subaru XV 2.0 бензин 4х4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Subaru",
      "model": "XV 2.0 бензин 4х4",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "manual",
      "mileageValue": 36000,
      "mileageUnit": "km",
      "enginePowerHp": 152,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:54.000Z",
    "promoted": false
  },
  {
    "id": "elit-11752522269460399",
    "slug": "elit-11752522269460399",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Subaru XV 2.0 Limited STI",
    "description": "Subaru XV Limited STI 2. 0 бензин 4х4 МОТОРЪТ Е С ВЕРИГА-FB20 Пробегът е в мили. 177000 км В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус.  Автомобилът е внос от Америка, произведен е в Япония, без разлика от европейските модели. Постоянен внос от САЩ на бензинови автомобили от марката Subaru в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11752522269460399-subaru-xv-2-0-limited-sti",
    "price": {
      "amount": 13037.94,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11752522269460399-0.webp",
        "alt": "Subaru XV 2.0 Limited STI"
      },
      {
        "url": "/assets/elit/11752522269460399-1.webp",
        "alt": "Subaru XV 2.0 Limited STI"
      },
      {
        "url": "/assets/elit/11752522269460399-2.webp",
        "alt": "Subaru XV 2.0 Limited STI"
      },
      {
        "url": "/assets/elit/11752522269460399-3.webp",
        "alt": "Subaru XV 2.0 Limited STI"
      },
      {
        "url": "/assets/elit/11752522269460399-4.webp",
        "alt": "Subaru XV 2.0 Limited STI"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Subaru",
      "model": "XV 2.0 Limited STI",
      "year": 2015,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 110000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:53.000Z",
    "promoted": false
  },
  {
    "id": "elit-11690723101506266",
    "slug": "elit-11690723101506266",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Subaru Outback 3.6R Limited 4х4",
    "description": "ПРИ ЗАКУПУВАНЕ НА АВТОМОБИЛ ОТ НАС МОЖЕ ДА ВИ ГО ДОСТАВИМ ДО ВСЯКО НАСЕЛЕНО МЯСТО В СТРАНАТА СЪС СОБСТВЕН ТРАНСПОРТ ! ! !  3. 6 бензин 4х4 МОТОРЪТ Е С ВЕРИГА Пробегът е в мили.  В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус Автомобилът е внос от Америка Постоянен внос от САЩ и Япония на бензинови автомобили от марката Subaru в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11690723101506266-subaru-outback-3-6r-limited-4h4",
    "price": {
      "amount": 25500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11690723101506266-0.webp",
        "alt": "Subaru Outback 3.6R Limited 4х4"
      },
      {
        "url": "/assets/elit/11690723101506266-1.webp",
        "alt": "Subaru Outback 3.6R Limited 4х4"
      },
      {
        "url": "/assets/elit/11690723101506266-2.webp",
        "alt": "Subaru Outback 3.6R Limited 4х4"
      },
      {
        "url": "/assets/elit/11690723101506266-3.webp",
        "alt": "Subaru Outback 3.6R Limited 4х4"
      },
      {
        "url": "/assets/elit/11690723101506266-4.webp",
        "alt": "Subaru Outback 3.6R Limited 4х4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Subaru",
      "model": "Outback 3.6R Limited 4х4",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 19000,
      "mileageUnit": "km",
      "enginePowerHp": 256,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:52.000Z",
    "promoted": false
  },
  {
    "id": "elit-11708792902908882",
    "slug": "elit-11708792902908882",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Subaru Outback 3.6 Touring 4x4",
    "description": "Subaru Outback Touring 3. 6 бензин 4х4 МОТОРЪТ Е С ВЕРИГА Пробегът е в мили.  Всички екстри за модела!  Дистроник, EyeSight Driver Assist Technology, датчици за мъртви зони, асистент за ленти, адаптивни лед фарове, Apple Carplay, Android auto, keyless (безключово палене), камера за задно виждане, парктроници, подгрев не седалките (предни и задни), подгрев на волана, шибидах и други В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус.  Автомобилът е внос от Америка Постоянен внос от САЩ и Япония на бензинови автомобили от марката Subaru в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11708792902908882-subaru-outback-3-6-touring-4x4",
    "price": {
      "amount": 21500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11708792902908882-0.webp",
        "alt": "Subaru Outback 3.6 Touring 4x4"
      },
      {
        "url": "/assets/elit/11708792902908882-1.webp",
        "alt": "Subaru Outback 3.6 Touring 4x4"
      },
      {
        "url": "/assets/elit/11708792902908882-2.webp",
        "alt": "Subaru Outback 3.6 Touring 4x4"
      },
      {
        "url": "/assets/elit/11708792902908882-3.webp",
        "alt": "Subaru Outback 3.6 Touring 4x4"
      },
      {
        "url": "/assets/elit/11708792902908882-4.webp",
        "alt": "Subaru Outback 3.6 Touring 4x4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Subaru",
      "model": "Outback 3.6 Touring 4x4",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 82000,
      "mileageUnit": "km",
      "enginePowerHp": 256,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:51.000Z",
    "promoted": false
  },
  {
    "id": "elit-11706466498517805",
    "slug": "elit-11706466498517805",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Subaru Outback 3.6 Limited 4x4",
    "description": "Subaru Outback Limited 3. 6 бензин 4х4 МОТОРЪТ Е С ВЕРИГА Пробегът е в мили.  Дистроник, EyeSight Driver Assist Technology, датчици за мъртви зони, асистент за ленти, ксенонови фарове, keyless (безключово палене), камера за задно виждане, парктроници, подгрев на седалките (предни и задни), шибидах и други В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус Автомобилът е внос от Америка Постоянен внос от САЩ и Япония на бензинови автомобили от марката Subaru в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11706466498517805-subaru-outback-3-6-limited-4x4",
    "price": {
      "amount": 21500,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11706466498517805-0.webp",
        "alt": "Subaru Outback 3.6 Limited 4x4"
      },
      {
        "url": "/assets/elit/11706466498517805-1.webp",
        "alt": "Subaru Outback 3.6 Limited 4x4"
      },
      {
        "url": "/assets/elit/11706466498517805-2.webp",
        "alt": "Subaru Outback 3.6 Limited 4x4"
      },
      {
        "url": "/assets/elit/11706466498517805-3.webp",
        "alt": "Subaru Outback 3.6 Limited 4x4"
      },
      {
        "url": "/assets/elit/11706466498517805-4.webp",
        "alt": "Subaru Outback 3.6 Limited 4x4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Subaru",
      "model": "Outback 3.6 Limited 4x4",
      "year": 2017,
      "bodyType": "suv",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 48000,
      "mileageUnit": "km",
      "enginePowerHp": 256,
      "colorExterior": "Червен"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:50.000Z",
    "promoted": false
  },
  {
    "id": "elit-11693118990022696",
    "slug": "elit-11693118990022696",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Subaru Legacy 2.5 Limited 4x4",
    "description": "подходящ за ГАЗ   2. 5 бензин 4х4 МОТОРЪТ Е С ВЕРИГА-FB25 Пробегът е в мили.  В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус Автомобилът е внос от Америка, без разлика от европейските модели. Постоянен внос от САЩ на бензинови автомобили от марката Subaru в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11693118990022696-subaru-legacy-2-5-limited-4x4",
    "price": {
      "amount": 13000,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11693118990022696-0.webp",
        "alt": "Subaru Legacy 2.5 Limited 4x4"
      },
      {
        "url": "/assets/elit/11693118990022696-1.webp",
        "alt": "Subaru Legacy 2.5 Limited 4x4"
      },
      {
        "url": "/assets/elit/11693118990022696-2.webp",
        "alt": "Subaru Legacy 2.5 Limited 4x4"
      },
      {
        "url": "/assets/elit/11693118990022696-3.webp",
        "alt": "Subaru Legacy 2.5 Limited 4x4"
      },
      {
        "url": "/assets/elit/11693118990022696-4.webp",
        "alt": "Subaru Legacy 2.5 Limited 4x4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Subaru",
      "model": "Legacy 2.5 Limited 4x4",
      "year": 2015,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 94000,
      "mileageUnit": "km",
      "enginePowerHp": 172,
      "colorExterior": "Бял"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:49.000Z",
    "promoted": false
  },
  {
    "id": "elit-11655794958039551",
    "slug": "elit-11655794958039551",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Subaru Legacy 2.5 бензин 4х4",
    "description": "ПРИ ЗАКУПУВАНЕ НА АВТОМОБИЛ ОТ НАС МОЖЕ ДА ВИ ГО ДОСТАВИМ ДО ВСЯКО НАСЕЛЕНО МЯСТО В СТРАНАТА СЪС СОБСТВЕН ТРАНСПОРТ ! ! !  2. 5 бензин 4х4 МОТОРЪТ Е С ВЕРИГА-FB25 Пробегът е в мили.  В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус Автомобилът е внос от Америка, произведен е в Япония, без разлика от европейските модели. Постоянен внос от САЩ и Япония на бензинови автомобили от марката Subaru в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Полето в обявата е в км, а описанието посочва мили. Потвърдете действителния пробег с продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11655794958039551-subaru-legacy-2-5-benzin-4h4",
    "price": {
      "amount": 11900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11655794958039551-0.webp",
        "alt": "Subaru Legacy 2.5 бензин 4х4"
      },
      {
        "url": "/assets/elit/11655794958039551-1.webp",
        "alt": "Subaru Legacy 2.5 бензин 4х4"
      },
      {
        "url": "/assets/elit/11655794958039551-2.webp",
        "alt": "Subaru Legacy 2.5 бензин 4х4"
      },
      {
        "url": "/assets/elit/11655794958039551-3.webp",
        "alt": "Subaru Legacy 2.5 бензин 4х4"
      },
      {
        "url": "/assets/elit/11655794958039551-4.webp",
        "alt": "Subaru Legacy 2.5 бензин 4х4"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Subaru",
      "model": "Legacy 2.5 бензин 4х4",
      "year": 2014,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 137000,
      "mileageUnit": "km",
      "enginePowerHp": 172,
      "colorExterior": "Черен"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:48.000Z",
    "promoted": false
  },
  {
    "id": "elit-11722966256335346",
    "slug": "elit-11722966256335346",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Mazda 6 2.5 Skyactiv",
    "description": "Mazda 6 Skyactiv 2. 5 бензин (най-добрия бензинов мотор на Mazda) Доказуем пробег!  В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус.  Автомобилът е внос от Америка, произведен е в Япония, без разлика от европейските модели. Постоянен внос от САЩ на бензинови автомобили в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+35988777788 Пробегът е по данни на продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-11722966256335346-mazda-6-2-5-skyactiv",
    "price": {
      "amount": 11913.1,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/11722966256335346-0.webp",
        "alt": "Mazda 6 2.5 Skyactiv"
      },
      {
        "url": "/assets/elit/11722966256335346-1.webp",
        "alt": "Mazda 6 2.5 Skyactiv"
      },
      {
        "url": "/assets/elit/11722966256335346-2.webp",
        "alt": "Mazda 6 2.5 Skyactiv"
      },
      {
        "url": "/assets/elit/11722966256335346-3.webp",
        "alt": "Mazda 6 2.5 Skyactiv"
      },
      {
        "url": "/assets/elit/11722966256335346-4.webp",
        "alt": "Mazda 6 2.5 Skyactiv"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Mazda",
      "model": "6 2.5 Skyactiv",
      "year": 2015,
      "bodyType": "sedan",
      "fuelType": "gasoline",
      "transmission": "automatic",
      "mileageValue": 100789,
      "mileageUnit": "km",
      "enginePowerHp": 190,
      "colorExterior": "Сив"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:47.000Z",
    "promoted": false
  },
  {
    "id": "elit-21691652621240351",
    "slug": "elit-21691652621240351",
    "category": "car",
    "dealerOrgId": "dealer-elit-auto",
    "status": "active",
    "title": "Hyundai Santa fe",
    "description": "Hyundai Santa Fe 2. 0 GRDi 4х4 7 места В цената са калкулирани всички разходи(мито, ДДС, технотест).  Продажба с фактура и договор без разходи за нотариус Автомобилът е внос от Южна Корея. Постоянен внос от САЩ и Южна Корея на автомобили в перфектно техническо състояние и доказан пробег. Може да бъде проверен в сервиз по Ваш избор. Пакетни цени за търговци.  Мы говорим по-русски.  tel. /viber/whatsapp+359887777887 Пробегът е по данни на продавача. Цената е с включено ДДС. Оригинална обява: https://elitautoimport.mobile.bg/obiava-21691652621240351-hyundai-santa-fe",
    "price": {
      "amount": 14316.17,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/assets/elit/21691652621240351-0.webp",
        "alt": "Hyundai Santa fe"
      },
      {
        "url": "/assets/elit/21691652621240351-1.webp",
        "alt": "Hyundai Santa fe"
      },
      {
        "url": "/assets/elit/21691652621240351-2.webp",
        "alt": "Hyundai Santa fe"
      },
      {
        "url": "/assets/elit/21691652621240351-3.webp",
        "alt": "Hyundai Santa fe"
      },
      {
        "url": "/assets/elit/21691652621240351-4.webp",
        "alt": "Hyundai Santa fe"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "Варна",
      "region": "м-т Пчелина",
      "country": "България"
    },
    "features": [],
    "spec": {
      "make": "Hyundai",
      "model": "Santa fe",
      "year": 2013,
      "bodyType": "suv",
      "fuelType": "diesel",
      "transmission": "automatic",
      "mileageValue": 58000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "Светло сив"
    },
    "seller": {
      "id": "dealer-elit-auto",
      "type": "dealer",
      "displayName": "ELIT AUTO IMPORT EXPORT",
      "verificationStatus": "unverified",
      "city": "Варна"
    },
    "publishedAt": "2026-09-07T09:59:46.000Z",
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
