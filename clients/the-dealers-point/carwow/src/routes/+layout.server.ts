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
	if (!shouldLoadStorefrontInventorySummary(url.pathname)) {
		return {
			initialViewport,
			storefrontInventorySummary: null
		};
	}

	try {
		return {
			initialViewport,
			storefrontInventorySummary: await loadInventoryCountSummary({ db: locals.db })
		};
	} catch (error) {
		console.error('Storefront inventory summary failed.', {
			pathname: url.pathname,
			message: error instanceof Error ? error.message : String(error)
		});

		return {
			initialViewport,
			storefrontInventorySummary: null
		};
	}
};
