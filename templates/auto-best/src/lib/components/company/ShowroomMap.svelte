<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { getI18n } from '$lib/locale/context';
  import { brand } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';

  const i18n = getI18n();
  const address = $derived(i18n.dealer('address'));
  const coordinates = `${brand.showroomCoordinates.latitude},${brand.showroomCoordinates.longitude}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coordinates)}`;
  const mapUrl = $derived(`https://maps.google.com/maps?q=${encodeURIComponent(coordinates)}&z=16&hl=${i18n.locale}&output=embed`);
  let mapReady = $state(false);

  const observeMap: Attachment<HTMLDivElement> = node => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      mapReady = true;
      observer.disconnect();
    }, { rootMargin: '240px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  };
</script>

<div class="dn-showroom-map" role="group" aria-label={i18n.t('m_cd07db46b2c6', { p0: brand.name })}>
  <div class="dn-showroom-map__canvas" {@attach observeMap}>
    {#if mapReady}
      <iframe
        title={i18n.t('m_cd07db46b2c6', { p0: brand.name })}
        src={mapUrl}
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    {:else}
      <div class="dn-showroom-map__placeholder">
        <strong>{brand.name}</strong>
        <span>{address}</span>
      </div>
    {/if}
  </div>
  <a class="dn-showroom-map__directions" href={directionsUrl} target="_blank" rel="noopener noreferrer">
    {i18n.t('m_c95356784006')}
    <span class="dn-showroom-map__arrow--mobile"><MobileActionIcon name="arrow" size={18} /></span>
    <span class="dn-showroom-map__arrow--desktop"><Icon name="arrow-right" size={18} /></span>
  </a>
</div>

<style>
  .dn-showroom-map {
    overflow: hidden;
    border: 1px solid var(--dn-line);
    border-radius: var(--dn-radius-lg);
    background: var(--dn-surface-raised);
  }
  .dn-showroom-map__canvas {
    min-height: 280px;
    background: var(--dn-surface-subtle);
  }
  iframe {
    display: block;
    width: 100%;
    height: 280px;
    border: 0;
  }
  .dn-showroom-map__placeholder {
    display: grid;
    min-height: 280px;
    align-content: center;
    justify-items: center;
    gap: var(--dn-space-2);
    padding: var(--dn-space-6);
    box-sizing: border-box;
    color: var(--dn-muted);
    font: var(--dn-body-font);
    text-align: center;
    overflow-wrap: anywhere;
  }
  .dn-showroom-map__placeholder strong {
    color: var(--dn-ink);
    font-weight: var(--dn-weight-semibold);
  }
  .dn-showroom-map__directions {
    display: flex;
    min-height: var(--dn-control-height-prominent);
    align-items: center;
    justify-content: center;
    gap: var(--dn-space-2);
    padding: var(--dn-space-3) var(--dn-space-4);
    box-sizing: border-box;
    border-top: 1px solid var(--dn-line);
    color: var(--dn-ink);
    font: var(--dn-control-font);
    text-align: center;
  }
  .dn-showroom-map__directions:hover { background: var(--dn-surface-hover); }
  .dn-showroom-map__directions:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: -4px; }
  .dn-showroom-map__arrow--desktop { display: none; }
  @media (min-width: 992px) {
    .dn-showroom-map__arrow--mobile { display: none; }
    .dn-showroom-map__arrow--desktop { display: inline-flex; }
  }
</style>
