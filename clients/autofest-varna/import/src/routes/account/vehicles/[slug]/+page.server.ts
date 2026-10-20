import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getVehicleBySlug } from '$lib/data/vehicles';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { requireDayNightPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ params, request, url }) => {
	const routePath = `account/vehicles/${params.slug}`;
	const session = requireDayNightPageSession(request, routePath, url.searchParams);
	const vehicle = getVehicleBySlug(params.slug);

	if (!vehicle) {
		error(404, 'Dashboard vehicle not found');
	}

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};

	return {
		dashboard: getAccountDashboardPageData('dashboard.html', renderOptions, {
			subtitle: 'Review saved vehicle details, specs, and next dashboard actions.',
			title: vehicle.title
		}),
		vehicle
	};
};
