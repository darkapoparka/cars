import { isMobileUserAgent } from '$lib/server/device';
import { loadHomePageData } from '$lib/server/home-page-data';
import { getPublishedPublicInventory } from '$lib/server/repositories/public-inventory';
import { routeSeo } from '$lib/server/daynight-seo';
import type { HomeInitialViewport } from '$lib/types/home';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, setHeaders }) => {
	// Response varies by device, so any shared cache must key on it too —
	// otherwise a cached desktop page could be served to a phone.
	setHeaders({ Vary: 'User-Agent' });
	const initialViewport: HomeInitialViewport = isMobileUserAgent(request.headers.get('user-agent'))
		? 'mobile'
		: 'desktop';
	const vehicles = await getPublishedPublicInventory();
	return loadHomePageData(routeSeo(''), initialViewport, vehicles);
};
