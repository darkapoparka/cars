/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21790429827660652",
    "heading": {
      "title": "BMW X1",
      "mobileTitle": "BMW X1",
      "location": "Варна",
      "fleetCode": "21790429827660652",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "118000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 118000,
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
        "value": "2020",
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
          "src": "/dealer-stock/21790429827660652-1.webp",
          "alt": "BMW X1"
        },
        {
          "src": "/dealer-stock/21790429827660652-2.webp",
          "alt": "BMW X1"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21790429827660652-1.webp",
          "alt": "BMW X1"
        },
        {
          "src": "/dealer-stock/21790429827660652-2.webp",
          "alt": "BMW X1"
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
      "name": "АУТО ЖО-ДИ",
      "location": "бул. Цар Освободител, 300 м. след светофара за Владиславово, Варна, България",
      "avatar": "/dealer-brand/v2-b9f4960fcbd7901a/logo-on-light.webp",
      "mobile": "0898545465",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "16990 EUR",
      "discount": "",
      "total": "16990 EUR",
      "priceAmount": 16990,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
