<script lang="ts">
	import { page } from '$app/state';
	import { inventoryDesktopControlsCopy } from '$lib/content/inventory-desktop-controls';
	import { replaceState } from '$app/navigation';
	import type {
		AuxeroInventoryDesktopData,
		AuxeroInventoryFilter
	} from '$lib/server/inventory-options';
	import type { InventoryMobileData } from '$lib/server/inventory-options-mobile';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	import type { InventoryCopy, Locale } from '$lib/i18n/messages';
	import InventoryMobilePage from './InventoryMobilePage.svelte';
	import InventoryToolbar from './InventoryToolbar.svelte';
	import InventoryTypeShortcuts from './InventoryTypeShortcuts.svelte';
	import InventorySearch from './InventorySearch.svelte';
	import InventoryDisplayControls from './InventoryDisplayControls.svelte';
	import InventoryFiltersDialog from './InventoryFiltersDialog.svelte';
	import VehicleCard from './VehicleCard.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import DesktopDiscoveryPanel from '$lib/components/common/DesktopDiscoveryPanel.svelte';
	import InventorySidebar from './InventorySidebar.svelte';
	let {
		cards,
		desktop,
		mobile,
		copy,
		locale
	}: {
		cards: AuxeroInventoryVehicleCard[];
		desktop: AuxeroInventoryDesktopData;
		mobile: InventoryMobileData;
		copy: InventoryCopy;
		locale: Locale;
	} = $props();
	const key = $derived(cards.map((card) => card.slug).join('|'));
	const count = $derived(
		Math.min(
			cards.length,
			page.state.daynightInventoryProgress?.cardSetKey === key
				? Math.max(12, page.state.daynightInventoryProgress.count)
				: 12
		)
	);
	const visibleCards = $derived(cards.slice(0, count));
	const showMore = () =>
		replaceState('', {
			...page.state,
			daynightInventoryProgress: { cardSetKey: key, count: Math.min(cards.length, count + 12) }
		});
	const english = $derived(locale === 'en');
	const controlsCopy = $derived(inventoryDesktopControlsCopy[locale]);
	let allOpen = $state(false);
	let activeFilter = $state<AuxeroInventoryFilter | null>(null);
	let dialog = $state<InventoryFiltersDialog>();
	const openFilters = (filter?: AuxeroInventoryFilter) => dialog?.openFilters(filter);
	const typeFilter = $derived(desktop.filters.find((filter) => filter.name === 'bodyType'));
</script>

<main id="main-content">
	<div class="site-desktop-only">
		<PageIntro
			title={desktop.title}
			class="inventory-hero"
			vehicleArtwork
			desktopDescription={desktop.subtitle}
		>
			{#snippet desktopActions()}
				<DesktopDiscoveryPanel class="inventory-discovery">
					{#snippet header()}
						{#if typeFilter}<InventoryTypeShortcuts filter={typeFilter} {english} />{/if}
					{/snippet}
					<InventorySearch {english} />
					<InventoryToolbar {desktop} {english} {allOpen} {activeFilter} onopen={openFilters} />
				</DesktopDiscoveryPanel>
			{/snippet}
		</PageIntro>
		<InventoryFiltersDialog bind:this={dialog} {desktop} {english} bind:allOpen bind:activeFilter />
		<section
			class="inventory-results site-section"
			aria-label={english ? 'Cars for sale' : 'Автомобили за продажба'}
		>
			<div class="inventory-results__controls">
				<div class="site-container inventory-results__overview">
					<p role="status">
						<strong>{desktop.resultCount}</strong>
						{controlsCopy.vehicleNoun(desktop.resultCount)}
					</p>
					<InventoryDisplayControls {desktop} {english} />
				</div>
			</div>
			<div
				class="site-container inventory-results__layout"
				id="inventory-results"
				class:inventory-results__layout--sidebar={desktop.layout === 'dashboard'}
			>
				{#if desktop.layout === 'dashboard'}<InventorySidebar {desktop} {english} />{/if}
				<div class="inventory-results__content">
					<div class="inventory-grid" data-view={desktop.view}>
						{#each visibleCards as card, index (card.slug)}<VehicleCard
								{card}
								{english}
								priority={index === 0}
							/>{:else}<div class="inventory-empty site-empty-state">
								<h2>{copy.emptyTitle}</h2>
								<p>{copy.emptyBody}</p>
								<Action href="/inventory" variant="secondary">{copy.reset}</Action>
							</div>{/each}
					</div>
					{#if desktop.map}<aside class="inventory-map">
							<h2>{desktop.map.title}</h2>
							<p>{desktop.map.address}</p>
							<Action href={desktop.map.ctaHref} variant="secondary">{desktop.map.ctaLabel}</Action>
						</aside>{/if}
				</div>
			</div>
		</section>
	</div>
	<div class="site-mobile-only">
		<InventoryMobilePage cards={visibleCards} {mobile} {copy} embedded />
	</div>
	{#if count < cards.length}<div class="inventory-more">
			<Action variant="secondary" onclick={showMore}
				>{english ? 'Show more cars' : 'Покажи още автомобили'}
				<span>{count} / {cards.length}</span></Action
			>
		</div>{/if}
	<p class="sr-only" role="status">{desktop.showingText}</p>
</main>

<style>
	.inventory-results__layout,
	.inventory-results__content {
		min-width: 0;
	}
	.inventory-results__layout--sidebar {
		display: grid;
		grid-template-columns: 280px minmax(0, 1fr);
		gap: var(--bc-space-6);
	}
	.inventory-results {
		background: var(--bc-bg);
		padding-top: var(--bc-space-3);
	}
	.inventory-results__controls {
		position: sticky;
		top: 0;
		z-index: 80;
		background: var(--bc-bg);
		padding-block: var(--bc-space-3);
		margin-bottom: var(--bc-space-2);
	}
	.inventory-results__overview {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
		gap: var(--bc-space-2) var(--bc-space-4);
	}
	.inventory-results__overview p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body);
	}
	.inventory-results__overview strong {
		color: var(--bc-ink);
		font-size: var(--bc-text-control);
		font-weight: var(--bc-weight-heading);
	}
	.inventory-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-5);
	}
	.inventory-grid[data-view='5'] {
		grid-template-columns: repeat(5, minmax(0, 1fr));
	}
	.inventory-grid[data-view='3'] {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.inventory-grid[data-view='map'] {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.inventory-results__layout--sidebar .inventory-grid[data-view] {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.inventory-empty {
		grid-column: 1/-1;
		padding: var(--bc-space-8);
		text-align: center;
	}
	.inventory-map {
		margin-top: var(--bc-space-6);
		padding: var(--bc-space-6);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-white);
	}
	.inventory-more {
		display: flex;
		justify-content: center;
		padding: var(--bc-space-6);
	}
	.inventory-more span {
		color: var(--bc-muted);
		font-size: var(--bc-text-label);
	}
	@media (min-width: 768px) {
		:global(.inventory-discovery) {
			--bc-desktop-discovery-panel-height: 0px;
		}
	}
	@media (min-width: 768px) and (max-width: 1199px) {
		.inventory-grid[data-view] {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.inventory-results__layout--sidebar .inventory-grid[data-view] {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 768px) and (max-width: 991px) {
		.inventory-results__layout--sidebar {
			grid-template-columns: minmax(0, 1fr);
		}
		.inventory-grid[data-view] {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
