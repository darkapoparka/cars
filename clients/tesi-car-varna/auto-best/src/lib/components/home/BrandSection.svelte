<script lang="ts">
  import { resolve } from '$app/paths';
  import { brands } from '$data/home';
  const mobileBrands = new Set(brands.filter(brand => brand.count > 0).slice(0, 3).map(brand => brand.label));
  let expanded = $state(false);
</script>

<section class="dn-brand-section" aria-labelledby="brand-title">
  <div class="container dn-brand-shell">
    <div class="dn-brand-hero">
      <div class="dn-brand-hero__copy dn-home-section-heading dn-home-section-heading--branded dn-home-banner-frame dn-home-banner-copy dn-home-section-heading--compact">
        <h2 id="brand-title" class="dn-home-section-title">
          <span class="dn-heading-desktop">Изберете по марка</span>
          <span class="dn-heading-mobile">По марка</span>
        </h2>
        <a class="dn-brand-hero__cta dn-home-section-action" href={resolve('/listing-grid')} aria-label="Вижте всички автомобили"><span class="dn-heading-desktop">Вижте всички автомобили</span><span class="dn-heading-mobile" aria-hidden="true">Всички</span></a>
      </div>
    </div>
    <div class="dn-brand-panel">
      <div id="brands-grid" class="dn-brand-grid" style:--brand-columns={Math.max(1, Math.min(brands.length, 6))} aria-label="Автомобили по марка">
        {#each brands as brand (brand.label)}
          <a class="dn-brand-card" class:dn-brand-card--additional={!mobileBrands.has(brand.label)} class:dn-brand-card--secondary={!expanded && !mobileBrands.has(brand.label)} data-stock-count={brand.count} href={resolve(`/listing-grid?make=${encodeURIComponent(brand.label)}`)}>
            <span class="dn-brand-card__image">
              <span class="dn-brand-card__frame" style:--logo-width={`${Math.min(84, 44 * (brand.bounds[2] - brand.bounds[0]) / (brand.bounds[3] - brand.bounds[1]))}px`} style:--logo-ratio={`${brand.bounds[2] - brand.bounds[0]} / ${brand.bounds[3] - brand.bounds[1]}`} style:--logo-image-width={`${brand.width / (brand.bounds[2] - brand.bounds[0]) * 100}%`} style:--logo-left={`${-brand.bounds[0] / (brand.bounds[2] - brand.bounds[0]) * 100}%`} style:--logo-top={`${-brand.bounds[1] / (brand.bounds[3] - brand.bounds[1]) * 100}%`}><img src={brand.image} alt={`${brand.label} лого`} loading="lazy" decoding="async" width={brand.width} height={brand.height} /></span>
            </span>
            <strong>{brand.label}</strong>
          </a>
        {/each}
      <button class="dn-discovery-toggle" aria-expanded={expanded} aria-controls="brands-grid" onclick={() => expanded = !expanded}><span class="dn-brand-card__image" aria-hidden="true"><svg class:expanded width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg></span><strong>{expanded ? 'Покажи по-малко' : 'Всички марки'}</strong></button>
      </div>

    </div>
  </div>
</section>

<style>
  .dn-brand-card__frame { display: contents; }
  .dn-discovery-toggle { display: none; }
  @media (max-width: 767px) {
    .dn-discovery-toggle { display: flex; width: 100%; min-height: 44px; align-items: center; justify-content: center; margin-top: 10px; border: 1px solid #d9dde1; border-radius: var(--dn-radius-button); background: #eceef0; color: #24272c; font: inherit; font-size: 14px; font-weight: 600; }
    .dn-discovery-toggle:focus-visible { outline: 3px solid #8c959f; outline-offset: 3px; }
  }

  .dn-brand-section { padding: 32px 0; background: #fff; }
  .dn-brand-shell { padding: 0; border-radius: 20px; background: var(--dn-home-panel); }
  .dn-brand-hero { padding: 32px 32px 24px; }
  .dn-brand-hero__copy { display: flex; min-height: 44px; align-items: center; justify-content: space-between; gap: 24px; }
  .dn-brand-hero h2 { margin: 0; color: #1f2937; font-size: 32px; font-weight: 650; line-height: 1.2; letter-spacing: -.03em; }
  .dn-heading-mobile { display: none; }
  .dn-brand-hero__cta { display: inline-flex; min-height: 44px; flex-shrink: 0; align-items: center; justify-content: center; padding: 0 20px; border: 1px solid #e1e4e8; border-radius: var(--dn-radius-button); background: #fff; color: #24272c; font-size: 16px; font-weight: 600; line-height: 1.3; }
  .dn-brand-panel { padding: 0 32px 32px; border-radius: 0 0 20px 20px; background: var(--dn-home-panel); }
  .dn-brand-grid { display: grid; grid-template-columns: repeat(var(--brand-columns), minmax(0, 1fr)); gap: 16px; margin-top: 0; }
  .dn-brand-card { display: block; min-width: 0; padding: 16px 12px; border: 0; border-radius: 16px; background: #fff; color: #24272c; text-align: center; transform: none; transition: box-shadow 180ms ease-out; }
  .dn-brand-card__image { display: flex; width: 100%; height: 52px; align-items: center; justify-content: center; margin-bottom: 12px; }
  .dn-brand-card__image img { width: 100%; height: 52px; object-fit: contain; }
  .dn-brand-card strong { display: block; margin: 0; color: #24272c; font-size: 16px; font-weight: 600; line-height: 1.3; }
  .dn-brand-card:hover, .dn-brand-card:focus-visible { box-shadow: var(--dn-card-hover-shadow); }
  .dn-brand-hero__cta:hover { background: #e9edf1; }
  a:focus-visible { outline: 3px solid #8c959f; outline-offset: 3px; }

  @media (min-width: 768px) and (max-width: 1199px) {
    .dn-brand-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .dn-brand-hero h2 { font-size: 28px; }
  }

  @media (min-width: 992px) {
    .dn-brand-hero { padding: 0; }
    .dn-brand-panel { position: relative; margin-top: calc(-1 * var(--dn-home-banner-overlap)); padding: 24px; border-radius: var(--dn-radius); }
    .dn-brand-card__image, .dn-brand-card__image img { height: 72px; }
    .dn-brand-card strong { font-size: 18px; line-height: 24px; }
  }

  @media (max-width: 767px) {
    .dn-brand-section { padding: 16px 0 12px; background: var(--dn-mobile-canvas); }
    .dn-brand-shell { padding-inline: 0; border-radius: 0; background: transparent; }
    .dn-brand-hero { padding: 0; }
    .dn-brand-hero__copy { gap: 16px; }
    .dn-brand-hero h2 { color: #171a20; font-size: 22px; font-weight: 700; line-height: 1.15; letter-spacing: -.025em; }
    .dn-heading-desktop { display: none; }
    .dn-brand-hero__cta { display: none; min-height: 44px; padding: 0; border: 0; background: transparent; color: #4f5661; font-size: 14px; }
    .dn-heading-mobile { display: inline; }
    .dn-brand-panel { margin-top: 8px; padding: 0; border-radius: 0; background: transparent; }
    .dn-brand-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .dn-brand-card { min-height: 108px; padding: 10px 6px; border-radius: 14px; background: var(--dn-mobile-surface); }
    .dn-brand-card__image { height: 48px; margin-bottom: 6px; }
    .dn-brand-card__frame { display: block; position: relative; width: var(--logo-width); aspect-ratio: var(--logo-ratio); overflow: hidden; }
    .dn-brand-card__image img { position: absolute; width: var(--logo-image-width); max-width: none; height: auto; left: var(--logo-left); top: var(--logo-top); }
    .dn-discovery-toggle svg { padding: 8px; border-radius: 50%; background: var(--dn-mobile-canvas); color: var(--dn-red); }
    .dn-discovery-toggle svg.expanded { transform: rotate(180deg); }
    .dn-brand-card--secondary { display: none; }
    .dn-brand-card strong { font-size: 15px; line-height: 1.2; }
    .dn-brand-card--additional { order: 2; }
    .dn-discovery-toggle { order: 1; display: block; min-height: 108px; margin: 0; padding: 10px 6px; border: 0; border-radius: 14px; background: var(--dn-mobile-surface); color: var(--dn-ink); font-size: 15px; }
    .dn-discovery-toggle .dn-brand-card__image { color: var(--dn-muted); }
    .dn-discovery-toggle strong { display: block; line-height: 1.2; font-weight: 600; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-brand-card { transition: none; }
  }
</style>
