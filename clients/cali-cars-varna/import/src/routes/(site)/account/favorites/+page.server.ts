import type { PageServerLoad } from './$types';
import { listPublicVehicles } from '$lib/server/public-vehicles';
import { inventoryCardsFromVehicles } from '$lib/domain/vehicle-card';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		cards: inventoryCardsFromVehicles(listPublicVehicles(), locals.localeState.locale)
	};
};
