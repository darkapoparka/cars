import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

// Native (de-templated) /reviews storefront route. StorefrontTemplateContent owns
// the remaining template-era content utilities, so this route no longer asks the
// layout for /assets/app.css or the template head stylesheet.
export const prerender = true;

export const load: PageServerLoad = () => ({
	seo: routeSeo('reviews')
});
