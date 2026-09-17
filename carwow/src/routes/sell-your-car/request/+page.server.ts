import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

// This response includes request-specific viewport chrome and live inventory context.
export const prerender = false;

export const load: PageServerLoad = () => ({
	seo: routeSeo('sell-your-car/request')
});
