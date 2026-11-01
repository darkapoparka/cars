<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import FiveStarRating from "./FiveStarRating.svelte";
  import DemoForm from "#lib/components/DemoForm.svelte";
  import {
    referenceReviewMetrics,
    type ReviewMetric,
  } from "#lib/data/vehicle-detail.ts";
  let {
    metrics = referenceReviewMetrics,
  }: { metrics?: readonly ReviewMetric[] } = $props();
  let metricColumns = $derived(
    [metrics.slice(0, 2), metrics.slice(2, 4), metrics.slice(4, 6)].filter(
      (column) => column.length,
    ),
  );
</script>

<div class="card card-body">
  <div class="box-type-reviews"
    ><div class="row"
      >{#each metricColumns as column (column[0].id)}<div class="col-lg-4"
          >{#each column as metric (metric.id)}<div class="box-type-review"
              ><p class="text-sm-bold text-type-rv desktop-type-label"
                >{locale.text(metric.label)}</p
              ><p class="rate-type-review"
                ><FiveStarRating
                  source="/assets/imgs/page/tour-detail/star-big.svg"
                /></p
              ></div
            >{/each}</div
        >{/each}</div
    ></div
  >
  <DemoForm class="box-form-reviews">
    <h6 class="text-md-bold neutral-1000 mb-15 desktop-type-compact-card"
      >{locale.t("ui.detail-review-form.leave-feedback")}</h6
    >
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <input
            class="form-control desktop-type-body-small"
            type="text"
            name="reviewer"
            autocomplete="name"
            placeholder={locale.t("ui.detail-review-form.your-name")}
            aria-label={locale.t("ui.detail-review-form.your-name")}
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <input
            class="form-control desktop-type-body-small"
            type="email"
            name="email"
            autocomplete="email"
            placeholder={locale.t("ui.detail-review-form.email-address")}
            aria-label={locale.t("ui.detail-review-form.email-address")}
          />
        </div>
      </div>
      <div class="col-md-12">
        <div class="form-group">
          <textarea
            class="form-control desktop-type-body-small"
            name="comment"
            placeholder={locale.t("ui.detail-review-form.your-comment")}
            aria-label={locale.t("ui.detail-review-form.your-comment")}
          ></textarea>
        </div>
      </div>
      <div class="col-md-12">
        <button
          class="btn btn-primary desktop-type-control desktop-panel-action"
          type="submit"
        >
          {locale.t("ui.detail-review-form.submit-review")}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M8 15L15 8L8 1M15 8L1 8"
              stroke=""
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </DemoForm>
</div>

<style>
  @media (min-width: 992px) {
    .box-type-reviews {
      margin-bottom: var(--karento-desktop-space-6);
    }
    .box-type-review {
      gap: var(--karento-desktop-space-3);
      margin-bottom: var(--karento-desktop-space-3);
    }
    .card-body :global(.row) {
      --bs-gutter-x: var(--karento-desktop-grid-gap);
    }
    .card-body :global(.form-group) {
      margin-bottom: var(--karento-desktop-space-4);
    }
    .card-body :global(input.form-control) {
      height: var(--karento-desktop-control-height);
    }
    .card-body :global(.form-control) {
      border-radius: var(--karento-desktop-control-radius);
    }
  }
</style>
