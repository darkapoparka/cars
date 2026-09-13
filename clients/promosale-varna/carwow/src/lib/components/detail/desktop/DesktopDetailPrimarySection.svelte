<script lang="ts">
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import type { DetailFeatureTab } from '$lib/types/storefront-page';
	import DesktopDetailFeatureTabs from './DesktopDetailFeatureTabs.svelte';
	import DesktopDetailFinanceCalculator from './DesktopDetailFinanceCalculator.svelte';
	import DesktopDetailGallery from './DesktopDetailGallery.svelte';
	import DesktopDetailLocationMap from './DesktopDetailLocationMap.svelte';
	import DesktopDetailRelatedVehicles from './DesktopDetailRelatedVehicles.svelte';
	import DesktopDetailReviews from './DesktopDetailReviews.svelte';
	import DesktopDetailSidebar from './DesktopDetailSidebar.svelte';
	import DesktopDetailTitleBar from './DesktopDetailTitleBar.svelte';

	type Props = {
		vehicle: DayNightVehicle;
		// Feature-group data parsed server-side (not injected HTML); rendered natively
		// by DesktopDetailFeatureTabs.
		featureTabs: DetailFeatureTab[];
		similarVehicles: InventoryListVehicle[];
	};

	let { vehicle, featureTabs, similarVehicles }: Props = $props();
</script>

<section class="pdp-canvas pb-100">
	<div class="pdp-primary-gap"></div>
	<div class="container">
		<div class="listing-details">
			<div class="listing-details--content">
				<div class="pdp-card pdp-card--title">
					<DesktopDetailTitleBar {vehicle} />
				</div>
				<div class="pdp-card pdp-card--media">
					<DesktopDetailGallery {vehicle} />
				</div>
				<div class="pdp-card"><DesktopDetailFeatureTabs {vehicle} tabs={featureTabs} /></div>
				<div class="pdp-card"><DesktopDetailFinanceCalculator {vehicle} /></div>
				<div class="pdp-card"><DesktopDetailLocationMap /></div>
				<div class="pdp-card"><DesktopDetailReviews /></div>
			</div>
			<DesktopDetailSidebar {vehicle} />
		</div>
	</div>
</section>

<DesktopDetailRelatedVehicles vehicles={similarVehicles} />

<style>
	/* Off-white canvas matching the home surfaces. */
	.pdp-canvas {
		background: #f4f6fa;
	}

	.pdp-primary-gap {
		height: 18px;
	}

	/* Each PDP module is its own white card on the canvas — left content modules and the
	   right sidebar widgets — same fill/border/shadow language as the home cards. */
	.pdp-card,
	.pdp-canvas :global(.listing-details--sidebar-box) {
		background: #fff;
		border: 1px solid #eaedf2;
		border-radius: 16px;
		box-shadow: 0 2px 14px rgba(16, 24, 40, 0.06);
	}

	.pdp-card {
		padding: 24px;
		margin-bottom: 24px;
	}

	.pdp-card--title {
		padding: 22px 24px;
	}

	/* Media card hugs the photo: thin frame, corners concentric with the image's 16px. */
	.pdp-card--media {
		padding: 8px;
		border-radius: 24px;
	}

	.pdp-card--media :global(.swiper-listing-details-thumbs) {
		padding-bottom: 0;
	}

	/* The calculator ships with its own box chrome; flatten it inside the card. */
	.pdp-card :global(.financing-calculator) {
		background: transparent;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		padding: 0;
	}

	/* Drop trailing utility margins so each card's bottom padding stays even. */
	.pdp-card > :global(:last-child) {
		margin-bottom: 0;
	}
</style>
