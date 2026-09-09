<script lang="ts">
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import type { InventoryGridDefinition } from '$lib/types/inventory';
	import type { InventoryTemplatePage } from '$lib/types/template-page';
	// Three layers reproduce the former app.css + template-head + component cascade,
	// re-rooted onto `.inventory-template-shell`: base (Auxero card/control bases) ->
	// layout (sidebar + grid widths) -> template-head (the DayNight grid overrides that
	// used to win over app.css). Loaded in that order so ties resolve as before.
	import './inventory-desktop-base.css';
	import './inventory-desktop-layout.css';
	import './inventory-desktop-template-head.css';
	import InventoryFilterTriggers from './InventoryFilterTriggers.svelte';
	import InventoryShortcutShelf from './InventoryShortcutShelf.svelte';
	import InventoryFilterDialog from './InventoryFilterDialog.svelte';
	import InventoryListingsPanel from './InventoryListingsPanel.svelte';
	import SearchBar from './SearchBar.svelte';
	import CompareTray from '$lib/components/shared/CompareTray.svelte';

	type InventoryLayoutMode = 'grid' | 'sidebar';
	type InventoryFilterUxMode = 'popover' | 'modal';

	let {
		page,
		layoutMode = 'grid',
		filterUxMode = 'popover',
		inventoryViewportClass,
		activeGridIndex,
		grid,
		onSidebarChange
	}: {
		page: InventoryTemplatePage;
		layoutMode?: InventoryLayoutMode;
		filterUxMode?: InventoryFilterUxMode;
		inventoryViewportClass: string;
		activeGridIndex: number;
		grid: InventoryGridDefinition;
		onSidebarChange: () => void;
	} = $props();
	let filterDialog: InventoryFilterDialog;
	let filterOpen = $state(false);
</script>

{#snippet inventoryFilters()}
	<div class="inventory-banner-filters">
		<InventoryFilterTriggers
			filters={page.quickFilters}
			onOpen={(name) => filterDialog.open(name)}
		/>
		<InventoryShortcutShelf />
	</div>
{/snippet}

<div id="wrapper" class="inventory-template-shell">
	<SiteChrome onSearch={() => filterDialog.open('', true)} searchExpanded={filterOpen} />

	<main id="main-content" tabindex="-1" class="inventory-refined pb-[100px]">
		<div class="inventory-hero" data-daynight-inventory-layout="grid">
			<DesktopYellowRouteHero
				headingId="daynight-inventory-title"
				title="Автомобили по обяви"
				panel="light"
				rail={inventoryFilters}
			>
				<SearchBar
					layoutMode="grid"
					searchId="daynight-inventory-hero-search"
					onOpen={() => filterDialog.open('', true)}
				/>
			</DesktopYellowRouteHero>
		</div>
		<div
			class={inventoryViewportClass}
			data-daynight-inventory-layout={layoutMode}
			data-daynight-filter-ux={filterUxMode}
		>
			{#if layoutMode === 'sidebar'}
				<InventoryFilterTriggers
					filters={page.quickFilters}
					sidebar
					onOpen={(name) => filterDialog.open(name)}
				/>
			{/if}
			<InventoryListingsPanel {layoutMode} {activeGridIndex} {grid} {onSidebarChange} />
		</div>
		<InventoryFilterDialog
			bind:this={filterDialog}
			bind:isOpen={filterOpen}
			filters={page.quickFilters}
			vehicles={page.vehicles}
		/>
	</main>

	<div class="inventory-template-mobile-hidden">
		<DayNightFooter />
	</div>
</div>

<CompareTray />

<div class="inventory-template-mobile-hidden">
	<DesktopHomeTrailingChrome />
</div>

<style>
	.inventory-template-shell .inventory-refined {
		background: var(--discovery-canvas) !important;
	}
	:global(
		.inventory-template-shell
			.inventory-refined
			.daynight-inventory-viewport
			[data-daynight-grid-panel].active
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__title
			> a
	) {
		font: inherit !important;
		display: -webkit-box !important;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		white-space: normal !important;
	}
	:global(
		.inventory-template-shell
			.inventory-refined
			.daynight-inventory-viewport
			[data-daynight-grid-panel].active
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__title
	) {
		font: 650 17px/1.3 var(--sa-font) !important;
		min-height: 45px !important;
		max-height: 45px !important;
		white-space: normal !important;
	}
	.inventory-banner-filters {
		background: var(--discovery-panel);
		border-radius: 12px;
	}
	:global(.inventory-refined .inventory-hero .daynight-yellow-route-hero__content) {
		padding-top: 26px;
		padding-bottom: 12px;
	}
	:global(.inventory-refined .inventory-hero .daynight-yellow-route-hero__deck) {
		margin-top: 16px !important;
	}
	:global(.inventory-refined .inventory-hero .daynight-yellow-route-hero__rail) {
		margin-bottom: 14px !important;
	}
	:global(
		.inventory-refined .daynight-inventory-viewport--grid [data-daynight-grid-panel].active > .grid
	) {
		gap: 20px !important;
	}
	:global(
		.inventory-template-shell
			.inventory-refined
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.image
	) {
		aspect-ratio: 1.5 / 1;
	}
	:global(.inventory-refined [data-daynight-vehicle-card] .content) {
		justify-content: flex-start !important;
		gap: 0 !important;
	}
	:global(.inventory-refined [data-daynight-vehicle-card] .tag.style2) {
		min-height: 22px !important;
	}
	@media (min-width: 1440px) {
		:global(
			.inventory-template-shell
				.inventory-refined
				.daynight-inventory-viewport--grid
				[data-daynight-grid-panel='3'].active
				> .grid
		) {
			grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
		}
	}
	@media (min-width: 992px) and (max-width: 1439px) {
		:global(
			.inventory-template-shell
				.inventory-refined
				.daynight-inventory-viewport--grid
				[data-daynight-grid-panel='3'].active
				> .grid
		) {
			grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
		}
	}

	.inventory-hero {
		width: 100%;
	}
	:global(.inventory-refined .inventory-hero .daynight-yellow-route-hero) {
		min-height: 0;
		padding-bottom: 8px;
	}
	:global(.inventory-refined .inventory-hero .daynight-yellow-route-hero__rail) {
		max-width: 1320px;
		margin-inline: auto;
		width: calc(100% - 64px);
	}
	:global(.inventory-refined .inventory-hero .daynight-yellow-route-hero__deck) {
		background: var(--discovery-panel) !important;
		padding: 14px 18px !important;
		max-width: 640px;
		border-radius: 12px;
	}
	:global(.inventory-refined .inventory-hero .daynight-inventory-searchbar__label) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	:global(.inventory-refined .inventory-hero .daynight-inventory-search) {
		min-height: 0 !important;
		height: var(--discovery-search-height) !important;
		display: flex !important;
		align-items: center !important;
		gap: 4px;
		background: #fff !important;
		border: 1px solid var(--discovery-control-border) !important;
		border-radius: var(--discovery-control-radius) !important;
		padding: 4px !important;
	}
	:global(.inventory-refined .inventory-hero .daynight-inventory-search__input) {
		min-height: 0 !important;
		position: static !important;
		flex: 1;
		min-width: 0;
		width: 100% !important;
		height: var(--discovery-search-action-size) !important;
		border: 0 !important;
		border-radius: 8px !important;
		background: #fff !important;
		padding: 0 9px !important;
		font: 400 16px/1.4 var(--sa-font) !important;
		color: #171b1e !important;
	}
	:global(.inventory-refined .inventory-hero .daynight-inventory-search__input::placeholder),
	:global(.inventory-refined .inventory-hero .daynight-inventory-search__trigger:not(.has-query)) {
		color: var(--discovery-muted) !important;
		opacity: 1;
	}
	:global(.inventory-refined .inventory-hero .daynight-inventory-searchbar__submit) {
		min-height: 0 !important;
		position: static !important;
		flex: 0 0 auto;
		width: var(--discovery-search-action-size) !important;
		min-width: var(--discovery-search-action-size);
		height: var(--discovery-search-action-size) !important;
		padding: 0 !important;
		background: var(--discovery-action) !important;
		border-radius: 5px !important;
		color: #fff !important;
		font: 600 16px/1.2 var(--sa-font) !important;
		transform: none !important;
	}
	:global(
		.inventory-refined .inventory-hero .daynight-inventory-searchbar__submit :is(span, svg, svg *)
	) {
		color: inherit !important;
	}
	:global(.inventory-refined .inventory-hero .daynight-inventory-searchbar__submit:hover) {
		background: var(--discovery-action-hover) !important;
	}
	:global(
		.inventory-template-shell
			.inventory-refined
			.inventory-hero
			.daynight-inventory-search
			.daynight-inventory-search__input:focus-visible
	) {
		outline: none !important;
		box-shadow: none !important;
	}
	:global(.inventory-refined .inventory-hero .daynight-inventory-search:focus-within) {
		border-color: var(--discovery-action) !important;
		box-shadow: none !important;
		outline: 2px solid var(--discovery-action);
		outline-offset: 2px;
	}
	:global(.inventory-refined .inventory-hero .daynight-inventory-searchbar__submit:focus-visible) {
		outline: 2px solid var(--discovery-action) !important;
		outline-offset: 3px;
	}
	:global(.inventory-refined .daynight-inventory-viewport) {
		width: calc(100% - 64px) !important;
		max-width: 1760px !important;
		margin: 0 auto !important;
		padding: 16px 0 0 !important;
		border: 0 !important;
	}
	:global(.inventory-refined .daynight-inventory-viewport--sidebar) {
		grid-template-columns: 260px minmax(0, 1fr) !important;
		grid-template-areas: none !important;
		grid-template-rows: auto !important;
		align-items: start;
		gap: 28px !important;
	}
	:global(.inventory-refined .daynight-inventory-listings-shell) {
		display: block !important;
		width: 100% !important;
		max-width: none !important;
		padding: 0 !important;
		margin: 0 !important;
		min-width: 0;
	}
	:global(.inventory-refined [data-daynight-vehicle-card] .content) {
		padding: 12px !important;
	}
	:global(
		.inventory-refined .card-box.card-box-style-1[data-daynight-vehicle-card] .card-box__title
	) {
		font: 650 18px/1.35 var(--sa-font) !important;
		letter-spacing: -0.25px !important;
		min-height: 0 !important;
		max-height: 49px !important;
		white-space: normal !important;
		margin: 0 0 6px !important;
	}
	:global(
		.inventory-refined .card-box.card-box-style-1[data-daynight-vehicle-card] .card-box__title > a
	) {
		display: -webkit-box !important;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		white-space: normal !important;
	}
	:global(
		.inventory-template-shell
			.inventory-refined
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__price
			.daynight-card-price__value
	) {
		font: 750 28px/1.15 var(--sa-font) !important;
		letter-spacing: -0.65px !important;
		color: #171b1e !important;
	}
	:global(
		.inventory-template-shell
			.inventory-refined
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__price
			.daynight-card-price__monthly
	) {
		font: 400 13px/1.4 var(--sa-font) !important;
		color: #68717a !important;
	}
	:global(.inventory-refined [data-daynight-vehicle-card] .tag.style2) {
		gap: 10px !important;
		flex-wrap: wrap !important;
		margin-bottom: 8px !important;
	}
	:global(.inventory-refined [data-daynight-vehicle-card] .tag.style2 li) {
		background: transparent !important;
		border: 0 !important;
		padding: 0 !important;
		height: 22px !important;
	}
	:global(.inventory-refined [data-daynight-vehicle-card] .tag.style2 li span) {
		font: 400 13px/1.4 var(--sa-font) !important;
		color: #59636c !important;
	}
	:global(.inventory-refined [data-daynight-vehicle-card]) {
		border-color: var(--discovery-control-border) !important;
		box-shadow: none !important;
		border-radius: 11px !important;
	}
</style>
