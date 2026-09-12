<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Vehicle } from '$data/inventory';
  import ContactVehicle from './ContactVehicle.svelte';
  import Icon from '$components/ui/Icon.svelte';
  import HeroVehicles from '$components/ui/HeroVehicles.svelte';
  import { brand } from '$config/brand';
  import type { ContactTopic } from '$data/company';

  let { topic, vehicle = null }: { topic: ContactTopic; vehicle?: Vehicle | null } = $props();
  const heroDescriptions = {
    general: `${brand.city} · Ask about viewing appointments`,
    inspection: 'Choose a vehicle and ask about appointment times',
    import: 'Ask about a vehicle, your budget, or import availability',
    leasing: 'No dealer financing or payment plans; buyer-arranged funding is separate',
    'trade-in': 'Ask whether vehicle appraisals are available'
  };
</script>

<section class="dn-contact-hero dn-route-hero dn-route-hero--studio" class:dn-contact-hero--vehicle={topic.id === 'leasing' && !!vehicle} class:dn-contact-hero--general={topic.id === 'general'} class:dn-contact-hero--workflow={topic.id === 'trade-in' || topic.id === 'import'} aria-labelledby="contact-title">
  <HeroVehicles pair="contact" mobile={topic.id === 'trade-in' || topic.id === 'import'} />
  <picture>
    {#if topic.id === 'trade-in'}
      <source media="(max-width: 991px)" srcset="/office.webp" />
    {:else if topic.id === 'import'}
      <source media="(max-width: 991px)" srcset="/office.webp" />
    {/if}
  <img
    class="dn-contact-hero__media"
    src="/office.webp"
    alt=""
    width="1920"
    height="1080"
    fetchpriority="high"
    decoding="async"
  />
  </picture>
  <div class="dn-contact-hero__overlay" aria-hidden="true"></div>
  <div class="container dn-contact-hero__content dn-route-hero__layout">
    <div class="dn-contact-hero__copy dn-route-hero__copy">
      <h1 id="contact-title"><span class="dn-contact-hero__desktop-title">{topic.id === 'general' ? 'Contact us' : topic.id === 'trade-in' ? 'Sale and trade-in questions' : topic.title}</span><span class="dn-contact-hero__mobile-title">{topic.id === 'general' ? 'Contact' : topic.id === 'trade-in' ? 'Sale or trade-in inquiry' : topic.title}</span></h1>
      <p class="dn-contact-hero__lead">{heroDescriptions[topic.id]}</p>
    </div>
    {#if topic.id === 'leasing'}
      {#if vehicle}
        <div class="dn-contact-hero__vehicle dn-route-hero__control">
          <ContactVehicle {vehicle} hero />
        </div>
      {:else}
        <a class="dn-contact-button dn-contact-button--primary dn-contact-hero__action dn-route-hero__control" href={resolve('/listing-grid')}>
          Choose a vehicle
          <Icon name="arrow-right" size={24} strokeWidth={1.8} />
        </a>
      {/if}
    {:else}
    <a class="dn-contact-button dn-contact-button--primary dn-contact-hero__action dn-route-hero__control" href="#contact-intent">
      <span class="dn-contact-hero__desktop-title">{topic.id === 'trade-in' ? 'Start with the vehicle' : topic.id === 'import' ? 'Describe what you’re looking for' : topic.id === 'general' ? 'Phone and directions' : 'Contact and next steps'}</span><span class="dn-contact-hero__mobile-title">Contact and address</span>
      <Icon name="arrow-right" size={24} strokeWidth={1.8} />
    </a>
    {/if}
  </div>
</section>
