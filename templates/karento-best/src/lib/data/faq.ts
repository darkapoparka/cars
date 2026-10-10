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
/** Automotive demonstration guidance, selected only by desktop FAQ layouts. */
export const desktopGeneralFaqItems = [
  {
    kind: "card",
    suffix: "desktop-general-availability",
    question: message("reference.faq.general.availability.question"),
    answer: message("reference.faq.general.availability.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-general-viewing",
    question: message("reference.faq.general.viewing.question"),
    answer: message("reference.faq.general.viewing.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-general-documents",
    question: message("reference.faq.general.documents.question"),
    answer: message("reference.faq.general.documents.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-general-history",
    question: message("reference.faq.general.history.question"),
    answer: message("reference.faq.general.history.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-general-reservation",
    question: message("reference.faq.general.reservation.question"),
    answer: message("reference.faq.general.reservation.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-general-exchange",
    question: message("reference.faq.general.exchange.question"),
    answer: message("reference.faq.general.exchange.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-general-warranty",
    question: message("reference.faq.general.warranty.question"),
    answer: message("reference.faq.general.warranty.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-general-import",
    question: message("reference.faq.general.import.question"),
    answer: message("reference.faq.general.import.answer"),
  },
] as const satisfies readonly CardFaqContent[];
export const desktopPaymentFaqItems = [
  {
    kind: "card",
    suffix: "desktop-payment-methods",
    question: message("reference.faq.payment.methods.question"),
    answer: message("reference.faq.payment.methods.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-payment-deposit",
    question: message("reference.faq.payment.deposit.question"),
    answer: message("reference.faq.payment.deposit.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-payment-finance",
    question: message("reference.faq.payment.finance.question"),
    answer: message("reference.faq.payment.finance.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-payment-quote",
    question: message("reference.faq.payment.quote.question"),
    answer: message("reference.faq.payment.quote.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-payment-invoice",
    question: message("reference.faq.payment.invoice.question"),
    answer: message("reference.faq.payment.invoice.answer"),
  },
  {
    kind: "card",
    suffix: "desktop-payment-refund",
    question: message("reference.faq.payment.refund.question"),
    answer: message("reference.faq.payment.refund.answer"),
  },
] as const satisfies readonly CardFaqContent[];
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
