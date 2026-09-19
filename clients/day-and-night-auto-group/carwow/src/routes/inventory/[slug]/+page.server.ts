import { error } from '@sveltejs/kit';
import { getPublishedPublicInventory } from '$lib/server/repositories/public-inventory';
import { buildVehicleDetailPageData } from '$lib/server/daynight-detail-page';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const page = buildVehicleDetailPageData(params.slug, await getPublishedPublicInventory());
	if (!page) error(404, 'Vehicle not found');
	return { page };
};
