import type { LayoutServerLoad } from './$types';
import { runtimeConfig } from '$lib/server/runtime-config';
export const load: LayoutServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		preview: runtimeConfig().mode === 'preview',
		localeState: locals.localeState,
		locale: locals.localeState.locale
	};
};
