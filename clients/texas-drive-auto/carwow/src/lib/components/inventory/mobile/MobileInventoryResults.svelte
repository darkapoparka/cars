<script lang="ts">
	import { Car } from '@lucide/svelte';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import MobileInventoryVehicleCard from './MobileInventoryVehicleCard.svelte';

	let {
		vehicles,
		onClearFilters
	}: {
		vehicles: InventoryListVehicle[];
		onClearFilters: () => void;
	} = $props();
</script>

{#if vehicles.length}
	<div class="mobile-inventory-list">
		{#each vehicles as vehicle (vehicle.slug)}
			<MobileInventoryVehicleCard {vehicle} />
		{/each}
	</div>
{:else}
	<div class="mobile-inventory-empty">
		<Car size={28} strokeWidth={2.2} />
		<h2>No vehicles match these filters</h2>
		<p>Try another make or model, or clear your search.</p>
		<button type="button" onclick={onClearFilters}>Show all</button>
	</div>
{/if}
