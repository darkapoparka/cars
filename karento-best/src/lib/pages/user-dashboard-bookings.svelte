<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import BookingsHeading from "#lib/sections/BookingsHeading.svelte";
  import MemberBookingsDashboard from "#lib/sections/MemberBookingsDashboard.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.user-dashboard-bookings.my-bookings")} />
<main class="main"
  ><BookingsHeading />
  <MemberBookingsDashboard />
  <Footer /></main
>
