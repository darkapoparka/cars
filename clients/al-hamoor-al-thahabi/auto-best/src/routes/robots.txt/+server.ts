import { template, canIndex } from '$config/template';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
  const body = (canIndex() ? ['User-agent: *', 'Allow: /', `Sitemap: ${template.canonicalOrigin || url.origin}/sitemap.xml`, ''] : ['User-agent: *', 'Disallow: /', '']).join('\n');

  return new Response(body, {
    headers: {
      'cache-control': 'public, max-age=3600',
      'content-type': 'text/plain; charset=utf-8'
    }
  });
};
