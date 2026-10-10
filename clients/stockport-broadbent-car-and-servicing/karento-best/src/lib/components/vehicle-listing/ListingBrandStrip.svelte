<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { listingBrands } from "#lib/data/vehicle-listing.ts";
</script>

<div class="listing-brand-strip background-100 pt-55 pb-55">
  <div class="container">
    <div
      class="carouselTicker box-list-brand-car justify-content-center karento-static-brands"
    >
      <ul class="carouselTicker__list">
        {#each listingBrands as brand (brand.id)}
          <li class="carouselTicker__item">
            <div class="item-brand">
              <img
                class="light-mode"
                src={brand.light}
                alt={locale.t("image.illustrative")}
              />
              <img
                class="dark-mode"
                src={brand.dark}
                alt={locale.t("image.illustrative")}
              />
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<style>
  @media (max-width: 767.98px) {
    .listing-brand-strip {
      display: none;
    }
  }
</style>
