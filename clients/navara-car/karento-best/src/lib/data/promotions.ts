import { message, type CatalogText } from "#lib/i18n/text.ts";
/** Existing reference banner content; presentation belongs to PromotionCard. */
export interface Promotion {
  readonly id: string;
  readonly className: string;
  readonly title: CatalogText;
  readonly description: readonly [CatalogText, CatalogText];
  readonly actionClass: string;
  readonly actionLabel: CatalogText;
  readonly href: string;
}

export const rentalPromotions = [
  {
    id: "rental",
    className: "box-banner-1 px-5 position-relative rounded-12 overflow-hidden",
    title: message("referenceHome.promotions.rentalTitle"),
    description: [
      message("referenceHome.promotions.rentalFirst"),
      message("referenceHome.promotions.rentalSecond"),
    ],
    actionClass: "btn btn-primary background-brand-2",
    actionLabel: message("referenceHome.promotions.action"),
    href: "/vehicles",
  },
  {
    id: "sell",
    className:
      "box-banner-2 px-5 position-relative rounded-12 overflow-hidden mt-lg-0 mt-4",
    title: message("referenceHome.promotions.rentalTitle"),
    description: [
      message("referenceHome.promotions.sellFirst"),
      message("referenceHome.promotions.sellSecond"),
    ],
    actionClass: "btn btn-primary bg-white",
    actionLabel: message("referenceHome.promotions.action"),
    href: "/vehicles",
  },
] as const satisfies readonly Promotion[];

export interface VehicleOffer {
  readonly id: string;
  readonly icon: string;
  readonly title: CatalogText;
  readonly description: CatalogText;
  readonly actionLabel: CatalogText;
  readonly href: string;
}

const rentalOffer = {
  title: message("referenceHome.promotions.rentalTitle"),
  description: message("referenceHome.promotions.description"),
  actionLabel: message("referenceHome.promotions.action"),
  href: "/vehicles",
} as const;

export const vehicleOffers = [
  { ...rentalOffer, id: "rent", icon: "/assets/imgs/cta/cta-4/icon-1.svg" },
  { ...rentalOffer, id: "sell", icon: "/assets/imgs/cta/cta-4/icon-2.svg" },
] as const satisfies readonly VehicleOffer[];

/** Sample template statistics, not claims about a real dealership. */
export const referenceStats = [
  {
    id: "branches",
    value: "45",
    suffix: "+",
    label: [
      message("referenceHome.stats.global"),
      message("referenceHome.stats.branches"),
    ],
  },
  {
    id: "destinations",
    value: "29",
    suffix: message("referenceHome.stats.thousand"),
    label: [
      message("referenceHome.stats.destinations"),
      message("referenceHome.stats.collaboration"),
    ],
  },
  {
    id: "experience",
    value: "20",
    suffix: "+",
    label: [
      message("referenceHome.stats.years"),
      message("referenceHome.stats.experience"),
    ],
  },
  {
    id: "customers",
    value: "168",
    suffix: message("referenceHome.stats.thousand"),
    label: [
      message("referenceHome.stats.happy"),
      message("referenceHome.stats.customers"),
    ],
  },
  {
    id: "accounts",
    value: "15",
    suffix: message("referenceHome.stats.million"),
    label: [
      message("referenceHome.stats.user"),
      message("referenceHome.stats.account"),
    ],
  },
] as const;
