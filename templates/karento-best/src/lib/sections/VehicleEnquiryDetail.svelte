<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
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
  }: {
    heading?: DetailHeading;
    gallery?: DetailSliderGallery;
    specifications?: readonly DetailSpecification[];
    details?: DetailContent;
    reservation?: DetailReservation;
    seller?: DetailSeller;
  } = $props();
  const phone = new MediaQuery("(max-width: 767.98px)");
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
      <VehicleHeading {heading} />
      <div class="row">
        <div class="col-lg-8">
          <VehicleSliderGallery {gallery} />
          <VehicleSpecifications {specifications} alignStart />
          <VehicleDetailPanels {details} bind:loanState />
        </div>
        <div class="col-lg-4">
          <VehiclePriceActions />
          <VehicleReservationCard {reservation} />
          <DetailSellerCard {seller} />
        </div>
      </div>
    </div>
    <DetailBrandStrip />
  </section>
{/if}
