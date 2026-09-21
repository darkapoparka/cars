import type { LocaleConfiguration } from '../locale/policy';
import { brand } from './brand';

/** Dealer configuration, not visitor state. Country selection never converts stock prices. */
export const dealerLocaleConfiguration = {
  schemaVersion: 1,
  dealerId: 'template-auto-best',
  dealerName: brand.name,
  defaultLocale: 'bg',
  enabledLocales: ['en', 'bg'],
  dealerCountry: 'BG',
  inventoryCurrency: 'EUR',
  formatLocales: { en: 'en-GB', bg: 'bg-BG' },
  preferenceMaxAge: 15552000,
  promptVersion: 'v1',
  suggestedLanguages: { BG: 'bg' }
} as const satisfies LocaleConfiguration<'en' | 'bg'>;

/** Dealer-owned display fields. Client packages replace this bounded bilingual object. */
export const dealerLocalizedText = {
  en: {
    city: 'Sofia',
    addressLine: '18 Atanas Manchev Street, Studentski Grad',
    address: '18 Atanas Manchev Street, Studentski Grad, Sofia',
    appointment: 'Visits by appointment'
  },
  bg: {
    city: brand.city,
    addressLine: brand.addressLine,
    address: brand.address,
    appointment: brand.appointment
  }
} as const;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
export const dealerTextKeys = { city: 'dealer.city', addressLine: 'dealer.addressLine', address: 'dealer.address', appointment: 'dealer.appointment' } as const;
export const dealerTextValues = { city: brand.city, addressLine: brand.addressLine, address: brand.address, appointment: brand.appointment } as const;
