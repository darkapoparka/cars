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
    "addressLine": "Vladislav Varnenchik 310",
    "address": "Vladislav Varnenchik 310, Varna, Balgariya",
    "appointment": "Viewings by appointment. Please call before visiting.",
    "addressShort": "Vladislav Varnenchik 310",
    "appointmentShort": "Viewings by appointment. Please call before visiting."
  },
  "bg": {
    "city": "Варна",
    "addressLine": "бул. Владислав Варненчик 310",
    "address": "бул. Владислав Варненчик 310, Варна, България",
    "appointment": "Потвърдете работното време директно с автокъщата.",
    "addressShort": "бул. Владислав Варненчик 310",
    "appointmentShort": "Потвърдете работното време директно с автокъщата."
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
