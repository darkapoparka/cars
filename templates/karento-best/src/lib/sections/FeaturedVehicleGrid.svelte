<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import "#lib/styles/home-section-headings.css";
  import { MediaQuery } from "svelte/reactivity";
  import MobileSectionHeading from "#lib/components/mobile/MobileSectionHeading.svelte";
  import { focusableScroll } from "#lib/horizontal-scroll.ts";
  import VehicleGridCard from "#lib/cards/VehicleGridCard.svelte";
  import { referenceVehicles } from "#lib/data/vehicles.ts";
  let { compactMobile = false }: { compactMobile?: boolean } = $props();
  const mobile = new MediaQuery("(max-width: 767.98px)");
  const mobileVehicles = $derived(
    compactMobile
      ? referenceVehicles.featuredVehicles
      : referenceVehicles.featuredVehicles.slice(0, 3),
  );
</script>

<section
  class="section-box box-flights background-body desktop-collection-section"
>
  <div class="container">
    {#if mobile.current}
      <MobileSectionHeading
        title={locale.t("ui.featured-vehicle-grid.featured-listings")}
        description={compactMobile
          ? undefined
          : locale.t("reference.bodyTypes.intro")}
        actionLabel={locale.t("ui.featured-vehicle-grid.view-more")}
        actionHref="/vehicles"
      />
    {:else}
      <div
        class="row align-items-end mb-10 home-section-heading desktop-section-heading"
      >
        <div class="col-md-8 home-section-title">
          <h3 class="neutral-1000 desktop-type-collection"
            >{locale.t("ui.featured-vehicle-grid.featured-listings")}</h3
          >
          <p
            class="text-lg-medium neutral-500 home-section-description desktop-type-lead"
            >{locale.t("reference.bodyTypes.intro")}</p
          >
        </div>
        <div class="col-md-4 mt-md-0 mt-4 home-section-actions">
          <div class="d-flex justify-content-end">
            <a
              class="btn btn-primary desktop-type-pill desktop-section-action"
              href={locale.href("/vehicles")}
              aria-label={locale.t("ui.featured-vehicle-grid.view-more")}
            >
              {locale.t("ui.featured-vehicle-grid.view-more")}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M8 15L15 8L8 1M15 8L1 8"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    {/if}
    {#if mobile.current}
      <div
        class="mobile-home-vehicles mobile-featured-rail"
        role="region"
        aria-label={locale.t("ui.featured-vehicle-grid.featured-vehicles")}
        {@attach focusableScroll}
      >
        {#each mobileVehicles as card (card.title)}
          <VehicleGridCard {card} />
        {/each}
      </div>
    {:else}
      <div
        class="row pt-30 mobile-vehicle-rail"
        role={mobile.current ? "region" : undefined}
        aria-label={mobile.current
          ? locale.t("ui.featured-vehicle-grid.featured-vehicles")
          : undefined}
        {@attach focusableScroll}
      >
        <div class="col-lg-3 col-md-6">
          <VehicleGridCard
            paddedRating
            card={referenceVehicles.featuredVehicles[0]}
          /></div
        >
        <div class="col-lg-3 col-md-6">
          <VehicleGridCard
            paddedRating
            nowrapTitle={false}
            card={referenceVehicles.featuredVehicles[1]}
          /></div
        >
        <div class="col-lg-3 col-md-6">
          <VehicleGridCard
            paddedRating
            nowrapTitle={false}
            card={referenceVehicles.featuredVehicles[2]}
          /></div
        >
        <div class="col-lg-3 col-md-6">
          <VehicleGridCard
            paddedRating
            nowrapTitle={false}
            card={referenceVehicles.featuredVehicles[3]}
          /></div
        >
      </div>
    {/if}
  </div>
</section>

<style>
  @media (max-width: 767.98px) {
    .mobile-featured-rail {
      grid-auto-flow: column;
      grid-auto-columns: calc(100% - 28px);
      align-items: start;
      min-width: 0;
      max-width: 100%;
      padding-block: 4px;
      overflow-x: auto;
      overscroll-behavior-x: contain;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }
    .mobile-featured-rail::-webkit-scrollbar {
      display: none;
    }
    .mobile-featured-rail:focus-visible {
      outline: 2px solid var(--karento-accent);
      outline-offset: 3px;
    }
    .mobile-featured-rail :global(.mobile-vehicle-card) {
      scroll-snap-align: start;
    }
  }

  @media (min-width: 992px) {
    .row.pt-30 {
      padding-top: 0 !important;
    }
  }
</style>
