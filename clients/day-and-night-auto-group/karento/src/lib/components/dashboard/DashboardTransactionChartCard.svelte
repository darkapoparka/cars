<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { chart } from "#lib/vendor.ts";
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <p class="neutral-1000 text-md-bold fs-5 py-1 desktop-type-panel"
      >{locale.t(
        "ui.dashboard-transaction-chart-card.transaction-data-analysis",
      )}</p
    >
  </div>
  <div class="card-body">
    <div id="chart-2" {@attach chart}></div>
  </div>
</div>
