/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "31791195588891492",
    "heading": {
      "title": "Renault Trafic",
      "mobileTitle": "Renault Trafic",
      "location": "Варна",
      "fleetCode": "31791195588891492",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "294749 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 294749,
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
        "value": "Diesel",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.diesel"
      },
      {
        "id": "year",
        "icon": "/assets/imgs/template/icons/calendar.svg",
        "value": "2002",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "100 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 100,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/31791195588891492-1.webp",
          "alt": "Renault Trafic"
        },
        {
          "src": "/dealer-stock/31791195588891492-2.webp",
          "alt": "Renault Trafic"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/31791195588891492-1.webp",
          "alt": "Renault Trafic"
        },
        {
          "src": "/dealer-stock/31791195588891492-2.webp",
          "alt": "Renault Trafic"
        }
      ]
    },
    "content": {
      "overview": [
        "Датирана извадка от публикувана обява. Състоянието, цената и наличността се потвърждават директно с автокъщата."
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
      "name": "АБЦ БЪЛГАРИЯ ЕООД",
      "location": "ул. Орех 1, Варна, България",
      "avatar": "/dealer-brand/v2-3fde0f5c25977792/logo-on-light.webp",
      "mobile": "0893324178",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "2800 EUR",
      "discount": "",
      "total": "2800 EUR",
      "priceAmount": 2800,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
