import { isMobileUserAgent } from '$lib/server/device';
import { getPublishedPublicInventory } from '$lib/server/repositories/public-inventory';
import { loadInventoryTemplatePage } from '$lib/server/daynight-inventory-page';
import type { HomeInitialViewport } from '$lib/types/home';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, setHeaders }) => {
	// Render only the layout the device needs (see InventoryPageShell). Response
	// varies by device, so any shared cache must key on it.
	setHeaders({ Vary: 'User-Agent' });
	const initialViewport: HomeInitialViewport = isMobileUserAgent(request.headers.get('user-agent'))
		? 'mobile'
		: 'desktop';
	const vehicles = await getPublishedPublicInventory();

	return {
		page: await loadInventoryTemplatePage(vehicles),
		initialViewport
	};
};
