<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import MobileSectionHeading from "#lib/components/mobile/MobileSectionHeading.svelte";
  import { referenceVehicles } from "#lib/data/vehicles.ts";
  import VehicleGridCard from "#lib/cards/VehicleGridCard.svelte";
  const mobile = new MediaQuery("(max-width: 767.98px)");
</script>

<section
  class="section-box box-flights background-body desktop-collection-section"
>
  <div class="container">
    {#if mobile.current}
      <MobileSectionHeading
        title={locale.t("ui.featured-vehicle-carousel.featured-listings")}
        description={locale.t("reference.bodyTypes.intro")}
        actionLabel={locale.t("ui.featured-vehicle-carousel.view-more")}
        actionHref="/vehicles"
      />
    {:else}
      <div class="row align-items-end desktop-section-heading">
        <div class="col-md-8">
          <h3 class="neutral-1000 desktop-type-collection"
            >{locale.t("ui.featured-vehicle-carousel.featured-listings")}</h3
          >
          <p class="text-lg-medium neutral-500 desktop-type-lead"
            >{locale.t("reference.bodyTypes.intro")}</p
          >
        </div>
        <div class="col-md-4 mt-md-0 mt-4">
          <div class="d-flex justify-content-end">
            <a
              class="btn btn-primary desktop-type-pill desktop-section-action"
              href={locale.href("/vehicles")}
              aria-label={locale.t("ui.featured-vehicle-carousel.view-more")}
            >
              {locale.t("ui.featured-vehicle-carousel.view-more")}
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
    <div class="row pt-30">
      <div class="col-lg-3 col-md-6">
        <VehicleGridCard
          card={referenceVehicles.featuredVehicleSlides[0]}
        /></div
      >
      <div class="col-lg-3 col-md-6">
        <VehicleGridCard
          nowrapTitle={false}
          card={referenceVehicles.featuredVehicleSlides[1]}
        /></div
      >
      <div class="col-lg-3 col-md-6">
        <VehicleGridCard
          nowrapTitle={false}
          card={referenceVehicles.featuredVehicleSlides[2]}
        /></div
      >
      <div class="col-lg-3 col-md-6">
        <VehicleGridCard
          nowrapTitle={false}
          card={referenceVehicles.featuredVehicleSlides[3]}
        /></div
      >
      <div class="col-lg-3 col-md-6">
        <VehicleGridCard
          card={referenceVehicles.featuredVehicleSlides[4]}
        /></div
      >
      <div class="col-lg-3 col-md-6">
        <VehicleGridCard
          nowrapTitle={false}
          card={referenceVehicles.featuredVehicleSlides[5]}
        /></div
      >
      <div class="col-lg-3 col-md-6">
        <VehicleGridCard
          nowrapTitle={false}
          card={referenceVehicles.featuredVehicleSlides[6]}
        /></div
      >
      <div class="col-lg-3 col-md-6">
        <VehicleGridCard
          nowrapTitle={false}
          card={referenceVehicles.featuredVehicleSlides[7]}
        /></div
      >
    </div>
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .row.pt-30 {
      padding-top: 0 !important;
    }
  }
</style>
