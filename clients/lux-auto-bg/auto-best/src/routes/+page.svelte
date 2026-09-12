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
  <meta name="description" content={`Автомобили, оглед и директен контакт с дилъра в ${brand.city}.`} />
</svelte:head>

<div class="dn-home-page">
  <div class="dn-home-slot dn-home-slot--hero"><Hero /></div>
  <div class="dn-home-slot dn-home-slot--search"><SearchBox /></div>
  <div class="dn-home-slot dn-home-slot--browse-actions"><TrustActions group="browse" /></div>
  <div class="dn-home-slot dn-home-slot--budget"><MobileBudget /></div>
  <div class="dn-home-slot dn-home-slot--body"><BodyTypes /></div>
  <div class="dn-home-slot dn-home-slot--inventory"><InventorySection /></div>
  <div class="dn-home-slot dn-home-slot--brands"><BrandSection /></div>
  <div class="dn-home-slot dn-home-slot--editorial"><Editorial /></div>
  <div class="dn-home-slot dn-home-slot--ownership-actions"><TrustActions group="ownership" /></div>
  <div class="dn-home-slot dn-home-slot--videos"><VideoSection /></div>
  <div class="dn-home-slot dn-home-slot--services"><TrustActions group="all" variant="cards" /></div>
</div>

<style>
  .dn-home-page,
  .dn-home-slot {
    display: contents;
  }

  @media (min-width: 992px) {
    .dn-home-page :global(.dn-home-section-heading) {
      align-items: center;
      column-gap: 32px;
      row-gap: 8px;
      min-height: 44px;
    }

    .dn-home-page :global(.dn-home-section-title) {
      margin: 0;
      font-size: 32px;
      font-weight: 650;
      line-height: 1.2;
      letter-spacing: -0.03em;
      text-align: left;
    }

    .dn-home-page :global(.dn-home-section-heading > p) {
      margin: 0;
      font-size: 16px;
      line-height: 1.5;
    }

    .dn-home-page :global(.dn-home-section-action) {
      display: inline-flex;
      flex-shrink: 0;
      min-height: 44px;
      grid-row: 1;
      align-self: start;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      border: 1px solid transparent;
      border-radius: var(--dn-radius-button);
      background: #fff;
      color: #24272c;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;
      transition: background-color 160ms ease, color 160ms ease;
    }

    .dn-home-page :global(.dn-body-types__all) {
      border-color: #e1e4e8;
    }

    .dn-home-page :global(.dn-home-section-heading--banner > .dn-home-section-action) {
      grid-row: 3;
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
