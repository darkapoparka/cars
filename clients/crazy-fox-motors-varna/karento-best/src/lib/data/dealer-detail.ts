/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11782980086929422",
    "heading": {
      "title": "Toyota Avensis 2.2 D-CAT",
      "mobileTitle": "Toyota Avensis 2.2 D-CAT",
      "location": "Варна",
      "fleetCode": "11782980086929422",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "171081 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 171081,
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
          "src": "/dealer-stock/11782980086929422-1.webp",
          "alt": "Toyota Avensis 2.2 D-CAT"
        },
        {
          "src": "/dealer-stock/11782980086929422-2.webp",
          "alt": "Toyota Avensis 2.2 D-CAT"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11782980086929422-1.webp",
          "alt": "Toyota Avensis 2.2 D-CAT"
        },
        {
          "src": "/dealer-stock/11782980086929422-2.webp",
          "alt": "Toyota Avensis 2.2 D-CAT"
        }
      ]
    },
    "content": {
      "overview": [
        "Toyota Avensis 2.2 D-CAT от датирана публична обява. Потвърдете цената и наличността директно с автокъщата."
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
      "name": "CrazyFoxMotors",
      "location": "ул. Прилеп 87, Варна, България",
      "avatar": "/dealer-brand/v2-51633844650603a6/logo-on-light.webp",
      "mobile": "0888205488",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "5499 EUR",
      "discount": "",
      "total": "5499 EUR",
      "priceAmount": 5499,
      "currency": "EUR"
    }
  },
  {
    "id": "11782978114796435",
    "heading": {
      "title": "Porsche 911 992 Turbo S",
      "mobileTitle": "Porsche 911 992 Turbo S",
      "location": "Варна",
      "fleetCode": "11782978114796435",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "11900 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 11900,
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
        "value": "2023",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11782978114796435-1.webp",
          "alt": "Porsche 911 992 Turbo S"
        },
        {
          "src": "/dealer-stock/11782978114796435-2.webp",
          "alt": "Porsche 911 992 Turbo S"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11782978114796435-1.webp",
          "alt": "Porsche 911 992 Turbo S"
        },
        {
          "src": "/dealer-stock/11782978114796435-2.webp",
          "alt": "Porsche 911 992 Turbo S"
        }
      ]
    },
    "content": {
      "overview": [
        "Porsche 911 992 Turbo S от датирана публична обява; публикуваната цена е без ДДС. Потвърдете цената и наличността директно с автокъщата."
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
      "name": "CrazyFoxMotors",
      "location": "ул. Прилеп 87, Варна, България",
      "avatar": "/dealer-brand/v2-51633844650603a6/logo-on-light.webp",
      "mobile": "0888205488",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "199999 EUR",
      "discount": "",
      "total": "199999 EUR",
      "priceAmount": 199999,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
