import { routeSeo } from '$lib/server/daynight-seo';
import type { PageServerLoad } from './$types';

// Native (de-templated) /faq storefront route. StorefrontTemplateContent owns the
// remaining template-era content utilities, so this route no longer asks the
// layout for /variant-3/assets/app.css or the template head stylesheet.
//
// Content-only route like /terms and /reviews: no dedicated mobile view — the
// desktop shell renders on every viewport, the desktop header inside it is
// CSS-hidden on phones, and MobileHeader + MobileBottomDock provide the mobile
// chrome. The FAQ accordion is native Svelte (FaqContent.svelte).
export const prerender = true;

export const load: PageServerLoad = () => ({
	seo: routeSeo('faq')
});
