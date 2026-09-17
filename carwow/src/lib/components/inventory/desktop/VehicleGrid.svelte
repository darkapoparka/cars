<script lang="ts">
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import VehicleCard from './VehicleCard.svelte';

	let { vehicles, gridClass }: { vehicles: InventoryListVehicle[]; gridClass: string } = $props();
</script>

<div class={gridClass}>
	{#each vehicles as vehicle, index (vehicle.slug)}
		<VehicleCard {vehicle} {index} />
	{/each}
</div>
