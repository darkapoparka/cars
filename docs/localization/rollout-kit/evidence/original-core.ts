/** Shared locale policy. Request state is never stored in module globals. */
export const localeContract = {
  schemaVersion: 1,
  dealerId: 'ae-sharjah-al-reef-used-cars',
  defaultLocale: 'en',
  enabledLocales: ['en', 'bg'],
  directions: { en: 'ltr', bg: 'ltr' },
  dealerCountry: 'AE',
  inventoryCurrency: 'AED',
  preferenceMaxAge: 15552000,
  promptVersion: 'v1',
  disabledLocales: ['ar']
} as const;
export type Locale = typeof localeContract.enabledLocales[number];
export const isLocale = (value: unknown): value is Locale => value === 'en' || value === 'bg';
export const intlLocale = (locale: Locale) => locale === 'bg' ? 'bg-BG' : 'en-AE';
export const formatPrice = (value: number, locale: Locale) => new Intl.NumberFormat(intlLocale(locale), { style: 'currency', currency: 'AED', currencyDisplay: 'code', maximumFractionDigits: 0 }).format(value);
export type LocaleState = {
  locale: Locale;
  country: string;
  suggestedCountry: string;
  promptDismissed: boolean;
  source: 'url' | 'cookie' | 'header' | 'country' | 'default';
};
export const countries = ('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW').split(' ');
export const isCountry = (value: unknown): value is string => typeof value === 'string' && countries.includes(value);
export function routeParts(pathname: string) {
  const base = pathname.match(/^\/variant-[23](?=\/|$)/)?.[0] ?? '';
  const rest = pathname.slice(base.length) || '/';
  const first = rest.split('/')[1];
  const locale = isLocale(first) ? first : null;
  return { base, locale, path: locale ? rest.slice(first.length + 1) || '/' : rest, first };
}
export function isResource(pathname: string) {
  const { path } = routeParts(pathname);
  return /^\/(?:api|_app|_next|assets|dealer-brand|dealer-inventory|brand|images|fonts|ingest)(?:\/|$)/.test(path) || /\.[a-z0-9]{1,12}$/i.test(path);
}
export function unsupportedLocale(pathname: string) {
  const { first, locale } = routeParts(pathname);
  return !locale && /^[a-z]{2}(?:-[a-z]{2})?$/i.test(first ?? '');
}
/** Build only same-site public links; never localize assets or external schemes. */
export function localeHref(href: string, locale: Locale, defaultBase = ''): string {
  if (!href.startsWith('/') || href.startsWith('//') || /[\\\u0000-\u001f]/.test(href)) return href;
  const split = href.search(/[?#]/);
  const pathname = split < 0 ? href : href.slice(0, split);
  const suffix = split < 0 ? '' : href.slice(split);
  if (isResource(pathname)) return href;
  const parsed = routeParts(pathname);
  const base = parsed.base || defaultBase;
  return `${base}/${locale}${parsed.path === '/' ? '' : parsed.path}${suffix}`;
}
export function cookieValue(header: string | null | undefined, name: string): string | null {
  if (!header || header.length > 16384) return null;
  const part = header.split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`));
  try { return part ? decodeURIComponent(part.slice(name.length + 1)) : null; } catch { return null; }
}
export function preferredLanguage(header: string | null | undefined): Locale | null {
  if (!header || header.length > 4096) return null;
  const choices = header.split(',').map((part, index) => {
    const [tag, ...parameters] = part.trim().toLowerCase().split(';');
    const qPart = parameters.find(parameter => parameter.trim().startsWith('q='));
    const q = qPart ? Number(qPart.trim().slice(2)) : 1;
    return { locale: tag.split('-')[0], q, index };
  }).filter(value => isLocale(value.locale) && Number.isFinite(value.q) && value.q > 0 && value.q <= 1)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  return (choices[0]?.locale as Locale | undefined) ?? null;
}
export function resolveLocale(input: { url: URL; cookie?: string | null; acceptLanguage?: string | null; trustedCountry?: string | null }): LocaleState {
  const savedLocale = cookieValue(input.cookie, 'cars_locale');
  const savedCountry = cookieValue(input.cookie, 'cars_country');
  const suggestedCountry = isCountry(input.trustedCountry) ? input.trustedCountry : 'AE';
  const pathLocale = routeParts(input.url.pathname).locale;
  const queryLocale = input.url.searchParams.get('lang');
  const explicit = pathLocale ?? (isLocale(queryLocale) ? queryLocale : null);
  const accepted = preferredLanguage(input.acceptLanguage);
  const source = explicit ? 'url' : isLocale(savedLocale) ? 'cookie' : accepted ? 'header' : suggestedCountry === 'BG' ? 'country' : 'default';
  const locale = explicit ?? (isLocale(savedLocale) ? savedLocale : accepted ?? (suggestedCountry === 'BG' ? 'bg' : 'en'));
  return { locale, source, country: isCountry(savedCountry) ? savedCountry : suggestedCountry, suggestedCountry,
    promptDismissed: cookieValue(input.cookie, 'cars_prompt') === localeContract.promptVersion };
}
export function privateHeaders(locale?: Locale): Headers {
  const headers = new Headers({ 'Cache-Control': 'private, no-store', 'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store' });
  if (locale) headers.set('Content-Language', locale);
  return headers;
}
export function safeReturnPath(value: unknown, origin: string): string | null {
  if (typeof value !== 'string' || value.length > 2048 || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]|%(?:0[0-9a-f]|1[0-9a-f]|5c)/i.test(value)) return null;
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || isResource(url.pathname) || unsupportedLocale(url.pathname)) return null;
    return url.pathname + url.search + url.hash;
  } catch { return null; }
}
/** The ONLY public write: validated host-only preferences; no business integrations. */
export async function preferenceResponse(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const headers = privateHeaders();
  headers.set('Content-Type', 'application/json; charset=utf-8');
  const fail = (status: number) => new Response(JSON.stringify({ error: 'invalid_preference_request' }), { status, headers });
  if (request.method !== 'POST') { headers.set('Allow', 'POST'); return fail(405); }
  if (request.headers.get('origin') !== url.origin || request.headers.get('sec-fetch-site') === 'cross-site') return fail(403);
  const type = request.headers.get('content-type')?.split(';')[0].trim();
  if (type !== 'application/x-www-form-urlencoded' && type !== 'application/json') return fail(415);
  if (Number(request.headers.get('content-length') ?? 0) > 4096) return fail(413);
  const reader = request.body?.getReader();
  if (!reader) return fail(400);
  let bytes = 0; const chunks: Uint8Array[] = [];
  try { while (true) { const { value, done } = await reader.read(); if (done) break; bytes += value.length; if (bytes > 4096) { await reader.cancel(); return fail(413); } chunks.push(value); } } catch { return fail(400); }
  const body = new Uint8Array(bytes); let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
  let data: Record<string, unknown>;
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(body);
    if (type === 'application/json') data = JSON.parse(text);
    else {
      const params = new URLSearchParams(text);
      if ([...params.keys()].some(key => params.getAll(key).length !== 1)) return fail(400);
      data = Object.fromEntries(params);
    }
    if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).some(key => !['action', 'locale', 'country', 'returnTo'].includes(key))) return fail(400);
  } catch { return fail(400); }
  if (data.action !== 'save' && data.action !== 'dismiss') return fail(400);
  const returnTo = safeReturnPath(data.returnTo, url.origin);
  if (!returnTo || !isLocale(data.locale) || !isCountry(data.country)) return fail(400);
  const options = `; Path=/; Max-Age=${localeContract.preferenceMaxAge}; SameSite=Lax; HttpOnly${url.protocol === 'https:' ? '; Secure' : ''}`;
  headers.append('Set-Cookie', `cars_prompt=${localeContract.promptVersion}${options}`);
  if (data.action === 'save') {
    headers.append('Set-Cookie', `cars_locale=${data.locale}${options}`);
    headers.append('Set-Cookie', `cars_country=${data.country}${options}`);
  }
  const destination = data.action === 'save' ? localeHref(returnTo, data.locale) : returnTo;
  if (type === 'application/json') return new Response(JSON.stringify({ destination }), { status: 200, headers });
  headers.set('Location', destination);
  return new Response(null, { status: 303, headers });
}
