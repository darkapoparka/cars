/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11738733943918557",
    "heading": {
      "title": "VW Golf",
      "mobileTitle": "VW Golf",
      "location": "Варна",
      "fleetCode": "11738733943918557",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "50000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 50000,
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
        "value": "Electric",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.electric"
      },
      {
        "id": "year",
        "icon": "/assets/imgs/template/icons/calendar.svg",
        "value": "2017",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "116 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 116,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11738733943918557-1.webp",
          "alt": "VW Golf"
        },
        {
          "src": "/dealer-stock/11738733943918557-2.webp",
          "alt": "VW Golf"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11738733943918557-1.webp",
          "alt": "VW Golf"
        },
        {
          "src": "/dealer-stock/11738733943918557-2.webp",
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
      "name": "Ауто-бора",
      "location": "бул. Цар Освободител, Варна, България",
      "avatar": "/dealer-brand/v2-7be411a7bc73d9cd/logo-on-light.webp",
      "mobile": "0897447696",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "12700 EUR",
      "discount": "",
      "total": "12700 EUR",
      "priceAmount": 12700,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
