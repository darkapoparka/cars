<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dashboardRecentBookings } from "#lib/data/dashboard.ts";
  import DashboardRecentBookingItem from "./DashboardRecentBookingItem.svelte";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t("ui.dashboard-recent-bookings-card.recent-bookings")}</span
      >
      <DashboardDropdown config={dashboardDropdowns.recentBookingsPeriod} />
    </div>
  </div>
  <div class="card-body"
    >{#each dashboardRecentBookings as booking (booking.id)}<DashboardRecentBookingItem
        {booking}
      />{/each}</div
  >
</div>
