<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import OwnerSettingsHeading from "#lib/sections/OwnerSettingsHeading.svelte";
  import OwnerSettingsDashboard from "#lib/sections/OwnerSettingsDashboard.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.agent-dashboard-setting.dealer-settings")} />
<main class="main"
  ><OwnerSettingsHeading />
  <OwnerSettingsDashboard />
  <Footer /></main
>
