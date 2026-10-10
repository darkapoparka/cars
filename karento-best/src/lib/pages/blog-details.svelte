<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import NewsArticleHeading from "#lib/sections/NewsArticleHeading.svelte";
  import NewsArticle from "#lib/sections/NewsArticle.svelte";
  import UpcomingVehicleNews from "#lib/sections/UpcomingVehicleNews.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import { page } from "$app/state";
  import { dealer } from "#lib/content.ts";
  import { selectedNewsArticle, suppliedNews } from "#lib/data/news.ts";

  const article = $derived(
    selectedNewsArticle(suppliedNews(dealer.news), page.url.searchParams),
  );
  const missing = $derived(page.url.searchParams.has("article") && !article);
</script>

<PageMetadata
  title={article
    ? locale.text(article.title)
    : locale.t(
        missing
          ? "editorial.article.notFoundTitle"
          : "editorial.metadata.article",
      )}
/>
<main class="main"
  ><NewsArticleHeading {article} {missing} />
  <NewsArticle {article} {missing} />
  {#if !article && !missing}<UpcomingVehicleNews />{/if}
  <Footer /></main
>
