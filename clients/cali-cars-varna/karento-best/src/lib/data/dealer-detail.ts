/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21785846592411235",
    "heading": {
      "title": "BMW X4 M40i xDrive",
      "mobileTitle": "BMW X4 M40i xDrive",
      "location": "Варна",
      "fleetCode": "21785846592411235",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "180000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 180000,
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
          "src": "/dealer-stock/21785846592411235-1.webp",
          "alt": "BMW X4 M40i xDrive"
        },
        {
          "src": "/dealer-stock/21785846592411235-2.webp",
          "alt": "BMW X4 M40i xDrive"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21785846592411235-1.webp",
          "alt": "BMW X4 M40i xDrive"
        },
        {
          "src": "/dealer-stock/21785846592411235-2.webp",
          "alt": "BMW X4 M40i xDrive"
        }
      ]
    },
    "content": {
      "overview": [
        "BMW X4 M40i xDrive от датирана публична обява. Потвърдете цената и наличността директно с автокъщата."
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
      "name": "Cali Cars",
      "location": "Мест. Боровец Север 2029, Варна, България",
      "avatar": "/dealer-brand/v2-2976f80649f63b9b/logo-on-light.webp",
      "mobile": "0877064339",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "19500 EUR",
      "discount": "",
      "total": "19500 EUR",
      "priceAmount": 19500,
      "currency": "EUR"
    }
  },
  {
    "id": "21753383277707999",
    "heading": {
      "title": "Mercedes-Benz GLC 300 4Matic",
      "mobileTitle": "Mercedes-Benz GLC 300 4Matic",
      "location": "Варна",
      "fleetCode": "21753383277707999",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "147000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 147000,
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
        "value": "2019",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21753383277707999-1.webp",
          "alt": "Mercedes-Benz GLC 300 4Matic"
        },
        {
          "src": "/dealer-stock/21753383277707999-2.webp",
          "alt": "Mercedes-Benz GLC 300 4Matic"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21753383277707999-1.webp",
          "alt": "Mercedes-Benz GLC 300 4Matic"
        },
        {
          "src": "/dealer-stock/21753383277707999-2.webp",
          "alt": "Mercedes-Benz GLC 300 4Matic"
        }
      ]
    },
    "content": {
      "overview": [
        "Mercedes-Benz GLC 300 4Matic от датирана публична обява. Потвърдете цената и наличността директно с автокъщата."
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
      "name": "Cali Cars",
      "location": "Мест. Боровец Север 2029, Варна, България",
      "avatar": "/dealer-brand/v2-2976f80649f63b9b/logo-on-light.webp",
      "mobile": "0877064339",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "22000 EUR",
      "discount": "",
      "total": "22000 EUR",
      "priceAmount": 22000,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
