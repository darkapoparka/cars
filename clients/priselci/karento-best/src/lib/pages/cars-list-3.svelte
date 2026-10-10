<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import RentalVehicleHero from "#lib/sections/RentalVehicleHero.svelte";
  import ListingVehicleSearch from "#lib/sections/ListingVehicleSearch.svelte";
  import VehicleFleetHeading from "#lib/sections/VehicleFleetHeading.svelte";
  import VehicleThreeColumnListing from "#lib/sections/VehicleThreeColumnListing.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.cars-list-3.vehicles")} />
<main class="main"
  ><RentalVehicleHero />
  <ListingVehicleSearch />
  <VehicleFleetHeading />
  <VehicleThreeColumnListing />
  <Footer /></main
>
