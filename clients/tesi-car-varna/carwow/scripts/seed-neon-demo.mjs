import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import pg from 'pg';
import { createServer } from 'vite';

const { Client } = pg;
const DEALER_SLUG = 'daynight-auto';

const vehicleColumns = [
	'dealer_id',
	'slug',
	'title',
	'short_title',
	'brand',
	'model',
	'year',
	'mileage_value',
	'mileage_text',
	'fuel',
	'transmission',
	'body',
	'doors',
	'engine',
	'power',
	'drive',
	'color',
	'price',
	'price_eur',
	'price_bgn',
	'monthly',
	'condition',
	'description',
	'condition_line',
	'lot',
	'source_url',
	'features',
	'highlights',
	'badges',
	'image',
	'status',
	'published_at',
	'sold_at'
];

const postColumns = [
	'dealer_id',
	'slug',
	'type',
	'title',
	'excerpt',
	'body',
	'cover_url',
	'category',
	'tags',
	'author',
	'read_minutes',
	'published_at',
	'status'
];

const photoColumns = [
	'dealer_id',
	'vehicle_id',
	'url',
	'storage_path',
	'alt',
	'sort_order',
	'is_cover'
];

function requireEnv(name) {
	const value = process.env[name]?.trim();

	if (!value) {
		throw new Error(`Missing ${name}.`);
	}

	return value;
}

function upsertSql({
	table,
	columns,
	conflictColumns,
	updateColumns,
	specialUpdate = {},
	returning
}) {
	const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
	const updates = updateColumns
		.map((column) => specialUpdate[column] ?? `${column} = excluded.${column}`)
		.join(', ');
	const returningClause = returning ? ` returning ${returning}` : '';

	return `
		insert into public.${table} (${columns.join(', ')})
		values (${placeholders})
		on conflict (${conflictColumns.join(', ')}) do update
		set ${updates}
		${returningClause}
	`;
}

function valuesFor(row, columns) {
	return columns.map((column) => row[column]);
}

async function loadSeedInputs() {
	const server = await createServer({
		appType: 'custom',
		logLevel: 'error',
		server: { middlewareMode: true }
	});

	try {
		const [vehiclesModule, blogModule, seedModule] = await Promise.all([
			server.ssrLoadModule('/src/lib/data/daynight-vehicles.ts'),
			server.ssrLoadModule('/src/lib/data/daynight-blog.ts'),
			server.ssrLoadModule('/src/lib/server/seed/daynight-catalog-seed.ts')
		]);

		return {
			vehicles: vehiclesModule.daynightVehicles,
			articles: blogModule.daynightArticles,
			seed: seedModule
		};
	} finally {
		await server.close();
	}
}

async function getSeededDealer(client) {
	const { rows } = await client.query(
		'select id, slug, status from public.dealers where slug = $1',
		[DEALER_SLUG]
	);
	const dealer = rows[0];

	if (!dealer) {
		throw new Error(`Seed did not create dealer ${DEALER_SLUG}.`);
	}

	if (dealer.status !== 'active') {
		throw new Error(`Dealer ${DEALER_SLUG} must be active after seed, got ${dealer.status}.`);
	}

	return dealer;
}

async function upsertVehicle(client, row) {
	const { rows } = await client.query(
		upsertSql({
			table: 'vehicles',
			columns: vehicleColumns,
			conflictColumns: ['dealer_id', 'slug'],
			updateColumns: vehicleColumns.filter((column) => !['dealer_id', 'slug'].includes(column)),
			specialUpdate: {
				published_at: 'published_at = coalesce(public.vehicles.published_at, excluded.published_at)'
			},
			returning: 'id'
		}),
		valuesFor(row, vehicleColumns)
	);

	const vehicle = rows[0];
	if (!vehicle) {
		throw new Error(`Vehicle upsert returned no id for ${row.slug}.`);
	}

	return vehicle.id;
}

async function replaceVehiclePhotos(client, dealerId, vehicleId, rows) {
	const urls = rows.map((row) => row.url);

	if (urls.length) {
		await client.query(
			`delete from public.vehicle_photos
			 where dealer_id = $1 and vehicle_id = $2 and not (url = any($3::text[]))`,
			[dealerId, vehicleId, urls]
		);
	} else {
		await client.query(
			'delete from public.vehicle_photos where dealer_id = $1 and vehicle_id = $2',
			[dealerId, vehicleId]
		);
	}

	for (const row of rows) {
		await client.query(
			upsertSql({
				table: 'vehicle_photos',
				columns: photoColumns,
				conflictColumns: ['vehicle_id', 'url'],
				updateColumns: photoColumns.filter((column) => !['vehicle_id', 'url'].includes(column))
			}),
			valuesFor(row, photoColumns)
		);
	}
}

async function upsertPost(client, row) {
	await client.query(
		upsertSql({
			table: 'posts',
			columns: postColumns,
			conflictColumns: ['dealer_id', 'slug'],
			updateColumns: postColumns.filter((column) => !['dealer_id', 'slug'].includes(column))
		}),
		valuesFor(row, postColumns)
	);
}

async function seedCatalog(client, dealerId, inputs) {
	const vehiclePublishedAt = new Date().toISOString();
	let photoCount = 0;

	for (const vehicle of inputs.vehicles) {
		const vehicleId = await upsertVehicle(
			client,
			inputs.seed.vehicleSeedRow(dealerId, vehicle, vehiclePublishedAt)
		);
		const photoRows = inputs.seed.vehiclePhotoSeedRows(dealerId, vehicleId, vehicle);
		await replaceVehiclePhotos(client, dealerId, vehicleId, photoRows);
		photoCount += photoRows.length;
	}

	for (const article of inputs.articles) {
		await upsertPost(client, inputs.seed.postSeedRow(dealerId, article));
	}

	return {
		vehicles: inputs.vehicles.length,
		vehiclePhotos: photoCount,
		posts: inputs.articles.length
	};
}

async function verifySeededRows(client, dealerId, inputs) {
	const vehicleSlugs = inputs.vehicles.map((vehicle) => vehicle.slug);
	const postSlugs = inputs.articles.map((article) => article.slug);

	const { rows: vehicleRows } = await client.query(
		`select count(*)::int as count
		 from public.vehicles
		 where dealer_id = $1 and slug = any($2::text[]) and status = 'published'`,
		[dealerId, vehicleSlugs]
	);
	const { rows: photoRows } = await client.query(
		`select count(*)::int as count
		 from public.vehicle_photos photos
		 inner join public.vehicles vehicles on vehicles.id = photos.vehicle_id
		 where photos.dealer_id = $1 and vehicles.dealer_id = $1 and vehicles.slug = any($2::text[])`,
		[dealerId, vehicleSlugs]
	);
	const { rows: postRows } = await client.query(
		`select count(*)::int as count
		 from public.posts
		 where dealer_id = $1 and slug = any($2::text[]) and status = 'published'`,
		[dealerId, postSlugs]
	);

	return {
		vehicles: vehicleRows[0]?.count ?? 0,
		vehiclePhotos: photoRows[0]?.count ?? 0,
		posts: postRows[0]?.count ?? 0
	};
}

async function main() {
	const databaseUrl = process.env.DATABASE_URL_UNPOOLED?.trim() || requireEnv('DATABASE_URL');
	const seedPath = join(
		process.cwd(),
		'db',
		'neon',
		'migrations',
		'0002_seed_daynight_defaults.sql'
	);
	const [sql, inputs] = await Promise.all([readFile(seedPath, 'utf8'), loadSeedInputs()]);
	const client = new Client({ connectionString: databaseUrl });

	await client.connect();
	let inTransaction = false;

	try {
		await client.query('begin');
		inTransaction = true;
		await client.query(sql);
		const dealer = await getSeededDealer(client);
		const imported = await seedCatalog(client, dealer.id, inputs);
		const verified = await verifySeededRows(client, dealer.id, inputs);

		if (verified.vehicles !== imported.vehicles) {
			throw new Error(`Expected ${imported.vehicles} seeded vehicles, found ${verified.vehicles}.`);
		}

		if (verified.vehiclePhotos !== imported.vehiclePhotos) {
			throw new Error(
				`Expected ${imported.vehiclePhotos} seeded vehicle photos, found ${verified.vehiclePhotos}.`
			);
		}

		if (verified.posts !== imported.posts) {
			throw new Error(`Expected ${imported.posts} seeded posts, found ${verified.posts}.`);
		}

		await client.query('commit');
		inTransaction = false;

		console.log(
			`Seeded dealer ${dealer.slug} (${dealer.id}) with status ${dealer.status}: ` +
				`${verified.vehicles} published vehicles, ${verified.vehiclePhotos} vehicle photos, ` +
				`${verified.posts} published posts.`
		);
	} finally {
		if (inTransaction) {
			await client.query('rollback');
		}
		await client.end();
	}
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	main().catch((error) => {
		console.error(error.message);
		process.exitCode = 1;
	});
}
