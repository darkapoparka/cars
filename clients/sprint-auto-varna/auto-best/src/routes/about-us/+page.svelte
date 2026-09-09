<script lang="ts">
  import './about.css';
  import { template } from '$config/template';
  import AboutHero from '$components/company/AboutHero.svelte';
  import AboutProcess from '$components/company/AboutProcess.svelte';
  import AboutTeam from '$components/company/AboutTeam.svelte';
  import AboutPartners from '$components/company/AboutPartners.svelte';
  import ShowroomMap from '$components/company/ShowroomMap.svelte';
  import { brand } from '$config/brand';
</script>

<svelte:head>
  <title>За нас — {brand.name}</title>
  <meta name="description" content={`${brand.name} — публикувани автомобилни обяви, контакт и информация за посещение в ${brand.city}.`} />
</svelte:head>

<AboutHero />
<AboutProcess />
{#if template.sections.demoTeam}<AboutTeam />{/if}
{#if template.sections.demoPartners}<AboutPartners />{/if}

<section class="dn-about-showroom dn-section" aria-labelledby="about-showroom-title">
  <div class="container">
    <div class="dn-about-showroom__heading">
      <h2 id="about-showroom-title">Адрес в {brand.city}</h2>
      <p>{brand.address}. {brand.appointment}.</p>
    </div>
    <ShowroomMap />
  </div>
</section>
