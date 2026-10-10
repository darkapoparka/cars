<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import BrowseAllCard from './BrowseAllCard.svelte';
  import { resolve } from '$app/paths';
  import VehicleCard from '$components/vehicles/VehicleCard.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import { featuredVehicles } from '$data/inventory';
</script>

<section class="dn-section dn-inventory dn-home-content-section" aria-labelledby="featured-title">
  <div class="container dn-inventory-panel">
    <div class="dn-inventory__heading dn-home-section-heading dn-home-section-heading--branded dn-home-banner-frame dn-home-banner-copy">
      <h2 id="featured-title" class="dn-home-section-title">
        <span class="dn-heading-desktop">{i18n.t("m_fd88b7330e98")}</span>
        <span class="dn-heading-mobile">{i18n.t("m_fd88b7330e98")}</span>
      </h2>
      <a class="dn-inventory__all dn-home-section-action" href={i18n.href(resolve('/cars'))} aria-label={i18n.t("m_7d6647b063a2")}>
        <span class="dn-heading-desktop dn-home-action-label">{i18n.t("m_30a64216eaea")} <Icon name="arrow-right" size={18} /></span>
        <span class="dn-heading-mobile" aria-hidden="true">{i18n.t("m_a52ace420f21")}</span>
      </a>
      <a class="dn-inventory__mobile-all dn-compact-control dn-quick-pill" href={i18n.href(resolve('/cars'))} aria-label={i18n.t("m_7d6647b063a2")}>
        {i18n.t("m_30a64216eaea")}
        <MobileActionIcon name="arrow" size={14} />
      </a>
    </div>

    <div class="dn-inventory__grid dn-home-section-panel">
      {#each featuredVehicles.slice(0, 4) as vehicle (vehicle.id)}
        <VehicleCard {vehicle} showPrice />
      {/each}
      <BrowseAllCard label={i18n.t("m_13b5d43d1176")} detail={i18n.t("m_d11f4babc6e6")} />
    </div>
  </div>
</section>

<style>
  .dn-inventory__mobile-all { display: none; }
  

  .dn-inventory {
    background: #fff;
  }

  .dn-inventory-panel {
    padding: 46px 30px 30px;
    border-radius: 20px;
    background: #f1f3f5;
  }

  .dn-inventory__heading {
    position: relative;
    display: flex;
    min-height: 46px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
    text-align: center;
  }

  .dn-inventory__heading h2 {
    width: auto;
    margin: 0;
    color: var(--dn-ink-strong);
    font-size: var(--dn-text-section);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-section);
    letter-spacing: var(--dn-tracking-heading);
    text-align: center;
  }

  .dn-inventory__all {
    display: inline-flex;
    min-height: 50px;
    align-items: center;
    justify-content: center;
    padding: 0 28px;
    border-radius: var(--dn-radius-button);
    background: var(--dn-red);
    color: #fff;
    font-size: var(--dn-control-size);
    font-weight: var(--dn-control-weight);
    line-height: var(--dn-leading-control);
    transition: background-color 180ms ease-out;
  }

  .dn-heading-mobile {
    display: none;
  }

  .dn-inventory__all:hover,
  .dn-inventory__all:focus-visible {
    background: #24272c;
    color: #fff;
  }

  .dn-inventory__all:focus-visible {
    outline: 3px solid rgb(var(--dn-theme-accent-rgb) / 24%);
    outline-offset: 3px;
  }

  .dn-inventory__grid {
    --dn-vehicle-card-title-lines: 1;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 30px;
    align-items: stretch;
  }

  @media (min-width: 768px) {
    .dn-inventory .dn-inventory__heading .dn-inventory__all {
      --dn-featured-action-surface: var(--dn-white);
      --dn-compact-control-font: var(--dn-weight-medium) var(--dn-text-meta) / var(--dn-leading-control) var(--dn-font);
      isolation: isolate;
      min-height: var(--dn-control-height-default);
      padding: 0 var(--dn-space-3);
      border: 0;
      background: transparent;
      color: var(--dn-ink);
      font: var(--dn-compact-control-font);
    }

    .dn-inventory__all::before {
      position: absolute;
      z-index: -1;
      inset: var(--dn-space-2) 0;
      border-radius: inherit;
      background: var(--dn-featured-action-surface);
      content: '';
    }

    .dn-inventory .dn-inventory__heading .dn-inventory__all:is(:hover, :focus-visible) {
      --dn-featured-action-surface: var(--dn-surface-hover);
      background: transparent;
      color: var(--dn-ink);
    }

    .dn-inventory__all :global(svg) { width: 14px; height: 14px; }
  }

  @media (max-width: 1200px) {
    .dn-inventory__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 22px;
    }
  }

  @media (max-width: 991px) {
    .dn-inventory-panel {
      padding: 38px 20px 20px;
    }

    .dn-inventory__heading {
      justify-content: center;
      text-align: center;
    }

    .dn-inventory__heading h2 {
      width: auto;
      font-size: var(--dn-text-section-compact);
      text-align: center;
    }

    .dn-inventory__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
  }

  @media (max-width: 767px) {
    .dn-inventory {
      padding: var(--dn-space-6) 0 0;
      background: var(--dn-mobile-canvas);
    }

    .dn-inventory-panel {
      width: 100%;
      padding: 0;
      border-radius: 0;
      background: transparent;
    }

    .dn-inventory__heading {
      min-height: 44px;
      align-items: center;
      flex-direction: row;
      justify-content: space-between;
      gap: 16px;
      margin: 0 12px 8px;
      text-align: left;
    }

    .dn-inventory__heading h2 {
      font-size: var(--dn-text-subheading);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-heading);
      text-align: left;
    }

    .dn-heading-desktop {
      display: none;
    }

    .dn-heading-mobile {
      display: inline;
    }

    .dn-inventory__all { display: none; }

    .dn-inventory__grid {
      --dn-vehicle-card-image-ratio: 16 / 9;
      --dn-vehicle-card-content-padding: var(--dn-space-3);
      --dn-vehicle-card-specs-gap: var(--dn-space-2);
      --dn-vehicle-card-spec-icon-gap: var(--dn-space-1);
      --dn-vehicle-card-spec-padding: calc(var(--dn-space-1) + var(--dn-space-half));
      --dn-vehicle-card-price-gap: var(--dn-space-2);
      display: grid;
      grid-auto-columns: var(--dn-home-carousel-card-width);
      grid-auto-flow: column;
      grid-template-columns: none;
      gap: var(--dn-home-carousel-gap);
      overflow-x: auto;
      padding: 0 var(--dn-space-3) var(--dn-space-2);
      scroll-padding-left: var(--dn-space-3);
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }

    .dn-inventory__grid::-webkit-scrollbar {
      display: none;
    }

    .dn-inventory__grid :global(.dn-vehicle-card) {
      scroll-snap-align: start;
    }

    .dn-inventory__mobile-all {
      --dn-compact-control-surface: var(--dn-white);
      --dn-compact-control-ink: var(--dn-ink);
      --dn-compact-control-padding-inline: var(--dn-space-3);
      --dn-compact-control-inset: calc(var(--dn-space-2) + var(--dn-space-half));
      --dn-entry-action-height: var(--dn-control-height-default);
      --dn-entry-action-gap: var(--dn-space-1);
      --dn-compact-control-font: var(--dn-weight-medium) var(--dn-text-caption) / var(--dn-leading-control) var(--dn-font);
      position: relative;
      z-index: 1;
      display: inline-flex;
      max-width: 100%;
      white-space: nowrap;
    }

    .dn-inventory__mobile-all:is(:hover, :focus-visible) {
      --dn-compact-control-surface: var(--dn-surface-hover);
    }

    .dn-inventory__mobile-all:focus-visible {
      outline: 2px solid var(--dn-white);
      outline-offset: 2px;
    }
  }

  @media (min-width: 992px) {
    

    .dn-inventory {
      padding-top: var(--dn-home-section-space);
      padding-bottom: var(--dn-home-section-space);
      background: #fff;
    }

    .dn-inventory-panel {
      padding: 0;
      background: transparent;
    }

    .dn-inventory__heading {
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 24px;
      text-align: left;
    }

    .dn-inventory__heading h2 {
      font-size: var(--dn-text-section-compact);
      text-align: left;
    }

    .dn-inventory__all {
      min-height: 44px;
      padding: 0 12px;
      border-radius: 10px;
      background: transparent;
      color: #24272c;
      font-size: var(--dn-control-size);
      white-space: nowrap;
    }

    .dn-inventory__all:hover,
    .dn-inventory__all:focus-visible {
      background: #e4e7eb;
      color: #a80000;
    }

    .dn-inventory__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 24px;
    }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-inventory__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-inventory__all {
      transition: none;
    }
  }

</style>
