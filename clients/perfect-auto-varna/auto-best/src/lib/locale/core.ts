import { createLocalePolicy, type ResolvedLocale } from './policy';
import { dealerLocaleConfiguration } from './config';

/** Immutable per-dealer policy; every request receives a separate resolved state. */
const policy = createLocalePolicy<'en' | 'bg'>(dealerLocaleConfiguration);
export type Locale = typeof dealerLocaleConfiguration.enabledLocales[number];
export type LocaleState = ResolvedLocale<Locale>;
export const localeContract = policy.contract;
export const { countries, isCountry, isLocale, intlLocale, formatPrice,
  routeParts, isResource, unsupportedLocale, localeHref, safeReturnPath,
  preferredLanguage, resolveLocale, preferenceResponse } = policy;
export { cookieValue, privateHeaders } from './policy';
