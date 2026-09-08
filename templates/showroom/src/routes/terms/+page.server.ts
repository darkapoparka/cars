import type { PageServerLoad } from './$types';
import { auxeroTermsPageTitle, auxeroTermsSections } from '$lib/auxero/terms';
import { homeFiveFooterDataForLocale, homeFiveHeaderDataForLocale } from '$lib/auxero/home-five';
import { resolveLocale } from '$lib/i18n/messages';

// Clean route: NO pageDocument → the Auxero app.css / guards never load.
// Renders the redesigned /terms in clean Svelte 5 + Tailwind v4 with the shared
// clean chrome. auxeroFullPage stays true so the page owns its own header/footer.
export const load: PageServerLoad = ({ url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));

	return {
		auxeroFullPage: true,
		title: auxeroTermsPageTitle,
		sections: auxeroTermsSections,
		header: homeFiveHeaderDataForLocale(locale, '/terms'),
		footer: homeFiveFooterDataForLocale(locale),
		locale
	};
};
