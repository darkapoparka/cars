<script lang="ts">
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import type { AuxeroInventoryDesktopData } from '$lib/server/inventory-options';
	import type { InventoryMobileData } from '$lib/server/inventory-options-mobile';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	import type { InventoryCopy, Locale } from '$lib/i18n/messages';
	import { linkHref } from '$lib/utils/links';
	import InventoryMobilePage from './InventoryMobilePage.svelte';
	import InventoryToolbar from './InventoryToolbar.svelte';
	import InventoryDisplayControls from './InventoryDisplayControls.svelte';
	import VehicleCard from './VehicleCard.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import SearchField from '$lib/components/common/SearchField.svelte';
	import InventorySidebar from './InventorySidebar.svelte';
	import { parseInventoryQuery, serializeInventoryQuery } from '$lib/domain/inventory-query';
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
	const searchState = $derived(parseInventoryQuery(page.url.searchParams));
	const searchHiddenInputs = $derived(
		[...serializeInventoryQuery(searchState, page.url.searchParams)].filter(
			([name]) => name !== 'keyword'
		)
	);
</script>

<main id="main-content">
	<div class="site-desktop-only">
		<PageIntro
			title={desktop.title}
			class="inventory-hero"
			compact
			vehicleArtwork
			align="center"
			desktopDescription={desktop.subtitle}
		>
			{#snippet desktopActions()}
				<form action={linkHref('/inventory')} role="search">
					{#each searchHiddenInputs as [name, value] (name)}<input
							type="hidden"
							{name}
							{value}
						/>{/each}
					<SearchField
						name="keyword"
						value={searchState.filters.keyword ?? ''}
						label={desktop.searchLabel}
						placeholder={desktop.searchPlaceholder}
					>
						<Action type="submit" size="primary"
							>{english ? 'Search' : 'Търси'} ({desktop.resultCount})</Action
						>
					</SearchField>
				</form>
			{/snippet}
		</PageIntro>
		<InventoryToolbar {desktop} {english} />
		<section class="inventory-results site-section">
			<div
				class="site-container inventory-results__layout"
				id="inventory-results"
				class:inventory-results__layout--sidebar={desktop.layout === 'dashboard'}
			>
				{#if desktop.layout === 'dashboard'}<InventorySidebar {desktop} {english} />{/if}
				<div class="inventory-results__content">
					<header class="inventory-results__heading">
						<div class="inventory-results__summary">
							<h2 class="site-heading">{english ? 'Cars for sale' : 'Автомобили за продажба'}</h2>
							<p role="status">{count} / {cards.length} {english ? 'cars' : 'автомобила'}</p>
						</div>
						<InventoryDisplayControls {desktop} {english} />
					</header>
					<div class="inventory-grid" data-view={desktop.view}>
						{#each visibleCards as card, index (card.slug)}<VehicleCard
								{card}
								{english}
								priority={index === 0}
							/>{:else}<div class="inventory-empty">
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
	form[role='search'] {
		width: 100%;
		max-width: var(--bc-desktop-discovery-width);
		margin-inline: auto;
	}
	.inventory-results__layout,
	.inventory-results__content {
		min-width: 0;
	}
	.inventory-results__layout--sidebar {
		display: grid;
		grid-template-columns: 280px minmax(0, 1fr);
		gap: var(--bc-space-6);
	}
	.inventory-results__heading {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
		margin-bottom: var(--bc-space-5);
	}
	.inventory-results__summary {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--bc-space-2) var(--bc-space-4);
	}
	.inventory-results__heading p {
		margin: 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body);
	}
	.inventory-results {
		background: var(--bc-bg);
		padding-top: var(--bc-space-2);
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
