import { message, type CatalogText } from "#lib/i18n/text.ts";
import type { LoanEstimateInputs, LoanFieldKey } from "./loan-estimate.ts";
export type { LoanEstimateInputs, LoanFieldKey } from "./loan-estimate.ts";

export interface FinanceVehicleOption {
  readonly id: string;
  readonly title: string;
  /** Supplied purchase price; display and daily rental prices are not eligible. */
  readonly priceAmount: number;
  readonly currency: string;
}
export interface DealerFinanceContent {
  readonly currency: string;
  readonly defaults: LoanEstimateInputs;
  readonly vehicleOptions?: readonly FinanceVehicleOption[];
}
/** Illustrative input assumptions, not a lender offer or dealer stock price. */
export const referenceFinanceSettings: DealerFinanceContent = {
  currency: "USD",
  defaults: {
    price: 20000,
    annualRate: 5,
    termMonths: 12,
    downPayment: 12000,
  },
};
export interface LoanFieldContent {
  readonly key: LoanFieldKey;
  readonly label: CatalogText;
  readonly placeholder: CatalogText;
}
export interface LoanPaymentRow {
  readonly key: "downPayment" | "financed" | "monthly";
  readonly label: CatalogText;
  readonly value: string;
  readonly emphasized?: boolean;
}
export interface LoanCardContent {
  readonly title: CatalogText;
  readonly description: CatalogText;
  readonly fields: readonly LoanFieldContent[];
}
export interface LoanHeroContent {
  readonly title: CatalogText;
  readonly description: CatalogText;
  readonly actionLabel: CatalogText;
  readonly href: string;
  readonly images: readonly {
    readonly src: string;
    readonly alt: CatalogText;
  }[];
}
/** Shared field copy; all displayed payment figures come from numeric inputs. */
export const referenceLoanCard = {
  title: message("referenceFinance.title"),
  description: message("referenceFinance.description"),
  fields: [
    {
      key: "price",
      label: message("referenceFinance.vehiclePrice"),
      placeholder: "$20,000",
    },
    {
      key: "annualRate",
      label: message("referenceFinance.interest"),
      placeholder: "5%",
    },
    {
      key: "termMonths",
      label: message("referenceFinance.term"),
      placeholder: message("referenceFinance.termPlaceholder"),
    },
    {
      key: "downPayment",
      label: message("referenceFinance.downPayment"),
      placeholder: "$12,000",
    },
  ],
} as const satisfies LoanCardContent;
export const referenceLoanHero = {
  title: referenceLoanCard.title,
  description: message("referenceFinance.heroDescription"),
  actionLabel: message("referenceFinance.useCalculator"),
  href: "#car-loan-calculator",
  images: [
    {
      src: "/assets/imgs/cta/cta-11/img-1.png",
      alt: message("referenceFinance.imageAlt"),
    },
    {
      src: "/assets/imgs/cta/cta-11/img-2.png",
      alt: message("referenceFinance.imageAlt"),
    },
  ],
} as const satisfies LoanHeroContent;
