import { message, type CatalogText } from "#lib/i18n/text.ts";
/** Preserved demonstration prices and features; not payment products. */
export interface PlanFeature {
  readonly id: string;
  readonly text: CatalogText;
  readonly muted: boolean;
  readonly last: boolean;
}
export interface MembershipPlan {
  readonly id: string;
  readonly name: CatalogText;
  readonly desktopDescription: CatalogText;
  readonly monthly: string;
  readonly annual: string;
  readonly priceClass: string;
  readonly intervalClass: string;
  readonly actionFill: string;
  readonly features: readonly PlanFeature[];
}
export const membershipPlans = [
  {
    id: "plan-1",
    name: message("reference.ancillary.membershipPlans.plan-1.name"),
    desktopDescription: message(
      "reference.ancillary.membershipPlans.plan-1.description",
    ),
    monthly: "19",
    annual: "228",
    priceClass: "neutral-1000 mb-0 text-price-standard",
    intervalClass:
      "neutral-500 text-md-medium align-self-end text-type-standard",
    actionFill: "#111827",
    features: [
      {
        id: "plan-1-feature-1",
        text: message(
          "reference.ancillary.membershipPlans.plan-1.features.plan-1-feature-1.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-1-feature-2",
        text: message(
          "reference.ancillary.membershipPlans.plan-1.features.plan-1-feature-2.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-1-feature-3",
        text: message(
          "reference.ancillary.membershipPlans.plan-1.features.plan-1-feature-3.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-1-feature-4",
        text: message(
          "reference.ancillary.membershipPlans.plan-1.features.plan-1-feature-4.text",
        ),
        muted: true,
        last: false,
      },
      {
        id: "plan-1-feature-5",
        text: message(
          "reference.ancillary.membershipPlans.plan-1.features.plan-1-feature-5.text",
        ),
        muted: true,
        last: false,
      },
      {
        id: "plan-1-feature-6",
        text: message(
          "reference.ancillary.membershipPlans.plan-1.features.plan-1-feature-6.text",
        ),
        muted: true,
        last: true,
      },
    ],
  },
  {
    id: "plan-2",
    name: message("reference.ancillary.membershipPlans.plan-2.name"),
    desktopDescription: message(
      "reference.ancillary.membershipPlans.plan-2.description",
    ),
    monthly: "29",
    annual: "348",
    priceClass: "neutral-1000 mb-0 text-price-standard",
    intervalClass:
      "neutral-500 text-md-medium align-self-end text-type-standard",
    actionFill: "dark",
    features: [
      {
        id: "plan-2-feature-1",
        text: message(
          "reference.ancillary.membershipPlans.plan-2.features.plan-2-feature-1.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-2-feature-2",
        text: message(
          "reference.ancillary.membershipPlans.plan-2.features.plan-2-feature-2.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-2-feature-3",
        text: message(
          "reference.ancillary.membershipPlans.plan-2.features.plan-2-feature-3.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-2-feature-4",
        text: message(
          "reference.ancillary.membershipPlans.plan-2.features.plan-2-feature-4.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-2-feature-5",
        text: message(
          "reference.ancillary.membershipPlans.plan-2.features.plan-2-feature-5.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-2-feature-6",
        text: message(
          "reference.ancillary.membershipPlans.plan-2.features.plan-2-feature-6.text",
        ),
        muted: false,
        last: true,
      },
    ],
  },
  {
    id: "plan-3",
    name: message("reference.ancillary.membershipPlans.plan-3.name"),
    desktopDescription: message(
      "reference.ancillary.membershipPlans.plan-3.description",
    ),
    monthly: "49",
    annual: "588",
    priceClass: "neutral-1000 mb-0 text-price-business",
    intervalClass:
      "neutral-500 text-md-medium align-self-end text-type-business",
    actionFill: "#111827",
    features: [
      {
        id: "plan-3-feature-1",
        text: message(
          "reference.ancillary.membershipPlans.plan-3.features.plan-3-feature-1.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-3-feature-2",
        text: message(
          "reference.ancillary.membershipPlans.plan-3.features.plan-3-feature-2.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-3-feature-3",
        text: message(
          "reference.ancillary.membershipPlans.plan-3.features.plan-3-feature-3.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-3-feature-4",
        text: message(
          "reference.ancillary.membershipPlans.plan-3.features.plan-3-feature-4.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-3-feature-5",
        text: message(
          "reference.ancillary.membershipPlans.plan-3.features.plan-3-feature-5.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-3-feature-6",
        text: message(
          "reference.ancillary.membershipPlans.plan-3.features.plan-3-feature-6.text",
        ),
        muted: false,
        last: true,
      },
    ],
  },
  {
    id: "plan-4",
    name: "VIP",
    desktopDescription: message(
      "reference.ancillary.membershipPlans.plan-4.description",
    ),
    monthly: "99",
    annual: "1,188",
    priceClass: "neutral-1000 mb-0 text-price-enterprise",
    intervalClass:
      "neutral-500 text-md-medium align-self-end text-type-enterprise",
    actionFill: "#111827",
    features: [
      {
        id: "plan-4-feature-1",
        text: message(
          "reference.ancillary.membershipPlans.plan-4.features.plan-4-feature-1.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-4-feature-2",
        text: message(
          "reference.ancillary.membershipPlans.plan-4.features.plan-4-feature-2.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-4-feature-3",
        text: message(
          "reference.ancillary.membershipPlans.plan-4.features.plan-4-feature-3.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-4-feature-4",
        text: message(
          "reference.ancillary.membershipPlans.plan-4.features.plan-4-feature-4.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-4-feature-5",
        text: message(
          "reference.ancillary.membershipPlans.plan-4.features.plan-4-feature-5.text",
        ),
        muted: false,
        last: false,
      },
      {
        id: "plan-4-feature-6",
        text: message(
          "reference.ancillary.membershipPlans.plan-4.features.plan-4-feature-6.text",
        ),
        muted: false,
        last: true,
      },
    ],
  },
] as const satisfies readonly MembershipPlan[];
