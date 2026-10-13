/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11743226761008533",
    "heading": {
      "title": "Tesla Model S",
      "mobileTitle": "Tesla Model S",
      "location": "Варна",
      "fleetCode": "11743226761008533",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "133000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 133000,
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
        "value": "2018",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "418 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 418,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11743226761008533-1.webp",
          "alt": "Tesla Model S"
        },
        {
          "src": "/dealer-stock/11743226761008533-2.webp",
          "alt": "Tesla Model S"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11743226761008533-1.webp",
          "alt": "Tesla Model S"
        },
        {
          "src": "/dealer-stock/11743226761008533-2.webp",
          "alt": "Tesla Model S"
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
      "name": "Electric Auto",
      "location": "ул. Лале 1, Варна, България",
      "avatar": "/dealer-brand/v2-c14337c148e680f7/logo-on-light.webp",
      "mobile": "0879904724",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "19990 EUR",
      "discount": "",
      "total": "19990 EUR",
      "priceAmount": 19990,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
