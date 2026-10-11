<script lang="ts">
  import { brand } from '$config/brand';
  import { getI18n } from '$lib/locale/context';
  import SocialBrandIcon from './SocialBrandIcon.svelte';

  let { hero = false, onDark = false }: { hero?: boolean; onDark?: boolean } = $props();
  const i18n = getI18n();
  const profiles = [
    { name: 'instagram', label: 'Instagram', href: brand.instagramUrl },
    { name: 'facebook', label: 'Facebook', href: brand.facebookUrl },
    { name: 'youtube', label: 'YouTube', href: brand.youtubeUrl }
  ] as const;
</script>

{#if profiles.some(profile => profile.href)}
  <nav class="dn-desktop-socials" class:dn-desktop-socials--hero={hero} class:dn-desktop-socials--dark={onDark} aria-label={i18n.t('m_3931afa2068d')}>
    {#each profiles.filter(profile => profile.href) as profile (profile.name)}
      <a href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={i18n.t('m_c0b8af66cd54', { p0: profile.label })}>
        <SocialBrandIcon name={profile.name} size={22} />
      </a>
    {/each}
  </nav>
{/if}

<style>
  .dn-desktop-socials { display: none; }

  @media (min-width: 992px) {
    .dn-desktop-socials {
      display: flex;
      align-items: center;
      gap: var(--dn-space-3);
    }
    .dn-desktop-socials--hero {
      margin-top: var(--dn-space-4);
    }
    a {
      display: grid;
      place-items: center;
      width: var(--dn-control-height-default);
      height: var(--dn-control-height-default);
      border-radius: var(--dn-pill);
      background: var(--dn-surface-subtle);
      color: var(--dn-ink);
    }
    .dn-desktop-socials--hero a { background: var(--dn-white); }
    a:hover {
      background: var(--dn-ink);
      color: var(--dn-white);
    }
    a:focus-visible {
      outline: 3px solid var(--dn-focus);
      outline-offset: 4px;
    }
    .dn-desktop-socials--dark a:focus-visible { outline-color: var(--dn-white); }
  }
</style>
