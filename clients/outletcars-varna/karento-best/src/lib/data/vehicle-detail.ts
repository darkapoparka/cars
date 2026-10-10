import {
  message,
  type CatalogText,
  type PlainMessageKey,
} from "#lib/i18n/text.ts";
/** Reference-only presentation content. Dealer personalization is supplied separately. */
export interface DetailSpecification {
  readonly id: string;
  readonly icon: string;
  readonly value: CatalogText;
  /** Optional short phone label; the complete value remains accessible. */
  readonly mobileValue?: CatalogText;
  readonly labelKey?: PlainMessageKey;
  readonly valueNumber?: number;
  readonly unit?: "km" | "mi" | "hp";
  readonly valueKey?:
    | "fuel.diesel"
    | "fuel.gasoline"
    | "fuel.electric"
    | "fuel.hybrid"
    | "fuel.lpg"
    | "fuel.other"
    | "transmission.automatic"
    | "transmission.manual"
    | "transmission.other";
}
export interface DetailQuestion {
  readonly id: string;
  readonly question: CatalogText;
  readonly answer: CatalogText;
  readonly featured: boolean;
}
export interface ReviewMetric {
  readonly id: string;
  readonly label: CatalogText;
  readonly progressClass: string;
  readonly average: string;
}
export interface DetailReview {
  readonly id: string;
  readonly author: string;
  readonly avatar: string;
  readonly date: string;
  readonly text: CatalogText;
}
export interface DetailSeller {
  readonly name: string;
  readonly location: string;
  readonly avatar: string;
  readonly mobile: string;
  readonly email: string;
  readonly whatsapp: string;
  readonly fax: string;
}
export interface ReservationExtra {
  readonly id: string;
  readonly label: CatalogText;
  readonly price: string;
}
export interface DetailReservation {
  readonly title: CatalogText;
  readonly pickUp: string;
  readonly dropOff: string;
  readonly extras: readonly ReservationExtra[];
  readonly subtotal: string;
  readonly discount: string;
  readonly total: string;
  readonly priceAmount?: number;
  readonly currency?: string;
}
export interface DetailLoanField {
  readonly id: string;
  readonly label: CatalogText;
  readonly placeholder: CatalogText;
}
export interface DetailBrand {
  readonly id: string;
  readonly light: string;
  readonly dark: string;
}
export interface DetailRelatedProduct {
  readonly id: string;
  readonly image: string;
  readonly title: string;
  readonly price: string;
}
export interface DetailHeading {
  readonly title: string;
  readonly mobileTitle?: string;
  readonly location: string;
  readonly fleetCode: string;
  readonly rating: string;
  readonly reviewCount: CatalogText;
  readonly titleKey?: PlainMessageKey;
}

export const referenceSpecifications: readonly DetailSpecification[] = [
  {
    "id": "km",
    "icon": "/assets/imgs/page/car/km.svg",
    "value": "80037 km",
    "labelKey": "vehicle.field.mileage",
    "valueNumber": 80037,
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
  }
];

export const referenceOverview: readonly CatalogText[] = [];

export const referenceIncludedFeatures: readonly CatalogText[] = [
  "360 camera \\ Задна камера",
  "4(5) Врати",
  "4x4",
  "Auto Start Stop function",
  "Bluetooth \\ handsfree система",
  "LED фарове",
  "Автоматично затваряне на багажника",
  "Адаптивни предни светлини",
  "Антиблокираща система",
  "Безключово палене ",
  "Блокаж на диференциала",
  "Бордкомпютър",
  "Бързи \\ бавни скорости",
  "Въздушни възглавници - Задни",
  "Въздушни възглавници - Предни",
  "Въздушни възглавници - Странични",
  "Датчик за светлина",
  "Ел. Огледала",
  "Ел. Стъкла",
  "Ел. разпределяне на спирачното усилие",
  "Ел. регулиране на седалките",
  "Ел. усилвател на волана",
  "Електронна програма за стабилизиране",
  "Климатроник",
  "Контрол на налягането на гумите",
  "Ксенонови фарове",
  "Лети джанти",
  "Лизинг",
  "Мултифункционален волан",
  "Навигация",
  "Напълно обслужен",
  "Парктроник",
  "Подгряване на предното стъкло",
  "Подгряване на седалките",
  "Регулиране на волана",
  "С регистрация",
  "Серво усилвател на волана",
  "Система ISOFIX",
  "Система за динамична устойчивост",
  "Система за защита от пробуксуване",
  "Система за измиване на фаровете",
  "Система за контрол на дистанцията",
  "Система за контрол на скоростта (автопилот)",
  "Система за контрол на спускането",
  "Спойлери",
  "Теглич",
  "Термопомпа",
  "Централно заключване"
];

export const referenceProductFeatures: readonly CatalogText[] = [
  message("reference.vehicle.product-features.1"),
  message("reference.vehicle.product-features.2"),
  message("reference.vehicle.product-features.3"),
  message("reference.vehicle.product-features.4"),
];

export const referenceQuestions: readonly DetailQuestion[] = [];

export const referenceReviewMetrics: readonly ReviewMetric[] = [];

export const referenceReviews: readonly DetailReview[] = [];

export const referenceSeller: DetailSeller = {
  "name": "OUTLETCARS.BG — Варна",
  "location": "бул. Янош Хуняди 518, срещу КАТ Варна, Варна, България",
  "avatar": "/dealer-brand/logo-on-light.webp",
  "mobile": "0898 921 010",
  "email": "",
  "whatsapp": "",
  "fax": ""
};

export const referenceReservation: DetailReservation = {
  "title": "Vehicle enquiry",
  "pickUp": "",
  "dropOff": "",
  "extras": [],
  "subtotal": "39500 EUR",
  "discount": "",
  "total": "39500 EUR",
  "priceAmount": 39500,
  "currency": "EUR"
};

export const referenceLoanFields: readonly DetailLoanField[] = [
  {
    id: "price-of-vehicle",
    label: message("reference.vehicle.loan-fields.price-of-vehicle.label"),
    placeholder: "$20,000",
  },
  {
    id: "interest-rate",
    label: message("reference.vehicle.loan-fields.interest-rate.label"),
    placeholder: "5%",
  },
  {
    id: "terms",
    label: message("reference.vehicle.loan-fields.terms.label"),
    placeholder: message("reference.vehicle.loan-fields.terms.placeholder"),
  },
  {
    id: "down-payment",
    label: message("reference.vehicle.loan-fields.down-payment.label"),
    placeholder: "$12,000",
  },
];

export const referenceDetailBrands: readonly DetailBrand[] = [
  {
    id: "lexus-primary",
    light: "/assets/imgs/page/homepage2/lexus.png",
    dark: "/assets/imgs/page/homepage2/lexus-w.png",
  },
  {
    id: "mer-primary",
    light: "/assets/imgs/page/homepage2/mer.png",
    dark: "/assets/imgs/page/homepage2/mer-w.png",
  },
  {
    id: "bugatti-primary",
    light: "/assets/imgs/page/homepage2/bugatti.png",
    dark: "/assets/imgs/page/homepage2/bugatti-w.png",
  },
  {
    id: "jaguar-primary",
    light: "/assets/imgs/page/homepage2/jaguar.png",
    dark: "/assets/imgs/page/homepage2/jaguar-w.png",
  },
  {
    id: "honda-primary",
    light: "/assets/imgs/page/homepage2/honda.png",
    dark: "/assets/imgs/page/homepage2/honda-w.png",
  },
  {
    id: "chevrolet-primary",
    light: "/assets/imgs/page/homepage2/chevrolet.png",
    dark: "/assets/imgs/page/homepage2/chevrolet-w.png",
  },
  {
    id: "acura-primary",
    light: "/assets/imgs/page/homepage2/acura.png",
    dark: "/assets/imgs/page/homepage2/acura-w.png",
  },
  {
    id: "bmw-primary",
    light: "/assets/imgs/page/homepage2/bmw.png",
    dark: "/assets/imgs/page/homepage2/bmw-w.png",
  },
  {
    id: "toyota-primary",
    light: "/assets/imgs/page/homepage2/toyota.png",
    dark: "/assets/imgs/page/homepage2/toyota-w.png",
  },
  {
    id: "lexus-repeat",
    light: "/assets/imgs/page/homepage2/lexus.png",
    dark: "/assets/imgs/page/homepage2/lexus-w.png",
  },
  {
    id: "mer-repeat",
    light: "/assets/imgs/page/homepage2/mer.png",
    dark: "/assets/imgs/page/homepage2/mer-w.png",
  },
  {
    id: "bugatti-repeat",
    light: "/assets/imgs/page/homepage2/bugatti.png",
    dark: "/assets/imgs/page/homepage2/bugatti-w.png",
  },
];

export const referenceRelatedProducts: readonly DetailRelatedProduct[] = [];

export const referenceHeading: DetailHeading = {
  "title": "Audi Q5 Mild Hybrid/S-line/quattro 1 ГОДИНА ГАРАНЦИЯ",
  "mobileTitle": "Audi Q5 Mild Hybrid/S-line/quattro 1 ГОДИНА ГАРАНЦИЯ",
  "location": "Варна",
  "fleetCode": "21780566866553359",
  "rating": "",
  "reviewCount": ""
};

export interface DetailGalleryImage {
  readonly src: string;
  readonly alt: string;
}
export interface DetailSliderGallery {
  readonly slides: readonly DetailGalleryImage[];
  readonly thumbnails: readonly DetailGalleryImage[];
}
export interface DetailGridGallery {
  readonly hero: DetailGalleryImage;
  readonly columns: readonly {
    readonly id: string;
    readonly images: readonly DetailGalleryImage[];
  }[];
}
export const referenceSliderGallery: DetailSliderGallery = {
  "slides": [
    {
      "src": "/dealer/inventory/21780566866553359-1.webp",
      "alt": "Audi Q5 Mild Hybrid/S-line/quattro 1 ГОДИНА ГАРАНЦИЯ"
    },
    {
      "src": "/dealer/inventory/21780566866553359-2.webp",
      "alt": "Audi Q5 Mild Hybrid/S-line/quattro 1 ГОДИНА ГАРАНЦИЯ"
    },
    {
      "src": "/dealer/inventory/21780566866553359-3.webp",
      "alt": "Audi Q5 Mild Hybrid/S-line/quattro 1 ГОДИНА ГАРАНЦИЯ"
    }
  ],
  "thumbnails": [
    {
      "src": "/dealer/inventory/21780566866553359-1.webp",
      "alt": "Audi Q5 Mild Hybrid/S-line/quattro 1 ГОДИНА ГАРАНЦИЯ"
    },
    {
      "src": "/dealer/inventory/21780566866553359-2.webp",
      "alt": "Audi Q5 Mild Hybrid/S-line/quattro 1 ГОДИНА ГАРАНЦИЯ"
    },
    {
      "src": "/dealer/inventory/21780566866553359-3.webp",
      "alt": "Audi Q5 Mild Hybrid/S-line/quattro 1 ГОДИНА ГАРАНЦИЯ"
    }
  ]
};
export const referenceGridGallery: DetailGridGallery = {
  "hero": {
    "src": "/dealer/inventory/21780566866553359-1.webp",
    "alt": "Audi Q5 Mild Hybrid/S-line/quattro 1 ГОДИНА ГАРАНЦИЯ"
  },
  "columns": []
};

export interface DetailLoanSummary {
  readonly downPayment: string;
  readonly financed: string;
  readonly monthlyPayment: string;
}
export interface DetailReviewSummary {
  readonly rating: string;
  readonly count: CatalogText;
}
export interface DetailContent {
  readonly overview: readonly CatalogText[];
  readonly includedFeatures: readonly CatalogText[];
  readonly questions: readonly DetailQuestion[];
  readonly loanFields: readonly DetailLoanField[];
  readonly loanSummary: DetailLoanSummary;
  readonly reviewMetrics: readonly ReviewMetric[];
  readonly reviewSummary: DetailReviewSummary;
  readonly reviews: readonly DetailReview[];
}
export const referenceLoanSummary: DetailLoanSummary = {
  "downPayment": "",
  "financed": "",
  "monthlyPayment": ""
};
export const referenceReviewSummary: DetailReviewSummary = {
  "rating": "",
  "count": ""
};
export const referenceDetailContent: DetailContent = {
  overview: referenceOverview,
  includedFeatures: referenceIncludedFeatures,
  questions: referenceQuestions,
  loanFields: referenceLoanFields,
  loanSummary: referenceLoanSummary,
  reviewMetrics: referenceReviewMetrics,
  reviewSummary: referenceReviewSummary,
  reviews: referenceReviews,
};
export const referenceProductDetailContent: DetailContent = {
  ...referenceDetailContent,
  includedFeatures: referenceProductFeatures,
};

/** Desktop automotive sample copy keeps the complete reference detail composition. */
export const desktopReferenceDetailContent: DetailContent = {
  ...referenceDetailContent,
  overview: [
    message("reference.vehicle.desktop.overview.1"),
    message("reference.vehicle.desktop.overview.2"),
  ],
  questions: referenceQuestions.map((question, index) => ({
    ...question,
    question: message(
      (
        [
          "reference.vehicle.desktop.questions.availability.question",
          "reference.vehicle.desktop.questions.viewing.question",
          "reference.vehicle.desktop.questions.finance.question",
        ] as const
      )[index],
    ),
    answer: message(
      (
        [
          "reference.vehicle.desktop.questions.availability.answer",
          "reference.vehicle.desktop.questions.viewing.answer",
          "reference.vehicle.desktop.questions.finance.answer",
        ] as const
      )[index],
    ),
  })),
  reviews: referenceReviews.map((review, index) => ({
    ...review,
    text: message(
      (
        [
          "reference.vehicle.desktop.reviews.sarah-johnson.text",
          "reference.vehicle.desktop.reviews.michael-smith.text",
          "reference.vehicle.desktop.reviews.emily-williams.text",
        ] as const
      )[index],
    ),
  })),
};
