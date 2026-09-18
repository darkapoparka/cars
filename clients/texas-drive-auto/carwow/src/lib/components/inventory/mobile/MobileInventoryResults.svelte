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
		<h2>Няма автомобили по тези филтри</h2>
		<p>Пробвайте с друга марка, модел или изчистете търсенето.</p>
		<button type="button" onclick={onClearFilters}>Покажи всички</button>
	</div>
{/if}
