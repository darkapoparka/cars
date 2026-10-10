<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import DashboardShell from "#lib/components/dashboard/DashboardShell.svelte";
  import DashboardNotificationPreferencesCard from "#lib/components/dashboard/DashboardNotificationPreferencesCard.svelte";
  import DashboardConnectivityCard from "#lib/components/dashboard/DashboardConnectivityCard.svelte";
</script>

<DashboardShell audience="member" activeHref="/account/settings">
  <div class="row">
    <div class="col-xl-12">
      <DashboardNotificationPreferencesCard />

      <DashboardConnectivityCard />
    </div>
  </div>
</DashboardShell>
