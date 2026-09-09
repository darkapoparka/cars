<script lang="ts">
  import VehicleCutout from '$components/ui/VehicleCutout.svelte';
  import { resolve } from '$app/paths';
  import { brands } from '$data/home';
</script>

<section class="dn-brand-section" aria-labelledby="brand-title">
  <div class="dn-brand-hero">
    <div class="dn-brand-hero__vehicle"><VehicleCutout vehicle="urus" framing="banner" /></div>
    <div class="container dn-brand-hero__inner">
      <div class="dn-brand-hero__copy dn-home-section-heading dn-home-section-heading--banner">
        <h2 id="brand-title" class="dn-home-section-title">
          <span class="dn-heading-desktop">Търсене по марка</span>
          <span class="dn-heading-mobile">По марка</span>
        </h2>
        <p>Изберете марка и разгледайте автомобилите.</p>
        <a class="dn-brand-hero__cta dn-home-section-action" href={resolve('/listing-grid')} aria-label="Вижте всички автомобили">
          <span class="dn-heading-desktop">Вижте всички автомобили</span>
          <span class="dn-heading-mobile" aria-hidden="true">Всички</span>
        </a>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="dn-brand-panel">
      <div class="dn-brand-grid" aria-label="Автомобили по марка">
        {#each brands as brand (brand.label)}
          <a class="dn-brand-card" href={resolve(`/listing-grid?make=${encodeURIComponent(brand.label)}`)}>
            <span class="dn-brand-card__image">
              <img src={brand.image} alt={`${brand.label} лого`} loading="lazy" decoding="async" width="180" height="80" />
            </span>
            <span class="dn-brand-card__content">
              <strong>{brand.label}</strong>
              <small>{brand.count} {brand.count === 1 ? 'автомобил' : 'автомобила'}</small>
            </span>
          </a>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .dn-brand-hero__vehicle { display: none; }
  .dn-brand-section {
    padding: 54px 0 70px;
    background: #fff;
  }

  .dn-brand-hero {
    position: relative;
    min-height: 420px;
    margin: 0 12px;
    overflow: hidden;
    border-radius: 24px;
    background: url('/assets/images/section/bg-6.jpg') center / cover no-repeat;
    isolation: isolate;
  }

  .dn-brand-hero::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    content: '';
    background: rgba(0, 0, 0, 0.55);
  }

  .dn-brand-hero__inner {
    display: flex;
    min-height: 420px;
    justify-content: center;
    padding-top: 56px;
    text-align: center;
  }

  .dn-heading-mobile {
    display: none;
  }

  .dn-brand-hero__copy {
    position: relative;
    z-index: 1;
    width: min(618px, 100%);
    color: #fff;
  }

  .dn-brand-hero h2 {
    margin: 0 0 17px;
    color: #fff;
    font-size: clamp(36px, 3vw, 48px);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -0.025em;
  }

  .dn-brand-hero p {
    margin: 0 auto 34px;
    color: rgba(255, 255, 255, 0.84);
    font-size: 16px;
    line-height: 1.55;
  }

  .dn-brand-hero__cta {
    display: inline-flex;
    min-height: 50px;
    align-items: center;
    justify-content: center;
    padding: 0 28px;
    border-radius: var(--dn-radius-button);
    background: #c40101;
    color: #fff;
    font-size: var(--dn-text-lead);
    font-weight: 600;
    line-height: 1.3;
    transition: background-color 0.3s ease;
  }

  .dn-brand-hero__cta:hover,
  .dn-brand-hero__cta:focus-visible {
    background: #24272c;
    color: #fff;
  }

  .dn-brand-panel {
    position: relative;
    z-index: 3;
    margin: -150px -30px 0;
    padding: 30px;
    border-radius: 16px;
    background: #fff;
  }

  .dn-brand-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 30px;
  }

  .dn-brand-card {
    display: block;
    min-width: 0;
    padding: 25px 25px 20px;
    border: 1px solid #ededed;
    border-radius: 16px;
    background: #fff;
    color: #24272c;
    text-align: center;
    transform: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .dn-brand-card:hover,
  .dn-brand-card:focus-visible {
    border-color: transparent;
    color: #24272c;
    transform: none;
    box-shadow: var(--dn-card-hover-shadow);
  }

  .dn-brand-card__image {
    display: flex;
    width: 100%;
    height: 80px;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .dn-brand-card__image img {
    width: 100%;
    height: 80px;
    margin: 0;
    object-fit: contain;
  }

  .dn-brand-card__content {
    display: block;
  }

  .dn-brand-card strong,
  .dn-brand-card small {
    display: block;
  }

  .dn-brand-card strong {
    margin-bottom: 5px;
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dn-brand-card small {
    max-width: 13ch;
    margin-inline: auto;
    color: #626a75;
    font-size: var(--dn-text-meta);
    line-height: var(--dn-leading-meta);
  }

  @media (min-width: 1200px) {
    .dn-brand-hero {
      background-attachment: fixed;
    }
  }

  @media (min-width: 992px) {
    .dn-brand-section {
      padding-block: 32px;
    }

    .dn-brand-hero {
      width: min(var(--dn-content), calc(100% - 48px));
      min-height: 184px;
      margin-inline: auto;
      border-radius: 20px;
      background-attachment: scroll;
    }

    .dn-brand-hero__inner {
      width: 100%;
      min-height: 184px;
      padding: 32px;
      text-align: left;
    }

    .dn-brand-hero__copy {
      display: grid;
      width: 100%;
      grid-template-columns: minmax(0, 1fr) auto;
      align-content: start;
      align-items: center;
      column-gap: 32px;
      row-gap: 12px;
    }

    .dn-brand-hero h2 {
      margin: 0;
      font-size: 32px;
    }

    .dn-brand-hero p {
      max-width: 640px;
      margin: 0;
      grid-column: 1;
    }

    .dn-brand-hero__cta {
      min-height: 44px;
      grid-column: 2;
      grid-row: 1 / span 2;
      padding-inline: 20px;
      background: #fff;
      color: #24272c;
      font-size: 16px;
    }

    .dn-brand-panel {
      margin: -24px 0 0;
      padding: 24px;
    }

    .dn-brand-grid {
      gap: 16px;
    }

    .dn-brand-card {
      padding: 16px 12px;
    }

    .dn-brand-card__image,
    .dn-brand-card__image img {
      height: 52px;
    }

    .dn-brand-card__image {
      margin-bottom: 12px;
    }

    .dn-brand-card small {
      display: none;
    }
  }

  @media (min-width: 1200px) and (max-width: 1360px) {
    .dn-brand-panel {
      margin-inline: 0;
    }
  }

  @media (max-width: 1199px) {
    .dn-brand-panel {
      margin-inline: 0;
    }

    .dn-brand-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }
  }

  @media (max-width: 767px) {
    .dn-brand-section {
      padding: 24px 0 12px;
      background: var(--dn-mobile-canvas);
    }

    .dn-brand-hero {
      min-height: 0;
      margin: 0;
      overflow: visible;
      border-radius: 0;
      background: none;
    }

    .dn-brand-hero__inner {
      min-height: 44px;
      align-items: center;
      justify-content: space-between;
      padding: 0;
      text-align: left;
    }

    .dn-brand-hero::before {
      display: none;
    }

    .dn-brand-hero__copy {
      display: flex;
      width: 100%;
      min-height: 44px;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: #171a20;
    }

    .dn-brand-hero h2 {
      margin: 0;
      color: #171a20;
      font-size: 22px;
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.025em;
    }

    .dn-heading-desktop {
      display: none;
    }

    .dn-heading-mobile {
      display: inline;
    }

    .dn-brand-hero p {
      display: none;
    }

    .dn-brand-hero__cta {
      min-height: 44px;
      padding: 0;
      background: transparent;
      color: #4f5661;
      font-size: 14px;
      font-weight: 650;
    }

    .dn-brand-panel {
      margin: 8px 0 0;
      padding: 0;
      border-radius: 0;
      background: transparent;
    }

    .dn-brand-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .dn-brand-card {
      min-height: 108px;
      padding: 10px 6px;
      border: 0;
      border-radius: 14px;
      background: var(--dn-mobile-surface);
    }

    .dn-brand-card:nth-child(n + 7) {
      display: none;
    }

    .dn-brand-card__image {
      height: 48px;
      margin-bottom: 6px;
    }

    .dn-brand-card__image img {
      width: 58px;
      height: 44px;
    }

    .dn-brand-card strong {
      margin: 0;
      font-size: 13px;
      line-height: 1.2;
    }

    .dn-brand-card small {
      display: none;
    }
  }

  @media (max-width: 767px) {
    .dn-brand-hero__cta { display: inline-flex; }
    .dn-brand-card:nth-child(n + 6) { display: none; }
  }
  @media (min-width: 992px) {
    .dn-brand-hero { background: #101114; min-height: 234px; overflow: hidden; }
    .dn-brand-hero::before { display: none; }
    .dn-brand-hero__inner { min-height: 234px; justify-content: flex-start; }
    .dn-brand-hero__copy { width: calc(100% - 310px); grid-template-columns: 1fr; gap: 10px; }
    .dn-brand-hero__cta { grid-column: 1; grid-row: auto; justify-self: start; }
    .dn-brand-hero__vehicle { display: block; position: absolute; right: -32px; bottom: 4px; width: 340px; height: 226px; pointer-events: none; }
  }
</style>
