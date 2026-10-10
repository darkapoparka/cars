<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dealer } from "#lib/content.ts";
  import { referenceFinanceSettings } from "#lib/data/finance.ts";
  import {
    createLoanCalculatorState,
    type LoanCalculatorState,
  } from "#lib/data/loan-estimate.ts";
  import DetailAccordion from "./DetailAccordion.svelte";
  import DetailOverview from "./DetailOverview.svelte";
  import DetailIncludedFeatures from "./DetailIncludedFeatures.svelte";
  import DetailQuestions from "./DetailQuestions.svelte";
  import LoanCalculator from "./LoanCalculator.svelte";
  import DetailReviews from "./DetailReviews.svelte";
  import DetailReviewForm from "./DetailReviewForm.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import {
    referenceDetailContent,
    referenceProductDetailContent,
    type DetailContent,
  } from "#lib/data/vehicle-detail.ts";
  let {
    product = false,
    details,
    loanState = $bindable(),
  }: {
    product?: boolean;
    details?: DetailContent;
    loanState?: LoanCalculatorState;
  } = $props();
  let content = $derived(
    details ??
      (product ? referenceProductDetailContent : referenceDetailContent),
  );
  const idBase = $props.id();
  const mobile = new MediaQuery("(max-width: 767.98px)");
  const finance = dealer.finance ?? referenceFinanceSettings;
  const localLoanState = $state(
    createLoanCalculatorState(finance.defaults, finance.currency),
  );
  let calculatorState = $derived(loanState ?? localLoanState);
</script>

<div class="box-collapse-expand">
  <DetailAccordion
    id="collapseOverview"
    title={locale.t("ui.vehicle-detail-panels.overview")}
    ><DetailOverview paragraphs={content.overview} /></DetailAccordion
  >
  <DetailAccordion
    id="collapseItinerary"
    title={product ? "About this item" : "Included in the price"}
    mobileOpen={false}
    ><DetailIncludedFeatures
      items={content.includedFeatures}
    /></DetailAccordion
  >
  <DetailAccordion
    id="collapseQuestion"
    title={locale.t("ui.vehicle-detail-panels.question-answers")}
    mobileOpen={false}
    ><DetailQuestions questions={content.questions} /></DetailAccordion
  >
  {#if !dealer.businessPreview && !product && mobile.current}
    <div class="py-3">
      <LoanCalculator
        fields={content.loanFields}
        summary={content.loanSummary}
        bind:state={calculatorState}
      />
    </div>
  {/if}
  {#if !dealer.businessPreview && !product && !mobile.current}<DetailAccordion
      id={idBase + "-collapseCalculator"}
      title={locale.t("ui.vehicle-detail-panels.car-loan-calculator")}
      stateKey={idBase + "-calculator"}
      stateValue="#collapseCalculator"
      ><LoanCalculator
        fields={content.loanFields}
        summary={content.loanSummary}
        bind:state={calculatorState}
      /></DetailAccordion
    >{/if}
  {#if !dealer.businessPreview}<DetailAccordion
      id="collapseReviews"
      title={locale.t("ui.vehicle-detail-panels.rate-reviews")}
      mobileOpen={false}
      ><DetailReviews
        reviews={content.reviews}
        metrics={content.reviewMetrics}
        summary={content.reviewSummary}
      /></DetailAccordion
    >
    <DetailAccordion
      id={idBase + "-collapseAddReview-1"}
      title={locale.t("ui.vehicle-detail-panels.add-a-review")}
      stateKey={idBase + "-reviews"}
      stateValue="#collapseAddReview"
      mobileOpen={false}
      ><DetailReviewForm metrics={content.reviewMetrics} /></DetailAccordion
    >{/if}
</div>
