/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21767710555691116",
    "heading": {
      "title": "VW Tiguan",
      "mobileTitle": "VW Tiguan",
      "location": "Варна",
      "fleetCode": "21767710555691116",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "198000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 198000,
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
        "value": "2017",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "190 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 190,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21767710555691116-1.webp",
          "alt": "VW Tiguan"
        },
        {
          "src": "/dealer-stock/21767710555691116-2.webp",
          "alt": "VW Tiguan"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21767710555691116-1.webp",
          "alt": "VW Tiguan"
        },
        {
          "src": "/dealer-stock/21767710555691116-2.webp",
          "alt": "VW Tiguan"
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
      "name": "УНИТРЕЙД",
      "location": "бул. Цар Освободител-след последния светофар за Владиславово 200 метра вляво, Варна, България",
      "avatar": "/dealer-brand/v2-0be7408b076da7db/logo-on-light.webp",
      "mobile": "0887479224",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "18500 EUR",
      "discount": "",
      "total": "18500 EUR",
      "priceAmount": 18500,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
