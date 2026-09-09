import { getPublishedPublicInventory } from '$lib/server/repositories/public-inventory';
import { loadInventoryMapPage } from '$lib/server/daynight-inventory-page';
import type { PageServerLoad } from './$types';

// Real native route for the half-map inventory view. Shadows the
// `[...templatePath]` catch-all special-case (and `inventory/[slug]` slug==='map')
// — SvelteKit prefers this static segment over the dynamic ones.
export const load: PageServerLoad = async () => {
	const vehicles = await getPublishedPublicInventory();

	return {
		page: await loadInventoryMapPage(vehicles)
	};
};
