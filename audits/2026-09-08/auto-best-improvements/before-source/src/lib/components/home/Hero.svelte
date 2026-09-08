<script lang="ts">
  import { brand } from '$config/brand';
  import HeroVehicles from '$components/ui/HeroVehicles.svelte';
</script>

<section class="dn-hero dn-route-hero" aria-labelledby="home-hero-title">
  <HeroVehicles pair="home" mobile mobileLeft="gclass" mobileRight="urus" />
  <picture>
  <source srcset="/assets/images/lead/day-night-home-black-v1.webp" />
  <img
    class="dn-hero__media"
    src="/assets/images/lead/day-night-home-hero-v3.webp"
    alt=""
    width="1881"
    height="836"
    fetchpriority="high"
    decoding="async"
  />
  </picture>
  <div class="dn-hero__overlay"></div>
  <div class="container dn-hero__inner dn-route-hero__layout">
    <div class="dn-hero__copy dn-route-hero__copy">
      <h1 id="home-hero-title">
        <span class="dn-hero__title-desktop">Изберете своя автомобил</span>
        <span class="dn-hero__title-mobile">Намери автомобил</span>
      </h1>
      <p class="dn-hero__location">{brand.city} · Студентски град · Оглед по уговорка</p>
    </div>
  </div>
</section>

<style>
  .dn-hero {
    isolation: isolate;
  }

  .dn-hero__location { display: none; }

  .dn-hero__media,
  .dn-hero__overlay {
    position: absolute;
    inset: 0;
  }

  .dn-hero__media {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .dn-hero__overlay {
    background: linear-gradient(180deg, rgb(10 12 16 / .12), transparent 65%);
  }

  @media (min-width: 992px) {
    .dn-hero { background: #101114; }
    .dn-hero .dn-hero__media { object-position: center 55%; }
    .dn-hero__overlay { display: none; }
    .dn-hero__inner { height: 320px; padding-top: 0; }
    .dn-hero .dn-hero__copy { position: absolute; bottom: 24px; width: min(800px, calc(100% - 480px)); display: block; }
    .dn-hero__copy h1 { color: #fff; font-size: clamp(36px, 3.4vw, 56px); line-height: 1.12; }
    .dn-hero__copy .dn-hero__location { display: block; margin: 8px auto 0; color: #d7d9dd; font-size: 16px; line-height: 24px; }
  }

  .dn-hero__title-mobile {
    display: none;
  }

  @media (max-width: 991px) {
    .dn-hero__media {
      object-position: 48% center;
    }
  }

  @media (max-width: 767px) {
    .dn-hero {
      height: 208px;
      min-height: 208px;
      background: #090a0b;
    }

    .dn-hero__media {
      object-position: right center;
    }

    .dn-hero__overlay {
      background: linear-gradient(180deg, rgba(6, 8, 11, 0.08) 0%, rgba(6, 8, 11, 0.22) 52%, rgba(6, 8, 11, 0.68) 100%);
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
