<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import FiveStarRating from "./FiveStarRating.svelte";
  import {
    referenceReviewMetrics,
    referenceReviewSummary,
    type DetailReviewSummary,
    type ReviewMetric,
  } from "#lib/data/vehicle-detail.ts";
  let {
    metrics = referenceReviewMetrics,
    summary = referenceReviewSummary,
  }: { metrics?: readonly ReviewMetric[]; summary?: DetailReviewSummary } =
    $props();
</script>

<div class="head-reviews">
  <div class="review-left">
    <div class="review-info-inner">
      <h6 class="neutral-1000 desktop-type-stat-compact">{summary.rating}</h6>
      <p class="text-sm-medium neutral-400 desktop-type-meta"
        >{locale.text(summary.count)}</p
      >
      <div class="review-rate"
        >{#if summary.count}<FiveStarRating source="/assets/imgs/page/tour-detail/star.svg" />{/if}</div
      >
    </div>
  </div>
  <div class="review-right">
    <div class="review-progress"
      >{#each metrics as metric (metric.id)}
        <div class="item-review-progress"
          ><div class="text-rv-progress"
            ><p class="text-sm-bold desktop-type-label"
              >{locale.text(metric.label)}</p
            ></div
          ><div class="bar-rv-progress"
            ><div class="progress"><div class={metric.progressClass}></div></div
            ></div
          ><div class="text-avarage"
            ><p class="desktop-type-body-small">{metric.average}</p></div
          ></div
        >
      {/each}</div
    >
  </div>
</div>

<style>
  @media (max-width: 767.98px) {
    .head-reviews {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--karento-space-4);
      margin-bottom: var(--karento-space-4);
    }

    .head-reviews .review-left {
      width: 100%;
      height: auto;
      min-width: 0;
      max-width: none;
      margin: 0;
      padding: var(--karento-space-4);
      border-radius: var(--karento-radius-card);
      line-height: normal;
      text-align: left;
    }

    .head-reviews .review-left .review-info-inner {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      align-items: center;
      gap: var(--karento-space-1) var(--karento-space-3);
      width: 100%;
    }

    .review-info-inner h6 {
      grid-row: 1 / 3;
      margin: 0;
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-price-weight);
      line-height: var(--karento-type-price-leading);
    }

    .head-reviews .review-left .review-info-inner p {
      margin: 0;
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }

    .review-rate {
      display: flex;
      align-items: center;
      gap: var(--karento-space-1);
    }

    .head-reviews .review-right {
      margin: 0;
    }

    .review-progress {
      display: grid;
      gap: var(--karento-space-3);
    }

    .head-reviews .item-review-progress {
      display: grid;
      grid-template-columns: minmax(0, 1fr) max-content;
      gap: var(--karento-space-1) var(--karento-space-2);
      margin: 0;
    }

    .head-reviews .item-review-progress .text-rv-progress {
      width: auto;
    }

    .head-reviews .item-review-progress .text-avarage {
      grid-column: 2;
      grid-row: 1;
      min-width: 0;
    }

    .head-reviews .item-review-progress .bar-rv-progress {
      grid-column: 1 / -1;
      grid-row: 2;
      width: auto;
      padding: 0;
    }

    .head-reviews .item-review-progress p {
      margin: 0;
      font-size: var(--karento-type-label-size);
      font-weight: var(--karento-type-label-weight);
      line-height: var(--karento-type-label-leading);
    }

    .head-reviews .item-review-progress .text-avarage p {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }

    .head-reviews .item-review-progress .progress {
      height: var(--karento-space-2);
      border-radius: var(--karento-radius-pill);
    }
  }

  @media (min-width: 992px) {
    .head-reviews {
      gap: var(--karento-desktop-panel-gap);
      margin-bottom: var(--karento-desktop-panel-gap);
    }
    .head-reviews .review-left {
      border-radius: var(--karento-desktop-card-radius);
    }
    .head-reviews .review-right {
      margin-left: 0;
    }
    .item-review-progress {
      margin-bottom: var(--karento-desktop-space-3);
    }
  }
</style>
