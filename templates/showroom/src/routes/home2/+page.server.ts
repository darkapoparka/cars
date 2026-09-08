import type { PageServerLoad } from './$types';
import { buildHomeFivePageData } from '$lib/server/home-five-page-data';

export const load: PageServerLoad = ({ request, url }) => {
	return buildHomeFivePageData({ request, url });
};
