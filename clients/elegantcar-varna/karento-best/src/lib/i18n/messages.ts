import { en } from "./catalogs/en.ts";
import { fallbackLocale, locales, normalizeLocale } from "./locales.ts";
import type { Locale } from "./locales.ts";
import type { MessageArguments, MessageKey } from "./schema.ts";

export function translate<Key extends MessageKey>(
  locale: Locale,
  key: Key,
  ...args: MessageArguments<Key>
): string {
  const message =
    locales[locale]?.messages[key] ?? locales[fallbackLocale].messages[key];
  const values = args[0] as
    | Readonly<Record<string, string | number>>
    | undefined;
  return message.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (_, name: string) => {
    if (!values || !Object.hasOwn(values, name))
      throw new Error(`Missing message parameter ${key}.${name}`);
    return String(values[name]);
  });
}
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locales[locale].format).format(value);
}
export function formatMoney(
  value: number,
  currency: string,
  locale: Locale,
): string {
  return new Intl.NumberFormat(locales[locale].format, {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}
export type CountEntity =
  | "vehicles"
  | "products"
  | "results"
  | "services"
  | "articles"
  | "comments"
  | "minutes"
  | "reviews"
  | "largeBags";
export function formatCount(
  value: number,
  entity: CountEntity,
  locale: Locale,
): string {
  const form =
    new Intl.PluralRules(locales[locale].format).select(value) === "one"
      ? "one"
      : "other";
  return translate(locale, `count.${entity}.${form}`, {
    count: formatNumber(value, locale),
  });
}
export function formatDate(value: string, locale: Locale): string {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat(locales[locale].format, {
        dateStyle: "medium",
        timeZone: "UTC",
      }).format(date)
    : value;
}
export function catalogProblems(): string[] {
  const problems: string[] = [];
  const keys = Object.keys(en).sort();
  const parameters = (text: string) =>
    [
      ...new Set(
        [...text.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)\}/g)].map(
          (match) => match[1],
        ),
      ),
    ].sort();
  for (const [locale, definition] of Object.entries(locales)) {
    const messages = definition.messages;
    if (JSON.stringify(Object.keys(messages).sort()) !== JSON.stringify(keys))
      problems.push(`${locale}: catalog keys differ`);
    for (const key of keys as MessageKey[]) {
      if (!messages[key]?.trim()) problems.push(`${locale}: empty ${key}`);
      if (
        JSON.stringify(parameters(messages[key])) !==
        JSON.stringify(parameters(en[key]))
      )
        problems.push(`${locale}: interpolation differs for ${key}`);
    }
  }
  return problems;
}
export { normalizeLocale };
