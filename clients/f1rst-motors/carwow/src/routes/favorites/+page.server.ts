import { routeSeo } from '$lib/server/daynight-seo';
import { getPublishedPublicInventory } from '$lib/server/repositories/public-inventory';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => ({
	seo: routeSeo('favorites'),
	vehicles: await getPublishedPublicInventory({ db: locals.db ?? undefined })
});
