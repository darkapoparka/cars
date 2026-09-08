import crypto from 'node:crypto';
import type { Handle, HandleServerError, RequestEvent } from '@sveltejs/kit';
import { building } from '$app/environment';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { getRouteBodyClasses } from '$lib/data/template-routes';
import { getAuth, hasAuthRuntimeConfig } from '$lib/server/auth/auth';
import { getAuthSession } from '$lib/server/auth/session';
import { createDb, hasDatabaseUrl } from '$lib/server/db/client';

const appBodyPattern = /<body\b(?=[^>]*\bdata-sveltekit-preload-data=)([^>]*)>/i;
let warnedMissingProductionDatabase = false;

function warnMissingProductionDatabaseUrl() {
	if (warnedMissingProductionDatabase || building || process.env.NODE_ENV !== 'production') {
		return;
	}

	warnedMissingProductionDatabase = true;
	console.error(
		[
			'LEGEND AUTO PRODUCTION MISCONFIGURATION: DATABASE_URL is missing.',
			'The storefront will use demo-only static inventory fallback and admin/write endpoints will fail closed.',
			'Set DATABASE_URL before promoting this Vercel deployment.'
		].join(' ')
	);
}

function renderBodyTagWithClasses(match: string, attributes: string, bodyClasses: string[]) {
	const classValue = bodyClasses.join(' ');
	const classMatch = attributes.match(/\sclass=(["'])(.*?)\1/i);

	if (!classMatch) {
		return `<body${attributes} class="${classValue}">`;
	}

	const mergedClasses = Array.from(
		new Set([...classMatch[2].split(/\s+/).filter(Boolean), ...bodyClasses])
	).join(' ');

	return match.replace(classMatch[0], ` class="${mergedClasses}"`);
}

export function injectBodyClasses(html: string, bodyClasses: string[]) {
	const bodyMatch = appBodyPattern.exec(html);

	if (!bodyMatch || bodyMatch.index === undefined) {
		return html;
	}

	const replacement = renderBodyTagWithClasses(bodyMatch[0], bodyMatch[1], bodyClasses);

	return `${html.slice(0, bodyMatch.index)}${replacement}${html.slice(
		bodyMatch.index + bodyMatch[0].length
	)}`;
}

export const handle: Handle = async ({ event, resolve }) => {
	const hasDb = hasDatabaseUrl();
	if (!hasDb) warnMissingProductionDatabaseUrl();

	event.locals.db = hasDb ? createDb() : null;
	event.locals.staffProfile = null;

	const { session, user } = await getAuthSession(event);
	event.locals.session = session;
	event.locals.user = user;

	const bodyClasses = getRouteBodyClasses(event.url.pathname);
	const resolveOptions = bodyClasses.length
		? {
				transformPageChunk: ({ html }: { html: string }) => injectBodyClasses(html, bodyClasses)
			}
		: undefined;
	const resolveWithBodyClasses = (eventToResolve: RequestEvent) =>
		resolve(eventToResolve, resolveOptions);

	if (hasAuthRuntimeConfig()) {
		return svelteKitHandler({
			event,
			resolve: resolveWithBodyClasses,
			auth: getAuth(),
			building
		});
	}

	return resolveWithBodyClasses(event);
};

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();
	const errorMessage = error instanceof Error ? error.message : String(error);

	console.error('Unhandled server error.', {
		errorId,
		status,
		route: event.route.id,
		pathname: event.url.pathname,
		message: errorMessage,
		stack: error instanceof Error ? error.stack : undefined
	});

	return {
		message: status >= 500 ? 'Something went wrong.' : message,
		errorId
	};
};
