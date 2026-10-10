<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import {
    referenceLoanCard,
    type LoanFieldContent,
    type LoanFieldKey,
  } from "#lib/data/finance.ts";
  import type {
    LoanEstimateDraft,
    LoanEstimateErrors,
  } from "#lib/data/loan-estimate.ts";
  let {
    fieldIdPrefix,
    fields = referenceLoanCard.fields,
    values = $bindable(),
    errors = {},
    currency,
    onfieldinput,
  }: {
    fieldIdPrefix: string;
    fields?: readonly LoanFieldContent[];
    values: LoanEstimateDraft;
    errors?: LoanEstimateErrors;
    currency: string;
    onfieldinput?: (field: LoanFieldKey) => void;
  } = $props();
  const validationMessages = {
    price: "referenceFinance.validation.price",
    annualRate: "referenceFinance.validation.rate",
    termMonths: "referenceFinance.validation.term",
    downPayment: "referenceFinance.validation.downPayment",
  } as const;
</script>

{#each fields as field (field.key)}
  {@const id = fieldIdPrefix + "-" + field.key}
  <div class="col-lg-6">
    <div class="form-group">
      <label class="text-sm-medium neutral-1000 desktop-type-label" for={id}
        >{locale.text(
          field.label,
        )}{#if field.key === "price" || field.key === "downPayment"}
          ({currency}){/if}</label
      >
      <input
        class="form-control desktop-type-body-small"
        type="number"
        inputmode={field.key === "termMonths" ? "numeric" : "decimal"}
        min={field.key === "termMonths" ? 1 : 0}
        max={field.key === "downPayment" ? values.price : undefined}
        step={field.key === "termMonths" ? 1 : 0.01}
        bind:value={values[field.key]}
        oninput={() => onfieldinput?.(field.key)}
        {id}
        aria-invalid={errors[field.key] ? true : undefined}
        aria-describedby={errors[field.key] ? id + "-error" : undefined}
      />
      {#if errors[field.key]}
        <p
          id={id + "-error"}
          class="text-sm-medium neutral-500 desktop-type-body-small"
        >
          {locale.t(validationMessages[field.key])}
        </p>
      {/if}
    </div>
  </div>
{/each}

<style>
  @media (min-width: 992px) {
    .form-group {
      margin-bottom: var(--karento-desktop-space-4);
    }
    .form-group label {
      margin-bottom: var(--karento-desktop-space-2);
    }
    .form-control {
      height: var(--karento-desktop-control-height);
      border-radius: var(--karento-desktop-control-radius);
    }
  }
</style>
