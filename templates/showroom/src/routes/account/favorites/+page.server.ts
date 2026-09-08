import type { PageServerLoad } from './$types';
import { favoriteCardsFromVehicles } from '$lib/auxero/favorites';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { requireEliqautoPageSession } from '$lib/server/auth';
import { getEliqautoFavoriteVehicles } from '$lib/server/garage';
import {
	removeAuxeroPageDocumentBodyHtml,
	removeAuxeroSlotScriptTags,
	renderAuxeroPageSlot
} from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/favorites';
	const session = requireEliqautoPageSession(request, routePath, url.searchParams);

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
			marker: 'data-eliqauto-favorites-grid',
			templateError: 'Favorites template could not be rendered',
			slotError: 'Favorites grid slot could not be located'
		}
	);
	const favoritesSlot = removeAuxeroSlotScriptTags(rawFavoritesSlot);

	return {
		afterFavoritesHtml: favoritesSlot.afterHtml,
		auxeroFullPage: true,
		beforeFavoritesHtml: favoritesSlot.beforeHtml,
		cards: favoriteCardsFromVehicles(getEliqautoFavoriteVehicles(session)),
		dashboard: getAccountDashboardPageData('my-favorites.html', renderOptions, {
			subtitle: 'Saved Eliqauto vehicles stay in one quick review list.',
			title: 'My Favorites'
		}),
		pageDocument: removeAuxeroPageDocumentBodyHtml(pageDocument)
	};
};
