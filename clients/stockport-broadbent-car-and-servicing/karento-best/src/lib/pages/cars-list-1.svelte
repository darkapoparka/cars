<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import VehicleSidebarHero from "#lib/sections/VehicleSidebarHero.svelte";
  import ListingVehicleSearch from "#lib/sections/ListingVehicleSearch.svelte";
  import VehicleFleetHeading from "#lib/sections/VehicleFleetHeading.svelte";
  import VehicleSidebarListing from "#lib/sections/VehicleSidebarListing.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.cars-list-1.vehicles")} />
<main class="main"
  ><VehicleSidebarHero />
  <ListingVehicleSearch />
  <VehicleFleetHeading />
  <VehicleSidebarListing />
  <Footer /></main
>
