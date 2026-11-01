<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { RentalRow } from "#lib/data/vehicle-listing.ts";
  import ListingVehicleRowCard from "./ListingVehicleRowCard.svelte";
  let {
    cards,
    showLocation = false,
  }: { cards: readonly RentalRow[]; showLocation?: boolean } = $props();
</script>

<div class="box-grid-hotels">
  <div class="row">
    {#each cards as card (card.id)}
      <div class="col-xl-12 col-lg-12">
        <ListingVehicleRowCard {card} {showLocation} />
      </div>
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
