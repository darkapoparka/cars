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
    general: `${brand.city} · Оглед с предварителна уговорка`,
    inspection: 'Изберете автомобил и уговорете удобен час',
    import: 'Обсъдете автомобил, бюджет и внос с екипа',
    leasing: 'Условия според избрания автомобил',
    'trade-in': 'Получете оценка за своя автомобил'
  };
</script>

<section class="dn-contact-hero dn-route-hero dn-route-hero--studio" class:dn-contact-hero--vehicle={topic.id === 'leasing' && !!vehicle} class:dn-contact-hero--general={topic.id === 'general'} class:dn-contact-hero--workflow={topic.id === 'trade-in' || topic.id === 'import'} aria-labelledby="contact-title">
  <HeroVehicles pair="contact" mobile={topic.id === 'trade-in' || topic.id === 'import'} />
  <picture>
    {#if topic.id === 'trade-in'}
      <source media="(max-width: 991px)" srcset="/assets/images/lead/day-night-sell-banner-v1.webp" />
    {:else if topic.id === 'import'}
      <source media="(max-width: 991px)" srcset="/assets/images/lead/day-night-import-banner-v1.webp" />
    {/if}
  <img
    class="dn-contact-hero__media"
    src="/assets/images/lead/day-night-contact-hero-v2.webp"
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
      <h1 id="contact-title"><span class="dn-contact-hero__desktop-title">{topic.id === 'general' ? 'Свържете се с нас' : topic.id === 'trade-in' ? 'Продажба и бартер' : topic.title}</span><span class="dn-contact-hero__mobile-title">{topic.id === 'general' ? 'Контакти' : topic.id === 'trade-in' ? 'Продажба или бартер' : topic.title}</span></h1>
      <p class="dn-contact-hero__lead">{heroDescriptions[topic.id]}</p>
    </div>
    {#if topic.id === 'leasing'}
      {#if vehicle}
        <div class="dn-contact-hero__vehicle dn-route-hero__control">
          <ContactVehicle {vehicle} hero />
        </div>
      {:else}
        <a class="dn-contact-button dn-contact-button--primary dn-contact-hero__action dn-route-hero__control" href={resolve('/listing-grid')}>
          Изберете автомобил
          <Icon name="arrow-right" size={24} strokeWidth={1.8} />
        </a>
      {/if}
    {:else}
    <a class="dn-contact-button dn-contact-button--primary dn-contact-hero__action dn-route-hero__control" href="#contact-intent">
      <span class="dn-contact-hero__desktop-title">{topic.id === 'trade-in' ? 'Започнете с автомобила' : topic.id === 'import' ? 'Опишете какво търсите' : topic.id === 'general' ? 'Телефон и маршрут' : 'Контакти и следващи стъпки'}</span><span class="dn-contact-hero__mobile-title">Контакти и адрес</span>
      <Icon name="arrow-right" size={24} strokeWidth={1.8} />
    </a>
    {/if}
  </div>
</section>
