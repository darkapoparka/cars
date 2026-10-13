/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11780909059810932",
    "heading": {
      "title": "VW Jetta",
      "mobileTitle": "VW Jetta",
      "location": "Варна",
      "fleetCode": "11780909059810932",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "150000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 150000,
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
        "value": "2009",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "122 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 122,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11780909059810932-1.webp",
          "alt": "VW Jetta"
        },
        {
          "src": "/dealer-stock/11780909059810932-2.webp",
          "alt": "VW Jetta"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11780909059810932-1.webp",
          "alt": "VW Jetta"
        },
        {
          "src": "/dealer-stock/11780909059810932-2.webp",
          "alt": "VW Jetta"
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
      "name": "МЛАДОСТ 2 - Внос на автомобили от западна Европа",
      "location": "бул. Цар Освободител 290, Варна, България",
      "avatar": "/dealer-brand/v2-616ce19740a84cc6/logo-on-light.webp",
      "mobile": "0897873671",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "3150 EUR",
      "discount": "",
      "total": "3150 EUR",
      "priceAmount": 3150,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
