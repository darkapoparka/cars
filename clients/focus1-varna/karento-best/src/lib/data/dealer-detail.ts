/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11735043947455415",
    "heading": {
      "title": "VW Golf",
      "mobileTitle": "VW Golf",
      "location": "Варна",
      "fleetCode": "11735043947455415",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "131000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 131000,
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
        "value": "Hybrid",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.hybrid"
      },
      {
        "id": "year",
        "icon": "/assets/imgs/template/icons/calendar.svg",
        "value": "2015",
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
          "src": "/dealer-stock/11735043947455415-1.webp",
          "alt": "VW Golf"
        },
        {
          "src": "/dealer-stock/11735043947455415-2.webp",
          "alt": "VW Golf"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11735043947455415-1.webp",
          "alt": "VW Golf"
        },
        {
          "src": "/dealer-stock/11735043947455415-2.webp",
          "alt": "VW Golf"
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
      "name": "автосалон Фокус",
      "location": "бул. Цар Освободител 329, Варна, България",
      "avatar": "/dealer-brand/v2-5efb500cfba4287a/logo-on-light.webp",
      "mobile": "0899811258",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "13500 EUR",
      "discount": "",
      "total": "13500 EUR",
      "priceAmount": 13500,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
