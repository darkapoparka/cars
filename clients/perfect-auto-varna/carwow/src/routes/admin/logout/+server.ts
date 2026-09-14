import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAuth, hasAuthRuntimeConfig } from '$lib/server/auth/auth';

export const POST: RequestHandler = async ({ request }) => {
	if (hasAuthRuntimeConfig()) {
		await getAuth().api.signOut({
			headers: request.headers
		});
	}

	throw redirect(303, '/admin/login');
};
