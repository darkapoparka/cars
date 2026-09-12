import { previewPath } from '$lib/utils/preview-paths';
import { error, redirect } from '@sveltejs/kit';
import {
	getLegacyDashboardRedirectTarget,
	isLegacyCatchAllTemplateRoute
} from '$lib/server/legacy-template-route-policy';
import { loadTemplateRoutePage } from '$lib/server/template-route-page';
import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const routePath = params.templatePath ?? '';
	const dashboardRedirectTarget = getLegacyDashboardRedirectTarget(routePath);

	if (dashboardRedirectTarget) {
		throw redirect(303, previewPath(dashboardRedirectTarget));
	}

	if (!isLegacyCatchAllTemplateRoute(routePath)) {
		error(404, 'Template route not found');
	}

	const page = await loadTemplateRoutePage(routePath);

	if (!page) {
		error(404, 'Template route not found');
	}

	return { page: { ...page, ...routeSeo(page.routePath) } };
};
