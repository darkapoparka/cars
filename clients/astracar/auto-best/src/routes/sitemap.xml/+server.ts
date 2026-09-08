import type { RequestHandler } from './$types';

const canonicalRoutes = [
  '/',
  '/listing-grid',
  ...Array.from({ length: 8 }, (_, index) => `/listing-detail-v1/${index + 1}`),
  '/about-us',
  '/contact',
  '/blog',
  ...Array.from({ length: 9 }, (_, index) => `/blog-detail/${index + 1}`)
] as const;

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;'
    };

    return entities[character];
  });

export const GET: RequestHandler = ({ url }) => {
  const urls = canonicalRoutes
    .map((pathname) => `  <url><loc>${escapeXml(new URL(pathname, url.origin).href)}</loc></url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'cache-control': 'public, max-age=3600',
      'content-type': 'application/xml; charset=utf-8'
    }
  });
};
