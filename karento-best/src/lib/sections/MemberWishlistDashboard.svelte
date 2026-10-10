<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import DashboardWishlistCard from "#lib/components/dashboard/DashboardWishlistCard.svelte";
</script>

<DashboardShell audience="member" activeHref="/account/wishlist">
  <div class="row">
    <div class="col-xl-12 d-flex">
      <DashboardWishlistCard />
    </div>
  </div>
</DashboardShell>
