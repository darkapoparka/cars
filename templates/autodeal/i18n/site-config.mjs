import { defaultLocale as templateDefaultLocale, localeNames as templateLocaleNames, locales as templateLocales } from './config.mjs';

// Keep this file project-local. Lead demos may replace the identity metadata,
// but the shared locale contract and Bulgarian default stay stable unless the
// project explicitly opts into another approved default.
export const defaultLocale = templateDefaultLocale;
export const enabledLocales = Object.freeze([...templateLocales]);
export const localeNames = templateLocaleNames;

export default Object.freeze({
	defaultLocale,
	enabledLocales,
	localeNames
});
