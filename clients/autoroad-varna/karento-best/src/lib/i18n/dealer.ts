import type { DealerContent } from "../content.ts";
import type { LocaleContext } from "./context.svelte.ts";
export type BusinessPreview = NonNullable<DealerContent["businessPreview"]>;
/** An observation date never turns illustrative examples into verified inventory. */
export function stockNotice(
  preview: BusinessPreview | undefined,
  locale: LocaleContext,
): string {
  return locale.t(
    preview?.mode === "illustrative-not-dealer-stock"
      ? "dealer.stock.illustrativeNotice"
      : "dealer.stock.notice",
  );
}
export function stockSummary(
  preview: BusinessPreview,
  locale: LocaleContext,
): string {
  const count = locale.number(preview.inventoryCount);
  if (preview.mode === "illustrative-not-dealer-stock")
    return locale.t("dealer.stock.illustrativeCount", { count });
  return preview.observedAt
    ? locale.t("dealer.stock.snapshotCount", {
        count,
        date: locale.date(preview.observedAt),
      })
    : locale.t("dealer.stock.count", { count });
}
export function stockFaqAnswer(
  topic: "availability" | "viewing" | "history",
  preview: BusinessPreview | undefined,
  locale: LocaleContext,
): string {
  return topic === "availability" &&
    preview?.mode === "illustrative-not-dealer-stock"
    ? locale.t("dealer.faq.illustrativeAvailability")
    : locale.t(`dealer.faq.${topic}.answer`);
}
