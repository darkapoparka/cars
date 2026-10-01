<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import Hero from '$components/home/Hero.svelte';
  import SearchBox from '$components/home/SearchBox.svelte';
  import MobileCoreActions from '$components/home/MobileCoreActions.svelte';
  import BodyTypes from '$components/home/BodyTypes.svelte';
  import InventorySection from '$components/home/InventorySection.svelte';
  import BrandSection from '$components/home/BrandSection.svelte';
  import Editorial from '$components/home/Editorial.svelte';
  import TrustActions from '$components/home/TrustActions.svelte';
  import VideoSection from '$components/home/VideoSection.svelte';
  import { brand } from '$config/brand';

</script>

<svelte:head>
  <title>{i18n.t("m_9cc31a8ba082", { p0: brand.name, p1: i18n.dealer('city') })}</title>
  <meta name="description" content={i18n.t("m_ed2d6b74bc69", { p0: i18n.dealer('city') })} />
</svelte:head>

<div class="dn-home-page">
  <div class="dn-home-slot dn-home-slot--hero"><Hero /></div>
  <div class="dn-home-slot dn-home-slot--search"><SearchBox /></div>
  <div class="dn-home-slot dn-home-slot--mobile-actions"><MobileCoreActions /></div>
  <div class="dn-home-slot dn-home-slot--browse-actions"><TrustActions group="browse" mobileArtwork={false} /></div>
  <div class="dn-home-slot dn-home-slot--inventory"><InventorySection /></div>
  <div class="dn-home-slot dn-home-slot--body"><BodyTypes /></div>
  <div class="dn-home-slot dn-home-slot--brands"><BrandSection /></div>
  <div class="dn-home-slot dn-home-slot--ownership-actions"><TrustActions group="ownership" mobileArtwork={false} /></div>
  <div class="dn-home-slot dn-home-slot--editorial"><Editorial /></div>
  <div class="dn-home-slot dn-home-slot--videos"><VideoSection /></div>
</div>

<style>
  .dn-home-page,
  .dn-home-slot {
    display: contents;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    .dn-home-page {
      --dn-route-hero-height: 560px;
      --dn-route-hero-control-top: 280px;
    }
  }

  @media (min-width: 992px) {
    .dn-home-page { --dn-home-heading-banner-height: 112px; }

    .dn-home-page :global(.dn-home-content-section) {
      background: var(--dn-surface-canvas);
    }
    .dn-home-page :global(.dn-home-section-heading) {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--dn-space-6);
      min-height: var(--dn-control-height-default);
      text-align: left;
    }

    .dn-home-page :global(.dn-home-section-title) {
      margin: 0;
      font-size: var(--dn-home-heading-size);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-heading);
      letter-spacing: var(--dn-tracking-heading);
      text-align: left;
      text-wrap: balance;
    }

    .dn-home-page :global(.dn-home-section-heading > p) {
      margin: 0;
      font-size: var(--dn-text-body);
      line-height: var(--dn-leading-body);
      max-width: 60ch;
      text-align: center;
    }

    .dn-home-page :global(.dn-home-section-action) {
      position: relative;
      z-index: 1;
      display: inline-flex;
      flex-shrink: 0;
      min-height: 44px;
      align-self: center;
      align-items: center;
      justify-content: center;
      gap: var(--dn-space-2);
      padding: 0 var(--dn-space-5);
      border: 1px solid transparent;
      border-radius: var(--dn-radius-button);
      background: var(--dn-surface-raised);
      color: var(--dn-ink);
      font: var(--dn-cta-font);
      letter-spacing: var(--dn-cta-tracking);
      white-space: nowrap;
      margin-top: 0;
      box-shadow: none;
      transition: background-color 180ms ease, color 180ms ease;
    }

    .dn-home-page :global(.dn-home-action-label) {
      display: inline-flex;
      align-items: center;
      gap: var(--dn-space-2);
    }

    .dn-home-page :global(.dn-body-types__all),
    .dn-home-page :global(.dn-brand-hero__cta) {
      border-color: transparent;
    }

    .dn-home-page :global(:is(.dn-home-section-heading--branded, .dn-home-section-heading--banner)) {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      margin-bottom: 0;
      border-radius: var(--dn-radius-lg) var(--dn-radius-lg) 0 0;
      background: var(--dn-theme-hero-surface-deep);
      box-shadow: none;
      text-align: left;
    }

    .dn-home-page :global(:is(.dn-home-section-heading--branded, .dn-home-section-heading--banner) > :is(h2, p, a)) { position: relative; z-index: 1; }

    .dn-home-page :global(.dn-home-section-heading--branded > h2) { color: var(--dn-white); }
    .dn-home-page :global(.dn-home-section-heading--branded > p) { color: var(--dn-text-on-ink); }
    .dn-home-page :global(.dn-home-section-heading--light) {
      background: var(--dn-surface-subtle);
    }
    .dn-home-page :global(.dn-home-section-heading--light > h2) { color: var(--dn-ink); }
    .dn-home-page :global(.dn-home-section-heading--light > p) { color: var(--dn-muted); }
    .dn-home-page :global(.dn-home-section-heading--light > .dn-home-section-action) { background: var(--dn-red); color: var(--dn-white); }
    .dn-home-page :global(.dn-home-section-heading--light > .dn-home-section-action:is(:hover, :focus-visible)) { background: var(--dn-red-hover); color: var(--dn-white); }
    .dn-home-page :global(.dn-home-section-heading--light > .dn-home-section-action:focus-visible) { outline-color: var(--dn-focus); }

    .dn-home-page :global(.dn-home-section-panel) {
      position: relative;
      margin: 0;
      padding: var(--dn-space-6);
      border-radius: 0 0 var(--dn-radius-lg) var(--dn-radius-lg);
      background: var(--dn-surface-raised);
    }

    .dn-home-page :global(.dn-home-banner-frame) {
      min-height: var(--dn-home-heading-banner-height);
      padding: var(--dn-home-banner-padding);
    }
    .dn-home-page :global(.dn-home-banner-copy) {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--dn-space-6);
      text-align: left;
    }
    .dn-home-page :global(.dn-home-banner-copy > .dn-home-section-action) {
      margin-top: 0;
      align-self: center;
    }

    .dn-home-page :global(.dn-home-section-heading--artwork) {
      min-height: 208px;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: var(--dn-space-4);
      padding: var(--dn-space-8);
    }
    .dn-home-page :global(.dn-home-section-heading--artwork > h2) {
      max-width: 46%;
    }
    .dn-home-page :global(.dn-home-section-heading--artwork > .dn-home-section-action) {
      align-self: flex-start;
    }

    .dn-home-page :global(.dn-home-section-action:hover) {
      background: var(--dn-surface-hover);
      color: var(--dn-ink-strong);
    }

    .dn-home-page :global(.dn-home-section-action:active) { transform: translateY(0); box-shadow: none; }

    .dn-home-page :global(.dn-home-section-action:focus-visible) {
      background: var(--dn-surface-hover);
      color: var(--dn-ink-strong);
      outline: 3px solid var(--dn-white);
      outline-offset: 3px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-home-page :global(.dn-home-section-action) {
      transition: none;
    }
    .dn-home-page :global(.dn-home-section-action:hover) { transform: none; }
  }

  @media (max-width: 767px) {
    .dn-home-page {
      display: block;
      overflow: hidden;
      background: var(--dn-mobile-canvas);
    }

    .dn-home-slot {
      display: contents;
    }

    .dn-home-slot--browse-actions,
    .dn-home-slot--ownership-actions {
      display: none;
    }
  }
</style>
