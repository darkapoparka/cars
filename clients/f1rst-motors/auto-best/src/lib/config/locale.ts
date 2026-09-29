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
  formatLocales: { en: "en-AE", bg: 'bg-BG' },
  preferenceMaxAge: 15552000,
  promptVersion: 'v1',
  suggestedLanguages: {"BG":"bg","GB":"en","US":"en","AE":"en"}
} as const satisfies LocaleConfiguration<'en' | 'bg'>;

/** Dealer-owned display fields. Client packages replace this bounded bilingual object. */
export const dealerLocalizedText = {
  "en": {
    "city": "Dubai",
    "addressLine": "Danube Building - 409 Sheikh Zayed Rd - Al Quoz 1",
    "address": "Danube Building - 409 Sheikh Zayed Rd - Al Quoz - Al Quoz 1 - Dubai, UAE",
    "appointment": "Mon-Thu 10:00-21:00; Friday 14:00-21:00; Saturday 10:00-21:00; Sunday Closed"
  },
  "bg": {
    "city": "Дубай",
    "addressLine": "Danube сграда - 409 Sheikh Zayed Rd - Al Quoz 1",
    "address": "Danube сграда - 409 Sheikh Zayed Rd - Al Quoz - Al Quoz 1 - Dubai, ОАЕ",
    "appointment": "Понеделник–четвъртък 10:00–21:00; петък 14:00–21:00; събота 10:00–21:00; неделя почивен ден"
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
