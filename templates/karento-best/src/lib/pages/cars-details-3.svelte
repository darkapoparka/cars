<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import VehicleBreadcrumb from "#lib/sections/VehicleBreadcrumb.svelte";
  import VehicleEnquiryDetail from "#lib/sections/VehicleEnquiryDetail.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.cars-details-3.vehicle-details")} />
<main class="main karento-mobile-detail"
  ><VehicleBreadcrumb centered />
  <VehicleEnquiryDetail />
  <Footer /></main
>
