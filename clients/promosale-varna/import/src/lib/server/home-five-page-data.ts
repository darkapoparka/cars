import {
	homeFiveBrandCardsForLocale,
	homeFiveComparePairsFromVehicles,
	homeFiveFooterDataForLocale,
	homeFiveHeaderDataForLocale,
	homeFiveHeroDataFromVehicles,
	homeFiveModalsDataFromVehicles,
	homeFiveNewsPostsFromPosts,
	homeFiveReviewItems,
	homeFiveTypeCardsForLocale,
	homeFiveVehicleCardsFromVehicles,
	homeFiveVehiclePillsForLocale,
	imageForHomeFiveVehicle,
	resolveHomeFiveHeroActionMode
} from '$lib/auxero/home-five';
import { homeTwoBudgetTilesFromVehicles } from '$lib/auxero/home-two';
import { parseAuxeroHeadAssets } from '$lib/auxero/page-document';
import { inventoryDesktopDataFromState } from '$lib/auxero/inventory-desktop';
import { inventoryMobileDataFromState } from '$lib/auxero/inventory-mobile';
import { getInventoryState } from '$lib/server/inventory-state';
import { posts } from '$lib/data/blog';
import { vehicles } from '$lib/data/vehicles';
import { getMessages, resolveLocale } from '$lib/i18n/messages';
import { extractAuxeroRuntimeHtml, renderAuxeroPageDocument } from '$lib/server/auxero-page';

const escapeHeadAttribute = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// These source photos failed in the rendered catalogue and were replaced by a
// generic BMW showroom image. Keep those listings out of the featured photo row
// until their actual vehicle photos are restored; inventory remains available.
const unavailableFeaturedPhotos = new Set(['11774283016080050', '11775140982675572']);

export const buildHomeFivePageData = ({ request, url }: { request: Request; url: URL }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const activeHeroMode = resolveHomeFiveHeroActionMode(url.searchParams.get('intent'));
	const messages = getMessages(locale);
	const inventoryState = getInventoryState('listing-grid4-columns.html', {
		searchParams: url.searchParams
	});
	const templateFile = 'home-05.html';
	const pageDocument = renderAuxeroPageDocument(
		templateFile,
		{
			request,
			routePath: '',
			searchParams: url.searchParams
		},
		'Home 05 template could not be rendered'
	);
	const runtimeHtml = extractAuxeroRuntimeHtml(pageDocument.bodyHtml, {
		waitForBodyScripts: false
	});

	// Feature only cars that carry a genuine remote listing photo so the homepage
	// card grid reads as one consistent set of real photos. Cars whose source photo
	// was missing/mismatched fall back to a local studio cutout or a generic stock
	// shot (e.g. the X5's remote photo is a 7-series sedan); those are kept out of the
	// grid here rather than mixing cutouts and stock images among the real listings.
	const vehiclesWithListingPhoto = vehicles.filter(
		(vehicle) =>
			!unavailableFeaturedPhotos.has(vehicle.slug) &&
			/^https?:\/\//.test(imageForHomeFiveVehicle(vehicle))
	);
	const homeHeadHtml = `${pageDocument.headHtml.replace(/<title>[\s\S]*?<\/title>/i, '')}
<meta name="description" content="${escapeHeadAttribute(messages.home.seo.description)}">
<link rel="preload" as="image" fetchpriority="high" href="/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp" type="image/webp">
<link rel="preload" as="image" fetchpriority="high" href="/assets/daynight/megamenu/inventory-audi-sq5-cutout.webp" type="image/webp">`;

	return {
		auxeroFullPage: true,
		brandCards: homeFiveBrandCardsForLocale(locale),
		comparePairs: homeFiveComparePairsFromVehicles(vehicles),
		copy: messages.home,
		featuredVehicles: homeFiveVehicleCardsFromVehicles(vehiclesWithListingPhoto, 8, locale),
		footer: homeFiveFooterDataForLocale(locale),
		header: homeFiveHeaderDataForLocale(locale),
		hero: {
			...homeFiveHeroDataFromVehicles(vehicles, locale, activeHeroMode),
			inventorySearch: {
				desktop: {
					filters: inventoryDesktopDataFromState(inventoryState, locale).filters
				},
				mobile: inventoryMobileDataFromState(inventoryState, locale),
				copy: messages.inventory
			}
		},
		homeTwoBudgetTiles: homeTwoBudgetTilesFromVehicles(vehicles, locale),
		modals: homeFiveModalsDataFromVehicles(vehicles, locale),
		newsPosts: homeFiveNewsPostsFromPosts(posts),
		pageDocument: {
			...pageDocument,
			headAssets: parseAuxeroHeadAssets(homeHeadHtml),
			headHtml: homeHeadHtml,
			bodyHtml: ''
		},
		reviews: homeFiveReviewItems,
		runtimeHtml,
		typeCards: homeFiveTypeCardsForLocale(locale),
		vehiclePills: homeFiveVehiclePillsForLocale(locale)
	};
};
