import { loadInventoryCountSummary } from '$lib/server/public-inventory-summary';
import type { LayoutServerLoad } from './$types';

function shouldLoadStorefrontInventorySummary(pathname: string) {
	return (
		!pathname.startsWith('/admin') &&
		!pathname.startsWith('/api') &&
		!pathname.startsWith('/_app') &&
		!pathname.startsWith('/presentation')
	);
}

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!shouldLoadStorefrontInventorySummary(url.pathname)) {
		return {
			storefrontInventorySummary: null
		};
	}

	try {
		return {
			storefrontInventorySummary: await loadInventoryCountSummary({ db: locals.db })
		};
	} catch (error) {
		console.error('Storefront inventory summary failed.', {
			pathname: url.pathname,
			message: error instanceof Error ? error.message : String(error)
		});

		return {
			storefrontInventorySummary: null
		};
	}
};
