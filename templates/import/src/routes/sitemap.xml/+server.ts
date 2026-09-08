import { posts } from '$lib/data/blog';
import { daynightBrand, daynightFetchedAt } from '$lib/data/daynight';
import { agents } from '$lib/data/agents';
import { publicSitemapRoutes } from '$lib/auxero/sitemap';
import { listPublicVehicles } from '$lib/server/public-vehicles';

const baseUrl = `https://${daynightBrand.domain}`;

const escapeXml = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');

const routeUrl = (path: string) => `${baseUrl}${path}`;

const urlEntry = (loc: string) => `<url>
	<loc>${escapeXml(loc)}</loc>
	<lastmod>${daynightFetchedAt}</lastmod>
</url>`;

export function GET() {
	const dynamicRoutes = [
		...listPublicVehicles().map((vehicle) => `/inventory/${vehicle.slug}`),
		...agents.map((agent) => `/agents/${agent.slug}`),
		...posts.map((post) => `/blog/${post.slug}`)
	];
	const urls = [...publicSitemapRoutes, ...dynamicRoutes].map((path) => urlEntry(routeUrl(path)));
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=3600'
		}
	});
}
