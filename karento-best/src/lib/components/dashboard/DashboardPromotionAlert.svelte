<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardPromotion } from "#lib/data/dashboard.ts";
  let { promotion }: { promotion: DashboardPromotion } = $props();
  let visible = $state(true);
</script>

{#if visible}<div class={promotion.alertClass}
    ><i class="fi fi-rr-info me-2 mt-1"></i><p
      class="mb-0 desktop-type-body-small">{locale.text(promotion.message)}</p
    ><button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label={locale.t("ui.dashboard-promotion-alert.close")}
      onclick={() => (visible = false)}
    ></button></div
  >{/if}

<style>
  @media (max-width: 767.98px) {
    .btn-close {
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
      padding: 0 !important;
    }
  }
</style>
