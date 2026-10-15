/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21791636012392100",
    "heading": {
      "title": "BMW X1 M-Paket",
      "mobileTitle": "BMW X1 M-Paket",
      "location": "Варна",
      "fleetCode": "21791636012392100",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "200000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 200000,
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
        "value": "2012",
        "labelKey": "vehicle.field.year"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21791636012392100-1.webp",
          "alt": "BMW X1 M-Paket"
        },
        {
          "src": "/dealer-stock/21791636012392100-2.webp",
          "alt": "BMW X1 M-Paket"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21791636012392100-1.webp",
          "alt": "BMW X1 M-Paket"
        },
        {
          "src": "/dealer-stock/21791636012392100-2.webp",
          "alt": "BMW X1 M-Paket"
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
      "name": "МИРАЖ АУТО",
      "location": "бул. Цар Освободител 230, срещу МЕТРО до автогуми Жижо, Варна, България",
      "avatar": "/dealer-brand/v2-c3b62a7d03bc18e1/logo-on-light.webp",
      "mobile": "0893777706",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "9900 EUR",
      "discount": "",
      "total": "9900 EUR",
      "priceAmount": 9900,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
