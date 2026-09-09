import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = () => { redirect(303, '/about/kris-car-plovdiv'); };
