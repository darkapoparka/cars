import configuration from './dealer.json';
export type AppLocale = 'en' | 'bg';
export type DealerConfiguration = {
  mode: 'template' | 'dealer'; id: string; name: string; shortName: string;
  logo: {light: string; dark: string; icon: string};
  defaultLocale: AppLocale; enabledLocales: AppLocale[];
  country: string; currency: string; city: string; address: string;
  phoneDisplay: string; phoneE164: string; email: string;
  mapsUrl: string; website: string; whatsappUrl: string;
  services: string[]; observedAt: string; inventoryNotice: string; previewNotice: string;
};
/** Generated dealer.json is the public content boundary, never private CRM data. */
export const dealer = configuration as DealerConfiguration;
export const isDealer = dealer.mode === 'dealer';
export const localeConfiguration = {
  schemaVersion: 1, dealerId: dealer.id, defaultLocale: dealer.defaultLocale,
  enabledLocales: dealer.enabledLocales, dealerCountry: dealer.country,
  inventoryCurrency: dealer.currency,
};
