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
		HomeFiveVehicleCardData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import HomeFiveActionBand from './HomeFiveActionBand.svelte';
	import HomeFiveBrowseSection from './HomeFiveBrowseSection.svelte';
	import HomeFiveFeaturedVehicles from './HomeFiveFeaturedVehicles.svelte';
	import HomeFiveHero from './HomeFiveHero.svelte';
	import HomeFiveNewsSection from './HomeFiveNewsSection.svelte';
	import HomeFiveReviewsSection from './HomeFiveReviewsSection.svelte';
	import YouTubeSection from '$lib/components/common/YouTubeSection.svelte';
	import { aboutVideos } from '$lib/data/about-videos';

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
		typeCards
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
	<HomeFiveHero {hero} />
	<HomeFiveFeaturedVehicles vehicles={featuredVehicles} {copy} compactDesktop />
	<HomeFiveActionBand {copy} variant="ownership" />
	<HomeFiveBrowseSection {brandCards} {typeCards} {copy} />
	<HomeFiveActionBand {copy} />
	<YouTubeSection
		videos={aboutVideos}
		english={copy.actionBand.importTitle === 'Import From Europe'}
	/>
	<HomeFiveReviewsSection {reviews} {copy} />
	<HomeFiveNewsSection posts={newsPosts} {copy} />
</AuxeroPublicShell>

<style>
	/* Desktop homepage composition; mobile retains its existing explicit ordering. */
	@media (min-width: 768px) {
		:global(body.auxero-template-home-05-html #main-content > section > .container) {
			width: calc(100% - 64px);
			max-width: 1320px;
			padding-inline: 0;
			margin-inline: auto;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-featured-vehicles) {
			padding: 40px 0 48px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-newest-banner),
		:global(body.auxero-template-home-05-html #main-content .daynight-section-banner),
		:global(body.auxero-template-home-05-html #main-content .daynight-reviews-banner),
		:global(body.auxero-template-home-05-html #main-content .daynight-news-banner) {
			min-height: 48px;
			padding: 0;
			margin-bottom: 24px !important;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-newest-banner__inner) {
			min-height: 48px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-newest-heading h2),
		:global(body.auxero-template-home-05-html #main-content .daynight-section-banner h2),
		:global(body.auxero-template-home-05-html #main-content .daynight-reviews-banner h2),
		:global(body.auxero-template-home-05-html #main-content .daynight-news-banner h2) {
			color: var(--bc-ink, #1c1c1c);
			font-size: 30px !important;
			font-weight: 650 !important;
			line-height: 1.2 !important;
			letter-spacing: -0.025em;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-title-desktop) {
			color: inherit !important;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-section-cta) {
			height: 48px !important;
			min-height: 48px;
			padding-block: 0 !important;
			padding-inline: 18px !important;
			border: 1px solid var(--bc-border-strong, #c8cdd3) !important;
			border-radius: 8px;
			background: #ffffff !important;
			font-size: 16px !important;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-section-cta:hover) {
			background: var(--bc-surface) !important;
			border-color: var(--bc-ink, #1c1c1c) !important;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-section-cta:focus-visible) {
			outline: 2px solid var(--bc-accent);
			outline-offset: 3px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-home-vehicle-grid) {
			gap: 24px;
		}

		:global(body.auxero-template-home-05-html #main-content .card-box[data-daynight-slug] .image) {
			aspect-ratio: 1.6;
			height: auto;
		}

		:global(
			body.auxero-template-home-05-html #main-content .card-box[data-daynight-slug] .card--img
		) {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		:global(
			body.auxero-template-home-05-html #main-content .card-box[data-daynight-slug] .content
		) {
			display: flex;
			flex-direction: column;
			padding: 16px;
		}

		:global(body.auxero-template-home-05-html #main-content .card-box__title) {
			min-height: 70px;
			font-size: 17px;
			line-height: 24px;
			margin-bottom: 12px;
		}

		:global(body.auxero-template-home-05-html #main-content .card-box__title a) {
			font-size: inherit !important;
			line-height: inherit !important;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-title-full) {
			display: none;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-title-split) {
			display: block;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-model) {
			display: block;
			font-size: 19px !important;
			font-weight: 650 !important;
			line-height: 26px !important;
			color: #1c1c1c;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-trim) {
			display: block;
			margin-top: 4px;
			font-size: 14px !important;
			font-weight: 400 !important;
			line-height: 20px !important;
			color: #535b65;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-specs) {
			order: 1;
			min-height: 30px;
			margin-bottom: 16px !important;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-specs li) {
			padding: 4px 7px;
			font-size: 12px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-price) {
			order: 2;
			margin-top: auto;
			margin-bottom: 16px !important;
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-price__amount) {
			font-size: 24px !important;
			line-height: 32px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-price__finance) {
			flex-direction: row;
			align-items: baseline;
			justify-content: space-between;
			width: 100%;
			gap: 8px;
			text-align: left;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-price__monthly) {
			font-size: 14px !important;
			line-height: 20px;
			color: #535b65;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-price__finance-link) {
			font-size: 13px !important;
			line-height: 20px;
		}

		:global(body.auxero-template-home-05-html #main-content .card-box .divider) {
			display: none;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-card-actions) {
			order: 3;
			margin-top: 0;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-action-band) {
			padding: 0 0 16px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-action-band--ownership) {
			padding: 0 0 16px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-action-card) {
			min-height: 220px;
			padding: 24px 28px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-action-card__title) {
			font-size: 28px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-action-card__body) {
			font-size: 16px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-action-card__cta) {
			min-height: 44px;
			height: 44px;
			min-width: 0;
			margin-top: 8px;
			font-size: 16px;
		}

		:global(body.auxero-template-home-05-html #main-content .daynight-browse-section),
		:global(body.auxero-template-home-05-html #main-content .daynight-home-reviews),
		:global(body.auxero-template-home-05-html #main-content .daynight-news-section) {
			padding-block: 32px;
		}

		/* Match the 32px + 32px gap between the other content sections. */
		:global(body.auxero-template-home-05-html #main-content .daynight-type-gallery) {
			margin-top: 64px;
			padding-top: 0;
			border-top: 0;
		}
	}

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

		:global(#main-content > .daynight-youtube) {
			order: 60;
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
