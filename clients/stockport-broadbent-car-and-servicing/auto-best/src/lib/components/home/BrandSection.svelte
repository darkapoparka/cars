<script lang="ts">

  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import DiscoveryAllTile from './DiscoveryAllTile.svelte';
  import { brands, desktopBrands, homeBrandCards, mobileBrandArtwork, mobileBrandLabels, mobileFeaturedBrandLabels } from '$data/home';
  const mobileBrands = new Set<string>(mobileFeaturedBrandLabels);
  const desktopBrandLabels = new Set<string>(desktopBrands.map(brand => brand.label));
  type BrandArtwork = (typeof mobileBrandArtwork)[string];
  const logoWidth = (brand: BrandArtwork, opticalHeight: number, maxWidth: number) => Math.round(Math.min(
    maxWidth,
    opticalHeight * (brand.bounds[2] - brand.bounds[0]) / (brand.bounds[3] - brand.bounds[1])
  ));
  const mobileLogoWidth = (brand: BrandArtwork) => logoWidth(brand, 46, 104);
  const desktopLogoWidth = (brand: BrandArtwork) => logoWidth(brand, 60, 116);
  let expanded = $state(false);
</script>

<section class="dn-brand-section dn-home-content-section" aria-labelledby="brand-title">
  <div class="container dn-brand-shell">
    <div class="dn-brand-hero">
      <div class="dn-brand-hero__copy dn-home-section-heading dn-home-section-heading--branded dn-home-banner-frame dn-home-banner-copy">
        <h2 id="brand-title" class="dn-home-section-title">
          <span class="dn-heading-desktop">{i18n.t("m_9eb6d7e50e27")}</span>
          <span class="dn-heading-mobile">{i18n.t("m_5216bd5728f8")}</span>
        </h2>
        <a class="dn-brand-hero__cta dn-home-section-action" href={i18n.href(resolve('/cars'))} aria-label={i18n.t("m_7d6647b063a2")}><span class="dn-heading-desktop dn-home-action-label">{i18n.t("m_30a64216eaea")} <Icon name="arrow-right" size={18} /></span><span class="dn-heading-mobile" aria-hidden="true">{i18n.t("m_a52ace420f21")}</span></a>
      </div>
    </div>
    <div class="dn-brand-panel dn-home-section-panel">
      <div id="brands-grid" class="dn-brand-grid" style:--brand-columns={Math.max(1, Math.min(desktopBrands.length, 6))}>
        {#each homeBrandCards as brand (brand.label)}
          {@const mobile = mobileBrandArtwork[brand.label] ?? brand}
          <a class="dn-brand-card" class:dn-brand-card--desktop-only={brand.count === 0 && !mobileBrands.has(brand.label)} class:dn-brand-card--mobile-only={!desktopBrandLabels.has(brand.label)} class:dn-brand-card--additional={!mobileBrands.has(brand.label)} class:dn-brand-card--secondary={!expanded && !mobileBrands.has(brand.label)} data-stock-count={brand.count} href={i18n.href(resolve(`/cars?make=${encodeURIComponent(brand.label)}`))}>
            <span class="dn-brand-card__image">
              <span class="dn-brand-card__frame"
                style:--logo-tablet-width={`${logoWidth(brand, 46, 84)}px`}
                style:--logo-mobile-width={`${mobileLogoWidth(mobile)}px`}
                style:--logo-desktop-width={`${desktopLogoWidth(brand)}px`}
                style:--logo-ratio={`${brand.bounds[2] - brand.bounds[0]} / ${brand.bounds[3] - brand.bounds[1]}`}
                style:--logo-image-width={`${brand.width / (brand.bounds[2] - brand.bounds[0]) * 100}%`}
                style:--logo-left={`${-brand.bounds[0] / (brand.bounds[2] - brand.bounds[0]) * 100}%`}
                style:--logo-top={`${-brand.bounds[1] / (brand.bounds[3] - brand.bounds[1]) * 100}%`}
                style:--logo-mobile-ratio={`${mobile.bounds[2] - mobile.bounds[0]} / ${mobile.bounds[3] - mobile.bounds[1]}`}
                style:--logo-mobile-image-width={`${mobile.width / (mobile.bounds[2] - mobile.bounds[0]) * 100}%`}
                style:--logo-mobile-left={`${-mobile.bounds[0] / (mobile.bounds[2] - mobile.bounds[0]) * 100}%`}
                style:--logo-mobile-top={`${-mobile.bounds[1] / (mobile.bounds[3] - mobile.bounds[1]) * 100}%`}
              >
                <picture>
                  <source media="(max-width: 767px)" srcset={mobile.image} width={mobile.width} height={mobile.height} />
                  <img src={brand.image} alt={i18n.t("m_f6e3b3cf6fb0", { p0: brand.label })} loading="lazy" decoding="async" width={brand.width} height={brand.height} />
                </picture>
              </span>
            </span>
            <strong>
              <span class="dn-brand-card__label--desktop">{brand.label}</span>
              <span class="dn-brand-card__label--mobile">{mobileBrandLabels[brand.label] ?? brand.label}</span>
            </strong>
          </a>
        {/each}
        <DiscoveryAllTile
          {expanded}
          controls="brands-grid"
          ontoggle={brands.length > mobileBrands.size ? () => expanded = !expanded : undefined}
        />
      </div>

    </div>
  </div>
</section>

<style>
  .dn-brand-card__frame { display: block; position: relative; width: var(--logo-tablet-width); aspect-ratio: var(--logo-ratio); overflow: hidden; }

  .dn-brand-section { padding: 32px 0; background: #fff; }
  .dn-brand-shell { padding: 0; border-radius: 20px; background: var(--dn-home-panel); }
  .dn-brand-hero { padding: 32px 32px 24px; }
  .dn-brand-hero__copy { display: flex; min-height: 44px; align-items: center; justify-content: space-between; gap: 24px; }
  .dn-brand-hero h2 { margin: 0; color: #1f2937; font-size: var(--dn-text-section-compact); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
  .dn-heading-mobile { display: none; }
  .dn-brand-hero__cta { display: inline-flex; min-height: 44px; flex-shrink: 0; align-items: center; justify-content: center; padding: 0 20px; border: 1px solid #e1e4e8; border-radius: var(--dn-radius-button); background: #fff; color: #24272c; font-size: var(--dn-cta-size); font-weight: var(--dn-cta-weight); line-height: var(--dn-leading-control); }
  .dn-brand-panel { padding: 0 32px 32px; border-radius: 0 0 20px 20px; background: var(--dn-home-panel); }
  .dn-brand-grid { display: grid; grid-template-columns: repeat(var(--brand-columns), minmax(0, 1fr)); gap: 16px; margin-top: 0; }
  .dn-brand-card { display: block; min-width: 0; padding: 16px 12px; border: 0; border-radius: 16px; background: #fff; color: #24272c; text-align: center; transform: none; transition: box-shadow 180ms ease-out; }
  .dn-brand-card__image { display: flex; width: 100%; height: 52px; align-items: center; justify-content: center; margin-bottom: 12px; }
  .dn-brand-card__image img { position: absolute; width: var(--logo-image-width); max-width: none; height: auto; left: var(--logo-left); top: var(--logo-top); }
  .dn-brand-card strong { display: block; margin: 0; color: #24272c; font-size: var(--dn-text-body); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); }
  .dn-brand-card__label--mobile { display: none; }
  .dn-brand-card:hover, .dn-brand-card:focus-visible { box-shadow: var(--dn-card-hover-shadow); }
  .dn-brand-hero__cta:hover { background: var(--dn-surface-hover); }
  a:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }

  @media (min-width: 768px) {
    .dn-brand-card--mobile-only { display: none; }
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    .dn-brand-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .dn-brand-hero h2 { font-size: var(--dn-text-heading); }
  }

  @media (min-width: 992px) {
    .dn-brand-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); }
    .dn-brand-hero { padding: 0; }
    .dn-brand-card { border: 0; background: var(--dn-surface-subtle); box-shadow: none; }
    .dn-brand-card:hover,
    .dn-brand-card:focus-visible { background: var(--dn-surface-raised); box-shadow: var(--dn-card-hover-shadow); }
    .dn-brand-card__image { height: 72px; }
    .dn-brand-card__frame { width: var(--logo-desktop-width); }
    .dn-brand-card strong { font-size: var(--dn-text-lead); line-height: var(--dn-leading-body); }
  }

  @media (max-width: 767px) {
    .dn-brand-section { padding: var(--dn-space-5) 0 var(--dn-space-2); background: var(--dn-mobile-canvas); }
    .dn-brand-shell { padding-inline: 0; border-radius: 0; background: transparent; }
    .dn-brand-hero { padding: 0; }
    .dn-brand-hero__copy { gap: 16px; }
    .dn-brand-hero h2 { color: var(--dn-ink-strong); font-size: var(--dn-text-subheading); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-heading); letter-spacing: var(--dn-tracking-heading); }
    .dn-heading-desktop { display: none; }
    .dn-brand-hero__cta { display: none; min-height: 44px; padding: 0; border: 0; background: transparent; color: #4f5661; font-size: var(--dn-cta-size); }
    .dn-heading-mobile { display: inline; }
    .dn-brand-panel { margin-top: 8px; padding: 0; border-radius: 0; background: transparent; }
    .dn-brand-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--dn-space-2); }
    .dn-brand-card { display: grid; min-height: var(--dn-discovery-tile-height); grid-template-rows: var(--dn-discovery-media-height) auto; gap: var(--dn-space-2); padding: var(--dn-discovery-tile-padding); border-radius: 14px; background: var(--dn-mobile-surface); }
    .dn-brand-card__image { height: var(--dn-discovery-media-height); align-self: center; margin: 0; }
    .dn-brand-card__frame { width: var(--logo-mobile-width); aspect-ratio: var(--logo-mobile-ratio); }
    .dn-brand-card__image img { width: var(--logo-mobile-image-width); left: var(--logo-mobile-left); top: var(--logo-mobile-top); }
    .dn-brand-card--secondary,
    .dn-brand-card--desktop-only { display: none; }
    .dn-brand-card strong { align-self: end; overflow-wrap: anywhere; font: var(--dn-discovery-label-font); }
    .dn-brand-card__label--desktop { display: none; }
    .dn-brand-card__label--mobile { display: inline; }
    .dn-brand-card--additional { order: 2; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-brand-card { transition: none; }
  }
</style>
