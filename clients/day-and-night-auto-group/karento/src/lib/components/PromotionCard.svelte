<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { Promotion } from "#lib/data/promotions.ts";
  let { promotion }: { promotion: Promotion } = $props();
</script>

<div class={[promotion.className, "promotion-card"]}>
  <div class="banner-info position-relative z-1 py-5">
    <div class="banner-title">
      <h5 class="text-white desktop-type-panel"
        >{locale.text(promotion.title)}</h5
      >
    </div>
    <p class="banner-text text-white text-md-regular py-3 desktop-type-body">
      {locale.text(promotion.description[0])} <br class="d-none d-lg-block" />
      {locale.text(promotion.description[1])}
    </p>
    <div class="banner-button pt-3">
      <a
        class={[promotion.actionClass, "desktop-type-control"]}
        href={locale.href(promotion.href)}
        aria-label={locale.text(promotion.actionLabel)}
      >
        {locale.text(promotion.actionLabel)}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M8 15L15 8L8 1M15 8L1 8"
            stroke=""
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </a>
    </div>
  </div>
</div>

<style>
  @media (max-width: 767.98px) {
    .promotion-card {
      padding-inline: var(--karento-space-4) !important;
      border-radius: var(--karento-radius-card);
    }

    .banner-info {
      display: grid;
      gap: var(--karento-space-3);
      padding-block: var(--karento-space-6) !important;
    }

    .banner-title h5 {
      max-width: 20ch;
      font-size: var(--karento-type-section-size);
      font-weight: var(--karento-type-section-weight);
      line-height: var(--karento-type-section-leading);
    }

    .banner-text {
      max-width: 32ch;
      margin: 0;
      padding: 0 !important;
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }

    .banner-button {
      padding: 0 !important;
    }
  }
</style>
