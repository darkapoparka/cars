<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import OwnerOverviewHeading from "#lib/sections/OwnerOverviewHeading.svelte";
  import OwnerOverviewDashboard from "#lib/sections/OwnerOverviewDashboard.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.agent-dashboard-home.dealer-overview")} />
<main class="main"
  ><OwnerOverviewHeading />
  <OwnerOverviewDashboard />
  <Footer /></main
>
