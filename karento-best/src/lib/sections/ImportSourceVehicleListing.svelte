<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import ListingFiltersSidebar from "#lib/components/vehicle-listing/ListingFiltersSidebar.svelte";
  import ListingBrandStrip from "#lib/components/vehicle-listing/ListingBrandStrip.svelte";
  import ListingVehicleGrid from "#lib/components/vehicle-listing/ListingVehicleGrid.svelte";
  import type { ListingVehicle } from "#lib/data/vehicle-listing.ts";
  let { cards }: { cards: readonly ListingVehicle[] } = $props();
</script>

<section class="box-section block-content-tourlist background-body">
  <div class="container">
    <div class="box-content-main pt-20">
      <div class="content-right">
        <ListingVehicleGrid {cards} columns={4} recommendations showLocation />
      </div>
      <ListingFiltersSidebar hidden />
    </div>
  </div>
  <ListingBrandStrip />
</section>
