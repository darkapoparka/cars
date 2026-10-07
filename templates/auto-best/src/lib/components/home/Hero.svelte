<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import HeroVehicles from '$components/ui/HeroVehicles.svelte';
  import DesktopHeroScene from '$components/ui/DesktopHeroScene.svelte';
  import HeroLocation from '$components/ui/HeroLocation.svelte';
  import { mobileHeroRegions } from '$data/vehicle-artwork';
  import { imageSrcset, mobileHeroSizes } from '$data/responsive-images';
</script>

<svelte:head>
  <link rel="preload" as="image" href={mobileHeroRegions.home.src} imagesrcset={imageSrcset(mobileHeroRegions.home.src)} imagesizes={mobileHeroSizes} media="(max-width: 767px)" fetchpriority="high" />
</svelte:head>

<section class="dn-hero dn-route-hero dn-route-hero--campaign dn-route-hero--search dn-discovery-hero" aria-labelledby="home-hero-title">
  <DesktopHeroScene scene="home" />
  <HeroVehicles pair="home" mobile desktop={false} />
  <div class="container dn-hero__inner dn-route-hero__layout">
    <div class="dn-hero__copy dn-route-hero__copy">
      <h1 id="home-hero-title">
        <span class="dn-hero__title-desktop">{i18n.t("m_bb7c0e3ca487")}</span>
        <span class="dn-hero__title-mobile">{i18n.t("m_f92c64344e85")}</span>
      </h1>
      <HeroLocation />
    </div>
  </div>
</section>

<style>
  .dn-hero {
    isolation: isolate;
  }

  @media (min-width: 992px) {
    .dn-hero { --dn-home-car-height: clamp(128px, 11.111vw, 184px); background: var(--dn-theme-hero-surface-deep); }
    /* Normalize the painted height rather than the transparent image frame. */
    .dn-hero :global(.dn-campaign-vehicles__car) { --car-size: calc(var(--dn-home-car-height) / var(--art-body-height-ratio)); }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    .dn-hero { --dn-home-car-height: 72px; }
  }

  @media (min-width: 1200px) {
    .dn-hero :global(.dn-campaign-vehicles) { --side-room: max(0px, calc((100% - var(--dn-hero-center-width)) / 2 - var(--dn-space-6))); }
  }

  .dn-hero__title-mobile {
    display: none;
  }

  @media (max-width: 767px) {
    .dn-hero {
      height: 208px;
      min-height: 208px;
      background: #090a0b;
    }

    .dn-hero__inner {
      padding: 0;
    }

    .dn-hero__copy h1 {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      border: 0;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    .dn-hero__title-desktop {
      display: none;
    }

    .dn-hero__title-mobile {
      display: inline;
    }
  }
</style>
