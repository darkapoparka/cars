<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import ListingFiltersSidebar from "#lib/components/vehicle-listing/ListingFiltersSidebar.svelte";
  import ListingBrandStrip from "#lib/components/vehicle-listing/ListingBrandStrip.svelte";
  import DesktopCatalogResults from "#lib/components/vehicle-listing/DesktopCatalogResults.svelte";
  import { vehicleListings } from "#lib/data/vehicle-listing.ts";
  import { MediaQuery } from "svelte/reactivity";
  import MobileCatalog from "#lib/components/vehicle-listing/MobileCatalog.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

<section
  class="box-section block-content-tourlist background-body"
  id="vehicle-results"
>
  <div class="container">
    <div class="box-content-main pt-20">
      <div class="content-right">
        {#if phone.current}<MobileCatalog
            cards={vehicleListings.gridFourColumns}
          />{:else}
          <DesktopCatalogResults cards={vehicleListings.gridFourColumns} />
        {/if}
      </div>
      <ListingFiltersSidebar hidden />
    </div>
  </div>
  <ListingBrandStrip />
</section>

<style>
  @media (min-width: 992px) {
    #vehicle-results {
      scroll-margin-top: 96px;
    }
  }
</style>
