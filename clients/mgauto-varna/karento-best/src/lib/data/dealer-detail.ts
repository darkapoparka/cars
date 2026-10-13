/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11730027667237293",
    "heading": {
      "title": "Peugeot 2008",
      "mobileTitle": "Peugeot 2008",
      "location": "Варна",
      "fleetCode": "11730027667237293",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "38969 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 38969,
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
        "value": "Petrol",
        "labelKey": "vehicle.field.fuel",
        "valueKey": "fuel.gasoline"
      },
      {
        "id": "year",
        "icon": "/assets/imgs/template/icons/calendar.svg",
        "value": "2018",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "83 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 83,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11730027667237293-1.webp",
          "alt": "Peugeot 2008"
        },
        {
          "src": "/dealer-stock/11730027667237293-2.webp",
          "alt": "Peugeot 2008"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11730027667237293-1.webp",
          "alt": "Peugeot 2008"
        },
        {
          "src": "/dealer-stock/11730027667237293-2.webp",
          "alt": "Peugeot 2008"
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
      "name": "Автосалон М&G auto",
      "location": "бул. Цар Освободител, Варна, България",
      "avatar": "/dealer-brand/v2-1b42d173387ad5ae/logo-on-light.webp",
      "mobile": "0895478847",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "9600 EUR",
      "discount": "",
      "total": "9600 EUR",
      "priceAmount": 9600,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
