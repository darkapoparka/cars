<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import './about.css';
  import { template } from '$config/template';
  import AboutHero from '$components/company/AboutHero.svelte';
  import AboutProcess from '$components/company/AboutProcess.svelte';
  import AboutTeam from '$components/company/AboutTeam.svelte';
  import AboutPartners from '$components/company/AboutPartners.svelte';
  import ShowroomMap from '$components/company/ShowroomMap.svelte';
  import DesktopShowroom from '$components/company/DesktopShowroom.svelte';
  import EntryCard from '$components/ui/entry/EntryCard.svelte';
  import MobileActionIcon from '$components/layout/MobileActionIcon.svelte';
  import SocialBrandIcon from '$components/company/SocialBrandIcon.svelte';
  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';

  const socialProfiles = [
    { name: 'instagram', label: 'Instagram', href: brand.instagramUrl },
    { name: 'facebook', label: 'Facebook', href: brand.facebookUrl },
    { name: 'youtube', label: 'YouTube', href: brand.youtubeUrl }
  ] as const;
</script>

<svelte:head>
  <title>{i18n.t("m_147bdce9883d", { p0: brand.name })}</title>
  <meta name="description" content={i18n.t("m_36dad5f20b15", { p0: brand.name, p1: i18n.dealer('city') })} />
</svelte:head>

<AboutHero />
<div class="dn-about-intro dn-information-panel">
  <EntryCard title={i18n.t("m_b4b580a9ad8c")} titleId="about-intro-title" titleTag="h1">
    <a class="dn-about-intro__services" href="#process">
      <MobileActionIcon name="article" size={22} />
      <span>{i18n.t("m_23b41588e19b")}</span>
      <span class="dn-about-intro__services-cue"><MobileActionIcon name="arrow" size={18} /></span>
    </a>
    {#if socialProfiles.some(profile => profile.href)}
      <nav class="dn-about-intro__socials" aria-label={i18n.t("m_3931afa2068d")}>
        {#each socialProfiles.filter(profile => profile.href) as profile (profile.name)}
          <a href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={i18n.t("m_c0b8af66cd54", { p0: profile.label })} title={profile.label}>
            <SocialBrandIcon name={profile.name} size={22} />
          </a>
        {/each}
      </nav>
    {/if}
    <a class="dn-compact-control dn-entry-action dn-compact-primary" href={i18n.href(resolve('/listing-grid'))}>
      <span>{i18n.t("m_f92c64344e85")}</span><MobileActionIcon name="arrow" size={18} />
    </a>
  </EntryCard>
</div>
<AboutProcess />
{#if template.sections.demoPartners}<AboutPartners />{/if}

<section class="dn-about-showroom dn-section" aria-label={i18n.t("m_931269cbffaa")}>
  <div class="container">
    <DesktopShowroom id="about-showroom-desktop-title" showPhoneAction={false} />
    <div class="dn-about-showroom__card dn-about-showroom__mobile">
      <ShowroomMap />
    </div>
  </div>
</section>
{#if template.sections.demoTeam}<AboutTeam />{/if}
