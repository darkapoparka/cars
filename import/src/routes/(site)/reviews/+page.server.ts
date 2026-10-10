import { localizedCopy } from '$lib/content/localized';
import type { PageServerLoad } from './$types';
import { auxeroReviewCards } from '$lib/auxero/reviews';
import { isPreviewMode } from '$lib/server/runtime-config';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		reviews: isPreviewMode() ? localizedCopy(auxeroReviewCards, locals.localeState.locale) : [],
		sample: isPreviewMode()
	};
};
