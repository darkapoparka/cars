import { featuredVehicles } from '$data/inventory';
import type { Handle } from '@sveltejs/kit';

const securityHeaders: Readonly<Record<string, string>> = {
  'Permissions-Policy': 'camera=(), microphone=(), payment=(), usb=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '0'
};

const exactLegacyRedirects: Readonly<Record<string, string>> = {
  '/home02': '/',
  '/home03': '/',
  '/home04': '/',
  '/home05': '/',
  '/home06': '/',
  '/home07': '/',
  '/home08': '/',
  '/home09': '/',
  '/home10': '/',
  '/blog-grid': '/blog',
  '/listing-grid2': '/listing-grid',
  '/listing-list': '/listing-grid',
  '/listing-grid-map': '/listing-grid',
  '/listing-list-map': '/listing-grid',
  '/faq': '/contact'
};

const getLegacyRedirect = (pathname: string) => {
  const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
  const exactRedirect = exactLegacyRedirects[normalizedPath];
  if (exactRedirect) return exactRedirect;

  const legacyDetailMatch = normalizedPath.match(/^\/listing-detail-v[2-5]\/([1-9]\d*)$/);
  return legacyDetailMatch && featuredVehicles.some(vehicle => vehicle.id === Number(legacyDetailMatch[1])) ? `/listing-detail-v1/${legacyDetailMatch[1]}` : undefined;
};

const withSecurityHeaders = (response: Response) => {
  for (const [header, value] of Object.entries(securityHeaders)) {
    response.headers.set(header, value);
  }

  return response;
};

export const handle: Handle = async ({ event, resolve }) => {
  const destination = getLegacyRedirect(event.url.pathname);

  if (destination) {
    return withSecurityHeaders(
      new Response(null, {
        status: 308,
        headers: { location: `${destination}${event.url.search}` }
      })
    );
  }

  return withSecurityHeaders(await resolve(event));
};
