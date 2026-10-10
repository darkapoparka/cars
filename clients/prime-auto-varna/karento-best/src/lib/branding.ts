import type { DealerContent } from "./content.ts";

/** Reviewed branding is an explicit opt-in; neutral defaults emit no overrides. */
export function brandingAttributes(
  dealer: Pick<DealerContent, "locale" | "reviewedAccent">,
): { locale: string; style: string } {
  const locale = Intl.getCanonicalLocales(dealer.locale)[0];
  if (!locale) throw new Error("A dealer locale is required.");
  if (!dealer.reviewedAccent) return { locale, style: "" };
  const variables = {
    base: "--karento-accent",
    hover: "--karento-accent-hover",
    contrast: "--karento-accent-contrast",
    soft: "--karento-accent-soft",
  } as const;
  const style = (Object.keys(variables) as (keyof typeof variables)[])
    .map((key) => {
      const value = dealer.reviewedAccent?.[key];
      if (!value || !/^#[0-9a-f]{6}$/i.test(value))
        throw new Error(
          `Reviewed accent ${key} must be a six-digit hex color.`,
        );
      return `${variables[key]}:${value}`;
    })
    .join(";");
  return { locale, style };
}
