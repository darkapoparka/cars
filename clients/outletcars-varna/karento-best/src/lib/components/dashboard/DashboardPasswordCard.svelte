<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardField } from "#lib/data/dashboard.ts";
  import DashboardFormField from "./DashboardFormField.svelte";
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  let { fields }: { fields: readonly DashboardField[] } = $props();
</script>

<div class="card shadow-none flex-fill">
  <div class="card-header">
    <p class="neutral-1000 text-md-bold fs-5 py-1 desktop-type-panel"
      >{locale.t("ui.dashboard-password-card.change-password")}</p
    >
  </div>

  <div class="card-body">
    <div class="row mb-3">
      {#each fields as field (field.id ?? field.placeholder)}<DashboardFormField
          {field}
        />{/each}
    </div>
    <div class="box-button-save mt-15">
      <DemoActionButton
        class="btn btn-primary"
        aria-label={locale.t("ui.dashboard-password-card.save-changes")}
        type="button"
        >{locale.t("ui.dashboard-password-card.save-changes")}</DemoActionButton
      >
    </div>
  </div>
</div>
