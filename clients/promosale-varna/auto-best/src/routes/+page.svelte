<script lang="ts">
  import Hero from '$components/home/Hero.svelte';
  import SearchBox from '$components/home/SearchBox.svelte';
  import MobileBudget from '$components/home/MobileBudget.svelte';
  import BodyTypes from '$components/home/BodyTypes.svelte';
  import InventorySection from '$components/home/InventorySection.svelte';
  import BrandSection from '$components/home/BrandSection.svelte';
  import Editorial from '$components/home/Editorial.svelte';
  import TrustActions from '$components/home/TrustActions.svelte';
  import VideoSection from '$components/home/VideoSection.svelte';
  import { brand } from '$config/brand';

</script>

<svelte:head>
  <title>{brand.name} — Премиум автомобили в {brand.city}</title>
  <meta name="description" content={`Премиум автомобили, внос и финансиране по запитване в ${brand.city}.`} />
</svelte:head>

<div class="dn-home-page">
  <div class="dn-home-slot dn-home-slot--hero"><Hero /></div>
  <div class="dn-home-slot dn-home-slot--search"><SearchBox /></div>
  <div class="dn-home-slot dn-home-slot--browse-actions"><TrustActions group="browse" /></div>
  <div class="dn-home-slot dn-home-slot--budget"><MobileBudget /></div>
  <div class="dn-home-slot dn-home-slot--inventory"><InventorySection /></div>
  <div class="dn-home-slot dn-home-slot--body"><BodyTypes /></div>
  <div class="dn-home-slot dn-home-slot--brands"><BrandSection /></div>
  <div class="dn-home-slot dn-home-slot--ownership-actions"><TrustActions group="ownership" /></div>
  <div class="dn-home-slot dn-home-slot--editorial"><Editorial /></div>
  <div class="dn-home-slot dn-home-slot--videos"><VideoSection /></div>
  <div class="dn-home-slot dn-home-slot--services"><TrustActions group="all" variant="cards" /></div>
</div>

<style>
  @media (min-width: 992px) { :global(.dn-home-section-heading--compact) { --dn-home-heading-banner-height: 176px; } }
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
      min-height: 44px;
      text-align: center;
    }

    .dn-home-page :global(.dn-home-section-title) {
      margin: 0;
      font-size: var(--dn-home-heading-size);
      font-weight: 650;
      line-height: 1.2;
      letter-spacing: -0.03em;
      text-align: center;
      text-wrap: balance;
    }

    .dn-home-page :global(.dn-home-section-heading > p) {
      margin: 0;
      font-size: 16px;
      line-height: 1.5;
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
      padding: 0 20px;
      border: 1px solid transparent;
      border-radius: var(--dn-radius-button);
      background: #fff;
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
      border-radius: 20px;
      background: #101114;
      text-align: center;
    }

    .dn-home-page :global(.dn-home-section-heading--branded > h2) { color: #fff; }
    .dn-home-page :global(.dn-home-section-heading--branded > p) { color: #f0f1f3; }
    .dn-home-page :global(.dn-home-section-heading--red) { background: var(--dn-red); }

    .dn-home-page :global(.dn-home-banner-frame) {
      min-height: var(--dn-home-heading-banner-height);
      padding: var(--dn-home-banner-padding);
      padding-top: calc(28px - var(--dn-home-banner-overlap) / 2);
      padding-bottom: calc(28px + var(--dn-home-banner-overlap) / 2);
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
      background: #e9edf1;
      color: #171a20;
    }

    .dn-home-page :global(.dn-home-section-action:focus-visible) {
      background: #e9edf1;
      color: #171a20;
      outline: 3px solid #8c959f;
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
  }
</style>
