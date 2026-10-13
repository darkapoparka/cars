/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21783932906160618",
    "heading": {
      "title": "Mercedes-Benz ML 350 D",
      "mobileTitle": "Mercedes-Benz ML 350 D",
      "location": "Варна",
      "fleetCode": "21783932906160618",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "230000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 230000,
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
        "value": "2010",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21783932906160618-1.webp",
          "alt": "Mercedes-Benz ML 350 D"
        },
        {
          "src": "/dealer-stock/21783932906160618-2.webp",
          "alt": "Mercedes-Benz ML 350 D"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21783932906160618-1.webp",
          "alt": "Mercedes-Benz ML 350 D"
        },
        {
          "src": "/dealer-stock/21783932906160618-2.webp",
          "alt": "Mercedes-Benz ML 350 D"
        }
      ]
    },
    "content": {
      "overview": [
        "Mercedes-Benz ML 350 D от датирана публична обява. Продавачът посочва лек удар отзад, видим на снимките. Потвърдете състоянието, цената и наличността директно с автокъщата."
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
      "name": "Nordic Auto",
      "location": "гр. Варна, Център, Варна, България",
      "avatar": "/dealer-brand/v2-51c4172c75ecdb1f/logo-on-light.webp",
      "mobile": "0892453350",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "8000 EUR",
      "discount": "",
      "total": "8000 EUR",
      "priceAmount": 8000,
      "currency": "EUR"
    }
  },
  {
    "id": "21788770224128681",
    "heading": {
      "title": "BMW X5 3.0d",
      "mobileTitle": "BMW X5 3.0d",
      "location": "Варна",
      "fleetCode": "21788770224128681",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "260000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 260000,
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
          "src": "/dealer-stock/21788770224128681-1.webp",
          "alt": "BMW X5 3.0d"
        },
        {
          "src": "/dealer-stock/21788770224128681-2.webp",
          "alt": "BMW X5 3.0d"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21788770224128681-1.webp",
          "alt": "BMW X5 3.0d"
        },
        {
          "src": "/dealer-stock/21788770224128681-2.webp",
          "alt": "BMW X5 3.0d"
        }
      ]
    },
    "content": {
      "overview": [
        "BMW X5 3.0d от датирана публична обява. Потвърдете цената и наличността директно с автокъщата."
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
      "name": "Nordic Auto",
      "location": "гр. Варна, Център, Варна, България",
      "avatar": "/dealer-brand/v2-51c4172c75ecdb1f/logo-on-light.webp",
      "mobile": "0892453350",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "23000 EUR",
      "discount": "",
      "total": "23000 EUR",
      "priceAmount": 23000,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
