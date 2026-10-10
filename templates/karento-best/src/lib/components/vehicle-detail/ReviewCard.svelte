<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import FiveStarRating from "./FiveStarRating.svelte";
  import type { DetailReview } from "#lib/data/vehicle-detail.ts";
  let { review }: { review: DetailReview } = $props();
</script>

<div class="item-review review-card"
  ><div class="head-review"
    ><div class="author-review"
      ><img src={review.avatar} alt={locale.t("ui.review-card.carento")} /><div
        class="author-info"
        ><p class="text-lg-bold desktop-type-compact-card">{review.author}</p><p
          class="text-sm-medium neutral-500 desktop-type-meta">{review.date}</p
        ></div
      ></div
    ><div class="rate-review"
      ><FiveStarRating
        source="/assets/imgs/template/icons/star-white.svg"
        imageClass="background-brand-2 p-1"
        spaceBetween
      /></div
    ></div
  ><div class="content-review"
    ><p class="text-sm-medium neutral-800 desktop-type-body-small"
      >{locale.text(review.text)}</p
    ></div
  ></div
>

<style>
  @media (max-width: 767.98px) {
    .item-review {
      padding: var(--karento-space-4);
      margin-bottom: var(--karento-space-3);
      border-radius: var(--karento-radius-card);
    }

    .item-review .head-review {
      display: grid;
      gap: var(--karento-space-2);
      padding-bottom: var(--karento-space-3);
      margin-bottom: var(--karento-space-3);
    }

    .item-review .head-review .author-review {
      gap: var(--karento-space-3);
      margin: 0;
      min-width: 0;
    }

    .item-review .head-review .author-review > img {
      flex: 0 0 auto;
      width: var(--karento-control-field);
      height: var(--karento-control-field);
      margin: 0;
    }

    .author-info {
      min-width: 0;
    }

    .item-review .head-review .author-review .author-info p {
      margin: 0;
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }

    .item-review .head-review .author-review .author-info p:first-child {
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }

    .item-review .rate-review {
      display: flex;
      align-items: center;
      gap: var(--karento-space-1);
      margin: 0;
    }

    .rate-review :global(img) {
      width: var(--karento-space-6);
      height: var(--karento-space-6);
    }

    .item-review .content-review p {
      margin: 0;
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
  }

  @media (min-width: 992px) {
    .item-review.review-card {
      padding: var(--karento-desktop-card-padding);
      margin-bottom: var(--karento-desktop-card-gap);
      border-radius: var(--karento-desktop-card-radius);
    }
    .item-review.review-card .head-review {
      align-items: center;
      flex-wrap: wrap;
      gap: var(--karento-desktop-space-3);
      padding-bottom: var(--karento-desktop-space-4);
      margin-bottom: var(--karento-desktop-space-4);
    }
    .item-review.review-card .author-review img {
      width: var(--karento-desktop-control-height);
      height: var(--karento-desktop-control-height);
      margin-right: var(--karento-desktop-space-3);
    }
  }
</style>
