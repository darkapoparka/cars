<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import type { NewsArticleContent } from "#lib/data/news.ts";

  const locale = useLocale();
  let { article }: { article: NewsArticleContent } = $props();
  const sections = $derived(
    article.body.map((section) => ({
      ...section,
      paragraphs: section.paragraphs.map((text) => ({ text })),
    })),
  );
</script>

<article
  class="box-content-detail-blog"
  aria-label={locale.text(article.title)}
>
  <div class="box-content-info-detail mt-0 pt-0">
    {#if article.sample}
      <p class="text-sm-medium neutral-500 mb-20 desktop-type-meta"
        >{locale.t("editorial.article.sampleNotice")}</p
      >
    {/if}
    {#if article.author || article.publishedAt || article.readMinutes !== undefined}
      <div class="card-meta gap-2 d-flex mb-20">
        {#if article.author}<span class="neutral-1000 desktop-type-meta"
            >{locale.t("editorial.authorBy", { author: article.author })}</span
          >{/if}
        {#if article.publishedAt}<span
            class="post-date neutral-500 desktop-type-meta"
            >{locale.date(article.publishedAt)}</span
          >{/if}
        {#if article.readMinutes !== undefined}<span
            class="post-time neutral-500 desktop-type-meta"
            >{locale.count(article.readMinutes, "minutes")}</span
          >{/if}
      </div>
    {/if}
    <p class="text-xl-medium mb-20 neutral-1000 desktop-type-lead"
      >{locale.text(article.introduction)}</p
    >
    {#each sections as section (section)}
      <section class="content-detail-post news-article-section">
        <h2 class="desktop-type-article-subhead"
          >{locale.text(section.heading)}</h2
        >
        {#each section.paragraphs as paragraph (paragraph)}
          <p class="neutral-1000 desktop-type-prose"
            >{locale.text(paragraph.text)}</p
          >
        {/each}
      </section>
    {/each}
    <a
      class="btn btn-gray desktop-type-pill desktop-card-action"
      href={locale.href("/news")}>{locale.t("editorial.article.backToNews")}</a
    >
  </div>
</article>

<style>
  .card-meta {
    flex-wrap: wrap;
  }
  @media (min-width: 992px) {
    .news-article-section {
      margin-block: var(--karento-desktop-heading-gap);
    }
    .news-article-section h2 {
      margin-bottom: var(--karento-desktop-space-3);
    }
  }
  @media (max-width: 767.98px) {
    .news-article-section {
      margin-block: var(--karento-space-6);
    }
    .news-article-section h2 {
      margin-bottom: var(--karento-space-3);
      font-size: var(--karento-type-panel-size);
      font-weight: var(--karento-type-panel-weight);
      line-height: var(--karento-type-panel-leading);
    }
  }
</style>
