import { dealerCopy } from '$lib/config/dealer-copy';
import type { LayoutServerLoad } from './$types';
import { site } from '$lib/config/site';
import { runtimeConfig } from '$lib/server/runtime-config';
// Handle public canonical redirects inside the locale hook so they carry private headers.
export const trailingSlash = 'ignore';
export const load: LayoutServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;
	return {
		nativeSite: true,
		site: {
			...site,
			contact: { ...site.contact, appointment: dealerCopy[locals.localeState.locale].appointment }
		},
		localeState: locals.localeState,
		locale: locals.localeState.locale,
		preview: runtimeConfig().mode === 'preview'
	};
};
