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
  <div class="dn-home-slot dn-home-slot--browse-actions"><TrustActions group="browse" /></div>
  <div class="dn-home-slot dn-home-slot--inventory"><InventorySection /></div>
  <div class="dn-home-slot dn-home-slot--body"><BodyTypes /></div>
  <div class="dn-home-slot dn-home-slot--brands"><BrandSection /></div>
  <div class="dn-home-slot dn-home-slot--ownership-actions"><TrustActions group="ownership" /></div>
  <div class="dn-home-slot dn-home-slot--editorial"><Editorial /></div>
  <div class="dn-home-slot dn-home-slot--videos"><VideoSection /></div>
</div>

<style>
  .dn-home-page,
  .dn-home-slot {
    display: contents;
  }

  @media (min-width: 992px) {
    .dn-home-page :global(.dn-home-section-heading) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--dn-home-copy-gap);
      min-height: var(--dn-control-height-default);
      text-align: center;
    }

    .dn-home-page :global(.dn-home-section-title) {
      margin: 0;
      font-size: var(--dn-home-heading-size);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-heading);
      letter-spacing: var(--dn-tracking-heading);
      text-align: center;
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
      display: inline-flex;
      flex-shrink: 0;
      min-height: 44px;
      align-self: center;
      align-items: center;
      justify-content: center;
      padding: 0 var(--dn-space-5);
      border: 1px solid transparent;
      border-radius: var(--dn-radius-button);
      background: var(--dn-surface-raised);
      color: #24272c;
      font: var(--dn-cta-font);
      letter-spacing: var(--dn-cta-tracking);
      white-space: nowrap;
      margin-top: var(--dn-home-copy-gap);
      transition: background-color 160ms ease, color 160ms ease;
    }

    .dn-home-page :global(.dn-body-types__all),
    .dn-home-page :global(.dn-brand-hero__cta) {
      border-color: #e1e4e8;
    }

    .dn-home-page :global(.dn-home-section-heading--banner > .dn-home-section-action) {
      grid-row: 3;
    }

    .dn-home-page :global(.dn-home-section-heading--branded) {
      margin-bottom: 0;
      border-radius: var(--dn-radius-lg);
      background: var(--dn-ink-deep);
      text-align: center;
    }

    .dn-home-page :global(.dn-home-section-heading--branded > h2) { color: var(--dn-white); }
    .dn-home-page :global(.dn-home-section-heading--branded > p) { color: var(--dn-text-on-ink); }
    .dn-home-page :global(.dn-home-section-heading--red) { background: var(--dn-red); }

    .dn-home-page :global(.dn-home-banner-frame) {
      min-height: var(--dn-home-heading-banner-height);
      padding: var(--dn-home-banner-padding);
      padding-top: calc(var(--dn-space-7) - var(--dn-home-banner-overlap) / 2);
      padding-bottom: calc(var(--dn-space-7) + var(--dn-home-banner-overlap) / 2);
    }
    .dn-home-page :global(.dn-home-banner-copy) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--dn-home-copy-gap);
    }
    .dn-home-page :global(.dn-home-banner-copy > .dn-home-section-action) {
      margin-top: calc(var(--dn-home-cta-gap) - var(--dn-home-copy-gap));
      align-self: center;
    }

    .dn-home-page :global(.dn-home-section-action:hover) {
      background: var(--dn-surface-hover);
      color: var(--dn-ink-strong);
    }

    .dn-home-page :global(.dn-home-section-action:focus-visible) {
      background: var(--dn-surface-hover);
      color: var(--dn-ink-strong);
      outline: 3px solid var(--dn-line-emphasis);
      outline-offset: 3px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-home-page :global(.dn-home-section-action) {
      transition: none;
    }
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
