<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import NewsGrid from "#lib/sections/NewsGrid.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.blog-grid.news")} />
<main class="main"
  ><NewsGrid />
  <Footer /></main
>
