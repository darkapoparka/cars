/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21791619772327999",
    "heading": {
      "title": "Kia Sportage",
      "mobileTitle": "Kia Sportage",
      "location": "Варна",
      "fleetCode": "21791619772327999",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "124120 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 124120,
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
        "value": "2013",
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
          "src": "/dealer-stock/21791619772327999-1.webp",
          "alt": "Kia Sportage"
        },
        {
          "src": "/dealer-stock/21791619772327999-2.webp",
          "alt": "Kia Sportage"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21791619772327999-1.webp",
          "alt": "Kia Sportage"
        },
        {
          "src": "/dealer-stock/21791619772327999-2.webp",
          "alt": "Kia Sportage"
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
      "name": "Варна Кар Експрес",
      "location": "бул.'Цар Освободител' 200м. след Дом на Камиона посока Аксаково., Варна, България",
      "avatar": "/dealer-brand/v2-06758e3f2a974714/logo-on-light.webp",
      "mobile": "0899155902",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "9399 EUR",
      "discount": "",
      "total": "9399 EUR",
      "priceAmount": 9399,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
