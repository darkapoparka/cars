<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import {
    newsArticleDestination,
    type NewsArticleContent,
  } from "#lib/data/news.ts";

  let { item }: { item: NewsArticleContent } = $props();
  const href = $derived(locale.href(newsArticleDestination(item)));
</script>

<div class="col-lg-4 col-md-6 col-12">
  <div class="card-news background-card mb-4 news-grid-card">
    <div class="card-image">
      <a
        class="d-block"
        {href}
        aria-label={locale.text(item.titleLabel ?? item.title)}
        ><img
          src={item.image}
          alt={item.imageAlt
            ? locale.text(item.imageAlt)
            : locale.t("image.illustrative")}
        /></a
      >
    </div>
    <div class="card-info">
      <span
        class="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold desktop-type-badge"
        >{locale.text(item.categoryLabel)}</span
      >
      {#if item.publishedAt || item.readMinutes !== undefined || item.commentsCount !== undefined}
        <div class="card-meta">
          {#if item.publishedAt}<span
              class="post-date neutral-1000 desktop-type-meta"
              >{locale.date(item.publishedAt)}</span
            >{/if}
          {#if item.readMinutes !== undefined}<span
              class="post-time neutral-1000 desktop-type-meta"
              >{locale.count(item.readMinutes, "minutes")}</span
            >{/if}
          {#if item.commentsCount !== undefined}<span
              class="post-comment neutral-1000 desktop-type-meta"
              >{locale.count(item.commentsCount, "comments")}</span
            >{/if}
        </div>
      {/if}
      <div class="card-title"
        ><a
          class="text-xl-bold neutral-1000 d-block desktop-type-card"
          {href}
          aria-label={locale.text(item.titleLabel ?? item.title)}
          >{locale.text(item.title)}</a
        ></div
      >
      <div class="card-program">
        <div class="endtime">
          {#if item.avatar || item.author}
            <div class="card-author">
              {#if item.avatar}<img
                  class="rounded-circle border border-primary"
                  src={item.avatar}
                  alt=""
                />{/if}
              {#if item.author}<p
                  class="text-sm-bold neutral-1000 desktop-type-meta"
                  >{item.author}</p
                >{/if}
            </div>
          {/if}
          <div class="card-button"
            ><a
              class="btn btn-gray desktop-type-pill desktop-card-action"
              {href}
              aria-label={locale.t("ui.news-grid-card.keep-reading")}
              >{locale.t("ui.news-grid-card.keep-reading")}</a
            ></div
          >
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @media (min-width: 992px) {
    .news-grid-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin-bottom: 0 !important;
      border-radius: var(--karento-desktop-card-radius);
    }
    .news-grid-card .card-image {
      aspect-ratio: 16 / 9;
    }
    .news-grid-card .card-image a,
    .news-grid-card .card-image img {
      width: 100%;
      height: 100%;
    }
    .news-grid-card .card-image img {
      object-fit: cover;
    }
    .news-grid-card .card-info {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--karento-desktop-card-gap);
      margin: 0;
      padding: var(--karento-desktop-card-padding);
      border-radius: 0;
    }
    .news-grid-card .card-info > span {
      position: static !important;
      align-self: start;
      max-width: 100%;
      margin: 0 !important;
      padding: var(--karento-desktop-space-1) var(--karento-desktop-space-3) !important;
      transform: none !important;
      border-radius: var(--karento-desktop-pill-radius) !important;
    }
    .news-grid-card .card-meta {
      gap: var(--karento-desktop-space-2) var(--karento-desktop-space-3);
      margin: 0 !important;
    }
    .news-grid-card .card-meta span {
      padding-right: 0 !important;
    }
    .news-grid-card .card-title {
      margin: 0 !important;
    }
    .news-grid-card .card-title a {
      text-wrap: pretty;
    }
    .news-grid-card .card-program {
      margin-top: auto;
      padding-top: var(--karento-desktop-space-1);
    }
    .news-grid-card .endtime {
      gap: var(--karento-desktop-space-3);
    }
    .news-grid-card .card-author {
      min-width: 0;
    }
    .news-grid-card .card-author img {
      width: 28px;
      height: 28px;
      margin-right: var(--karento-desktop-space-2) !important;
    }
    .news-grid-card .card-button {
      flex-shrink: 0;
    }
  }
  @media (max-width: 767.98px) {
    .news-grid-card {
      display: grid;
      grid-template-columns: 34% minmax(0, 1fr);
      gap: var(--karento-space-3);
      align-items: start;
      padding: var(--karento-space-3);
      border-radius: var(--karento-radius-card);
    }

    .news-grid-card .card-image {
      aspect-ratio: var(--karento-image-landscape);
      overflow: hidden;
      border-radius: var(--karento-radius-card);
    }

    .news-grid-card .card-image img {
      height: 100%;
      object-fit: cover;
    }

    .news-grid-card .card-info {
      display: flex;
      flex-direction: column;
      gap: var(--karento-space-2);
      min-width: 0;
      margin: 0;
      padding: 0;
    }

    .news-grid-card .card-info > span {
      position: static !important;
      align-self: start;
      max-width: 100%;
      margin: 0 !important;
      padding: var(--karento-space-1) var(--karento-space-2) !important;
      transform: none !important;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: var(--karento-type-badge-size);
      font-weight: var(--karento-type-badge-weight);
      line-height: var(--karento-type-badge-leading);
    }

    .news-grid-card .card-title a {
      font-size: var(--karento-type-compact-card-size);
      font-weight: var(--karento-type-compact-card-weight);
      line-height: var(--karento-type-compact-card-leading);
    }

    .news-grid-card .card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--karento-space-1) var(--karento-space-2);
      margin: 0;
    }

    .news-grid-card .card-meta span {
      margin: 0;
    }

    .news-grid-card .card-info .card-meta span {
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }

    .news-grid-card .card-author p {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-label-weight);
      line-height: var(--karento-type-body-leading);
    }

    .news-grid-card .card-program {
      margin: 0;
    }

    .news-grid-card .endtime {
      flex-wrap: wrap;
      gap: var(--karento-space-2);
    }
  }
</style>
