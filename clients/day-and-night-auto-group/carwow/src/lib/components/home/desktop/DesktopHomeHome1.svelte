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

	let { brandStrip, data }: { brandStrip: HomeBrandStripItem[]; data: HomeDesktopData } = $props();
</script>

<div class="daynight-home-shell daynight-home-shell--home1">
	<div id="wrapper">
		<SiteChrome />
		<main id="main-content" tabindex="-1">
			<DesktopHomeHero vehicles={data.vehicles} />
			<DesktopHomeInventoryPreview vehicles={data.vehicles} />
			<DesktopHomeBrandStrip
				brands={brandStrip.slice(0, 12)}
				title="Избери марка"
				ctaLabel="Всички марки"
			/>
			<DesktopHomeVehicleCategories title="Тип каросерия" ctaLabel="Всички типове" />
			<DesktopHomeWhyDayNight showMetrics={false} />
			<DesktopHomeReviews />
		</main>
		<DesktopHomeFooter />
	</div>
</div>

<style>
	/* /home1 keeps the strong hero and inventory campaign band, then uses one
		quiet browse surface. Space and card contrast separate groups; rules do not. */
	@media (min-width: 992px) {
		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-home-brand-section),
		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-home-section--vehicle-types
		) {
			background: #f4f6fa !important;
			padding-bottom: 48px !important;
			padding-top: 0 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-home-section-banner) {
			background: transparent !important;
			background-image: none !important;
			border: 0 !important;
			box-shadow: none !important;
			color: #111827 !important;
			margin: 0 !important;
			min-height: 0 !important;
			padding: 28px 0 18px !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-home-section-banner__inner
		) {
			min-height: 0 !important;
			padding: 0 !important;
			width: min(calc(100% - 30px), 1440px) !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-home-section-banner__copy h2
		) {
			color: #111827 !important;
			font-size: var(--sa-type-page) !important;
			font-weight: var(--sa-weight-heading) !important;
			letter-spacing: -0.02em !important;
			line-height: 1.15 !important;
			text-shadow: none !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-home-section-banner__cta
		) {
			background: transparent !important;
			border: 0 !important;
			border-radius: 0 !important;
			box-shadow: none !important;
			color: #c91620 !important;
			font-size: var(--sa-button-font-size) !important;
			font-weight: var(--sa-button-font-weight) !important;
			min-height: 36px !important;
			padding: 0 !important;
			text-decoration: none !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-home-section-banner__cta:hover
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--home1
				.daynight-home-section-banner__cta:focus-visible
		) {
			background: transparent !important;
			border-color: #9f1118 !important;
			color: #9f1118 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-home-section-content) {
			padding-bottom: 0 !important;
			padding-top: 0 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-brand-grid__items) {
			gap: 14px !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-brand-grid .daynight-brand-card
		) {
			background: #fff !important;
			border: 1px solid #e2e8f0 !important;
			border-radius: 14px !important;
			height: 142px !important;
			min-height: 142px !important;
			padding: 14px 12px !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--home1
				.daynight-brand-grid
				.daynight-brand-card:hover
		),
		:global(
			body.daynight-home-page
				.daynight-home-shell--home1
				.daynight-brand-grid
				.daynight-brand-card:focus-visible
		) {
			background: #fff !important;
			border-color: #c91620 !important;
			box-shadow: none !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--home1
				.daynight-brand-grid
				.daynight-brand-card__name
		) {
			font-size: var(--sa-text-control) !important;
			font-weight: var(--sa-weight-semibold) !important;
		}

		:global(
			body.daynight-home-page
				.daynight-home-shell--home1
				.daynight-brand-grid
				.daynight-brand-card__count
		) {
			color: #64748b !important;
			font-size: var(--sa-text-caption) !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-vehicle-types__grid) {
			gap: 16px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-vehicle-type-card) {
			background: #fff !important;
			border: 1px solid #e2e8f0 !important;
			border-radius: 16px !important;
			box-sizing: border-box;
			margin-top: 0 !important;
			min-height: 228px !important;
			padding: 14px 0 18px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-vehicle-type-card:hover),
		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-vehicle-type-card:focus-within
		) {
			background: #fff !important;
			border-color: #c91620 !important;
			box-shadow: none !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-vehicle-type-card__image
		) {
			height: 142px !important;
			padding-bottom: 12px !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-vehicle-type-card__content
		) {
			margin-top: 0 !important;
			padding: 0 20px !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-vehicle-type-card__title
		) {
			font-size: var(--sa-text-xl) !important;
			font-weight: var(--sa-weight-heading) !important;
			line-height: 1.25 !important;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-vehicle-type-card__count
		) {
			color: #64748b !important;
			font-size: var(--sa-text-caption) !important;
			line-height: 1.35 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-home-metrics) {
			gap: 48px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-home-section--why) {
			padding-bottom: 48px !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-home-why) {
			margin-bottom: 0 !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-home-metric) {
			padding: 0 12px;
		}

		:global(
			body.daynight-home-page .daynight-home-shell--home1 .daynight-home-metric--divided::after
		) {
			display: none !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-home-metric__number),
		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-home-metric__value) {
			text-shadow: none !important;
		}

		:global(body.daynight-home-page .daynight-home-shell--home1 .daynight-home-metric__label) {
			color: #d1d5db !important;
			font-size: var(--sa-text-base) !important;
		}
	}
</style>
