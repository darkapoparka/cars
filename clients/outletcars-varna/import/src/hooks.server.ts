import type { Handle } from '@sveltejs/kit';
import { isPreviewMode } from '$lib/server/runtime-config';
import { site, themeStyle } from '$lib/config/site';

import { base } from '$app/paths';
import { routeParts, localeHref, isPublicPath, isResource } from '$lib/locale/core';
import { resolveLocale, preferenceResponse } from '$lib/server/locale';
import { privateHeaders } from '$lib/locale/policy';

export const handle: Handle = async ({ event, resolve }) => {
	const origin = event.request.headers.get('origin');
	if (
		!['GET', 'HEAD', 'OPTIONS'].includes(event.request.method) &&
		origin &&
		origin !== event.url.origin
	) {
		return new Response('Cross-origin submissions are not accepted', { status: 403 });
	}
	if (event.url.pathname === base + '/api/preferences') return preferenceResponse(event.request);
	const state = resolveLocale({
		url: event.url,
		cookie: event.request.headers.get('cookie'),
		acceptLanguage: event.request.headers.get('accept-language'),
		trustedCountry:
			process.env.VERCEL === '1' ? event.request.headers.get('x-vercel-ip-country') : null
	});
	event.locals.localeState = state;
	if (/^\/(?:admin|auth)(?:\/|$)/.test(routeParts(event.url.pathname).path)) state.locale = 'en';
	const locale = state.locale;
	const parts = routeParts(event.url.pathname);
	const path = parts.path.replace(/\/+$/, '') || '/';
	const publicPath = parts.base === base && isPublicPath(path);
	if (
		publicPath &&
		parts.locale &&
		event.url.pathname.endsWith('/') &&
		['GET', 'HEAD'].includes(event.request.method)
	) {
		const headers = privateHeaders(locale);
		headers.set('Location', event.url.pathname.replace(/\/+$/, '') + event.url.search);
		return new Response(null, { status: 308, headers });
	}
	if (publicPath && !parts.locale && ['GET', 'HEAD'].includes(event.request.method)) {
		const headers = privateHeaders(locale);
		headers.set('Location', localeHref(event.url.pathname + event.url.search, locale, base));
		return new Response(null, { status: 307, headers });
	}
	const resolved = await resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('%template.locale%', locale).replace('%template.theme%', themeStyle(site))
	});
	// Redirect responses can have immutable headers. Clone before adding security/cache policy.
	const response = new Response(resolved.body, {
		status: resolved.status,
		statusText: resolved.statusText,
		headers: new Headers(resolved.headers)
	});
	const personalized =
		publicPath ||
		event.isDataRequest ||
		(response.status >= 400 && !isResource(event.url.pathname)) ||
		response.headers.get('content-type')?.includes('text/html') ||
		(parts.locale && !isResource(event.url.pathname));
	if (personalized) {
		privateHeaders(locale).forEach((value, key) => response.headers.set(key, value));
		response.headers.append('Vary', 'Cookie, Accept-Language');
	}
	response.headers.set('x-content-type-options', 'nosniff');
	response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
	if (isPreviewMode()) response.headers.set('x-robots-tag', 'noindex, nofollow');
	return response;
};
