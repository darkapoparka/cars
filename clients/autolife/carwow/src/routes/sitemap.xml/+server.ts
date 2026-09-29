import { buildSitemapLocations, getSitemapVehicles, renderSitemapXml } from '$lib/server/sitemap';
import { loadPublishedBlogArticles } from '$lib/server/blog-articles';
import type { RequestHandler } from './$types';
import { base } from '$app/paths';

export const GET: RequestHandler = async ({ url, locals }) => {
	const vehicles = await getSitemapVehicles();
	const articles = await loadPublishedBlogArticles(locals);
	const body = renderSitemapXml(buildSitemapLocations(url.origin, vehicles, base, articles));

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
