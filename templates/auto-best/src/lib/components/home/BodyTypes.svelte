<script lang="ts">
  import { specificationLabel } from '$lib/i18n/presentation';
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import { bodyTypes } from '$data/home';

  const mobileBodyTypes = new Set<string>(
    [...bodyTypes.filter((item) => item.count > 0), ...bodyTypes.filter((item) => item.count <= 0)]
      .slice(0, 3)
      .map((item) => item.query)
  );
  const mobileArtworkWidth: Record<string, number> = {
    SUV: 94,
    Wagon: 100,
    Coupe: 98
  };
  let expanded = $state(false);
</script>

<section class="dn-section dn-body-types" aria-labelledby="body-types-title">
  <div class="container dn-body-types__panel">
    <div class="dn-section-heading dn-body-types__heading dn-home-section-heading dn-home-section-heading--branded dn-home-section-heading--red dn-home-banner-frame dn-home-banner-copy dn-home-section-heading--compact">
      <h2 id="body-types-title" class="dn-home-section-title">
        <span class="dn-heading-desktop">{i18n.t("m_555a44ad25a6")}</span>
        <span class="dn-heading-mobile">{i18n.t("m_ef0ecd6a2ade")}</span>
      </h2>
      <a class="dn-body-types__all dn-home-section-action" href={i18n.href(resolve('/listing-grid'))}>
        <span class="dn-heading-desktop">{i18n.t("m_7d6647b063a2")}</span>
      </a>
    </div>

    <div class="dn-body-types__viewport">
      <div class="dn-body-types__rail" id="body-types-grid" aria-label={i18n.t("m_b94720bac36c")}>
        {#each bodyTypes as item (item.query)}
          <a class="dn-body-type" class:dn-body-type--additional={!mobileBodyTypes.has(item.query)} class:dn-body-type--secondary={!expanded && !mobileBodyTypes.has(item.query)} data-stock-count={item.count} href={i18n.href(resolve(`/listing-grid?body=${encodeURIComponent(item.query)}`))}>
            <span class="dn-body-type__image">
              <span class="dn-body-type__frame"
                style:--body-aspect={`${item.bounds[2] - item.bounds[0]} / ${item.bounds[3] - item.bounds[1]}`}
                style:--body-optical-width={`${mobileArtworkWidth[item.query] ?? 100}%`}
                style:--body-image-width={`${item.width / (item.bounds[2] - item.bounds[0]) * 100}%`}
                style:--body-image-left={`${-item.bounds[0] / (item.bounds[2] - item.bounds[0]) * 100}%`}
                style:--body-image-top={`${-item.bounds[1] / (item.bounds[3] - item.bounds[1]) * 100}%`}>
              <img
                src={item.image}
                alt=""
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
              />
              </span>
            </span>
            <span class="dn-body-type__content">
              <strong class="dn-body-type__title">{specificationLabel(item.label, i18n.locale)}</strong>
              <small class="dn-body-type__subtitle">{item.count} {item.count === 1 ? i18n.t("m_2b2961a431b2") : i18n.t("m_1f58b1e965af")}</small>
            </span>
          </a>
        {/each}
        <button class="dn-discovery-toggle" aria-expanded={expanded} aria-controls="body-types-grid" onclick={() => expanded = !expanded}>
          <span class="dn-body-all-glyph" aria-hidden="true">
            <span class="dn-body-all-glyph__accent"></span><span></span><span></span><span></span>
          </span>
          <strong>{expanded ? i18n.t("m_211232676e95") : i18n.t("m_3cd085e8c069")}</strong>
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  .dn-body-type__frame { display: contents; }
  .dn-discovery-toggle { display: none; }
  @media (max-width: 767px) {
    .dn-body-type--additional { order: 2; }
    .dn-discovery-toggle {
      order: 1; display: grid; min-height: 126px; grid-template-rows: 78px auto; margin: 0; padding: 8px 12px 12px;
      border: 0; border-radius: 14px; background: var(--dn-mobile-surface); color: var(--dn-ink);
      font: inherit; font-size: var(--dn-control-size); text-align: center; cursor: pointer;
    }
    .dn-body-all-glyph { display: grid; width: 58px; height: 58px; align-self: center; grid-template-columns: repeat(2, 1fr); gap: 7px; margin: 0 auto; padding: 9px; border-radius: 16px; background: #f1f3f5; }
    .dn-body-all-glyph span { border-radius: 50%; background: #cdd2d8; }
    .dn-body-all-glyph__accent { background: var(--dn-red); }
    .dn-discovery-toggle strong { display: block; align-self: end; line-height: var(--dn-leading-control); font-weight: var(--dn-weight-semibold); }
    .dn-discovery-toggle:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  }

  .dn-body-types__heading {
    justify-content: center;
    margin-bottom: 32px;
    text-align: center;
  }

  .dn-body-types__all {
    display: none;
  }

  .dn-heading-mobile {
    display: none;
  }

  .dn-body-types__viewport {
    overflow-x: auto;
    overflow-y: hidden;
    margin: -20px 0 -46px;
    padding: 20px 0 76px;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
  }

  .dn-body-types__viewport::-webkit-scrollbar {
    display: none;
  }

  .dn-body-types__rail {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - 90px) / 4);
    gap: 30px;
  }

  .dn-body-type {
    display: block;
    min-width: 0;
    padding: 12px 12px 14px;
    border: 0;
    border-radius: 16px;
    background: #f3f4f6;
    color: #24272c;
    text-align: center;
    scroll-snap-align: start;
    box-shadow: none;
    transition: background-color 180ms ease-out, box-shadow 180ms ease-out;
  }

  .dn-body-type:hover,
  .dn-body-type:focus-visible {
    border: 0;
    background: #fff;
    color: #24272c;
    box-shadow: var(--dn-card-hover-shadow);
  }

  .dn-body-type:focus-visible {
    outline: 3px solid rgb(var(--dn-theme-accent-rgb) / 28%);
    outline-offset: 2px;
  }

  .dn-body-type__image {
    display: flex;
    width: 100%;
    height: 107px;
    align-items: center;
    justify-content: center;
    margin: 0 0 12px;
    overflow: hidden;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .dn-body-type__image img {
    width: 100%;
    height: 107px;
    margin: 0;
    padding: 10px;
    object-fit: contain;
  }

  .dn-body-type__content {
    display: block;
    padding: 0 8px 8px;
  }

  .dn-body-type__title,
  .dn-body-type__subtitle {
    display: block;
  }

  .dn-body-type__title {
    margin-bottom: 5px;
    color: #24272c;
    font-size: var(--dn-text-body);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-meta);
    transition: color 160ms ease-out;
  }

  .dn-body-type__subtitle {
    color: #696665;
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-regular);
    line-height: var(--dn-leading-meta);
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-body-type {
      transition: none;
    }
  }

  @media (min-width: 992px) {
    .dn-body-types__panel {
      padding: 0;
      border-radius: 20px;
      background: var(--dn-home-panel);
    }

    .dn-body-type {
      background: #fff;
    }

    .dn-body-types {
      padding-block: var(--dn-home-section-space);
    }

    .dn-body-types__heading {
      justify-content: center;
      margin-bottom: 24px;
      text-align: center;
    }

    .dn-body-types__heading h2 {
      font-size: var(--dn-text-heading);
    }

    .dn-body-types__viewport {
      position: relative;
      margin: calc(-1 * var(--dn-home-banner-overlap)) 0 0;
      padding: 24px;
      border-radius: var(--dn-radius);
      background: var(--dn-home-panel);
    }

    .dn-body-types__rail {
      grid-auto-flow: row;
      grid-auto-columns: auto;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    .dn-body-type__image,
    .dn-body-type__image img {
      height: 120px;
    }

    .dn-body-type__image {
      margin-bottom: 8px;
    }

    .dn-body-type__image img {
      width: min(100%, 224px);
      padding: 0;
    }

    .dn-body-type__title { font-size: var(--dn-text-lead); line-height: var(--dn-leading-body); }

    .dn-body-type__subtitle {
      display: none;
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {
    .dn-body-types__rail {
      grid-auto-columns: calc((100% - 60px) / 4);
      gap: 20px;
    }
  }

  @media (max-width: 767px) {
    .dn-body-types {
      padding: var(--dn-space-5) 0 var(--dn-space-2);
      background: var(--dn-mobile-canvas);
    }

    .dn-body-types__heading {
      min-height: 44px;
      align-items: center;
      flex-direction: row;
      justify-content: flex-start;
      gap: 16px;
      margin-bottom: 8px;
      text-align: left;
    }

    .dn-body-types__heading h2 {
      font-size: var(--dn-text-subheading);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-heading);
    }

    .dn-heading-desktop {
      display: none;
    }

    .dn-heading-mobile {
      display: inline;
    }

    .dn-body-types__all {
      display: none;
    }

    .dn-body-types__viewport {
      margin: 0;
      padding: 0;
      overflow: visible;
    }

    .dn-body-types__rail {
      grid-auto-flow: row;
      grid-auto-columns: auto;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .dn-body-type {
      display: grid;
      min-height: 126px;
      grid-template-columns: 1fr;
      grid-template-rows: 78px auto;
      padding: 8px 12px 12px;
      border-radius: 14px;
      background: var(--dn-mobile-surface);
      text-align: left;
    }

    .dn-body-type__image {
      position: relative;
      height: 78px;
      width: 100%;
      margin: 0;
      overflow: hidden;
    }

    .dn-body-type__frame {
      display: block;
      position: absolute;
      width: var(--body-optical-width, 100%);
      aspect-ratio: var(--body-aspect);
      left: 50%;
      bottom: 12px;
      transform: translateX(-50%);
    }

    .dn-body-type__image img {
      position: absolute;
      width: var(--body-image-width);
      max-width: none;
      height: auto;
      left: var(--body-image-left);
      top: var(--body-image-top);
      padding: 0;
    }

    .dn-body-type__content {
      display: flex;
      align-items: end;
      justify-content: center;
      padding: 0;
      text-align: center;
    }

    .dn-body-type__title {
      margin: 0;
      width: 100%;
      font-size: var(--dn-text-body);
      font-weight: var(--dn-weight-semibold);
      text-align: center;
    }

    .dn-body-type__subtitle {
      display: none;
    }

    .dn-body-type--secondary { display: none; }
  }
</style>

