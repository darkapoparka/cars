<script lang="ts">
	import DesktopHomeTrailingChrome from '$lib/components/home/desktop/DesktopHomeTrailingChrome.svelte';
	import SiteChrome from '$lib/components/layout/SiteChrome.svelte';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';
	import DayNightFooter from '$lib/components/layout/DayNightFooter.svelte';
	import type { InventoryGridDefinition } from '$lib/types/inventory';
	import type { InventoryPageData } from '$lib/types/storefront-page';
	// One inventory-family stylesheet owns the retained base/layout/native cascade.
	import './inventory-desktop.css';
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
		page: InventoryPageData;
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

{#snippet inventoryControls()}
	<div class="inventory-hero-controls">
		<div class="inventory-hero-controls__search">
			<SearchBar
				layoutMode="grid"
				searchId="daynight-inventory-hero-search"
				onOpen={() => filterDialog.open('', true)}
			/>
		</div>
		<div class="inventory-banner-filters">
			<InventoryFilterTriggers
				filters={page.quickFilters}
				onOpen={(name) => filterDialog.open(name)}
			/>
			<InventoryShortcutShelf />
		</div>
	</div>
{/snippet}

<div id="wrapper" class="inventory-template-shell">
	<SiteChrome onSearch={() => filterDialog.open('', true)} searchExpanded={filterOpen} />

	<main id="main-content" tabindex="-1" class="inventory-refined pb-[100px]">
		<div class="inventory-hero" data-daynight-inventory-layout="grid">
			<DesktopYellowRouteHero
				headingId="daynight-inventory-title"
				title="Налични автомобили"
				panel="light"
				deckWidth="full"
				children={inventoryControls}
			/>
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
	.inventory-hero-controls {
		display: grid;
		gap: 12px;
	}

	.inventory-hero-controls__search {
		width: min(100%, 760px);
		margin-inline: auto;
	}

	.inventory-banner-filters {
		background: transparent;
		border-radius: 0;
	}

	.inventory-hero {
		width: 100%;
	}
</style>
