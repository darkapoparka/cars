<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { ListingProduct } from "#lib/data/vehicle-listing.ts";
  import ListingProductCard from "./ListingProductCard.svelte";
  import MobileProductCard from "./MobileProductCard.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const phone = new MediaQuery("(max-width: 767.98px)");
  let { products }: { products: readonly ListingProduct[] } = $props();
</script>

<div class="box-grid-tours">
  {#if phone.current}
    <div class="mobile-product-list">
      {#each products as product (product.id)}<MobileProductCard
          {product}
        />{/each}
    </div>
  {:else}
    <div class="row">
      {#each products as product (product.id)}
        <div class="col-lg-4 col-md-6"><ListingProductCard {product} /></div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .mobile-product-list {
    display: grid;
    gap: var(--karento-space-3);
  }

  @media (min-width: 992px) {
    .row {
      --bs-gutter-x: var(--karento-desktop-grid-gap);
    }
  }
</style>
