import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

// Native (de-templated) /compare storefront route. StorefrontTemplateContent owns
// the remaining template-era content utilities, so this route no longer asks the
// layout for /assets/app.css or the template head stylesheet.
//
// The committed baseline is the DEFAULT compare state (cold load, empty garage),
// which the catch-all rendered from a fixed server-side trio of featured vehicles.
// CompareContent reproduces that exact default, so the page is safe to prerender.
export const prerender = true;

export const load: PageServerLoad = () => ({
	seo: routeSeo('compare')
});
