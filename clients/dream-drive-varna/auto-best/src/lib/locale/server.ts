import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { isLocale, isResource, localeHref, preferenceResponse, privateHeaders, resolveLocale, routeParts, unsupportedLocale } from './core';
import { message } from './messages';
/** Run before the existing read-only application handler. Only preferences may POST. */
export const localeHandle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname === '/api/preferences') return preferenceResponse(event.request);
  const state = resolveLocale({ url: event.url, cookie: event.request.headers.get('cookie'),
    acceptLanguage: event.request.headers.get('accept-language'),
    trustedCountry: process.env.VERCEL ? event.request.headers.get('x-vercel-ip-country') : null });
  event.locals.localeState = state;
  if (!isResource(event.url.pathname)) {
    const requested = event.url.searchParams.get('lang');
    if (unsupportedLocale(event.url.pathname) || (requested !== null && !isLocale(requested) && !routeParts(event.url.pathname).locale)) {
      const headers = privateHeaders(state.locale); headers.set('Content-Type', 'text/html; charset=utf-8');
      return new Response(`<!doctype html><html lang="${state.locale}" dir="ltr"><head><meta name="robots" content="noindex,nofollow"><title>${message(state.locale, 'locale.unsupported')}</title></head><body><main><h1>${message(state.locale, 'locale.unsupported')}</h1><p>${message(state.locale, 'locale.arabic')}</p><a href="${routeParts(event.url.pathname).base}/${state.locale}">${message(state.locale, 'locale.back')}</a></main></body></html>`, { status: 404, headers });
    }
    if (!building && !routeParts(event.url.pathname).locale && ['GET', 'HEAD'].includes(event.request.method)) {
      const headers = privateHeaders(state.locale);
      headers.set('Location', localeHref(event.url.pathname + event.url.search, state.locale));
      return new Response(null, { status: 307, headers });
    }
  }
  const response = await resolve(event, { transformPageChunk: ({ html }) => html.replaceAll('%cars.locale%', state.locale) });
  const headers = new Headers(response.headers);
  privateHeaders(state.locale).forEach((value, key) => headers.set(key, value));
  headers.set('Vary', [...new Set([...(headers.get('Vary')?.split(',').map(v => v.trim()) ?? []), 'Cookie', 'Accept-Language'])].join(', '));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};
