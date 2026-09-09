import { isMobileUserAgent } from '$lib/server/device';
import { getPublishedPublicInventory } from '$lib/server/repositories/public-inventory';
import { loadDetailTemplatePage } from '$lib/server/daynight-detail-page';
import type { HomeInitialViewport } from '$lib/types/home';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, request, setHeaders }) => {
	// `inventory/map` is served by the real native route (src/routes/inventory/map),
	// which shadows this dynamic `[slug]` segment.

	const vehicles = await getPublishedPublicInventory();
	const page = await loadDetailTemplatePage(params.slug, vehicles);

	if (!page) {
		throw error(404, 'Vehicle not found');
	}

	// Render only the layout the device needs (see DetailPageShell); vary cache on it.
	setHeaders({ Vary: 'User-Agent' });
	const initialViewport: HomeInitialViewport = isMobileUserAgent(request.headers.get('user-agent'))
		? 'mobile'
		: 'desktop';

	return {
		page,
		initialViewport
	};
};
