<script lang="ts">
	import type { AuxeroFavoriteVehicleCard as FavoriteVehicleCard } from '$lib/auxero/favorites';
	import AuxeroFavoriteVehicleCard from './AuxeroFavoriteVehicleCard.svelte';

	let { cards }: { cards: FavoriteVehicleCard[] } = $props();
</script>

{#if cards.length}
	<div
		class="lg-grid-cols-2 md-grid-cols-1 mb-30 grid grid-cols-3 gap-x-23 gap-y-30"
		data-eliqauto-favorites-grid
		data-eliqauto-favorites-count={cards.length}
	>
		{#each cards as card (card.slug)}
			<AuxeroFavoriteVehicleCard {card} />
		{/each}
	</div>
{:else}
	<div class="dashboard-box bg-white" data-eliqauto-favorites-empty="true">
		<p class="h4 mb-8">No saved Eliqauto vehicles yet</p>
		<p class="text-secondary">Use the heart action on inventory cards to build your saved list.</p>
	</div>
{/if}
