<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { Snippet } from "svelte";
  import {
    dashboardAudiences,
    type DashboardAudience,
  } from "#lib/data/dashboard.ts";
  import DashboardSidebar from "./DashboardSidebar.svelte";
  let {
    audience,
    activeHref,
    children,
  }: { audience: DashboardAudience; activeHref: string; children: Snippet } =
    $props();
</script>

<section class="box-section background-body pt-80 pb-110 dashboard">
  <div class="container"
    ><div class="karento-dashboard-notice" role="note">
      <strong>{locale.text(dashboardAudiences[audience].noticeTitle)}</strong>
      <span
        >{locale.t(
          "ui.dashboard-shell.preview-screens-with-sample-data-changes-are-not-saved",
        )}</span
      >
    </div>
    <div class="row">
      <div class="col-xl-3 col-lg-4"
        ><DashboardSidebar {audience} {activeHref} /></div
      >
      <div class="col-xl-9 col-lg-8">{@render children()}</div>
    </div>
  </div>
</section>
