import type { MarketplaceSearchParams } from "../search";
import type { Money, VehicleListing } from "../types";

export const mockListings: VehicleListing[] = [
  {
    "id": "tesi-21783937913461083",
    "slug": "tesi-21783937913461083",
    "category": "car",
    "dealerOrgId": "dealer-tesi-car-varna",
    "status": "active",
    "title": "Nissan Juke 1.6i tekna 117k.c.",
    "description": "\u041f\u0443\u0431\u043b\u0438\u043a\u0443\u0432\u0430\u043d\u0430 \u043e\u0431\u044f\u0432\u0430 \u043d\u0430 \u0422\u0435\u0441\u0438 \u041a\u0430\u0440, \u043d\u0430\u0431\u043b\u044e\u0434\u0430\u0432\u0430\u043d\u0430 \u043d\u0430 10.09.2026 \u0433. \u041d\u0430\u043b\u0438\u0447\u043d\u043e\u0441\u0442\u0442\u0430 \u0441\u0435 \u043f\u043e\u0442\u0432\u044a\u0440\u0436\u0434\u0430\u0432\u0430 \u0441 \u0430\u0432\u0442\u043e\u043a\u044a\u0449\u0430\u0442\u0430. \u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u043d\u0430 \u043e\u0431\u044f\u0432\u0430: https://tesicar.mobile.bg/obiava-21783937913461083-nissan-juke-1-6i-tekna-117k-c",
    "price": {
      "amount": 6799,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/21783937913461083-1.webp",
        "alt": "Nissan Juke 1.6i tekna 117k.c."
      },
      {
        "url": "/dealer/inventory/21783937913461083-2.webp",
        "alt": "Nissan Juke 1.6i tekna 117k.c."
      },
      {
        "url": "/dealer/inventory/21783937913461083-3.webp",
        "alt": "Nissan Juke 1.6i tekna 117k.c."
      },
      {
        "url": "/dealer/inventory/21783937913461083-4.webp",
        "alt": "Nissan Juke 1.6i tekna 117k.c."
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "\u0412\u0430\u0440\u043d\u0430",
      "region": "\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432 \u0412\u0430\u0440\u043d\u0435\u043d\u0447\u0438\u043a",
      "country": "\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f"
    },
    "features": [
      {
        "bg": "4(5) \u0412\u0440\u0430\u0442\u0438",
        "en": "4(5) \u0412\u0440\u0430\u0442\u0438"
      },
      {
        "bg": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
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
        "bg": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438",
        "en": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438"
      },
      {
        "bg": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
      },
      {
        "bg": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440",
        "en": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440"
      },
      {
        "bg": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u041f\u0440\u0435\u0434\u043d\u0438",
        "en": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u041f\u0440\u0435\u0434\u043d\u0438"
      },
      {
        "bg": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u0421\u0442\u0440\u0430\u043d\u0438\u0447\u043d\u0438",
        "en": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u0421\u0442\u0440\u0430\u043d\u0438\u0447\u043d\u0438"
      },
      {
        "bg": "\u0414\u0430\u0442\u0447\u0438\u043a \u0437\u0430 \u0441\u0432\u0435\u0442\u043b\u0438\u043d\u0430",
        "en": "\u0414\u0430\u0442\u0447\u0438\u043a \u0437\u0430 \u0441\u0432\u0435\u0442\u043b\u0438\u043d\u0430"
      },
      {
        "bg": "\u0415\u043b. \u041e\u0433\u043b\u0435\u0434\u0430\u043b\u0430",
        "en": "\u0415\u043b. \u041e\u0433\u043b\u0435\u0434\u0430\u043b\u0430"
      },
      {
        "bg": "\u0415\u043b. \u0421\u0442\u044a\u043a\u043b\u0430",
        "en": "\u0415\u043b. \u0421\u0442\u044a\u043a\u043b\u0430"
      }
    ],
    "spec": {
      "bodyType": "suv",
      "fuelType": "gasoline",
      "make": "Nissan",
      "model": "Juke 1.6i tekna 117k.c.",
      "year": 2015,
      "transmission": "manual",
      "mileageValue": 169200,
      "mileageUnit": "km",
      "enginePowerHp": 117,
      "colorExterior": "\u0421\u0438\u0432"
    },
    "seller": {
      "id": "dealer-tesi-car-varna",
      "type": "dealer",
      "displayName": "\u0422\u0435\u0441\u0438 \u041a\u0430\u0440",
      "verificationStatus": "unverified",
      "city": "\u0412\u0430\u0440\u043d\u0430"
    },
    "publishedAt": "2026-09-10T17:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tesi-21786378692115915",
    "slug": "tesi-21786378692115915",
    "category": "car",
    "dealerOrgId": "dealer-tesi-car-varna",
    "status": "active",
    "title": "Suzuki Grand vitara 2.4i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f",
    "description": "\u041f\u0443\u0431\u043b\u0438\u043a\u0443\u0432\u0430\u043d\u0430 \u043e\u0431\u044f\u0432\u0430 \u043d\u0430 \u0422\u0435\u0441\u0438 \u041a\u0430\u0440, \u043d\u0430\u0431\u043b\u044e\u0434\u0430\u0432\u0430\u043d\u0430 \u043d\u0430 10.09.2026 \u0433. \u041d\u0430\u043b\u0438\u0447\u043d\u043e\u0441\u0442\u0442\u0430 \u0441\u0435 \u043f\u043e\u0442\u0432\u044a\u0440\u0436\u0434\u0430\u0432\u0430 \u0441 \u0430\u0432\u0442\u043e\u043a\u044a\u0449\u0430\u0442\u0430. \u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u043d\u0430 \u043e\u0431\u044f\u0432\u0430: https://tesicar.mobile.bg/obiava-21786378692115915-suzuki-grand-vitara-2-4i-shveytsariya",
    "price": {
      "amount": 9399,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/21786378692115915-1.webp",
        "alt": "Suzuki Grand vitara 2.4i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f"
      },
      {
        "url": "/dealer/inventory/21786378692115915-2.webp",
        "alt": "Suzuki Grand vitara 2.4i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f"
      },
      {
        "url": "/dealer/inventory/21786378692115915-3.webp",
        "alt": "Suzuki Grand vitara 2.4i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f"
      },
      {
        "url": "/dealer/inventory/21786378692115915-4.webp",
        "alt": "Suzuki Grand vitara 2.4i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "\u0412\u0430\u0440\u043d\u0430",
      "region": "\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432 \u0412\u0430\u0440\u043d\u0435\u043d\u0447\u0438\u043a",
      "country": "\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f"
    },
    "features": [
      {
        "bg": "4(5) \u0412\u0440\u0430\u0442\u0438",
        "en": "4(5) \u0412\u0440\u0430\u0442\u0438"
      },
      {
        "bg": "4x4",
        "en": "4x4"
      },
      {
        "bg": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
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
        "bg": "USB",
        "en": "USB"
      },
      {
        "bg": "audio\\video",
        "en": "audio\\video"
      },
      {
        "bg": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438",
        "en": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438"
      },
      {
        "bg": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
      },
      {
        "bg": "\u0411\u0435\u0437\u043a\u043b\u044e\u0447\u043e\u0432\u043e \u043f\u0430\u043b\u0435\u043d\u0435",
        "en": "\u0411\u0435\u0437\u043a\u043b\u044e\u0447\u043e\u0432\u043e \u043f\u0430\u043b\u0435\u043d\u0435"
      },
      {
        "bg": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440",
        "en": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440"
      },
      {
        "bg": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u041f\u0440\u0435\u0434\u043d\u0438",
        "en": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u041f\u0440\u0435\u0434\u043d\u0438"
      }
    ],
    "spec": {
      "bodyType": "suv",
      "fuelType": "gasoline",
      "make": "Suzuki",
      "model": "Grand vitara 2.4i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f",
      "year": 2014,
      "transmission": "manual",
      "mileageValue": 90700,
      "mileageUnit": "km",
      "enginePowerHp": 169,
      "colorExterior": "\u0422\u044a\u043c\u043d\u043e \u0441\u0438\u0432"
    },
    "seller": {
      "id": "dealer-tesi-car-varna",
      "type": "dealer",
      "displayName": "\u0422\u0435\u0441\u0438 \u041a\u0430\u0440",
      "verificationStatus": "unverified",
      "city": "\u0412\u0430\u0440\u043d\u0430"
    },
    "publishedAt": "2026-09-10T16:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tesi-11787674075681544",
    "slug": "tesi-11787674075681544",
    "category": "car",
    "dealerOrgId": "dealer-tesi-car-varna",
    "status": "active",
    "title": "Audi A7 3.0 TFSI",
    "description": "\u041f\u0443\u0431\u043b\u0438\u043a\u0443\u0432\u0430\u043d\u0430 \u043e\u0431\u044f\u0432\u0430 \u043d\u0430 \u0422\u0435\u0441\u0438 \u041a\u0430\u0440, \u043d\u0430\u0431\u043b\u044e\u0434\u0430\u0432\u0430\u043d\u0430 \u043d\u0430 10.09.2026 \u0433. \u041d\u0430\u043b\u0438\u0447\u043d\u043e\u0441\u0442\u0442\u0430 \u0441\u0435 \u043f\u043e\u0442\u0432\u044a\u0440\u0436\u0434\u0430\u0432\u0430 \u0441 \u0430\u0432\u0442\u043e\u043a\u044a\u0449\u0430\u0442\u0430. \u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u043d\u0430 \u043e\u0431\u044f\u0432\u0430: https://tesicar.mobile.bg/obiava-11787674075681544-audi-a7-3-0-tfsi",
    "price": {
      "amount": 14900,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/11787674075681544-1.webp",
        "alt": "Audi A7 3.0 TFSI"
      },
      {
        "url": "/dealer/inventory/11787674075681544-2.webp",
        "alt": "Audi A7 3.0 TFSI"
      },
      {
        "url": "/dealer/inventory/11787674075681544-3.webp",
        "alt": "Audi A7 3.0 TFSI"
      },
      {
        "url": "/dealer/inventory/11787674075681544-4.webp",
        "alt": "Audi A7 3.0 TFSI"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "\u0412\u0430\u0440\u043d\u0430",
      "region": "\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432 \u0412\u0430\u0440\u043d\u0435\u043d\u0447\u0438\u043a",
      "country": "\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f"
    },
    "features": [
      {
        "bg": "4(5) \u0412\u0440\u0430\u0442\u0438",
        "en": "4(5) \u0412\u0440\u0430\u0442\u0438"
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
        "bg": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
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
        "bg": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438",
        "en": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438"
      },
      {
        "bg": "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u043e \u0437\u0430\u0442\u0432\u0430\u0440\u044f\u043d\u0435 \u043d\u0430 \u0431\u0430\u0433\u0430\u0436\u043d\u0438\u043a\u0430",
        "en": "\u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u043d\u043e \u0437\u0430\u0442\u0432\u0430\u0440\u044f\u043d\u0435 \u043d\u0430 \u0431\u0430\u0433\u0430\u0436\u043d\u0438\u043a\u0430"
      }
    ],
    "spec": {
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "make": "Audi",
      "model": "A7 3.0 TFSI",
      "year": 2011,
      "transmission": "automatic",
      "mileageValue": 270000,
      "mileageUnit": "km",
      "enginePowerHp": 300,
      "colorExterior": "\u0427\u0435\u0440\u0435\u043d"
    },
    "seller": {
      "id": "dealer-tesi-car-varna",
      "type": "dealer",
      "displayName": "\u0422\u0435\u0441\u0438 \u041a\u0430\u0440",
      "verificationStatus": "unverified",
      "city": "\u0412\u0430\u0440\u043d\u0430"
    },
    "publishedAt": "2026-09-10T15:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tesi-21781003069917784",
    "slug": "tesi-21781003069917784",
    "category": "car",
    "dealerOrgId": "dealer-tesi-car-varna",
    "status": "active",
    "title": "Mitsubishi ASX 2.2DiD 4WD Automatic",
    "description": "\u041f\u0443\u0431\u043b\u0438\u043a\u0443\u0432\u0430\u043d\u0430 \u043e\u0431\u044f\u0432\u0430 \u043d\u0430 \u0422\u0435\u0441\u0438 \u041a\u0430\u0440, \u043d\u0430\u0431\u043b\u044e\u0434\u0430\u0432\u0430\u043d\u0430 \u043d\u0430 10.09.2026 \u0433. \u041d\u0430\u043b\u0438\u0447\u043d\u043e\u0441\u0442\u0442\u0430 \u0441\u0435 \u043f\u043e\u0442\u0432\u044a\u0440\u0436\u0434\u0430\u0432\u0430 \u0441 \u0430\u0432\u0442\u043e\u043a\u044a\u0449\u0430\u0442\u0430. \u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u043d\u0430 \u043e\u0431\u044f\u0432\u0430: https://tesicar.mobile.bg/obiava-21781003069917784-mitsubishi-asx-2-2did-4wd-automatic",
    "price": {
      "amount": 9499,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/21781003069917784-1.webp",
        "alt": "Mitsubishi ASX 2.2DiD 4WD Automatic"
      },
      {
        "url": "/dealer/inventory/21781003069917784-2.webp",
        "alt": "Mitsubishi ASX 2.2DiD 4WD Automatic"
      },
      {
        "url": "/dealer/inventory/21781003069917784-3.webp",
        "alt": "Mitsubishi ASX 2.2DiD 4WD Automatic"
      },
      {
        "url": "/dealer/inventory/21781003069917784-4.webp",
        "alt": "Mitsubishi ASX 2.2DiD 4WD Automatic"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "\u0412\u0430\u0440\u043d\u0430",
      "region": "\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432 \u0412\u0430\u0440\u043d\u0435\u043d\u0447\u0438\u043a",
      "country": "\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f"
    },
    "features": [
      {
        "bg": "4(5) \u0412\u0440\u0430\u0442\u0438",
        "en": "4(5) \u0412\u0440\u0430\u0442\u0438"
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
        "bg": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
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
        "bg": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438",
        "en": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438"
      },
      {
        "bg": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
      },
      {
        "bg": "\u0411\u043b\u043e\u043a\u0430\u0436 \u043d\u0430 \u0434\u0438\u0444\u0435\u0440\u0435\u043d\u0446\u0438\u0430\u043b\u0430",
        "en": "\u0411\u043b\u043e\u043a\u0430\u0436 \u043d\u0430 \u0434\u0438\u0444\u0435\u0440\u0435\u043d\u0446\u0438\u0430\u043b\u0430"
      },
      {
        "bg": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440",
        "en": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440"
      }
    ],
    "spec": {
      "bodyType": "suv",
      "fuelType": "diesel",
      "make": "Mitsubishi",
      "model": "ASX 2.2DiD 4WD Automatic",
      "year": 2015,
      "transmission": "automatic",
      "mileageValue": 110000,
      "mileageUnit": "km",
      "enginePowerHp": 150,
      "colorExterior": "\u041a\u0430\u0444\u044f\u0432"
    },
    "seller": {
      "id": "dealer-tesi-car-varna",
      "type": "dealer",
      "displayName": "\u0422\u0435\u0441\u0438 \u041a\u0430\u0440",
      "verificationStatus": "unverified",
      "city": "\u0412\u0430\u0440\u043d\u0430"
    },
    "publishedAt": "2026-09-10T14:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tesi-11779806013316184",
    "slug": "tesi-11779806013316184",
    "category": "car",
    "dealerOrgId": "dealer-tesi-car-varna",
    "status": "active",
    "title": "Toyota Yaris 1.33 99\u043a.\u0441.",
    "description": "\u041f\u0443\u0431\u043b\u0438\u043a\u0443\u0432\u0430\u043d\u0430 \u043e\u0431\u044f\u0432\u0430 \u043d\u0430 \u0422\u0435\u0441\u0438 \u041a\u0430\u0440, \u043d\u0430\u0431\u043b\u044e\u0434\u0430\u0432\u0430\u043d\u0430 \u043d\u0430 10.09.2026 \u0433. \u041d\u0430\u043b\u0438\u0447\u043d\u043e\u0441\u0442\u0442\u0430 \u0441\u0435 \u043f\u043e\u0442\u0432\u044a\u0440\u0436\u0434\u0430\u0432\u0430 \u0441 \u0430\u0432\u0442\u043e\u043a\u044a\u0449\u0430\u0442\u0430. \u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u043d\u0430 \u043e\u0431\u044f\u0432\u0430: https://tesicar.mobile.bg/obiava-11779806013316184-toyota-yaris-1-33-99k-s",
    "price": {
      "amount": 6150,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/11779806013316184-1.webp",
        "alt": "Toyota Yaris 1.33 99\u043a.\u0441."
      },
      {
        "url": "/dealer/inventory/11779806013316184-2.webp",
        "alt": "Toyota Yaris 1.33 99\u043a.\u0441."
      },
      {
        "url": "/dealer/inventory/11779806013316184-3.webp",
        "alt": "Toyota Yaris 1.33 99\u043a.\u0441."
      },
      {
        "url": "/dealer/inventory/11779806013316184-4.webp",
        "alt": "Toyota Yaris 1.33 99\u043a.\u0441."
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "\u0412\u0430\u0440\u043d\u0430",
      "region": "\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432 \u0412\u0430\u0440\u043d\u0435\u043d\u0447\u0438\u043a",
      "country": "\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f"
    },
    "features": [
      {
        "bg": "4(5) \u0412\u0440\u0430\u0442\u0438",
        "en": "4(5) \u0412\u0440\u0430\u0442\u0438"
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
        "bg": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438",
        "en": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438"
      },
      {
        "bg": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
      },
      {
        "bg": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440",
        "en": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440"
      },
      {
        "bg": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u041f\u0440\u0435\u0434\u043d\u0438",
        "en": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u041f\u0440\u0435\u0434\u043d\u0438"
      },
      {
        "bg": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u0421\u0442\u0440\u0430\u043d\u0438\u0447\u043d\u0438",
        "en": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u0421\u0442\u0440\u0430\u043d\u0438\u0447\u043d\u0438"
      },
      {
        "bg": "\u0414\u0430\u0442\u0447\u0438\u043a \u0437\u0430 \u0441\u0432\u0435\u0442\u043b\u0438\u043d\u0430",
        "en": "\u0414\u0430\u0442\u0447\u0438\u043a \u0437\u0430 \u0441\u0432\u0435\u0442\u043b\u0438\u043d\u0430"
      },
      {
        "bg": "\u0415\u043b. \u041e\u0433\u043b\u0435\u0434\u0430\u043b\u0430",
        "en": "\u0415\u043b. \u041e\u0433\u043b\u0435\u0434\u0430\u043b\u0430"
      },
      {
        "bg": "\u0415\u043b. \u0421\u0442\u044a\u043a\u043b\u0430",
        "en": "\u0415\u043b. \u0421\u0442\u044a\u043a\u043b\u0430"
      },
      {
        "bg": "\u0415\u043b. \u0440\u0430\u0437\u043f\u0440\u0435\u0434\u0435\u043b\u044f\u043d\u0435 \u043d\u0430 \u0441\u043f\u0438\u0440\u0430\u0447\u043d\u043e\u0442\u043e \u0443\u0441\u0438\u043b\u0438\u0435",
        "en": "\u0415\u043b. \u0440\u0430\u0437\u043f\u0440\u0435\u0434\u0435\u043b\u044f\u043d\u0435 \u043d\u0430 \u0441\u043f\u0438\u0440\u0430\u0447\u043d\u043e\u0442\u043e \u0443\u0441\u0438\u043b\u0438\u0435"
      }
    ],
    "spec": {
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "make": "Toyota",
      "model": "Yaris 1.33 99\u043a.\u0441.",
      "year": 2009,
      "transmission": "manual",
      "mileageValue": 208000,
      "mileageUnit": "km",
      "enginePowerHp": 99,
      "colorExterior": "\u0421\u0438\u0432"
    },
    "seller": {
      "id": "dealer-tesi-car-varna",
      "type": "dealer",
      "displayName": "\u0422\u0435\u0441\u0438 \u041a\u0430\u0440",
      "verificationStatus": "unverified",
      "city": "\u0412\u0430\u0440\u043d\u0430"
    },
    "publishedAt": "2026-09-10T13:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tesi-21782292613523387",
    "slug": "tesi-21782292613523387",
    "category": "car",
    "dealerOrgId": "dealer-tesi-car-varna",
    "status": "active",
    "title": "Nissan Juke 1.6i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f",
    "description": "\u041f\u0443\u0431\u043b\u0438\u043a\u0443\u0432\u0430\u043d\u0430 \u043e\u0431\u044f\u0432\u0430 \u043d\u0430 \u0422\u0435\u0441\u0438 \u041a\u0430\u0440, \u043d\u0430\u0431\u043b\u044e\u0434\u0430\u0432\u0430\u043d\u0430 \u043d\u0430 10.09.2026 \u0433. \u041d\u0430\u043b\u0438\u0447\u043d\u043e\u0441\u0442\u0442\u0430 \u0441\u0435 \u043f\u043e\u0442\u0432\u044a\u0440\u0436\u0434\u0430\u0432\u0430 \u0441 \u0430\u0432\u0442\u043e\u043a\u044a\u0449\u0430\u0442\u0430. \u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u043d\u0430 \u043e\u0431\u044f\u0432\u0430: https://tesicar.mobile.bg/obiava-21782292613523387-nissan-juke-1-6i-shveytsariya",
    "price": {
      "amount": 7499,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/21782292613523387-1.webp",
        "alt": "Nissan Juke 1.6i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f"
      },
      {
        "url": "/dealer/inventory/21782292613523387-2.webp",
        "alt": "Nissan Juke 1.6i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f"
      },
      {
        "url": "/dealer/inventory/21782292613523387-3.webp",
        "alt": "Nissan Juke 1.6i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f"
      },
      {
        "url": "/dealer/inventory/21782292613523387-4.webp",
        "alt": "Nissan Juke 1.6i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "\u0412\u0430\u0440\u043d\u0430",
      "region": "\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432 \u0412\u0430\u0440\u043d\u0435\u043d\u0447\u0438\u043a",
      "country": "\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f"
    },
    "features": [
      {
        "bg": "4(5) \u0412\u0440\u0430\u0442\u0438",
        "en": "4(5) \u0412\u0440\u0430\u0442\u0438"
      },
      {
        "bg": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
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
        "bg": "USB",
        "en": "USB"
      },
      {
        "bg": "audio\\video",
        "en": "audio\\video"
      },
      {
        "bg": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438",
        "en": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438"
      },
      {
        "bg": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
      },
      {
        "bg": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u041f\u0440\u0435\u0434\u043d\u0438",
        "en": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u041f\u0440\u0435\u0434\u043d\u0438"
      },
      {
        "bg": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u0421\u0442\u0440\u0430\u043d\u0438\u0447\u043d\u0438",
        "en": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u0421\u0442\u0440\u0430\u043d\u0438\u0447\u043d\u0438"
      },
      {
        "bg": "\u0414\u0430\u0442\u0447\u0438\u043a \u0437\u0430 \u0441\u0432\u0435\u0442\u043b\u0438\u043d\u0430",
        "en": "\u0414\u0430\u0442\u0447\u0438\u043a \u0437\u0430 \u0441\u0432\u0435\u0442\u043b\u0438\u043d\u0430"
      },
      {
        "bg": "\u0415\u043b. \u041e\u0433\u043b\u0435\u0434\u0430\u043b\u0430",
        "en": "\u0415\u043b. \u041e\u0433\u043b\u0435\u0434\u0430\u043b\u0430"
      }
    ],
    "spec": {
      "bodyType": "suv",
      "fuelType": "gasoline",
      "make": "Nissan",
      "model": "Juke 1.6i \u0428\u0412\u0415\u0419\u0426\u0410\u0420\u0418\u042f",
      "year": 2015,
      "transmission": "manual",
      "mileageValue": 184200,
      "mileageUnit": "km",
      "enginePowerHp": 94,
      "colorExterior": "\u0427\u0435\u0440\u0435\u043d"
    },
    "seller": {
      "id": "dealer-tesi-car-varna",
      "type": "dealer",
      "displayName": "\u0422\u0435\u0441\u0438 \u041a\u0430\u0440",
      "verificationStatus": "unverified",
      "city": "\u0412\u0430\u0440\u043d\u0430"
    },
    "publishedAt": "2026-09-10T12:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tesi-11779452412819500",
    "slug": "tesi-11779452412819500",
    "category": "car",
    "dealerOrgId": "dealer-tesi-car-varna",
    "status": "active",
    "title": "Mitsubishi Colt 1.3i 95k.c.",
    "description": "\u041f\u0443\u0431\u043b\u0438\u043a\u0443\u0432\u0430\u043d\u0430 \u043e\u0431\u044f\u0432\u0430 \u043d\u0430 \u0422\u0435\u0441\u0438 \u041a\u0430\u0440, \u043d\u0430\u0431\u043b\u044e\u0434\u0430\u0432\u0430\u043d\u0430 \u043d\u0430 10.09.2026 \u0433. \u041d\u0430\u043b\u0438\u0447\u043d\u043e\u0441\u0442\u0442\u0430 \u0441\u0435 \u043f\u043e\u0442\u0432\u044a\u0440\u0436\u0434\u0430\u0432\u0430 \u0441 \u0430\u0432\u0442\u043e\u043a\u044a\u0449\u0430\u0442\u0430. \u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u043d\u0430 \u043e\u0431\u044f\u0432\u0430: https://tesicar.mobile.bg/obiava-11779452412819500-mitsubishi-colt-1-3i-95k-c",
    "price": {
      "amount": 1999,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/11779452412819500-1.webp",
        "alt": "Mitsubishi Colt 1.3i 95k.c."
      },
      {
        "url": "/dealer/inventory/11779452412819500-2.webp",
        "alt": "Mitsubishi Colt 1.3i 95k.c."
      },
      {
        "url": "/dealer/inventory/11779452412819500-3.webp",
        "alt": "Mitsubishi Colt 1.3i 95k.c."
      },
      {
        "url": "/dealer/inventory/11779452412819500-4.webp",
        "alt": "Mitsubishi Colt 1.3i 95k.c."
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "\u0412\u0430\u0440\u043d\u0430",
      "region": "\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432 \u0412\u0430\u0440\u043d\u0435\u043d\u0447\u0438\u043a",
      "country": "\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f"
    },
    "features": [
      {
        "bg": "4(5) \u0412\u0440\u0430\u0442\u0438",
        "en": "4(5) \u0412\u0440\u0430\u0442\u0438"
      },
      {
        "bg": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
      },
      {
        "bg": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440",
        "en": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440"
      },
      {
        "bg": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u041f\u0440\u0435\u0434\u043d\u0438",
        "en": "\u0412\u044a\u0437\u0434\u0443\u0448\u043d\u0438 \u0432\u044a\u0437\u0433\u043b\u0430\u0432\u043d\u0438\u0446\u0438 - \u041f\u0440\u0435\u0434\u043d\u0438"
      },
      {
        "bg": "\u0415\u043b. \u041e\u0433\u043b\u0435\u0434\u0430\u043b\u0430",
        "en": "\u0415\u043b. \u041e\u0433\u043b\u0435\u0434\u0430\u043b\u0430"
      },
      {
        "bg": "\u0415\u043b. \u0421\u0442\u044a\u043a\u043b\u0430",
        "en": "\u0415\u043b. \u0421\u0442\u044a\u043a\u043b\u0430"
      },
      {
        "bg": "\u0415\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u0430 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u0430 \u0437\u0430 \u0441\u0442\u0430\u0431\u0438\u043b\u0438\u0437\u0438\u0440\u0430\u043d\u0435",
        "en": "\u0415\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u0430 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u0430 \u0437\u0430 \u0441\u0442\u0430\u0431\u0438\u043b\u0438\u0437\u0438\u0440\u0430\u043d\u0435"
      },
      {
        "bg": "\u041a\u043b\u0438\u043c\u0430\u0442\u0438\u043a",
        "en": "\u041a\u043b\u0438\u043c\u0430\u0442\u0438\u043a"
      },
      {
        "bg": "\u041b\u0435\u0442\u0438 \u0434\u0436\u0430\u043d\u0442\u0438",
        "en": "\u041b\u0435\u0442\u0438 \u0434\u0436\u0430\u043d\u0442\u0438"
      },
      {
        "bg": "\u041b\u0438\u0437\u0438\u043d\u0433",
        "en": "\u041b\u0438\u0437\u0438\u043d\u0433"
      },
      {
        "bg": "\u041c\u0435\u0442\u0430\u043b\u0438\u043a",
        "en": "\u041c\u0435\u0442\u0430\u043b\u0438\u043a"
      },
      {
        "bg": "\u0420\u0435\u0433\u0443\u043b\u0438\u0440\u0430\u043d\u0435 \u043d\u0430 \u0432\u043e\u043b\u0430\u043d\u0430",
        "en": "\u0420\u0435\u0433\u0443\u043b\u0438\u0440\u0430\u043d\u0435 \u043d\u0430 \u0432\u043e\u043b\u0430\u043d\u0430"
      }
    ],
    "spec": {
      "bodyType": "hatchback",
      "fuelType": "gasoline",
      "make": "Mitsubishi",
      "model": "Colt 1.3i 95k.c.",
      "year": 2005,
      "transmission": "manual",
      "mileageValue": 223000,
      "mileageUnit": "km",
      "enginePowerHp": 95,
      "colorExterior": "\u0411\u043e\u0440\u0434\u043e"
    },
    "seller": {
      "id": "dealer-tesi-car-varna",
      "type": "dealer",
      "displayName": "\u0422\u0435\u0441\u0438 \u041a\u0430\u0440",
      "verificationStatus": "unverified",
      "city": "\u0412\u0430\u0440\u043d\u0430"
    },
    "publishedAt": "2026-09-10T11:00:00.000Z",
    "promoted": false
  },
  {
    "id": "tesi-21783600164931772",
    "slug": "tesi-21783600164931772",
    "category": "car",
    "dealerOrgId": "dealer-tesi-car-varna",
    "status": "active",
    "title": "Toyota Rav4 2.2D-4 D 177 PS",
    "description": "\u041f\u0443\u0431\u043b\u0438\u043a\u0443\u0432\u0430\u043d\u0430 \u043e\u0431\u044f\u0432\u0430 \u043d\u0430 \u0422\u0435\u0441\u0438 \u041a\u0430\u0440, \u043d\u0430\u0431\u043b\u044e\u0434\u0430\u0432\u0430\u043d\u0430 \u043d\u0430 10.09.2026 \u0433. \u041d\u0430\u043b\u0438\u0447\u043d\u043e\u0441\u0442\u0442\u0430 \u0441\u0435 \u043f\u043e\u0442\u0432\u044a\u0440\u0436\u0434\u0430\u0432\u0430 \u0441 \u0430\u0432\u0442\u043e\u043a\u044a\u0449\u0430\u0442\u0430. \u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b\u043d\u0430 \u043e\u0431\u044f\u0432\u0430: https://tesicar.mobile.bg/obiava-21783600164931772-toyota-rav4-2-2d-4-d-177-ps",
    "price": {
      "amount": 4490,
      "currency": "EUR"
    },
    "priceType": "fixed",
    "images": [
      {
        "url": "/dealer/inventory/21783600164931772-1.webp",
        "alt": "Toyota Rav4 2.2D-4 D 177 PS"
      },
      {
        "url": "/dealer/inventory/21783600164931772-2.webp",
        "alt": "Toyota Rav4 2.2D-4 D 177 PS"
      },
      {
        "url": "/dealer/inventory/21783600164931772-3.webp",
        "alt": "Toyota Rav4 2.2D-4 D 177 PS"
      },
      {
        "url": "/dealer/inventory/21783600164931772-4.webp",
        "alt": "Toyota Rav4 2.2D-4 D 177 PS"
      }
    ],
    "badges": [
      "used"
    ],
    "location": {
      "city": "\u0412\u0430\u0440\u043d\u0430",
      "region": "\u0412\u043b\u0430\u0434\u0438\u0441\u043b\u0430\u0432 \u0412\u0430\u0440\u043d\u0435\u043d\u0447\u0438\u043a",
      "country": "\u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f"
    },
    "features": [
      {
        "bg": "4(5) \u0412\u0440\u0430\u0442\u0438",
        "en": "4(5) \u0412\u0440\u0430\u0442\u0438"
      },
      {
        "bg": "4x4",
        "en": "4x4"
      },
      {
        "bg": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "Bluetooth \\ handsfree \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
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
        "bg": "Head up display",
        "en": "Head up display"
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
        "bg": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438",
        "en": "IN\\AUX \u0438\u0437\u0432\u043e\u0434\u0438"
      },
      {
        "bg": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430",
        "en": "\u0410\u043d\u0442\u0438\u0431\u043b\u043e\u043a\u0438\u0440\u0430\u0449\u0430 \u0441\u0438\u0441\u0442\u0435\u043c\u0430"
      },
      {
        "bg": "\u0411\u0435\u0437\u043a\u043b\u044e\u0447\u043e\u0432\u043e \u043f\u0430\u043b\u0435\u043d\u0435",
        "en": "\u0411\u0435\u0437\u043a\u043b\u044e\u0447\u043e\u0432\u043e \u043f\u0430\u043b\u0435\u043d\u0435"
      },
      {
        "bg": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440",
        "en": "\u0411\u043e\u0440\u0434\u043a\u043e\u043c\u043f\u044e\u0442\u044a\u0440"
      }
    ],
    "spec": {
      "bodyType": "suv",
      "fuelType": "diesel",
      "make": "Toyota",
      "model": "Rav4 2.2D-4 D 177 PS",
      "year": 2006,
      "transmission": "manual",
      "mileageValue": 203000,
      "mileageUnit": "km",
      "enginePowerHp": 177,
      "colorExterior": "\u0427\u0435\u0440\u0435\u043d"
    },
    "seller": {
      "id": "dealer-tesi-car-varna",
      "type": "dealer",
      "displayName": "\u0422\u0435\u0441\u0438 \u041a\u0430\u0440",
      "verificationStatus": "unverified",
      "city": "\u0412\u0430\u0440\u043d\u0430"
    },
    "publishedAt": "2026-09-10T10:00:00.000Z",
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

export const mockSavedListingIds: string[] = [];

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
