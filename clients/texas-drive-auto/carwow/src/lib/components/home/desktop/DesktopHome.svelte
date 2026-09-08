<script lang="ts">
	import type { HomeBrandStripItem } from '$lib/data/home-brand-strip';
	import type { HomeDesktopData } from '$lib/types/home';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import DesktopHomeBrandStrip from './DesktopHomeBrandStrip.svelte';
	import DesktopHomeFooter from './DesktopHomeFooter.svelte';
	import DesktopHomeHero from './DesktopHomeHero.svelte';
	import DesktopHomeInventoryPreview from './DesktopHomeInventoryPreview.svelte';
	import DesktopHomeReviews from './DesktopHomeReviews.svelte';
	import DesktopHomeVehicleCategories from './DesktopHomeVehicleCategories.svelte';
	import DesktopHomeWhyDayNight from './DesktopHomeWhyDayNight.svelte';
	import DesktopHomeVideos from './DesktopHomeVideos.svelte';

	let { brandStrip, data }: { brandStrip: HomeBrandStripItem[]; data: HomeDesktopData } = $props();
</script>

<div class="daynight-home-shell daynight-home-shell--original">
	<div id="wrapper">
		<SiteChrome />
		<main id="main-content" tabindex="-1">
			<DesktopHomeHero vehicles={data.vehicles} variant="cutouts" />
			<DesktopHomeInventoryPreview
				vehicles={data.vehicles}
				showHeaderCta={false}
				showHeaderSubtitle={false}
			/>
			<DesktopHomeReviews showReviews={false} balancedActionCards />
			<DesktopHomeVehicleCategories title="Choose a vehicle type" ctaLabel="All types" />
			<DesktopHomeBrandStrip
				brands={brandStrip.slice(0, 12)}
				title="Choose a make"
				ctaLabel="All makes"
			/>
			<DesktopHomeWhyDayNight showMetrics={false} variant="campaign-grid" />
			<DesktopHomeVideos />
			<DesktopHomeReviews
				showActionCards={false}
				showHeaderCta={true}
				showBelowCta={false}
				ctaLabel="Reviews unavailable in preview"
			/>
		</main>
		<DesktopHomeFooter />
	</div>
</div>

<style>
	@media (min-width: 992px) {
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__stage
				> form
		) {
			max-width: 640px !important;
			width: 100% !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--reviews-with-banner
		) {
			padding-top: 0 !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--reviews-with-banner
				.daynight-home-section-panel--reviews
		) {
			padding-top: 48px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-section--why) {
			background: #f5f6f7 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why) {
			background: transparent !important;
			border: 0 !important;
			border-radius: 0 !important;
			box-shadow: none !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-section--why) {
			padding-bottom: 48px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why) {
			margin-bottom: 0 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner) {
			min-height: 0 !important;
			padding: 36px 0 8px !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner__inner
		) {
			align-items: center !important;
			display: flex !important;
			flex-direction: column !important;
			gap: 0 !important;
			justify-content: center !important;
			min-height: 0 !important;
			text-align: center !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner__copy
		) {
			align-items: center !important;
			display: flex;
			flex-direction: column;
			text-align: center !important;
			width: 100%;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section-banner__copy::before
		) {
			display: none !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner__copy h2
		) {
			font-size: clamp(28px, 2.35vw, 36px) !important;
			line-height: 1.05 !important;
			text-align: center !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner__cta
		) {
			display: none !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-inventory--centered
				.daynight-home-inventory__heading-inner
		) {
			align-items: center !important;
			display: flex !important;
			flex-direction: column !important;
			gap: 0 !important;
			justify-content: center !important;
			min-height: 0 !important;
			text-align: center !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-inventory--centered
				.daynight-home-inventory__heading-copy
		) {
			text-align: center !important;
			width: 100%;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-inventory--centered
				.daynight-home-inventory__title
		) {
			align-items: center !important;
			text-align: center !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-inventory--centered
				.daynight-home-inventory__header-actions
		) {
			display: none !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-heading--reviews
		) {
			align-items: center !important;
			display: flex !important;
			flex-direction: column !important;
			gap: 14px !important;
			justify-content: center !important;
			margin-bottom: 28px !important;
			text-align: center !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section-heading--reviews
				h2
		) {
			text-align: center !important;
		}
	}

	@media (min-width: 992px) {
		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-hero__filters) {
			-webkit-backdrop-filter: none !important;
			backdrop-filter: none !important;
			background: rgba(8, 10, 12, 0.94) !important;
			border-color: rgba(255, 255, 255, 0.16) !important;
			box-shadow: none !important;
		}
	}

	/* The canonical home uses the repository's clean automotive artwork as the
		section identity. Keep copy in the artwork's dark negative space instead
		of layering a flat color split and a second logo over the image. */
	@media (min-width: 992px) {
		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner) {
			background: transparent !important;
			background-image: none !important;
			border: 0 !important;
			box-sizing: border-box !important;
			box-shadow: none !important;
			min-height: 0 !important;
			overflow: visible !important;
			padding: 36px 0 8px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-hero::before) {
			background:
				linear-gradient(
					90deg,
					rgba(2, 5, 8, 0.04) 0%,
					rgba(2, 5, 8, 0.38) 38%,
					rgba(2, 5, 8, 0.38) 62%,
					rgba(2, 5, 8, 0.04) 100%
				),
				linear-gradient(
					180deg,
					rgba(2, 5, 8, 0.34) 0%,
					rgba(2, 5, 8, 0.08) 44%,
					rgba(2, 5, 8, 0.34) 72%,
					rgba(2, 5, 8, 0.78) 100%
				) !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-hero__photo) {
			filter: brightness(0.98) contrast(1.06) saturate(0.82) !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-inventory__heading
		) {
			background: var(--discovery-canvas) !important;
			background-image: none !important;
			border: 0 !important;
			box-shadow: none !important;
			margin: 0 !important;
			min-height: 0 !important;
			overflow: visible !important;
			padding: 36px 0 20px !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-brand-section
				.daynight-home-section-banner
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section-banner--vehicle-types
		),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner--reviews
		) {
			background: transparent !important;
			background-image: none !important;
			box-shadow: none !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-inventory__heading::before
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-inventory__heading::after
		) {
			content: none !important;
			display: none !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-inventory__heading-inner
		) {
			align-items: center !important;
			display: flex !important;
			flex-direction: column !important;
			gap: 0 !important;
			justify-content: center !important;
			min-height: 0 !important;
			padding: 0 24px !important;
			text-align: center !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner__inner
		) {
			align-items: center !important;
			display: flex !important;
			flex-direction: column !important;
			gap: 0 !important;
			justify-content: center !important;
			min-height: 0 !important;
			padding: 0 24px !important;
			text-align: center !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-inventory__heading-copy
		),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner__copy
		) {
			align-items: center !important;
			display: flex !important;
			justify-content: center !important;
			max-width: 100% !important;
			min-width: 0 !important;
			text-align: center !important;
			width: 100% !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-inventory__title
		) {
			align-items: center !important;
			text-align: center !important;
			width: 100% !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-inventory__title h2
		),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-heading h2
		),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner__copy h2
		) {
			color: #111827 !important;
			font-size: var(--sa-text-desktop-section-title) !important;
			font-weight: 700 !important;
			letter-spacing: -0.025em !important;
			line-height: 1.1 !important;
			margin: 0 !important;
			text-align: center !important;
			text-shadow: none !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-inventory) {
			padding-bottom: 40px !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section--actions
		) {
			background: #fff !important;
			padding-bottom: 36px !important;
			padding-top: 8px !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-brand-section--strip
		) {
			background: #f4f6fa !important;
			overflow: visible !important;
			padding-bottom: 32px !important;
			padding-top: 28px !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-inventory__pills
		) {
			display: flex !important;
			flex-wrap: wrap !important;
			justify-content: center !important;
			margin: 0 0 22px !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section-banner__copy::before
		) {
			content: none !important;
			display: none !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section-banner__cta
		) {
			align-items: center !important;
			background: #c91620 !important;
			border: 1px solid #c91620 !important;
			border-radius: 8px !important;
			box-sizing: border-box !important;
			color: #fff !important;
			display: inline-flex !important;
			font-size: 15px !important;
			font-weight: 700 !important;
			justify-content: center !important;
			line-height: 1.2 !important;
			min-height: 42px !important;
			padding: 0 18px !important;
			text-align: center !important;
			text-decoration: none !important;
			transition:
				background-color 0.14s ease,
				border-color 0.14s ease,
				transform 0.14s ease !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-inventory__header-actions
		) {
			display: none !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section-banner__cta:hover
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section-banner__cta:focus-visible
		) {
			background: #e21b2d !important;
			border-color: #e21b2d !important;
			color: #fff !important;
			transform: translateY(-1px);
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-browse-cta__link),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-reviews__browse-cta-link
		),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-inventory__footer-cta
		) {
			align-items: center !important;
			background: #111827 !important;
			border: 1px solid #111827 !important;
			border-radius: 8px !important;
			box-shadow: none !important;
			color: #fff !important;
			display: inline-flex !important;
			font-size: 16px !important;
			font-weight: 700 !important;
			justify-content: center !important;
			min-height: 44px !important;
			padding: 0 20px !important;
			text-decoration: none !important;
			transition:
				background-color 0.14s ease,
				border-color 0.14s ease,
				color 0.14s ease !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-browse-cta__link:hover
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-reviews__browse-cta-link:hover
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-inventory__footer-cta:hover
		),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-browse-cta__link:active
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-reviews__browse-cta-link:active
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-inventory__footer-cta:active
		) {
			background: #c91620 !important;
			border-color: #c91620 !important;
			color: #fff !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-browse-cta__link:focus-visible
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-reviews__browse-cta-link:focus-visible
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-inventory__footer-cta:focus-visible
		) {
			outline: 3px solid rgba(201, 22, 32, 0.36) !important;
			outline-offset: 3px !important;
		}
	}

	@media (min-width: 992px) {
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero.daynight-home-hero--cutouts
		),
		:global(body.daynight-home-page .daynight-home-hero.daynight-home-hero--cutouts) {
			background: var(--sa-yellow) !important;
			background-image: none !important;
			filter: none !important;
			height: auto !important;
			isolation: isolate;
			margin-top: 0 !important;
			min-height: 410px !important;
			overflow: visible !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts:has(.filter-select-dropdown__toggle:checked)
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts:has(.filter-select-dropdown.active)
		) {
			overflow: visible !important;
			z-index: 12;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts::before),
		:global(body.daynight-home-page .daynight-home-hero--cutouts::after),
		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__visual) {
			background: none !important;
			content: none !important;
			display: none !important;
			filter: none !important;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__car) {
			bottom: 0 !important;
			display: block !important;
			filter: none !important;
			height: auto !important;
			left: auto;
			max-height: calc(100% - 16px) !important;
			max-width: min(34vw, 500px) !important;
			object-fit: contain;
			object-position: bottom center;
			pointer-events: none;
			position: absolute;
			top: auto !important;
			transform: none !important;
			user-select: none;
			width: auto !important;
			z-index: 1;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__car--left) {
			left: 0 !important;
			object-position: left bottom;
			right: auto !important;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__car--right) {
			left: auto !important;
			object-position: right bottom;
			right: 0 !important;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__stage) {
			align-items: center;
			display: flex;
			flex-direction: column;
			height: auto;
			justify-content: flex-start;
			margin: 0 auto;
			max-width: 1180px;
			padding: 18px 24px 24px;
			position: relative;
			width: min(1180px, calc(100% - 48px));
			z-index: 3;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__title) {
			background: transparent !important;
			color: var(--sa-ink) !important;
			font-size: clamp(46px, 4.6vw, 72px) !important;
			font-weight: 800 !important;
			letter-spacing: -0.055em !important;
			line-height: 0.96 !important;
			margin: 0 0 24px !important;
			max-width: 900px !important;
			padding: 0 !important;
			text-align: center !important;
			text-shadow: none !important;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__filters),
		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__filters--box),
		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__filters--stacked
		) {
			-webkit-backdrop-filter: none !important;
			align-items: stretch !important;
			backdrop-filter: none !important;
			background: #202124 !important;
			background-image: none !important;
			border: 0 !important;
			border-radius: 14px !important;
			box-shadow: none !important;
			column-gap: 0 !important;
			display: flex !important;
			flex-direction: column !important;
			gap: 12px !important;
			grid-template-columns: none !important;
			margin: 0 auto !important;
			max-width: 720px !important;
			padding: 16px !important;
			row-gap: 12px !important;
			width: 100% !important;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__intent-tabs) {
			align-items: center;
			display: flex;
			gap: 24px;
			height: 28px;
			padding: 0 4px;
		}

		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__intent-tabs a
		) {
			align-items: center;
			color: #b7bac1;
			display: inline-flex;
			font-size: 14px;
			font-weight: 700;
			height: 28px;
			position: relative;
			text-decoration: none;
		}

		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__intent-tabs a:hover
		),
		:global(
			body.daynight-home-page
				.daynight-home-hero--cutouts
				.daynight-home-hero__intent-tabs
				a:focus-visible
		),
		:global(
			body.daynight-home-page
				.daynight-home-hero--cutouts
				.daynight-home-hero__intent-tabs
				a.is-active
		) {
			color: #fff;
		}

		:global(
			body.daynight-home-page
				.daynight-home-hero--cutouts
				.daynight-home-hero__intent-tabs
				a.is-active::after
		) {
			background: #c91620;
			bottom: -2px;
			content: '';
			height: 2px;
			left: 0;
			position: absolute;
			right: 0;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__search-row) {
			display: grid;
			gap: 8px;
			grid-template-columns: minmax(0, 1fr) 52px;
			width: 100%;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__filter-row) {
			display: grid;
			gap: 8px;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			width: 100%;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__field) {
			background: #303238 !important;
			border: 1px solid transparent !important;
			border-radius: 10px !important;
			box-shadow: none !important;
			height: 40px !important;
			min-height: 40px !important;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__field:hover),
		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__field:focus-within
		) {
			background: #3a3d43 !important;
			border-color: transparent !important;
			box-shadow: none !important;
		}

		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__field--query
		) {
			align-items: center;
			display: flex;
			gap: 10px;
			height: 52px !important;
			min-height: 52px !important;
			background: #fff !important;
			padding: 0 16px;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__query-icon) {
			color: #6b7280;
			display: none;
			flex: none;
			place-items: center;
		}

		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__query-icon svg
		) {
			display: block;
			fill: currentColor;
			height: 20px;
			stroke: none;
			width: 20px;
		}

		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__select.bg-white
		) {
			background: transparent !important;
			min-height: 40px !important;
			padding: 0 !important;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__submit) {
			align-self: stretch !important;
			background: #c91620 !important;
			border-color: #c91620 !important;
			border-radius: 10px !important;
			box-shadow: none !important;
			flex-direction: row !important;
			font-size: 14px !important;
			font-weight: 700 !important;
			gap: 0 !important;
			grid-column: auto !important;
			height: 48px !important;
			min-height: 48px !important;
			padding: 0 14px !important;
			width: 100% !important;
		}

		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__submit--icon
		) {
			align-self: auto !important;
			border-radius: 50% !important;
			height: 52px !important;
			min-height: 52px !important;
			min-width: 52px !important;
			padding: 0 !important;
			width: 52px !important;
		}

		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__submit--icon span
		) {
			clip: rect(0 0 0 0);
			clip-path: inset(50%);
			height: 1px;
			overflow: hidden;
			position: absolute;
			white-space: nowrap;
			width: 1px;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__submit svg) {
			display: none !important;
		}

		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__submit--icon svg
		) {
			display: block !important;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__submit:hover),
		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__submit:focus-visible
		) {
			background: #e21b2d !important;
			border-color: #e21b2d !important;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .filter-select-dropdown__text) {
			align-items: center !important;
			color: #f3f4f6 !important;
			display: flex !important;
			font-size: 14px !important;
			font-weight: 600 !important;
			height: 40px !important;
			padding: 0 30px 0 12px !important;
		}

		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .filter-select-dropdown__text::after
		) {
			filter: brightness(0) invert(1);
			right: 12px !important;
		}

		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__query) {
			background: transparent;
			border: 0;
			color: #111827;
			font-size: 16px;
			font-weight: 600;
			height: 50px;
			min-width: 0;
			outline: none;
			padding: 0;
			width: 100%;
		}

		:global(
			body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__query::placeholder
		) {
			color: #6b7280;
			font-weight: 500;
		}
	}

	@media (min-width: 1200px) {
		:global(body.daynight-home-page .daynight-home-hero--cutouts .daynight-home-hero__buy-rail) {
			display: none !important;
			height: 0 !important;
		}
	}

	@media (min-width: 992px) {
		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-brand-section),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section--vehicle-types
		),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-section--reviews
		) {
			background: #f4f6fa !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--reviews-with-banner
				.daynight-home-section-panel--reviews
		) {
			padding-top: 8px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why) {
			background: transparent !important;
			background-image: none !important;
			border: 0 !important;
			border-radius: 0 !important;
			box-shadow: none !important;
			gap: 48px !important;
			margin-bottom: 0 !important;
			padding: 0 !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-why__media::before
		) {
			display: none !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__media img) {
			border-radius: 16px !important;
			filter: none !important;
			height: auto !important;
			object-fit: cover !important;
			width: 100% !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__title) {
			color: #111827 !important;
			font-size: clamp(26px, 2.1vw, 32px) !important;
			letter-spacing: -0.025em !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__copy) {
			color: #4b5563 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__reason) {
			color: #111827 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__reason img) {
			background: #fee2e2 !important;
			border: 0 !important;
			box-shadow: none !important;
			filter: none !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__cta) {
			background: #c91620 !important;
			border-color: #c91620 !important;
			box-shadow: none !important;
			color: #fff !important;
			font-size: 15px !important;
			height: 44px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__cta:hover),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-why__cta:focus-visible
		) {
			background: #e21b2d !important;
			border-color: #e21b2d !important;
			color: #fff !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--vehicle-types
				.daynight-home-section-banner__inner
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-brand-section
				.daynight-home-section-banner__inner
		) {
			align-items: center !important;
			flex-direction: row !important;
			justify-content: space-between !important;
			text-align: left !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--vehicle-types
				.daynight-home-section-banner__copy
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-brand-section
				.daynight-home-section-banner__copy
		) {
			align-items: flex-start !important;
			justify-content: flex-start !important;
			text-align: left !important;
			width: auto !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--vehicle-types
				.daynight-home-section-banner__copy
				h2
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-brand-section
				.daynight-home-section-banner__copy
				h2
		) {
			text-align: left !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--vehicle-types
				.daynight-home-section-banner__cta
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-brand-section
				.daynight-home-section-banner__cta
		) {
			align-items: center !important;
			background: #fff !important;
			border: 1px solid #d7dee7 !important;
			border-radius: 10px !important;
			box-shadow: none !important;
			box-sizing: border-box !important;
			color: #111827 !important;
			display: inline-flex !important;
			justify-content: center !important;
			min-height: 40px !important;
			padding: 0 15px !important;
			transform: none !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--vehicle-types
				.daynight-home-section-banner__cta::after
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-brand-section
				.daynight-home-section-banner__cta::after
		) {
			content: '→';
			margin-left: 8px;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--vehicle-types
				.daynight-home-section-banner__cta:hover
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--vehicle-types
				.daynight-home-section-banner__cta:focus-visible
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-brand-section
				.daynight-home-section-banner__cta:hover
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-brand-section
				.daynight-home-section-banner__cta:focus-visible
		) {
			background: #fff !important;
			border-color: #c91620 !important;
			color: #c91620 !important;
			transform: none !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-section--vehicle-types
				.daynight-home-section-banner__cta:focus-visible
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-brand-section
				.daynight-home-section-banner__cta:focus-visible
		) {
			outline: 2px solid #c91620 !important;
			outline-offset: 2px !important;
		}
	}

	/* The shared desktop bundle loads after component CSS. Keep the homepage hero contract authoritative. */
	@media (min-width: 992px) {
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__stage
		) {
			max-width: 1280px !important;
			padding-top: 36px !important;
			width: min(1280px, calc(100% - 48px)) !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__title
		) {
			font-size: var(--sa-text-desktop-hero-title) !important;
			font-weight: 800 !important;
			letter-spacing: var(--sa-tracking-desktop-hero-title) !important;
			line-height: var(--sa-leading-desktop-hero-title) !important;
			max-width: 1180px !important;
			text-wrap: balance;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__filters
		) {
			background: #202124 !important;
			border-radius: 14px !important;
			gap: 12px !important;
			max-width: 720px !important;
			padding: 16px !important;
			row-gap: 12px !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__filter-row
		) {
			grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__field
		) {
			background: #303238 !important;
			height: 40px !important;
			min-height: 40px !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__field:hover
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__field:focus-within
		) {
			background: #3a3d43 !important;
			border-color: transparent !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__field--query
		) {
			background: #fff !important;
			height: 52px !important;
			min-height: 52px !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__query-icon
		) {
			display: none !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__select.bg-white
		) {
			min-height: 40px !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.filter-select-dropdown__text
		) {
			color: #f3f4f6 !important;
			height: 40px !important;
			padding: 0 30px 0 12px !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.filter-select-dropdown__text
				span
		) {
			color: #f3f4f6 !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.filter-select-dropdown__text::after
		) {
			filter: brightness(0) invert(1) !important;
			right: 12px !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__submit--icon
		) {
			border-radius: 50% !important;
			height: 52px !important;
			min-height: 52px !important;
			min-width: 52px !important;
			padding: 0 !important;
			width: 52px !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--original
				.daynight-home-hero--cutouts
				.daynight-home-hero__submit--icon
				svg
		) {
			display: block !important;
		}
	}

	@media (min-width: 992px) {
		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-section--why) {
			background: #f5f6f7 !important;
			padding: 40px 0 44px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why) {
			background: #071747 !important;
			border: 0 !important;
			border-radius: 16px !important;
			box-shadow: none !important;
			display: block !important;
			min-height: 300px !important;
			overflow: hidden !important;
			padding: 0 !important;
			position: relative !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__media) {
			height: 100% !important;
			inset: 0 !important;
			position: absolute !important;
			width: 100% !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-why__media::before
		) {
			display: none !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__media img) {
			border-radius: 0 !important;
			display: block !important;
			filter: none !important;
			height: 100% !important;
			object-fit: cover !important;
			object-position: right center !important;
			width: 100% !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__content) {
			display: flex !important;
			flex-direction: column !important;
			justify-content: center !important;
			min-height: 300px !important;
			padding: 36px 0 36px 44px !important;
			position: relative !important;
			width: 44% !important;
			z-index: 2 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__title) {
			color: #fff !important;
			font-size: clamp(28px, 2.15vw, 34px) !important;
			letter-spacing: -0.03em !important;
			line-height: 1.08 !important;
			margin: 0 0 8px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__copy) {
			color: #d6dae1 !important;
			font-size: 16px !important;
			line-height: 1.55 !important;
			margin: 0 0 20px !important;
			max-width: 400px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__list) {
			margin: 0 0 24px !important;
			padding: 0 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__reason) {
			color: #fff !important;
			font-size: 15px !important;
			font-weight: 600 !important;
			gap: 10px !important;
			line-height: 1.35 !important;
			margin-bottom: 7px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__reason img) {
			background: transparent !important;
			border: 0 !important;
			box-shadow: none !important;
			filter: none !important;
			height: 18px !important;
			padding: 0 !important;
			width: 18px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__cta) {
			align-self: flex-start !important;
			background: #fff !important;
			border: 0 !important;
			border-radius: 8px !important;
			box-shadow: none !important;
			color: #111827 !important;
			font-size: 15px !important;
			font-weight: 750 !important;
			gap: 8px !important;
			height: 44px !important;
			padding: 0 18px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__cta span),
		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__cta svg) {
			color: #111827 !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-why__cta svg path
		) {
			stroke: currentColor !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-why__cta:hover),
		:global(
			body.daynight-home-page .daynight-home-shell--original .daynight-home-why__cta:focus-visible
		) {
			background: #f3f4f6 !important;
			color: #111827 !important;
		}
	}
</style>
