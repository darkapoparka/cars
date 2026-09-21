import { localizedCopy } from '$lib/content/localized';
import type { PageServerLoad } from './$types';
import { templatePolicies } from '$lib/data/template-policies';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		policy: localizedCopy(templatePolicies.cookies, locals.localeState.locale)
	};
};
