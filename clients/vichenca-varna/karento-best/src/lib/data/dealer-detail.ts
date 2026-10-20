/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11790920424243530",
    "heading": {
      "title": "BMW 740",
      "mobileTitle": "BMW 740",
      "location": "Варна",
      "fleetCode": "11790920424243530",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "222000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 222000,
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
        "value": "2011",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "300 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 300,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11790920424243530-1.webp",
          "alt": "BMW 740"
        },
        {
          "src": "/dealer-stock/11790920424243530-2.webp",
          "alt": "BMW 740"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11790920424243530-1.webp",
          "alt": "BMW 740"
        },
        {
          "src": "/dealer-stock/11790920424243530-2.webp",
          "alt": "BMW 740"
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
      "name": "VICHENCA",
      "location": "бул. Цал Освободител, третият автосалон откъм летището в ляво, Варна, България",
      "avatar": "/dealer-brand/v2-c4b6ad087c72721d/logo-on-light.webp",
      "mobile": "0877 778 669",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "11600 EUR",
      "discount": "",
      "total": "11600 EUR",
      "priceAmount": 11600,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
