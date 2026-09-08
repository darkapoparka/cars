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
	resolveHomeFiveHeroActionMode
} from '$lib/auxero/home-five';
import { homeTwoBudgetTilesFromVehicles } from '$lib/auxero/home-two';
import { parseAuxeroHeadAssets } from '$lib/auxero/page-document';
import { posts } from '$lib/data/blog';
import { vehicles } from '$lib/data/vehicles';
import { getMessages, resolveLocale } from '$lib/i18n/messages';
import { extractAuxeroRuntimeHtml, renderAuxeroPageDocument } from '$lib/server/auxero-page';

const escapeHeadAttribute = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const buildHomeFivePageData = ({ request, url }: { request: Request; url: URL }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const activeHeroMode = resolveHomeFiveHeroActionMode(url.searchParams.get('intent'));
	const messages = getMessages(locale);
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

	// Inventory photos are normalized to local WebP assets during ingestion. Filtering
	// for remote URLs here used to remove every vehicle and silently delete the primary
	// selling section from both desktop and mobile home. Keep entries with a real image;
	// the card mapper already owns the curated fallback policy.
	const vehiclesWithListingPhoto = vehicles.filter((vehicle) => Boolean(vehicle.image.trim()));
	const homeHeadHtml = `${pageDocument.headHtml.replace(/<title>[\s\S]*?<\/title>/i, '')}
<meta name="description" content="${escapeHeadAttribute(messages.home.seo.description)}">
<link rel="preload" as="image" fetchpriority="high" href="/assets/eliqauto/hero/home-hero-runway-car-black-v1.webp" type="image/webp">
<link rel="preload" as="image" fetchpriority="high" href="/assets/eliqauto/hero/home-hero-runway-car-white-v1.webp" type="image/webp">`;

	return {
		auxeroFullPage: true,
		brandCards: homeFiveBrandCardsForLocale(locale),
		comparePairs: homeFiveComparePairsFromVehicles(vehicles, locale),
		copy: messages.home,
		featuredVehicles: homeFiveVehicleCardsFromVehicles(vehiclesWithListingPhoto, 8, locale),
		footer: homeFiveFooterDataForLocale(locale),
		header: homeFiveHeaderDataForLocale(locale),
		hero: homeFiveHeroDataFromVehicles(vehicles, locale, activeHeroMode),
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
