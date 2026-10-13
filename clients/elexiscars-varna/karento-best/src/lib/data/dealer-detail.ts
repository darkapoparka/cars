/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11791221331078489",
    "heading": {
      "title": "BMW 640",
      "mobileTitle": "BMW 640",
      "location": "Варна",
      "fleetCode": "11791221331078489",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "213700 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 213700,
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
        "value": "2017",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "313 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 313,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11791221331078489-1.webp",
          "alt": "BMW 640"
        },
        {
          "src": "/dealer-stock/11791221331078489-2.webp",
          "alt": "BMW 640"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791221331078489-1.webp",
          "alt": "BMW 640"
        },
        {
          "src": "/dealer-stock/11791221331078489-2.webp",
          "alt": "BMW 640"
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
      "name": "ELEXIS CARS",
      "location": "ул. Проф. Цани Калянджиев 6, Варна, България",
      "avatar": "/dealer-brand/v2-09aceb0e74a91828/logo-on-light.webp",
      "mobile": "0899388989",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "20000 EUR",
      "discount": "",
      "total": "20000 EUR",
      "priceAmount": 20000,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
