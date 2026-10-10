<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import VehicleFourColumnHero from "#lib/sections/VehicleFourColumnHero.svelte";
  import ListingVehicleSearch from "#lib/sections/ListingVehicleSearch.svelte";
  import VehicleFleetHeading from "#lib/sections/VehicleFleetHeading.svelte";
  import VehicleFourColumnListing from "#lib/sections/VehicleFourColumnListing.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<PageMetadata title={locale.t("ui.cars-list-2.vehicles")} />
<main class="main"
  ><VehicleFourColumnHero />
  {#if !desktop.current}
    <ListingVehicleSearch />
    <VehicleFleetHeading />
  {/if}
  <VehicleFourColumnListing />
  <Footer /></main
>
