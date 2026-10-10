<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { MediaQuery } from "svelte/reactivity";
  import { dealer } from "#lib/content.ts";
  import { referenceFinanceSettings } from "#lib/data/finance.ts";
  import { createLoanCalculatorState } from "#lib/data/loan-estimate.ts";
  import MobileVehicleDetail from "#lib/components/vehicle-detail/MobileVehicleDetail.svelte";
  import VehicleHeading from "#lib/components/vehicle-detail/VehicleHeading.svelte";
  import VehicleSpecifications from "#lib/components/vehicle-detail/VehicleSpecifications.svelte";
  import VehicleDetailPanels from "#lib/components/vehicle-detail/VehicleDetailPanels.svelte";
  import VehicleReservationCard from "#lib/components/vehicle-detail/VehicleReservationCard.svelte";
  import DetailSellerCard from "#lib/components/vehicle-detail/DetailSellerCard.svelte";
  import DetailBrandStrip from "#lib/components/vehicle-detail/DetailBrandStrip.svelte";
  import VehiclePriceActions from "#lib/components/vehicle-detail/VehiclePriceActions.svelte";
  import VehicleSliderGallery from "#lib/components/vehicle-detail/VehicleSliderGallery.svelte";
  import {
    referenceHeading,
    referenceSliderGallery,
    referenceSpecifications,
    referenceDetailContent,
    referenceReservation,
    referenceSeller,
    type DetailHeading,
    type DetailSliderGallery,
    type DetailSpecification,
    type DetailContent,
    type DetailReservation,
    type DetailSeller,
  } from "#lib/data/vehicle-detail.ts";
  let {
    heading = referenceHeading,
    gallery = referenceSliderGallery,
    specifications = referenceSpecifications,
    details = referenceDetailContent,
    reservation = referenceReservation,
    seller = referenceSeller,
    referenceSelection = false,
  }: {
    heading?: DetailHeading;
    gallery?: DetailSliderGallery;
    specifications?: readonly DetailSpecification[];
    details?: DetailContent;
    reservation?: DetailReservation;
    seller?: DetailSeller;
    referenceSelection?: boolean;
  } = $props();
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  const locale = useLocale();
  const finance = dealer.finance ?? referenceFinanceSettings;
  let loanState = $state(
    createLoanCalculatorState(finance.defaults, finance.currency),
  );
</script>

{#if phone.current}
  <MobileVehicleDetail
    {heading}
    {gallery}
    {specifications}
    {details}
    {reservation}
    {seller}
    bind:loanState
  />
{:else}
  <section
    class="box-section box-content-tour-detail background-body pt-0 karento-enquiry-detail"
  >
    <div class="container">
      <VehicleHeading
        {heading}
        primary={desktop.current}
        showMap={!referenceSelection}
      />
      <div class="row">
        <div class="col-lg-8">
          {#if referenceSelection}
            <VehicleSliderGallery {gallery} fillColumn />
            <p class="neutral-500 desktop-type-meta vehicle-reference-notice">
              {locale.t("reference.vehicle.desktop.gallery.notice")}
            </p>
          {:else}
            <VehicleSliderGallery {gallery} />
          {/if}
          <VehicleSpecifications {specifications} alignStart />
          <VehicleDetailPanels {details} bind:loanState />
        </div>
        <div class="col-lg-4">
          <VehiclePriceActions />
          <VehicleReservationCard {reservation} />
          <DetailSellerCard {seller} desktopBranding={desktop.current} />
        </div>
      </div>
    </div>
    <DetailBrandStrip />
  </section>
{/if}

<style>
  @media (min-width: 992px) {
    .vehicle-reference-notice {
      margin: var(--karento-desktop-space-3) 0 var(--karento-desktop-panel-gap);
    }
    .karento-enquiry-detail :global(.tour-meta-right .btn) {
      min-height: var(--karento-desktop-pill-height);
      padding: var(--karento-desktop-space-2) var(--karento-desktop-space-4);
      border-radius: var(--karento-desktop-pill-radius);
    }
    .karento-enquiry-detail :global(.desktop-panel-action) {
      border-radius: var(--karento-desktop-pill-radius) !important;
    }
  }
</style>
