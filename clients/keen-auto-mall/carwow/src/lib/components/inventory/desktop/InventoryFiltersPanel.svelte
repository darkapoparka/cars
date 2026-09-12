<script lang="ts">
	import type { InventoryQuickFilterGroup } from '$lib/types/inventory';
	import QuickFilters from './QuickFilters.svelte';

	type InventoryLayoutMode = 'grid' | 'sidebar';
	type InventoryFilterUxMode = 'popover' | 'modal';

	let {
		filters,
		layoutMode = 'grid',
		filterUxMode = 'popover',
		onSidebarChange
	}: {
		filters: InventoryQuickFilterGroup[];
		layoutMode?: InventoryLayoutMode;
		filterUxMode?: InventoryFilterUxMode;
		onSidebarChange: () => void;
	} = $props();
</script>

<div class="daynight-inventory-filter-region">
	{#if layoutMode === 'sidebar'}
		<div class="daynight-inventory-sidebar-panel-head">
			<span>Filters</span>
		</div>
	{/if}
	<div class="daynight-inventory-band">
		<div class="flat-tabs daynight-inventory-controls-shell container">
			<div class="row">
				<QuickFilters {filters} {layoutMode} {filterUxMode} {onSidebarChange} />
			</div>
		</div>
	</div>
</div>
