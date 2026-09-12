import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { createDb, hasDatabaseUrl } from '$lib/server/db/client';
import * as schema from '$lib/server/db/schema';

type AuthInstance = ReturnType<typeof betterAuth>;

let authInstance: AuthInstance | undefined;

export const disabledAuthPaths = [
	'/sign-up/email',
	'/request-password-reset',
	'/reset-password',
	'/send-verification-email',
	'/verify-email'
] as const;

function getBetterAuthSecret() {
	const value = env.BETTER_AUTH_SECRET?.trim();

	if (!value || value.length < 32) {
		throw new Error('Missing BETTER_AUTH_SECRET with at least 32 characters.');
	}

	return value;
}

export function hasAuthRuntimeConfig() {
	return hasDatabaseUrl() && (env.BETTER_AUTH_SECRET?.trim().length ?? 0) >= 32;
}

export function getAuth() {
	if (!hasDatabaseUrl()) {
		throw new Error('Missing DATABASE_URL for Better Auth database access.');
	}

	if (!authInstance) {
		authInstance = betterAuth({
			appName: 'ЕКСТРА КАР-СМ Admin',
			baseURL: env.BETTER_AUTH_URL?.trim() || undefined,
			secret: getBetterAuthSecret(),
			database: drizzleAdapter(createDb(), {
				provider: 'pg',
				schema
			}),
			emailAndPassword: {
				enabled: true,
				disableSignUp: true
			},
			disabledPaths: [...disabledAuthPaths],
			plugins: [sveltekitCookies(getRequestEvent)]
		}) as unknown as AuthInstance;
	}

	return authInstance;
}
