<script lang="ts">
  import './contact.css';
  import ContactHero from '$components/company/ContactHero.svelte';
  import ContactIntent from '$components/company/ContactIntent.svelte';
  import ShowroomMap from '$components/company/ShowroomMap.svelte';
  import { brand } from '$config/brand';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.topic.id === 'import' ? `Внос по заявка — ${brand.name}` : `Контакти — ${brand.name}`}</title>
  <meta
    name="description"
    content={data.topic.id === 'import'
      ? `Внос по заявка с ${brand.name}. Изпратете обява или задайте модел, година и бюджет.`
      : `Свържете се с ${brand.name}. Шоурум: ${brand.address}. ${brand.appointment}.`}
  />
</svelte:head>

<ContactHero topic={data.topic} vehicle={data.vehicle} financeSelection={data.financeSelection} />

<section class="dn-contact-section" class:dn-contact-section--general={data.topic.id === 'general'} class:dn-contact-section--topic={data.topic.id !== 'general'} class:dn-contact-section--workflow={data.topic.id === 'trade-in' || data.topic.id === 'import'} class:dn-contact-section--import={data.topic.id === 'import'} id="contact-intent" aria-label="Свържете се с екипа">
  <div class="container">
    <ContactIntent vehicle={data.vehicle} topic={data.topic} importUrl={data.importUrl} />

    {#if data.topic.id === 'general'}
      <div class="dn-contact-location dn-contact-location--general" aria-labelledby="contact-location-title">
        <div class="dn-contact-location__card">
          <div class="dn-contact-location__heading">
            <h2 id="contact-location-title">Посетете ни в {brand.city}</h2>
            <p>{brand.address} · {brand.appointment}</p>
          </div>
          <ShowroomMap />
        </div>
      </div>
    {:else if data.topic.id !== 'import' && data.topic.id !== 'trade-in'}
      <div class="dn-contact-location" aria-labelledby="contact-location-title">
        <div class="dn-contact-location__heading">
          <h2 id="contact-location-title">Посетете ни в {brand.city}</h2>
          <p>{brand.address} · {brand.appointment}</p>
        </div>
        <ShowroomMap />
      </div>
    {/if}
  </div>
</section>
