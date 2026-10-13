/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11778841437368042",
    "heading": {
      "title": "VW Touran",
      "mobileTitle": "VW Touran",
      "location": "Варна",
      "fleetCode": "11778841437368042",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "261000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 261000,
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
        "value": "2007",
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
          "src": "/dealer-stock/11778841437368042-1.webp",
          "alt": "VW Touran"
        },
        {
          "src": "/dealer-stock/11778841437368042-2.webp",
          "alt": "VW Touran"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11778841437368042-1.webp",
          "alt": "VW Touran"
        },
        {
          "src": "/dealer-stock/11778841437368042-2.webp",
          "alt": "VW Touran"
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
      "name": "AutoStar",
      "location": "Ул. Тодор Радев Пенев 5Д, 9009, Варна, България",
      "avatar": "/dealer-brand/v2-26972c6239c76e5f/logo-on-light.webp",
      "mobile": "0887700052",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "4700 EUR",
      "discount": "",
      "total": "4700 EUR",
      "priceAmount": 4700,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
