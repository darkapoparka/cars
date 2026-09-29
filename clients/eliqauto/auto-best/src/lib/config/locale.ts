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
    "city": "Pazardzhik",
    "addressLine": "Svoboda Street, behind the cemetery park",
    "address": "Svoboda Street, behind the cemetery park, Pazardzhik",
    "appointment": "Mon–Fri 09:30–19:00 · Sat–Sun 09:30–17:00 · Confirm the viewing by phone"
  },
  "bg": {
    "city": "Пазарджик",
    "addressLine": "ул. Свобода, на гърба на Гробищен парк",
    "address": "ул. Свобода, на гърба на Гробищен парк, Пазарджик",
    "appointment": "Пон.–пет. 09:30–19:00 · Съб.–нед. 09:30–17:00 · Потвърдете огледа по телефона"
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
