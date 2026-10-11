<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dashboardPreferences } from "#lib/data/dashboard.ts";
  import DashboardPreferenceGroup from "./DashboardPreferenceGroup.svelte";
  const idBase = $props.id();
</script>

<div class="card shadow-none flex-fill mb-3">
  <div class="card-body">
    <p class="neutral-1000 text-md-bold fs-5 mb-3 desktop-type-panel"
      >{locale.t("ui.dashboard-notification-preferences-card.notifications")}</p
    >
  </div>

  <div class="card-body"
    >{#each dashboardPreferences.notifications as group (group.id)}<DashboardPreferenceGroup
        {group}
        {idBase}
      />{/each}</div
  >
</div>
