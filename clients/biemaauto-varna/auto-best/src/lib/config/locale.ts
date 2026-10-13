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
    "addressLine": "Tsar Osvobodite 202 do izhoda na KAT",
    "address": "Tsar Osvobodite 202 do izhoda na KAT, Varna, Balgariya",
    "appointment": "Viewings by appointment. Please call before visiting.",
    "addressShort": "Tsar Osvobodite 202 do izhoda na KAT",
    "appointmentShort": "Viewings by appointment. Please call before visiting."
  },
  "bg": {
    "city": "Варна",
    "addressLine": "Бул.Цар Освободите 202 до изхода на КАТ",
    "address": "Бул.Цар Освободите 202 до изхода на КАТ, Варна, България",
    "appointment": "Понеделник 09:00 - 19:00 ч. Вторник 09:00 - 19:00 ч. Сряда 09:00 - 19:00 ч. Четвъртък 09:00 - 19:00 ч. Петък 09:00 - 19:00 ч. Събота 09:00 - 19:00 ч. Неделя Почивен ден",
    "addressShort": "Бул.Цар Освободите 202 до изхода на КАТ",
    "appointmentShort": "Понеделник 09:00 - 19:00 ч. Вторник 09:00 - 19:00 ч. Сряда 09:00 - 19:00 ч. Четвъртък 09:00 - 19:00 ч. Петък 09:00 - 19:00 ч. Събота 09:00 - 19:00 ч. Неделя Почивен ден"
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
