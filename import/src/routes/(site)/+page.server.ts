import type { PageServerLoad } from './$types';
import { homePageData } from '$lib/server/home';

export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return homePageData(url, locals.localeState.locale);
};
