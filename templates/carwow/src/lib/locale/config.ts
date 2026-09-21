import type { LocaleConfiguration } from './policy';
import { daynightSite } from '../data/daynight-site';
/** Dealer facts are independent of each visitor's preferences. */
export const dealerLocaleConfiguration = {
	schemaVersion: 1,
	dealerId: 'template-carwow',
	dealerName: daynightSite.name,
	defaultLocale: 'bg',
	enabledLocales: ['en', 'bg'],
	dealerCountry: 'BG',
	inventoryCurrency: 'EUR',
	formatLocales: { en: 'en-GB', bg: 'bg-BG' },
	preferenceMaxAge: 15552000,
	promptVersion: 'v1',
	suggestedLanguages: { BG: 'bg' }
} as const satisfies LocaleConfiguration<'en' | 'bg'>;
export const dealerTextValues = {
	city: daynightSite.city,
	locationShort: daynightSite.locationShort,
	addressLine: daynightSite.locationLandmark,
	address: daynightSite.location
} as const;

export const dealerTextKeys = {
	city: 'dealer.city',
	locationShort: 'dealer.locationShort',
	addressLine: 'dealer.addressLine',
	address: 'dealer.address'
} as const;
