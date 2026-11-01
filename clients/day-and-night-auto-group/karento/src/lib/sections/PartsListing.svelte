<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import ListingFiltersSidebar from "#lib/components/vehicle-listing/ListingFiltersSidebar.svelte";
  import ListingBrandStrip from "#lib/components/vehicle-listing/ListingBrandStrip.svelte";
  import ListingProductGrid from "#lib/components/vehicle-listing/ListingProductGrid.svelte";
  import ListingToolbar from "#lib/components/vehicle-listing/ListingToolbar.svelte";
  import ListingPagination from "#lib/components/vehicle-listing/ListingPagination.svelte";
  import { listingProducts } from "#lib/data/vehicle-listing.ts";
  import { MediaQuery } from "svelte/reactivity";
  import MobileCatalog from "#lib/components/vehicle-listing/MobileCatalog.svelte";
  import DesktopShopCatalog from "#lib/components/shop/DesktopShopCatalog.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

{#if desktop.current}
  <DesktopShopCatalog products={listingProducts} />
{:else}
  <section class="box-section block-content-tourlist background-body">
    <div class="container">
      <div class="box-content-main pt-20">
        <div class="content-right">
          {#if phone.current}<MobileCatalog products={listingProducts} />{:else}
            <ListingToolbar />
            <ListingProductGrid products={listingProducts} />
            <ListingPagination />
          {/if}
        </div>
        <ListingFiltersSidebar kind="product" />
      </div>
    </div>
    <ListingBrandStrip />
  </section>
{/if}
