/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11791631223924420",
    "heading": {
      "title": "Mercedes-Benz C 200",
      "mobileTitle": "Mercedes-Benz C 200",
      "location": "Варна",
      "fleetCode": "11791631223924420",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "227000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 227000,
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
        "value": "2023",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "163 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 163,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11791631223924420-1.webp",
          "alt": "Mercedes-Benz C 200"
        },
        {
          "src": "/dealer-stock/11791631223924420-2.webp",
          "alt": "Mercedes-Benz C 200"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791631223924420-1.webp",
          "alt": "Mercedes-Benz C 200"
        },
        {
          "src": "/dealer-stock/11791631223924420-2.webp",
          "alt": "Mercedes-Benz C 200"
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
      "name": "VV Cars",
      "location": "Бул. Цар Освободител - 200 метра след светофара на Дом на камиона - отдясно, Варна, България",
      "avatar": "/dealer-brand/v2-1ba887dbe0b1d18a/logo-on-light.webp",
      "mobile": "0898 554 198",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "21799 EUR",
      "discount": "",
      "total": "21799 EUR",
      "priceAmount": 21799,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
