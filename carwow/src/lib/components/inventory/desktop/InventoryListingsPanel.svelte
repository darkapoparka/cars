<script lang="ts">
	import type { InventoryGridDefinition } from '$lib/types/inventory';
	import { getDesktopInventoryContext } from './desktop-inventory-context.svelte';
	import InventoryEmptyState from './InventoryEmptyState.svelte';
	import SortingToolbar from './SortingToolbar.svelte';
	import VehicleGrid from './VehicleGrid.svelte';

	type InventoryLayoutMode = 'grid' | 'sidebar';

	let {
		layoutMode = 'grid',
		activeGridIndex,
		grid,
		onSidebarChange
	}: {
		layoutMode?: InventoryLayoutMode;
		activeGridIndex: number;
		grid: InventoryGridDefinition;
		onSidebarChange: () => void;
	} = $props();

	const filters = getDesktopInventoryContext();
	let listView = $state(false);
	const panelClass = $derived(
		`${grid.contentInnerClass.replace(/\s*\bactive\b/g, '').trim()} active`
	);
	const shellClass = $derived(
		`flat-tabs container mb-[40px] daynight-inventory-listings-shell daynight-inventory-listings-shell--${layoutMode}`
	);
</script>

<div
	class={shellClass}
	class:inventory-list-view={listView}
	data-custom="true"
	data-daynight-layout-panel={layoutMode}
>
	<SortingToolbar
		{layoutMode}
		{listView}
		onViewChange={(value) => {
			listView = value;
		}}
		{onSidebarChange}
	/>
	<InventoryEmptyState isEmpty={filters.resultCount === 0} />
	<div class="content-tab">
		<div class={panelClass} data-daynight-grid-panel={activeGridIndex}>
			<VehicleGrid
				vehicles={filters.sorted}
				gridClass={listView ? 'inventory-list-grid' : grid.gridClass}
			/>
		</div>
	</div>
</div>

<style>
	:global(.inventory-refined .inventory-list-grid) {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 20px;
	}
	:global(
		.inventory-template-shell
			.inventory-refined
			.inventory-list-view
			.card-box.card-box-style-1[data-daynight-vehicle-card]
	) {
		display: grid !important;
		grid-template-columns: 300px minmax(0, 1fr);
	}
	:global(
		.inventory-template-shell
			.inventory-refined
			.inventory-list-view
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.image
	) {
		grid-column: 1;
		height: 220px !important;
		aspect-ratio: auto !important;
		border-radius: 10px 0 0 10px !important;
	}
	:global(
		.inventory-template-shell
			.inventory-refined
			.inventory-list-view
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.content
	) {
		grid-column: 2;
		padding: 24px !important;
		justify-content: center;
	}
	:global(.inventory-refined .inventory-list-view [data-daynight-vehicle-card] .top) {
		width: 280px !important;
	}
	:global(.inventory-refined .inventory-list-view [data-daynight-vehicle-card] .bottom) {
		display: none !important;
	}
	:global(.inventory-refined .inventory-list-view [data-daynight-vehicle-card] .card-box__title) {
		min-height: auto !important;
		margin-bottom: 16px !important;
	}
</style>
