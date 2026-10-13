/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "demo-estate",
    "heading": {
      "title": "Demo Estate — illustration",
      "mobileTitle": "Demo Estate — illustration",
      "location": "Варна",
      "fleetCode": "demo-estate",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "12000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 12000,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Automatic",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.automatic"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "Petrol",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.gasoline"
      },
      {
        "id": "year",
        "icon": "/assets/imgs/template/icons/calendar.svg",
        "value": "2026",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/demo-estate.webp",
          "alt": "Demo Estate — illustration"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/demo-estate.webp",
          "alt": "Demo Estate — illustration"
        }
      ]
    },
    "content": {
      "overview": [
        "Илюстративен демонстрационен автомобил с примерни характеристики и цена. Не е действителна оферта или наличност на автокъщата. Изображението е генерирана декоративна илюстрация."
      ],
      "includedFeatures": [],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Auto Insurance Import",
      "location": "гр. Варна, Варна, България",
      "avatar": "/dealer-brand/v2-0b34890d15774aaf/logo-on-light.webp",
      "mobile": "0878601371",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "23900 EUR",
      "discount": "",
      "total": "23900 EUR",
      "priceAmount": 23900,
      "currency": "EUR"
    }
  },
  {
    "id": "demo-suv",
    "heading": {
      "title": "Demo SUV — illustration",
      "mobileTitle": "Demo SUV — illustration",
      "location": "Варна",
      "fleetCode": "demo-suv",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "8000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 8000,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Automatic",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.automatic"
      },
      {
        "id": "diesel",
        "icon": "/assets/imgs/page/car/diesel.svg",
        "value": "Petrol",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.gasoline"
      },
      {
        "id": "year",
        "icon": "/assets/imgs/template/icons/calendar.svg",
        "value": "2026",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/demo-suv.webp",
          "alt": "Demo SUV — illustration"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/demo-suv.webp",
          "alt": "Demo SUV — illustration"
        }
      ]
    },
    "content": {
      "overview": [
        "Илюстративен демонстрационен автомобил с примерни характеристики и цена. Не е действителна оферта или наличност на автокъщата. Изображението е генерирана декоративна илюстрация."
      ],
      "includedFeatures": [],
      "questions": [],
      "loanFields": [],
      "loanSummary": {
        "downPayment": "",
        "financed": "",
        "monthlyPayment": ""
      },
      "reviewMetrics": [],
      "reviewSummary": {
        "rating": "",
        "count": ""
      },
      "reviews": []
    },
    "seller": {
      "name": "Auto Insurance Import",
      "location": "гр. Варна, Варна, България",
      "avatar": "/dealer-brand/v2-0b34890d15774aaf/logo-on-light.webp",
      "mobile": "0878601371",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "28900 EUR",
      "discount": "",
      "total": "28900 EUR",
      "priceAmount": 28900,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
