export const legacyDashboardTemplateRoutes = [] as const;

export const legacyDashboardRedirectTargets = {
	dashboard: '/admin',
	'dashboard/profile': '/admin/settings',
	'dashboard/listings': '/admin/listings',
	'dashboard/listings/new': '/admin/listings/new',
	'dashboard/messages': '/admin/conversations',
	'dashboard/favorites': '/admin',
	'dashboard/reviews': '/admin',
	'dashboard/change-password': '/admin/settings'
} as const;

export const legacyDashboardRedirectRoutes = Object.keys(legacyDashboardRedirectTargets) as Array<
	keyof typeof legacyDashboardRedirectTargets
>;

export const explicitRawTemplateRouteFiles = [
	'src/routes/(legacy-template)/[...templatePath]/+page.svelte'
] as const;

export const explicitRawTemplatePublicRoutes = [] as const;

const legacyDashboardTemplateRouteSet = new Set<string>(legacyDashboardTemplateRoutes);
const explicitRawTemplatePublicRouteSet = new Set<string>(explicitRawTemplatePublicRoutes);

export function isLegacyCatchAllTemplateRoute(routePath: string) {
	return legacyDashboardTemplateRouteSet.has(routePath);
}

export function isExplicitRawTemplatePublicRoute(routePath: string) {
	return explicitRawTemplatePublicRouteSet.has(routePath);
}

export function getLegacyDashboardRedirectTarget(routePath: string) {
	return (
		legacyDashboardRedirectTargets[routePath as keyof typeof legacyDashboardRedirectTargets] ?? null
	);
}
