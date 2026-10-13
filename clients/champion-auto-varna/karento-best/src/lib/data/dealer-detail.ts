/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21791746826227790",
    "heading": {
      "title": "BMW X6",
      "mobileTitle": "BMW X6",
      "location": "Варна",
      "fleetCode": "21791746826227790",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "179000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 179000,
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
        "value": "2015",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21791746826227790-1.webp",
          "alt": "BMW X6"
        },
        {
          "src": "/dealer-stock/21791746826227790-2.webp",
          "alt": "BMW X6"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21791746826227790-1.webp",
          "alt": "BMW X6"
        },
        {
          "src": "/dealer-stock/21791746826227790-2.webp",
          "alt": "BMW X6"
        }
      ]
    },
    "content": {
      "overview": [
        "BMW X6 от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "Сhampion Auto",
      "location": "бул. Цар Освободител 210, до изхода на КАТ, Варна, България",
      "avatar": "/dealer-brand/v2-3a0b44cd293342c3/logo-on-light.webp",
      "mobile": "0899736225",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "12000 EUR",
      "discount": "",
      "total": "12000 EUR",
      "priceAmount": 12000,
      "currency": "EUR"
    }
  },
  {
    "id": "11760906472084145",
    "heading": {
      "title": "Mercedes-Benz CLA 250",
      "mobileTitle": "Mercedes-Benz CLA 250",
      "location": "Варна",
      "fleetCode": "11760906472084145",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "79999 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 79999,
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
        "value": "2023",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11760906472084145-1.webp",
          "alt": "Mercedes-Benz CLA 250"
        },
        {
          "src": "/dealer-stock/11760906472084145-2.webp",
          "alt": "Mercedes-Benz CLA 250"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11760906472084145-1.webp",
          "alt": "Mercedes-Benz CLA 250"
        },
        {
          "src": "/dealer-stock/11760906472084145-2.webp",
          "alt": "Mercedes-Benz CLA 250"
        }
      ]
    },
    "content": {
      "overview": [
        "Mercedes-Benz CLA 250 от датирана публична обява. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "Сhampion Auto",
      "location": "бул. Цар Освободител 210, до изхода на КАТ, Варна, България",
      "avatar": "/dealer-brand/v2-3a0b44cd293342c3/logo-on-light.webp",
      "mobile": "0899736225",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "26000 EUR",
      "discount": "",
      "total": "26000 EUR",
      "priceAmount": 26000,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
