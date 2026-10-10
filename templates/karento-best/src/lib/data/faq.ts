import { message, type CatalogText } from "#lib/i18n/text.ts";

export interface FaqEntryContent {
  readonly suffix: string;
  readonly question: CatalogText;
  readonly continuation?: CatalogText;
  readonly answer: CatalogText;
}
export interface CardFaqContent extends FaqEntryContent {
  readonly kind: "card";
}
export interface NumberedFaqContent extends FaqEntryContent {
  readonly kind: "numbered";
  readonly heading: string;
  readonly number: string;
  readonly buttonClass?: string;
}
export type FaqItemContent = CardFaqContent | NumberedFaqContent;
export type FaqCardAppearance = "bordered" | "rounded";
export type FaqSupportIconName =
  | "account"
  | "booking"
  | "payments"
  | "activity"
  | "cancellations"
  | "technical"
  | "policies"
  | "safety";
export interface FaqSupportTopic {
  readonly id: string;
  readonly icon: FaqSupportIconName;
  readonly title: CatalogText;
  readonly description: CatalogText;
  readonly href: string;
  readonly actionLabel: CatalogText;
}
/** Preserved reference demonstration copy for the native FAQ layouts. */
export const referenceFaqAnswer = message("reference.faq.answer");
export const referenceCardFaqItems = [
  {
    kind: "card",
    suffix: "collapse01",
    question: message("reference.faq.reservation"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapse02",
    question: message("reference.faq.documents"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapse03",
    question: message("reference.faq.cancellationPolicies"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapse04",
    question: message("reference.faq.paymentTypes"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapse05",
    question: message("reference.faq.paymentMethods"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapse6",
    question: message("reference.faq.changeReservation"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapse7",
    question: message("reference.faq.groupDiscounts"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapseSevent",
    question: message("reference.faq.findHotels"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapseEight",
    question: message("reference.faq.cancellationPolicies"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapseNine",
    question: message("reference.faq.breakfast"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapseTen",
    question: message("reference.faq.pets"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapseEleven",
    question: message("reference.faq.contactSupport"),
    continuation: message("reference.faq.contactSupportEnd"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "card",
    suffix: "collapseTwelve",
    question: message("reference.faq.loyalty"),
    continuation: message("reference.faq.loyaltyEnd"),
    answer: referenceFaqAnswer,
  },
] as const satisfies readonly CardFaqContent[];
export const referencePaymentFaqItems: readonly CardFaqContent[] =
  referenceCardFaqItems.slice(1);
export const referenceNumberedFaqItems = [
  {
    kind: "numbered",
    suffix: "collapseOne",
    heading: "headingOne",
    number: "01",
    question: message("reference.faq.reservationPlain"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "numbered",
    suffix: "collapseTwo",
    heading: "headingTwo",
    number: "02",
    question: message("reference.faq.documents"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "numbered",
    suffix: "collapseThree",
    heading: "headingThree",
    number: "03",
    question: message("reference.faq.cancellationPolicies"),
    buttonClass: "accordion-button text-heading-5 text-heading-5 type=",
    answer: referenceFaqAnswer,
  },
  {
    kind: "numbered",
    suffix: "collapseFour",
    heading: "headingFour",
    number: "04",
    question: message("reference.faq.paymentTypes"),
    answer: referenceFaqAnswer,
  },
  {
    kind: "numbered",
    suffix: "collapseFive",
    heading: "headingFive",
    number: "05",
    question: message("reference.faq.workingHours"),
    answer: referenceFaqAnswer,
  },
] as const satisfies readonly NumberedFaqContent[];
export const referenceFaqSupportTopics = [
  {
    id: "account",
    icon: "account",
    title: message("reference.faq.topic.account"),
    description: message("reference.faq.topic.help"),
    href: "#!",
    actionLabel: message("reference.faq.topic.details"),
  },
  {
    id: "booking",
    icon: "booking",
    title: message("reference.faq.topic.booking"),
    description: message("reference.faq.topic.phone"),
    href: "#!",
    actionLabel: message("reference.faq.topic.details"),
  },
  {
    id: "payments",
    icon: "payments",
    title: message("reference.faq.topic.booking"),
    description: message("reference.faq.topic.sales"),
    href: "#!",
    actionLabel: message("reference.faq.topic.details"),
  },
  {
    id: "activity",
    icon: "activity",
    title: message("reference.faq.topic.activity"),
    description: message("reference.faq.topic.branches"),
    href: "#!",
    actionLabel: message("reference.faq.topic.details"),
  },
  {
    id: "cancellations",
    icon: "cancellations",
    title: message("reference.faq.topic.cancellations"),
    description: message("reference.faq.topic.branches"),
    href: "#!",
    actionLabel: message("reference.faq.topic.details"),
  },
  {
    id: "technical",
    icon: "technical",
    title: message("reference.faq.topic.technical"),
    description: message("reference.faq.topic.branches"),
    href: "#!",
    actionLabel: message("reference.faq.topic.details"),
  },
  {
    id: "policies",
    icon: "policies",
    title: message("reference.faq.topic.policies"),
    description: message("reference.faq.topic.branches"),
    href: "#!",
    actionLabel: message("reference.faq.topic.details"),
  },
  {
    id: "safety",
    icon: "safety",
    title: message("reference.faq.topic.safety"),
    description: message("reference.faq.topic.branches"),
    href: "#!",
    actionLabel: message("reference.faq.topic.details"),
  },
] as const satisfies readonly FaqSupportTopic[];
