import { message } from '$lib/locale/messages';
import { routeParts, localeHref } from '$lib/locale/core';
import { sequence } from '@sveltejs/kit/hooks';
import { localeHandle } from '$lib/locale/server';
import { featuredVehicles } from '$data/inventory';
import type { Handle } from '@sveltejs/kit';
import { withSecurityHeaders } from '$lib/server/security';

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

/** Outermost handler: locale redirects, preferences and rejected writes also need headers. */
const securityHandle: Handle = async ({ event, resolve }) => withSecurityHeaders(await resolve(event));

const applicationHandle: Handle = async ({ event, resolve }) => {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(event.request.method)) {
    return new Response(JSON.stringify({ error: message(event.locals.localeState.locale, 'm_75e9c43d5461') }), {
      status: 403, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }

  const destination = getLegacyRedirect(routeParts(event.url.pathname).path);

  if (destination) {
    return new Response(null, {
      status: 308,
      headers: { location: localeHref(destination + event.url.search, event.locals.localeState.locale) }
    });
  }

  return resolve(event);
};

export const handle = sequence(securityHandle, localeHandle, applicationHandle);
