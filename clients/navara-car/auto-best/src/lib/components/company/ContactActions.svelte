<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import { brand } from '$config/brand';
  import Icon from '$components/ui/Icon.svelte';
  import SocialBrandIcon from './SocialBrandIcon.svelte';

  const i18n = getI18n();
  const directionsUrl = $derived(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(i18n.dealer('address'))}`);
  const profiles = [
    { name: 'instagram', label: 'Instagram', href: brand.instagramUrl },
    { name: 'facebook', label: 'Facebook', href: brand.facebookUrl },
    { name: 'youtube', label: 'YouTube', href: brand.youtubeUrl }
  ] as const;
</script>

<div class="dn-contact-actions">
  <div class="dn-contact-actions__primary">
    <a class="dn-contact-actions__call" href={brand.phoneHref} aria-label={i18n.t('m_772c70f449af', { p0: brand.phone })}>
      <Icon name="phone" size={18} />
      <span>{brand.phone}</span>
    </a>
    <a class="dn-contact-actions__directions" href={directionsUrl} target="_blank" rel="noreferrer">
      <span>{i18n.t('m_c95356784006')}</span>
      <Icon name="arrow-right" size={18} />
    </a>
  </div>
  <p class="dn-contact-actions__address">
    <Icon name="map-pin" size={18} />
    <span>{i18n.dealer('address')}</span>
  </p>
  <div class="dn-contact-actions__social dn-social-profile-links" role="group" aria-label={i18n.t('m_b16446d4331a')}>
    {#each profiles.filter(profile => profile.href) as profile (profile.name)}
      <a class="dn-social-profile-link" href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={i18n.t('m_c0b8af66cd54', { p0: profile.label })} title={profile.label}>
        <SocialBrandIcon name={profile.name} />
      </a>
    {/each}
  </div>
</div>

<style>
  .dn-contact-actions { display: none; }

  @media (min-width: 992px) {
    .dn-contact-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--dn-space-6);
      min-height: calc(var(--dn-route-hero-height) - var(--dn-route-hero-control-top));
      box-sizing: border-box;
      padding: 0 var(--dn-space-6) var(--dn-space-8);
      color: var(--dn-white);
    }

    .dn-contact-actions__primary { display: flex; justify-content: center; gap: var(--dn-space-3); }
    .dn-contact-actions__primary a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--dn-space-3);
      min-height: 48px;
      padding: 0 var(--dn-space-6);
      border-radius: var(--dn-radius-button);
      font-size: var(--dn-cta-size);
      font-weight: var(--dn-cta-weight);
      line-height: var(--dn-leading-control);
      white-space: nowrap;
      transition: background-color 150ms ease, color 150ms ease;
    }
    .dn-contact-actions__call { background: var(--dn-red); color: var(--dn-white); }
    .dn-contact-actions__call:hover { background: var(--dn-red-hover); }
    .dn-contact-actions__directions { background: var(--dn-white); color: var(--dn-ink); }
    .dn-contact-actions__directions:hover { background: var(--dn-surface-hover); }

    .dn-contact-actions__address {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--dn-space-2);
      margin: 0;
      color: var(--dn-muted-on-ink);
      font-size: var(--dn-text-body);
      line-height: var(--dn-leading-body);
      text-align: center;
    }
    .dn-contact-actions__address :global(svg) { flex-shrink: 0; }
    .dn-contact-actions__social { --dn-social-focus: var(--dn-white); }
    .dn-contact-actions a:focus-visible { outline: 2px solid var(--dn-white); outline-offset: 4px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dn-contact-actions__primary a, .dn-contact-actions__social a { transition: none; }
  }
</style>
