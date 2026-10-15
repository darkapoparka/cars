/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11791629866548922",
    "heading": {
      "title": "BMW 3gt",
      "mobileTitle": "BMW 3gt",
      "location": "Варна",
      "fleetCode": "11791629866548922",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "217000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 217000,
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
        "value": "2016",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "190 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 190,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11791629866548922-1.webp",
          "alt": "BMW 3gt"
        },
        {
          "src": "/dealer-stock/11791629866548922-2.webp",
          "alt": "BMW 3gt"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791629866548922-1.webp",
          "alt": "BMW 3gt"
        },
        {
          "src": "/dealer-stock/11791629866548922-2.webp",
          "alt": "BMW 3gt"
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
      "name": "Автосалон СТАДИОНА",
      "location": "бул.Цар Освободител-след Метро, Варна, България",
      "avatar": "/dealer-brand/v2-213e1320bece47f5/logo-on-light.webp",
      "mobile": "0898838353",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "15499 EUR",
      "discount": "",
      "total": "15499 EUR",
      "priceAmount": 15499,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
