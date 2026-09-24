import { carsLocale } from './cars-locale';
import type { Locale } from "@repo/internationalization/config";
import type { LocaleConfiguration } from "@repo/internationalization/policy";
import { publicSite } from "@repo/marketplace/site-config";

/** Dealer facts are independent of visitor preferences. */
export const localeConfiguration = {
  schemaVersion: carsLocale.schemaVersion,
  dealerId: carsLocale.dealerId,
  dealerName: publicSite.identity.name,
  defaultLocale: carsLocale.defaultLocale,
  enabledLocales: carsLocale.enabledLocales,
  dealerCountry: carsLocale.dealerCountry,
  inventoryCurrency: carsLocale.inventoryCurrency,
  formatLocales: { en: "en-GB", bg: "bg-BG" },
  preferenceMaxAge: 60 * 60 * 24 * 180,
  promptVersion: "v1",
  suggestedLanguages: publicSite.market.locales.includes("bg")
    ? { BG: "bg" }
    : {},
} satisfies LocaleConfiguration<Locale>;
