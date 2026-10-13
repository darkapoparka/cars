/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11791655661973701",
    "heading": {
      "title": "Nissan Note 1.4",
      "mobileTitle": "Nissan Note 1.4",
      "location": "Варна",
      "fleetCode": "11791655661973701",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "168000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 168000,
        "unit": "km"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Manual",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.manual"
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
        "value": "2011",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11791655661973701-1.webp",
          "alt": "Nissan Note 1.4"
        },
        {
          "src": "/dealer-stock/11791655661973701-2.webp",
          "alt": "Nissan Note 1.4"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791655661973701-1.webp",
          "alt": "Nissan Note 1.4"
        },
        {
          "src": "/dealer-stock/11791655661973701-2.webp",
          "alt": "Nissan Note 1.4"
        }
      ]
    },
    "content": {
      "overview": [
        "Nissan Note 1.4 от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "ЕКСПРЕС АУТО",
      "location": "бул.Цар Освободител 311, Варна, България",
      "avatar": "/dealer-brand/v2-d0f1242a26134695/logo-on-light.webp",
      "mobile": "0888885453",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "3390 EUR",
      "discount": "",
      "total": "3390 EUR",
      "priceAmount": 3390,
      "currency": "EUR"
    }
  },
  {
    "id": "11791655386104961",
    "heading": {
      "title": "Hyundai Ioniq Plug-in Hybrid",
      "mobileTitle": "Hyundai Ioniq Plug-in Hybrid",
      "location": "Варна",
      "fleetCode": "11791655386104961",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "126000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 126000,
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
        "value": "Hybrid",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.hybrid"
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
          "src": "/dealer-stock/11791655386104961-1.webp",
          "alt": "Hyundai Ioniq Plug-in Hybrid"
        },
        {
          "src": "/dealer-stock/11791655386104961-2.webp",
          "alt": "Hyundai Ioniq Plug-in Hybrid"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791655386104961-1.webp",
          "alt": "Hyundai Ioniq Plug-in Hybrid"
        },
        {
          "src": "/dealer-stock/11791655386104961-2.webp",
          "alt": "Hyundai Ioniq Plug-in Hybrid"
        }
      ]
    },
    "content": {
      "overview": [
        "Hyundai Ioniq Plug-in Hybrid от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "ЕКСПРЕС АУТО",
      "location": "бул.Цар Освободител 311, Варна, България",
      "avatar": "/dealer-brand/v2-d0f1242a26134695/logo-on-light.webp",
      "mobile": "0888885453",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "14999 EUR",
      "discount": "",
      "total": "14999 EUR",
      "priceAmount": 14999,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
