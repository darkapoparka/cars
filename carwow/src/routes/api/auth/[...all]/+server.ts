import { json } from '@sveltejs/kit';
import { disabledAuthPaths, getAuth, hasAuthRuntimeConfig } from '$lib/server/auth/auth';
import type { RequestHandler } from './$types';

function unavailable() {
	return json({ error: 'Auth is not configured for this environment.' }, { status: 503 });
}

function authPath(request: Request) {
	const path = new URL(request.url).pathname;
	return path.replace(/^\/api\/auth/, '') || '/';
}

function isDisabledAuthPath(request: Request) {
	const path = authPath(request);

	return (
		disabledAuthPaths.includes(path as (typeof disabledAuthPaths)[number]) ||
		path.startsWith('/reset-password/')
	);
}

function disabled() {
	return new Response('Not Found', { status: 404 });
}

export const GET: RequestHandler = ({ request }) => {
	if (isDisabledAuthPath(request)) return disabled();
	return hasAuthRuntimeConfig() ? getAuth().handler(request) : unavailable();
};

export const POST: RequestHandler = ({ request }) => {
	if (isDisabledAuthPath(request)) return disabled();
	return hasAuthRuntimeConfig() ? getAuth().handler(request) : unavailable();
};
