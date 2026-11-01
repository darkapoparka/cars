<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import { dashboardStats } from "#lib/data/dashboard.ts";
  import DashboardStatTiles from "#lib/components/dashboard/DashboardStatTiles.svelte";
  import DashboardAddAmountCard from "#lib/components/dashboard/DashboardAddAmountCard.svelte";
  import DashboardTransactionChartCard from "#lib/components/dashboard/DashboardTransactionChartCard.svelte";
  import DashboardTransactionsCard from "#lib/components/dashboard/DashboardTransactionsCard.svelte";
</script>

<DashboardShell audience="member" activeHref="/account/wallet">
  <DashboardStatTiles
    stats={dashboardStats.wallet}
    rowClass="row mb-3"
    mode="wallet"
  />
  <div class="row mb-3">
    <div class="col-lg-6">
      <DashboardAddAmountCard />
    </div>

    <div class="col-lg-6">
      <DashboardTransactionChartCard />
    </div>
  </div>

  <div class="row">
    <div class="col-xl-12 d-flex">
      <DashboardTransactionsCard />
    </div>
  </div>
</DashboardShell>
