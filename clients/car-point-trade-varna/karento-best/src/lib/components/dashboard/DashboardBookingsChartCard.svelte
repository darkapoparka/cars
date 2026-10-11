<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { chart, chartForPeriod } from "#lib/vendor.ts";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import type { CatalogText } from "#lib/i18n/text.ts";
  import { dashboardRecentSelected } from "#lib/data/dashboard-mobile.ts";
  const phone = new MediaQuery("(max-width: 767.98px)");
  let selection = $state<CatalogText>();
  const periodChart = $derived(
    phone.current ? chartForPeriod(dashboardRecentSelected(selection)) : chart,
  );
</script>

<div class="card shadow-none flex-fill karento-bookings-chart">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t(
          "ui.dashboard-bookings-chart-card.bookings-statistics",
        )}</span
      >
      <DashboardDropdown
        config={dashboardDropdowns.bookingsChartPeriod}
        bind:selection
      />
    </div>
  </div>
  <div class="card-body">
    <div class="card shadow-none mb-2">
      <div class="card-body">
        <div id="chart" {@attach periodChart}></div>
      </div>
    </div>
  </div>
</div>
