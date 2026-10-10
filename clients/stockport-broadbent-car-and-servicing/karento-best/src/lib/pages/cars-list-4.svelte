<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import VehicleThreeColumnHero from "#lib/sections/VehicleThreeColumnHero.svelte";
  import ListingVehicleSearch from "#lib/sections/ListingVehicleSearch.svelte";
  import VehicleFleetHeading from "#lib/sections/VehicleFleetHeading.svelte";
  import RentalVehicleListing from "#lib/sections/RentalVehicleListing.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.cars-list-4.vehicles")} />
<main class="main"
  ><VehicleThreeColumnHero />
  <ListingVehicleSearch />
  <VehicleFleetHeading />
  <RentalVehicleListing />
  <Footer /></main
>
