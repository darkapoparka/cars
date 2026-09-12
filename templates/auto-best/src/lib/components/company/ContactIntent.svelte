<script lang="ts">
  import type { Vehicle } from '$data/inventory';
  import ContactVehicle from './ContactVehicle.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import { brand } from '$config/brand';
  import { contactPreparation, type ContactTopic } from '$data/company';
  import SocialBrandIcon from './SocialBrandIcon.svelte';
  import ImportEnquiry from './ImportEnquiry.svelte';
  import TradeInEnquiry from './TradeInEnquiry.svelte';
  import TradeInInfoDrawer from './TradeInInfoDrawer.svelte';
  import ImportHowItWorks from './ImportHowItWorks.svelte';

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
      <h1 class="dn-contact-workflow-title">{topic.id === 'trade-in' ? 'Продай или бартер' : topic.title}</h1>
    {/if}
    <div class="dn-contact-intent__heading">
      <h2><span class:dn-contact-mobile-copy={topic.id === 'general'}>Свържете се с екипа</span>{#if topic.id === 'general'}<span class="dn-contact-desktop-copy">Обадете се на екипа</span>{/if}</h2>
    </div>

    {#if vehicle && topic.id !== 'leasing'}
      <ContactVehicle {vehicle} />
    {/if}
    <div class="dn-contact-selected">
      {#if topic.id !== 'general'}
        <h3>{topic.title}</h3>
      {/if}
      <p>{#if topic.mobileDescription}<span class="dn-contact-description--wide">{topic.description}</span><span class="dn-contact-description--mobile">{topic.mobileDescription}</span>{:else}{topic.description}{/if}</p>
    </div>

    {#if topic.id === 'trade-in'}
      <TradeInEnquiry />
    {:else if topic.id === 'import'}
      {#key topic.id}<ImportEnquiry {importUrl} />{/key}
    {:else if preparation}
      <div class="dn-contact-preparation">
        <h2>{preparation.title}</h2>
        <ul>
          {#each preparation.items as item (item)}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
    {/if}

    {#if topic.id !== 'trade-in' && topic.id !== 'import'}
    <a class="dn-contact-button dn-contact-button--call" href={brand.phoneHref}>
      <span class="dn-contact-call-label">Обадете се · </span>{brand.phone}
    </a>


    <div class="dn-contact-social" role="group" aria-label="Социални мрежи">
      <span>Социални мрежи</span>
      <div>
        {#each socialPlatforms as platform (platform.name)}
          <a href={platform.href} target="_blank" rel="noopener noreferrer" aria-label={platform.label} title={platform.label}>
            <SocialBrandIcon name={platform.name} />
          </a>
        {/each}
      </div>
    </div>
    {/if}
  </div>

  {#if topic.id === 'trade-in'}
    <TradeInInfoDrawer />
  {:else if topic.id === 'import'}
    <ImportHowItWorks />
  {/if}

  {#if topic.id !== 'import' && topic.id !== 'trade-in'}
  <aside class="dn-contact-card" aria-label="Контакти на шоурума">
    <div class="dn-contact-card__heading">
      <h2><span class:dn-contact-mobile-copy={topic.id === 'general'}>Контакти</span>{#if topic.id === 'general'}<span class="dn-contact-desktop-copy">Посетете шоурума</span>{/if}</h2>
      <p class:dn-contact-mobile-copy={topic.id === 'general'}>Изберете адрес, посещение или директно обаждане.</p>
    </div>

    {#if topic.id === 'general'}
      <div class="dn-contact-visit">
        <p><Icon name="map-pin" size={24} /><span>{brand.address}</span></p>
        <p><Icon name="clock" size={24} /><span>{brand.appointment}. Уговорете ден и час по телефона.</span></p>
        <a class="dn-contact-button" href={directionsUrl} target="_blank" rel="noreferrer">Маршрут<Icon name="arrow-right" size={20} /></a>
      </div>
    {/if}

    <nav class="dn-contact-card__links" aria-label="Бързи действия за контакт">
      <a
        class="dn-contact-card__link"
        href={directionsUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Отворете адреса в Google Maps: ${brand.address}`}
      >
        <span class="dn-contact-card__icon"><Icon name="map-pin" size={24} strokeWidth={1.8} /></span>
        <span class="dn-contact-card__copy">
          <strong>Адрес</strong>
          <span>{brand.address}</span>
        </span>
        <span class="dn-contact-card__cue" aria-hidden="true">
          <Icon name="arrow-right" size={20} strokeWidth={1.8} />
          <span role="tooltip">Отвори карта</span>
        </span>
      </a>

      <a
        class="dn-contact-card__link"
        href={brand.phoneHref}
        aria-label={`Обадете се, за да уговорите посещение. ${brand.appointment}`}
      >
        <span class="dn-contact-card__icon"><Icon name="clock" size={24} strokeWidth={1.8} /></span>
        <span class="dn-contact-card__copy">
          <strong>Посещения</strong>
          <span>{brand.appointment}</span>
        </span>
        <span class="dn-contact-card__cue" aria-hidden="true">
          <Icon name="arrow-right" size={20} strokeWidth={1.8} />
          <span role="tooltip">Уговори посещение</span>
        </span>
      </a>

      <a
        class="dn-contact-card__link dn-contact-card__link--phone"
        href={brand.phoneHref}
        aria-label={`Обадете се на ${brand.phone}`}
      >
        <span class="dn-contact-card__icon"><Icon name="phone" size={24} strokeWidth={1.8} /></span>
        <span class="dn-contact-card__copy">
          <strong>Телефон</strong>
          <span>{brand.phone}</span>
        </span>
        <span class="dn-contact-card__cue" aria-hidden="true">
          <Icon name="arrow-right" size={20} strokeWidth={1.8} />
          <span role="tooltip">Позвъни сега</span>
        </span>
      </a>
    </nav>

    <div class="dn-contact-card__actions">
      <a class="dn-contact-card__call" href={brand.phoneHref}>
        <Icon name="phone" size={19} strokeWidth={1.8} />
        Обадете се
      </a>
      <a class="dn-contact-card__route" href={directionsUrl} target="_blank" rel="noreferrer">
        <Icon name="map-pin" size={19} strokeWidth={1.8} />
        Маршрут
      </a>
    </div>
  </aside>
  {/if}
</div>

<style>
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
    .dn-contact-visit p { display: flex; align-items: flex-start; gap: 14px; margin: 0; color: #525a66; font-size: 16px; line-height: 1.5; }
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
    .dn-contact-preparation h2 { margin: 0; font-size: 17px; font-weight: 600; line-height: 1.4; }
    .dn-contact-preparation ul { display: grid; gap: 12px; margin: 14px 0 0; padding-left: 20px; list-style: disc; }
    .dn-contact-preparation li { padding-left: 4px; color: #525a66; font-size: 15px; line-height: 1.5; }
    .dn-contact-preparation li::marker { color: var(--dn-red); }
  }

</style>
