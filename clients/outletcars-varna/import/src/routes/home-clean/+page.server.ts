import type { PageServerLoad } from './$types';
import {
	homeFiveBrandCardsForLocale,
	homeFiveComparePairsFromVehicles,
	homeFiveFooterDataForLocale,
	homeFiveHeaderDataForLocale,
	homeFiveHeroDataFromVehicles,
	homeFiveNewsPostsFromPosts,
	homeFiveReviewItems,
	homeFiveTypeCardsForLocale,
	homeFiveVehicleCardsFromVehicles,
	homeFiveVehiclePillsForLocale,
	resolveHomeFiveHeroActionMode
} from '$lib/auxero/home-five';
import { posts } from '$lib/data/blog';
import { vehicles } from '$lib/data/vehicles';
import { getMessages, resolveLocale } from '$lib/i18n/messages';

// Clean route: NO pageDocument → the Auxero app.css / guards / swiper never load.
// Returns only the typed view-model data the clean home sections consume. The same
// builders that fed the Auxero shell feed the clean components directly (the data
// layer was already clean). auxeroFullPage stays true so the page owns its chrome.
export const load: PageServerLoad = ({ url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const activeHeroMode = resolveHomeFiveHeroActionMode(url.searchParams.get('intent'));
	const messages = getMessages(locale);

	// Feature only cars with a genuine remote listing photo so the grid reads as one
	// consistent set of real photos (mirrors the live home data builder).
	const vehiclesWithListingPhoto = vehicles.filter((vehicle) => /^https?:\/\//.test(vehicle.image));

	return {
		auxeroFullPage: true,
		locale,
		copy: messages.home,
		header: homeFiveHeaderDataForLocale(locale, '/'),
		footer: homeFiveFooterDataForLocale(locale),
		hero: homeFiveHeroDataFromVehicles(vehicles, locale, activeHeroMode),
		featuredVehicles: homeFiveVehicleCardsFromVehicles(vehiclesWithListingPhoto, 8, locale),
		vehiclePills: homeFiveVehiclePillsForLocale(locale),
		brandCards: homeFiveBrandCardsForLocale(locale),
		typeCards: homeFiveTypeCardsForLocale(locale),
		comparePairs: homeFiveComparePairsFromVehicles(vehicles),
		reviews: homeFiveReviewItems,
		newsPosts: homeFiveNewsPostsFromPosts(posts)
	};
};
