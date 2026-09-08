<script lang="ts">
  import './about.css';
  import { template } from '$config/template';
  import AboutHero from '$components/company/AboutHero.svelte';
  import AboutProcess from '$components/company/AboutProcess.svelte';
  import AboutTeam from '$components/company/AboutTeam.svelte';
  import AboutPartners from '$components/company/AboutPartners.svelte';
  import ShowroomMap from '$components/company/ShowroomMap.svelte';
  import { brand, dealerSource } from '$config/brand';
</script>

<svelte:head>
  <title>За нас — {brand.name}</title>
  <meta name="description" content={`${brand.name} — публикувани автомобили във Варна, адрес и контакт. ${dealerSource.previewNotice}`} />
</svelte:head>

<AboutHero />
<AboutProcess />
{#if template.sections.demoTeam}<AboutTeam />{/if}
{#if template.sections.demoPartners}<AboutPartners />{/if}

<section class="dn-about-showroom dn-section" aria-labelledby="about-showroom-title">
  <div class="container">
    <div class="dn-about-showroom__heading">
      <h2 id="about-showroom-title">Автокъща във {brand.city}</h2>
      <p>{brand.address}. {brand.appointment}</p>
      <p>{dealerSource.business.directions}</p>
    </div>
    <ShowroomMap />
  </div>
</section>
