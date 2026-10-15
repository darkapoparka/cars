/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11789565203600472",
    "heading": {
      "title": "Scion Tc",
      "mobileTitle": "Scion Tc",
      "location": "Варна",
      "fleetCode": "11789565203600472",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "88550 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 88550,
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
        "value": "2006",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "163 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 163,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11789565203600472-1.webp",
          "alt": "Scion Tc"
        },
        {
          "src": "/dealer-stock/11789565203600472-2.webp",
          "alt": "Scion Tc"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11789565203600472-1.webp",
          "alt": "Scion Tc"
        },
        {
          "src": "/dealer-stock/11789565203600472-2.webp",
          "alt": "Scion Tc"
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
      "name": "Крис",
      "location": "гр. Варна, бул. ,,Цар Освободител Номер#355А, Варна, България",
      "avatar": "/dealer-brand/v2-88310c2f48c97d04/logo-on-light.webp",
      "mobile": "0899927244",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "5300 EUR",
      "discount": "",
      "total": "5300 EUR",
      "priceAmount": 5300,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
