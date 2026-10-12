<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import DashboardPromotionAlert from "#lib/components/dashboard/DashboardPromotionAlert.svelte";
  import { dashboardPromotions } from "#lib/data/dashboard.ts";
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import DashboardOwnerListingsCard from "#lib/components/dashboard/DashboardOwnerListingsCard.svelte";
</script>

<DashboardShell audience="owner" activeHref="/dashboard/listings">
  <DashboardPromotionAlert promotion={dashboardPromotions.ownerListings} />

  <div class="row">
    <div class="col-xl-12 d-flex">
      <DashboardOwnerListingsCard />
    </div>
  </div>
</DashboardShell>
