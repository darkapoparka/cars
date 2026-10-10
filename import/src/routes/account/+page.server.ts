import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { sharedAdminDemoHref } from '$lib/config/admin-demo';

export const load: PageServerLoad = () => {
	redirect(302, sharedAdminDemoHref);
};
