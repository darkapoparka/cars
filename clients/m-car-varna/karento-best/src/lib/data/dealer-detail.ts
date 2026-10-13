/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11791525148007826",
    "heading": {
      "title": "BMW 540 xDrive",
      "mobileTitle": "BMW 540 xDrive",
      "location": "Варна",
      "fleetCode": "11791525148007826",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "191000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 191000,
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
        "value": "2017",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11791525148007826-1.webp",
          "alt": "BMW 540 xDrive"
        },
        {
          "src": "/dealer-stock/11791525148007826-2.webp",
          "alt": "BMW 540 xDrive"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791525148007826-1.webp",
          "alt": "BMW 540 xDrive"
        },
        {
          "src": "/dealer-stock/11791525148007826-2.webp",
          "alt": "BMW 540 xDrive"
        }
      ]
    },
    "content": {
      "overview": [
        "BMW 540 xDrive от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "M Car Varna",
      "location": "бул. Владислав Варненчик 320, Варна, България",
      "avatar": "/dealer-brand/v2-2dd1aec68dc69962/logo-on-light.webp",
      "mobile": "+359887246669",
      "email": "contact@bmw-mcarvarna.bg",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "41900 EUR",
      "discount": "",
      "total": "41900 EUR",
      "priceAmount": 41900,
      "currency": "EUR"
    }
  },
  {
    "id": "11791452660881854",
    "heading": {
      "title": "BMW 750 xDrive",
      "mobileTitle": "BMW 750 xDrive",
      "location": "Варна",
      "fleetCode": "11791452660881854",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "70000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 70000,
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
        "value": "2017",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11791452660881854-1.webp",
          "alt": "BMW 750 xDrive"
        },
        {
          "src": "/dealer-stock/11791452660881854-2.webp",
          "alt": "BMW 750 xDrive"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791452660881854-1.webp",
          "alt": "BMW 750 xDrive"
        },
        {
          "src": "/dealer-stock/11791452660881854-2.webp",
          "alt": "BMW 750 xDrive"
        }
      ]
    },
    "content": {
      "overview": [
        "BMW 750 xDrive от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "M Car Varna",
      "location": "бул. Владислав Варненчик 320, Варна, България",
      "avatar": "/dealer-brand/v2-2dd1aec68dc69962/logo-on-light.webp",
      "mobile": "+359887246669",
      "email": "contact@bmw-mcarvarna.bg",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "34900 EUR",
      "discount": "",
      "total": "34900 EUR",
      "priceAmount": 34900,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
