/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11789634848837677",
    "heading": {
      "title": "Mercedes-Benz CLA",
      "mobileTitle": "Mercedes-Benz CLA",
      "location": "Варна",
      "fleetCode": "11789634848837677",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "189211 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 189211,
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
        "value": "2022",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "115 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 115,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11789634848837677-1.webp",
          "alt": "Mercedes-Benz CLA"
        },
        {
          "src": "/dealer-stock/11789634848837677-2.webp",
          "alt": "Mercedes-Benz CLA"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11789634848837677-1.webp",
          "alt": "Mercedes-Benz CLA"
        },
        {
          "src": "/dealer-stock/11789634848837677-2.webp",
          "alt": "Mercedes-Benz CLA"
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
      "name": "BIEMAAUТO",
      "location": "Бул.Цар Освободите 202 до изхода на КАТ, Варна, България",
      "avatar": "/dealer-brand/v2-eb1bb8dc7f9ade22/logo-on-light.webp",
      "mobile": "0878258953",
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
