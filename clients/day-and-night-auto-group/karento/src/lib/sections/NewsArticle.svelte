<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import RentalAdviceArticle from "#lib/components/editorial/RentalAdviceArticle.svelte";
  import NewsArticleBody from "#lib/components/editorial/NewsArticleBody.svelte";
  import type { NewsArticleContent } from "#lib/data/news.ts";

  import NewsSidebar from "#lib/components/editorial/NewsSidebar.svelte";

  let {
    article,
    missing = false,
  }: { article?: NewsArticleContent; missing?: boolean } = $props();
</script>

<section class="box-section background-body karento-news-article">
  <div class="container">
    <div class="section-box background-body pt-96">
      <div class="container">
        <div class="row">
          <div
            class={article || missing
              ? "col-lg-8 mx-auto mb-35"
              : "col-lg-8 mb-35"}
          >
            {#if missing}
              <p class="neutral-500 desktop-type-prose"
                >{locale.t("editorial.article.notFoundBody")}</p
              >
              <a
                class="btn btn-gray desktop-type-pill desktop-card-action"
                href={locale.href("/news")}
                >{locale.t("editorial.article.backToNews")}</a
              >
            {:else if article}
              <NewsArticleBody {article} />
            {:else}
              <RentalAdviceArticle />
            {/if}
          </div>
          {#if !article && !missing}<NewsSidebar />{/if}
        </div>
      </div>
    </div>
  </div>
</section>
