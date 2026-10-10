<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dealer } from "#lib/content.ts";
  import {
    referenceLoanCard,
    referenceFinanceSettings,
    type LoanCardContent,
    type LoanPaymentRow,
  } from "#lib/data/finance.ts";
  import {
    calculateLoanEstimate,
    createLoanCalculatorState,
    type LoanCalculatorState,
  } from "#lib/data/loan-estimate.ts";
  import LoanFields from "./LoanFields.svelte";
  import LoanPaymentSummary from "./LoanPaymentSummary.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import MobileLoanCard from "./MobileLoanCard.svelte";
  let {
    fieldIdPrefix,
    class:
      className = "mb-30 background-card p-md-5 p-4 rounded-3 mt-lg-0 mt-30",
    summaryClass = "row py-4",
    headingId,
    headingClass = "neutral-1000 mb-2",
    content = referenceLoanCard,
    showHeading = true,
    mobileFeatured = false,
    state: suppliedState = $bindable(),
  }: {
    fieldIdPrefix: string;
    class?: string;
    summaryClass?: string;
    headingId?: string;
    headingClass?: string;
    content?: LoanCardContent;
    showHeading?: boolean;
    mobileFeatured?: boolean;
    state?: LoanCalculatorState;
  } = $props();
  const mobile = new MediaQuery("(max-width: 767.98px)");
  const finance = dealer.finance ?? referenceFinanceSettings;
  const vehicleOptions = (finance.vehicleOptions ?? []).filter(
    (vehicle) =>
      Number.isFinite(vehicle.priceAmount) && vehicle.priceAmount > 0,
  );
  const localState = $state(
    createLoanCalculatorState(finance.defaults, finance.currency),
  );
  let calculator = $derived(suppliedState ?? localState);
  let estimate = $derived(calculateLoanEstimate(calculator.values));
  let errors = $derived(estimate.valid ? {} : estimate.errors);
  let payments = $derived<readonly LoanPaymentRow[]>(
    estimate.valid
      ? [
          {
            key: "downPayment",
            label: locale.t("referenceFinance.downPayment"),
            value: locale.money(estimate.downPayment, calculator.currency),
          },
          {
            key: "financed",
            label: locale.t("referenceFinance.financed"),
            value: locale.money(estimate.financed, calculator.currency),
          },
          {
            key: "monthly",
            label: locale.t("referenceFinance.monthly"),
            value: locale.money(estimate.monthly, calculator.currency),
            emphasized: true,
          },
        ]
      : [],
  );

  function selectVehicle(event: Event & { currentTarget: HTMLSelectElement }) {
    calculator.selectedVehicleId = event.currentTarget.value;
    const vehicle = vehicleOptions.find(
      (option) => option.id === calculator.selectedVehicleId,
    );
    if (vehicle) {
      calculator.values.price = vehicle.priceAmount;
      calculator.currency = vehicle.currency;
    }
  }
</script>

{#snippet calculatorBody(paymentClass: string)}
  {#if vehicleOptions.length}
    <div class="col-lg-12">
      <div class="form-group">
        <label
          class="text-sm-medium neutral-1000 desktop-type-label"
          for={fieldIdPrefix + "-vehicle"}
          >{locale.t("referenceFinance.selectVehicle")}</label
        >
        <select
          class="form-control desktop-type-body-small"
          id={fieldIdPrefix + "-vehicle"}
          value={calculator.selectedVehicleId}
          onchange={selectVehicle}
        >
          <option value="">{locale.t("referenceFinance.manualPrice")}</option>
          {#each vehicleOptions as vehicle (vehicle.id)}
            <option value={vehicle.id}
              >{vehicle.title} · {locale.money(
                vehicle.priceAmount,
                vehicle.currency,
              )}</option
            >
          {/each}
        </select>
      </div>
    </div>
  {/if}
  <LoanFields
    {fieldIdPrefix}
    fields={content.fields}
    bind:values={calculator.values}
    {errors}
    currency={calculator.currency}
    onfieldinput={(field) => {
      if (field === "price") calculator.selectedVehicleId = "";
    }}
  />
  {#if estimate.valid}
    <LoanPaymentSummary rows={payments} class={paymentClass} />
  {:else if estimate.calculationError}
    <p class="text-sm-medium neutral-500 desktop-type-body-small" role="status">
      {locale.t("referenceFinance.validation.calculation")}
    </p>
  {/if}
{/snippet}

<div
  class={[
    className,
    "desktop-panel loan-card",
    { "mobile-loan-card": mobile.current },
  ]}
>
  {#if mobile.current}
    {#snippet mobileLoanBody()}
      {@render calculatorBody("row mobile-loan-summary")}
    {/snippet}
    <MobileLoanCard
      featured={mobileFeatured}
      id={headingId}
      title={locale.text(content.title)}
      actionLabel={locale.t("referenceFinance.discussFinance")}
      actionHref={locale.href("/contact#contact-enquiry")}
      note={locale.t("referenceFinance.estimateNote")}
      body={mobileLoanBody}
    />
  {:else}
    {#if showHeading}
      <h2
        id={headingId}
        tabindex="-1"
        class={[headingClass, "desktop-type-panel"]}
        >{locale.text(content.title)}</h2
      >
      <p class="text-sm-medium neutral-500 mb-25 desktop-type-body-small"
        >{locale.text(content.description)}</p
      >
    {/if}
    <div class="form-contact">
      <div class="row">
        {@render calculatorBody(summaryClass)}
        <p
          class="text-sm-medium neutral-500 desktop-type-body-small loan-estimate-note"
        >
          {locale.t("referenceFinance.estimateNote")}
        </p>
        <div class="col-lg-12">
          <a
            class="btn btn-book desktop-type-control desktop-panel-action"
            href={locale.href("/contact#contact-enquiry")}
          >
            {locale.t("referenceFinance.discussFinance")}
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  @media (min-width: 992px) {
    .loan-card > h2 {
      margin-bottom: var(--karento-desktop-space-2) !important;
    }
    .loan-card > p {
      margin-bottom: var(--karento-desktop-space-6) !important;
    }
    .loan-card .form-contact :global(.row) {
      --bs-gutter-x: var(--karento-desktop-grid-gap);
    }
    .loan-estimate-note {
      margin-bottom: var(--karento-desktop-space-4);
    }
  }
</style>
