<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import MembershipHeading from "#lib/sections/MembershipHeading.svelte";
  import MembershipPlans from "#lib/sections/MembershipPlans.svelte";
  import HomeFaqColumns from "#lib/sections/HomeFaqColumns.svelte";
  import UpcomingVehicleNews from "#lib/sections/UpcomingVehicleNews.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.pricing.membership-pricing")} />
<main class="main"
  ><MembershipHeading />
  <MembershipPlans />
  <HomeFaqColumns />
  <UpcomingVehicleNews />
  <Footer /></main
>
