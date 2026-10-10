<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import VehicleHeading from "#lib/components/vehicle-detail/VehicleHeading.svelte";
  import VehicleSpecifications from "#lib/components/vehicle-detail/VehicleSpecifications.svelte";
  import VehicleDetailPanels from "#lib/components/vehicle-detail/VehicleDetailPanels.svelte";
  import VehicleReservationCard from "#lib/components/vehicle-detail/VehicleReservationCard.svelte";
  import DetailSellerCard from "#lib/components/vehicle-detail/DetailSellerCard.svelte";
  import DetailBrandStrip from "#lib/components/vehicle-detail/DetailBrandStrip.svelte";
  import VehiclePriceActions from "#lib/components/vehicle-detail/VehiclePriceActions.svelte";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<section class="box-section box-content-tour-detail background-body">
  <div class="container">
    <VehicleHeading primary={desktop.current} />
    <div class="row mt-30">
      <div class="col-lg-8">
        <VehicleSpecifications />
        <VehicleDetailPanels />
      </div>
      <div class="col-lg-4">
        <VehiclePriceActions />
        <VehicleReservationCard />
        <DetailSellerCard desktopBranding={desktop.current} />
      </div>
    </div>
  </div>
  <DetailBrandStrip />
</section>
