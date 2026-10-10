<script lang="ts">
	import type {
		HomeFiveBrandCard,
		HomeFiveComparePair,
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveHeroData,
		HomeFiveModalsData,
		HomeFiveNewsPost,
		HomeFiveReview,
		HomeFiveTypeCard,
		HomeFiveVehicleCardData,
		HomeFiveVehiclePill
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import HomeFiveActionBand from '../home/HomeFiveActionBand.svelte';
	import HomeFiveBrowseSection from '../home/HomeFiveBrowseSection.svelte';
	import HomeFiveCompareSection from '../home/HomeFiveCompareSection.svelte';
	import HomeFiveFeaturedVehicles from '../home/HomeFiveFeaturedVehicles.svelte';
	import HomeFiveHero from './Home1Hero.svelte';
	import HomeFiveNewsSection from '../home/HomeFiveNewsSection.svelte';
	import HomeFiveReviewsSection from '../home/HomeFiveReviewsSection.svelte';

	let {
		brandCards,
		comparePairs,
		copy,
		featuredVehicles,
		footer,
		header,
		hero,
		modals,
		newsPosts,
		pageDocument,
		reviews,
		runtimeHtml,
		seoTitle,
		mobileTabsVariant = 'boxed',
		typeCards,
		vehiclePills
	}: {
		brandCards: HomeFiveBrandCard[];
		comparePairs: HomeFiveComparePair[];
		copy: HomePageCopy;
		featuredVehicles: HomeFiveVehicleCardData[];
		footer?: HomeFiveFooterData;
		header?: HomeFiveHeaderData;
		hero?: HomeFiveHeroData;
		modals?: HomeFiveModalsData;
		newsPosts: HomeFiveNewsPost[];
		pageDocument: AuxeroPageDocument;
		reviews: HomeFiveReview[];
		runtimeHtml?: string;
		seoTitle?: string;
		mobileTabsVariant?: 'boxed' | 'underline';
		typeCards: HomeFiveTypeCard[];
		vehiclePills: HomeFiveVehiclePill[];
	} = $props();
</script>

<AuxeroPublicShell
	{copy}
	{footer}
	hasLocationSheet
	{header}
	hideMobileLogo
	mainId="main-content"
	{modals}
	{pageDocument}
	{runtimeHtml}
	title={seoTitle}
>
	<HomeFiveHero {hero} {mobileTabsVariant} />
	<HomeFiveActionBand {copy} />
	<HomeFiveFeaturedVehicles vehicles={featuredVehicles} pills={vehiclePills} {copy} />
	<HomeFiveBrowseSection {brandCards} {typeCards} {copy} />
	<HomeFiveCompareSection pairs={comparePairs} {copy} />
	<HomeFiveReviewsSection {reviews} {copy} />
	<HomeFiveNewsSection posts={newsPosts} {copy} />
</AuxeroPublicShell>

<style>
	:global(#main-content) {
		background: var(--bc-bg);
	}

	@media (max-width: 767px) {
		:global(#main-content) {
			background: var(--bc-bg);
			display: flex;
			flex-direction: column;
		}

		:global(#main-content > *) {
			order: 90;
		}

		:global(#main-content > .daynight-mobile-home) {
			order: 10;
		}

		:global(#main-content > .daynight-mobile-home-quick) {
			order: 20;
		}

		:global(#main-content > .daynight-featured-vehicles) {
			order: 30;
		}

		:global(#main-content > .daynight-browse-section) {
			order: 40;
		}

		:global(#main-content > .daynight-action-band) {
			order: 50;
		}

		:global(body.auxero-template-home-05-html #main-content *),
		:global(body.auxero-template-home-05-html #main-content .wow),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .daynight-mobile-call),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .daynight-mobile-map),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .daynight-mobile-call::before
		),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .daynight-mobile-map::before
		) {
			animation: none !important;
			animation-delay: 0s !important;
			transition: none !important;
		}

		:global(body.auxero-template-home-05-html #main-content .wow) {
			opacity: 1 !important;
			transform: none !important;
			visibility: visible !important;
		}
	}
</style>
