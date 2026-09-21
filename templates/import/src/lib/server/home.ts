import { localizedCopy } from '$lib/content/localized';
import { localeFromUrl } from '$lib/locale/core';
import {
	homeFiveReviewItems,
	homeFiveBrandCardsForLocale,
	homeFiveTypeCardsForLocale,
	homeFiveHeroDataFromVehicles,
	homeFiveVehicleCardsFromVehicles,
	resolveHomeFiveHeroActionMode
} from '$lib/auxero/home-five';
import { inventoryCardsFromVehicles } from '$lib/domain/vehicle-card';
import { getMessages } from '$lib/i18n/messages';
import { listPublicVehicles } from './public-vehicles';
import { getInventoryState } from './inventory-state';
import { inventoryDesktopDataFromState } from './inventory-options';
import { inventoryMobileDataFromState } from './inventory-options-mobile';
import { posts } from '$lib/data/blog';
import { isPreviewMode } from './runtime-config';

export function homePageData(url: URL, requestLocale?: import('$lib/locale/core').Locale) {
	const locale = requestLocale ?? localeFromUrl(url);
	const inventory = listPublicVehicles();
	const state = getInventoryState('listing-grid4-columns.html', { searchParams: url.searchParams });
	// The featured photo row must not present illustrations or known-unavailable media as stock photos.
	const featured = inventory.filter((vehicle) => vehicle.mediaKind === 'listing').slice(0, 8);
	return {
		locale,
		copy: getMessages(locale).home,
		hero: {
			...homeFiveHeroDataFromVehicles(
				inventory,
				locale,
				resolveHomeFiveHeroActionMode(url.searchParams.get('intent'))
			),
			inventorySearch: {
				desktop: { filters: inventoryDesktopDataFromState(state, locale).filters },
				mobile: inventoryMobileDataFromState(state, locale),
				copy: getMessages(locale).inventory
			}
		},
		featured: inventoryCardsFromVehicles(featured, locale),
		mobileFeatured: homeFiveVehicleCardsFromVehicles(featured, 8, locale),
		brands: homeFiveBrandCardsForLocale(locale),
		types: homeFiveTypeCardsForLocale(locale),
		reviewItems: isPreviewMode() ? localizedCopy(homeFiveReviewItems, locale) : [],
		posts: localizedCopy(posts, locale)
	};
}
