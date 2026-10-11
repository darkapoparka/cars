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
  const phonePeriod = {
    ...dashboardDropdowns.earningsPeriod,
    options: dashboardDropdowns.bookingsChartPeriod.options,
  };
  const periodChart = $derived(
    phone.current ? chartForPeriod(dashboardRecentSelected(selection)) : chart,
  );
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t("ui.dashboard-earnings-card.earnings")}</span
      >
      <DashboardDropdown
        config={phone.current ? phonePeriod : dashboardDropdowns.earningsPeriod}
        bind:selection
      />
    </div>
  </div>
  <div class="card-body">
    <p class="desktop-type-body-small"
      >{locale.t("ui.dashboard-earnings-card.total-earnings")}</p
    >
    <div class="d-flex align-items-end gap-3">
      <h6 class="text-primary-dark desktop-type-price">$125.987</h6>
      <span
        ><span class="text-success me-2"
          ><i class="fi fi-rr-arrow-small-up"></i>5%</span
        >{locale.t(
          "reference.ancillary.DashboardEarningsCard.vs-last-years",
        )}</span
      >
    </div>

    <div class="card shadow-none mb-2 mt-3">
      <div class="card-body">
        <div id="chart-3" {@attach periodChart}></div>
      </div>
    </div>
  </div>
</div>
