import { isMobileUserAgent } from '$lib/server/device';
import { loadHomePageData } from '$lib/server/home-page-data';
import { routeSeo } from '$lib/server/daynight-seo';
import type { HomeInitialViewport } from '$lib/types/home';
import type { PageServerLoad } from './$types';

// /home1-box is a third A/B copy of the home for the CEO: the segmented hero
// toggle from /home1, but with the whole buy box wrapped in a white card on the
// blue hero (the white-card reference layout). See +page.svelte.
export const load: PageServerLoad = ({ request, setHeaders }) => {
	setHeaders({ Vary: 'User-Agent' });
	const initialViewport: HomeInitialViewport = isMobileUserAgent(request.headers.get('user-agent'))
		? 'mobile'
		: 'desktop';
	return loadHomePageData(routeSeo(''), initialViewport);
};
