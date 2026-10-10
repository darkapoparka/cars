<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import { onMount } from 'svelte';
	import Heart from '@lucide/svelte/icons/heart';
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import type { AuxeroVehicleDetailData } from '$lib/server/vehicle-detail';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { vehicleInformationCopy } from '$lib/content/vehicle-information';
	import { vehicleCardCopy } from '$lib/content/vehicle-card';
	import Action from '$lib/components/common/Action.svelte';
	import LeadForm from '$lib/components/common/LeadForm.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import FinanceEstimator from '$lib/components/financing/FinanceEstimator.svelte';
	import VehicleCard from '$lib/components/inventory/VehicleCard.svelte';
	import VehicleGallery from './VehicleGallery.svelte';
	import VehiclePurchasePanel from './VehiclePurchasePanel.svelte';
	import VehicleDealerBanner from './VehicleDealerBanner.svelte';
	import VehicleFacts from './VehicleFacts.svelte';
	import VehicleEquipment from './VehicleEquipment.svelte';
	import MobilePdp from './AuxeroVehicleMobilePdp.svelte';
	let {
		detail,
		price,
		related,
		english = false
	}: {
		detail: AuxeroVehicleDetailData;
		price: number;
		related: AuxeroInventoryVehicleCard[];
		english?: boolean;
	} = $props();
	const mobile = new MediaQuery('(max-width: 767.98px)', false);
	let hydrated = $state(false);
	onMount(() => {
		hydrated = true;
	});
	const garage = getGarageContext();
	const copy = $derived(vehicleInformationCopy[english ? 'en' : 'bg']);
	const cardCopy = $derived(vehicleCardCopy[english ? 'en' : 'bg']);
	const equipmentTabs = $derived(detail.featureTabs.filter((tab) => tab.items.length));
	let inquiryOpen = $state(false);
</script>

<main id="main-content" class="detail-main">
	<!-- CSS selects the correct server-rendered composition before JavaScript is ready.
	     Once hydrated, keep only the active composition and its interactive state. -->
	{#if !hydrated || mobile.current}
		<div class="detail-mobile"><MobilePdp {detail} /></div>
	{/if}
	{#if !hydrated || !mobile.current}
		<div class="site-container detail-page detail-desktop">
			<div class="detail-grid">
				<div class="detail-gallery-column site-stack">
					<header class="detail-heading">
						<h1>{detail.title}</h1>
						<div class="detail-utilities">
							<Action
								class="detail-utility"
								variant="secondary"
								size="compact"
								aria-label={cardCopy.save.trim()}
								title={cardCopy.save.trim()}
								aria-pressed={garage.isFavorite(detail.slug)}
								onclick={() => garage.toggleFavorite(detail.slug)}
							>
								<Heart
									size={18}
									aria-hidden="true"
									fill={garage.isFavorite(detail.slug) ? 'currentColor' : 'none'}
								/><span class="detail-utility-label">{cardCopy.save.trim()}</span>
							</Action>
							<Action
								class="detail-utility"
								variant="secondary"
								size="compact"
								aria-label={cardCopy.compare.trim()}
								title={cardCopy.compare.trim()}
								aria-pressed={garage.isCompared(detail.slug)}
								onclick={() => garage.toggleCompare(detail.slug)}
							>
								<ArrowLeftRight size={18} aria-hidden="true" /><span class="detail-utility-label"
									>{cardCopy.compare.trim()}</span
								>
							</Action>
						</div>
					</header>
					<VehicleGallery images={detail.galleryImages} title={detail.title} {english} />
				</div>
				<aside class="detail-summary site-stack" aria-label={copy.summary}>
					{#key detail.slug}<VehiclePurchasePanel
							{detail}
							{price}
							{english}
							oninquiry={() => (inquiryOpen = true)}
						/>{/key}
					<div id="vehicle-finance" tabindex="-1">
						{#key detail.slug}<FinanceEstimator
								layout="sidebar"
								banner="/assets/daynight/pdp/financing-banner.webp"
								initialPrice={price}
								{english}
								inquiryHref={'/contact?vehicle=' +
									detail.slug +
									'&service=financing' +
									(english ? '&lang=en' : '')}
							/>{/key}
					</div>
					{#if !equipmentTabs.length}<VehicleDealerBanner {english} />{/if}
				</aside>
				<div class="detail-content-column site-stack">
					<section class="site-panel detail-description-card">
						<h2>{copy.description}</h2>
						<p class="detail-description">{detail.description}</p>
					</section>
					<div class="detail-information">
						<VehicleFacts items={detail.overviewItems} {english} />
					</div>
				</div>
				{#if equipmentTabs.length}
					<div class="detail-equipment-column">
						{#key detail.slug}
							{#each equipmentTabs as tab (tab.label)}
								<VehicleEquipment title={tab.label} items={tab.items} {english} />
							{/each}
						{/key}
					</div>
					<div class="detail-dealer"><VehicleDealerBanner {english} /></div>
				{/if}
			</div>
			{#if related.length}
				<section class="site-section site-stack">
					<h2 class="site-heading detail-related-title">
						{copy.similar}
					</h2>
					<div class="detail-related">
						{#each related as card (card.slug)}<VehicleCard {card} {english} />{/each}
					</div>
				</section>
			{/if}
		</div>
	{/if}
</main>
<Modal bind:open={inquiryOpen} title={copy.inquiry} description={detail.title}>
	<LeadForm {english} source="vehicle-detail" vehicleSlug={detail.slug} />
</Modal>

<style>
	.detail-page {
		padding-top: var(--bc-space-5);
	}
	.detail-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(300px, 370px);
		align-items: start;
		gap: var(--bc-space-8);
		row-gap: var(--bc-space-6);
	}
	.detail-summary {
		grid-column: 2;
		grid-row: 1 / span 2;
	}
	.detail-content-column {
		grid-column: 1;
		grid-row: 2;
	}
	.detail-equipment-column {
		grid-column: 1;
		grid-row: 3;
		display: grid;
		align-self: stretch;
		gap: var(--bc-space-6);
	}
	.detail-dealer {
		grid-column: 2;
		grid-row: 3;
		display: grid;
		align-self: stretch;
	}
	.detail-dealer :global(.dealer-banner) {
		border-radius: var(--bc-desktop-card-radius);
	}
	.detail-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-6);
		padding: var(--bc-space-5) var(--bc-space-6);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
	}
	.detail-gallery-column {
		container: vehicle-gallery / inline-size;
	}
	h1 {
		min-width: 0;
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-text-h2)/1.12 var(--bc-font-heading);
		overflow-wrap: anywhere;
	}
	.detail-utilities {
		display: flex;
		flex-shrink: 0;
		gap: var(--bc-space-2);
	}
	.detail-utilities :global(.detail-utility[aria-pressed='true']) {
		background: var(--bc-control-active);
	}
	.detail-description-card {
		background: var(--bc-surface-raised);
		color: var(--bc-ink-soft);
	}
	.detail-description {
		margin: 0;
		white-space: pre-line;
		color: var(--bc-description-copy);
		font-size: var(--bc-text-prose);
		line-height: var(--bc-leading-prose);
		overflow-wrap: anywhere;
	}
	.detail-information {
		display: grid;
		gap: var(--bc-space-6);
	}
	.detail-related {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-5);
	}
	.detail-related-title {
		text-align: center;
	}
	#vehicle-finance {
		scroll-margin-top: var(--bc-space-6);
	}
	@container vehicle-gallery (max-width: 40rem) {
		.detail-heading {
			gap: var(--bc-space-2);
			padding: var(--bc-space-4);
		}
		.detail-utility-label {
			display: none;
		}
		.detail-utilities :global(.detail-utility) {
			width: var(--bc-control-height-primary);
			min-height: var(--bc-control-height-primary);
			padding: 0;
		}
	}
	@media (min-width: 768px) {
		.detail-heading {
			border-radius: var(--bc-desktop-card-radius);
			box-shadow: var(--bc-editorial-shadow);
		}
		h1 {
			font-family: var(--bc-font-body);
			font-size: var(--bc-desktop-section-title);
			line-height: var(--bc-leading-h4);
			text-wrap: pretty;
		}
		.detail-utilities :global(.detail-utility) {
			min-height: var(--bc-control-height-primary);
		}
		.detail-utilities :global(.detail-utility[aria-pressed='true']) {
			background: var(--bc-accent-tint);
			color: var(--bc-accent);
		}
		.detail-mobile {
			display: none;
		}
		.detail-main {
			background: var(--bc-surface);
		}
	}
	@media (min-width: 768px) and (max-width: 1023px) {
		.detail-grid {
			grid-template-columns: minmax(0, 1fr);
			gap: var(--bc-space-5);
		}
		.detail-summary {
			grid-column: 1;
			grid-row: auto;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-template-rows: auto 1fr;
			align-items: start;
		}
		#vehicle-finance {
			grid-column: 2;
			grid-row: 1 / span 2;
		}
		.detail-summary :global(.dealer-banner) {
			grid-column: 1;
			grid-row: 2;
		}
		.detail-content-column {
			grid-row: auto;
		}
		.detail-equipment-column,
		.detail-dealer {
			grid-column: 1;
			grid-row: auto;
		}
		.detail-related {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 767.98px) {
		.detail-desktop {
			display: none;
		}
		.detail-grid {
			grid-template-columns: 1fr;
		}
		.detail-related {
			grid-template-columns: 1fr;
		}
	}
</style>
