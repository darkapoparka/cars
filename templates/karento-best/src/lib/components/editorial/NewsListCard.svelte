<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import {
    referenceEditorialMetadata,
    type NewsListItem,
  } from "#lib/data/editorial.ts";

  let { item }: { item: NewsListItem } = $props();
</script>

<div class="card-flight card-news background-card news-list-card desktop-card">
  <div class="card-image">
    <a
      href={locale.href("/news/article")}
      aria-label={locale.t("ui.news-list-card.view-details")}
      ><img src={item.image} alt={locale.t("image.illustrative")} /></a
    >
  </div>
  <div class="card-info">
    <DemoActionLink
      class={[item.categoryClass, "desktop-type-badge"]}
      href="#!"
      aria-label={locale.text(item.categoryLabel)}
      >{locale.text(item.categoryLabel)}</DemoActionLink
    >
    <div class="card-title"
      ><a
        class="heading-6 neutral-1000 d-block desktop-type-card"
        href={locale.href("/news/article")}
        aria-label={locale.text(item.titleLabel)}>{locale.text(item.title)}</a
      ></div
    >
    <div class="card-meta"
      ><span class="post-date neutral-1000 desktop-type-meta"
        >{locale.date(referenceEditorialMetadata.date)}</span
      ><span class="post-time neutral-1000 desktop-type-meta"
        >{locale.count(referenceEditorialMetadata.minutes, "minutes")}</span
      ><span class="post-comment neutral-1000 desktop-type-meta"
        >{locale.count(referenceEditorialMetadata.comments, "comments")}</span
      ></div
    >
    <div class="card-desc">
      <p class="text-md-medium neutral-500 desktop-type-body"
        >{locale.t("editorial.list.excerpt")}</p
      >
    </div>
    <div class="card-program">
      <div class="endtime">
        <div class="card-button"
          ><a
            class="btn btn-gray desktop-type-pill desktop-card-action"
            href={locale.href("/news/article")}
            aria-label={locale.t("ui.news-list-card.keep-reading")}
            >{locale.t("ui.news-list-card.keep-reading")}</a
          ></div
        >
      </div>
    </div>
  </div>
</div>

<style>
  @media (min-width: 992px) {
    .news-list-card.card-news {
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr);
      min-width: 0;
      max-width: 100%;
      margin-bottom: var(--karento-desktop-grid-gap);
    }
    .news-list-card.card-news .card-image {
      width: 100%;
      max-width: none;
      height: 100%;
      aspect-ratio: 4 / 3;
    }
    .news-list-card.card-news .card-image a {
      display: block;
      height: 100%;
    }
    .news-list-card.card-news .card-image img {
      width: 100%;
      height: 100%;
      max-height: none;
      object-fit: cover;
    }
    .news-list-card.card-news .card-info {
      display: flex;
      flex-direction: column;
      gap: var(--karento-desktop-card-gap);
      width: 100%;
      min-width: 0;
      height: auto;
      margin: 0;
      padding: var(--karento-desktop-card-padding);
      border-radius: 0;
    }
    .news-list-card.card-news .card-info :global(.desktop-type-badge) {
      position: static;
      align-self: start;
      width: fit-content;
      max-width: 100%;
      margin: 0;
      padding: var(--karento-desktop-space-1) var(--karento-desktop-space-3);
      border-radius: var(--karento-desktop-pill-radius);
    }
    .news-list-card.card-news .card-title,
    .news-list-card.card-news .card-meta,
    .news-list-card.card-news .card-desc {
      margin: 0;
    }
    .news-list-card.card-news .card-meta {
      flex-wrap: wrap;
      gap: var(--karento-desktop-space-2) var(--karento-desktop-space-3);
    }
    .news-list-card.card-news .card-meta span {
      padding-right: 0;
    }
    .news-list-card.card-news .card-program {
      margin-top: auto;
    }
  }
</style>
