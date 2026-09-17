import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';
import { emptyDashboardOverview, getDashboardOverview } from '$lib/server/repositories/dashboard';

export const load: PageServerLoad = async ({ locals, parent }) => {
	const layout = await parent();

	if (!locals.db || !layout.dealer?.id) {
		return {
			assistantConfigured: Boolean(env.OPENAI_API_KEY),
			assistantModel: env.OPENAI_ADMIN_ASSISTANT_MODEL || 'gpt-5.1',
			dashboard: emptyDashboardOverview
		};
	}

	return {
		assistantConfigured: Boolean(env.OPENAI_API_KEY),
		assistantModel: env.OPENAI_ADMIN_ASSISTANT_MODEL || 'gpt-5.1',
		dashboard: await getDashboardOverview(locals.db, layout.dealer.id)
	};
};
