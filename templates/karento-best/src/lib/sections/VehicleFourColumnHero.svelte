<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import DiscoveryBanner from "#lib/components/page-header/DiscoveryBanner.svelte";
  import HeroBackdrop from "#lib/components/page-header/HeroBackdrop.svelte";
  import ListingVehicleSearch from "./ListingVehicleSearch.svelte";
  import { discoveryBanners } from "#lib/data/page-headers.ts";
  import CatalogHeroTypes from "#lib/components/vehicle-listing/CatalogHeroTypes.svelte";
  import { vehicleListings } from "#lib/data/vehicle-listing.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

{#if desktop.current}
  <section
    class="page-header-2 pt-30 background-body karento-catalog-hero"
    aria-label={locale.t("header.vehicles.mobileTitle")}
  >
    <div class="custom-container position-relative mx-auto">
      <HeroBackdrop image={discoveryBanners.vehicles.image} />
      <div class="catalog-hero-content">
        <h2 class="text-white desktop-hero-title"
          >{locale.t("header.vehicles.mobileTitle")}</h2
        >
        <div class="hero-search-controls">
          <ListingVehicleSearch dealership />
          <CatalogHeroTypes cards={vehicleListings.gridFourColumns} />
        </div>
      </div>
    </div>
  </section>
{:else}
  <DiscoveryBanner header={discoveryBanners.vehicles} />
{/if}

<style>
  @media (min-width: 992px) {
    .karento-catalog-hero {
      position: relative;
      z-index: 30;
      width: 100%;
      max-width: 960px;
      margin-inline: auto;
      padding-inline: var(--karento-desktop-space-3);
    }

    .karento-catalog-hero .custom-container {
      max-width: none;
      padding-inline: 0;
      height: var(--karento-desktop-hero-height);
      min-height: var(--karento-desktop-hero-height);
    }

    .catalog-hero-content {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: var(--karento-desktop-grid-gap);
      padding: var(--karento-desktop-space-8);
      text-align: center;
    }

    h2 {
      margin: 0;
      font-size: var(--karento-desktop-hero-title-size);
      line-height: var(--karento-type-hero-leading);
    }

    .hero-search-controls {
      display: flex;
      flex-direction: column;
      gap: var(--karento-desktop-card-gap);
      width: min(960px, 100%);
    }
  }

  @media (min-width: 1200px) {
    .karento-catalog-hero {
      max-width: 1140px;
    }
  }

  @media (min-width: 1400px) {
    .karento-catalog-hero {
      max-width: 1248px;
    }
  }
</style>
