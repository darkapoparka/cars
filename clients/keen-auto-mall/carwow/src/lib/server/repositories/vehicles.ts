import { and, count, desc, eq, inArray } from 'drizzle-orm';
import {
	vehicleFormSchema,
	vehicleStatusSchema,
	type VehicleFormInput
} from '$lib/server/cms/schemas';
import type { Db } from '$lib/server/db/client';
import { vehicles } from '$lib/server/db/schema';
import type { VehicleInsert } from '$lib/server/db/types';
import type { VehicleRow, VehicleStatus } from '$lib/types/database';

export type VehicleInventoryFilters = {
	status: VehicleStatus | 'all';
	query: string;
};

export type VehicleInventoryOverview = {
	vehicles: VehicleRow[];
	counts: Record<VehicleStatus | 'all', number>;
	filters: VehicleInventoryFilters;
};

export type VehicleFormValues = Record<keyof VehicleFormInput, string>;

export type VehicleFormFailure = {
	error: string;
	values: VehicleFormValues;
	errors?: Partial<Record<keyof VehicleFormInput, string[]>>;
};

const formKeys = [
	'slug',
	'title',
	'shortTitle',
	'brand',
	'model',
	'year',
	'status',
	'condition',
	'price',
	'priceEur',
	'priceBgn',
	'monthly',
	'mileageValue',
	'mileageText',
	'fuel',
	'transmission',
	'body',
	'doors',
	'engine',
	'power',
	'drive',
	'color',
	'image',
	'lot',
	'sourceUrl',
	'conditionLine',
	'description',
	'features',
	'highlights',
	'badges'
] as const satisfies Array<keyof VehicleFormInput>;

const statusOrder: VehicleStatus[] = ['published', 'draft', 'sold', 'archived'];

function readText(formData: FormData, key: keyof VehicleFormInput) {
	const value = formData.get(key);
	return typeof value === 'string' ? value : '';
}

function formatAmount(value: number) {
	return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function splitList(value: string | null | undefined) {
	return (value ?? '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

function normalizeSearch(value: string) {
	return value.trim().toLowerCase();
}

function matchesVehicleSearch(vehicle: VehicleRow, query: string) {
	if (!query) return true;

	const haystack = [
		vehicle.title,
		vehicle.short_title,
		vehicle.brand,
		vehicle.model,
		vehicle.year,
		vehicle.lot,
		vehicle.fuel,
		vehicle.body,
		vehicle.status
	]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();

	return haystack.includes(query);
}

function slugify(value: string) {
	return value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 120);
}

async function createUniqueSlug(
	db: Db,
	dealerId: string,
	baseSlug: string,
	excludeVehicleId?: string
) {
	const base = slugify(baseSlug) || `vehicle-${Date.now()}`;
	let candidate = base;
	let index = 2;

	while (true) {
		const [existing] = await db
			.select({ id: vehicles.id })
			.from(vehicles)
			.where(and(eq(vehicles.dealer_id, dealerId), eq(vehicles.slug, candidate)))
			.limit(1);

		if (!existing || existing.id === excludeVehicleId) return candidate;

		candidate = `${base}-${index}`;
		index += 1;
	}
}

async function buildVehicleWrite(
	db: Db,
	dealerId: string,
	input: VehicleFormInput,
	existing?: VehicleRow
): Promise<VehicleInsert> {
	const shortTitle = input.shortTitle?.trim() || `${input.brand} ${input.model}`.trim();
	const title =
		input.title?.trim() ||
		`${shortTitle} ${input.year} г., ${input.fuel || 'vehicle'}, ${formatAmount(
			input.mileageValue
		)} км`;
	const slug = await createUniqueSlug(
		db,
		dealerId,
		input.slug?.trim() || `${shortTitle}-${input.year}-${input.lot || ''}`,
		existing?.id
	);
	const publishedAt =
		input.status === 'published' ? (existing?.published_at ?? new Date().toISOString()) : null;
	const soldAt = input.status === 'sold' ? (existing?.sold_at ?? new Date().toISOString()) : null;

	return {
		dealer_id: dealerId,
		slug,
		title,
		short_title: shortTitle,
		brand: input.brand,
		model: input.model,
		year: input.year,
		mileage_value: input.mileageValue,
		mileage_text: input.mileageText || `${formatAmount(input.mileageValue)} км`,
		fuel: input.fuel || '',
		transmission: input.transmission || '',
		body: input.body || '',
		doors: input.doors,
		engine: input.engine || '',
		power: input.power || '',
		drive: input.drive || '',
		color: input.color || '',
		price: input.price,
		price_eur: input.priceEur || (input.price ? `${formatAmount(input.price)} EUR` : ''),
		price_bgn:
			input.priceBgn ||
			(input.price ? `${formatAmount(Math.round(input.price * 1.95583))} лв.` : ''),
		monthly: input.monthly || '',
		condition: input.condition,
		description: input.description || '',
		condition_line: input.conditionLine || '',
		lot: input.lot || '',
		source_url: input.sourceUrl || '',
		features: splitList(input.features),
		highlights: splitList(input.highlights),
		badges: splitList(input.badges),
		image: input.image || '',
		status: input.status,
		published_at: publishedAt,
		sold_at: soldAt
	};
}

async function countVehicles(db: Db, dealerId: string, status?: VehicleStatus) {
	const where = status
		? and(eq(vehicles.dealer_id, dealerId), eq(vehicles.status, status))
		: eq(vehicles.dealer_id, dealerId);
	const [result] = await db.select({ value: count() }).from(vehicles).where(where);
	return result?.value ?? 0;
}

export function readVehicleFormValues(formData: FormData): VehicleFormValues {
	return Object.fromEntries(
		formKeys.map((key) => [key, readText(formData, key)])
	) as VehicleFormValues;
}

export function validateVehicleForm(values: VehicleFormValues) {
	return vehicleFormSchema.safeParse(values);
}

export function parseVehicleStatus(value: FormDataEntryValue | null) {
	const parsed = vehicleStatusSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}

export async function getVehicleInventoryOverview(
	db: Db,
	dealerId: string,
	filters: VehicleInventoryFilters
): Promise<VehicleInventoryOverview> {
	const [all, published, draft, sold, archived] = await Promise.all([
		countVehicles(db, dealerId),
		countVehicles(db, dealerId, 'published'),
		countVehicles(db, dealerId, 'draft'),
		countVehicles(db, dealerId, 'sold'),
		countVehicles(db, dealerId, 'archived')
	]);

	const where =
		filters.status === 'all'
			? eq(vehicles.dealer_id, dealerId)
			: and(eq(vehicles.dealer_id, dealerId), eq(vehicles.status, filters.status));
	const rows = await db
		.select()
		.from(vehicles)
		.where(where)
		.orderBy(desc(vehicles.updated_at))
		.limit(250);

	const normalizedQuery = normalizeSearch(filters.query);
	const filteredVehicles = rows.filter((vehicle) => matchesVehicleSearch(vehicle, normalizedQuery));

	return {
		vehicles: filteredVehicles,
		counts: {
			all,
			published,
			draft,
			sold,
			archived
		},
		filters
	};
}

export async function getVehicleById(db: Db, dealerId: string, vehicleId: string) {
	const [vehicle] = await db
		.select()
		.from(vehicles)
		.where(and(eq(vehicles.dealer_id, dealerId), eq(vehicles.id, vehicleId)))
		.limit(1);

	return vehicle ?? null;
}

export async function createVehicle(db: Db, dealerId: string, input: VehicleFormInput) {
	const payload = await buildVehicleWrite(db, dealerId, input);
	const [vehicle] = await db.insert(vehicles).values(payload).returning({ id: vehicles.id });

	if (!vehicle) {
		throw new Error('Vehicle creation returned no id.');
	}

	return vehicle.id;
}

export async function updateVehicle(
	db: Db,
	dealerId: string,
	vehicleId: string,
	input: VehicleFormInput
) {
	const existing = await getVehicleById(db, dealerId, vehicleId);
	if (!existing) return false;

	const payload = await buildVehicleWrite(db, dealerId, input, existing);
	const [updated] = await db
		.update(vehicles)
		.set(payload)
		.where(and(eq(vehicles.dealer_id, dealerId), eq(vehicles.id, vehicleId)))
		.returning({ id: vehicles.id });

	return Boolean(updated);
}

export async function updateVehicleStatus(
	db: Db,
	dealerId: string,
	vehicleId: string,
	status: VehicleStatus
) {
	const existing = await getVehicleById(db, dealerId, vehicleId);
	if (!existing) return false;

	const [updated] = await db
		.update(vehicles)
		.set({
			status,
			published_at:
				status === 'published' ? (existing.published_at ?? new Date().toISOString()) : null,
			sold_at: status === 'sold' ? (existing.sold_at ?? new Date().toISOString()) : null
		})
		.where(and(eq(vehicles.dealer_id, dealerId), eq(vehicles.id, vehicleId)))
		.returning({ id: vehicles.id });

	return Boolean(updated);
}

export async function updateVehiclesStatus(
	db: Db,
	dealerId: string,
	ids: string[],
	status: VehicleStatus
) {
	if (!ids.length) return 0;
	const now = new Date().toISOString();
	const updated = await db
		.update(vehicles)
		.set({
			status,
			published_at: status === 'published' ? now : null,
			sold_at: status === 'sold' ? now : null
		})
		.where(and(eq(vehicles.dealer_id, dealerId), inArray(vehicles.id, ids)))
		.returning({ id: vehicles.id });

	return updated.length;
}

export async function duplicateVehicle(db: Db, dealerId: string, vehicleId: string) {
	const vehicle = await getVehicleById(db, dealerId, vehicleId);
	if (!vehicle) return null;

	const slug = await createUniqueSlug(db, dealerId, `${vehicle.slug}-copy`);
	const { id, created_at, updated_at, ...copy } = vehicle;
	void id;
	void created_at;
	void updated_at;

	const payload: VehicleInsert = {
		...copy,
		slug,
		title: `${vehicle.title} (copy)`,
		short_title: `${vehicle.short_title} copy`,
		lot: vehicle.lot ? `${vehicle.lot}-copy`.slice(0, 80) : '',
		status: 'draft',
		published_at: null,
		sold_at: null
	};

	const [duplicate] = await db.insert(vehicles).values(payload).returning({ id: vehicles.id });

	if (!duplicate) {
		throw new Error('Vehicle duplication returned no id.');
	}

	return duplicate.id;
}

export async function deleteVehicle(db: Db, dealerId: string, vehicleId: string) {
	const [deleted] = await db
		.delete(vehicles)
		.where(and(eq(vehicles.dealer_id, dealerId), eq(vehicles.id, vehicleId)))
		.returning({ id: vehicles.id });

	return Boolean(deleted);
}

export async function deleteVehicles(db: Db, dealerId: string, ids: string[]) {
	if (!ids.length) return 0;

	const deleted = await db
		.delete(vehicles)
		.where(and(eq(vehicles.dealer_id, dealerId), inArray(vehicles.id, ids)))
		.returning({ id: vehicles.id });

	return deleted.length;
}

export const vehicleStatusOptions = statusOrder.map((status) => ({
	value: status,
	label: status.replace(/_/g, ' ')
}));
