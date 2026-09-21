import { localizedCopy } from '$lib/content/localized';
import type { PageServerLoad } from './$types';
import { auxeroServiceCards } from '$lib/content/services';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		services: localizedCopy(auxeroServiceCards, locals.localeState.locale)
	};
};
