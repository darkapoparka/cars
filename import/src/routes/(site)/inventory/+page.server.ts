import type { PageServerLoad } from './$types';
import { getInventoryState } from '$lib/server/inventory-state';
import { inventoryDesktopDataFromState } from '$lib/server/inventory-options';
import { inventoryMobileDataFromState } from '$lib/server/inventory-options-mobile';
import { inventoryCardsFromVehicles } from '$lib/domain/vehicle-card';
import { getMessages } from '$lib/i18n/messages';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;

	const locale = locals.localeState.locale;
	const state = getInventoryState('listing-grid4-columns.html', { searchParams: url.searchParams });
	return {
		locale,
		copy: getMessages(locale).inventory,
		cards: inventoryCardsFromVehicles(state.selected, locale),
		desktop: inventoryDesktopDataFromState(state, locale),
		mobile: inventoryMobileDataFromState(state, locale)
	};
};
