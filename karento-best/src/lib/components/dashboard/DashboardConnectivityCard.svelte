<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dashboardPreferences } from "#lib/data/dashboard.ts";
  import DashboardPreferenceGroup from "./DashboardPreferenceGroup.svelte";
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  const idBase = $props.id();
</script>

<div class="card shadow-none flex-fill">
  <div class="card-body">
    <p class="neutral-1000 text-md-bold fs-5 mb-3 desktop-type-panel"
      >{locale.t(
        "reference.ancillary.DashboardConnectivityCard.partner-platform-api-connectivity",
      )}</p
    >
  </div>

  <div class="card-body"
    >{#each dashboardPreferences.connectivity as group (group.id)}<DashboardPreferenceGroup
        {group}
        {idBase}
      />{/each}
    <div class="box-button-save mt-15">
      <DemoActionButton
        class="btn btn-primary"
        aria-label={locale.t("ui.dashboard-connectivity-card.save-changes")}
        type="button"
        >{locale.t(
          "ui.dashboard-connectivity-card.save-changes",
        )}</DemoActionButton
      >
    </div>
  </div>
</div>
