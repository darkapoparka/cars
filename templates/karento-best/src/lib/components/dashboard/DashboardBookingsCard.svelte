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
  import {
    dashboardBookingTypeConfig,
    dashboardBookingSortConfig,
    matchDashboardBookings,
  } from "#lib/data/dashboard-mobile.ts";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  const phone = new MediaQuery("(max-width: 767.98px)");
  let query = $state("");
  let vehicleType = $state<CatalogText>();
  let sort = $state<CatalogText>();
  const typeConfig = $derived(
    dashboardBookingTypeConfig(
      dashboardDropdowns.bookingsVehicleType,
      dashboardBookingRows.memberBookings,
      locale.text,
    ),
  );
  const sortConfig = dashboardBookingSortConfig(
    dashboardDropdowns.bookingsSort,
  );
  const rows = $derived(
    phone.current
      ? matchDashboardBookings(
          dashboardBookingRows.memberBookings,
          query,
          vehicleType,
          sort,
          locale.text,
        )
      : dashboardBookingRows.memberBookings,
  );
  function clear(event: MouseEvent) {
    query = "";
    vehicleType = undefined;
    sort = undefined;
    (event.currentTarget as HTMLElement)
      .closest(".card.flex-fill")
      ?.querySelector<HTMLInputElement>("input")
      ?.focus({ preventScroll: true });
  }
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t("ui.dashboard-bookings-card.booking-list")}</span
      >
      <div class="fillter d-flex gap-2">
        <div class="input-icon-start position-relative">
          <span class="icon-addon">
            <i class="fi fi-rr-search"></i>
          </span>
          <input
            type={phone.current ? "search" : "text"}
            bind:value={query}
            class="input-small"
            placeholder={locale.t("ui.dashboard-bookings-card.search")}
            aria-label={locale.t("ui.dashboard-bookings-card.search")}
          />
        </div>
        <DashboardDropdown
          config={phone.current
            ? typeConfig
            : dashboardDropdowns.bookingsVehicleType}
          bind:selection={vehicleType}
        />
        <DashboardDropdown
          config={phone.current ? sortConfig : dashboardDropdowns.bookingsSort}
          bind:selection={sort}
        />
      </div>
    </div>
  </div>
  <div class="card-body">
    {#if phone.current}<span
        class="visually-hidden"
        aria-live="polite"
        aria-atomic="true">{locale.count(rows.length, "results")}</span
      >{/if}
    <div class="card shadow-none mb-2">
      {#if phone.current && rows.length === 0}
        <div class="py-4 text-center">
          <p class="neutral-500 mb-3">{locale.count(0, "results")}</p>
          <MobilePill
            label={locale.t("ui.mobile-catalog.clear-filters")}
            variant="secondary"
            onclick={clear}
          />
        </div>
      {:else}
        <div class="table-responsive">
          <DashboardBookingTable {rows} showActions />
        </div>
      {/if}
      <ListingPagination />
    </div>
  </div>
</div>
