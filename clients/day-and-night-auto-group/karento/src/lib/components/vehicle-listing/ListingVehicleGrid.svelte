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
  {#if mobileTiles}
    <div class="mobile-vehicle-grid">
      {#each cards as card (card.id)}
        <DiscoveryCard
          car={{ ...card, year: years.get(card.id) }}
          href={card.href}
          catalog
        />
      {/each}
    </div>
  {:else}<div class="row">
      {#each cards as card (card.id)}
        <div class={columns === 4 ? "col-lg-3 col-md-6" : "col-lg-4 col-md-6"}>
          {#if recommendations}<VehicleGridCard
              linkedImage={false}
              {card}
              {showLocation}
            />{:else}<VehicleGridCard {card} {showLocation} />{/if}
        </div>
      {/each}
    </div>{/if}
</div>

<style>
  @media (max-width: 767.98px) {
    .mobile-vehicle-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--karento-space-6) var(--karento-space-3);
    }
  }
  @media (min-width: 992px) {
    .row {
      --bs-gutter-x: var(--karento-desktop-grid-gap);
    }
  }
</style>
