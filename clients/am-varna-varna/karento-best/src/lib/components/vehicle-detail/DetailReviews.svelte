<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ReviewSummary from "./ReviewSummary.svelte";
  import ReviewCard from "./ReviewCard.svelte";
  import ReviewPagination from "./ReviewPagination.svelte";
  import {
    referenceReviews,
    referenceReviewMetrics,
    referenceReviewSummary,
    type DetailReviewSummary,
    type DetailReview,
    type ReviewMetric,
  } from "#lib/data/vehicle-detail.ts";
  let {
    reviews = referenceReviews,
    metrics = referenceReviewMetrics,
    summary = referenceReviewSummary,
  }: {
    reviews?: readonly DetailReview[];
    metrics?: readonly ReviewMetric[];
    summary?: DetailReviewSummary;
  } = $props();
</script>

<div class="card card-body"
  ><ReviewSummary {metrics} {summary} /><div class="list-reviews"
    >{#each reviews as review (review.id)}<ReviewCard {review} />{/each}</div
  ><nav aria-label={locale.t("ui.detail-reviews.page-navigation-example")}
    ><ReviewPagination /></nav
  ></div
>
