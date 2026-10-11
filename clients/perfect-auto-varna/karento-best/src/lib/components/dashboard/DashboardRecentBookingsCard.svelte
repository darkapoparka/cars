<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dashboardRecentBookings } from "#lib/data/dashboard.ts";
  import DashboardRecentBookingItem from "./DashboardRecentBookingItem.svelte";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import type { CatalogText } from "#lib/i18n/text.ts";
  import {
    dashboardReferenceDate,
    recentDashboardItems,
  } from "#lib/data/dashboard-mobile.ts";
  const phone = new MediaQuery("(max-width: 767.98px)");
  let selection = $state<CatalogText>();
  const bookings = $derived(
    phone.current
      ? recentDashboardItems(dashboardRecentBookings, selection, (item) =>
          dashboardReferenceDate(item.date),
        )
      : dashboardRecentBookings,
  );
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t("ui.dashboard-recent-bookings-card.recent-bookings")}</span
      >
      <DashboardDropdown
        config={dashboardDropdowns.recentBookingsPeriod}
        bind:selection
      />
    </div>
  </div>
  <div class="card-body"
    >{#if phone.current}<span
        class="visually-hidden"
        aria-live="polite"
        aria-atomic="true">{locale.count(bookings.length, "results")}</span
      >{/if}{#each bookings as booking (booking.id)}<DashboardRecentBookingItem
        {booking}
      />{/each}</div
  >
</div>
