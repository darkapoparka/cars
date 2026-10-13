/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11791701219612494",
    "heading": {
      "title": "Tesla Model 3 Standard Plus",
      "mobileTitle": "Tesla Model 3 Standard Plus",
      "location": "Варна",
      "fleetCode": "11791701219612494",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "165000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 165000,
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
        "value": "2020",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "330 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 330,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11791701219612494-1.webp",
          "alt": "Tesla Model 3 Standard Plus"
        },
        {
          "src": "/dealer-stock/11791701219612494-2.webp",
          "alt": "Tesla Model 3 Standard Plus"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791701219612494-1.webp",
          "alt": "Tesla Model 3 Standard Plus"
        },
        {
          "src": "/dealer-stock/11791701219612494-2.webp",
          "alt": "Tesla Model 3 Standard Plus"
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
      "name": "DreamCars77",
      "location": "ул. Прилеп 112, Варна, България",
      "avatar": "/dealer-brand/v2-deffdfd0e989d2ca/logo-on-light.webp",
      "mobile": "0895762847",
      "email": "contact@dreamcars77.com",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "17900 EUR",
      "discount": "",
      "total": "17900 EUR",
      "priceAmount": 17900,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
