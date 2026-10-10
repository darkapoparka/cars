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
    id: "km",
    icon: "/assets/imgs/page/car/km.svg",
    value: "56,500",
    valueNumber: 56500,
    labelKey: "vehicle.field.mileage",
  },
  {
    id: "diesel",
    icon: "/assets/imgs/page/car/diesel.svg",
    value: "Diesel",
    valueKey: "fuel.diesel",
    labelKey: "vehicle.field.fuel",
  },
  {
    id: "auto",
    icon: "/assets/imgs/page/car/auto.svg",
    value: "Automatic",
    valueKey: "transmission.automatic",
    mobileValue: message("transmission.automatic.short"),
    labelKey: "vehicle.field.transmission",
  },
  {
    id: "seat",
    icon: "/assets/imgs/page/car/seat.svg",
    value: message("reference.vehicle.specifications.seat.value"),
  },
  {
    id: "bag",
    icon: "/assets/imgs/page/car/bag.svg",
    value: message("reference.vehicle.specifications.bag.value"),
    mobileValue: message("reference.vehicle.specifications.bag.mobile"),
  },
  {
    id: "suv",
    icon: "/assets/imgs/page/car/suv.svg",
    value: message("reference.vehicle.specifications.suv.value"),
  },
  {
    id: "door",
    icon: "/assets/imgs/page/car/door.svg",
    value: message("reference.vehicle.specifications.door.value"),
  },
  {
    id: "lit",
    icon: "/assets/imgs/page/car/lit.svg",
    value: "2.5L",
  },
];

export const referenceOverview: readonly CatalogText[] = [
  message("reference.vehicle.overview.1"),
  message("reference.vehicle.overview.2"),
];

export const referenceIncludedFeatures: readonly CatalogText[] = [
  message("reference.vehicle.included-features.1"),
  message("reference.vehicle.included-features.2"),
  message("reference.vehicle.included-features.3"),
  message("reference.vehicle.included-features.4"),
];

export const referenceProductFeatures: readonly CatalogText[] = [
  message("reference.vehicle.product-features.1"),
  message("reference.vehicle.product-features.2"),
  message("reference.vehicle.product-features.3"),
  message("reference.vehicle.product-features.4"),
];

export const referenceQuestions: readonly DetailQuestion[] = [
  {
    id: "ages",
    question: message("reference.vehicle.questions.ages.question"),
    answer: message("reference.vehicle.questions.ages.answer"),
    featured: false,
  },
  {
    id: "refreshments",
    question: message("reference.vehicle.questions.refreshments.question"),
    answer: message("reference.vehicle.questions.refreshments.answer"),
    featured: true,
  },
  {
    id: "accessibility",
    question: message("reference.vehicle.questions.accessibility.question"),
    answer: message("reference.vehicle.questions.accessibility.answer"),
    featured: false,
  },
];

export const referenceReviewMetrics: readonly ReviewMetric[] = [
  {
    id: "price",
    label: message("reference.vehicle.review-metrics.price.label"),
    progressClass: "progress-bar w-90",
    average: "4.8/5",
  },
  {
    id: "service",
    label: message("reference.vehicle.review-metrics.service.label"),
    progressClass: "progress-bar w-90",
    average: "4.2/5",
  },
  {
    id: "safety",
    label: message("reference.vehicle.review-metrics.safety.label"),
    progressClass: "progress-bar w-95",
    average: "4.9/5",
  },
  {
    id: "entertainment",
    label: message("reference.vehicle.review-metrics.entertainment.label"),
    progressClass: "progress-bar w-85",
    average: "4.7/5",
  },
  {
    id: "accessibility",
    label: message("reference.vehicle.review-metrics.accessibility.label"),
    progressClass: "progress-bar w-100",
    average: "5/5",
  },
  {
    id: "support",
    label: message("reference.vehicle.review-metrics.support.label"),
    progressClass: "progress-bar w-100",
    average: "5/5",
  },
];

export const referenceReviews: readonly DetailReview[] = [
  {
    id: "sarah-johnson",
    author: "Sarah Johnson",
    avatar: "/assets/imgs/blog/blog-details/avatar-1.png",
    date: "December 4, 2024 at 3:12 pm",
    text: message("reference.vehicle.reviews.sarah-johnson.text"),
  },
  {
    id: "michael-smith",
    author: "Michael Smith",
    avatar: "/assets/imgs/blog/blog-details/avatar-2.png",
    date: "December 4, 2024 at 3:12 pm",
    text: message("reference.vehicle.reviews.michael-smith.text"),
  },
  {
    id: "emily-williams",
    author: "Emily Williams",
    avatar: "/assets/imgs/blog/blog-details/avatar-3.png",
    date: "December 4, 2024 at 3:12 pm",
    text: message("reference.vehicle.reviews.emily-williams.text"),
  },
];

export const referenceSeller: DetailSeller = {
  name: "Emily Rose",
  location: "Las Vegas, USA",
  avatar: "/assets/imgs/template/icons/car-1.png",
  mobile: "1-222-333-4444",
  email: "emily-rose@gmail.com",
  whatsapp: "1-222-333-4444",
  fax: "1-222-333-4444",
};

export const referenceReservation: DetailReservation = {
  title: message("reference.vehicle.reservation.title"),
  pickUp: "17/02/2025",
  dropOff: "19/02/2025",
  extras: [
    {
      id: "gps-navigation-system",
      label: message(
        "reference.vehicle.reservation.extras.gps-navigation-system.label",
      ),
      price: "$25.00",
    },
    {
      id: "child-seat",
      label: message("reference.vehicle.reservation.extras.child-seat.label"),
      price: "$32.00",
    },
    {
      id: "additional-driver",
      label: message(
        "reference.vehicle.reservation.extras.additional-driver.label",
      ),
      price: "$25.00",
    },
    {
      id: "insurance-coverage",
      label: message(
        "reference.vehicle.reservation.extras.insurance-coverage.label",
      ),
      price: "$52.00",
    },
  ],
  subtotal: "$124.00",
  discount: "$124.00",
  total: "$124.00",
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

export const referenceRelatedProducts: readonly DetailRelatedProduct[] = [
  {
    id: "other-item1",
    image: "/assets/imgs/shop/shop-details/other-item1.png",
    title: "R1 Concepts® – eLINE Series Plain Brake Rotors",
    price: "$20.00",
  },
  {
    id: "other-item2",
    image: "/assets/imgs/shop/shop-details/other-item2.png",
    title: "PIRELLI TIRES® – P4 FOUR SEASONS PLUS",
    price: "$160.00",
  },
  {
    id: "other-item3",
    image: "/assets/imgs/shop/shop-details/other-item3.png",
    title: "Mobil 1 Extended Performance Full Synthetic Motor Oil",
    price: "$33.00",
  },
  {
    id: "other-item4",
    image: "/assets/imgs/shop/shop-details/other-item4.png",
    title: "HRE FlowForm® – FT01 Tarma Honda 2024",
    price: "$250.00",
  },
  {
    id: "other-item5",
    image: "/assets/imgs/shop/shop-details/other-item5.png",
    title: "Mobil Delvac 1300 Super Heavy Duty Synthetic",
    price: "$44.00",
  },
];

export const referenceHeading: DetailHeading = {
  titleKey: "reference.vehicle.heading.title",
  title:
    "Hyundai Accent 2015 - Modern compact sedan in blue color on beautiful dark wheels",
  mobileTitle: "Hyundai Accent 2015",
  location: "Las Vegas, USA",
  fleetCode: "LVA-4125",
  rating: "4.96",
  reviewCount: message("reference.vehicle.heading.reviewCount"),
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
  slides: [
    { src: "/assets/imgs/cars-details/banner.png", alt: "Carento" },
    { src: "/assets/imgs/cars-details/banner2.png", alt: "Carento" },
    { src: "/assets/imgs/cars-details/banner3.png", alt: "Carento" },
    { src: "/assets/imgs/cars-details/banner4.png", alt: "Carento" },
    { src: "/assets/imgs/cars-details/banner5.png", alt: "Carento" },
  ],
  thumbnails: [
    { src: "/assets/imgs/page/car/banner-thumn.png", alt: "Carento" },
    { src: "/assets/imgs/page/car/banner-thumn2.png", alt: "Carento" },
    { src: "/assets/imgs/page/car/banner-thumn3.png", alt: "Carento" },
    { src: "/assets/imgs/page/car/banner-thumn4.png", alt: "Carento" },
    { src: "/assets/imgs/page/car/banner-thumn5.png", alt: "Carento" },
    { src: "/assets/imgs/page/car/banner-thumn6.png", alt: "Carento" },
    { src: "/assets/imgs/page/car/banner-thumn.png", alt: "Carento" },
    { src: "/assets/imgs/page/car/banner-thumn3.png", alt: "Carento" },
  ],
};
export const referenceGridGallery: DetailGridGallery = {
  hero: { src: "/assets/imgs/cars-details/banner6.png", alt: "Travile" },
  columns: [
    {
      id: "first",
      images: [
        { src: "/assets/imgs/cars-details/banner7.png", alt: "Travile" },
        { src: "/assets/imgs/cars-details/banner8.png", alt: "Travile" },
      ],
    },
    {
      id: "second",
      images: [
        { src: "/assets/imgs/cars-details/banner9.png", alt: "Travile" },
        { src: "/assets/imgs/cars-details/banner10.png", alt: "Travile" },
      ],
    },
  ],
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
  downPayment: "$12,000",
  financed: "$800,00",
  monthlyPayment: "$480,00",
};
export const referenceReviewSummary: DetailReviewSummary = {
  rating: "4.95 / 5",
  count: message("reference.vehicle.review-summary.count"),
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
