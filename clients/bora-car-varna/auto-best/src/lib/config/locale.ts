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
    "addressLine": "zh.k. Vl. Varnenchik, Yanko Mustakov, sreshtu bl. 303, vh.15, spirka Vihren",
    "address": "zh.k. Vl. Varnenchik, Yanko Mustakov, sreshtu bl. 303, vh.15, spirka Vihren, Varna, Balgariya",
    "appointment": "Viewings by appointment. Please call before visiting.",
    "addressShort": "zh.k. Vl. Varnenchik, Yanko Mustakov, sreshtu bl. 303, vh.15, spirka Vihren",
    "appointmentShort": "Viewings by appointment. Please call before visiting."
  },
  "bg": {
    "city": "Варна",
    "addressLine": "ж.к. Вл. Варненчик, ул. Янко Мустаков, срещу бл. 303, вх.15, спирка Вихрен",
    "address": "ж.к. Вл. Варненчик, ул. Янко Мустаков, срещу бл. 303, вх.15, спирка Вихрен, Варна, България",
    "appointment": "Потвърдете работното време директно с автокъщата.",
    "addressShort": "ж.к. Вл. Варненчик, ул. Янко Мустаков, срещу бл. 303, вх.15, спирка Вихрен",
    "appointmentShort": "Потвърдете работното време директно с автокъщата."
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
