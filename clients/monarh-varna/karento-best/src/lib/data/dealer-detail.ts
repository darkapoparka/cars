/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21789634036820538",
    "heading": {
      "title": "Isuzu TFS",
      "mobileTitle": "Isuzu TFS",
      "location": "Варна",
      "fleetCode": "21789634036820538",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "251000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 251000,
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
        "value": "Diesel",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.diesel"
      },
      {
        "id": "year",
        "icon": "/assets/imgs/template/icons/calendar.svg",
        "value": "2009",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21789634036820538-1.webp",
          "alt": "Isuzu TFS"
        },
        {
          "src": "/dealer-stock/21789634036820538-2.webp",
          "alt": "Isuzu TFS"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21789634036820538-1.webp",
          "alt": "Isuzu TFS"
        },
        {
          "src": "/dealer-stock/21789634036820538-2.webp",
          "alt": "Isuzu TFS"
        }
      ]
    },
    "content": {
      "overview": [
        "Isuzu TFS от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "Монарх",
      "location": "Бул. Цар Освободител, Варна, България",
      "avatar": "/dealer-brand/v2-98723f7778d86794/logo-on-light.webp",
      "mobile": "0877277258\r\n0877796170",
      "email": "monarh@mail.bg",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "8700 EUR",
      "discount": "",
      "total": "8700 EUR",
      "priceAmount": 8700,
      "currency": "EUR"
    }
  },
  {
    "id": "11772882774601045",
    "heading": {
      "title": "SEAT Toledo",
      "mobileTitle": "SEAT Toledo",
      "location": "Варна",
      "fleetCode": "11772882774601045",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "199000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 199000,
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
        "value": "2006",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11772882774601045-1.webp",
          "alt": "SEAT Toledo"
        },
        {
          "src": "/dealer-stock/11772882774601045-2.webp",
          "alt": "SEAT Toledo"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11772882774601045-1.webp",
          "alt": "SEAT Toledo"
        },
        {
          "src": "/dealer-stock/11772882774601045-2.webp",
          "alt": "SEAT Toledo"
        }
      ]
    },
    "content": {
      "overview": [
        "SEAT Toledo от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "Монарх",
      "location": "Бул. Цар Освободител, Варна, България",
      "avatar": "/dealer-brand/v2-98723f7778d86794/logo-on-light.webp",
      "mobile": "0877277258\r\n0877796170",
      "email": "monarh@mail.bg",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "4800 EUR",
      "discount": "",
      "total": "4800 EUR",
      "priceAmount": 4800,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
