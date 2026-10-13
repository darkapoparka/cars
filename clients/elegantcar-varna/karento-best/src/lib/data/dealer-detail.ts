/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "21791544174764774",
    "heading": {
      "title": "Hyundai IX35",
      "mobileTitle": "Hyundai IX35",
      "location": "Варна",
      "fleetCode": "21791544174764774",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "250000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 250000,
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
        "value": "116 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 116,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/21791544174764774-1.webp",
          "alt": "Hyundai IX35"
        },
        {
          "src": "/dealer-stock/21791544174764774-2.webp",
          "alt": "Hyundai IX35"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/21791544174764774-1.webp",
          "alt": "Hyundai IX35"
        },
        {
          "src": "/dealer-stock/21791544174764774-2.webp",
          "alt": "Hyundai IX35"
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
      "name": "Елегант кар",
      "location": "бул. Цар Освободител разклона за Владиславово, Варна, България",
      "avatar": "/dealer-brand/v2-d61e783ce1fa0c6b/logo-on-light.webp",
      "mobile": "0877910051",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "5200 EUR",
      "discount": "",
      "total": "5200 EUR",
      "priceAmount": 5200,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
