<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import DashboardPromotionAlert from "#lib/components/dashboard/DashboardPromotionAlert.svelte";
  import { dashboardPromotions } from "#lib/data/dashboard.ts";
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import { dashboardStats } from "#lib/data/dashboard.ts";
  import DashboardStatTiles from "#lib/components/dashboard/DashboardStatTiles.svelte";
  import DashboardPremiumBrandsCard from "#lib/components/dashboard/DashboardPremiumBrandsCard.svelte";
  import DashboardNotificationsCard from "#lib/components/dashboard/DashboardNotificationsCard.svelte";
  import DashboardRecentBookingsCard from "#lib/components/dashboard/DashboardRecentBookingsCard.svelte";
  import DashboardBookingsChartCard from "#lib/components/dashboard/DashboardBookingsChartCard.svelte";
  import DashboardViewedProductsCard from "#lib/components/dashboard/DashboardViewedProductsCard.svelte";
</script>

<DashboardShell audience="member" activeHref="/account">
  <DashboardPromotionAlert promotion={dashboardPromotions.memberOverview} />

  <DashboardStatTiles
    stats={dashboardStats.memberOverview}
    rowClass="row"
    mode="member"
  />

  <div class="row mt-4">
    <div class="col-xl-12 d-flex">
      <DashboardBookingsChartCard />
    </div>
  </div>

  <div class="row mt-4">
    <div class="col-xl-5 d-flex mb-3 mb-lg-0">
      <DashboardNotificationsCard />
    </div>

    <div class="col-xl-7 d-flex">
      <DashboardRecentBookingsCard />
    </div>
  </div>

  <div class="row mt-4">
    <div class="col-xl-12">
      <DashboardViewedProductsCard />
    </div>
  </div>

  <div class="row mt-4">
    <div class="col-xl-12">
      <DashboardPremiumBrandsCard />
    </div>
  </div>
</DashboardShell>
