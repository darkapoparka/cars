<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import DemoSignIn from "#lib/sections/DemoSignIn.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.login.login")} />
<main class="main background-body"
  ><DemoSignIn />
  <Footer /></main
>
