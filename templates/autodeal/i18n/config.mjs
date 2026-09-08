export const defaultLocale = 'bg';

export const locales = Object.freeze(['en', 'bg', 'de', 'el', 'ro', 'sr', 'ru', 'uk', 'tr']);

export const localeNames = Object.freeze({
	bg: 'Български',
	en: 'English',
	de: 'Deutsch',
	el: 'Ελληνικά',
	ro: 'Română',
	sr: 'Српски',
	ru: 'Русский',
	uk: 'Українська',
	tr: 'Türkçe'
});

export const localeSet = new Set(locales);

export function isLocale(value) {
	return typeof value === 'string' && localeSet.has(value.toLowerCase());
}

export function resolveLocale(value, fallback = defaultLocale) {
	const candidate = typeof value === 'string' ? value.toLowerCase() : '';
	return localeSet.has(candidate) ? candidate : fallback;
}

export function normalizeRoutePath(routePath = '/') {
	const value = String(routePath || '/');
	if (value === '/' || !value) return '/';
	return `/${value.replace(/^\/+|\/+$/g, '')}`;
}

export function splitLocalePath(pathname) {
	const decodedPathname = decodeURIComponent(pathname || '/');
	const segments = decodedPathname.split('/').filter(Boolean);
	const candidate = segments[0]?.toLowerCase();
	const hadLocale = localeSet.has(candidate);
	const locale = hadLocale ? candidate : defaultLocale;
	const routeSegments = hadLocale ? segments.slice(1) : segments;
	const routePath = routeSegments.length ? `/${routeSegments.join('/')}` : '/';

	return { locale, hadLocale, routePath };
}

export function localePath(locale, routePath = '/') {
	const normalizedRoute = normalizeRoutePath(routePath);
	return `/${resolveLocale(locale)}${normalizedRoute === '/' ? '' : normalizedRoute}`;
}
