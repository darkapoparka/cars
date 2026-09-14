import { fail, redirect } from '@sveltejs/kit';
import { and, desc, eq, inArray } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { importRequests } from '$lib/server/db/schema';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import { emptyDashboardOverview, getDashboardOverview } from '$lib/server/repositories/dashboard';
import type { ImportRequestRow, ImportRequestStatus } from '$lib/types/database';

type ImportFilters = {
	status: ImportRequestStatus | 'all';
	query: string;
};

type ImportCounts = Record<ImportRequestStatus | 'all', number>;

const importStatuses: ImportRequestStatus[] = [
	'new',
	'sourcing',
	'quoted',
	'deposit_pending',
	'purchased',
	'in_transit',
	'customs',
	'ready_for_delivery',
	'delivered',
	'cancelled'
];
const importStatusFilters: Array<ImportRequestStatus | 'all'> = ['all', ...importStatuses];

function parseImportStatus(value: FormDataEntryValue | null) {
	return typeof value === 'string' && importStatuses.includes(value as ImportRequestStatus)
		? (value as ImportRequestStatus)
		: null;
}

function readFilters(url: URL): ImportFilters {
	const rawStatus = url.searchParams.get('status');
	const status = importStatuses.includes(rawStatus as ImportRequestStatus)
		? (rawStatus as ImportRequestStatus)
		: 'all';

	return {
		status,
		query: url.searchParams.get('q')?.trim() ?? ''
	};
}

function readImportId(formData: FormData) {
	const id = formData.get('id');
	return typeof id === 'string' && id ? id : null;
}

function readImportIds(formData: FormData) {
	return formData
		.getAll('ids')
		.filter((id): id is string => typeof id === 'string' && id.length > 0);
}

function normalizeSearch(value: string) {
	return value.trim().toLowerCase();
}

function matchesImportSearch(request: ImportRequestRow, query: string) {
	if (!query) return true;

	const haystack = [
		request.customer_name,
		request.contact,
		request.email,
		request.phone,
		request.origin_country,
		request.destination_country,
		request.desired_make,
		request.desired_model,
		request.fuel,
		request.transmission,
		request.notes,
		request.status
	]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();

	return haystack.includes(query);
}

function buildCounts(imports: ImportRequestRow[]): ImportCounts {
	const counts = Object.fromEntries(
		importStatusFilters.map((status) => [status, 0])
	) as ImportCounts;
	counts.all = imports.length;

	for (const request of imports) {
		counts[request.status] += 1;
	}

	return counts;
}

function filterImports(imports: ImportRequestRow[], filters: ImportFilters) {
	const query = normalizeSearch(filters.query);

	return imports.filter((request) => {
		if (filters.status !== 'all' && request.status !== filters.status) return false;
		return matchesImportSearch(request, query);
	});
}

function readNotice(url: URL) {
	if (url.searchParams.get('updated') === 'status') return 'Import request status updated.';
	if (url.searchParams.get('bulk') === 'status') return 'Selected import requests updated.';
	return '';
}

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const layout = await parent();
	const filters = readFilters(url);

	if (!locals.db || !layout.dealer?.id) {
		return {
			dashboard: emptyDashboardOverview,
			imports: [],
			importCounts: buildCounts([]),
			filters,
			notice: readNotice(url)
		};
	}

	const [dashboard, importsResult] = await Promise.all([
		getDashboardOverview(locals.db, layout.dealer.id),
		locals.db
			.select()
			.from(importRequests)
			.where(eq(importRequests.dealer_id, layout.dealer.id))
			.orderBy(desc(importRequests.updated_at))
			.limit(250)
	]);

	const allImports = importsResult;

	return {
		dashboard,
		imports: filterImports(allImports, filters),
		importCounts: buildCounts(allImports),
		filters,
		notice: readNotice(url)
	};
};

export const actions: Actions = {
	updateStatus: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = readImportId(formData);
		const status = parseImportStatus(formData.get('status'));

		if (!id || !status) {
			return fail(400, {
				error: 'Choose a valid import request and status.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.sales) {
			return fail(403, { error: 'This account cannot manage import requests.' });
		}

		await db
			.update(importRequests)
			.set({ status })
			.where(and(eq(importRequests.dealer_id, dealerId), eq(importRequests.id, id)));

		throw redirect(303, '/admin/imports?updated=status');
	},
	bulkStatus: async ({ locals, request }) => {
		const formData = await request.formData();
		const ids = readImportIds(formData);
		const status = parseImportStatus(formData.get('status'));

		if (!ids.length || !status) {
			return fail(400, {
				error: 'Select import requests and choose a valid status.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.sales) {
			return fail(403, { error: 'This account cannot manage import requests.' });
		}

		await db
			.update(importRequests)
			.set({ status })
			.where(and(eq(importRequests.dealer_id, dealerId), inArray(importRequests.id, ids)));

		throw redirect(303, '/admin/imports?bulk=status');
	}
};
