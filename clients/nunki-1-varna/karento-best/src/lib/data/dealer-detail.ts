/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21765900702522886",
    "heading": {
      "title": "Mini Countryman",
      "mobileTitle": "Mini Countryman",
      "location": "Варна",
      "fleetCode": "21765900702522886",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "230000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 230000,
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
        "value": "2010",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "116 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 116,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21765900702522886-1.webp",
          "alt": "Mini Countryman"
        },
        {
          "src": "/dealer-stock/21765900702522886-2.webp",
          "alt": "Mini Countryman"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21765900702522886-1.webp",
          "alt": "Mini Countryman"
        },
        {
          "src": "/dealer-stock/21765900702522886-2.webp",
          "alt": "Mini Countryman"
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
      "name": "NUNKI - 1",
      "location": "бул. Цар Освободител 227;9023 планова индустриална зона-Варна, Варна, България",
      "avatar": "/dealer-brand/v2-58fb38f9666e302e/logo-on-light.webp",
      "mobile": "0890426113",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "5500 EUR",
      "discount": "",
      "total": "5500 EUR",
      "priceAmount": 5500,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
