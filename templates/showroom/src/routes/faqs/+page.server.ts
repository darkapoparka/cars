import type { PageServerLoad } from './$types';
import { auxeroFaqGroups, featuredFaqs } from '$lib/auxero/faqs';
import { homeFiveFooterDataForLocale, homeFiveHeaderDataForLocale } from '$lib/auxero/home-five';
import { resolveLocale } from '$lib/i18n/messages';

// Clean route: NO pageDocument → the Auxero app.css / guards never load.
// Renders the redesigned /faqs in clean Svelte 5 + Tailwind v4 with the shared
// clean chrome. auxeroFullPage stays true so the page owns its own header/footer.
export const load: PageServerLoad = ({ url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));

	return {
		auxeroFullPage: true,
		featured: featuredFaqs,
		groups: auxeroFaqGroups,
		header: homeFiveHeaderDataForLocale(locale, '/faqs'),
		footer: homeFiveFooterDataForLocale(locale),
		locale
	};
};
