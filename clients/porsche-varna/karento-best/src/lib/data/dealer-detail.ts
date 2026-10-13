/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11790354686274560",
    "heading": {
      "title": "Audi A5",
      "mobileTitle": "Audi A5",
      "location": "Варна",
      "fleetCode": "11790354686274560",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "3000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 3000,
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
        "value": "2026",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11790354686274560-1.webp",
          "alt": "Audi A5"
        },
        {
          "src": "/dealer-stock/11790354686274560-2.webp",
          "alt": "Audi A5"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11790354686274560-1.webp",
          "alt": "Audi A5"
        },
        {
          "src": "/dealer-stock/11790354686274560-2.webp",
          "alt": "Audi A5"
        }
      ]
    },
    "content": {
      "overview": [
        "Audi A5 от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "Porsche Varna",
      "location": "ул. Ян Хуниади 2, Варна, България",
      "avatar": "/dealer-brand/v2-a51523c9c6d92684/logo-on-light.webp",
      "mobile": "052 59 80 10",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "56980 EUR",
      "discount": "",
      "total": "56980 EUR",
      "priceAmount": 56980,
      "currency": "EUR"
    }
  },
  {
    "id": "11790324799720879",
    "heading": {
      "title": "Audi RS6 4.0 biturbo quattro",
      "mobileTitle": "Audi RS6 4.0 biturbo quattro",
      "location": "Варна",
      "fleetCode": "11790324799720879",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "58000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 58000,
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
        "value": "2021",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11790324799720879-1.webp",
          "alt": "Audi RS6 4.0 biturbo quattro"
        },
        {
          "src": "/dealer-stock/11790324799720879-2.webp",
          "alt": "Audi RS6 4.0 biturbo quattro"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11790324799720879-1.webp",
          "alt": "Audi RS6 4.0 biturbo quattro"
        },
        {
          "src": "/dealer-stock/11790324799720879-2.webp",
          "alt": "Audi RS6 4.0 biturbo quattro"
        }
      ]
    },
    "content": {
      "overview": [
        "Audi RS6 4.0 biturbo quattro от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "Porsche Varna",
      "location": "ул. Ян Хуниади 2, Варна, България",
      "avatar": "/dealer-brand/v2-a51523c9c6d92684/logo-on-light.webp",
      "mobile": "052 59 80 10",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "99899 EUR",
      "discount": "",
      "total": "99899 EUR",
      "priceAmount": 99899,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
