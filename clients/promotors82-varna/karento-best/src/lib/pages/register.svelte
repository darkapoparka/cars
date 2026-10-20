<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import DemoRegistration from "#lib/sections/DemoRegistration.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.register.register")} />
<main class="main background-body"
  ><DemoRegistration />
  <Footer /></main
>
