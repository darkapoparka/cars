/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11791360937601498",
    "heading": {
      "title": "Citroen C4 Picasso 2.0i",
      "mobileTitle": "Citroen C4 Picasso 2.0i",
      "location": "Варна",
      "fleetCode": "11791360937601498",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "169000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 169000,
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
        "value": "2008",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "140 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 140,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11791360937601498-1.webp",
          "alt": "Citroen C4 Picasso 2.0i"
        },
        {
          "src": "/dealer-stock/11791360937601498-2.webp",
          "alt": "Citroen C4 Picasso 2.0i"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791360937601498-1.webp",
          "alt": "Citroen C4 Picasso 2.0i"
        },
        {
          "src": "/dealer-stock/11791360937601498-2.webp",
          "alt": "Citroen C4 Picasso 2.0i"
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
      "name": "Kalchev Correct",
      "location": "пътя за Побитите камъни, на 200 метра от разклона за с.Тополи, отляво, Варна, България",
      "avatar": "/dealer-brand/v2-f39ea5a561358052/logo-on-light.webp",
      "mobile": "0879699644",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "2900 EUR",
      "discount": "",
      "total": "2900 EUR",
      "priceAmount": 2900,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
