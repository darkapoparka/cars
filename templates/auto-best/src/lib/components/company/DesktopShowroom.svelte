<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { getI18n } from '$lib/locale/context';
  import { brand } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';
  import SocialBrandIcon from './SocialBrandIcon.svelte';

  let { id, compact = false }: { id: string; compact?: boolean } = $props();
  const i18n = getI18n();
  const desktop = new MediaQuery('(min-width: 992px)', false);
  const coordinates = `${brand.showroomCoordinates.latitude},${brand.showroomCoordinates.longitude}`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates}`;
  const mapUrl = $derived(`https://maps.google.com/maps?q=${coordinates}&z=16&hl=${i18n.locale}&output=embed`);
  const profiles = [
    { name: 'instagram', label: 'Instagram', href: brand.instagramUrl },
    { name: 'facebook', label: 'Facebook', href: brand.facebookUrl },
    { name: 'youtube', label: 'YouTube', href: brand.youtubeUrl }
  ] as const;
</script>

<section class="dn-desktop-showroom" class:dn-desktop-showroom--compact={compact} aria-labelledby={id}>
  <div class="dn-desktop-showroom__details">
    <h2 {id}>{i18n.t('m_8647c430b400', { p0: i18n.dealer('city') })}</h2>
    <dl>
      <div>
        <dt><Icon name="map-pin" size={20} />{i18n.t('m_56ef8f20955f')}</dt>
        <dd>{i18n.dealer('addressLine')}</dd>
      </div>
      <div>
        <dt><Icon name="clock" size={20} />{i18n.t('m_f514c310bd9e')}</dt>
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
    {#if profiles.some(profile => profile.href)}
      <nav class="dn-desktop-showroom__social" aria-label={i18n.t('m_3931afa2068d')}>
        {#each profiles.filter(profile => profile.href) as profile (profile.name)}
          <a href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={i18n.t('m_c0b8af66cd54', { p0: profile.label })}>
            <SocialBrandIcon name={profile.name} size={22} />
          </a>
        {/each}
      </nav>
    {/if}
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
      grid-template-columns: minmax(340px, 5fr) minmax(0, 7fr);
      min-height: 440px;
      overflow: hidden;
      border-radius: var(--dn-radius-lg);
      background: var(--dn-surface-raised);
    }
    .dn-desktop-showroom__details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: var(--dn-space-7);
      min-width: 0;
      padding: var(--dn-space-8);
    }
    h2 {
      margin: 0;
      color: var(--dn-ink);
      font-size: var(--dn-text-section-compact);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-heading);
      letter-spacing: var(--dn-tracking-heading);
    }
    dl {
      display: grid;
      gap: var(--dn-space-5);
      margin: 0;
    }
    dt {
      display: flex;
      align-items: center;
      gap: var(--dn-space-2);
      color: var(--dn-ink);
      font-size: var(--dn-text-body);
      font-weight: var(--dn-weight-medium);
      line-height: var(--dn-leading-body);
    }
    dt :global(svg) {
      flex-shrink: 0;
      color: var(--dn-muted);
    }
    dd {
      margin: var(--dn-space-1) 0 0 28px;
      color: var(--dn-muted);
      font-size: var(--dn-text-body);
      line-height: var(--dn-leading-body);
    }
    .dn-desktop-showroom__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--dn-space-3);
    }
    .dn-desktop-showroom__actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--dn-space-2);
      min-height: var(--dn-control-height-default);
      padding: 0 var(--dn-space-5);
      border-radius: var(--dn-pill);
      font: var(--dn-control-font);
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
    .dn-desktop-showroom__social {
      display: flex;
      gap: var(--dn-space-2);
    }
    .dn-desktop-showroom__social a {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: var(--dn-pill);
      background: var(--dn-surface-subtle);
      color: var(--dn-ink);
    }
    .dn-desktop-showroom__social a:hover {
      background: var(--dn-ink);
      color: var(--dn-white);
    }
    .dn-desktop-showroom__map {
      display: grid;
      grid-template-rows: minmax(0, 1fr) auto;
      min-width: 0;
      background: var(--dn-surface-subtle);
    }
    iframe {
      grid-row: 1;
      grid-column: 1;
      display: block;
      width: 100%;
      height: 100%;
      min-height: 380px;
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
      background: var(--dn-surface-raised);
      color: var(--dn-ink);
      font: var(--dn-control-font);
    }
    .dn-desktop-showroom__map-link:hover {
      color: var(--dn-red);
    }
    .dn-desktop-showroom--compact { min-height: 360px; grid-template-columns: minmax(360px, 1fr) minmax(0, 1fr); }
    .dn-desktop-showroom--compact .dn-desktop-showroom__details { gap: var(--dn-space-5); }
    .dn-desktop-showroom--compact h2 { font-size: var(--dn-text-subheading); }
    .dn-desktop-showroom--compact iframe { min-height: 300px; }
  }
</style>
