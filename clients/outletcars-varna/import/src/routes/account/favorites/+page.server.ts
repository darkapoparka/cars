import type { PageServerLoad } from './$types';
import { favoriteCardsFromVehicles } from '$lib/auxero/favorites';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { requireDayNightPageSession } from '$lib/server/auth';
import { getDayNightFavoriteVehicles } from '$lib/server/garage';
import {
	removeAuxeroPageDocumentBodyHtml,
	removeAuxeroSlotScriptTags,
	renderAuxeroPageSlot
} from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/favorites';
	const session = requireDayNightPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: rawFavoritesSlot } = renderAuxeroPageSlot(
		'my-favorites.html',
		renderOptions,
		{
			marker: 'data-daynight-favorites-grid',
			templateError: 'Favorites template could not be rendered',
			slotError: 'Favorites grid slot could not be located'
		}
	);
	const favoritesSlot = removeAuxeroSlotScriptTags(rawFavoritesSlot);

	return {
		afterFavoritesHtml: favoritesSlot.afterHtml,
		auxeroFullPage: true,
		beforeFavoritesHtml: favoritesSlot.beforeHtml,
		cards: favoriteCardsFromVehicles(getDayNightFavoriteVehicles(session)),
		dashboard: getAccountDashboardPageData('my-favorites.html', renderOptions, {
			subtitle: 'Saved OUTLETCARS.BG — Варна vehicles stay in one quick review list.',
			title: 'My Favorites'
		}),
		pageDocument: removeAuxeroPageDocumentBodyHtml(pageDocument)
	};
};
