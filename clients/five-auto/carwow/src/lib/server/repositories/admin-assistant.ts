import { and, desc, eq, inArray, notInArray } from 'drizzle-orm';
import type { Db } from '$lib/server/db/client';
import { importRequests, leads, posts, vehicles } from '$lib/server/db/schema';
import { getDashboardOverview } from '$lib/server/repositories/dashboard';
import type {
	ImportRequestRow,
	LeadRow,
	LeadStatus,
	PostRow,
	PostStatus,
	PostType,
	VehicleRow,
	VehicleStatus
} from '$lib/types/database';

export type AssistantVehicleFilters = {
	status?: VehicleStatus | 'all';
	query?: string;
	limit?: number;
};

export type AssistantPostFilters = {
	status?: PostStatus | 'all';
	type?: PostType | 'all';
	query?: string;
	limit?: number;
};

export type AssistantWorkQueueFilters = {
	kind?: 'leads' | 'imports' | 'both';
	limit?: number;
};

type AssistantVehicle = Pick<
	VehicleRow,
	| 'id'
	| 'slug'
	| 'title'
	| 'short_title'
	| 'brand'
	| 'model'
	| 'year'
	| 'mileage_text'
	| 'fuel'
	| 'transmission'
	| 'body'
	| 'price'
	| 'price_eur'
	| 'condition'
	| 'condition_line'
	| 'description'
	| 'lot'
	| 'features'
	| 'highlights'
	| 'image'
	| 'status'
	| 'updated_at'
>;

type AssistantPost = Pick<
	PostRow,
	| 'id'
	| 'slug'
	| 'type'
	| 'title'
	| 'excerpt'
	| 'body'
	| 'cover_url'
	| 'category'
	| 'tags'
	| 'author'
	| 'read_minutes'
	| 'published_at'
	| 'status'
	| 'updated_at'
>;

type AssistantLead = Pick<
	LeadRow,
	| 'id'
	| 'vehicle_id'
	| 'import_request_id'
	| 'customer_name'
	| 'contact'
	| 'email'
	| 'phone'
	| 'source'
	| 'message'
	| 'status'
	| 'value'
	| 'created_at'
	| 'updated_at'
>;

type AssistantImportRequest = Pick<
	ImportRequestRow,
	| 'id'
	| 'lead_id'
	| 'customer_name'
	| 'contact'
	| 'email'
	| 'phone'
	| 'origin_country'
	| 'destination_country'
	| 'desired_make'
	| 'desired_model'
	| 'desired_year_min'
	| 'desired_year_max'
	| 'budget_min'
	| 'budget_max'
	| 'fuel'
	| 'transmission'
	| 'notes'
	| 'status'
	| 'assigned_to'
	| 'created_at'
	| 'updated_at'
>;

function clampLimit(value: number | undefined, fallback: number, max: number) {
	if (!Number.isFinite(value)) return fallback;

	return Math.max(1, Math.min(Math.trunc(value ?? fallback), max));
}

function normalizeSearch(value: string | null | undefined) {
	return (value ?? '').trim().toLowerCase();
}

function matchesSearch(record: Record<string, unknown>, query: string, keys: string[]) {
	if (!query) return true;

	const haystack = keys
		.map((key) => record[key])
		.filter(Boolean)
		.join(' ')
		.toLowerCase();

	return haystack.includes(query);
}

function compactText(value: string | null | undefined, maxLength = 360) {
	const normalized = (value ?? '').trim();

	if (normalized.length <= maxLength) return normalized;

	return `${normalized.slice(0, maxLength).trim()}...`;
}

function vehicleQaIssues(vehicle: AssistantVehicle) {
	const issues: string[] = [];

	if (!vehicle.image) issues.push('missing cover image');
	if (!vehicle.description || vehicle.description.trim().length < 120) {
		issues.push('description is short');
	}
	if (!vehicle.price && !vehicle.price_eur) issues.push('missing price');
	if (!vehicle.lot) issues.push('missing lot/source identifier');
	if (!vehicle.features?.length) issues.push('no features listed');
	if (!vehicle.highlights?.length) issues.push('no highlights listed');

	return issues;
}

function summarizeVehicle(vehicle: AssistantVehicle) {
	return {
		id: vehicle.id,
		title: vehicle.short_title || vehicle.title,
		slug: vehicle.slug,
		adminUrl: `/admin/listings/${vehicle.id}`,
		publicUrl: `/inventory/${vehicle.slug}`,
		lot: vehicle.lot,
		status: vehicle.status,
		specs: {
			brand: vehicle.brand,
			model: vehicle.model,
			year: vehicle.year,
			mileage: vehicle.mileage_text,
			fuel: vehicle.fuel,
			transmission: vehicle.transmission,
			body: vehicle.body,
			condition: vehicle.condition
		},
		price: vehicle.price_eur || (vehicle.price ? `${vehicle.price} EUR` : ''),
		conditionLine: vehicle.condition_line,
		description: compactText(vehicle.description),
		features: vehicle.features?.slice(0, 10) ?? [],
		highlights: vehicle.highlights?.slice(0, 8) ?? [],
		hasImage: Boolean(vehicle.image),
		updatedAt: vehicle.updated_at,
		qaIssues: vehicleQaIssues(vehicle)
	};
}

function summarizePost(post: AssistantPost) {
	return {
		id: post.id,
		title: post.title,
		slug: post.slug,
		type: post.type,
		status: post.status,
		adminUrl: `/admin/posts/${post.id}`,
		publicUrl: `/blog/${post.slug}`,
		excerpt: compactText(post.excerpt, 240),
		bodyPreview: compactText(post.body, 360),
		category: post.category,
		tags: post.tags?.slice(0, 8) ?? [],
		author: post.author,
		readMinutes: post.read_minutes,
		hasCoverImage: Boolean(post.cover_url),
		publishedAt: post.published_at,
		updatedAt: post.updated_at
	};
}

// GDPR/data-minimization: direct contact identifiers are masked before they enter the
// LLM (OpenAI) context. Operators see the full values in the CMS via `adminUrl`.
// customerName + message/notes are kept (needed for triage/draft personalization) and
// may still contain personal data sent to the model — note this in the privacy policy.
export function maskEmail(value: string | null) {
	if (!value) return value;
	const [local, domain] = value.split('@');
	if (!domain) return '***';
	return `${local.slice(0, 1)}***@${domain}`;
}

export function maskPhone(value: string | null) {
	if (!value) return value;
	const digits = value.replace(/\D/g, '');
	return digits.length >= 4 ? `***${digits.slice(-3)}` : '***';
}

export function maskContact(value: string | null) {
	if (!value) return value;
	if (value.includes('@')) return maskEmail(value);
	if (/\d/.test(value)) return maskPhone(value);
	return value;
}

function summarizeLead(lead: AssistantLead) {
	return {
		id: lead.id,
		customerName: lead.customer_name,
		contact: maskContact(lead.contact),
		email: maskEmail(lead.email),
		phone: maskPhone(lead.phone),
		source: lead.source,
		status: lead.status,
		value: lead.value,
		message: compactText(lead.message, 320),
		vehicleId: lead.vehicle_id,
		importRequestId: lead.import_request_id,
		adminUrl: '/admin/leads',
		createdAt: lead.created_at,
		updatedAt: lead.updated_at
	};
}

function summarizeImportRequest(request: AssistantImportRequest) {
	return {
		id: request.id,
		customerName: request.customer_name,
		contact: maskContact(request.contact),
		email: maskEmail(request.email),
		phone: maskPhone(request.phone),
		status: request.status,
		route: `${request.origin_country} -> ${request.destination_country}`,
		vehicleBrief: [request.desired_make, request.desired_model].filter(Boolean).join(' '),
		yearRange: [request.desired_year_min, request.desired_year_max].filter(Boolean).join(' - '),
		budgetRange: [request.budget_min, request.budget_max].filter(Boolean).join(' - '),
		fuel: request.fuel,
		transmission: request.transmission,
		assignedTo: request.assigned_to,
		notes: compactText(request.notes, 320),
		adminUrl: '/admin/imports',
		createdAt: request.created_at,
		updatedAt: request.updated_at
	};
}

export async function searchAssistantInventory(
	db: Db,
	dealerId: string,
	filters: AssistantVehicleFilters = {}
) {
	const limit = clampLimit(filters.limit, 8, 20);
	const query = normalizeSearch(filters.query);

	const rows = await db
		.select({
			id: vehicles.id,
			slug: vehicles.slug,
			title: vehicles.title,
			short_title: vehicles.short_title,
			brand: vehicles.brand,
			model: vehicles.model,
			year: vehicles.year,
			mileage_text: vehicles.mileage_text,
			fuel: vehicles.fuel,
			transmission: vehicles.transmission,
			body: vehicles.body,
			price: vehicles.price,
			price_eur: vehicles.price_eur,
			condition: vehicles.condition,
			condition_line: vehicles.condition_line,
			description: vehicles.description,
			lot: vehicles.lot,
			features: vehicles.features,
			highlights: vehicles.highlights,
			image: vehicles.image,
			status: vehicles.status,
			updated_at: vehicles.updated_at
		})
		.from(vehicles)
		.where(eq(vehicles.dealer_id, dealerId))
		.orderBy(desc(vehicles.updated_at))
		.limit(120);

	const filteredVehicles = rows.filter((vehicle) => {
		if (filters.status && filters.status !== 'all' && vehicle.status !== filters.status) {
			return false;
		}

		return matchesSearch(vehicle, query, [
			'id',
			'slug',
			'title',
			'short_title',
			'brand',
			'model',
			'year',
			'mileage_text',
			'fuel',
			'transmission',
			'body',
			'condition',
			'condition_line',
			'lot',
			'status'
		]);
	});

	return {
		totalMatched: filteredVehicles.length,
		items: filteredVehicles.slice(0, limit).map(summarizeVehicle)
	};
}

export async function searchAssistantPosts(
	db: Db,
	dealerId: string,
	filters: AssistantPostFilters = {}
) {
	const limit = clampLimit(filters.limit, 8, 20);
	const query = normalizeSearch(filters.query);

	const rows = await db
		.select({
			id: posts.id,
			slug: posts.slug,
			type: posts.type,
			title: posts.title,
			excerpt: posts.excerpt,
			body: posts.body,
			cover_url: posts.cover_url,
			category: posts.category,
			tags: posts.tags,
			author: posts.author,
			read_minutes: posts.read_minutes,
			published_at: posts.published_at,
			status: posts.status,
			updated_at: posts.updated_at
		})
		.from(posts)
		.where(eq(posts.dealer_id, dealerId))
		.orderBy(desc(posts.updated_at))
		.limit(120);

	const filteredPosts = rows.filter((post) => {
		if (filters.status && filters.status !== 'all' && post.status !== filters.status) {
			return false;
		}
		if (filters.type && filters.type !== 'all' && post.type !== filters.type) return false;

		return matchesSearch(post, query, [
			'id',
			'slug',
			'type',
			'title',
			'excerpt',
			'category',
			'author',
			'status'
		]);
	});

	return {
		totalMatched: filteredPosts.length,
		items: filteredPosts.slice(0, limit).map(summarizePost)
	};
}

export async function getAssistantWorkQueue(
	db: Db,
	dealerId: string,
	filters: AssistantWorkQueueFilters = {}
) {
	const limit = clampLimit(filters.limit, 6, 15);
	const includeLeads = filters.kind !== 'imports';
	const includeImports = filters.kind !== 'leads';

	const [leadsResult, importsResult] = await Promise.all([
		includeLeads
			? db
					.select({
						id: leads.id,
						vehicle_id: leads.vehicle_id,
						import_request_id: leads.import_request_id,
						customer_name: leads.customer_name,
						contact: leads.contact,
						email: leads.email,
						phone: leads.phone,
						source: leads.source,
						message: leads.message,
						status: leads.status,
						value: leads.value,
						created_at: leads.created_at,
						updated_at: leads.updated_at
					})
					.from(leads)
					.where(
						and(
							eq(leads.dealer_id, dealerId),
							inArray(leads.status, ['new', 'in_progress'] satisfies LeadStatus[])
						)
					)
					.orderBy(desc(leads.updated_at))
					.limit(limit)
			: Promise.resolve([]),
		includeImports
			? db
					.select({
						id: importRequests.id,
						lead_id: importRequests.lead_id,
						customer_name: importRequests.customer_name,
						contact: importRequests.contact,
						email: importRequests.email,
						phone: importRequests.phone,
						origin_country: importRequests.origin_country,
						destination_country: importRequests.destination_country,
						desired_make: importRequests.desired_make,
						desired_model: importRequests.desired_model,
						desired_year_min: importRequests.desired_year_min,
						desired_year_max: importRequests.desired_year_max,
						budget_min: importRequests.budget_min,
						budget_max: importRequests.budget_max,
						fuel: importRequests.fuel,
						transmission: importRequests.transmission,
						notes: importRequests.notes,
						status: importRequests.status,
						assigned_to: importRequests.assigned_to,
						created_at: importRequests.created_at,
						updated_at: importRequests.updated_at
					})
					.from(importRequests)
					.where(
						and(
							eq(importRequests.dealer_id, dealerId),
							notInArray(importRequests.status, ['delivered', 'cancelled'])
						)
					)
					.orderBy(desc(importRequests.updated_at))
					.limit(limit)
			: Promise.resolve([])
	]);

	return {
		leads: leadsResult.map(summarizeLead),
		imports: importsResult.map(summarizeImportRequest)
	};
}

export async function getAssistantSnapshot(db: Db, dealerId: string) {
	const [dashboard, inventory, posts, workQueue] = await Promise.all([
		getDashboardOverview(db, dealerId),
		searchAssistantInventory(db, dealerId, { limit: 5 }),
		searchAssistantPosts(db, dealerId, { limit: 5 }),
		getAssistantWorkQueue(db, dealerId, { kind: 'both', limit: 4 })
	]);

	return {
		generatedAt: new Date().toISOString(),
		kpis: dashboard.kpis,
		recentInventory: inventory.items,
		recentPosts: posts.items,
		openLeads: workQueue.leads,
		activeImports: workQueue.imports
	};
}

export function buildAssistantSystemPrompt(
	snapshot: Awaited<ReturnType<typeof getAssistantSnapshot>>
) {
	return `You are the Exclusive Auto admin CMS assistant.

You help staff operate inventory, posts/news, leads, imports, analytics, and dealer settings. Keep answers practical, specific, and grounded in CMS data. Use Bulgarian when the user writes Bulgarian; otherwise use concise English.

Hard rules:
- Use only the current CMS snapshot and read-only tools for facts about Exclusive Auto records.
- You may draft listing descriptions, post copy, lead/import summaries, and inventory QA notes.
- You must not claim that you changed, saved, deleted, archived, published, or updated a record.
- Any write must be presented as a draft for staff review in the existing CMS editor/form.
- Include admin links when they help an operator act quickly.
- Preserve Bulgarian line breaks and punctuation in drafted public content.

Current CMS snapshot:
${JSON.stringify(snapshot, null, 2)}`;
}
