<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import TrendingNewsGrid from "#lib/sections/TrendingNewsGrid.svelte";
  import NewsList from "#lib/sections/NewsList.svelte";
  import Footer from "#lib/components/Footer.svelte";
</script>

<PageMetadata title={locale.t("ui.blog-list.news")} />
<main class="main"
  ><TrendingNewsGrid />
  <NewsList />
  <Footer /></main
>
