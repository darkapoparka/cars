import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import pg from 'pg';

const { Client } = pg;

function requireEnv(name) {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(`Missing ${name}.`);
	}

	return value;
}

async function main() {
	const databaseUrl = process.env.DATABASE_URL_UNPOOLED?.trim() || requireEnv('DATABASE_URL');
	const migrationsDir = join(process.cwd(), 'db', 'neon', 'migrations');
	const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();

	if (!files.length) {
		throw new Error(`No SQL migrations found in ${migrationsDir}.`);
	}

	const client = new Client({ connectionString: databaseUrl });
	await client.connect();

	try {
		await client.query(`
			create table if not exists public.schema_migrations (
				version text primary key,
				applied_at timestamptz not null default now()
			)
		`);

		for (const file of files) {
			const version = file.replace(/\.sql$/, '');
			const existing = await client.query(
				'select 1 from public.schema_migrations where version = $1',
				[version]
			);

			if (existing.rowCount) {
				console.log(`skip ${file}`);
				continue;
			}

			const sql = await readFile(join(migrationsDir, file), 'utf8');
			console.log(`apply ${file}`);
			await client.query('begin');
			try {
				await client.query(sql);
				await client.query('insert into public.schema_migrations (version) values ($1)', [version]);
				await client.query('commit');
			} catch (error) {
				await client.query('rollback');
				throw error;
			}
		}

		console.log('Neon migrations are up to date.');
	} finally {
		await client.end();
	}
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
