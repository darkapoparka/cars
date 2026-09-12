import type { RequestEvent } from '@sveltejs/kit';
import { getAuth, hasAuthRuntimeConfig } from './auth';

export type AuthSession = Awaited<ReturnType<typeof getAuthSession>>;

export async function getAuthSession(event: RequestEvent) {
	if (!hasAuthRuntimeConfig()) {
		return { session: null, user: null };
	}

	const result = await getAuth().api.getSession({
		headers: event.request.headers
	});

	if (!result?.session || !result.user) {
		return { session: null, user: null };
	}

	return {
		session: result.session,
		user: result.user
	};
}
