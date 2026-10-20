/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11790197858680969",
    "heading": {
      "title": "Mercedes-Benz C 200",
      "mobileTitle": "Mercedes-Benz C 200",
      "location": "Варна",
      "fleetCode": "11790197858680969",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "231000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 231000,
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
        "value": "Petrol",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.gasoline"
      },
      {
        "id": "year",
        "icon": "/assets/imgs/template/icons/calendar.svg",
        "value": "2010",
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
          "src": "/dealer-stock/11790197858680969-1.webp",
          "alt": "Mercedes-Benz C 200"
        },
        {
          "src": "/dealer-stock/11790197858680969-2.webp",
          "alt": "Mercedes-Benz C 200"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11790197858680969-1.webp",
          "alt": "Mercedes-Benz C 200"
        },
        {
          "src": "/dealer-stock/11790197858680969-2.webp",
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
      "name": "Х CAR",
      "location": "Север, бул. Владислав Варненчик, Варна, България",
      "avatar": "/dealer-brand/v2-70232141a1307631/logo-on-light.webp",
      "mobile": "0988975522",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "5500 EUR",
      "discount": "",
      "total": "5500 EUR",
      "priceAmount": 5500,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
