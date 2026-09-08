<script lang="ts">
	import type {
		HomeFiveBrandCard,
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
	import { eliqautoAssets } from '$lib/data/eliqauto';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import HomeFiveActionBand from './HomeFiveActionBand.svelte';
	import HomeFiveBrowseSection from './HomeFiveBrowseSection.svelte';
	import HomeFiveFeaturedVehicles from './HomeFiveFeaturedVehicles.svelte';
	import HomeFiveHero from './HomeFiveHero.svelte';
	import HomeFiveNewsSection from './HomeFiveNewsSection.svelte';
	import HomeFiveReviewsSection from './HomeFiveReviewsSection.svelte';
	import HomeFiveSellBanner from './HomeFiveSellBanner.svelte';
	import EliqVideoSection from '$lib/components/common/EliqVideoSection.svelte';

	let {
		brandCards,
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
		typeCards,
		vehiclePills
	}: {
		brandCards: HomeFiveBrandCard[];
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
		typeCards: HomeFiveTypeCard[];
		vehiclePills: HomeFiveVehiclePill[];
	} = $props();
</script>

<AuxeroPublicShell
	{copy}
	footer={footer
		? { ...footer, logo: { ...footer.logo, src: eliqautoAssets.logoLight } }
		: undefined}
	hasLocationSheet
	{header}
	hideMobileLogo
	mainId="main-content"
	{modals}
	{pageDocument}
	{runtimeHtml}
	title={seoTitle}
>
	<HomeFiveHero {hero} />
	<HomeFiveActionBand {copy} />
	<HomeFiveFeaturedVehicles vehicles={featuredVehicles} pills={vehiclePills} {copy} />
	<HomeFiveSellBanner {copy} />
	<HomeFiveBrowseSection {brandCards} {typeCards} {copy} />
	<EliqVideoSection english={copy.newsTitle === 'Eliq Auto notes'} />
	<HomeFiveReviewsSection {reviews} {copy} />
	<HomeFiveNewsSection posts={newsPosts} {copy} />
</AuxeroPublicShell>

<style>
	:global(#main-content) {
		background: var(--bc-bg);
	}

	/* Page-level rhythm belongs to this composition; mobile keeps its own spacing. */
	@media (min-width: 992px) and (max-width: 1199px) {
		:global(#main-content .eliqauto-action-card__copy) {
			width: 100%;
		}

		:global(#main-content .eliqauto-action-card__img) {
			width: 260px;
			right: -30px;
			bottom: -24px;
		}
	}

	@media (min-width: 768px) {
		:global(#main-content .eliqauto-action-card:focus-visible) {
			outline: 2px solid var(--bc-accent);
			outline-offset: 4px;
		}
		:global(body.auxero-template-home-05-html .footer .form-footer) {
			display: none;
		}

		:global(body.auxero-template-home-05-html .footer .logo) {
			width: 220px;
			height: auto;
			filter: brightness(0) invert(1);
		}
		:global(#main-content > .eliqauto-featured-vehicles),
		:global(#main-content > .eliqauto-browse-section),
		:global(#main-content > .eliqauto-home-compare),
		:global(#main-content > .eliqauto-home-reviews),
		:global(#main-content > .eliqauto-news-section) {
			padding-block: 32px;
		}

		:global(#main-content .eliqauto-newest-heading),
		:global(#main-content .eliqauto-section-banner),
		:global(#main-content .eliqauto-home-compare__header),
		:global(#main-content .eliqauto-reviews-banner),
		:global(#main-content .eliqauto-news-banner) {
			min-height: 48px;
			padding: 0;
			margin-bottom: 24px;
			gap: 24px;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
		}

		:global(
			#main-content
				:is(
					.eliqauto-newest-heading,
					.eliqauto-section-banner,
					.eliqauto-home-compare__header,
					.eliqauto-reviews-banner,
					.eliqauto-news-banner
				)
				h2
		),
		:global(
			#main-content
				:is(
					.eliqauto-newest-heading,
					.eliqauto-section-banner,
					.eliqauto-home-compare__header,
					.eliqauto-reviews-banner,
					.eliqauto-news-banner
				)
				h2
				span
		) {
			color: #18181b;
		}
	}

	@media (max-width: 767px) {
		:global(#main-content) {
			background: #ffffff;
			display: flex;
			flex-direction: column;
		}

		:global(#main-content > *) {
			order: 90;
		}

		:global(#main-content > .eliqauto-mobile-home) {
			order: 10;
		}

		:global(#main-content > .eliqauto-mobile-home-quick) {
			order: 20;
		}

		:global(#main-content > .eliqauto-featured-vehicles) {
			order: 30;
		}

		:global(#main-content > .eliqauto-browse-section) {
			order: 40;
		}

		:global(#main-content > .eliqauto-action-band) {
			order: 50;
		}

		:global(body.auxero-template-home-05-html #main-content *),
		:global(body.auxero-template-home-05-html #main-content .wow),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .eliqauto-mobile-call),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .eliqauto-mobile-map),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .eliqauto-mobile-call::before
		),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .eliqauto-mobile-map::before
		) {
			animation: none;
			animation-delay: 0s;
			transition: none;
		}

		:global(body.auxero-template-home-05-html #main-content .wow) {
			opacity: 1;
			transform: none;
			visibility: visible;
		}
	}
</style>
