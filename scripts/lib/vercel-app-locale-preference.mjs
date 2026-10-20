/** Public ingress resolves only an explicitly enabled App preference on its bare mount.
 * The localized URL then runs the unchanged native proxy, locale header and route.
 * Absent, disabled and invalid cookies keep the native default-entry path.
 */
export function appLocalePreferenceRedirects(manifest) {
  const apps = manifest.variants.filter(variant => variant.key === 'app');
  if (apps.length !== 1) throw new Error('App preference routing requires exactly one App variant');
  const {base} = apps[0];
  if (typeof base !== 'string' || !/^\/variant-[1-9][0-9]*$/.test(base)) throw new Error('Unsafe App mount');
  const enabled = manifest.localization?.enabledLocales;
  if (enabled === undefined) return [];
  if (!Array.isArray(enabled) || !enabled.length || new Set(enabled).size !== enabled.length || enabled.some(locale => !['bg', 'en'].includes(locale)) || !enabled.includes(manifest.localization.defaultLocale)) throw new Error('Invalid declared App locales');
  return enabled.flatMap(locale => [base, base + '/'].map(source => ({
    source,
    has: [{type: 'cookie', key: 'cars-app-locale', value: {eq: locale}}],
    destination: base + '/' + locale,
    permanent: false,
  })));
}
