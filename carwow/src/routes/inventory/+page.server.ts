import { getPublishedPublicInventory } from '$lib/server/repositories/public-inventory';
import { buildInventoryPageData } from '$lib/server/daynight-inventory-page';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	page: buildInventoryPageData(await getPublishedPublicInventory())
});
