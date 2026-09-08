import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
  const body = ['User-agent: *', 'Allow: /', `Sitemap: ${url.origin}/sitemap.xml`, ''].join('\n');

  return new Response(body, {
    headers: {
      'cache-control': 'public, max-age=3600',
      'content-type': 'text/plain; charset=utf-8'
    }
  });
};
