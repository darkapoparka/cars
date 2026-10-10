<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ListingPagination from "#lib/components/vehicle-listing/ListingPagination.svelte";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
  import { dashboardBookingRows } from "#lib/data/dashboard.ts";
  import DashboardBookingTable from "#lib/components/dashboard/DashboardBookingTable.svelte";
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
            type="text"
            class="input-small"
            placeholder={locale.t("ui.dashboard-bookings-card.search")}
            aria-label={locale.t("ui.dashboard-bookings-card.search")}
          />
        </div>
        <DashboardDropdown config={dashboardDropdowns.bookingsVehicleType} />
        <DashboardDropdown config={dashboardDropdowns.bookingsSort} />
      </div>
    </div>
  </div>
  <div class="card-body">
    <div class="card shadow-none mb-2">
      <div class="table-responsive">
        <DashboardBookingTable
          rows={dashboardBookingRows.memberBookings}
          showActions
        />
      </div>
      <ListingPagination />
    </div>
  </div>
</div>
