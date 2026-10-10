import type { PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireDayNightPageSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ request, url }) => {
	const session = requireDayNightPageSession(request, 'admin', url.searchParams);

	return {
		auxeroFullPage: true,
		cms: await getAdminCmsOverview(),
		session
	};
};
