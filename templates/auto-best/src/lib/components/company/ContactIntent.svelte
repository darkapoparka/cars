<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import type { Vehicle } from '$data/inventory';
  import ContactVehicle from './ContactVehicle.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';
  import { contactPreparation, type ContactTopic } from '$data/company';
  import SocialBrandIcon from './SocialBrandIcon.svelte';
  import VehicleEnquiry from './VehicleEnquiry.svelte';
  import TradeInEnquiry from './TradeInEnquiry.svelte';
  import TradeInInfoDrawer from './TradeInInfoDrawer.svelte';
  import ImportHowItWorks from './ImportHowItWorks.svelte';
  import WorkflowSupport from './WorkflowSupport.svelte';

  let { topic, vehicle = null, importUrl = null }: { topic: ContactTopic; vehicle?: Vehicle | null; importUrl?: string | null } = $props();
  const preparation = $derived(contactPreparation[topic.id]);
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.address)}`;
  const socialPlatforms = [
    { name: 'instagram', label: 'Instagram', href: brand.instagramUrl },
    { name: 'facebook', label: 'Facebook', href: brand.facebookUrl },
    { name: 'youtube', label: 'YouTube', href: brand.youtubeUrl }
  ] as const;
</script>

<div class="dn-contact-intent" class:dn-contact-intent--general={topic.id === 'general'} class:dn-contact-hero-panel={topic.id === 'general'} class:dn-contact-intent--workflow={topic.id === 'trade-in' || topic.id === 'import'} class:dn-contact-intent--tradein={topic.id === 'trade-in'} class:dn-contact-intent--import={topic.id === 'import'}>
  <div class="dn-contact-intent__main">
    {#if topic.id === 'trade-in' || topic.id === 'import'}
      <h1 class="dn-contact-workflow-title">{topic.id === 'trade-in' ? i18n.t("m_cd386206fba4") : i18n.text(topic.title)}</h1>
      {#if topic.id === 'import'}<p class="dn-contact-workflow-hint">{i18n.t("m_4028a7f4ea80")}</p>{/if}
    {/if}
    <div class="dn-contact-intent__heading">
      <h2><span class:dn-contact-mobile-copy={topic.id === 'general'}>{i18n.t("m_d7def4b82f7c")}</span>{#if topic.id === 'general'}<span class="dn-contact-desktop-copy">{i18n.t("m_5c9190347136")}</span>{/if}</h2>
    </div>

    {#if vehicle && topic.id !== 'leasing'}
      <ContactVehicle {vehicle} />
    {/if}
    <div class="dn-contact-selected" class:dn-contact-selected--description-only={topic.id === 'general'}>
      {#if topic.id !== 'general'}
        <h3>{i18n.text(topic.title)}</h3>
      {/if}
      <p>{#if topic.mobileDescription}<span class="dn-contact-description--wide">{i18n.text(topic.description)}</span><span class="dn-contact-description--mobile">{i18n.text(topic.mobileDescription)}</span>{:else}{i18n.text(topic.description)}{/if}</p>
    </div>

    {#if topic.id === 'trade-in'}
      <TradeInEnquiry />
    {:else if topic.id === 'import'}
      {#key topic.id}<VehicleEnquiry kind="import" {importUrl} />{/key}
    {:else if preparation}
      <div class="dn-contact-preparation">
        <h2>{i18n.text(preparation.title)}</h2>
        <ul>
          {#each preparation.items as item (item)}
            <li>{i18n.text(item)}</li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if topic.id !== 'trade-in' && topic.id !== 'import'}
    <a class="dn-contact-button dn-contact-button--call" href={i18n.href(brand.phoneHref)} aria-label={i18n.t("m_772c70f449af", { p0: brand.phone })}>
      <span class="dn-contact-call-icon" aria-hidden="true"><Icon name="phone" size={20} /></span>
      <span class="dn-contact-call-label">{i18n.t("m_cbd2ed38b295")} </span><span class="dn-contact-call-number">{brand.phone}</span>
    </a>


    <div class="dn-contact-social" role="group" aria-label={i18n.t("m_b16446d4331a")}>
      <span>{i18n.t("m_b16446d4331a")}</span>
      <div>
        {#each socialPlatforms.filter(profile => profile.href) as platform (platform.name)}
          <a href={i18n.href(platform.href)} target="_blank" rel="noopener noreferrer" aria-label={platform.label} title={platform.label}>
            <SocialBrandIcon name={platform.name} />
          </a>
        {/each}
      </div>
    </div>
    {/if}
  </div>

  {#if topic.id === 'trade-in' || topic.id === 'import'}
    <WorkflowSupport topic={topic.id} />
  {/if}

  {#if topic.id === 'trade-in'}
    <TradeInInfoDrawer />
  {:else if topic.id === 'import'}
    <ImportHowItWorks />
  {/if}

  {#if topic.id !== 'import' && topic.id !== 'trade-in'}
  <aside class="dn-contact-card" aria-label={i18n.t("m_58f68d16d074")}>
    <div class="dn-contact-card__heading">
      <h2><span class:dn-contact-mobile-copy={topic.id === 'general'}>{i18n.t("m_2b5c3d26721a")}</span>{#if topic.id === 'general'}<span class="dn-contact-desktop-copy">{i18n.t("m_931269cbffaa")}</span>{/if}</h2>
      <p class:dn-contact-mobile-copy={topic.id === 'general'}>{i18n.t("m_bfe8e24333da")}</p>
    </div>

    {#if topic.id === 'general'}
      <div class="dn-contact-visit">
        <p><Icon name="map-pin" size={24} /><span>{i18n.dealer('address')}</span></p>
        <p class="dn-contact-visit__appointment"><Icon name="clock" size={24} /><span>{i18n.t("m_f8452cbad37b", { p0: i18n.dealer('appointment') })}</span></p>
        <a class="dn-contact-button" href={i18n.href(directionsUrl)} target="_blank" rel="noreferrer">{i18n.t("m_c95356784006")}<Icon name="arrow-right" size={20} /></a>
      </div>
    {/if}

    <nav class="dn-contact-card__links" aria-label={i18n.t("m_ab09149748e6")}>
      <a
        class="dn-contact-card__link"
        href={i18n.href(directionsUrl)}
        target="_blank"
        rel="noreferrer"
        aria-label={i18n.t("m_ddaed2048f75", { p0: i18n.dealer('address') })}
      >
        <span class="dn-contact-card__icon"><Icon name="map-pin" size={24} strokeWidth={1.8} /></span>
        <span class="dn-contact-card__copy">
          <strong>{i18n.t("m_56ef8f20955f")}</strong>
          <span>{i18n.dealer('address')}</span>
        </span>
        <span class="dn-contact-card__cue" aria-hidden="true">
          <Icon name="arrow-right" size={20} strokeWidth={1.8} />
          <span role="tooltip">{i18n.t("m_ea488d2693df")}</span>
        </span>
      </a>

      <a
        class="dn-contact-card__link"
        href={i18n.href(brand.phoneHref)}
        aria-label={i18n.t("m_485c367261fb", { p0: i18n.dealer('appointment') })}
      >
        <span class="dn-contact-card__icon"><Icon name="clock" size={24} strokeWidth={1.8} /></span>
        <span class="dn-contact-card__copy">
          <strong>{i18n.t("m_f514c310bd9e")}</strong>
          <span>{i18n.dealer('appointment')}</span>
        </span>
        <span class="dn-contact-card__cue" aria-hidden="true">
          <Icon name="arrow-right" size={20} strokeWidth={1.8} />
          <span role="tooltip">{i18n.t("m_31520a102d84")}</span>
        </span>
      </a>

      <a
        class="dn-contact-card__link dn-contact-card__link--phone"
        href={i18n.href(brand.phoneHref)}
        aria-label={i18n.t("m_772c70f449af", { p0: brand.phone })}
      >
        <span class="dn-contact-card__icon"><Icon name="phone" size={24} strokeWidth={1.8} /></span>
        <span class="dn-contact-card__copy">
          <strong>{i18n.t("m_63dceb8800b2")}</strong>
          <span>{brand.phone}</span>
        </span>
        <span class="dn-contact-card__cue" aria-hidden="true">
          <Icon name="arrow-right" size={20} strokeWidth={1.8} />
          <span role="tooltip">{i18n.t("m_c84a47e46c32")}</span>
        </span>
      </a>
    </nav>

    <div class="dn-contact-card__actions">
      <a class="dn-contact-card__call" href={i18n.href(brand.phoneHref)}>
        <Icon name="phone" size={19} strokeWidth={1.8} />
        {i18n.t("m_5c9190347136")}
      </a>
      <a class="dn-contact-card__route" href={i18n.href(directionsUrl)} target="_blank" rel="noreferrer">
        <Icon name="map-pin" size={19} strokeWidth={1.8} />
        {i18n.t("m_c95356784006")}
      </a>
    </div>
  </aside>
  {/if}
</div>

<style>
  .dn-contact-workflow-hint { display: none; margin: var(--dn-space-2) 0 0; color: var(--dn-muted); font-size: var(--dn-text-meta); line-height: var(--dn-leading-meta); text-align: center; }
  @media (max-width: 767px) { .dn-contact-workflow-hint { display: block; } }
  .dn-contact-intent--workflow { row-gap: 0; }
  .dn-contact-description--mobile { display: none; }
  .dn-contact-desktop-copy, .dn-contact-visit { display: none; }
  .dn-contact-intent--tradein { grid-template-columns: 1fr; width: min(920px, 100%); }
  .dn-contact-intent--tradein .dn-contact-intent__main { position: relative; z-index: 1; width: 100%; }
  .dn-contact-intent--import { grid-template-columns: 1fr; width: min(760px, 100%); }
  .dn-contact-intent--import .dn-contact-intent__main { width: 100%; }

  @media (min-width: 992px) {
    .dn-contact-desktop-copy { display: inline; }
    .dn-contact-mobile-copy { display: none; }
    .dn-contact-intent--general { width: 100%; align-items: stretch; }
    .dn-contact-intent--general .dn-contact-intent__main,
    .dn-contact-intent--general .dn-contact-card { padding: 32px; }
    .dn-contact-intent--general .dn-contact-card__links,
    .dn-contact-intent--general .dn-contact-card__actions { display: none; }
    .dn-contact-visit { display: grid; gap: 18px; margin-top: 24px; }
    .dn-contact-visit p { display: flex; align-items: flex-start; gap: 14px; margin: 0; color: #525a66; font-size: var(--dn-text-body); line-height: var(--dn-leading-body); }
    .dn-contact-visit :global(svg) { flex-shrink: 0; color: var(--dn-red); }
    .dn-contact-visit > a { justify-self: start; gap: 10px; min-height: 52px; background: #eef0f2; color: #202329; }
    .dn-contact-visit > a:hover { background: #e3e6ea; }
    .dn-contact-visit > a:focus-visible { outline: 2px solid #202329; outline-offset: 3px; }
  }
  @media (max-width: 767px) {
    .dn-contact-description--wide { display: none; }
    .dn-contact-description--mobile { display: inline; }
  }

  .dn-contact-preparation { display: none; }

  @media (max-width: 991px) {
    .dn-contact-preparation { display: block; margin-top: 24px; }
    .dn-contact-preparation h2 { margin: 0; font-size: var(--dn-text-lead); font-weight: var(--dn-weight-semibold); line-height: var(--dn-leading-meta); }
    .dn-contact-preparation ul { display: grid; gap: 12px; margin: 14px 0 0; padding-left: 20px; list-style: disc; }
    .dn-contact-preparation li { padding-left: 4px; color: #525a66; font-size: var(--dn-text-body); line-height: var(--dn-leading-body); }
    .dn-contact-preparation li::marker { color: var(--dn-red); }
  }

</style>
