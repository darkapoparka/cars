import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireDayNightPageSession } from '$lib/server/auth';
import { mergeListingUploads, readInventoryListingFields } from '$lib/server/cms-listing-form';
import { createInventoryListing, updateInventoryListing } from '$lib/server/inventory';

export const load: PageServerLoad = async ({ request, url }) => {
	const session = requireDayNightPageSession(request, 'admin/inventory/new', url.searchParams);

	return {
		auxeroFullPage: true,
		cms: await getAdminCmsOverview(),
		session
	};
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		requireDayNightPageSession(request, 'admin/inventory/new', url.searchParams);
		const formData = await request.formData();
		const values = readInventoryListingFields(formData);

		if (!values.title) {
			return fail(400, {
				error: 'Listing title is required.',
				values
			});
		}

		try {
			const listing = createInventoryListing(values);
			const uploads = await mergeListingUploads({ formData, recordId: listing.id });
			const saved = updateInventoryListing(listing.id, uploads) ?? listing;

			redirect(303, `/admin/inventory/edit/${saved.id}?created=1`);
		} catch (error) {
			if (isRedirect(error)) throw error;

			return fail(400, {
				error: error instanceof Error ? error.message : 'Listing could not be saved.',
				values
			});
		}
	}
};
