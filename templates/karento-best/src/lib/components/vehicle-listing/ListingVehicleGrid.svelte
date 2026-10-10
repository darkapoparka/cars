<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { ListingVehicle } from "#lib/data/vehicle-listing.ts";
  import VehicleGridCard from "#lib/cards/VehicleGridCard.svelte";

  let {
    cards,
    columns = 3,
    recommendations = false,
    showLocation = false,
  }: {
    cards: readonly ListingVehicle[];
    columns?: 3 | 4;
    recommendations?: boolean;
    showLocation?: boolean;
  } = $props();
</script>

<div class="box-grid-tours">
  <div class="row">
    {#each cards as card (card.id)}
      <div class={columns === 4 ? "col-lg-3 col-md-6" : "col-lg-4 col-md-6"}>
        {#if recommendations}<VehicleGridCard
            linkedImage={false}
            {card}
            {showLocation}
          />{:else}<VehicleGridCard {card} {showLocation} />{/if}</div
      >
    {/each}
  </div>
</div>

<style>
  @media (min-width: 992px) {
    .row {
      --bs-gutter-x: var(--karento-desktop-grid-gap);
    }
  }
</style>
