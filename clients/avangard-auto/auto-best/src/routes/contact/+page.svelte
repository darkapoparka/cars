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
  <title>Контакти — {brand.name}</title>
  <meta
    name="description"
    content={`Свържете се с ${brand.name}. Шоурум: ${brand.address}. ${brand.appointment}.`}
  />
</svelte:head>

<ContactHero topic={data.topic} />

<section class="dn-contact-section" class:dn-contact-section--general={data.topic.id === 'general'} class:dn-contact-section--topic={data.topic.id !== 'general'} class:dn-contact-section--workflow={data.topic.id === 'trade-in' || data.topic.id === 'import'} id="contact-intent" aria-label="Свържете се с екипа">
  <div class="container">
    <ContactIntent topic={data.topic} importUrl={data.importUrl} />

    <div class="dn-contact-location" aria-labelledby="contact-location-title">
      <div class="dn-contact-location__heading">
        <h2 id="contact-location-title">Посетете ни в {brand.city}</h2>
        <p>{brand.address} · {brand.appointment}</p>
      </div>
      <ShowroomMap />
    </div>
  </div>
</section>
