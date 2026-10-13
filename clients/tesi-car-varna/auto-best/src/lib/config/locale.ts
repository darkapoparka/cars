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
    "addressLine": "Tsar Osvoboditel, posoka Aksakovo, posleden vlyavo",
    "address": "Tsar Osvoboditel, posoka Aksakovo, posleden vlyavo",
    "appointment": "Viewings by appointment. Please call before visiting.",
    "addressShort": "Tsar Osvoboditel, posoka Aksakovo, posleden vlyavo",
    "appointmentShort": "Viewings by appointment. Please call before visiting."
  },
  "bg": {
    "city": "Варна",
    "addressLine": "бул. „Цар Освободител“, посока Аксаково, последен вляво",
    "address": "бул. „Цар Освободител“, посока Аксаково, последен вляво",
    "appointment": "Понеделник–събота: 09:00–18:00 (по текущите обяви) • Неделя: позвънете; контактната страница не публикува часове",
    "addressShort": "бул. „Цар Освободител“, посока Аксаково, последен вляво",
    "appointmentShort": "Понеделник–събота: 09:00–18:00 (по текущите обяви) • Неделя: позвънете; контактната страница не публикува часове"
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
