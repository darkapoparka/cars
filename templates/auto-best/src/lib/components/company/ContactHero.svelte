<script lang="ts">


  import { getI18n } from '$lib/locale/context';
  const i18n = getI18n();

  import { resolve } from '$app/paths';
  import type { Vehicle } from '$data/inventory';
  import ContactVehicle from './ContactVehicle.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import HeroVehicles from '$components/ui/HeroVehicles.svelte';
  import DesktopHeroScene from '$components/ui/DesktopHeroScene.svelte';
  import { brand } from '$config/brand';
  import DesktopSocialLinks from './DesktopSocialLinks.svelte';
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

<section class="dn-contact-hero dn-route-hero dn-route-hero--studio dn-route-hero--campaign" class:dn-information-hero={topic.id === 'general'} class:dn-route-hero--company={topic.id === 'general'} class:dn-contact-hero--vehicle={topic.id === 'leasing' && !!vehicle} class:dn-contact-hero--general={topic.id === 'general'} class:dn-contact-hero--workflow={topic.id === 'trade-in' || topic.id === 'import'} class:dn-contact-hero--import={topic.id === 'import'} aria-labelledby="contact-title">
  <DesktopHeroScene scene="contact" />
  {#if topic.id === 'trade-in' || topic.id === 'import'}
    <HeroVehicles pair="contact" mobile desktop={false} mobileScene={topic.id === 'trade-in' ? 'sell' : 'import'} />
  {/if}
  <div class="container dn-contact-hero__content dn-route-hero__layout">
    <div class="dn-contact-hero__copy dn-route-hero__copy">
      <h1 id="contact-title"><span class="dn-contact-hero__desktop-title">{topic.id === 'general' ? i18n.t("m_2b5c3d26721a") : topic.id === 'trade-in' ? i18n.t("m_3d25686c3130") : i18n.text(topic.title)}</span><span class="dn-contact-hero__mobile-title">{topic.id === 'general' ? i18n.t("m_2b5c3d26721a") : topic.id === 'trade-in' ? i18n.t("m_3d25686c3130") : i18n.text(topic.title)}</span></h1>
      <p class="dn-contact-hero__lead">{heroDescriptions[topic.id]}</p>
    </div>
    {#if topic.id === 'general'}
      <div class="dn-contact-hero__desktop-actions dn-route-hero__control">
        <a class="dn-contact-button dn-contact-hero__call" href={brand.phoneHref} aria-label={i18n.t('m_772c70f449af', { p0: brand.phone })}>
          <Icon name="phone" size={18} />{brand.phone}
        </a>
        <a class="dn-contact-button dn-contact-hero__visit" href="#contact-intent">
          {i18n.t('m_c95356784006')}<Icon name="chevron-down" size={18} />
        </a>
      </div>
      <DesktopSocialLinks hero onDark />
    {/if}
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
