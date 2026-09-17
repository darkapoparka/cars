import { fail, redirect } from '@sveltejs/kit';
import { and, desc, eq, inArray } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { leads } from '$lib/server/db/schema';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import { emptyDashboardOverview, getDashboardOverview } from '$lib/server/repositories/dashboard';
import type { LeadRow, LeadStatus } from '$lib/types/database';

type LeadFilters = {
	status: LeadStatus | 'all';
	query: string;
};

type LeadCounts = Record<LeadStatus | 'all', number>;

const leadStatuses: LeadStatus[] = ['new', 'in_progress', 'won', 'lost', 'archived'];
const leadStatusFilters: Array<LeadStatus | 'all'> = ['all', ...leadStatuses];

function parseLeadStatus(value: FormDataEntryValue | null) {
	return typeof value === 'string' && leadStatuses.includes(value as LeadStatus)
		? (value as LeadStatus)
		: null;
}

function readFilters(url: URL): LeadFilters {
	const rawStatus = url.searchParams.get('status');
	const status = leadStatuses.includes(rawStatus as LeadStatus) ? (rawStatus as LeadStatus) : 'all';

	return {
		status,
		query: url.searchParams.get('q')?.trim() ?? ''
	};
}

function readLeadId(formData: FormData) {
	const id = formData.get('id');
	return typeof id === 'string' && id ? id : null;
}

function readLeadIds(formData: FormData) {
	return formData
		.getAll('ids')
		.filter((id): id is string => typeof id === 'string' && id.length > 0);
}

function normalizeSearch(value: string) {
	return value.trim().toLowerCase();
}

function matchesLeadSearch(lead: LeadRow, query: string) {
	if (!query) return true;

	const haystack = [
		lead.customer_name,
		lead.contact,
		lead.email,
		lead.phone,
		lead.source,
		lead.message,
		lead.status
	]
		.filter(Boolean)
		.join(' ')
		.toLowerCase();

	return haystack.includes(query);
}

function buildCounts(leads: LeadRow[]): LeadCounts {
	const counts = Object.fromEntries(leadStatusFilters.map((status) => [status, 0])) as LeadCounts;
	counts.all = leads.length;

	for (const lead of leads) {
		counts[lead.status] += 1;
	}

	return counts;
}

function filterLeads(leads: LeadRow[], filters: LeadFilters) {
	const query = normalizeSearch(filters.query);

	return leads.filter((lead) => {
		if (filters.status !== 'all' && lead.status !== filters.status) return false;
		return matchesLeadSearch(lead, query);
	});
}

function readNotice(url: URL) {
	if (url.searchParams.get('updated') === 'status') return 'Lead status updated.';
	if (url.searchParams.get('bulk') === 'status') return 'Selected leads updated.';
	return '';
}

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const layout = await parent();
	const filters = readFilters(url);

	if (!locals.db || !layout.dealer?.id) {
		return {
			dashboard: emptyDashboardOverview,
			leads: [],
			leadCounts: buildCounts([]),
			filters,
			notice: readNotice(url)
		};
	}

	const [dashboard, leadsResult] = await Promise.all([
		getDashboardOverview(locals.db, layout.dealer.id),
		locals.db
			.select()
			.from(leads)
			.where(eq(leads.dealer_id, layout.dealer.id))
			.orderBy(desc(leads.updated_at))
			.limit(250)
	]);

	const allLeads = leadsResult;

	return {
		dashboard,
		leads: filterLeads(allLeads, filters),
		leadCounts: buildCounts(allLeads),
		filters,
		notice: readNotice(url)
	};
};

export const actions: Actions = {
	updateStatus: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = readLeadId(formData);
		const status = parseLeadStatus(formData.get('status'));

		if (!id || !status) {
			return fail(400, {
				error: 'Choose a valid lead and status.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.sales) {
			return fail(403, { error: 'This account cannot manage leads.' });
		}

		await db
			.update(leads)
			.set({ status })
			.where(and(eq(leads.dealer_id, dealerId), eq(leads.id, id)));

		throw redirect(303, '/variant-3/admin/leads?updated=status');
	},
	bulkStatus: async ({ locals, request }) => {
		const formData = await request.formData();
		const ids = readLeadIds(formData);
		const status = parseLeadStatus(formData.get('status'));

		if (!ids.length || !status) {
			return fail(400, {
				error: 'Select leads and choose a valid status.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.sales) {
			return fail(403, { error: 'This account cannot manage leads.' });
		}

		await db
			.update(leads)
			.set({ status })
			.where(and(eq(leads.dealer_id, dealerId), inArray(leads.id, ids)));

		throw redirect(303, '/variant-3/admin/leads?bulk=status');
	}
};
