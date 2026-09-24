<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import HeroVehicles from '$components/ui/HeroVehicles.svelte';
</script>

<section class="dn-hero dn-route-hero dn-route-hero--light dn-discovery-hero" aria-labelledby="home-hero-title">
  <HeroVehicles pair="home" mobile />
  <div class="container dn-hero__inner dn-route-hero__layout">
    <div class="dn-hero__copy dn-route-hero__copy">
      <h1 id="home-hero-title">
        <span class="dn-hero__title-desktop">{i18n.t("m_bb7c0e3ca487")}</span>
        <span class="dn-hero__title-mobile">{i18n.t("m_f92c64344e85")}</span>
      </h1>
      <p class="dn-hero__location">{i18n.dealer('city')}, {i18n.dealer('addressLine')}</p>
    </div>
  </div>
</section>

<style>
  .dn-hero {
    isolation: isolate;
  }

  .dn-hero__location { display: none; }

  @media (min-width: 992px) {
    .dn-hero { background: var(--dn-surface-canvas); }
    .dn-hero__copy .dn-hero__location { display: block; color: var(--dn-studio-description); text-wrap: balance; }
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
