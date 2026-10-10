<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import ResponsiveCollection from "#lib/components/ResponsiveCollection.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import {
    referenceCarReviews,
    type CarReview,
  } from "#lib/data/home-stories.ts";

  let { items = referenceCarReviews }: { items?: readonly CarReview[] } =
    $props();
</script>

<section class="mobile-car-reviews">
  <div class="container">
    <ResponsiveCollection
      class="review-rail"
      mobileLayout="rail"
      label={locale.t("ui.mobile-car-review-rail.car-reviews")}
    >
      {#each items as item (item.id)}
        <article class="mobile-review-card">
          <img
            class="review-image"
            src={item.image}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <DemoActionLink
            class="mobile-review-link"
            href={locale.href(item.href)}
            aria-label={locale.text(item.title)}
          >
            <span class="review-label"
              >{locale.t("ui.mobile-car-review-rail.car-review")}</span
            >
            <h3>{locale.text(item.title)}</h3>
            <p>{locale.text(item.description)}</p>
            <span class="review-action"
              >{locale.t("ui.mobile-car-review-rail.view-details")}
              <MobileIcon name="arrow-right" /></span
            >
          </DemoActionLink>
        </article>
      {/each}
    </ResponsiveCollection>
  </div>
</section>

<style>
  .mobile-car-reviews {
    padding-block: var(--karento-space-4);
  }
  .mobile-review-card {
    position: relative;
    display: grid;
    overflow: hidden;
    border-radius: var(--karento-radius-card);
    background: var(--bs-neutral-1000);
  }
  .review-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .mobile-review-card :global(.mobile-review-link) {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: end;
    gap: var(--karento-space-3);
    padding: var(--karento-space-4);
    color: var(--bs-neutral-0);
    background: linear-gradient(
      to top,
      var(--bs-neutral-1000),
      color-mix(in srgb, var(--bs-neutral-1000) 50%, transparent)
    );
  }
  .review-label {
    color: var(--bs-neutral-0);
  }
  h3 {
    margin: 0;
    color: var(--bs-neutral-0);
    text-wrap: balance;
  }
  p {
    margin: 0;
    color: var(--bs-neutral-0);
  }
  .review-action {
    display: inline-flex;
    align-items: center;
    gap: var(--karento-space-2);
    padding: var(--karento-space-2) var(--karento-space-3);
    margin-top: var(--karento-space-1);
    border-radius: var(--karento-space-2);
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
  }
  .mobile-review-card :global(.mobile-review-link:focus-visible) {
    outline: 2px solid var(--bs-neutral-0);
    outline-offset: -4px;
  }

  @media (min-width: 768px) {
    .review-label {
      font-size: 0.75rem;
      font-weight: 700;
      line-height: 1.4;
    }
    h3 {
      font-size: var(--karento-text-heading);
      line-height: 1.3;
    }
    p {
      font-size: var(--karento-text-body);
      line-height: 1.45;
    }
    .review-action {
      font-size: var(--karento-text-body);
      font-weight: 700;
      line-height: 1.4;
    }
  }

  @media (max-width: 767.98px) {
    .review-label {
      font-size: var(--karento-type-eyebrow-size);
      font-weight: var(--karento-type-eyebrow-weight);
      line-height: var(--karento-type-eyebrow-leading);
    }
    h3 {
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-section-weight);
      line-height: var(--karento-type-section-leading);
    }
    p {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
    .review-action {
      font-size: var(--karento-type-control-size);
      font-weight: var(--karento-type-control-weight);
      line-height: var(--karento-type-control-leading);
    }
  }
</style>
