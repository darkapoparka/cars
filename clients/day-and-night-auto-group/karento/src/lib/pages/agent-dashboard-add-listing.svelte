<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import AddListingHeading from "#lib/sections/AddListingHeading.svelte";
  import OwnerAddListingDashboard from "#lib/sections/OwnerAddListingDashboard.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.agent-dashboard-add-listing.add-listing")} />
<main class="main"
  ><AddListingHeading />
  <OwnerAddListingDashboard />
  <Footer /></main
>
