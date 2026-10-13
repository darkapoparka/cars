/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11786179380757560",
    "heading": {
      "title": "VW Passat",
      "mobileTitle": "VW Passat",
      "location": "Тополи",
      "fleetCode": "11786179380757560",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "202000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 202000,
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
        "value": "2011",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "110 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 110,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11786179380757560-1.webp",
          "alt": "VW Passat"
        },
        {
          "src": "/dealer-stock/11786179380757560-2.webp",
          "alt": "VW Passat"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11786179380757560-1.webp",
          "alt": "VW Passat"
        },
        {
          "src": "/dealer-stock/11786179380757560-2.webp",
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
      "name": "BUS Center Bulgaria",
      "location": "с. Тополи, изход към крайезерен път, България",
      "avatar": "/dealer-brand/v2-d016491f7df96de9/logo-on-light.webp",
      "mobile": "0888244000",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "3999 EUR",
      "discount": "",
      "total": "3999 EUR",
      "priceAmount": 3999,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
