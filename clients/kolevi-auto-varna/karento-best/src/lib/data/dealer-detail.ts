/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11789979969434970",
    "heading": {
      "title": "Skoda Octavia",
      "mobileTitle": "Skoda Octavia",
      "location": "Варна",
      "fleetCode": "11789979969434970",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "182500 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 182500,
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
        "value": "Petrol",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.gasoline"
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
        "value": "180 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 180,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11789979969434970-1.webp",
          "alt": "Skoda Octavia"
        },
        {
          "src": "/dealer-stock/11789979969434970-2.webp",
          "alt": "Skoda Octavia"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11789979969434970-1.webp",
          "alt": "Skoda Octavia"
        },
        {
          "src": "/dealer-stock/11789979969434970-2.webp",
          "alt": "Skoda Octavia"
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
      "name": "Колеви Ауто",
      "location": "бул. Цар Освободител, Варна, България",
      "avatar": "/dealer-brand/v2-4942cbba173691f8/logo-on-light.webp",
      "mobile": "0878431141",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "6799 EUR",
      "discount": "",
      "total": "6799 EUR",
      "priceAmount": 6799,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
