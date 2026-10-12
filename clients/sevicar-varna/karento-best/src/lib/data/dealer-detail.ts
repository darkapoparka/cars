/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11781342032890584",
    "heading": {
      "title": "Audi A6 S line Plus",
      "mobileTitle": "Audi A6 S line Plus",
      "location": "Варна",
      "fleetCode": "11781342032890584",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "207189 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 207189,
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
        "value": "2018",
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
          "src": "/dealer-stock/11781342032890584-1.webp",
          "alt": "Audi A6 S line Plus"
        },
        {
          "src": "/dealer-stock/11781342032890584-2.webp",
          "alt": "Audi A6 S line Plus"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11781342032890584-1.webp",
          "alt": "Audi A6 S line Plus"
        },
        {
          "src": "/dealer-stock/11781342032890584-2.webp",
          "alt": "Audi A6 S line Plus"
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
      "name": "АВТОКЪЩА СЕВИ КАР",
      "location": "Главен път Е2 ВАРНА-СОФИЯ, 400м. след кръговото под Метро! GPS, Варна, България",
      "avatar": "/dealer-brand/v2-cec811a67b8c5e20/logo-on-light.webp",
      "mobile": "0888205072",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "18999 EUR",
      "discount": "",
      "total": "18999 EUR",
      "priceAmount": 18999,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
