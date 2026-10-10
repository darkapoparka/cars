<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import TermsHeading from "#lib/sections/TermsHeading.svelte";
  import TermsContent from "#lib/sections/TermsContent.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.term.terms")} />
<main class="main"
  ><TermsHeading />
  <TermsContent />
  <Footer /></main
>
