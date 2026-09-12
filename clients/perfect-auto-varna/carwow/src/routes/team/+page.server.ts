import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

// Native (de-templated) /team storefront route. StorefrontTemplateContent owns
// the remaining template-era content utilities, so this route no longer asks the
// layout for /variant-3/assets/app.css or the template head stylesheet.
//
// Like /terms and /reviews (and unlike /about), /team is NOT a mobile-replacement
// route: the desktop shell renders on every viewport and the catch-all already
// rendered the native DesktopTeamPage on it, so the +page.svelte below simply
// mirrors the /terms shell with DesktopTeamPage as its content.
export const prerender = true;

export const load: PageServerLoad = () => ({
	seo: routeSeo('team')
});
