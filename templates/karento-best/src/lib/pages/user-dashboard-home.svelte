<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import MemberOverviewHeading from "#lib/sections/MemberOverviewHeading.svelte";
  import MemberOverviewDashboard from "#lib/sections/MemberOverviewDashboard.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.user-dashboard-home.member-overview")} />
<main class="main"
  ><MemberOverviewHeading />
  <MemberOverviewDashboard />
  <Footer /></main
>
