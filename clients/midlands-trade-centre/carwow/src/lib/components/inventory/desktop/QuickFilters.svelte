<script lang="ts">
	import type { InventoryQuickFilterGroup } from '$lib/types/inventory';
	import DropdownFilterControls from './DropdownFilterControls.svelte';
	import InventoryResultsQuickFilters from './InventoryResultsQuickFilters.svelte';
	import InventoryTypePills from './InventoryTypePills.svelte';

	let {
		filters,
		layoutMode = 'grid',
		filterUxMode = 'popover',
		onSidebarChange
	}: {
		filters: InventoryQuickFilterGroup[];
		layoutMode?: 'grid' | 'sidebar';
		filterUxMode?: 'popover' | 'modal';
		onSidebarChange?: () => void;
	} = $props();
</script>

<div
	class="col-md-12 daynight-inventory-controls daynight-inventory-controls--{layoutMode} daynight-inventory-controls--{filterUxMode}"
>
	<form
		class="daynight-inventory-quick-form daynight-inventory-quick-form--{filterUxMode}"
		data-daynight-inventory-filter
		data-daynight-filter-ux-form={filterUxMode}
		aria-label={filterUxMode === 'modal'
			? 'Модални филтри'
			: layoutMode === 'sidebar'
				? 'Sidebar филтри'
				: 'Quick filters'}
	>
		{#if layoutMode === 'grid'}
			<InventoryResultsQuickFilters {filters} />
		{:else}
			<DropdownFilterControls {filters} {layoutMode} {filterUxMode} {onSidebarChange} />
			<InventoryTypePills />
		{/if}
	</form>
</div>

<style>
	.daynight-inventory-quick-form {
		position: relative;
		z-index: 2;
	}

	.daynight-inventory-controls--grid {
		margin-inline: auto;
		max-width: 1320px;
	}
</style>
