import { template } from '$config/template';
import { featuredVehicles } from '$data/inventory';
import { blogPosts } from '$data/editorial';
import type { RequestHandler } from './$types';

const canonicalRoutes = [
  '/',
  '/listing-grid',
  ...featuredVehicles.map(vehicle => `/listing-detail-v1/${vehicle.id}`),
  '/about-us',
  '/contact',
  '/blog',
  ...blogPosts.map(post => `/blog-detail/${post.id}`)
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
    .map((pathname) => `  <url><loc>${escapeXml(new URL(pathname, template.canonicalOrigin || url.origin).href)}</loc></url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'cache-control': 'public, max-age=3600',
      'content-type': 'application/xml; charset=utf-8'
    }
  });
};
