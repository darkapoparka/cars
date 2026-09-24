<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import Heart from '@lucide/svelte/icons/heart';
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import type { AuxeroVehicleDetailData } from '$lib/server/vehicle-detail';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { linkHref } from '$lib/utils/links';
	import Action from '$lib/components/common/Action.svelte';
	import LeadForm from '$lib/components/common/LeadForm.svelte';
	import Modal from '$lib/components/common/Modal.svelte';
	import FinanceEstimator from '$lib/components/financing/FinanceEstimator.svelte';
	import VehicleCard from '$lib/components/inventory/VehicleCard.svelte';
	import VehicleGallery from './VehicleGallery.svelte';
	import VehiclePurchasePanel from './VehiclePurchasePanel.svelte';
	import VehicleFacts from './VehicleFacts.svelte';
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
	const garage = getGarageContext();
	let inquiryOpen = $state(false);
	const localeSuffix = $derived(english ? '?lang=en' : '');
</script>

<main id="main-content" class="detail-main">
	{#if mobile.current}
		<MobilePdp {detail} />
	{:else}
		<div class="site-container detail-page">
			<nav class="detail-breadcrumb" aria-label={english ? 'Breadcrumb' : 'Навигация'}>
				<a href={linkHref('/inventory' + localeSuffix)}>{english ? 'Cars' : 'Автомобили'}</a>
				<span aria-hidden="true">/</span><span>{detail.title}</span>
			</nav>
			<div class="detail-grid">
				<div class="site-stack">
					<header class="detail-heading">
						<h1>{detail.title}</h1>
						<div class="detail-heading__meta">
							<p>
								{detail.overviewItems
									.slice(0, 4)
									.map((item) => item.value)
									.join(' · ')}
							</p>
							<div class="detail-utilities">
								<Action
									variant="quiet"
									size="compact"
									aria-pressed={garage.isFavorite(detail.slug)}
									onclick={() => garage.toggleFavorite(detail.slug)}
								>
									<Heart
										size={18}
										aria-hidden="true"
										fill={garage.isFavorite(detail.slug) ? 'currentColor' : 'none'}
									/>{english ? 'Save' : 'Запази'}
								</Action>
								<Action
									variant="quiet"
									size="compact"
									aria-pressed={garage.isCompared(detail.slug)}
									onclick={() => garage.toggleCompare(detail.slug)}
								>
									<ArrowLeftRight size={18} aria-hidden="true" />{english ? 'Compare' : 'Сравни'}
								</Action>
							</div>
						</div>
					</header>
					<VehicleGallery images={detail.galleryImages} title={detail.title} {english} />
					<section class="site-panel">
						<h2>{english ? 'Description' : 'Описание'}</h2>
						<p class="detail-description">{detail.description}</p>
					</section>
					{#each detail.featureTabs.filter((tab) => tab.items.length) as tab (tab.label)}
						<section class="site-panel">
							<h2>{tab.label}</h2>
							<ul class="detail-features">
								{#each tab.items as item, index (index)}<li>{item}</li>{/each}
							</ul>
						</section>
					{/each}
					<div id="vehicle-finance" tabindex="-1">
						<FinanceEstimator
							banner="/assets/daynight/pdp/financing-banner.webp"
							initialPrice={price}
							{english}
							inquiryHref={'/contact?vehicle=' +
								detail.slug +
								'&service=financing' +
								(english ? '&lang=en' : '')}
						/>
					</div>
				</div>
				<aside
					class="detail-summary site-stack"
					aria-label={english ? 'Price and vehicle details' : 'Цена и данни за автомобила'}
				>
					{#key detail.slug}<VehiclePurchasePanel
							{detail}
							{price}
							{english}
							oninquiry={() => (inquiryOpen = true)}
						/>{/key}
					<VehicleFacts items={detail.overviewItems} {english} />
				</aside>
			</div>
			{#if related.length}
				<section class="site-section site-stack">
					<h2 class="site-heading detail-related-title">
						{english ? 'Similar cars' : 'Подобни автомобили'}
					</h2>
					<div class="detail-related">
						{#each related as card (card.slug)}<VehicleCard {card} {english} />{/each}
					</div>
				</section>
			{/if}
		</div>
	{/if}
</main>
<Modal
	bind:open={inquiryOpen}
	title={english ? 'Enquire about this car' : 'Запитване за автомобила'}
	description={detail.title}
>
	<LeadForm {english} source="vehicle-detail" vehicleSlug={detail.slug} />
</Modal>

<style>
	.detail-page {
		padding-top: var(--bc-space-5);
	}
	.detail-breadcrumb {
		display: flex;
		gap: var(--bc-space-2);
		font-size: var(--bc-text-label);
		color: var(--bc-muted);
		margin-bottom: var(--bc-space-5);
	}
	.detail-breadcrumb > span:last-child {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.detail-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(300px, 370px);
		align-items: start;
		gap: var(--bc-space-8);
	}
	.detail-heading {
		display: grid;
		gap: var(--bc-space-3);
		padding: var(--bc-space-5) var(--bc-space-6);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
	}
	.detail-heading__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-2);
	}
	.detail-heading__meta p {
		margin: 0;
		color: var(--bc-muted);
		font-size: var(--bc-text-label);
	}
	h1 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-text-h2)/1.12 var(--bc-font-heading);
	}
	.detail-utilities {
		display: flex;
		gap: var(--bc-space-1);
	}
	.detail-description {
		margin: 0;
		white-space: pre-line;
		color: var(--bc-copy);
		font-size: var(--bc-text-prose);
		line-height: var(--bc-leading-prose);
		overflow-wrap: anywhere;
	}
	.detail-features {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-2) var(--bc-space-6);
		padding-left: var(--bc-space-5);
		margin: 0;
		font-size: var(--bc-text-prose);
		line-height: var(--bc-leading-body-lg);
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
	@media (min-width: 768px) {
		.detail-main {
			background: var(--bc-surface);
		}
	}
	@media (max-width: 1023px) {
		.detail-grid {
			grid-template-columns: minmax(0, 1fr) minmax(280px, 320px);
			gap: var(--bc-space-5);
		}
		.detail-related {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		h1 {
			font-size: var(--bc-text-h4);
		}
	}
	@media (max-width: 767.98px) {
		.detail-grid {
			grid-template-columns: 1fr;
		}
		.detail-related {
			grid-template-columns: 1fr;
		}
	}
</style>
