/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11772031596218515",
    "heading": {
      "title": "VW Passat",
      "mobileTitle": "VW Passat",
      "location": "Варна",
      "fleetCode": "11772031596218515",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "220000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 220000,
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
        "value": "2012",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "140 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 140,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11772031596218515-1.webp",
          "alt": "VW Passat"
        },
        {
          "src": "/dealer-stock/11772031596218515-2.webp",
          "alt": "VW Passat"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11772031596218515-1.webp",
          "alt": "VW Passat"
        },
        {
          "src": "/dealer-stock/11772031596218515-2.webp",
          "alt": "VW Passat"
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
      "name": "АВТОСАЛОН ТРАНС КАР",
      "location": "бул.Цар Освободител 900 метра след Метро, Варна, България",
      "avatar": "/dealer-brand/v2-461cd271108a17d3/logo-on-light.webp",
      "mobile": "0898504908",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "5600 EUR",
      "discount": "",
      "total": "5600 EUR",
      "priceAmount": 5600,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
