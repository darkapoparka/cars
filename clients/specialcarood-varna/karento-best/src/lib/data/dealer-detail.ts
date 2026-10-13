/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21791554713149733",
    "heading": {
      "title": "Hyundai IX35",
      "mobileTitle": "Hyundai IX35",
      "location": "Варна",
      "fleetCode": "21791554713149733",
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
        "value": "2015",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "184 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 184,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21791554713149733-1.webp",
          "alt": "Hyundai IX35"
        },
        {
          "src": "/dealer-stock/21791554713149733-2.webp",
          "alt": "Hyundai IX35"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21791554713149733-1.webp",
          "alt": "Hyundai IX35"
        },
        {
          "src": "/dealer-stock/21791554713149733-2.webp",
          "alt": "Hyundai IX35"
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
      "name": "Специал Кар",
      "location": "бул. Цар Освободител 324, Варна, България",
      "avatar": "/dealer-brand/v2-4e9a2b59394217f9/logo-on-light.webp",
      "mobile": "0893557367",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "11500 EUR",
      "discount": "",
      "total": "11500 EUR",
      "priceAmount": 11500,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
