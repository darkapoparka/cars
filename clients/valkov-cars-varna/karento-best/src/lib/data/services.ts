import type { PlainMessageKey } from "#lib/i18n/text.ts";
export type ServiceCategoryId =
  | "rentals"
  | "transfers"
  | "concierge"
  | "assistance";
export type ServiceFilterId = "all" | ServiceCategoryId;

export const serviceFilters = [
  {
    id: "all",
    label: "All",
    labelKey: "reference.dynamic.service-filters.all.label",
  },
  {
    id: "rentals",
    label: "Rentals",
    labelKey: "reference.dynamic.service-filters.rentals.label",
  },
  {
    id: "transfers",
    label: "Transfers",
    labelKey: "reference.dynamic.service-filters.transfers.label",
  },
  {
    id: "concierge",
    label: "Concierge",
    labelKey: "reference.dynamic.service-filters.concierge.label",
  },
  {
    id: "assistance",
    label: "Assistance",
    labelKey: "reference.dynamic.service-filters.assistance.label",
  },
] as const satisfies readonly {
  readonly id: ServiceFilterId;
  readonly label: string;
  readonly labelKey?: PlainMessageKey;
}[];

export interface ServiceCardContent {
  readonly id: string;
  readonly category: ServiceCategoryId;
  readonly title: string;
  readonly titleKey?: PlainMessageKey;
  readonly description: string;
  readonly descriptionKey?: PlainMessageKey;
  readonly summary: string;
  readonly summaryKey?: PlainMessageKey;
  readonly image: string;
  readonly imageAlt: string;
  readonly href: string;
}

const rentalDescription =
  "Flexible rental options available for both short-term and weekly needs, ideal for vacations or business trips.";

export const serviceCards = [
  {
    id: "daily-weekly",
    category: "rentals",
    title: "Daily and Weekly Car Rentals",
    titleKey: "reference.dynamic.service-cards.daily-weekly.title",
    summary: "Short stays or business trips.",
    summaryKey: "reference.dynamic.service-cards.daily-weekly.summary",
    description: rentalDescription,
    descriptionKey: "reference.dynamic.service-cards.rental-description",
    image: "/assets/imgs/services/services-list-1/img-1.png",
    imageAlt: "Carento",
    href: "/contact#contact-enquiry",
  },
  {
    id: "long-term",
    category: "rentals",
    title: "Long-Term Rentals",
    titleKey: "reference.dynamic.service-cards.long-term.title",
    summary: "Extended use and longer stays.",
    summaryKey: "reference.dynamic.service-cards.long-term.summary",
    description:
      "Convenient and cost-effective solutions for those needing a vehicle for an extended period, with discounted rates.",
    descriptionKey: "reference.dynamic.service-cards.long-term.description",
    image: "/assets/imgs/services/services-list-1/img-2.png",
    imageAlt: "Carento",
    href: "/contact#contact-enquiry",
  },
  {
    id: "luxury",
    category: "rentals",
    title: "Luxury Car Rentals",
    titleKey: "reference.dynamic.service-cards.luxury.title",
    summary: "Business trips and special occasions.",
    summaryKey: "reference.dynamic.service-cards.luxury.summary",
    description:
      "Drive in style with our selection of high-end vehicles, perfect for special occasions or executive travel.",
    descriptionKey: "reference.dynamic.service-cards.luxury.description",
    image: "/assets/imgs/services/services-list-1/img-3.png",
    imageAlt: "Carento",
    href: "/contact#contact-enquiry",
  },
  {
    id: "vip-transfer",
    category: "transfers",
    title: "VIP Transfer Services",
    titleKey: "reference.dynamic.service-cards.vip-transfer.title",
    summary: "Transfers for business or travel.",
    summaryKey: "reference.dynamic.service-cards.vip-transfer.summary",
    description: rentalDescription,
    descriptionKey: "reference.dynamic.service-cards.rental-description",
    image: "/assets/imgs/services/services-list-1/img-4.png",
    imageAlt: "Carento",
    href: "/contact#contact-enquiry",
  },
  {
    id: "chauffeur",
    category: "transfers",
    title: "Chauffeur Services",
    titleKey: "reference.dynamic.service-cards.chauffeur.title",
    summary: "Travel with a dedicated driver.",
    summaryKey: "reference.dynamic.service-cards.chauffeur.summary",
    description: rentalDescription,
    descriptionKey: "reference.dynamic.service-cards.rental-description",
    image: "/assets/imgs/services/services-list-1/img-5.png",
    imageAlt: "Carento",
    href: "/contact#contact-enquiry",
  },
  {
    id: "airport",
    category: "transfers",
    title: "Airport Meet and Greet",
    titleKey: "reference.dynamic.service-cards.airport.title",
    summary: "Support for your airport arrival.",
    summaryKey: "reference.dynamic.service-cards.airport.summary",
    description: rentalDescription,
    descriptionKey: "reference.dynamic.service-cards.rental-description",
    image: "/assets/imgs/services/services-list-1/img-6.png",
    imageAlt: "Carento",
    href: "/contact#contact-enquiry",
  },
  {
    id: "concierge",
    category: "concierge",
    title: "Concierge Services",
    titleKey: "reference.dynamic.service-cards.concierge.title",
    summary: "Help planning your trip.",
    summaryKey: "reference.dynamic.service-cards.concierge.summary",
    description: rentalDescription,
    descriptionKey: "reference.dynamic.service-cards.rental-description",
    image: "/assets/imgs/services/services-list-1/img-7.png",
    imageAlt: "Carento",
    href: "/contact#contact-enquiry",
  },
  {
    id: "roadside",
    category: "assistance",
    title: "Roadside Assistance",
    titleKey: "reference.dynamic.service-cards.roadside.title",
    summary: "Help when you need it on the road.",
    summaryKey: "reference.dynamic.service-cards.roadside.summary",
    description: rentalDescription,
    descriptionKey: "reference.dynamic.service-cards.rental-description",
    image: "/assets/imgs/services/services-list-1/img-8.png",
    imageAlt: "Carento",
    href: "/contact#contact-enquiry",
  },
  {
    id: "custom-packages",
    category: "rentals",
    title: "Customizable Rental Packages",
    titleKey: "reference.dynamic.service-cards.custom-packages.title",
    summary: "Options to suit your trip.",
    summaryKey: "reference.dynamic.service-cards.custom-packages.summary",
    description: rentalDescription,
    descriptionKey: "reference.dynamic.service-cards.rental-description",
    image: "/assets/imgs/services/services-list-1/img-9.png",
    imageAlt: "Carento",
    href: "/contact#contact-enquiry",
  },
] as const satisfies readonly ServiceCardContent[];

/** Preserved sample service-location cards from the original overview. */
export interface ServiceSpot {
  readonly id: string;
  readonly image: string;
  readonly title: string;
  readonly description: string;
  readonly descriptionKey?: PlainMessageKey;
  readonly href: string;
  readonly desktopTitleKey?: PlainMessageKey;
}
export const serviceSpots = [
  {
    id: "venice",
    image: "/assets/imgs/services/services-1/img-1.png",
    title: "Venice",
    desktopTitleKey: "referenceHome.services.import",
    description: "356 Properties",
    descriptionKey: "reference.dynamic.service-spots.venice.description",
    href: "/services",
  },
  {
    id: "new-york",
    image: "/assets/imgs/services/services-1/img-2.png",
    title: "New York",
    desktopTitleKey: "referenceHome.services.sell",
    description: "356 Properties",
    descriptionKey: "reference.dynamic.service-spots.new-york.description",
    href: "/services",
  },
  {
    id: "amsterdam",
    image: "/assets/imgs/services/services-1/img-3.png",
    title: "Amsterdam",
    desktopTitleKey: "referenceHome.services.buy",
    description: "356 Properties",
    descriptionKey: "reference.dynamic.service-spots.amsterdam.description",
    href: "/services",
  },
  {
    id: "budapest",
    image: "/assets/imgs/services/services-1/img-4.png",
    title: "Budapest",
    desktopTitleKey: "referenceHome.services.lease",
    description: "356 Properties",
    descriptionKey: "reference.dynamic.service-spots.budapest.description",
    href: "/services",
  },
] as const satisfies readonly ServiceSpot[];
