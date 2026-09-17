import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import pg from 'pg';

const { Client } = pg;

const tables = [
	'dealers',
	'profiles',
	'vehicles',
	'vehicle_photos',
	'posts',
	'leads',
	'import_requests',
	'import_status_events',
	'conversations',
	'conversation_members',
	'messages',
	'message_attachments',
	'visitor_conversation_tokens'
];

function requireEnv(name) {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(`Missing ${name}.`);
	}

	return value;
}

function quoteIdent(identifier) {
	if (!/^[a-z_][a-z0-9_]*$/.test(identifier)) {
		throw new Error(`Unsafe identifier: ${identifier}`);
	}

	return `"${identifier}"`;
}

async function readRows(importDir, table) {
	const raw = await readFile(join(importDir, `${table}.json`), 'utf8');
	return JSON.parse(raw);
}

async function insertRows(client, table, rows) {
	if (!rows.length) return 0;

	const columns = Object.keys(rows[0]);
	const columnSql = columns.map(quoteIdent).join(', ');
	let inserted = 0;

	for (const row of rows) {
		const values = columns.map((column) => row[column]);
		const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
		await client.query(
			`insert into public.${quoteIdent(table)} (${columnSql}) values (${placeholders}) on conflict do nothing`,
			values
		);
		inserted += 1;
	}

	return inserted;
}

async function main() {
	const databaseUrl = process.env.DATABASE_URL_UNPOOLED?.trim() || requireEnv('DATABASE_URL');
	const importDir = requireEnv('NEON_IMPORT_DIR');
	const client = new Client({ connectionString: databaseUrl });

	await client.connect();

	try {
		if (process.env.NEON_IMPORT_TRUNCATE === '1') {
			const tableSql = [...tables].reverse().map((table) => `public.${quoteIdent(table)}`);
			await client.query(`truncate table ${tableSql.join(', ')} restart identity cascade`);
			console.log('Target tables truncated.');
		}

		for (const table of tables) {
			const rows = await readRows(importDir, table);
			const count = await insertRows(client, table, rows);
			console.log(`${table}: ${count}`);
		}
	} finally {
		await client.end();
	}
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
