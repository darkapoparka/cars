<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import VehicleBreadcrumb from "#lib/sections/VehicleBreadcrumb.svelte";
  import VehicleEnquiryDetail from "#lib/sections/VehicleEnquiryDetail.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { page } from "$app/state";
  import { MediaQuery } from "svelte/reactivity";
  import { dealer } from "#lib/content.ts";
  import ReferenceVehicleNotFound from "#lib/components/vehicle-detail/DealerVehicleNotFound.svelte";
  import {
    selectedReferenceVehicle,
    referenceVehicleIdentity,
  } from "#lib/data/vehicle-detail-selection.ts";
  const desktop = new MediaQuery("(min-width: 992px)");
  const hasSelection = $derived(page.url.searchParams.has("vehicle"));
  const selected = $derived(
    hasSelection
      ? selectedReferenceVehicle(page.url.searchParams, dealer.inventory)
      : null,
  );
  const identity = $derived(
    selected ? referenceVehicleIdentity(selected, locale) : null,
  );
</script>

<PageMetadata title={locale.t("ui.cars-details-3.vehicle-details")} />
<main class="main karento-mobile-detail"
  >{#if desktop.current && hasSelection}
    {#if identity}
      <VehicleBreadcrumb centered vehicleTitle={identity.heading.title} />
      <VehicleEnquiryDetail
        heading={identity.heading}
        gallery={identity.gallery}
        referenceSelection
      />
    {:else}
      <VehicleBreadcrumb
        centered
        vehicleTitle={locale.t("dealer.vehicle.missing")}
      />
      <ReferenceVehicleNotFound />
    {/if}
  {:else}
    <VehicleBreadcrumb centered />
    <VehicleEnquiryDetail />
  {/if}
  <Footer /></main
>
