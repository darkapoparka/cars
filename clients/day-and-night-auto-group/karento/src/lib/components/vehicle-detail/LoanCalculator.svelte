<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import LoanCard from "#lib/components/finance/LoanCard.svelte";
  import { referenceLoanCard, type LoanFieldKey } from "#lib/data/finance.ts";
  import type {
    DetailLoanSummary,
    DetailLoanField,
  } from "#lib/data/vehicle-detail.ts";
  import type { LoanCalculatorState } from "#lib/data/loan-estimate.ts";
  let {
    fields,
    state = $bindable(),
  }: {
    fields?: readonly DetailLoanField[];
    /** Legacy reference summary is accepted; displayed results are calculated. */
    summary?: DetailLoanSummary;
    state?: LoanCalculatorState;
  } = $props();
  const idBase = $props.id();
  const detailFieldIds: Record<LoanFieldKey, string> = {
    price: "price-of-vehicle",
    annualRate: "interest-rate",
    termMonths: "terms",
    downPayment: "down-payment",
  };
  let content = $derived({
    ...referenceLoanCard,
    fields: referenceLoanCard.fields.map((field) => {
      const supplied = fields?.find(
        (detailField) => detailField.id === detailFieldIds[field.key],
      );
      // Rate and term retain explicit percent/month units from the shared tool.
      return supplied && (field.key === "price" || field.key === "downPayment")
        ? { ...field, label: supplied.label }
        : field;
    }),
  });
</script>

<LoanCard
  fieldIdPrefix={idBase}
  class="mb-30 background-100 p-md-5 p-4 rounded-3 mt-lg-0 mt-30 detail-loan-calculator"
  {content}
  bind:state
  showHeading={false}
/>
