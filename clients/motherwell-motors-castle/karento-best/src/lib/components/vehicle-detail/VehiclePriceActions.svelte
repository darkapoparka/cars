<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dealer } from "#lib/content.ts";
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
</script>

{#if dealer.businessPreview}
  <div class="sidebar-banner">
    <div class="p-4 background-body border rounded-3 desktop-panel">
      <p class="text-xl-bold neutral-1000 mb-4 desktop-type-panel"
        >{locale.t("ui.vehicle-price-actions.get-started")}</p
      >
      <a
        href={locale.href("/contact#contact-enquiry")}
        class="btn btn-primary w-100 rounded-3 py-3 mb-3 desktop-type-control desktop-panel-action"
        aria-label={locale.t("action.arrangeViewing")}
      >
        {locale.t("action.arrangeViewing")}
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8"
            stroke=""
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </a>
      <a
        href={locale.href("/contact#contact-enquiry")}
        class="btn btn-book bg-2 desktop-type-control desktop-panel-action"
        aria-label={locale.t("action.enquire")}
      >
        {locale.t("action.enquire")}
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8"
            stroke=""
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </a>
    </div>
  </div>
{:else}
  <div class="sidebar-banner">
    <div class="p-4 background-body border rounded-3 desktop-panel">
      <p class="text-xl-bold neutral-1000 mb-4 desktop-type-panel"
        >{locale.t("ui.vehicle-price-actions.get-started")}</p
      >
      <DemoActionLink
        href="#!"
        class="btn btn-primary w-100 rounded-3 py-3 mb-3 desktop-type-control desktop-panel-action"
        aria-label={locale.t("ui.vehicle-price-actions.schedule-test-drive")}
      >
        {locale.t("ui.vehicle-price-actions.schedule-test-drive")}
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8"
            stroke=""
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </DemoActionLink>
      <DemoActionLink
        href="#!"
        class="btn btn-book bg-2 desktop-type-control desktop-panel-action"
        aria-label={locale.t("ui.vehicle-price-actions.make-an-offer-price")}
      >
        {locale.t("ui.vehicle-price-actions.make-an-offer-price")}
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8"
            stroke=""
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </DemoActionLink>
    </div>
  </div>
{/if}

<style>
  @media (max-width: 767.98px) {
    .sidebar-banner > .p-4 {
      padding: var(--karento-space-4) !important;
      border-radius: var(--karento-radius-card) !important;
    }

    .sidebar-banner > .p-4 > p {
      margin-bottom: var(--karento-space-3) !important;
      font-size: var(--karento-type-panel-size);
      font-weight: var(--karento-type-panel-weight);
      line-height: var(--karento-type-panel-leading);
    }

    .sidebar-banner :global(.btn) {
      font-size: var(--karento-type-control-size);
      font-weight: var(--karento-type-control-weight);
      line-height: var(--karento-type-control-leading);
    }

    .sidebar-banner :global(output[data-demo-action]) {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }

    .sidebar-banner :global(.btn.mb-3) {
      margin-bottom: var(--karento-space-3) !important;
    }
  }

  @media (min-width: 992px) {
    .sidebar-banner > .desktop-panel > p {
      margin-bottom: var(--karento-desktop-space-4) !important;
    }
    .sidebar-banner :global(.btn.mb-3) {
      margin-bottom: var(--karento-desktop-space-3) !important;
    }
  }
</style>
