/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21731000046562940",
    "heading": {
      "title": "BMW X6",
      "mobileTitle": "BMW X6",
      "location": "Варна",
      "fleetCode": "21731000046562940",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "43300 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 43300,
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
        "value": "2021",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "625 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 625,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21731000046562940-1.webp",
          "alt": "BMW X6"
        },
        {
          "src": "/dealer-stock/21731000046562940-2.webp",
          "alt": "BMW X6"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21731000046562940-1.webp",
          "alt": "BMW X6"
        },
        {
          "src": "/dealer-stock/21731000046562940-2.webp",
          "alt": "BMW X6"
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
      "name": "Автоцентър Баваро",
      "location": "бул. Цар Освободител 176, срещу бл. 107, Варна, България",
      "avatar": "/dealer-brand/v2-755624b53a9c0eda/logo-on-light.webp",
      "mobile": "0883590090",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "89999 EUR",
      "discount": "",
      "total": "89999 EUR",
      "priceAmount": 89999,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
