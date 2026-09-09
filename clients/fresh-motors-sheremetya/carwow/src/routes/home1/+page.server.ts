import { isMobileUserAgent } from '$lib/server/device';
import { loadHomePageData } from '$lib/server/home-page-data';
import { routeSeo } from '$lib/server/daynight-seo';
import type { HomeInitialViewport } from '$lib/types/home';
import type { PageServerLoad } from './$types';

// /home1 is an A/B copy of the home for the FRESH MOTORS CEO to choose between
// the hero toggle styles: identical data + layout, but the segmented-control
// variant of Купи/Продай instead of the underline (see +page.svelte).
export const load: PageServerLoad = ({ request, setHeaders }) => {
	setHeaders({ Vary: 'User-Agent' });
	const initialViewport: HomeInitialViewport = isMobileUserAgent(request.headers.get('user-agent'))
		? 'mobile'
		: 'desktop';
	return loadHomePageData(routeSeo(''), initialViewport);
};
