import type { PageServerLoad } from './$types';
import { buildHomeFivePageData } from '$lib/server/home-five-page-data';

export const load: PageServerLoad = buildHomeFivePageData;
