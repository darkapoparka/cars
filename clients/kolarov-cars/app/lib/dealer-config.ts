import configuration from './dealer.json';
export type {AppLocale} from './locale-policy';
import type {DealerConfiguration} from './dealer-schema';
export type {DealerConfiguration} from './dealer-schema';
/** Generated dealer.json is the public content boundary, never private CRM data. */
export const dealer = configuration as DealerConfiguration;
export const isDealer = dealer.mode === 'dealer';
export const localeConfiguration = {
  schemaVersion: 1, dealerId: dealer.id, defaultLocale: dealer.defaultLocale,
  enabledLocales: dealer.enabledLocales, dealerCountry: dealer.country,
  inventoryCurrency: dealer.currency,
};
