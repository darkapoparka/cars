import { env } from '$env/dynamic/private';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export function hasDatabaseUrl() {
	return Boolean(env.DATABASE_URL?.trim());
}

export function getDatabaseUrl() {
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
