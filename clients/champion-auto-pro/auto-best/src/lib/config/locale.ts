import { carsLocale } from './cars-locale';
import type { LocaleConfiguration } from '../locale/policy';
import { brand } from './brand';

/** Dealer configuration, not visitor state. Country selection never converts stock prices. */
export const dealerLocaleConfiguration = {
  schemaVersion: carsLocale.schemaVersion,
  dealerId: carsLocale.dealerId,
  dealerName: brand.name,
  defaultLocale: carsLocale.defaultLocale,
  enabledLocales: carsLocale.enabledLocales,
  dealerCountry: carsLocale.dealerCountry,
  inventoryCurrency: carsLocale.inventoryCurrency,
  formatLocales: { en: "en-GB", bg: 'bg-BG' },
  preferenceMaxAge: 15552000,
  promptVersion: 'v1',
  suggestedLanguages: {"BG":"bg","GB":"en","US":"en"}
} as const satisfies LocaleConfiguration<'en' | 'bg'>;

/** Dealer-owned display fields. Client packages replace this bounded bilingual object. */
export const dealerLocalizedText = {
  "en": {
    "city": "Varna",
    "addressLine": "302 Tsar Osvoboditel Blvd. / Izgi Europe Motor car wash",
    "address": "302 Tsar Osvoboditel Blvd. / Izgi Europe Motor car wash, Varna",
    "appointment": "Monday–Friday: 09:30–18:00; Saturday: 10:00–15:00; Sunday: closed"
  },
  "bg": {
    "city": "Варна",
    "addressLine": "бул. „Цар Освободител“ 302 / Автомивка Izgi Europe Motor",
    "address": "бул. „Цар Освободител“ 302 / Автомивка Izgi Europe Motor",
    "appointment": "Понеделник – петък: 09:30–18:00; Събота: 10:00–15:00; Неделя: почивен ден"
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
