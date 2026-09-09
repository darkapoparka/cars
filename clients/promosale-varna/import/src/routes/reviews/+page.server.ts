import type { PageServerLoad } from './$types';
import { auxeroReviewCards, auxeroReviewsPage } from '$lib/auxero/reviews';
import { homeFiveFooterDataForLocale, homeFiveHeaderDataForLocale } from '$lib/auxero/home-five';
import { resolveLocale } from '$lib/i18n/messages';

// Clean route: NO pageDocument → the Auxero app.css / guards never load.
// Renders the redesigned /reviews in clean Svelte 5 + Tailwind v4 with the shared
// clean chrome. auxeroFullPage stays true so the page owns its own header/footer.
export const load: PageServerLoad = ({ url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));

	return {
		auxeroFullPage: true,
		cards: auxeroReviewCards,
		reviewsPage: auxeroReviewsPage,
		header: homeFiveHeaderDataForLocale(locale, '/reviews'),
		footer: homeFiveFooterDataForLocale(locale),
		locale
	};
};
