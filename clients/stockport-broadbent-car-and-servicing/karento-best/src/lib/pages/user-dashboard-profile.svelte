<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import ProfileHeading from "#lib/sections/ProfileHeading.svelte";
  import MemberProfileDashboard from "#lib/sections/MemberProfileDashboard.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.user-dashboard-profile.my-profile")} />
<main class="main"
  ><ProfileHeading />
  <MemberProfileDashboard />
  <Footer /></main
>
