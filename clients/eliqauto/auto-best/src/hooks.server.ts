import { message } from '$lib/locale/messages';
import { routeParts, localeHref } from '$lib/locale/core';
import { sequence } from '@sveltejs/kit/hooks';
import { localeHandle } from '$lib/locale/server';
import { featuredVehicles } from '$data/inventory';
import type { Handle } from '@sveltejs/kit';

const securityHeaders: Readonly<Record<string, string>> = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src 'self' ws: wss:",
    "font-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src https://maps.google.com https://www.google.com https://www.youtube-nocookie.com",
    "img-src 'self' data: blob:",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'"
  ].join('; '),
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

const applicationHandle: Handle = async ({ event, resolve }) => {
 if (!['GET','HEAD','OPTIONS'].includes(event.request.method)) return new Response(JSON.stringify({ error: message(event.locals.localeState.locale, 'm_75e9c43d5461') }), { status: 403, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

  const destination = getLegacyRedirect(routeParts(event.url.pathname).path);

  if (destination) {
    return withSecurityHeaders(
      new Response(null, {
        status: 308,
        headers: { location: localeHref(destination + event.url.search, event.locals.localeState.locale) }
      })
    );
  }

  return withSecurityHeaders(await resolve(event));
};

export const handle = sequence(localeHandle, applicationHandle);
