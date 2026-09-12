import { buildSitemapLocations, getSitemapVehicles, renderSitemapXml } from '$lib/server/sitemap';
import { loadPublishedBlogArticles } from '$lib/server/blog-articles';
import type { RequestHandler } from './$types';
import { base } from '$lib/utils/preview-paths';

export const GET: RequestHandler = async ({ url, locals }) => {
	const vehicles = await getSitemapVehicles();
	const articles = await loadPublishedBlogArticles(locals);
	const appOrigin = `${url.origin}${base}`;
	const body = renderSitemapXml([
		...buildSitemapLocations(appOrigin, vehicles),
		...articles.map(({ slug }) => `${appOrigin}/blog/${encodeURIComponent(slug)}`)
	]);

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
