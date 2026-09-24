<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import Search from '@lucide/svelte/icons/search';
	import type { AuxeroInventoryDesktopData } from '$lib/server/inventory-options';
	import type { InventoryMobileData } from '$lib/server/inventory-options-mobile';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	import type { InventoryCopy, Locale } from '$lib/i18n/messages';
	import { linkHref } from '$lib/utils/links';
	import InventoryMobilePage from './InventoryMobilePage.svelte';
	import InventoryToolbar from './InventoryToolbar.svelte';
	import VehicleCard from './VehicleCard.svelte';
	import Action from '$lib/components/common/Action.svelte';
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
</script>

<main id="main-content">
	<div class="site-desktop-only">
		<section class="inventory-hero">
			<div class="site-container inventory-hero__layout">
				<img
					class="inventory-hero__car"
					src={assetHref('/assets/daynight/megamenu/inventory-audi-a7-cutout.webp')}
					alt=""
					width="420"
					height="220"
				/>
				<div class="inventory-hero__content">
					<h1>{desktop.title}</h1>
					<form action={linkHref('/inventory')} role="search">
						{#each [...page.url.searchParams].filter(([name]) => !['q', 'query', 'model'].includes(name)) as [name, value], i (i)}<input
								type="hidden"
								{name}
								{value}
							/>{/each}
						<Search size={20} aria-hidden="true" /><label class="sr-only" for="inventory-search"
							>{desktop.searchLabel}</label
						><input
							id="inventory-search"
							type="search"
							name="q"
							value={desktop.searchValue}
							placeholder={desktop.searchPlaceholder}
						/><Action type="submit" size="primary"
							>{english ? 'Search' : 'Търси'} ({desktop.resultCount})</Action
						>
					</form>
				</div>
				<img
					class="inventory-hero__car"
					src={assetHref('/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp')}
					alt=""
					width="420"
					height="220"
				/>
			</div>
		</section>
		<InventoryToolbar {desktop} {english} />
		<section class="inventory-results site-section">
			<div class="site-container">
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
	.inventory-hero__layout {
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr) 220px;
		align-items: center;
		gap: var(--bc-space-6);
	}
	.inventory-hero__car {
		display: block;
		width: 100%;
		height: 140px;
		object-fit: contain;
	}
	.inventory-hero__content {
		min-width: 0;
	}
	@media (max-width: 1199px) {
		.inventory-hero__layout {
			grid-template-columns: minmax(0, 1fr);
		}
		.inventory-hero__car {
			display: none;
		}
	}
	.inventory-hero {
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
		padding-block: var(--bc-space-8);
	}
	h1 {
		margin: 0 0 var(--bc-space-5);
		font: var(--bc-weight-heading) clamp(2rem, 3vw, 2.5rem)/1.2 var(--bc-font-heading);
		text-align: center;
	}
	.inventory-hero form {
		display: flex;
		align-items: center;
		gap: var(--bc-space-3);
		background: var(--bc-white);
		color: var(--bc-muted);
		border-radius: var(--bc-radius-control);
		max-width: 740px;
		margin: auto;
		padding: var(--bc-space-1) var(--bc-space-1) var(--bc-space-1) var(--bc-space-4);
	}
	.inventory-hero input[type='search'] {
		flex: 1;
		min-width: 0;
		min-height: var(--bc-control-height-standard);
		border: 0;
		background: transparent;
		color: var(--bc-ink);
		font-size: var(--bc-text-search-trigger);
		line-height: var(--bc-leading-search);
	}
	.inventory-hero input[type='search']::placeholder {
		color: var(--bc-copy);
		opacity: 1;
	}
	.inventory-hero form:focus-within {
		outline: 2px solid var(--bc-white);
		outline-offset: var(--bc-space-1);
	}
	.inventory-hero input[type='search']:focus-visible {
		outline: none !important;
		box-shadow: none !important;
	}
	.inventory-results {
		background: var(--bc-surface);
		padding-top: var(--bc-space-6);
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
	}
	@media (min-width: 768px) and (max-width: 991px) {
		.inventory-grid[data-view] {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
