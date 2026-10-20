/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "31791553971693975",
    "heading": {
      "title": "Fiat Scudo",
      "mobileTitle": "Fiat Scudo",
      "location": "Варна",
      "fleetCode": "31791553971693975",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "38122 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 38122,
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
        "value": "Electric",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.electric"
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
        "value": "136 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 136,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/31791553971693975-1.webp",
          "alt": "Fiat Scudo"
        },
        {
          "src": "/dealer-stock/31791553971693975-2.webp",
          "alt": "Fiat Scudo"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/31791553971693975-1.webp",
          "alt": "Fiat Scudo"
        },
        {
          "src": "/dealer-stock/31791553971693975-2.webp",
          "alt": "Fiat Scudo"
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
      "name": "Eco Drive",
      "location": "Варна, България",
      "avatar": "/dealer-brand/v2-8192942a82565732/logo-on-light.webp",
      "mobile": "0897838559",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "15200 EUR",
      "discount": "",
      "total": "15200 EUR",
      "priceAmount": 15200,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
