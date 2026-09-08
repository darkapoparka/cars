import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview, getAdminInventoryRows } from '$lib/server/admin-cms';
import { requireEliqautoPageSession } from '$lib/server/auth';
import { cmsListingStatusOptions, normalizeCmsListingStatus } from '$lib/server/cms-workflow';
import {
	archiveInventoryListing,
	duplicateInventoryListing,
	updateInventoryListingStatus
} from '$lib/server/inventory';

export const load: PageServerLoad = ({ request, url }) => {
	const session = requireEliqautoPageSession(request, 'admin/inventory', url.searchParams);
	const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
	const status = (url.searchParams.get('status') ?? 'all').toLowerCase();
	const cms = getAdminCmsOverview();
	const rows = getAdminInventoryRows({ includeArchived: status === 'archived' });
	const activeRows = getAdminInventoryRows();
	const inventory = rows.filter((vehicle) => {
		const matchesQuery =
			!query ||
			[
				vehicle.title,
				vehicle.brand,
				vehicle.model,
				vehicle.vin,
				vehicle.stockNumber,
				vehicle.fuel,
				vehicle.transmission,
				vehicle.priceLabel,
				vehicle.location
			]
				.join(' ')
				.toLowerCase()
				.includes(query);
		const matchesStatus =
			status === 'all' ? vehicle.status !== 'archived' : vehicle.status === status;

		return matchesQuery && matchesStatus;
	});

	return {
		auxeroFullPage: true,
		cms,
		inventory,
		query,
		session,
		status,
		statusOptions: [{ label: 'All', value: 'all' }, ...cmsListingStatusOptions],
		summary: {
			draftIntake: activeRows.filter((row) => row.status === 'draft' || row.status === 'intake')
				.length,
			incomplete: activeRows.filter((row) => row.completeness.missing.length > 0).length,
			live: activeRows.filter((row) => row.status === 'published').length,
			reservedSold: activeRows.filter((row) => row.status === 'reserved' || row.status === 'sold')
				.length
		}
	};
};

export const actions: Actions = {
	archive: async ({ request, url }) => {
		requireEliqautoPageSession(request, 'admin/inventory', url.searchParams);
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '').trim();

		if (!id) {
			return fail(400, { error: 'Listing id is required.' });
		}

		const listing = archiveInventoryListing(id);

		if (!listing) {
			return fail(404, { error: 'Listing could not be archived.' });
		}

		redirect(303, '/admin/inventory?status=archived');
	},
	duplicate: async ({ request, url }) => {
		requireEliqautoPageSession(request, 'admin/inventory', url.searchParams);
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '').trim();

		if (!id) {
			return fail(400, { error: 'Listing id is required.' });
		}

		const listing = duplicateInventoryListing(id);

		if (!listing) {
			return fail(404, { error: 'Only CMS-owned listings can be duplicated.' });
		}

		redirect(303, `/admin/inventory/edit/${listing.id}?created=1`);
	},
	status: async ({ request, url }) => {
		requireEliqautoPageSession(request, 'admin/inventory', url.searchParams);
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '').trim();
		const status = normalizeCmsListingStatus(String(formData.get('status') ?? 'draft'));

		if (!id) {
			return fail(400, { error: 'Listing id is required.' });
		}

		const listing = updateInventoryListingStatus(id, status);

		if (!listing) {
			return fail(404, { error: 'Only CMS-owned listings can be moved through workflow.' });
		}

		redirect(303, `/admin/inventory?status=${status}`);
	}
};
