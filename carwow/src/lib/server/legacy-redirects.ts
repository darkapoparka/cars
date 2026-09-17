/** Historical staff URLs remain redirects, never a second dashboard implementation. */
export const legacyDashboardRedirects = {
	dashboard: '/admin',
	'dashboard/profile': '/admin/settings',
	'dashboard/listings': '/admin/listings',
	'dashboard/listings/new': '/admin/listings/new',
	'dashboard/messages': '/admin/conversations',
	'dashboard/favorites': '/admin',
	'dashboard/reviews': '/admin',
	'dashboard/change-password': '/admin/settings'
} as const;

export function resolveLegacyDashboardRedirect(path: string): string | null {
	if (!Object.hasOwn(legacyDashboardRedirects, path)) return null;
	return legacyDashboardRedirects[path as keyof typeof legacyDashboardRedirects];
}
