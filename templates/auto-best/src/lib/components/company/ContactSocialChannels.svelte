<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import { brand } from '$config/brand';
  import { template } from '$config/template';
  import Icon from '$components/ui/Icon.svelte';
  import SocialBrandIcon from './SocialBrandIcon.svelte';

  const i18n = getI18n();
  const profiles = [
    { name: 'facebook', label: 'Facebook', href: brand.facebookUrl },
    { name: 'youtube', label: 'YouTube', href: brand.youtubeUrl },
    { name: 'instagram', label: 'Instagram', href: brand.instagramUrl }
  ] as const;
  const visibleProfiles = profiles.filter(profile => profile.href || template.mode === 'preview');
</script>

{#snippet profileContents(profile: typeof profiles[number])}
  <SocialBrandIcon name={profile.name} size={28} />
  <span class="dn-contact-channels__copy">
    <strong>{profile.label}</strong>
    {#if !profile.href}<small>{i18n.t('contact.social.placeholder')}</small>{/if}
  </span>
{/snippet}

{#if visibleProfiles.length}
  <section class="dn-contact-channels" aria-labelledby="contact-channels-title">
    <div class="container dn-contact-channels__inner">
      <h2 id="contact-channels-title">{i18n.t('contact.social.title')}</h2>
      <ul class="dn-contact-channels__profiles">
        {#each visibleProfiles as profile (profile.name)}
          <li class="dn-contact-channels__item" data-social-profile={profile.name}>
            {#if profile.href}
              <a class="dn-contact-channels__profile" href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={i18n.t('m_c0b8af66cd54', { p0: profile.label })}>
                {@render profileContents(profile)}
                <span class="dn-contact-channels__arrow" aria-hidden="true"><Icon name="arrow-right" size={18} /></span>
              </a>
            {:else}
              <div class="dn-contact-channels__profile dn-contact-channels__profile--placeholder">
                {@render profileContents(profile)}
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}

<style>
  .dn-contact-channels { display: none; }

  @media (min-width: 992px) {
    .dn-contact-channels {
      display: block;
      padding-block: var(--dn-space-6);
      background: var(--dn-surface);
      color: var(--dn-ink);
    }
    .dn-contact-channels__inner {
      display: grid;
      grid-template-columns: 224px minmax(0, 1fr);
      align-items: center;
      gap: var(--dn-space-6);
      width: min(1344px, 100%);
      padding-inline: var(--dn-space-6);
      box-sizing: border-box;
    }
    h2 {
      margin: 0;
      font-size: var(--dn-text-subheading);
      font-weight: var(--dn-weight-semibold);
      line-height: var(--dn-leading-heading);
      letter-spacing: var(--dn-tracking-heading);
    }
    .dn-contact-channels__profiles {
      display: flex;
      gap: var(--dn-space-4);
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .dn-contact-channels__item { flex: 1; min-width: 0; max-width: 360px; }
    .dn-contact-channels__profile {
      display: grid;
      grid-template-columns: 28px minmax(0, 1fr);
      align-items: center;
      gap: var(--dn-space-4);
      min-height: 84px;
      height: 100%;
      padding: var(--dn-space-4) var(--dn-space-5);
      box-sizing: border-box;
      border: 1px solid var(--dn-line);
      border-radius: var(--dn-radius);
      background: var(--dn-surface-raised);
      color: var(--dn-ink);
      text-decoration: none;
    }
    a.dn-contact-channels__profile { grid-template-columns: 28px minmax(0, 1fr) 18px; }
    a.dn-contact-channels__profile:hover { border-color: var(--dn-line-strong); background: var(--dn-surface-subtle); }
    a.dn-contact-channels__profile:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
    .dn-contact-channels__copy { display: grid; min-width: 0; gap: var(--dn-space-half); overflow-wrap: anywhere; }
    strong { font-size: var(--dn-text-body); font-weight: var(--dn-weight-medium); line-height: var(--dn-leading-body); }
    small { color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); }
    .dn-contact-channels__arrow { display: flex; transform: rotate(-45deg); }
  }
</style>
