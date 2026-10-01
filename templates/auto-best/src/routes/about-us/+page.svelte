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
  import { resolve } from '$app/paths';
  import { brand } from '$config/brand';
</script>

<svelte:head>
  <title>{i18n.t("m_147bdce9883d", { p0: brand.name })}</title>
  <meta name="description" content={i18n.t("m_36dad5f20b15", { p0: brand.name, p1: i18n.dealer('city') })} />
</svelte:head>

<AboutHero />
<div class="dn-about-intro dn-information-panel">
  <EntryCard title={brand.name} titleId="about-intro-title">
    <p>{i18n.t("m_335a481bffd9", { p0: i18n.dealer('city') })}</p>
    <a class="dn-compact-control dn-entry-action dn-compact-primary" href={i18n.href(resolve('/listing-grid'))}>
      <span>{i18n.t("m_f92c64344e85")}</span><MobileActionIcon name="arrow" size={18} />
    </a>
  </EntryCard>
</div>
<AboutProcess />
{#if template.sections.demoTeam}<AboutTeam />{/if}
{#if template.sections.demoPartners}<AboutPartners />{/if}

<section class="dn-about-showroom dn-section" aria-label={i18n.t("m_931269cbffaa")}>
  <div class="container">
    <DesktopShowroom id="about-showroom-desktop-title" />
    <div class="dn-about-showroom__card dn-about-showroom__mobile">
      <ShowroomMap />
    </div>
  </div>
</section>
