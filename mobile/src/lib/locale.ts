import { bgMessages } from './messages.bg';
export type Locale = 'bg' | 'en';
export const defaultLocale: Locale = 'en';
export function validLocale(value: unknown): value is Locale {
  return value === 'bg' || value === 'en';
}
export function translate(message: string, locale: Locale): string {
  if (locale === 'en' || !message) return message;
  const key = message.trim().replace(/\s+/g, ' ');
  const translated = bgMessages[key];
  if (translated) return message.replace(message.trim(), translated);
  const series = key.match(/^(\d|[A-Z]) Series$/i);
  if (series) return series[1] + ' серия';
  return message;
}
export function localeNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-GB', {
    maximumFractionDigits: 0,
  }).format(value);
}
export function localeMoney(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-GB', {
    style: 'currency',
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}
export function vehicleCount(
  count: number,
  singular: string,
  plural: string,
  locale: Locale,
): string {
  return localeNumber(count, locale) + ' ' + translate(count === 1 ? singular : plural, locale);
}
