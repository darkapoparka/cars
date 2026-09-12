import type { RequestHandler } from './$types';
import { previewPath } from '$lib/utils/preview-paths';

export const GET: RequestHandler = ({ url }) => {
	const body = `User-agent: *
Disallow: ${previewPath('/admin')}
Disallow: ${previewPath('/admin/')}
Disallow: ${previewPath('/dashboard')}
Disallow: ${previewPath('/dashboard/')}
Disallow: ${previewPath('/home2')}
Disallow: ${previewPath('/home3')}
Disallow: ${previewPath('/presentation/home2')}
Disallow: ${previewPath('/presentation/home3')}

Sitemap: ${url.origin}${previewPath('/sitemap.xml')}
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
