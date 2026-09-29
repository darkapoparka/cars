import type { RequestHandler } from './$types';
import { base } from '$app/paths';

export const GET: RequestHandler = ({ url }) => {
	const body = `User-agent: *
Disallow: ${base}/admin
Disallow: ${base}/admin/
Disallow: ${base}/dashboard
Disallow: ${base}/dashboard/
Disallow: ${base}/home2
Disallow: ${base}/home3
Disallow: ${base}/presentation/home2
Disallow: ${base}/presentation/home3

Sitemap: ${url.origin}${base}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
