<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		AuxeroInventoryVehicleCard as AuxeroInventoryVehicleCardData,
		AuxeroInventoryView
	} from '$lib/auxero/inventory';
	import { inventoryGridClassForView } from '$lib/auxero/inventory';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import AuxeroInventoryVehicleCard from './AuxeroInventoryVehicleCard.svelte';

	let {
		cards,
		copy,
		view
	}: {
		cards: AuxeroInventoryVehicleCardData[];
		copy: InventoryCopy;
		view: AuxeroInventoryView;
	} = $props();

	const gridClass = $derived(inventoryGridClassForView(view));
	const resetHref = resolve('/inventory');
</script>

<div class="content-tab daynight-inventory-content">
	<div class="content-inner active">
		<div class={gridClass}>
			{#each cards as card (card.slug)}
				<AuxeroInventoryVehicleCard
					{card}
					copy={copy.vehicleCard}
					variant={view === 'map' ? 'list' : 'grid'}
				/>
			{:else}
				<div class="card-box card-box-style-1 daynight-empty-state">
					<div class="content border-light">
						<p class="h6 card-box__title mb-8">{copy.emptyTitle}</p>
						<p class="text-secondary mb-15">
							{copy.emptyBody}
						</p>
						<a href={resetHref} class="view-details">
							{copy.reset}
							<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt={copy.reset} />
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
