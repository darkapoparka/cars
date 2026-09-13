import type { PageServerLoad } from './$types';
import { loadTemplatePolicy } from '$lib/server/template-policy-page';
export const load: PageServerLoad = (event) => loadTemplatePolicy('privacy', event);
