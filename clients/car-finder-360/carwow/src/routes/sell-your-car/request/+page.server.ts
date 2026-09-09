import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = () => ({
	seo: routeSeo('sell-your-car/request')
});
