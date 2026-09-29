import { carsLocale } from './cars-locale';
import type { LocaleConfiguration } from './policy';
import { daynightDealerText, daynightSite } from '../data/daynight-site';
/** Dealer facts are independent of each visitor's preferences. */
export const dealerLocaleConfiguration = {
	schemaVersion: carsLocale.schemaVersion,
	dealerId: carsLocale.dealerId,
	dealerName: daynightSite.name,
	defaultLocale: carsLocale.defaultLocale,
	enabledLocales: carsLocale.enabledLocales,
	dealerCountry: carsLocale.dealerCountry,
	inventoryCurrency: carsLocale.inventoryCurrency,
	formatLocales: { en: "en-AE", bg: 'bg-BG' },
	preferenceMaxAge: 15552000,
	promptVersion: 'v1',
	suggestedLanguages: {"BG":"bg","GB":"en","US":"en","AE":"en"}
} as const satisfies LocaleConfiguration<'en' | 'bg'>;
export const dealerLocalizedText = daynightDealerText;

/** Retained as source-review metadata; runtime labels come from dealerLocalizedText. */
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
