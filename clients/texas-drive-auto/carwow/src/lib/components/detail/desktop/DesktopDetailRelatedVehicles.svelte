<script lang="ts">
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import VehicleCard from '$lib/components/inventory/desktop/VehicleCard.svelte';

	let { vehicles }: { vehicles: InventoryListVehicle[] } = $props();
</script>

{#if vehicles.length}
	<section class="background-light pdp-related py-100" aria-labelledby="pdp-related-title">
		<div class="container">
			<p id="pdp-related-title" class="h3 mb-40 capitalize">Similar vehicles</p>
			<div class="pdp-related__grid">
				{#each vehicles as vehicle, index (vehicle.slug)}
					<VehicleCard {vehicle} {index} />
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.pdp-related {
		background: #f4f6fa;
	}

	.pdp-related__grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.pdp-related__grid :global(.card-box.card-box-style-1[data-daynight-vehicle-card]) {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}

	.pdp-related__grid :global(.card-box.card-box-style-1[data-daynight-vehicle-card] .image) {
		aspect-ratio: 1.34 / 1;
		flex: 0 0 auto;
		height: auto;
		overflow: hidden;
	}

	.pdp-related__grid :global(.card-box.card-box-style-1[data-daynight-vehicle-card] .content) {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		min-height: 178px;
	}

	.pdp-related__grid :global(.card-box.card-box-style-1[data-daynight-vehicle-card] .card--img) {
		display: block;
		height: 100%;
		object-fit: cover;
		width: 100%;
	}

	.pdp-related__grid
		:global(.card-box.card-box-style-1[data-daynight-vehicle-card] .card-box__price) {
		margin-top: auto !important;
	}

	@media (max-width: 1199px) {
		.pdp-related__grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 991px) {
		.pdp-related {
			display: none;
		}
	}
</style>
