import { env } from '$env/dynamic/private';
import { dealerPreviewMode } from '$lib/data/dealer-preview';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export function hasDatabaseUrl() {
	return !dealerPreviewMode && Boolean(env.DATABASE_URL?.trim());
}

export function getDatabaseUrl() {
 if (dealerPreviewMode) throw new Error('Database access is not enabled for this branch preview.');
	const value = env.DATABASE_URL?.trim();

	if (!value) {
		throw new Error('Missing DATABASE_URL for Neon database access.');
	}

	return value;
}

export function createDb() {
	const sql = neon(getDatabaseUrl());
	return drizzle(sql, { schema });
}

export type Db = ReturnType<typeof createDb>;

export function getRequestDb(locals?: App.Locals) {
	return locals?.db ?? createDb();
}
