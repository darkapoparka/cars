<script lang="ts">
  import { resolve } from '$app/paths';
  import { bodyTypes } from '$data/home';

  const mobileBodyTypes = new Set<string>(bodyTypes.filter(item => item.count > 0).map(item => item.query));
  let expanded = $state(false);
</script>

<section class="dn-section dn-body-types" aria-labelledby="body-types-title">
  <div class="container dn-body-types__panel">
    <div class="dn-section-heading dn-body-types__heading dn-home-section-heading dn-home-section-heading--branded dn-home-section-heading--red dn-home-banner-frame dn-home-banner-copy dn-home-section-heading--compact">
      <h2 id="body-types-title" class="dn-home-section-title">
        <span class="dn-heading-desktop">Choose by body type</span>
        <span class="dn-heading-mobile">By body type</span>
      </h2>
      <a class="dn-body-types__all dn-home-section-action" href={resolve('/listing-grid')}>
        <span class="dn-heading-desktop">View all vehicles</span>
        <span class="dn-heading-mobile">All</span>
      </a>
    </div>

    <div class="dn-body-types__viewport">
      <div class="dn-body-types__rail" aria-label="Vehicles by body type">
        {#each bodyTypes as item (item.query)}
          <a class="dn-body-type" class:dn-body-type--secondary={!expanded && !mobileBodyTypes.has(item.query)} data-stock-count={item.count} href={resolve(`/listing-grid?body=${encodeURIComponent(item.query)}`)}>
            <span class="dn-body-type__image">
              <img
                src={item.image}
                alt=""
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
              />
            </span>
            <span class="dn-body-type__content">
              <strong class="dn-body-type__title">{item.label}</strong>
              <small class="dn-body-type__subtitle">{item.count} {item.count === 1 ? 'vehicle' : 'vehicles'}</small>
            </span>
          </a>
        {/each}
      </div>
      <button class="dn-discovery-toggle" aria-expanded={expanded} onclick={() => expanded = !expanded}>{expanded ? 'Show less' : 'All body types'}</button>
    </div>
  </div>
</section>

<style>
  .dn-discovery-toggle { display: none; }
  @media (max-width: 767px) {
    .dn-discovery-toggle { display: flex; width: 100%; min-height: 44px; align-items: center; justify-content: center; margin-top: 10px; border: 1px solid #d9dde1; border-radius: var(--dn-radius-button); background: #eceef0; color: #24272c; font: inherit; font-size: 14px; font-weight: 600; }
    .dn-discovery-toggle:focus-visible { outline: 3px solid #8c959f; outline-offset: 3px; }
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
    outline: 3px solid rgba(196, 1, 1, 0.28);
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
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    transition: color 160ms ease-out;
  }

  .dn-body-type__subtitle {
    color: #696665;
    font-size: var(--dn-text-meta);
    font-weight: 400;
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
      font-size: 28px;
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

    .dn-body-type__title { font-size: 18px; line-height: 24px; }

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
      padding: 24px 0 12px;
      background: var(--dn-mobile-canvas);
    }

    .dn-body-types__heading {
      min-height: 44px;
      align-items: center;
      flex-direction: row;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 8px;
      text-align: left;
    }

    .dn-body-types__heading h2 {
      font-size: 22px;
      font-weight: 700;
      line-height: 1.15;
    }

    .dn-heading-desktop {
      display: none;
    }

    .dn-heading-mobile {
      display: inline;
    }

    .dn-body-types__all {
      display: inline-flex;
      min-height: 44px;
      align-items: center;
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

    .dn-body-type__image,
    .dn-body-type__image img {
      height: 78px;
    }

    .dn-body-type__image {
      margin: 0;
      justify-content: flex-start;
    }

    .dn-body-type__image img {
      width: min(176px, 92%);
      padding: 4px 0;
      object-position: left center;
    }

    .dn-body-type__content {
      display: flex;
      align-items: end;
      justify-content: space-between;
      padding: 0;
    }

    .dn-body-type__title {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
    }

    .dn-body-type__subtitle {
      display: none;
    }

    .dn-body-type--secondary { display: none; }
  }
</style>
