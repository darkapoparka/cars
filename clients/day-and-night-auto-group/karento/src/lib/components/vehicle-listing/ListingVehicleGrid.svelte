<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { ListingVehicle } from "#lib/data/vehicle-listing.ts";
  import VehicleGridCard from "#lib/cards/VehicleGridCard.svelte";
  import DiscoveryCard from "#lib/discovery/DiscoveryCard.svelte";
  import { discoveryCars } from "#lib/discovery/discovery.ts";

  const years = new Map(discoveryCars.map((car) => [car.id, car.year]));

  let {
    cards,
    columns = 3,
    recommendations = false,
    showLocation = false,
    mobileTiles = false,
  }: {
    cards: readonly ListingVehicle[];
    columns?: 3 | 4;
    recommendations?: boolean;
    showLocation?: boolean;
    mobileTiles?: boolean;
  } = $props();
</script>

<div class="box-grid-tours">
  <div
    class="shared-vehicle-grid mobile-vehicle-grid"
    style:--vehicle-grid-columns={columns}
  >
    {#each cards as card (card.id)}
      {#if recommendations}<VehicleGridCard
          linkedImage={false}
          {card}
          {showLocation}
        />{:else}<DiscoveryCard
          car={{ ...card, year: years.get(card.id) ?? card.year }}
          catalog
        />{/if}
    {/each}
  </div>
</div>

<style>
  .shared-vehicle-grid {
    display: grid;
    grid-template-columns: repeat(
      var(--vehicle-grid-columns, 4),
      minmax(0, 1fr)
    );
    gap: 28px 24px;
  }
  @media (max-width: 991.98px) {
    .shared-vehicle-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 24px 16px;
    }
  }
  @media (max-width: 767.98px) {
    .shared-vehicle-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px 12px;
    }
  }
</style>
