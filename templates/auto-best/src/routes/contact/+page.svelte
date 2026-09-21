<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import './contact.css';
  import ContactHero from '$components/company/ContactHero.svelte';
  import ContactIntent from '$components/company/ContactIntent.svelte';
  import ShowroomMap from '$components/company/ShowroomMap.svelte';
  import { brand } from '$config/brand';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.topic.id === 'import' ? i18n.t("m_e41ebceae435", { p0: brand.name }) : i18n.t("m_b74abeb8bb4e", { p0: brand.name })}</title>
  <meta
    name="description"
    content={data.topic.id === 'import'
      ? i18n.t("m_5bdb0ba9ea3d", { p0: brand.name })
      : i18n.t("m_bb3e511783e7", { p0: brand.name, p1: i18n.dealer('address'), p2: i18n.dealer('appointment') })}
  />
</svelte:head>

<ContactHero topic={data.topic} vehicle={data.vehicle} />

<section class="dn-contact-section" class:dn-contact-section--general={data.topic.id === 'general'} class:dn-contact-section--topic={data.topic.id !== 'general'} class:dn-contact-section--workflow={data.topic.id === 'trade-in' || data.topic.id === 'import'} class:dn-contact-section--import={data.topic.id === 'import'} id="contact-intent" aria-label={i18n.t("m_d7def4b82f7c")}>
  <div class="container">
    <ContactIntent vehicle={data.vehicle} topic={data.topic} importUrl={data.importUrl} />

    {#if data.topic.id === 'general'}
      <div class="dn-contact-location dn-contact-location--general" aria-labelledby="contact-location-title">
        <div class="dn-contact-location__card">
          <div class="dn-contact-location__heading">
            <h2 id="contact-location-title">{i18n.t("m_8647c430b400", { p0: i18n.dealer('city') })}</h2>
            <p>{i18n.dealer('address')} · {i18n.dealer('appointment')}</p>
          </div>
          <ShowroomMap />
        </div>
      </div>
    {:else if data.topic.id !== 'import' && data.topic.id !== 'trade-in'}
      <div class="dn-contact-location" aria-labelledby="contact-location-title">
        <div class="dn-contact-location__heading">
          <h2 id="contact-location-title">{i18n.t("m_8647c430b400", { p0: i18n.dealer('city') })}</h2>
          <p>{i18n.dealer('address')} · {i18n.dealer('appointment')}</p>
        </div>
        <ShowroomMap />
      </div>
    {/if}
  </div>
</section>
