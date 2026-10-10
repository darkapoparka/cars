<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { getI18n } from '$lib/locale/context';
  import { brand } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';
  import DesktopSocialLinks from './DesktopSocialLinks.svelte';

  let {
    id,
    showSocialProfiles = true,
    showPhoneAction = true
  }: {
    id: string;
    showSocialProfiles?: boolean;
    showPhoneAction?: boolean;
  } = $props();
  const i18n = getI18n();
  const desktop = new MediaQuery('(min-width: 992px)', false);
  const coordinates = `${brand.showroomCoordinates.latitude},${brand.showroomCoordinates.longitude}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coordinates)}`;
  const mapUrl = $derived(`https://maps.google.com/maps?q=${coordinates}&z=16&hl=${i18n.locale}&output=embed`);
</script>

<section class="dn-desktop-showroom" aria-labelledby={id}>
  <header class="dn-desktop-showroom__header">
    <div class="dn-desktop-showroom__details">
      <h2 {id}>{i18n.t('m_8647c430b400', { p0: i18n.dealer('city') })}</h2>
      <dl>
        <div>
          <dt class="dn-sr-only">{i18n.t('m_56ef8f20955f')}</dt>
          <dd>{i18n.dealer('address')}</dd>
        </div>
      </dl>
    </div>
    <div class="dn-desktop-showroom__tools">
      <div class="dn-desktop-showroom__actions">
        {#if showPhoneAction}
          <a class="dn-desktop-showroom__call" href={brand.phoneHref} aria-label={i18n.t('m_772c70f449af', { p0: brand.phone })}>
            <Icon name="phone" size={18} />{brand.phone}
          </a>
        {/if}
        <a class="dn-desktop-showroom__directions" href={directionsUrl} target="_blank" rel="noopener noreferrer">
          {i18n.t('m_c95356784006')}<Icon name="arrow-right" size={18} />
        </a>
      </div>
      {#if showSocialProfiles}<DesktopSocialLinks />{/if}
    </div>
  </header>
  <div class="dn-desktop-showroom__map">
    {#if desktop.current}
      <iframe title={i18n.t('m_cd07db46b2c6', { p0: brand.name })} src={mapUrl} loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    {:else}
      <div class="dn-desktop-showroom__fallback" aria-hidden="true">
        <strong>{brand.name}</strong>
        <span>{i18n.dealer('address')}</span>
      </div>
    {/if}
  </div>
</section>

<style>
  .dn-desktop-showroom {
    display: none;
  }
  @media (min-width: 992px) {
    .dn-desktop-showroom {
      display: block;
      padding: var(--dn-space-8);
      overflow: hidden;
      border-radius: var(--dn-radius-lg);
      background: var(--dn-surface-raised);
    }
    .dn-desktop-showroom__header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--dn-space-6) var(--dn-space-8);
      margin-bottom: var(--dn-space-6);
    }
    .dn-desktop-showroom__details {
      display: flex;
      flex: 1 1 24rem;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--dn-space-3);
      min-width: 0;
    }
    .dn-desktop-showroom__tools {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--dn-space-4);
      max-width: 100%;
    }
    h2 {
      margin: 0;
      color: var(--dn-ink);
      font-size: var(--dn-text-subheading);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-heading);
      letter-spacing: var(--dn-tracking-heading);
      overflow-wrap: anywhere;
    }
    dl {
      display: grid;
      width: 100%;
      gap: var(--dn-space-2);
      margin: 0;
    }
    dd {
      margin: 0;
      color: var(--dn-ink);
      font-size: var(--dn-text-body);
      font-weight: var(--dn-weight-medium);
      line-height: var(--dn-leading-body);
      overflow-wrap: anywhere;
    }
    .dn-desktop-showroom__actions {
      display: flex;
      flex-wrap: wrap;
      max-width: 100%;
      gap: var(--dn-space-3);
    }
    .dn-desktop-showroom__actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--dn-space-2);
      min-height: var(--dn-control-height-default);
      max-width: 100%;
      padding: var(--dn-space-2) var(--dn-space-5);
      box-sizing: border-box;
      border-radius: var(--dn-pill);
      font: var(--dn-control-font);
      text-align: center;
      overflow-wrap: anywhere;
    }
    .dn-desktop-showroom__call {
      background: var(--dn-red);
      color: var(--dn-white);
    }
    .dn-desktop-showroom__call:hover {
      background: var(--dn-red-hover);
    }
    .dn-desktop-showroom__directions {
      background: var(--dn-ink);
      color: var(--dn-white);
    }
    .dn-desktop-showroom__directions:hover,
    .dn-desktop-showroom__directions:focus-visible {
      background: var(--dn-red);
    }
    .dn-desktop-showroom a:focus-visible {
      outline: 3px solid var(--dn-focus);
      outline-offset: 3px;
    }
    .dn-desktop-showroom__map {
      height: 300px;
      min-width: 0;
      overflow: hidden;
      box-sizing: border-box;
      border: 1px solid var(--dn-line);
      border-radius: var(--dn-radius);
      background: var(--dn-surface-subtle);
    }
    iframe {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
    }
    .dn-desktop-showroom__fallback {
      display: grid;
      height: 100%;
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
    .dn-desktop-showroom__fallback strong { color: var(--dn-ink); }
  }
</style>
