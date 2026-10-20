/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21765547669329836",
    "heading": {
      "title": "Toyota Hilux",
      "mobileTitle": "Toyota Hilux",
      "location": "Варна",
      "fleetCode": "21765547669329836",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "32290 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 32290,
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
        "value": "2024",
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
          "src": "/dealer-stock/21765547669329836-1.webp",
          "alt": "Toyota Hilux"
        },
        {
          "src": "/dealer-stock/21765547669329836-2.webp",
          "alt": "Toyota Hilux"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21765547669329836-1.webp",
          "alt": "Toyota Hilux"
        },
        {
          "src": "/dealer-stock/21765547669329836-2.webp",
          "alt": "Toyota Hilux"
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
      "name": "АВТОМОТОР ВАРНА АД",
      "location": "Бул. Цар Освободител 277, Варна, България",
      "avatar": "/dealer-brand/v2-4235bb07b7b4eb43/logo-on-light.webp",
      "mobile": "0885735255",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "34800 EUR",
      "discount": "",
      "total": "34800 EUR",
      "priceAmount": 34800,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
