import { buildHomePageData } from '$lib/server/home-page-data';
import { getPublishedPublicInventory } from '$lib/server/repositories/public-inventory';
import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const vehicles = await getPublishedPublicInventory();
	return buildHomePageData(routeSeo(''), vehicles);
};
