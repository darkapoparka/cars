/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "1090",
    "heading": {
      "title": "1991 Peugeot 205 1.9 GTI Phase 2",
      "mobileTitle": "1991 Peugeot 205 1.9 GTI Phase 2",
      "location": "North Walsham, Norfolk",
      "fleetCode": "1090",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "92500 mi",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 92500,
        "unit": "mi"
      },
      {
        "id": "auto",
        "icon": "/assets/imgs/page/car/auto.svg",
        "value": "Manual",
        "labelKey": "vehicle.field.transmission",
        "valueKey": "transmission.manual"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/hatchback.webp",
          "alt": "1991 Peugeot 205 1.9 GTI Phase 2"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/hatchback.webp",
          "alt": "1991 Peugeot 205 1.9 GTI Phase 2"
        }
      ]
    },
    "content": {
      "overview": [
        "Illustration — not the advertised vehicle. These are dated listing details observed on 10 October 2026. Confirm the original advert, price, condition and availability with the dealer."
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
      "name": "North Norfolk Car Sales",
      "location": "Unit 3 Midland Road, North Walsham NR28 9JR",
      "avatar": "/dealer-brand/logo.webp",
      "mobile": "01263 653055",
      "email": "sales@northnorfolkcarsales.co.uk",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "19999 GBP",
      "discount": "",
      "total": "19999 GBP",
      "priceAmount": 19999,
      "currency": "GBP"
    }
  },
  {
    "id": "1089",
    "heading": {
      "title": "2018 Peugeot 208 GTI Prestige THP",
      "mobileTitle": "2018 Peugeot 208 GTI Prestige THP",
      "location": "North Walsham, Norfolk",
      "fleetCode": "1089",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "45500 mi",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 45500,
        "unit": "mi"
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
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/hatchback.webp",
          "alt": "2018 Peugeot 208 GTI Prestige THP"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/hatchback.webp",
          "alt": "2018 Peugeot 208 GTI Prestige THP"
        }
      ]
    },
    "content": {
      "overview": [
        "Illustration — not the advertised vehicle. These are dated listing details observed on 10 October 2026. Confirm the original advert, price, condition and availability with the dealer. The overview shows 45,500 miles; the prose rounds it to 45,000. This preview preserves the structured overview value."
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
      "name": "North Norfolk Car Sales",
      "location": "Unit 3 Midland Road, North Walsham NR28 9JR",
      "avatar": "/dealer-brand/logo.webp",
      "mobile": "01263 653055",
      "email": "sales@northnorfolkcarsales.co.uk",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "8499 GBP",
      "discount": "",
      "total": "8499 GBP",
      "priceAmount": 8499,
      "currency": "GBP"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
