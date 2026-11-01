<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ListingPagination from "#lib/components/vehicle-listing/ListingPagination.svelte";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
  import { dashboardBookingRows } from "#lib/data/dashboard.ts";
  import DashboardBookingTable from "#lib/components/dashboard/DashboardBookingTable.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import type { CatalogText } from "#lib/i18n/text.ts";
  import { recentDashboardItems } from "#lib/data/dashboard-mobile.ts";
  const phone = new MediaQuery("(max-width: 767.98px)");
  let selection = $state<CatalogText>();
  const rows = $derived(
    phone.current
      ? recentDashboardItems(
          dashboardBookingRows.ownerInvoices,
          selection,
          (item) => Date.parse(item.date),
        )
      : dashboardBookingRows.ownerInvoices,
  );
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t("ui.dashboard-invoices-card.latest-invoices")}</span
      >
      <DashboardDropdown
        config={dashboardDropdowns.invoicesPeriod}
        bind:selection
      />
    </div>
  </div>
  <div class="card-body">
    {#if phone.current}<span
        class="visually-hidden"
        aria-live="polite"
        aria-atomic="true">{locale.count(rows.length, "results")}</span
      >{/if}
    <div class="table-responsive">
      <DashboardBookingTable {rows} />
    </div>
    <ListingPagination />
  </div>
</div>
