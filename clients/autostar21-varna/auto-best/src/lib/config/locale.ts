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
    "addressLine": "Todor Radev Penev 5D, 9009",
    "address": "Todor Radev Penev 5D, 9009, Varna, Balgariya",
    "appointment": "Viewings by appointment. Please call before visiting.",
    "addressShort": "Todor Radev Penev 5D, 9009",
    "appointmentShort": "Viewings by appointment. Please call before visiting."
  },
  "bg": {
    "city": "Варна",
    "addressLine": "Ул. Тодор Радев Пенев 5Д, 9009",
    "address": "Ул. Тодор Радев Пенев 5Д, 9009, Варна, България",
    "appointment": "Понеделник 09:00 - 17:00 ч. Вторник 09:00 - 17:00 ч. Сряда 09:00 - 17:00 ч. Четвъртък 09:00 - 17:00 ч. Петък 09:00 - 17:00 ч. Събота 00:00 - 00:00 ч. Неделя 00:00 - 00:00 ч.",
    "addressShort": "Ул. Тодор Радев Пенев 5Д, 9009",
    "appointmentShort": "Понеделник 09:00 - 17:00 ч. Вторник 09:00 - 17:00 ч. Сряда 09:00 - 17:00 ч. Четвъртък 09:00 - 17:00 ч. Петък 09:00 - 17:00 ч. Събота 00:00 - 00:00 ч. Неделя 00:00 - 00:00 ч."
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
