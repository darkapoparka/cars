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
    "addressLine": "Yan Hunyadi Blvd., corner with Tsar Osvoboditel Blvd.",
    "address": "Yan Hunyadi Blvd., corner with Tsar Osvoboditel Blvd., Varna",
    "appointment": "Monday–Friday: 08:30–19:00; Saturday: 09:00–18:00; Sunday: closed"
  },
  "bg": {
    "city": "Варна",
    "addressLine": "бул. „Ян Хунияди“, ъгъла с бул. „Цар Освободител“",
    "address": "бул. „Ян Хунияди“, ъгъла с бул. „Цар Освободител“",
    "appointment": "Понеделник – петък: 08:30–19:00; Събота: 09:00–18:00; Неделя: почивен ден"
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
