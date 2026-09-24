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
    "addressLine": "Tsar Osvoboditel Blvd. — 300 m to the right after Doma na Kamiona, towards Varna Airport",
    "address": "Tsar Osvoboditel Blvd. — 300 m to the right after Doma na Kamiona, towards Varna Airport, Varna",
    "appointment": "Call ahead to confirm opening hours and a viewing."
  },
  "bg": {
    "city": "Варна",
    "addressLine": "бул. Цар Освободител — 300 м вдясно след Дом на Камиона, посока летището",
    "address": "бул. Цар Освободител — 300 м вдясно след Дом на Камиона, посока летището",
    "appointment": "За работно време и оглед се обадете предварително."
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
