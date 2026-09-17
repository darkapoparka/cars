import { mkdir, writeFile } from 'node:fs/promises';
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

function stamp() {
	return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
	const sourceUrl = requireEnv('SOURCE_DATABASE_URL');
	const exportDir = join(process.cwd(), '.tmp', 'neon-migration-export', stamp());
	const client = new Client({ connectionString: sourceUrl });
	const manifest = {
		createdAt: new Date().toISOString(),
		tables: {}
	};

	await mkdir(exportDir, { recursive: true });
	await client.connect();

	try {
		for (const table of tables) {
			const { rows } = await client.query(`select * from public.${table}`);
			await writeFile(join(exportDir, `${table}.json`), JSON.stringify(rows, null, 2));
			manifest.tables[table] = rows.length;
			console.log(`${table}: ${rows.length}`);
		}

		await writeFile(join(exportDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
		console.log(`Export written to ${exportDir}`);
	} finally {
		await client.end();
	}
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
