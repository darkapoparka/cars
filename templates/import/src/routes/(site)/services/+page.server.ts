import { localizedCopy } from '$lib/content/localized';
import type { PageServerLoad } from './$types';
import { auxeroServiceCards } from '$lib/content/services';
import { serviceDirectoryCopy } from '$lib/content/service-directory';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		directory: serviceDirectoryCopy[locals.localeState.locale],
		serviceQuery: url.searchParams.get('q') ?? '',
		services: localizedCopy(auxeroServiceCards, locals.localeState.locale)
	};
};
