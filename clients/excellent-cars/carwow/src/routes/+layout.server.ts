import { routeParts } from '$lib/locale/core';
import { loadInventoryCountSummary } from '$lib/server/public-inventory-summary';
import { isMobileUserAgent } from '$lib/server/device';
import type { LayoutServerLoad } from './$types';

function shouldLoadStorefrontInventorySummary(pathname: string) {
	return (
		!pathname.startsWith('/admin') &&
		!pathname.startsWith('/api') &&
		!pathname.startsWith('/_app') &&
		!pathname.startsWith('/presentation')
	);
}

export const load: LayoutServerLoad = async ({ locals, url, request }) => {
	const initialViewport = isMobileUserAgent(request.headers.get('user-agent'))
		? 'mobile'
		: 'desktop';
	if (!shouldLoadStorefrontInventorySummary(routeParts(url.pathname).path)) {
		return {
			localeState: locals.localeState,
			initialViewport,
			storefrontInventorySummary: null
		};
	}

	try {
		return {
			localeState: locals.localeState,
			initialViewport,
			storefrontInventorySummary: await loadInventoryCountSummary({ db: locals.db })
		};
	} catch (error) {
		console.error('Storefront inventory summary failed.', {
			pathname: url.pathname,
			message: error instanceof Error ? error.message : String(error)
		});

		return {
			localeState: locals.localeState,
			initialViewport,
			storefrontInventorySummary: null
		};
	}
};
