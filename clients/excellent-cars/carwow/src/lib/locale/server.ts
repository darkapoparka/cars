import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import {
	isResource,
	isLocale,
	localeHref,
	preferenceResponse,
	privateHeaders,
	resolveLocale,
	routeParts,
	unsupportedLocale
} from './core';
import { message } from './messages';
/** Locale state is request-local; native auth/database/device handling runs downstream. */
export const localeHandle: Handle = async ({ event, resolve }) => {
	const parts = routeParts(event.url.pathname);
	if (
		!parts.locale &&
		(parts.base === '' || parts.base === '/variant-3') &&
		parts.path === '/api/preferences'
	)
		return preferenceResponse(event.request);
	const state = resolveLocale({
		url: event.url,
		cookie: event.request.headers.get('cookie'),
		acceptLanguage: event.request.headers.get('accept-language'),
		trustedCountry: process.env.VERCEL ? event.request.headers.get('x-vercel-ip-country') : null
	});
	if (/^\/admin(?:\/|$)/.test(parts.path)) state.locale = 'en';
	event.locals.localeState = state;
	// This reusable public template never submits business data, even with configured services.
	if (
		!['GET', 'HEAD', 'OPTIONS'].includes(event.request.method) &&
		!/^\/(?:admin|api\/auth)(?:\/|$)/.test(parts.path)
	) {
		return new Response(JSON.stringify({ message: message(state.locale, 'demo.readOnly') }), {
			status: 403,
			headers: {
				...Object.fromEntries(privateHeaders(state.locale)),
				'Content-Type': 'application/json'
			}
		});
	}
	if (!isResource(event.url.pathname)) {
		if (
			!parts.locale &&
			event.url.searchParams.has('lang') &&
			!isLocale(event.url.searchParams.get('lang'))
		)
			return new Response(message(state.locale, 'locale.unsupported'), {
				status: 400,
				headers: privateHeaders(state.locale)
			});
		if (unsupportedLocale(event.url.pathname))
			return new Response(message(state.locale, 'locale.unsupported'), {
				status: 404,
				headers: privateHeaders(state.locale)
			});
		if (!building && !parts.locale && ['GET', 'HEAD'].includes(event.request.method)) {
			const headers = privateHeaders(state.locale);
			headers.set('Location', localeHref(event.url.pathname + event.url.search, state.locale));
			return new Response(null, { status: 307, headers });
		}
	}
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replaceAll('%cars.locale%', state.locale)
	});
	const location = response.headers.get('location');
	if (
		response.status >= 300 &&
		response.status < 400 &&
		location?.startsWith('/') &&
		!location.startsWith('//')
	) {
		const destination = isResource(location.split(/[?#]/)[0])
			? parts.base && !routeParts(location).base
				? parts.base + location
				: location
			: localeHref(location, state.locale, parts.base);
		const headers = new Headers(response.headers);
		headers.set('Location', destination);
		privateHeaders(state.locale).forEach((value, key) => headers.set(key, value));
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers
		});
	}
	if (
		!response.headers.get('content-type')?.includes('text/html') &&
		!event.url.pathname.endsWith('/__data.json')
	)
		return response;
	const headers = new Headers(response.headers);
	const existingVary = headers.get('Vary');
	privateHeaders(state.locale).forEach((value, key) => headers.set(key, value));
	headers.set(
		'Vary',
		[
			...new Set([
				...(existingVary?.split(',').map((v) => v.trim()) ?? []),
				'Cookie',
				'Accept-Language'
			])
		].join(', ')
	);
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};
