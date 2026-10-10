<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dashboardNotifications } from "#lib/data/dashboard.ts";
  import DashboardNotificationItem from "./DashboardNotificationItem.svelte";

  import { dashboardDropdowns } from "#lib/data/dashboard.ts";
  import DashboardDropdown from "#lib/components/dashboard/DashboardDropdown.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import type { CatalogText } from "#lib/i18n/text.ts";
  import { recentDashboardNotifications } from "#lib/data/dashboard-mobile.ts";
  const phone = new MediaQuery("(max-width: 767.98px)");
  let selection = $state<CatalogText>();
  const notifications = $derived(
    phone.current
      ? recentDashboardNotifications(dashboardNotifications, selection)
      : dashboardNotifications,
  );
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <div class="d-flex justify-content-between align-items-center">
      <span class="neutral-1000 text-md-bold fs-5 desktop-type-panel"
        >{locale.t("ui.dashboard-notifications-card.notifications")}</span
      >
      <DashboardDropdown
        config={dashboardDropdowns.notificationsScope}
        bind:selection
      />
    </div>
  </div>
  <div class="card-body"
    >{#if phone.current}<span
        class="visually-hidden"
        aria-live="polite"
        aria-atomic="true">{locale.count(notifications.length, "results")}</span
      >{/if}{#each notifications as notification (notification.id)}<DashboardNotificationItem
        {notification}
      />{/each}</div
  >
</div>
