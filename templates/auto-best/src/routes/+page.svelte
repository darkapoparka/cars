<script lang="ts">
  import { dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import Hero from '$components/home/Hero.svelte';
  import SearchBox from '$components/home/SearchBox.svelte';
  import MobileCoreActions from '$components/home/MobileCoreActions.svelte';
  import BodyTypes from '$components/home/BodyTypes.svelte';
  import InventorySection from '$components/home/InventorySection.svelte';
  import BrandSection from '$components/home/BrandSection.svelte';
  import MobileServicesOverview from '$components/home/MobileServicesOverview.svelte';
  import Editorial from '$components/home/Editorial.svelte';
  import TrustActions from '$components/home/TrustActions.svelte';
  import VideoSection from '$components/home/VideoSection.svelte';
  import { brand } from '$config/brand';
  import { leadSite } from '$config/lead-site';
  import type { HomeBannerVariant } from '$config/lead-site';
  import { homeBannerVariants, canPreviewHomeBanners, selectedHomeBanner } from '$lib/ui/home-banner';

  const showBannerPreview = $derived(canPreviewHomeBanners && (dev || page.url.searchParams.has('banner')));
  const bannerVariant = $derived(selectedHomeBanner(page.url.searchParams));
  const bannerBackground = $derived(leadSite.artwork.homeSectionBannerAssets[bannerVariant]);
  const bannerMobileBackground = $derived(leadSite.artwork.homeSectionBannerMobileAssets[bannerVariant]);

  async function previewBanner(variant: HomeBannerVariant) {
    const next = new URL(page.url);
    next.searchParams.set('banner', variant);
    await goto(i18n.href(resolve(`/?${next.searchParams.toString()}${next.hash}`)), { replaceState: true, noScroll: true, keepFocus: true });
  }
</script>

<svelte:head>
  <title>{i18n.t("m_9cc31a8ba082", { p0: brand.name, p1: i18n.dealer('city') })}</title>
  <meta name="description" content={i18n.t("m_ed2d6b74bc69", { p0: i18n.dealer('city') })} />
</svelte:head>

{#if showBannerPreview}
  <nav class="dn-banner-preview" aria-label={i18n.t('home.bannerPreview.title')}>
    <span>{i18n.t('home.bannerPreview.title')}</span>
    {#each homeBannerVariants as variant (variant.id)}
      <button type="button" aria-pressed={bannerVariant === variant.id} onclick={() => previewBanner(variant.id)}>{i18n.t(variant.label)}</button>
    {/each}
  </nav>
{/if}

<div class="dn-home-page" data-banner-variant={bannerVariant} data-mobile-banner={leadSite.artwork.homeSectionBanner.mobile} style:--dn-home-section-background={`url("${leadSite.artwork.discoveryBackground}")`} style:--dn-home-circuit-outline={`url("${leadSite.artwork.homeCircuitOutline}")`} style:--dn-home-asphalt-background={`url("${leadSite.artwork.homeSectionBannerAssets.circuit}")`} style:--dn-home-mobile-asphalt-background={`url("${leadSite.artwork.homeSectionBannerMobileAssets.circuit}")`}>
  <div class="dn-home-slot dn-home-slot--hero"><Hero /></div>
  <div class="dn-home-slot dn-home-slot--search"><SearchBox /></div>
  <div class="dn-home-slot dn-home-slot--mobile-actions"><MobileCoreActions /></div>
  <div class="dn-home-slot dn-home-slot--browse-actions"><TrustActions group="browse" mobileArtwork={false} /></div>
  <div class="dn-home-slot dn-home-slot--inventory" style:--dn-home-section-background={`url("${bannerBackground}")`} style:--dn-home-mobile-section-background={`url("${bannerMobileBackground}")`}><InventorySection /></div>
  <div class="dn-home-slot dn-home-slot--body" style:--dn-home-section-background={`url("${bannerBackground}")`}><BodyTypes /></div>
  <div class="dn-home-slot dn-home-slot--brands" style:--dn-home-section-background={`url("${bannerBackground}")`}><BrandSection /></div>
  <div class="dn-home-slot dn-home-slot--ownership-actions"><TrustActions group="ownership" mobileArtwork={false} /></div>
  <div class="dn-home-slot dn-home-slot--services"><MobileServicesOverview /></div>
  <div class="dn-home-slot dn-home-slot--editorial" style:--dn-home-section-background={`url("${bannerBackground}")`}><Editorial /></div>
  <div class="dn-home-slot dn-home-slot--videos"><VideoSection /></div>
</div>

<style>
  .dn-banner-preview { display: none; }

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
    .dn-banner-preview {
      position: fixed;
      z-index: 100;
      left: 50%;
      bottom: var(--dn-space-4);
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: var(--dn-space-2);
      max-width: calc(100% - var(--dn-space-6));
      padding: var(--dn-space-2);
      border: 1px solid var(--dn-line);
      border-radius: var(--dn-radius);
      background: var(--dn-surface-raised);
      box-shadow: var(--dn-shadow);
      color: var(--dn-ink);
      font: var(--dn-control-font);
      white-space: nowrap;
    }
    .dn-banner-preview > span { padding-inline: var(--dn-space-2); }
    .dn-banner-preview > button {
      min-height: var(--dn-control-hit-height);
      padding: var(--dn-space-2) var(--dn-space-3);
      border: 1px solid var(--dn-line);
      border-radius: var(--dn-radius-button);
      background: var(--dn-surface-raised);
      color: var(--dn-ink);
      font: inherit;
      cursor: pointer;
    }
    .dn-banner-preview > button[aria-pressed='true'] {
      border-color: var(--dn-ink);
      background: var(--dn-ink);
      color: var(--dn-white);
    }
    .dn-banner-preview > button:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 2px; }

    .dn-home-page { --dn-home-heading-banner-height: 164px; }

    .dn-home-page :global(.dn-home-content-section) {
      padding-block: var(--dn-home-section-space);
      background: var(--dn-surface-canvas);
    }
    .dn-home-page :global(.dn-home-section-heading) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--dn-space-4);
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
      font: var(--dn-control-font);
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
      text-align: center;
    }

    .dn-home-page :global(:is(.dn-home-section-heading--branded, .dn-home-section-heading--banner) > :is(h2, p, a)) { position: relative; z-index: 1; }

    .dn-home-page :global(:is(.dn-home-section-heading--branded, .dn-home-section-heading--banner) > h2) { color: var(--dn-white); }
    .dn-home-page :global(:is(.dn-home-section-heading--branded, .dn-home-section-heading--banner) > p) { color: var(--dn-text-on-ink); }

    .dn-home-page :global(:is(.dn-body-types__heading, .dn-brand-hero__copy, .dn-inventory__heading, .dn-editorial__heading)) {
      background-image: var(--dn-home-section-background);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    /* Keep the photographed corners at their natural proportions. */
    .dn-home-page[data-banner-variant='kerb'] :global(.dn-home-section-heading--branded) {
      background-image: var(--dn-home-asphalt-background);
      background-size: 150% auto;
    }
    .dn-home-page[data-banner-variant='kerb'] :global(.dn-home-section-heading--branded::before),
    .dn-home-page[data-banner-variant='kerb'] :global(.dn-home-section-heading--branded::after) {
      content: '';
      position: absolute;
      z-index: 0;
      inset-block: 0;
      left: 0;
      width: min(22%, 180px);
      background-image: var(--dn-home-section-background);
      background-size: auto 100%;
      background-position: left center;
      background-repeat: no-repeat;
      mask-image: linear-gradient(to right, var(--dn-ink) 0 72%, transparent 100%);
      pointer-events: none;
    }
    .dn-home-page[data-banner-variant='kerb'] :global(.dn-home-section-heading--branded::after) {
      left: auto;
      right: 0;
      background-position: right center;
      mask-image: linear-gradient(to left, var(--dn-ink) 0 72%, transparent 100%);
    }

    /* Desktop Motorsport livery: decoration stays behind the live copy. */
    .dn-home-page[data-banner-variant='motorsport'] :global(.dn-home-section-heading--branded::before),
    .dn-home-page[data-banner-variant='motorsport'] :global(.dn-home-section-heading--branded::after) {
      content: '';
      position: absolute;
      z-index: 0;
      inset-block: 0;
      pointer-events: none;
      transform: skewX(-28deg);
    }

    .dn-home-page[data-banner-variant='motorsport'] :global(.dn-home-section-heading--branded::before) {
      left: 24px;
      width: 84px;
      background: linear-gradient(to right, var(--dn-red) 0 44px, transparent 44px 58px, var(--dn-surface-canvas) 58px 84px);
    }

    .dn-home-page[data-banner-variant='motorsport'] :global(.dn-home-section-heading--branded::after) {
      right: -26px;
      width: 62px;
      background: linear-gradient(to right, var(--dn-surface-canvas) 0 14px, transparent 14px 26px, var(--dn-red) 26px 62px);
    }

    /* Pair the admired asphalt edge with its exact counterpart on the right. */
    .dn-home-page[data-banner-variant='circuit'] :global(.dn-home-section-heading--branded::after) {
      content: '';
      position: absolute;
      z-index: 0;
      inset: 0;
      background-image: var(--dn-home-section-background);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transform: scaleX(-1);
      mask-image: linear-gradient(to right, var(--dn-ink) 0 13%, transparent 23%);
      pointer-events: none;
    }

    .dn-home-page :global(.dn-home-section-heading--light) {
      background: var(--dn-surface-raised);
    }
    .dn-home-page :global(.dn-home-section-heading--light > h2) { color: var(--dn-ink); }
    .dn-home-page :global(.dn-home-section-heading--light > p) { color: var(--dn-muted); }
    .dn-home-page :global(.dn-home-section-heading--light > .dn-home-section-action) { background: var(--dn-red); color: var(--dn-white); }
    .dn-home-page :global(.dn-home-section-heading--light > .dn-home-section-action:is(:hover, :focus-visible)) { background: var(--dn-red-hover); color: var(--dn-white); }
    .dn-home-page :global(.dn-home-section-heading--light > .dn-home-section-action:focus-visible) { outline-color: var(--dn-focus); }

    .dn-home-page :global(.dn-home-section-panel) {
      position: relative;
      margin: calc(-1 * var(--dn-home-banner-overlap)) 0 0;
      padding: var(--dn-space-6);
      border-radius: var(--dn-radius);
      background: var(--dn-surface-raised);
    }

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
      gap: var(--dn-space-4);
      text-align: center;
    }
    .dn-home-page :global(.dn-home-banner-copy > .dn-home-section-action) {
      margin-top: 0;
      align-self: center;
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

    .dn-home-page :global(.dn-home-section-title) {
      font-weight: var(--dn-weight-medium);
    }

    .dn-home-page :global(:is(.dn-vehicle-card, .dn-body-type, .dn-brand-card, .dn-discovery-toggle, .dn-editorial-item, .dn-browse-all)) {
      border: 1px solid var(--dn-line);
      border-radius: var(--dn-radius-card);
      box-shadow: var(--dn-card-shadow-subtle);
    }

    .dn-home-page :global(:is(.dn-body-type__title, .dn-brand-card strong, .dn-discovery-toggle strong)) {
      font-weight: var(--dn-weight-medium);
    }

    .dn-home-page :global(.dn-browse-all .action) {
      background: var(--dn-ink-deep);
      color: var(--dn-white);
    }

    .dn-home-page[data-mobile-banner='featured'] :global(.dn-inventory__heading) {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      min-height: 64px;
      flex-direction: column;
      justify-content: center;
      gap: var(--dn-space-half);
      padding: var(--dn-space-2) var(--dn-space-3);
      border-radius: var(--dn-radius-card);
      background-color: var(--dn-theme-hero-surface-deep);
      background-image: var(--dn-home-mobile-section-background);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      text-align: center;
    }
    .dn-home-page[data-mobile-banner='featured'] :global(.dn-inventory__heading h2) {
      position: relative;
      z-index: 1;
      max-width: 100%;
      color: var(--dn-white);
      text-align: center;
      text-wrap: balance;
      scroll-margin-top: calc(var(--dn-space-8) * 3);
    }
    .dn-home-page[data-mobile-banner='featured'][data-banner-variant='headlights'] :global(.dn-inventory__heading) {
      background-image: linear-gradient(to right, transparent, color-mix(in srgb, var(--dn-theme-hero-surface-deep) 88%, transparent) 18% 82%, transparent), var(--dn-home-mobile-section-background);
    }
    .dn-home-page[data-mobile-banner='featured'][data-banner-variant='kerb'] :global(.dn-inventory__heading) {
      background-image: var(--dn-home-mobile-asphalt-background);
      background-size: 150% auto;
    }
    .dn-home-page[data-mobile-banner='featured'][data-banner-variant='kerb'] :global(.dn-inventory__heading::before),
    .dn-home-page[data-mobile-banner='featured'][data-banner-variant='kerb'] :global(.dn-inventory__heading::after) {
      content: '';
      position: absolute;
      z-index: 0;
      inset-block: 0;
      left: 0;
      width: 25%;
      background-image: var(--dn-home-mobile-section-background);
      background-size: auto 100%;
      background-position: left center;
      background-repeat: no-repeat;
      mask-image: linear-gradient(to right, var(--dn-ink) 0 72%, transparent 100%);
      pointer-events: none;
    }
    .dn-home-page[data-mobile-banner='featured'][data-banner-variant='kerb'] :global(.dn-inventory__heading::after) {
      left: auto;
      right: 0;
      background-position: right center;
      mask-image: linear-gradient(to left, var(--dn-ink) 0 72%, transparent 100%);
    }
    .dn-home-page[data-mobile-banner='featured'][data-banner-variant='circuit'] :global(.dn-inventory__heading::after) {
      content: '';
      position: absolute;
      z-index: 0;
      inset: 0;
      background-image: var(--dn-home-mobile-section-background);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transform: scaleX(-1);
      mask-image: linear-gradient(to right, var(--dn-ink) 0 13%, transparent 23%);
      pointer-events: none;
    }
    .dn-home-page[data-mobile-banner='featured'][data-banner-variant='motorsport'] :global(.dn-inventory__heading::before),
    .dn-home-page[data-mobile-banner='featured'][data-banner-variant='motorsport'] :global(.dn-inventory__heading::after) {
      content: '';
      position: absolute;
      z-index: 0;
      inset-block: 0;
      width: 18px;
      background: linear-gradient(to right, var(--dn-red) 0 10px, transparent 10px 12px, var(--dn-surface-canvas) 12px 18px);
      transform: skewX(-28deg);
      pointer-events: none;
    }
    .dn-home-page[data-mobile-banner='featured'][data-banner-variant='motorsport'] :global(.dn-inventory__heading::before) { left: 10px; }
    .dn-home-page[data-mobile-banner='featured'][data-banner-variant='motorsport'] :global(.dn-inventory__heading::after) { right: 10px; }
  }
</style>
