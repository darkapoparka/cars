<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { getI18n } from '$lib/locale/context';
  import { brand } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';
  import DesktopSocialLinks from './DesktopSocialLinks.svelte';

  let { id, showSocialProfiles = true }: { id: string; showSocialProfiles?: boolean } = $props();
  const i18n = getI18n();
  const desktop = new MediaQuery('(min-width: 992px)', false);
  const coordinates = `${brand.showroomCoordinates.latitude},${brand.showroomCoordinates.longitude}`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates}`;
  const mapUrl = $derived(`https://maps.google.com/maps?q=${coordinates}&z=16&hl=${i18n.locale}&output=embed`);
</script>

<section class="dn-desktop-showroom" aria-labelledby={id}>
  <div class="dn-desktop-showroom__details">
    <h2 {id}>{i18n.t('m_8647c430b400', { p0: i18n.dealer('city') })}</h2>
    <dl>
      <div>
        <dt>{i18n.t('m_56ef8f20955f')}</dt>
        <dd>{i18n.dealer('address')}</dd>
      </div>
      <div>
        <dt>{i18n.t('m_f514c310bd9e')}</dt>
        <dd>{i18n.dealer('appointment')}</dd>
      </div>
    </dl>
    <div class="dn-desktop-showroom__actions">
      <a class="dn-desktop-showroom__call" href={brand.phoneHref} aria-label={i18n.t('m_772c70f449af', { p0: brand.phone })}>
        <Icon name="phone" size={18} />{brand.phone}
      </a>
      <a class="dn-desktop-showroom__directions" href={directionsUrl} target="_blank" rel="noopener noreferrer">
        {i18n.t('m_c95356784006')}<Icon name="arrow-right" size={18} />
      </a>
    </div>
    {#if showSocialProfiles}<DesktopSocialLinks />{/if}
  </div>
  <div class="dn-desktop-showroom__map">
    {#if desktop.current}
      <iframe title={i18n.t('m_cd07db46b2c6', { p0: brand.name })} src={mapUrl} loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
    {/if}
    <a class="dn-desktop-showroom__map-link" href={directionsUrl} target="_blank" rel="noopener noreferrer">
      {i18n.t('m_7f22a6352074')}<Icon name="arrow-right" size={18} />
    </a>
  </div>
</section>

<style>
  .dn-desktop-showroom {
    display: none;
  }
  @media (min-width: 992px) {
    .dn-desktop-showroom {
      display: grid;
      grid-template-columns: minmax(304px, 360px) minmax(0, 1fr);
      gap: var(--dn-space-8);
      padding: var(--dn-space-8);
      overflow: hidden;
      border-radius: var(--dn-radius-lg);
      background: var(--dn-surface-raised);
    }
    .dn-desktop-showroom__details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: var(--dn-space-6);
      min-width: 0;
    }
    h2 {
      margin: 0;
      color: var(--dn-ink);
      font-size: var(--dn-text-subheading);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-heading);
      letter-spacing: var(--dn-tracking-heading);
    }
    dl {
      display: grid;
      width: 100%;
      gap: var(--dn-space-6);
      margin: 0;
    }
    dt {
      color: var(--dn-muted);
      font-size: var(--dn-text-meta);
      line-height: var(--dn-leading-meta);
    }
    dd {
      margin: var(--dn-space-1) 0 0;
      color: var(--dn-ink);
      font-size: var(--dn-text-body);
      font-weight: var(--dn-weight-medium);
      line-height: var(--dn-leading-body);
      overflow-wrap: anywhere;
    }
    .dn-desktop-showroom__actions {
      display: grid;
      width: 100%;
      margin-top: auto;
      gap: var(--dn-space-3);
    }
    .dn-desktop-showroom__actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--dn-space-2);
      min-height: var(--dn-control-height-default);
      padding: var(--dn-space-3) var(--dn-space-5);
      box-sizing: border-box;
      border-radius: var(--dn-pill);
      font: var(--dn-control-font);
      text-align: center;
    }
    .dn-desktop-showroom__call {
      background: var(--dn-red);
      color: var(--dn-white);
    }
    .dn-desktop-showroom__call:hover {
      background: var(--dn-red-hover);
    }
    .dn-desktop-showroom__directions {
      background: var(--dn-surface-subtle);
      color: var(--dn-ink);
    }
    .dn-desktop-showroom__directions:hover {
      background: var(--dn-surface-hover);
    }
    .dn-desktop-showroom a:focus-visible {
      outline: 3px solid var(--dn-focus);
      outline-offset: 3px;
    }
    .dn-desktop-showroom__map {
      display: grid;
      grid-template-rows: minmax(300px, 1fr) auto;
      min-width: 0;
      overflow: hidden;
      border: 1px solid var(--dn-line);
      border-radius: var(--dn-radius);
      background: var(--dn-surface-subtle);
    }
    iframe {
      grid-row: 1;
      grid-column: 1;
      display: block;
      width: 100%;
      height: 100%;
      min-height: 300px;
      border: 0;
    }
    .dn-desktop-showroom__map-link {
      grid-row: 2;
      grid-column: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--dn-space-3);
      min-height: 56px;
      padding: var(--dn-space-3) var(--dn-space-5);
      box-sizing: border-box;
      border-top: 1px solid var(--dn-line);
      background: var(--dn-surface-raised);
      color: var(--dn-ink);
      font: var(--dn-control-font);
    }
    .dn-desktop-showroom__map-link:hover {
      color: var(--dn-red);
    }
  }
</style>
