import type { PageServerLoad } from './$types';
import { emptyDashboardOverview, getDashboardOverview } from '$lib/server/repositories/dashboard';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const layout = await parent();

	if (!locals.db || !layout.dealer?.id) {
		return {
			dashboard: emptyDashboardOverview
		};
	}

	return {
		dashboard: await getDashboardOverview(locals.db, layout.dealer.id)
	};
};
