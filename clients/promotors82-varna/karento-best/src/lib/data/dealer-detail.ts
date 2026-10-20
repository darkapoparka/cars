/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11791111366122197",
    "heading": {
      "title": "Mercedes-Benz C 350",
      "mobileTitle": "Mercedes-Benz C 350",
      "location": "Варна",
      "fleetCode": "11791111366122197",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "173000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 173000,
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
        "value": "2013",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "265 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 265,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11791111366122197-1.webp",
          "alt": "Mercedes-Benz C 350"
        },
        {
          "src": "/dealer-stock/11791111366122197-2.webp",
          "alt": "Mercedes-Benz C 350"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791111366122197-1.webp",
          "alt": "Mercedes-Benz C 350"
        },
        {
          "src": "/dealer-stock/11791111366122197-2.webp",
          "alt": "Mercedes-Benz C 350"
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
      "name": "PRO MOTORS",
      "location": "бул. Христо Смирненски, Варна, България",
      "avatar": "/dealer-brand/v2-ba59c9c087af41bf/logo-on-light.webp",
      "mobile": "0899519164",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "9400 EUR",
      "discount": "",
      "total": "9400 EUR",
      "priceAmount": 9400,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
