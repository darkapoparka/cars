import { localizedCopy } from '$lib/content/localized';
import type { PageServerLoad } from './$types';
import { auxeroAboutContent } from '$lib/auxero/about';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		about: localizedCopy(auxeroAboutContent, locals.localeState.locale)
	};
};
