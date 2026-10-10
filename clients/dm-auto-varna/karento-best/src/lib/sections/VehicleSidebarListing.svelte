<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import ListingFiltersSidebar from "#lib/components/vehicle-listing/ListingFiltersSidebar.svelte";
  import ListingBrandStrip from "#lib/components/vehicle-listing/ListingBrandStrip.svelte";
  import ListingVehicleGrid from "#lib/components/vehicle-listing/ListingVehicleGrid.svelte";
  import ListingToolbar from "#lib/components/vehicle-listing/ListingToolbar.svelte";
  import ListingPagination from "#lib/components/vehicle-listing/ListingPagination.svelte";
  import { vehicleListings } from "#lib/data/vehicle-listing.ts";
</script>

<section class="box-section block-content-tourlist background-body">
  <div class="container">
    <div class="box-content-main pt-20">
      <div class="content-right">
        <ListingToolbar />
        <ListingVehicleGrid cards={vehicleListings.gridSidebar} columns={3} />
        <ListingPagination />
      </div>
      <ListingFiltersSidebar />
    </div>
  </div>
  <ListingBrandStrip />
</section>
