import { buildSitemapLocations, getSitemapVehicles, renderSitemapXml } from '$lib/server/sitemap';
import { loadPublishedBlogArticles } from '$lib/server/blog-articles';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const vehicles = await getSitemapVehicles();
	const articles = await loadPublishedBlogArticles(locals);
	const body = renderSitemapXml([
		...buildSitemapLocations(url.origin, vehicles),
		...articles.map(({ slug }) => `${url.origin}/blog/${encodeURIComponent(slug)}`)
	]);

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
