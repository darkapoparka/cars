/** Locale decisions stay independent of React, translation dictionaries and request APIs. */
export type AppLocale = 'en' | 'bg';
export type LocalePolicy = {defaultLocale: AppLocale; enabledLocales: readonly AppLocale[]};
export const isAppLocale = (value: unknown): value is AppLocale => value === 'en' || value === 'bg';
export function isEnabledLocale(value: unknown, enabled: readonly AppLocale[]): value is AppLocale {
  return isAppLocale(value) && enabled.includes(value);
}
export function resolveLocale(pathname: string, preference: unknown, policy: LocalePolicy) {
  if (!isEnabledLocale(policy.defaultLocale, policy.enabledLocales)) {
    throw new Error('The default locale must be enabled.');
  }
  const segment = pathname.split('/')[1];
  if (isEnabledLocale(segment, policy.enabledLocales)) return {locale: segment, redirectPath: null};
  const locale = isEnabledLocale(preference, policy.enabledLocales) ? preference : policy.defaultLocale;
  // Replace a disabled language prefix, rather than repeatedly prepending another one.
  const relative = isAppLocale(segment) ? pathname.slice(segment.length + 1) || '/' : pathname;
  return {locale, redirectPath: '/' + locale + (relative === '/' ? '' : relative)};
}
