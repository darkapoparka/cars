/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11782822293283975",
    "heading": {
      "title": "VW Jetta",
      "mobileTitle": "VW Jetta",
      "location": "Варна",
      "fleetCode": "11782822293283975",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "187000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 187000,
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
        "value": "2013",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "105 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 105,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11782822293283975-1.webp",
          "alt": "VW Jetta"
        },
        {
          "src": "/dealer-stock/11782822293283975-2.webp",
          "alt": "VW Jetta"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11782822293283975-1.webp",
          "alt": "VW Jetta"
        },
        {
          "src": "/dealer-stock/11782822293283975-2.webp",
          "alt": "VW Jetta"
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
      "name": "ГРАНД АУТО ВАРНА",
      "location": "бул. Цар Освободител 289, до Макао посока Аксаково, Варна, България",
      "avatar": "/dealer-brand/v2-5fd3f7d4ac9e408d/logo-on-light.webp",
      "mobile": "0889811120",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "5800 EUR",
      "discount": "",
      "total": "5800 EUR",
      "priceAmount": 5800,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
