import { base } from '$app/paths';
import { page } from '$app/state';
import { localeHref, isResource, routeParts } from '$lib/locale/core';
/** Native public links preserve locale without touching assets or external destinations. */
export function linkHref(href: string): string {
	if (!href.startsWith('/') || href.startsWith('//')) return href;
	const pathname = href.split(/[?#]/)[0];
	if (routeParts(pathname).base && routeParts(pathname).base !== base)
		return localeHref(href, page.data.locale === 'en' ? 'en' : 'bg', base);
	if (isResource(pathname) || /^\/account(?:$|\/(?!favorites))/.test(pathname))
		return href.startsWith(base + '/') && base ? href : base + href;
	return localeHref(href, page.data.locale === 'en' ? 'en' : 'bg', base);
}
