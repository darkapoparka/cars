import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

// Vehicle handoff query parameters determine the initial calculation.
export const prerender = false;

export const load: PageServerLoad = () => ({
	seo: routeSeo('calculator')
});
