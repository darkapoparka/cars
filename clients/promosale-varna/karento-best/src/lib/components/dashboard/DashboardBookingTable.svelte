<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardBooking } from "#lib/data/dashboard.ts";
  import DashboardBookingRow from "./DashboardBookingRow.svelte";
  let {
    rows,
    showActions = false,
  }: { rows: readonly DashboardBooking[]; showActions?: boolean } = $props();
</script>

<table class="table datatable table-striped">
  <thead class="thead-light">
    <tr>
      <th>{locale.t("ui.dashboard-booking-table.id")}</th>
      <th>{locale.t("ui.dashboard-booking-table.car-type")}</th>
      <th>{locale.t("ui.dashboard-booking-table.travellers")}</th>
      <th>{locale.t("ui.dashboard-booking-table.days")}</th>
      <th>{locale.t("ui.dashboard-booking-table.price")}</th>
      <th>{locale.t("ui.dashboard-booking-table.date")}</th>
      <th>{locale.t("ui.dashboard-booking-table.status")}</th>
      {#if showActions}<th></th>{/if}
    </tr>
  </thead>
  <tbody
    >{#each rows as booking (booking.key)}<DashboardBookingRow
        {booking}
        {showActions}
      />{/each}</tbody
  >
</table>
