<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { VehicleOffer } from "#lib/data/promotions.ts";
  let { offer }: { offer: VehicleOffer } = $props();
</script>

<div class="vehicle-offer bg-white rounded-12 p-5 d-flex flex-column gap-4">
  <span class="icon-shape icon_70 background-2 rounded-circle">
    <img
      class="dark-invert"
      src={offer.icon}
      alt={locale.t("image.illustrative")}
    />
  </span>
  <h6 class="desktop-type-card">{locale.text(offer.title)}</h6>
  <p class="text-md-regular desktop-type-body"
    >{locale.text(offer.description)}</p
  >
  <a
    class="btn btn-primary desktop-type-control desktop-panel-action"
    href={locale.href(offer.href)}
    aria-label={locale.text(offer.actionLabel)}
  >
    {locale.text(offer.actionLabel)}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 19L19 12L12 5M19 12L5 12"
        stroke="#101010"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  </a>
</div>

<style>
  @media (min-width: 992px) {
    .vehicle-offer > .desktop-panel-action svg {
      width: var(--karento-desktop-space-4);
      height: var(--karento-desktop-space-4);
    }
  }

  @media (max-width: 767.98px) {
    .vehicle-offer.bg-white.p-5.d-flex {
      display: grid !important;
      grid-template-columns: var(--karento-touch-target) minmax(0, 1fr);
      align-items: center;
      gap: var(--karento-space-2) var(--karento-space-3) !important;
      padding: var(--karento-space-4) !important;
    }

    .vehicle-offer .icon-shape {
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
    }

    .vehicle-offer h6 {
      margin: 0;
      font-size: var(--karento-type-panel-size);
      font-weight: var(--karento-type-panel-weight);
      line-height: var(--karento-type-panel-leading);
    }

    .vehicle-offer p {
      grid-column: 2;
      margin: 0;
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }

    .vehicle-offer .btn {
      grid-column: 2;
      justify-self: start;
    }
  }
</style>
