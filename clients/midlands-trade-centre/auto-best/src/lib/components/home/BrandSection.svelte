<script lang="ts">
  import { resolve } from '$app/paths';
  import { brands } from '$data/home';
  let expanded = $state(false);
</script>

<section class="dn-brand-section" aria-labelledby="brand-title">
  <div class="container dn-brand-shell">
    <div class="dn-brand-hero">
      <div class="dn-brand-hero__copy dn-home-section-heading dn-home-section-heading--branded dn-home-banner-frame dn-home-banner-copy dn-home-section-heading--compact">
        <h2 id="brand-title" class="dn-home-section-title">
          <span class="dn-heading-desktop">Choose by make</span>
          <span class="dn-heading-mobile">By make</span>
        </h2>
        <a class="dn-brand-hero__cta dn-home-section-action" href={resolve('/listing-grid')} aria-label="View all vehicles"><span class="dn-heading-desktop">View all vehicles</span><span class="dn-heading-mobile" aria-hidden="true">All</span></a>
      </div>
    </div>
    <div class="dn-brand-panel">
      <div class="dn-brand-grid" style:--brand-columns={Math.max(1, Math.min(brands.length, 6))} aria-label="Vehicles by make">
        {#each brands as brand (brand.label)}
          <a class="dn-brand-card" class:dn-brand-card--secondary={!expanded && brand.count === 0} data-stock-count={brand.count} href={resolve(`/listing-grid?make=${encodeURIComponent(brand.label)}`)}>
            <span class="dn-brand-card__image">
              <img src={brand.image} alt={`${brand.label} logo`} loading="lazy" decoding="async" width="180" height="80" />
            </span>
            <strong>{brand.label}</strong>
          </a>
        {/each}
      </div>
      <button class="dn-discovery-toggle" aria-expanded={expanded} onclick={() => expanded = !expanded}>{expanded ? 'Show less' : 'All makes'}</button>
    </div>
  </div>
</section>

<style>
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
    .dn-brand-section { padding: 24px 0 12px; background: var(--dn-mobile-canvas); }
    .dn-brand-shell { padding-inline: 12px; border-radius: 0; background: transparent; }
    .dn-brand-hero { padding: 0; }
    .dn-brand-hero__copy { gap: 16px; }
    .dn-brand-hero h2 { color: #171a20; font-size: 22px; font-weight: 700; line-height: 1.15; letter-spacing: -.025em; }
    .dn-heading-desktop { display: none; }
    .dn-brand-hero__cta { min-height: 44px; padding: 0; border: 0; background: transparent; color: #4f5661; font-size: 14px; }
    .dn-heading-mobile { display: inline; }
    .dn-brand-panel { margin-top: 8px; padding: 0; border-radius: 0; background: transparent; }
    .dn-brand-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .dn-brand-card { min-height: 108px; padding: 10px 6px; border-radius: 14px; background: var(--dn-mobile-surface); }
    .dn-brand-card__image { height: 48px; margin-bottom: 6px; }
    .dn-brand-card__image img { width: 58px; height: 44px; }
    .dn-brand-card--secondary { display: none; }
    .dn-brand-card strong { font-size: 14px; line-height: 1.2; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-brand-card { transition: none; }
  }
</style>
