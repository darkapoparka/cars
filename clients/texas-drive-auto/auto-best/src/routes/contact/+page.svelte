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
  <title>Contact — {brand.name}</title>
  <meta
    name="description"
    content={`Contact ${brand.name}. Showroom: ${brand.address}. ${brand.appointment}.`}
  />
</svelte:head>

<ContactHero topic={data.topic} vehicle={data.vehicle} />

<section class="dn-contact-section" class:dn-contact-section--general={data.topic.id === 'general'} class:dn-contact-section--topic={data.topic.id !== 'general'} class:dn-contact-section--workflow={data.topic.id === 'trade-in' || data.topic.id === 'import'} id="contact-intent" aria-label="Contact the team">
  <div class="container">
    <ContactIntent vehicle={data.vehicle} topic={data.topic} importUrl={data.importUrl} />

    <div class="dn-contact-location" aria-labelledby="contact-location-title">
      <div class="dn-contact-location__heading">
        <h2 id="contact-location-title">Visit us in {brand.city}</h2>
        <p>{brand.address} · {brand.appointment}</p>
      </div>
      <ShowroomMap />
    </div>
  </div>
</section>
