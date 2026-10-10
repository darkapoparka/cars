<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { newsArticleDestination } from "#lib/data/news.ts";
  import {
    referenceEditorialMetadata,
    type NewsListItem,
  } from "#lib/data/editorial.ts";

  let { item }: { item: NewsListItem } = $props();
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  const articleHref = $derived(
    locale.href(
      desktop.current ? newsArticleDestination(item) : "/news/article",
    ),
  );
</script>

<div class="card-flight card-news background-card news-list-card desktop-card">
  <div class="card-image">
    <a
      href={articleHref}
      aria-label={locale.t("ui.news-list-card.view-details")}
      ><img src={item.image} alt={locale.t("image.illustrative")} /></a
    >
  </div>
  <div class="card-info">
    {#if phone.current}
      <a class="news-list-category" href={locale.href("/news")}
        >{locale.text(item.categoryLabel)}</a
      >
    {:else}
      <DemoActionLink
        class={[item.categoryClass, "desktop-type-badge"]}
        href="#!"
        aria-label={locale.text(item.categoryLabel)}
        >{locale.text(item.categoryLabel)}</DemoActionLink
      >
    {/if}
    <div class="card-title"
      ><a
        class="heading-6 neutral-1000 d-block desktop-type-card"
        href={articleHref}
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
        >{locale.t(
          desktop.current
            ? "editorial.list.sampleExcerpt"
            : "editorial.list.excerpt",
        )}</p
      >
    </div>
    <div class="card-program">
      <div class="endtime">
        <div class="card-button">
          {#if phone.current}
            <MobilePill
              label={locale.t("ui.news-list-card.keep-reading")}
              href="/news/article"
              variant="secondary"
            />
          {:else}
            <a
              class="btn btn-gray desktop-type-pill desktop-card-action"
              href={articleHref}
              aria-label={locale.t("ui.news-list-card.keep-reading")}
              >{locale.t("ui.news-list-card.keep-reading")}</a
            >
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @media (max-width: 767.98px) {
    .news-list-card.card-news {
      display: block;
      width: 100%;
      min-width: 0;
      max-width: 100%;
      margin-bottom: var(--karento-space-6);
      border-radius: var(--karento-radius-card);
    }
    .news-list-card.card-news .card-image {
      width: 100%;
      max-width: none;
      height: auto;
    }
    .news-list-card.card-news .card-image a {
      display: block;
    }
    .news-list-card.card-news .card-image img {
      display: block;
      width: 100%;
      min-width: 0;
      max-width: 100%;
      height: auto;
      min-height: 0;
      max-height: none;
    }
    .news-list-card.card-news .card-info {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--karento-space-2);
      width: 100%;
      min-width: 0;
      height: auto;
      min-height: 0;
      margin: calc(-1 * var(--karento-space-6)) 0 0;
      padding: var(--karento-space-4);
      border-radius: var(--karento-radius-card);
    }
    .news-list-category {
      position: relative;
      display: inline-flex;
      align-self: flex-start;
      color: var(--bs-neutral-600);
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-eyebrow-weight);
      line-height: var(--karento-type-meta-leading);
      text-decoration: none;
    }
    .news-list-category::before {
      content: "";
      position: absolute;
      inset-inline: 0;
      bottom: calc(-1 * var(--karento-space-2));
      height: max(100%, var(--karento-touch-target));
    }
    .news-list-category:hover,
    .news-list-category:focus-visible {
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .news-list-category:focus-visible {
      outline: 2px solid var(--karento-accent);
      outline-offset: 2px;
    }
    .news-list-card.card-news .card-title,
    .news-list-card.card-news .card-meta,
    .news-list-card.card-news .card-desc,
    .news-list-card.card-news .card-desc p {
      margin: 0;
    }
    .news-list-card.card-news .card-title a {
      font-size: var(--karento-type-compact-card-size);
      font-weight: var(--karento-type-compact-card-weight);
      line-height: var(--karento-type-compact-card-leading);
    }
    .news-list-card.card-news .card-meta {
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: var(--karento-space-1) var(--karento-space-3);
    }
    .news-list-card.card-news .card-meta span {
      padding-inline-end: 0;
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }
    .news-list-card.card-news .card-desc p {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
  }
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
