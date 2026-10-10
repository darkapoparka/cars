<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import DashboardPromotionAlert from "#lib/components/dashboard/DashboardPromotionAlert.svelte";
  import { dashboardPromotions } from "#lib/data/dashboard.ts";
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import DashboardBookingsCard from "#lib/components/dashboard/DashboardBookingsCard.svelte";
</script>

<DashboardShell audience="member" activeHref="/account/bookings">
  <DashboardPromotionAlert promotion={dashboardPromotions.bookings} />

  <div class="row">
    <div class="col-xl-12 d-flex">
      <DashboardBookingsCard />
    </div>
  </div>
</DashboardShell>
