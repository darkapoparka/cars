/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11790858680832903",
    "heading": {
      "title": "Hyundai Ioniq 5",
      "mobileTitle": "Hyundai Ioniq 5",
      "location": "Варна",
      "fleetCode": "11790858680832903",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "85000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 85000,
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
        "value": "2024",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "170 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 170,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11790858680832903-1.webp",
          "alt": "Hyundai Ioniq 5"
        },
        {
          "src": "/dealer-stock/11790858680832903-2.webp",
          "alt": "Hyundai Ioniq 5"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11790858680832903-1.webp",
          "alt": "Hyundai Ioniq 5"
        },
        {
          "src": "/dealer-stock/11790858680832903-2.webp",
          "alt": "Hyundai Ioniq 5"
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
      "name": "СТЕФАН КАР -внос и продажба на автомобили",
      "location": "бул. Цар Освободител 500 метра след метро, Варна, България",
      "avatar": "/dealer-brand/v2-34b703404e5d59e6/logo-on-light.webp",
      "mobile": "0888229977",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "29500 EUR",
      "discount": "",
      "total": "29500 EUR",
      "priceAmount": 29500,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
