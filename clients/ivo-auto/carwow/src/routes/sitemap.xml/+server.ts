import { buildSitemapLocations, getSitemapVehicles, renderSitemapXml } from '$lib/server/sitemap';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const vehicles = await getSitemapVehicles();
	const body = renderSitemapXml(buildSitemapLocations(url.origin, vehicles));

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
