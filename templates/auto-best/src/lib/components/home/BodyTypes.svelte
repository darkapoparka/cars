<script lang="ts">
  import { specificationLabel } from '$lib/i18n/presentation';
  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import Icon from '$components/ui/Icon.svelte';
  import DiscoveryAllTile from './DiscoveryAllTile.svelte';
  import { bodyTypes, desktopBodyTypes } from '$data/home';

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

<section class="dn-section dn-body-types dn-home-content-section" aria-labelledby="body-types-title">
  <div class="container dn-body-types__panel">
    <div class="dn-section-heading dn-body-types__heading dn-home-section-heading dn-home-section-heading--branded dn-home-banner-frame dn-home-banner-copy">
      <h2 id="body-types-title" class="dn-home-section-title">
        <span class="dn-heading-desktop">{i18n.t("m_555a44ad25a6")}</span>
        <span class="dn-heading-mobile">{i18n.t("m_ef0ecd6a2ade")}</span>
      </h2>
      <a class="dn-body-types__all dn-home-section-action" href={i18n.href(resolve('/listing-grid'))} aria-label={i18n.t("m_7d6647b063a2")}>
        <span class="dn-heading-desktop dn-home-action-label">{i18n.t("m_30a64216eaea")} <Icon name="arrow-right" size={18} /></span>
      </a>
    </div>

    <div class="dn-body-types__viewport dn-home-section-panel">
      <div class="dn-body-types__rail" id="body-types-grid" aria-label={i18n.t("m_b94720bac36c")}>
        {#each desktopBodyTypes as item (item.query)}
          <a class="dn-body-type" class:dn-body-type--desktop-only={item.count === 0} class:dn-body-type--additional={!mobileBodyTypes.has(item.query)} class:dn-body-type--secondary={!expanded && !mobileBodyTypes.has(item.query)} data-stock-count={item.count} href={i18n.href(resolve(`/listing-grid?body=${encodeURIComponent(item.query)}`))}>
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
        <DiscoveryAllTile
          {expanded}
          controls="body-types-grid"
          ontoggle={bodyTypes.length > mobileBodyTypes.size ? () => expanded = !expanded : undefined}
        />
      </div>
    </div>
  </div>
</section>

<style>
  .dn-body-type__frame { display: contents; }

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
    outline: 3px solid var(--dn-focus);
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
      padding: var(--dn-space-4);
      border: 0;
      background: var(--dn-surface-subtle);
      box-shadow: none;
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

    .dn-body-types__rail {
      grid-auto-flow: row;
      grid-auto-columns: auto;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    .dn-body-type__image {
      height: 108px;
      margin-bottom: var(--dn-space-2);
      overflow: visible;
    }

    .dn-body-type__frame {
      position: relative;
      display: block;
      width: min(100%, 210px);
      aspect-ratio: var(--body-aspect);
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

    .dn-body-type:hover,
    .dn-body-type:focus-visible { background: var(--dn-surface-raised); box-shadow: var(--dn-card-hover-shadow); }

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
      gap: var(--dn-space-2);
    }

    .dn-body-type {
      display: grid;
      min-height: var(--dn-discovery-tile-height);
      grid-template-columns: 1fr;
      grid-template-rows: var(--dn-discovery-media-height) auto;
      gap: var(--dn-space-2);
      padding: var(--dn-discovery-tile-padding);
      border-radius: 14px;
      background: var(--dn-mobile-surface);
      text-align: left;
    }

    .dn-body-type__image {
      position: relative;
      height: var(--dn-discovery-media-height);
      width: 100%;
      margin: 0;
      overflow: hidden;
    }

    .dn-body-type__frame {
      display: block;
      position: absolute;
      width: min(var(--body-optical-width, 100%), calc(var(--dn-discovery-media-height) * (var(--body-aspect))));
      aspect-ratio: var(--body-aspect);
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
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
      font: var(--dn-discovery-label-font);
      text-align: center;
    }

    .dn-body-type__subtitle {
      display: none;
    }

    .dn-body-type--additional { order: 2; }

    .dn-body-type--secondary,
    .dn-body-type--desktop-only { display: none; }
  }
</style>
