import { en } from "./catalogs/en.ts";
import { bg } from "./catalogs/bg.ts";
import type { MessageCatalog } from "./schema.ts";

/** Add a complete typed catalog here to offer a new language everywhere. */
export const locales = {
  en: { label: "English", format: "en-GB", messages: en },
  bg: { label: "Български", format: "bg-BG", messages: bg },
} as const satisfies Record<
  string,
  { label: string; format: string; messages: MessageCatalog }
>;
export type Locale = keyof typeof locales;
export const supportedLocales = Object.keys(locales) as Locale[];
export const fallbackLocale: Locale = "en";
export const localeCookie = "signature_locale";
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && Object.hasOwn(locales, value);
}
export function normalizeLocale(value: unknown): Locale {
  if (typeof value !== "string") return fallbackLocale;
  const language = value.trim().toLowerCase().split("-")[0];
  return isLocale(language) ? language : fallbackLocale;
}
export function resolveRequestLocale(
  url: URL,
  cookie: unknown,
  defaultLocale: unknown,
): Locale {
  const explicit = url.searchParams.getAll("lang");
  if (explicit.length === 1 && isLocale(explicit[0])) return explicit[0];
  if (isLocale(cookie)) return cookie;
  return normalizeLocale(defaultLocale);
}
