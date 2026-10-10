<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import ListingFiltersSidebar from "#lib/components/vehicle-listing/ListingFiltersSidebar.svelte";
  import ListingBrandStrip from "#lib/components/vehicle-listing/ListingBrandStrip.svelte";
  import ListingVehicleGrid from "#lib/components/vehicle-listing/ListingVehicleGrid.svelte";
  import ListingToolbar from "#lib/components/vehicle-listing/ListingToolbar.svelte";
  import ListingPagination from "#lib/components/vehicle-listing/ListingPagination.svelte";
  import { vehicleListings } from "#lib/data/vehicle-listing.ts";
  import { MediaQuery } from "svelte/reactivity";
  import MobileCatalog from "#lib/components/vehicle-listing/MobileCatalog.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

<section class="box-section block-content-tourlist background-body">
  <div class="container">
    <div class="box-content-main pt-20">
      <div class="content-right">
        {#if phone.current}<MobileCatalog
            cards={vehicleListings.gridThreeColumns}
            columns={3}
          />{:else}
          <ListingToolbar />
          <ListingVehicleGrid
            cards={vehicleListings.gridThreeColumns}
            columns={3}
          />
          <ListingPagination />
        {/if}
      </div>
      <ListingFiltersSidebar hidden />
    </div>
  </div>
  <ListingBrandStrip />
</section>
