import { base } from '$app/paths';
import { page } from '$app/state';
import { localeHref, isResource, routeParts } from '$lib/locale/core';
/** Native public links preserve locale without touching assets or external destinations. */
export function linkHref(href: string): string {
	if (!href.startsWith('/') || href.startsWith('//')) return href;
	if (routeParts(href.split(/[?#]/)[0]).base && routeParts(href.split(/[?#]/)[0]).base !== base)
		return localeHref(href, page.data.locale === 'en' ? 'en' : 'bg', base);
	if (isResource(href.split(/[?#]/)[0]) || /^\/account(?:$|\/(?!favorites))/.test(href))
		return href.startsWith(base + '/') && base ? href : base + href;
	return localeHref(href, page.data.locale === 'en' ? 'en' : 'bg', base);
}
