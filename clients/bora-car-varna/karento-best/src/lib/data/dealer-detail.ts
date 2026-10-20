/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11746086011937446",
    "heading": {
      "title": "Seat Ibiza",
      "mobileTitle": "Seat Ibiza",
      "location": "Варна",
      "fleetCode": "11746086011937446",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "235000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 235000,
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
        "value": "2011",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "90 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 90,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11746086011937446-1.webp",
          "alt": "Seat Ibiza"
        },
        {
          "src": "/dealer-stock/11746086011937446-2.webp",
          "alt": "Seat Ibiza"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11746086011937446-1.webp",
          "alt": "Seat Ibiza"
        },
        {
          "src": "/dealer-stock/11746086011937446-2.webp",
          "alt": "Seat Ibiza"
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
      "name": "BORA CAR",
      "location": "ж.к. Вл. Варненчик, ул. Янко Мустаков, срещу бл. 303, вх.15, спирка Вихрен, Варна, България",
      "avatar": "/dealer-brand/v2-87a27eb2ba68ac28/logo-on-light.webp",
      "mobile": "00359896699974",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "4100 EUR",
      "discount": "",
      "total": "4100 EUR",
      "priceAmount": 4100,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
