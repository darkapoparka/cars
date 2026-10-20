<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import { dashboardStats } from "#lib/data/dashboard.ts";
  import DashboardStatTiles from "#lib/components/dashboard/DashboardStatTiles.svelte";
  import DashboardPremiumBrandsCard from "#lib/components/dashboard/DashboardPremiumBrandsCard.svelte";
  import DashboardNotificationsCard from "#lib/components/dashboard/DashboardNotificationsCard.svelte";
  import DashboardRecentBookingsCard from "#lib/components/dashboard/DashboardRecentBookingsCard.svelte";
  import DashboardEarningsCard from "#lib/components/dashboard/DashboardEarningsCard.svelte";
  import DashboardInvoicesCard from "#lib/components/dashboard/DashboardInvoicesCard.svelte";
</script>

<DashboardShell audience="owner" activeHref="/dashboard">
  <DashboardStatTiles
    stats={dashboardStats.ownerOverview}
    rowClass="row"
    mode="owner"
  />

  <div class="row mt-4">
    <div class="col-xl-12 d-flex">
      <DashboardEarningsCard />
    </div>
  </div>

  <div class="row mt-4">
    <div class="col-xl-12">
      <DashboardInvoicesCard />
    </div>
  </div>

  <div class="row mt-4">
    <div class="col-xl-5 d-flex">
      <DashboardNotificationsCard />
    </div>

    <div class="col-xl-7 d-flex">
      <DashboardRecentBookingsCard />
    </div>
  </div>

  <div class="row mt-4">
    <div class="col-xl-12">
      <DashboardPremiumBrandsCard />
    </div>
  </div>
</DashboardShell>
