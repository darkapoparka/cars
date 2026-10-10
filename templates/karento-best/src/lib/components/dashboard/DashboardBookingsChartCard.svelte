<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { chart } from "#lib/vendor.ts";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
</script>

<div class="card shadow-none flex-fill karento-bookings-chart">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t(
          "ui.dashboard-bookings-chart-card.bookings-statistics",
        )}</span
      >
      <DashboardDropdown config={dashboardDropdowns.bookingsChartPeriod} />
    </div>
  </div>
  <div class="card-body">
    <div class="card shadow-none mb-2">
      <div class="card-body">
        <div id="chart" {@attach chart}></div>
      </div>
    </div>
  </div>
</div>
