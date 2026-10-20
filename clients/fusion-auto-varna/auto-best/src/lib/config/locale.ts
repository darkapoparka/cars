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
    "addressLine": "Patya za selo Topoli, 200 m sled Tempo Betoni v lyavo, zad Avtoserviz i GTP Tandem",
    "address": "Patya za selo Topoli, 200 m sled Tempo Betoni v lyavo, zad Avtoserviz i GTP Tandem, Varna, Balgariya",
    "appointment": "Viewings by appointment. Please call before visiting.",
    "addressShort": "Patya za selo Topoli, 200 m sled Tempo Betoni v lyavo, zad Avtoserviz i GTP Tandem",
    "appointmentShort": "Viewings by appointment. Please call before visiting."
  },
  "bg": {
    "city": "Варна",
    "addressLine": "Пътя за село Тополи, 200 м след Темпо Бетони в ляво, зад Автосервиз и ГТП Тандем",
    "address": "Пътя за село Тополи, 200 м след Темпо Бетони в ляво, зад Автосервиз и ГТП Тандем, Варна, България",
    "appointment": "Потвърдете работното време директно с автокъщата.",
    "addressShort": "Пътя за село Тополи, 200 м след Темпо Бетони в ляво, зад Автосервиз и ГТП Тандем",
    "appointmentShort": "Потвърдете работното време директно с автокъщата."
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
