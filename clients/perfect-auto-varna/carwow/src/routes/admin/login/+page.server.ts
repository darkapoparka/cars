import { localPath, previewPath } from '$lib/utils/preview-paths';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAuth, hasAuthRuntimeConfig } from '$lib/server/auth/auth';
import { loginSchema } from '$lib/server/cms/schemas';
import { createRateLimitKey, rateLimit } from '$lib/server/rate-limit';

const loginAliases = new Map([['admin', 'admin@cars.local']]);

function safeRedirectTo(value: string | null) {
	const path = value ? localPath(value) : '';
	if (!(path === '/admin' || path.startsWith('/admin/')) || path.startsWith('/admin/login')) {
		return previewPath('/admin');
	}

	return previewPath(path);
}

function normalizeLoginIdentifier(value: string) {
	return loginAliases.get(value.trim().toLowerCase()) ?? value.trim();
}

export const load: PageServerLoad = async ({ url }) => {
	return {
		redirectTo: safeRedirectTo(url.searchParams.get('redirectTo'))
	};
};

export const actions: Actions = {
	login: async ({ request, url, locals, getClientAddress }) => {
		if (!hasAuthRuntimeConfig()) {
			return fail(500, {
				error: 'Admin authentication is not configured for this environment.'
			});
		}

		const formData = await request.formData();
		const parsed = loginSchema.safeParse({
			email: formData.get('email'),
			password: formData.get('password')
		});

		if (!parsed.success) {
			return fail(400, {
				email: String(formData.get('email') ?? ''),
				error: 'Enter a valid email and password.'
			});
		}

		const loginIdentifier = normalizeLoginIdentifier(parsed.data.email);
		const limitKey = createRateLimitKey('admin-login', `${getClientAddress()}:${loginIdentifier}`);

		let loginLimit;
		try {
			loginLimit = await rateLimit(limitKey, 8, 60_000, { db: locals.db ?? undefined });
		} catch (error) {
			console.error('Admin login rate limit failed.', {
				message: error instanceof Error ? error.message : String(error)
			});

			return fail(503, {
				email: parsed.data.email,
				error: 'Admin authentication is temporarily unavailable.'
			});
		}

		if (!loginLimit.allowed) {
			return fail(429, {
				email: parsed.data.email,
				error: `Too many login attempts. Try again in ${loginLimit.retryAfterSec} seconds.`
			});
		}

		try {
			await getAuth().api.signInEmail({
				body: {
					email: loginIdentifier,
					password: parsed.data.password
				},
				headers: request.headers
			});
		} catch {
			return fail(400, {
				email: parsed.data.email,
				error: 'Invalid email or password.'
			});
		}

		throw redirect(303, safeRedirectTo(url.searchParams.get('redirectTo')));
	}
};
