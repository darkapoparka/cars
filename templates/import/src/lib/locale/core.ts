import { base } from '$app/paths';
import { site } from '$lib/config/site';
import { createLocaleRouting, type ResolvedLocale, type LocaleConfiguration } from './policy';
export type Locale = 'en' | 'bg';
export const localeConfiguration: LocaleConfiguration<Locale> = {
	schemaVersion: 1,
	designBase: base,
	dealerId: 'import',
	dealerName: site.identity.displayName,
	defaultLocale: site.locale.default,
	enabledLocales: site.locale.supported,
	dealerCountry: site.locale.country,
	inventoryCurrency: site.locale.currency,
	formatLocales: site.locale.formatLocales,
	preferenceMaxAge: site.locale.preferenceMaxAge,
	promptVersion: site.locale.promptVersion,
	suggestedLanguages: site.locale.suggestedLanguages
};
const routing = createLocaleRouting(localeConfiguration);
export const {
	contract: localeContract,
	countries,
	isCountry,
	isLocale,
	routeParts,
	isResource,
	localeHref,
	safeReturnPath,
	unsupportedLocale
} = routing;
export type LocaleState = ResolvedLocale<Locale>;
export function isPublicPath(path: string): boolean {
	return /^\/(?:$|inventory(?:\/[^/]+)?$|contact$|import$|sell-your-car$|financing$|calculator$|services$|about$|blog(?:\/[^/]+)?$|reviews$|faqs$|privacy$|terms$|cookies$|compare$|account\/favorites$|locale-settings$)/.test(
		path
	);
}
/** Legacy adapters and URL-only unit fixtures; native requests use event.locals.localeState. */
export function localeFromUrl(url: URL): Locale {
	return (
		routeParts(url.pathname).locale ??
		(isLocale(url.searchParams.get('lang'))
			? (url.searchParams.get('lang') as Locale)
			: site.locale.default)
	);
}
