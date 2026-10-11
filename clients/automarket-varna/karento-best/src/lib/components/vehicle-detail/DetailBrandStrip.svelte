<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { dealer } from "#lib/content.ts";
  import {
    referenceDetailBrands,
    type DetailBrand,
  } from "#lib/data/vehicle-detail.ts";
  let { brands = referenceDetailBrands }: { brands?: readonly DetailBrand[] } =
    $props();
</script>

{#if !dealer.businessPreview}
  <div class="background-100 pt-55 pb-55 mt-100"
    ><div class="container"
      ><div
        class="carouselTicker box-list-brand-car justify-content-center karento-static-brands"
        ><ul class="carouselTicker__list"
          >{#each brands as brand (brand.id)}<li class="carouselTicker__item"
              ><div class="item-brand"
                ><img class="light-mode" src={brand.light} alt="" /><img
                  class="dark-mode"
                  src={brand.dark}
                  alt=""
                /></div
              ></li
            >{/each}</ul
        ></div
      ></div
    ></div
  >
{/if}
