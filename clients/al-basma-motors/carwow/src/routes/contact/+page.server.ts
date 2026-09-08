import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

// Enquiry intent and vehicle query parameters determine the initial form.
export const prerender = false;

export const load: PageServerLoad = () => ({
	seo: routeSeo('contact')
});
