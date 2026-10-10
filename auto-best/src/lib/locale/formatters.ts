import { intlLocale, type Locale } from './core';

type Formatters = {
  number: Intl.NumberFormat;
  mileage: Intl.NumberFormat;
  compactMileage: Intl.NumberFormat;
  plural: Intl.PluralRules;
};
const cache = new Map<Locale, Formatters>();

/** Cache formatters, never visitor values; keys are limited to enabled dealer locales. */
export function localeFormatters(locale: Locale): Formatters {
  const formatLocale = intlLocale(locale);
  const existing = cache.get(locale);
  if (existing) return existing;
  const formatters = Object.freeze({
    number: new Intl.NumberFormat(formatLocale),
    mileage: new Intl.NumberFormat(formatLocale, { style: 'unit', unit: 'kilometer', unitDisplay: 'short' }),
    compactMileage: new Intl.NumberFormat(formatLocale, { useGrouping: false }),
    plural: new Intl.PluralRules(formatLocale)
  });
  cache.set(locale, formatters);
  return formatters;
}
