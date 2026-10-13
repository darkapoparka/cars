/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21790941738758845",
    "heading": {
      "title": "Mitsubishi Outlander 2.2 D",
      "mobileTitle": "Mitsubishi Outlander 2.2 D",
      "location": "Варна",
      "fleetCode": "21790941738758845",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "181371 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 181371,
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
        "value": "2014",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "150 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 150,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21790941738758845-1.webp",
          "alt": "Mitsubishi Outlander 2.2 D"
        },
        {
          "src": "/dealer-stock/21790941738758845-2.webp",
          "alt": "Mitsubishi Outlander 2.2 D"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21790941738758845-1.webp",
          "alt": "Mitsubishi Outlander 2.2 D"
        },
        {
          "src": "/dealer-stock/21790941738758845-2.webp",
          "alt": "Mitsubishi Outlander 2.2 D"
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
      "name": "ЕВРОКАР",
      "location": "бул. Цар Освободител /до Дом на Камиона/, Варна, България",
      "avatar": "/dealer-brand/v2-dd155c8c1c05263b/logo-on-light.webp",
      "mobile": "0879430777",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "8800 EUR",
      "discount": "",
      "total": "8800 EUR",
      "priceAmount": 8800,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
