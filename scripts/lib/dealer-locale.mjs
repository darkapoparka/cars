import fs from 'node:fs';
import path from 'node:path';

// A declaration is not proof of localized rendering. Keep the legacy packager
// closed to native locale sources until its reviewed replacement is released.
export const LOCALE_INPUT_VERSION = 1;
export const TRANSLATABLE_LOCALES = Object.freeze(['en', 'bg']);
const countries = new Set(('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW').split(' '));
const currencies = new Set(Intl.supportedValuesOf('currency'));
const fields = new Set(['schemaVersion', 'dealerId', 'defaultLocale', 'enabledLocales', 'dealerCountry', 'inventoryCurrency']);

/** Validate explicit dealer facts; never infer a currency or language from country. */
export function normalizeDealerLocale(input, expectedDealerId) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Locale configuration must be an object');
  if (Object.keys(input).some(key => !fields.has(key))) throw new Error('Unknown locale configuration field');
  if (input.schemaVersion !== LOCALE_INPUT_VERSION) throw new Error('Unsupported locale configuration schemaVersion');
  if (typeof expectedDealerId !== 'string' || !/^[a-z0-9][a-z0-9-]{0,127}$/.test(expectedDealerId) || input.dealerId !== expectedDealerId) throw new Error('Locale dealerId must match the requested dealer identity');
  const enabled = input.enabledLocales;
  if (!Array.isArray(enabled) || !enabled.length || enabled.length > 2 || new Set(enabled).size !== enabled.length || enabled.some(value => !TRANSLATABLE_LOCALES.includes(value))) throw new Error('Request distinct en/bg locales only; Arabic and RTL are not released');
  if (!enabled.includes(input.defaultLocale)) throw new Error('defaultLocale must be one of the explicitly requested locales');
  if (!countries.has(input.dealerCountry)) throw new Error('dealerCountry must be an explicit ISO country code');
  if (!currencies.has(input.inventoryCurrency)) throw new Error('inventoryCurrency must be an explicit supported ISO currency code');
  return Object.freeze({ schemaVersion: LOCALE_INPUT_VERSION, dealerId: input.dealerId, defaultLocale: input.defaultLocale,
    enabledLocales: Object.freeze([...enabled]), dealerCountry: input.dealerCountry, inventoryCurrency: input.inventoryCurrency });
}

/** Read a bounded UTF-8 JSON input without writing to a dealer or its registry. */
export function readDealerLocale(file, expectedDealerId) {
  const descriptor = fs.openSync(file, 'r');
  try {
    if (!fs.fstatSync(descriptor).isFile()) throw new Error('Locale input must be a regular file');
    const buffer = Buffer.alloc(16385);
    let length = 0;
    while (length < buffer.length) {
      const count = fs.readSync(descriptor, buffer, length, buffer.length - length, null);
      if (!count) break;
      length += count;
    }
    if (length > 16384) throw new Error('Locale input exceeds 16 KiB');
    const text = new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, length)).replace(/^\uFEFF/, '');
    return normalizeDealerLocale(JSON.parse(text), expectedDealerId);
  } finally { fs.closeSync(descriptor); }
}

export function requestedLocaleEntries(variants, locale) {
  if (!TRANSLATABLE_LOCALES.includes(locale)) throw new Error('Unsupported requested locale');
  return variants.map(({ key, base, entry }) => {
    if (!['', '/variant-2', '/variant-3'].includes(base) || typeof entry !== 'string' || !entry.startsWith(base + '/') || /[\\\u0000-\u001f]/.test(entry)) throw new Error('Invalid existing variant entry');
    if (entry.startsWith('//')) throw new Error('Invalid existing variant entry');
    const split = entry.search(/[?#]/);
    const pathname = split < 0 ? entry : entry.slice(0, split);
    const suffix = split < 0 ? '' : entry.slice(split);
    const tail = pathname.slice(base.length).replace(/^\/(?:en|bg)(?=\/|$)/, '');
    return { key, legacyEntry: entry, requestedEntry: `${base}/${locale}${tail === '/' ? '' : tail}${suffix}` };
  });
}

/** An intended route/config manifest, explicitly NOT a released locale capability. */
export function planDealerLocale(input, manifest) {
  const contract = normalizeDealerLocale(input, manifest.dealerId || manifest.slug);
  return {
    status: 'blocked-unreleased-native-adapter',
    requestedContract: contract,
    requestedRoutes: Object.fromEntries(contract.enabledLocales.map(locale => [locale, requestedLocaleEntries(manifest.variants, locale)])),
    plannedConfigurationPath: 'localization/contract.json',
    appliedChanges: [],
    blockers: [
      manifest.variants.some(item => item.key === 'modern')
        ? 'Packaging v1 rewrites Modern to its default locale and cannot preserve native locale adapters.'
        : 'Packaging v1 has no reviewed native locale adapter for this trio.',
      'Publish and verify complete native template catalogs, adapters and a reviewed compatible packager before enabling generation.'
    ]
  };
}

const nativeFiles = ['localization/core.ts', 'localization/contract.json', 'localization/generated-manifest.json',
  'src/lib/locale/core.ts', 'packages/internationalization/core.ts',
  'auto-best/src/lib/locale/core.ts', 'carwow/src/lib/locale/core.ts', 'modern/packages/internationalization/core.ts'];

export function nativeLocaleSources(files = new Map(), source) {
  return nativeFiles.filter(name => {
    if (files.has(name)) return true;
    return source ? fs.existsSync(path.join(source, name)) : false;
  });
}

export class LocalePackagingError extends Error {
  constructor(sources = []) {
    super('Native localization requires a reviewed compatible packager; packaging v1 would replace locale-aware routing/FAB behavior. No output was installed.' + (sources.length ? ' Sources: ' + sources.join(', ') : ''));
    this.name = 'LocalePackagingError';
    this.code = 'NATIVE_LOCALE_PACKAGER_REQUIRED';
    this.sources = sources;
  }
}

/** Called before legacy transformations, including when callers supply a file map. */
export function assertLegacyLocaleCompatible({ manifest, files, source }) {
  const detected = nativeLocaleSources(files, source);
  if (manifest.localization !== undefined || manifest.localeContract !== undefined || detected.length) throw new LocalePackagingError(detected);
}
