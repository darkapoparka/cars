import { createContext } from "svelte";
import {
  formatCount,
  formatDate,
  formatMoney,
  formatNumber,
  translate,
} from "./messages.ts";
import type { CountEntity } from "./messages.ts";
import { localeHref, localizedShareUrl } from "./paths.ts";
import type { Locale } from "./locales.ts";
import type { Translator } from "./schema.ts";
import type { CatalogText } from "./text.ts";

export interface LocaleContext {
  readonly locale: Locale;
  readonly t: Translator;
  readonly text: (value: CatalogText) => string;
  readonly href: (input: string, locale?: Locale) => string;
  readonly shareUrl: (input: URL) => string;
  readonly number: (value: number) => string;
  readonly money: (value: number, currency: string) => string;
  readonly date: (value: string) => string;
  readonly count: (value: number, entity?: CountEntity) => string;
}
const [getLocale, setLocale] = createContext<LocaleContext>();
/** Every SSR layout gets its own context. The getter follows reactive layout data on navigation. */
export function createLocale(
  readLocale: () => Locale,
  readMount: () => string,
): LocaleContext {
  const context: LocaleContext = {
    get locale() {
      return readLocale();
    },
    t: (key, ...args) => translate(readLocale(), key, ...args),
    text: (value) =>
      typeof value === "string"
        ? value
        : translate(readLocale(), value.message),
    href: (input, locale = readLocale()) =>
      localeHref(input, locale, readMount()),
    shareUrl: (input) => localizedShareUrl(input, readLocale(), readMount()),
    number: (value) => formatNumber(value, readLocale()),
    money: (value, currency) => formatMoney(value, currency, readLocale()),
    date: (value) => formatDate(value, readLocale()),
    count: (value, entity = "vehicles") =>
      formatCount(value, entity, readLocale()),
  };
  return setLocale(context);
}
export const useLocale = getLocale;
