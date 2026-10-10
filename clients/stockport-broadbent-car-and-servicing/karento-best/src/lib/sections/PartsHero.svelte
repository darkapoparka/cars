<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DiscoveryBanner from "#lib/components/page-header/DiscoveryBanner.svelte";
  import { discoveryBanners } from "#lib/data/page-headers.ts";
  import VehicleSearch from "#lib/components/search/VehicleSearch.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import type { Snippet } from "svelte";
  let { searchControls }: { searchControls?: Snippet } = $props();
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

{#if desktop.current}
  <section class="shop-desktop-hero container" aria-labelledby="shop-title">
    <div class="shop-hero-artwork">
      <img src={discoveryBanners.shop.image.src} alt="" />
      <div class="shop-hero-content"
        ><h1 id="shop-title" class="desktop-hero-title"
          >{locale.t("ui.parts-hero.parts-accessories")}</h1
        >{#if searchControls}<div class="shop-hero-search"
            >{@render searchControls()}</div
          >{/if}</div
      >
    </div>
  </section>
{:else}
  <DiscoveryBanner header={discoveryBanners.shop}>
    {#snippet mobileControls()}
      <VehicleSearch fieldIdPrefix="mobile-parts" kind="product" />
    {/snippet}
  </DiscoveryBanner>
{/if}

<style>
  @media (min-width: 992px) {
    .shop-desktop-hero {
      padding-top: 30px;
    }
    .shop-hero-artwork {
      position: relative;
      display: grid;
      place-items: center;
      height: var(--karento-desktop-hero-height);
      min-height: var(--karento-desktop-hero-height);
      overflow: hidden;
      border-radius: var(--karento-desktop-card-radius);
      background: var(--bs-neutral-1000);
      isolation: isolate;
    }
    .shop-hero-artwork::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: rgb(0 0 0 / 60%);
    }
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -2;
    }
    h1 {
      margin: 0;
      color: white;
      font-size: var(--karento-desktop-hero-title-size);
      line-height: var(--karento-type-hero-leading);
      text-align: center;
    }
    .shop-hero-content {
      display: grid;
      justify-items: center;
      gap: var(--karento-desktop-grid-gap);
      width: 100%;
      padding: var(--karento-desktop-space-8);
    }
    .shop-hero-search {
      width: 100%;
      max-width: 960px;
      text-align: left;
    }
  }
</style>
