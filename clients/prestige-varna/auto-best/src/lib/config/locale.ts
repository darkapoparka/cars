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
    "addressLine": "Tsar Osvoboditel, 15–20 m predi posledniya svetofar za Vladislavovo, vlyavo kam Aksakovo",
    "address": "Tsar Osvoboditel, 15–20 m predi posledniya svetofar za Vladislavovo, vlyavo kam Aksakovo",
    "appointment": "Viewings by appointment. Please call before visiting.",
    "addressShort": "Tsar Osvoboditel, 15–20 m predi posledniya svetofar za Vladislavovo, vlyavo kam Aksakovo",
    "appointmentShort": "Viewings by appointment. Please call before visiting."
  },
  "bg": {
    "city": "Варна",
    "addressLine": "бул. Цар Освободител, 15–20 м преди последния светофар за Владиславово, вляво към Аксаково",
    "address": "бул. Цар Освободител, 15–20 м преди последния светофар за Владиславово, вляво към Аксаково",
    "appointment": "Работното време не е публикувано. Потвърдете часа и точния вход по телефона.",
    "addressShort": "бул. Цар Освободител, 15–20 м преди последния светофар за Владиславово, вляво към Аксаково",
    "appointmentShort": "Работното време не е публикувано. Потвърдете часа и точния вход по телефона."
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
