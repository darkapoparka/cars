<script lang="ts">


  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import type { Vehicle } from '$data/inventory';
  import ContactVehicle from './ContactVehicle.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import HeroVehicles from '$components/ui/HeroVehicles.svelte';
  import type { ContactTopic } from '$data/company';

  let { topic, vehicle = null }: { topic: ContactTopic; vehicle?: Vehicle | null } = $props();
  const heroDescriptions = $derived({
    general: i18n.t("m_46b43b69d985", { p0: i18n.dealer('city') }),
    inspection: i18n.t("m_2f96cf230044"),
    import: i18n.t("m_235089e39df4"),
    leasing: i18n.t("m_b420bfd268bc"),
    'trade-in': i18n.t("m_004fc05158c5")
  });
</script>

<section class="dn-contact-hero dn-route-hero" class:dn-route-hero--studio={topic.id !== 'general'} class:dn-route-hero--charcoal={topic.id === 'general'} class:dn-contact-hero--vehicle={topic.id === 'leasing' && !!vehicle} class:dn-contact-hero--general={topic.id === 'general'} class:dn-contact-hero--workflow={topic.id === 'trade-in' || topic.id === 'import'} class:dn-contact-hero--import={topic.id === 'import'} aria-labelledby="contact-title">
  <HeroVehicles pair="contact" mobile={topic.id === 'trade-in' || topic.id === 'import'} mobileScene={topic.id === 'trade-in' ? 'sell' : topic.id === 'import' ? 'import' : 'car'} />
  <div class="container dn-contact-hero__content dn-route-hero__layout">
    <div class="dn-contact-hero__copy dn-route-hero__copy">
      <h1 id="contact-title"><span class="dn-contact-hero__desktop-title">{topic.id === 'general' ? i18n.t("m_d7def4b82f7c") : topic.id === 'trade-in' ? i18n.t("m_3d25686c3130") : i18n.text(topic.title)}</span><span class="dn-contact-hero__mobile-title">{topic.id === 'general' ? i18n.t("m_2b5c3d26721a") : topic.id === 'trade-in' ? i18n.t("m_3d25686c3130") : i18n.text(topic.title)}</span></h1>
      <p class="dn-contact-hero__lead">{heroDescriptions[topic.id]}</p>
    </div>
    {#if topic.id === 'leasing'}
      {#if vehicle}
        <div class="dn-contact-hero__vehicle dn-route-hero__control">
          <ContactVehicle {vehicle} hero />
        </div>
      {:else}
        <a class="dn-contact-button dn-contact-button--primary dn-contact-hero__action dn-route-hero__control" href={i18n.href(resolve('/listing-grid'))}>
          {i18n.t("m_f92c64344e85")}
          <Icon name="arrow-right" size={24} strokeWidth={1.8} />
        </a>
      {/if}
    {:else}
    <a class="dn-contact-button dn-contact-button--primary dn-contact-hero__action dn-route-hero__control" href="#contact-intent">
      <span class="dn-contact-hero__desktop-title">{topic.id === 'trade-in' ? i18n.t("m_53b20ca29259") : topic.id === 'import' ? i18n.t("m_fb356ab83639") : topic.id === 'general' ? i18n.t("m_73bbca97e1f1") : i18n.t("m_d777d0bdd792")}</span><span class="dn-contact-hero__mobile-title">{i18n.t("m_4b4c7549a9aa")}</span>
      <Icon name="arrow-right" size={24} strokeWidth={1.8} />
    </a>
    {/if}
  </div>
</section>
