import { base } from '$app/paths';
import { site } from '$lib/config/site';
import { localeHref } from '$lib/locale/core';
import { listBlogPosts } from '$lib/server/blog-state';
import { daynightFetchedAt } from '$lib/data/daynight';
import { listPublicVehicles } from '$lib/server/public-vehicles';
const escapeXml = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
export function GET() {
	const paths = [
		'/',
		'/inventory',
		'/import',
		'/sell-your-car',
		'/financing',
		'/calculator',
		'/contact',
		'/services',
		'/about',
		'/blog',
		'/reviews',
		'/faqs',
		'/privacy',
		'/terms',
		'/cookies',
		...listPublicVehicles().map((v) => '/inventory/' + v.slug),
		...listBlogPosts().map((p) => '/blog/' + p.slug)
	];
	const url = (path: string, locale: 'en' | 'bg') =>
		site.identity.origin + localeHref(path, locale, base);
	const entries = paths.flatMap((path) =>
		site.locale.supported.map(
			(locale) =>
				'<url><loc>' +
				escapeXml(url(path, locale)) +
				'</loc><lastmod>' +
				daynightFetchedAt +
				'</lastmod>' +
				site.locale.supported
					.map(
						(language) =>
							'<xhtml:link rel="alternate" hreflang="' +
							language +
							'" href="' +
							escapeXml(url(path, language)) +
							'"/>'
					)
					.join('') +
				'</url>'
		)
	);
	return new Response(
		'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
			entries.join('') +
			'</urlset>',
		{
			headers: {
				'content-type': 'application/xml; charset=utf-8',
				'cache-control': 'public, max-age=3600'
			}
		}
	);
}
