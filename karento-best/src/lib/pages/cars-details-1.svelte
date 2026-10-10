<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import VehicleBreadcrumb from "#lib/sections/VehicleBreadcrumb.svelte";
  import VehicleGalleryBanner from "#lib/sections/VehicleGalleryBanner.svelte";
  import VehicleFullDetail from "#lib/sections/VehicleFullDetail.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.cars-details-1.vehicle-details")} />
<main class="main"
  ><VehicleBreadcrumb />
  <VehicleGalleryBanner />
  <VehicleFullDetail />
  <Footer /></main
>
