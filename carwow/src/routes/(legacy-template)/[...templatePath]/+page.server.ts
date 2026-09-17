import { error, redirect } from '@sveltejs/kit';
import { resolveLegacyDashboardRedirect } from '$lib/server/legacy-redirects';
import type { PageServerLoad } from './$types';

/** Keep historical staff bookmarks; unknown URLs use the normal SvelteKit error page. */
export const load: PageServerLoad = ({ params }) => {
	const target = resolveLegacyDashboardRedirect(params.templatePath ?? '');
	if (target) redirect(303, target);
	error(404, 'Page not found');
};
