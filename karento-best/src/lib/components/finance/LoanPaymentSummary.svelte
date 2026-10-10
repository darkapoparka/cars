<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { LoanPaymentRow } from "#lib/data/finance.ts";
  let {
    rows,
    class: className = "row py-4",
  }: {
    rows: readonly LoanPaymentRow[];
    class?: string;
  } = $props();
</script>

<div class={className}>
  <div class="col-md-5 col-8 d-flex flex-column gap-1">
    {#each rows as row (row.key)}
      <p class="text-sm-bold neutral-1000 desktop-type-label"
        >{locale.text(row.label)}</p
      >
    {/each}
  </div>
  <div
    class="col-md-7 col-4 d-flex flex-column gap-1 align-items-end align-items-md-start"
  >
    {#each rows as row (row.key)}
      <p
        class={[
          "text-sm-bold",
          row.emphasized ? "desktop-type-price" : "desktop-type-body-small",
          row.emphasized ? "text-primary-dark" : "neutral-1000",
        ]}>{row.value}</p
      >
    {/each}
  </div>
</div>
