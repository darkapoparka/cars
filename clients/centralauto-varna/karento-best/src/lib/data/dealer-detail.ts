/** Generated from the dealer's dated fact pack; no live stock or finance approval. */
import type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';
export interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }
export const dealerDetails: readonly DealerDetail[] = [
  {
    "id": "11791547125620834",
    "heading": {
      "title": "Opel Astra 1.4",
      "mobileTitle": "Opel Astra 1.4",
      "location": "Варна",
      "fleetCode": "11791547125620834",
      "rating": "",
      "reviewCount": ""
    },
    "specifications": [
      {
        "id": "km",
        "icon": "/assets/imgs/page/car/km.svg",
        "value": "107000 km",
        "labelKey": "vehicle.field.mileage",
        "valueNumber": 107000,
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
        "value": "2002",
        "labelKey": "vehicle.field.year"
      },
      {
        "id": "lit",
        "icon": "/assets/imgs/page/car/lit.svg",
        "value": "60 hp",
        "labelKey": "vehicle.field.power",
        "valueNumber": 60,
        "unit": "hp"
      }
    ],
    "gallery": {
      "slides": [
        {
          "src": "/dealer-stock/11791547125620834-1.webp",
          "alt": "Opel Astra 1.4"
        },
        {
          "src": "/dealer-stock/11791547125620834-2.webp",
          "alt": "Opel Astra 1.4"
        }
      ],
      "thumbnails": [
        {
          "src": "/dealer-stock/11791547125620834-1.webp",
          "alt": "Opel Astra 1.4"
        },
        {
          "src": "/dealer-stock/11791547125620834-2.webp",
          "alt": "Opel Astra 1.4"
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
      "name": "Ц Е Н Т Р А Л-АВТОСАЛОН",
      "location": "бул. 'Ян Хуняди' 23 /под музей 'Вл. Варненчик'/, Варна, България",
      "avatar": "/dealer-brand/v2-af42150539a0243d/logo-on-light.webp",
      "mobile": "0888602290",
      "email": "",
      "whatsapp": "",
      "fax": ""
    },
    "reservation": {
      "title": "Vehicle enquiry",
      "pickUp": "",
      "dropOff": "",
      "extras": [],
      "subtotal": "1350 EUR",
      "discount": "",
      "total": "1350 EUR",
      "priceAmount": 1350,
      "currency": "EUR"
    }
  }
];
export function dealerDetailFor(id: string | null): DealerDetail | null {
  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;
}
