<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

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
		<h2>{i18n.t('copy.e85f06f92b51')}</h2>
		<p>{i18n.t('copy.8b83ac0eecbb')}</p>
		<button type="button" onclick={onClearFilters}>{i18n.t('copy.46dda04276ed')}</button>
	</div>
{/if}
