<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dashboardNotifications } from "#lib/data/dashboard.ts";
  import DashboardNotificationItem from "./DashboardNotificationItem.svelte";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t("ui.dashboard-notifications-card.notifications")}</span
      >
      <DashboardDropdown config={dashboardDropdowns.notificationsScope} />
    </div>
  </div>
  <div class="card-body"
    >{#each dashboardNotifications as notification (notification.id)}<DashboardNotificationItem
        {notification}
      />{/each}</div
  >
</div>
