/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11786124378124232",
    "heading": {
      "title": "VW Passat",
      "mobileTitle": "VW Passat",
      "location": "Варна",
      "fleetCode": "11786124378124232",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "80700 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 80700,
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
        "value": "2023",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11786124378124232-1.webp",
          "alt": "VW Passat"
        },
        {
          "src": "/dealer-stock/11786124378124232-2.webp",
          "alt": "VW Passat"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11786124378124232-1.webp",
          "alt": "VW Passat"
        },
        {
          "src": "/dealer-stock/11786124378124232-2.webp",
          "alt": "VW Passat"
        }
      ]
    },
    "content": {
      "overview": [
        "VW Passat от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "ДайнАуто",
      "location": "ул. Петър Дертлиев 34, Варна, България",
      "avatar": "/dealer-brand/v2-e19f2a798bd049b7/logo-on-light.webp",
      "mobile": "+359899117330",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "20500 EUR",
      "discount": "",
      "total": "20500 EUR",
      "priceAmount": 20500,
      "currency": "EUR"
    }
  },
  {
    "id": "11790325495830727",
    "heading": {
      "title": "Audi A5 45 TDI quattro",
      "mobileTitle": "Audi A5 45 TDI quattro",
      "location": "Варна",
      "fleetCode": "11790325495830727",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "119715 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 119715,
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
        "value": "2019",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11790325495830727-1.webp",
          "alt": "Audi A5 45 TDI quattro"
        },
        {
          "src": "/dealer-stock/11790325495830727-2.webp",
          "alt": "Audi A5 45 TDI quattro"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11790325495830727-1.webp",
          "alt": "Audi A5 45 TDI quattro"
        },
        {
          "src": "/dealer-stock/11790325495830727-2.webp",
          "alt": "Audi A5 45 TDI quattro"
        }
      ]
    },
    "content": {
      "overview": [
        "Audi A5 45 TDI quattro от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "ДайнАуто",
      "location": "ул. Петър Дертлиев 34, Варна, България",
      "avatar": "/dealer-brand/v2-e19f2a798bd049b7/logo-on-light.webp",
      "mobile": "+359899117330",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "21500 EUR",
      "discount": "",
      "total": "21500 EUR",
      "priceAmount": 21500,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
