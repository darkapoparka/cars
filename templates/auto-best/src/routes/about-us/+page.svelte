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
  import { brand } from '$config/brand';
</script>

<svelte:head>
  <title>{i18n.t("m_147bdce9883d", { p0: brand.name })}</title>
  <meta name="description" content={i18n.t("m_36dad5f20b15", { p0: brand.name, p1: i18n.dealer('city') })} />
</svelte:head>

<AboutHero />
<AboutProcess />
{#if template.sections.demoTeam}<AboutTeam />{/if}
{#if template.sections.demoPartners}<AboutPartners />{/if}

<section class="dn-about-showroom dn-section" aria-label={i18n.t("m_931269cbffaa")}>
  <div class="container">
    <DesktopShowroom id="about-showroom-desktop-title" />
    <div class="dn-about-showroom__card dn-about-showroom__mobile">
      <div class="dn-about-showroom__heading">
        <h2 id="about-showroom-title">{i18n.t("m_931269cbffaa")}</h2>
        <p>{i18n.dealer('address')} · {i18n.dealer('appointment')}</p>
      </div>
      <ShowroomMap />
    </div>
  </div>
</section>
