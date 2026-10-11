<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ResponsiveCollection from "#lib/components/ResponsiveCollection.svelte";
  import MobileSectionHeading from "#lib/components/mobile/MobileSectionHeading.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import {
    referenceUpcomingNews,
    type NewsStory,
  } from "#lib/data/home-stories.ts";

  let { items = referenceUpcomingNews }: { items?: readonly NewsStory[] } =
    $props();
</script>

<section
  class="mobile-news"
  aria-label={locale.t("ui.mobile-news-collection.upcoming-cars-and-events")}
>
  <div class="container">
    <MobileSectionHeading
      title={locale.t("referenceHome.news.title")}
      actionLabel={locale.t("referenceHome.news.viewMore")}
      actionHref="/news"
    />
    <ResponsiveCollection
      class="news-collection"
      mobileLayout="rail"
      label={locale.t("ui.mobile-news-collection.car-news")}
    >
      {#each items as item (item.id)}
        <article class="mobile-news-card">
          <div class="news-image"
            ><img
              src={item.image}
              width={item.imageWidth}
              height={item.imageHeight}
              alt=""
              loading="lazy"
              decoding="async"
            /></div
          >
          <div class="news-content">
            <div class="news-meta-row">
              <a class="news-category" href={locale.href(item.categoryHref)}
                >{locale.text(item.category)}</a
              >
              <p class="news-meta"
                >{locale.date(item.date)} · {locale.text(item.readTime)}</p
              >
            </div>
            <h4>{locale.text(item.title)}</h4>
            <div class="news-author-row">
              <div class="news-author">
                <img
                  src={item.avatar}
                  alt=""
                  width="32"
                  height="32"
                  loading="lazy"
                  decoding="async"
                />
                <strong>{item.author}</strong>
              </div>
              <div class="news-read-more">
                <MobilePill
                  label={locale.t("ui.mobile-news-collection.read-more")}
                  href={locale.href(item.href)}
                  ariaLabel={locale.t("referenceHome.news.read", {
                    title: locale.text(item.title),
                  })}
                  variant="secondary"
                />
              </div>
            </div>
          </div>
          <a
            class="news-story"
            href={locale.href(item.href)}
            aria-label={locale.text(item.title)}
          ></a>
        </article>
      {/each}
    </ResponsiveCollection>
  </div>
</section>

<style>
  .mobile-news {
    padding-block: var(--karento-space-6);
  }
  .mobile-news-card {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--bs-neutral-200);
    border-radius: var(--karento-radius-card);
    background: var(--bs-background-card);
  }
  .news-story {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 1;
    color: var(--bs-neutral-1000);
  }

  .news-story:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: -2px;
  }
  .news-image {
    display: block;
    overflow: hidden;
  }
  .news-image img {
    display: block;
    width: 100%;
    height: auto;
  }
  .news-content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--karento-space-2);
    padding: var(--karento-space-4);
    margin-top: calc(-1 * var(--karento-space-6));
    border-radius: var(--karento-radius-card);
    background: var(--bs-background-card);
  }
  .news-category {
    display: inline-flex;
    position: relative;
    z-index: 2;
    text-decoration: none;
  }
  .news-category::before {
    content: "";
    position: absolute;
    inset-inline: 0;
    bottom: calc(-1 * var(--karento-space-2));
    height: max(100%, var(--karento-touch-target));
  }
  .news-category:hover,
  .news-category:focus-visible {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .news-category:focus-visible {
    outline: 2px solid var(--karento-accent);
    outline-offset: 2px;
  }
  h4 {
    margin: 0;
  }
  .news-author-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--karento-space-3);
  }
  .news-author {
    display: flex;
    align-items: center;
    gap: var(--karento-space-2);
    min-width: 0;
  }
  .news-author img {
    flex: none;
    width: var(--karento-space-8);
    height: var(--karento-space-8);
    object-fit: contain;
    border-radius: 50%;
  }
  .news-author strong {
    min-width: 0;
  }
  .news-meta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--karento-space-2);
  }
  .news-read-more {
    position: relative;
    z-index: 2;
    flex: none;
  }
  .news-category,
  .news-meta {
    color: var(--bs-neutral-600);
  }
  .news-meta {
    margin: 0;
  }

  @media (min-width: 768px) {
    .news-category {
      font-weight: 500;
    }
    h4 {
      font-size: var(--karento-text-subheading);
      line-height: 1.35;
    }
    .news-author strong {
      font-size: 0.8125rem;
      line-height: 1.35;
    }
    .news-category,
    .news-meta {
      font-size: 0.75rem;
      line-height: 1.5;
    }
  }

  @media (max-width: 767.98px) {
    h4 {
      font-size: var(--karento-type-compact-card-size);
      font-weight: var(--karento-type-compact-card-weight);
      line-height: var(--karento-type-compact-card-leading);
    }
    .news-category,
    .news-meta {
      font-size: var(--karento-type-meta-size);
      line-height: var(--karento-type-meta-leading);
    }
    .news-category {
      font-weight: var(--karento-type-eyebrow-weight);
    }
    .news-meta {
      font-weight: var(--karento-type-meta-weight);
    }
    .news-author strong {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-label-weight);
      line-height: var(--karento-type-body-small-leading);
    }
  }
</style>
