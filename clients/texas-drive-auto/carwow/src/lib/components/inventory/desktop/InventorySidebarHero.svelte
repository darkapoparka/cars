<script lang="ts">
	import SearchBar from './SearchBar.svelte';

	type InventoryLayoutMode = 'grid' | 'sidebar';

	let {
		layoutMode = 'grid',
		vehicleCount
	}: { layoutMode?: InventoryLayoutMode; vehicleCount: number } = $props();
</script>

{#if layoutMode === 'sidebar'}
	<div class="daynight-inventory-sidebar-hero">
		<div class="daynight-inventory-sidebar-hero__copy">
			<h1>Vehicle inventory</h1>
			<p>{vehicleCount} vehicles</p>
		</div>
		<SearchBar {layoutMode} searchId="daynight-inventory-sidebar-search" />
	</div>
{/if}

<style>
	.daynight-inventory-sidebar-hero__copy {
		color: #101828;
		display: grid;
		gap: 4px;
		min-width: 0;
	}

	.daynight-inventory-sidebar-hero__copy h1 {
		color: #667085;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.25;
		margin: 0;
	}

	.daynight-inventory-sidebar-hero__copy p {
		color: #101828;
		font-size: 30px;
		font-weight: var(--sa-weight-semibold);
		letter-spacing: 0;
		line-height: 1.12;
		margin: 0;
	}

	@media (max-width: 767px) {
		.daynight-inventory-sidebar-hero__copy p {
			font-size: 23px;
		}
	}
</style>
