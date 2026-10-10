import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview, getAdminInventoryRow } from '$lib/server/admin-cms';
import { requireDayNightPageSession } from '$lib/server/auth';
import { mergeListingUploads, readInventoryListingFields } from '$lib/server/cms-listing-form';
import { createInventoryListing, updateInventoryListing } from '$lib/server/inventory';

const readNotice = (url: URL) => {
	if (url.searchParams.get('created') === '1') return 'Listing created.';
	if (url.searchParams.get('updated') === '1') return 'Listing updated.';

	return '';
};

export const load: PageServerLoad = async ({ params, request, url }) => {
	const routePath = `admin/inventory/edit/${params.id}`;
	const session = requireDayNightPageSession(request, routePath, url.searchParams);
	const listing = getAdminInventoryRow(params.id);

	return {
		auxeroFullPage: true,
		cms: await getAdminCmsOverview(),
		listing,
		missingListingId: listing ? '' : params.id,
		notice: readNotice(url),
		session
	};
};

export const actions: Actions = {
	default: async ({ params, request, url }) => {
		requireDayNightPageSession(request, `admin/inventory/edit/${params.id}`, url.searchParams);
		const formData = await request.formData();
		const source = String(formData.get('source') ?? '').trim();
		const existing = getAdminInventoryRow(params.id);
		const values = readInventoryListingFields(formData);

		if (!values.title) {
			return fail(400, {
				error: 'Listing title is required.',
				values
			});
		}

		try {
			const listing =
				source === 'admin-listing' && existing?.source === 'admin-listing'
					? updateInventoryListing(params.id, values)
					: createInventoryListing(values);

			if (!listing) {
				return fail(404, {
					error: 'Listing could not be saved.',
					values
				});
			}

			const uploads = await mergeListingUploads({
				existing,
				formData,
				recordId: listing.id
			});
			const saved = updateInventoryListing(listing.id, uploads) ?? listing;

			redirect(303, `/admin/inventory/edit/${saved.id}?updated=1`);
		} catch (error) {
			if (isRedirect(error)) throw error;

			return fail(400, {
				error: error instanceof Error ? error.message : 'Listing could not be saved.',
				values
			});
		}
	}
};
