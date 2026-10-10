<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import DashboardListingPricingCard from "#lib/components/dashboard/DashboardListingPricingCard.svelte";
  import DashboardListingDetailsCard from "#lib/components/dashboard/DashboardListingDetailsCard.svelte";
  import DashboardListingLocationCard from "#lib/components/dashboard/DashboardListingLocationCard.svelte";
</script>

<DashboardShell audience="owner" activeHref="/dashboard/add-listing">
  <div class="row mb-3">
    <div class="col-xl-12 d-flex">
      <DashboardListingPricingCard />
    </div>
  </div>

  <div class="row mb-3">
    <div class="col-xl-12 d-flex">
      <DashboardListingDetailsCard />
    </div>
  </div>

  <div class="row mb-3">
    <div class="col-xl-12 d-flex">
      <DashboardListingLocationCard />
    </div>
  </div>
</DashboardShell>
