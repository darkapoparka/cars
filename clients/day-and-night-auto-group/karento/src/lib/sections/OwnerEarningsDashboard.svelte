<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import DashboardEarningsCard from "#lib/components/dashboard/DashboardEarningsCard.svelte";
  import DashboardEarningTransactionsCard from "#lib/components/dashboard/DashboardEarningTransactionsCard.svelte";
  import DashboardTransferCards from "#lib/components/dashboard/DashboardTransferCards.svelte";
</script>

<DashboardShell audience="owner" activeHref="/dashboard/earnings">
  <DashboardTransferCards />

  <div class="row mb-3">
    <div class="col-xl-12 d-flex">
      <DashboardEarningsCard />
    </div>
  </div>

  <div class="row mt-4">
    <div class="col-xl-12">
      <DashboardEarningTransactionsCard />
    </div>
  </div>
</DashboardShell>
